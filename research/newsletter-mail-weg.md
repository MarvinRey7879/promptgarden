# Newsletter-Mail-Weg für promptgarten.com (Cloudflare Worker + D1, Budget ~0 €)

Stand: 17.07.2026. Alle Quellen live per curl (`-L -A "Mozilla/5.0"`) bzw. über `r.jina.ai` (JS/Cloudflare-Docs-Astro-Seiten) abgerufen. Ausgangslage: `worker/schema.sql` hat bereits `newsletter_signups(email, lang, confirmed)`, `worker/src/index.js` hat bereits `POST /v1/newsletter` (Anmeldung, noch ohne Double-Opt-in-Mail). Worker-Cron existiert noch nicht. Ziel: (a) DOI-Bestätigungsmail pro Anmeldung, (b) 1× wöchentlich Feed-Digest an alle `confirmed=1`-Adressen, vermutlich <500 Empfänger.

---

## 1. MailChannels ↔ Cloudflare Workers

**Status: Die alte kostenlose "kein Account nötig"-Integration ist tot.** Bestätigt über zwei unabhängige Belege:

- `https://docs.mailchannels.com/email-api/sending-email-from-cloudflare-workers` → **HTTP 404** (abgerufen 17.07.2026, per r.jina.ai).
- `https://support.mailchannels.com/hc/en-us/articles/4565898358413-Sending-Email-from-Cloudflare-Workers-using-MailChannels-Send-API` verlangt jetzt **Zendesk-Login** ("Sign in to MailChannels") statt öffentlichem Artikel — die früher frei zugängliche Anleitung ist gated.

Was es **heute** stattdessen gibt (MailChannels "Email API", geprüft über `mailchannels.com/pricing`, abgerufen 17.07.2026):

- **Free-Tier: $0/Monat, bis zu 3.000 E-Mails/Monat, gedeckelt auf 100 E-Mails/Tag, bis zu 3 Domains**, REST-API & SMTP. Aber: **braucht jetzt zwingend einen MailChannels-Account** (`dash.mailchannels.com/signup`) — keine anonyme Nutzung mehr über eine reine `TXT`-Domain-Lockdown-Freigabe wie früher.
- Zitat FAQ: *"Does MailChannels offer a free plan? Yes, we offer a free developer plan that includes 100 emails per day."*
- Domain-Verifikation (SPF `include:relay.mailchannels.net` + Domain-Lockdown-TXT) weiterhin nötig.

**Fazit:** MailChannels ist nicht mehr der reibungslose Zero-Setup-Weg aus 2023/2024. Heute technisch/finanziell nahezu identisch zu Resend/Mailjet (Account + Domain-Verifikation + Free-Tier mit Tages-Cap) — kein Vorteil mehr gegenüber Resend.

Quellen: `https://docs.mailchannels.com/email-api/sending-email-from-cloudflare-workers` (404, 17.07.2026), `https://support.mailchannels.com/hc/en-us/articles/4565898358413-...` (Login-Gate, 17.07.2026), `https://www.mailchannels.com/pricing/` (17.07.2026).

---

## 2. Resend

**Free-Tier (geprüft über `resend.com/pricing`, abgerufen 17.07.2026):**

| | Free |
|---|---|
| Volumen | 3.000 E-Mails/Monat |
| Tages-Cap | 100 E-Mails/Tag |
| Domains | 1 eigene Domain |
| Log-Retention | 30 Tage |
| Rate-Limit | 5 Requests/Sekunde/Team (Standard, erhöhbar) — Quelle: `resend.com/docs/api-reference/introduction#rate-limit` |

**Domain-Verifikation nötig, ja:** SPF (TXT + MX für Bounces) + DKIM (TXT). Beleg: `resend.com/docs/dashboard/domains/introduction`. Ohne verifizierte Domain funktioniert nur `onboarding@resend.dev` — und das **ausschließlich an die eigene Account-E-Mail** (403 bei jedem anderen Empfänger). Beleg (Zitat): *"The `resend.dev` domain is only available for testing purposes and can only send emails to the email address associated with your Resend account."* (`resend.com/docs/knowledge-base/403-error-resend-dev-domain`, 17.07.2026). D.h. für echte Newsletter-Empfänger ist eine verifizierte eigene Domain (oder Subdomain) **Pflicht** — aber trivial, weil promptgarten.com bereits bei Cloudflare liegt (Records selbst per Dashboard/API einfügen, keine Fremd-DNS-Migration nötig).

**API aus Worker: trivial.** Reines `fetch()` mit `POST https://api.resend.com/emails`, `Authorization: Bearer <key>`, JSON-Body `{from, to, subject, html}` — kein SMTP, kein MIME-Building nötig, passt 1:1 in bestehenden `worker/src/index.js`-Stil.

**Haken:** 100/Tag-Cap heißt: ein Wochendigest an ~500 Bestätigte kann nicht in einem Rutsch raus, sondern muss über den Tag/mehrere Tage gestaffelt werden (Cron alle X Minuten, Batches ≤90).

Quellen: `https://resend.com/pricing` (17.07.2026), `https://resend.com/docs/dashboard/domains/introduction` (17.07.2026), `https://resend.com/docs/knowledge-base/403-error-resend-dev-domain` (17.07.2026), `https://resend.com/docs/api-reference/introduction` (17.07.2026).

---

## 3. Cloudflare Email Routing / Email Workers — kann das SENDEN?

Zwei zu unterscheidende Cloudflare-Produkte, Stand 17.07.2026 (`developers.cloudflare.com/email-service/`, "Last updated Jun 9, 2026"):

**a) Klassisches Email Routing** (kostenlos, unlimitiert) — kann eingehende Mails an bereits **verifizierte Zieladressen** weiterleiten/beantworten. Für einen dynamisch wachsenden Newsletter-Verteiler ungeeignet, da jede Zieladresse einzeln manuell bestätigt werden müsste.

**b) NEU: "Cloudflare Email Service" mit `send_email`-Binding — kann jetzt tatsächlich an beliebige Empfänger senden, aber:**

> Zitat (`developers.cloudflare.com/email-service/platform/pricing/`): *"Email Routing is available on both the Workers Free and Workers Paid plans. **Sending to arbitrary recipients requires the Workers Paid plan.** Sending to verified destination addresses in your account is free on all plans."*

| | Workers Free | Workers Paid ($5/Monat) |
|---|---|---|
| Outbound Email Sending | **nicht verfügbar** | 3.000 inklusive/Monat, dann $0,35/1.000 |
| Inbound Email Routing | unlimitiert | unlimitiert |

D.h.: an <500 dynamische Newsletter-Empfänger senden **geht nur mit Workers Paid Plan (5 $/Monat)** — nicht mit reinem Free-Budget. Positiv: Domain-Setup ist danach der bequemste aller geprüften Wege — ein Klick "Onboard Domain" im CF-Dashboard, Cloudflare trägt MX/SPF/DKIM/DMARC selbst in die eigene Zone ein (Beleg: `developers.cloudflare.com/email-service/configuration/domains/`, Schritt-für-Schritt-Anleitung). Zusätzlich: "New accounts start with a conservative daily quota and scale up over time" (`.../platform/limits/`) — auch hier also anfangs ein impliziter Tages-Deckel, nicht dokumentiert als fixe Zahl.

**Fazit:** Technisch die eleganteste Cloudflare-native Lösung, aber **nicht $0** — kostet den Workers-Paid-Sockelbetrag (5 $/Monat), der für alle Worker-Features auf dem Account gilt, nicht nur E-Mail.

Quellen: `https://developers.cloudflare.com/email-service/` (17.07.2026), `https://developers.cloudflare.com/email-service/platform/pricing/` (17.07.2026), `https://developers.cloudflare.com/email-service/platform/limits/` (17.07.2026), `https://developers.cloudflare.com/email-service/configuration/domains/` (17.07.2026), `https://developers.cloudflare.com/email-service/get-started/send-emails/` (17.07.2026).

---

## 4. Brevo / Mailjet / Amazon SES — Alternativen

**Brevo (ex Sendinblue)** — Free-Tier: laut FAQ *"Once we approve your account for sending, you can start sending up to 300 emails per day"* — kein niedriger fixer Monats-Deckel, aber **manuelle Freischaltung durch Brevo nach Signup nötig** (Review-Gate), Domain-Auth (SPF/DKIM) für Zustellbarkeit empfohlen, "Sent with Brevo"-Branding nur auf bezahlten Plänen entfernbar. Quelle: `brevo.com/pricing` (17.07.2026).

**Mailjet** — Free-Tier: **6.000 E-Mails/Monat, gedeckelt auf 200/Tag**, $0/Monat, REST-API. Haken: bei ~500 Empfängern reißt ein Wochendigest an einem Tag den 200er-Cap, muss also ebenfalls gestaffelt werden. Quelle: `mailjet.com/pricing` (17.07.2026).

**Amazon SES** — Free-Tier: *"up to 3,000 message charges free each month for the first 12 months after you start using SES"* — danach kostenpflichtig (aber sehr günstig, ~0,10 $/1.000 Mails; bei unserem Volumen <1 $/Monat, also nicht mehr $0). Größerer Haken: **Sandbox-Mode** — neue Accounts können nur an einzeln vorab verifizierte Adressen senden, bis man "Production Access" beantragt (manueller AWS-Support-Review). Zusätzlich: volles AWS-Konto (Kreditkarte hinterlegen) + IAM-Setup, deutlich mehr Aufwand als eine REST-API mit einem Key. Quellen: `aws.amazon.com/ses/pricing/` (17.07.2026), `docs.aws.amazon.com/ses/latest/dg/request-production-access.html` (17.07.2026, Titel bestätigt Sandbox-Pflicht).

---

## 5. Empfehlung

**Resend.** Begründung:

1. Einzige Option mit **echtem $0-Free-Tier ohne Workers-Paid-Zwang** (anders als Cloudflare Email Service) und **ohne dokumentierten manuellen Freischaltungs-Review vor dem ersten Versand** (anders als Brevo, SES-Sandbox).
2. 3.000 E-Mails/Monat Volumen reicht bei <500 Empfängern komfortabel (Wochendigest an 500 ≈ 2.000/Monat + laufende DOI-Bestätigungen), REST-API passt ohne SMTP-Overhead direkt in den bestehenden `worker/src/index.js`.
3. Die 100/Tag-Grenze ist der einzige echte Kompromiss — lösbar, indem der Worker-Cron den Wochendigest in Batches über den Tag verteilt (z. B. alle 20 Min. ≤90 Empfänger), was ohnehin sauberer Code ist.

Cron Triggers selbst sind auf dem Workers-Free-Plan kostenlos nutzbar (5 Cron Triggers/Account inklusive, Quelle: `developers.cloudflare.com/workers/platform/limits/`), also kein zusätzliches Budget-Problem für den wöchentlichen Versand-Job.

### Schritt-Liste

**Loop kann autonom (kein externer Account nötig):**
- Migration: `newsletter_signups` um `confirm_token TEXT`, `confirmed_at TEXT`, `unsubscribed_at TEXT` erweitern (`worker/schema.sql` + `wrangler d1 execute --remote`).
- `POST /v1/newsletter` erweitern: Token generieren, Bestätigungsmail-Versand-Funktion vorbereiten (Aufruf `fetch("https://api.resend.com/emails", ...)`, Key aus `env.RESEND_API_KEY`).
- Neuen Endpoint `GET /v1/newsletter/confirm?token=` bauen (setzt `confirmed=1`).
- Unsubscribe-Endpoint/Link (DSGVO-Pflicht bei Massenmail).
- Digest-Content-Generator aus bestehendem Feed/RSS-Build wiederverwenden.
- `scheduled()`-Handler + Cron-Trigger-Eintrag in `wrangler.toml` (wöchentlich, batched Versand ≤90/Tages-Fenster).
- `RESEND_API_KEY` als `wrangler secret put` **einspielen**, sobald Marvin den Key liefert (Key selbst holen kann nur Marvin, s.u.).
- Absender-Adresse/Subdomain-Entscheidung (root vs. z. B. `news.promptgarten.com`) — laut Projektregel "bei jeder Entscheidung fragen" **zuerst bei Marvin nachfragen**, nicht selbst annehmen.

**NUR Marvin (Konto-Anlage = explizit Marvin-only laut `loops/IDEEN.md`):**
1. Resend-Account anlegen: `resend.com/signup` (E-Mail + Passwort, keine Kreditkarte nötig für Free-Tier).
2. Im Resend-Dashboard → Domains → Add Domain → `promptgarten.com` oder besser eine Subdomain (z. B. `news.promptgarten.com`, schützt Root-Domain-Reputation) eintragen — Entscheidung Root vs. Subdomain bitte kurz bestätigen.
3. Die von Resend angezeigten 2–3 DNS-Records (SPF-TXT, DKIM-TXT, ggf. MX für Bounces) entweder selbst in Cloudflare-DNS für promptgarten.com eintragen, oder die exakten Werte an den Loop weitergeben, damit der sie einträgt (DNS-Bearbeitung selbst ist kein Konto-Anlegen, kann der Loop übernehmen — nur den Domain-Verifikationsschritt im Resend-Dashboard muss Marvin machen, weil das den Account-Login braucht).
4. API-Key erzeugen (Dashboard → API Keys) und an den Loop übergeben, damit der ihn per `wrangler secret put RESEND_API_KEY` hinterlegt (wie bei den anderen Projekt-Secrets, z. B. OpenAI/fal.ai-Keys).
