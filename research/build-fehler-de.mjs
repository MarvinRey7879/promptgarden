import { readFileSync, writeFileSync } from 'node:fs';

const items = JSON.parse(readFileSync('C:/Users/marvi/promptgarden/research/fehler-katalog.json', 'utf8'));

const out = {
  title: 'Fehler-Katalog: wenn der Agent klemmt',
  intro:
    'Häufige Fehlermeldungen und Symptome beim Arbeiten mit Coding-Agenten — durchsuchbar nach dem Text, den du im Terminal siehst. Zu jedem Eintrag: was technisch dahintersteckt, wie du es behebst und wie du es künftig vermeidest. Jede Ursache ist mit der offiziellen Dokumentation belegt.',
  stand: '18.07.2026',
  items,
};

writeFileSync('C:/Users/marvi/promptgarden/site/content/fehler.de.json', JSON.stringify(out, null, 2) + '\n');
console.log('OK', out.items.length, 'Einträge');
