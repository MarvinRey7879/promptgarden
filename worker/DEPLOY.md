# promptgarden-api — Deploy-Runbook (sobald CF-Token da)

Token braucht: **Account → Cloudflare Pages:Edit** UND **Account → Workers Scripts:Edit** UND **Account → D1:Edit**.
(Falls Marvins Token nur Pages kann: Pages deployen, Worker-Teil mit zweitem Token.)

```bash
export CLOUDFLARE_API_TOKEN=<token>   # oder aus ~/.tm2-secrets/autopilot.env CF_PAGES_TOKEN
export CLOUDFLARE_ACCOUNT_ID=fed2fe6132791d369cb98d3581c0ffa0

# 1. D1-DB anlegen + ID in wrangler.toml eintragen
cd /c/Users/marvi/promptgarden/worker
npx wrangler d1 create promptgarden-db          # → database_id kopieren → wrangler.toml
npx wrangler d1 execute promptgarden-db --file=schema.sql --remote

# 2. Admin-Key setzen (generieren: openssl rand -hex 24; auch in ~/.tm2-secrets ablegen als PG_ADMIN_KEY)
npx wrangler secret put ADMIN_KEY

# 3. Worker deployen
npx wrangler deploy

# 4. Site deployen
cd ../site && npm run build
npx wrangler pages deploy out --project-name=promptgarden

# 5. ALLOWED_ORIGINS in wrangler.toml um die echte pages.dev-URL ergänzen + redeploy
# 6. Site-Frontend: NEXT_PUBLIC_API_URL auf Worker-URL setzen, BugButton/track umstellen (TODO It. 3)

# Smoke-Tests
curl -s https://promptgarden-api.<subdomain>.workers.dev/v1/health
curl -s -X POST .../v1/bug -H 'Content-Type: application/json' -d '{"message":"test"}'
curl -s .../v1/admin/summary -H "X-Admin-Key: $PG_ADMIN_KEY"
```
