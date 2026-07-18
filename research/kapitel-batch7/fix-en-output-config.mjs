import { readFileSync, writeFileSync } from 'node:fs';
const p = 'C:/Users/marvi/promptgarden/research/kapitel-batch7/entwurf.en.json';
const a = JSON.parse(readFileSync(p, 'utf8'));
const e = a.find((x) => x.slug === 'output-formate-erzwingen');

const old =
  '"output_config": {\n    "format": {"type": "json_schema"},\n    "schema": {"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "integer"}}, "required": ["name", "age"]}\n  }\n}';
const neu =
  '"output_config": {\n    "format": {\n      "type": "json_schema",\n      "schema": {"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "integer"}}, "required": ["name", "age"]}\n    }\n  }\n}';

if (!e.example.includes(old)) throw new Error('anchor2 not found:\n' + e.example);
e.example = e.example.replace(old, neu);
writeFileSync(p, JSON.stringify(a, null, 2) + '\n');
console.log('OK:', JSON.stringify(e.example));
