#!/bin/bash
# Link-Checker: prüft alle URLs, meldet Nicht-200er
BAD=0
while IFS= read -r url; do
  [ -z "$url" ] && continue
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 20 -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' "$url")
  if [ "$code" != "200" ]; then
    echo "BAD $code $url"
    BAD=$((BAD+1))
  fi
done < data/all-source-urls.txt
echo "DONE bad=$BAD"
