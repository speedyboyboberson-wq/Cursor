#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -a "$ROOT"/*.html "$ROOT"/*.svg "$ROOT"/robots.txt "$ROOT"/sitemap.xml "$ROOT"/CNAME "$STAGE"/
cp -a "$ROOT"/css "$ROOT"/js "$ROOT"/images "$STAGE"/
cp -a "$ROOT"/.nojekyll "$STAGE"/ 2>/dev/null || true
DOMAIN="$(tr -d '[:space:]' < "$ROOT/CNAME")"
if [[ -z "${SURGE_TOKEN:-}" ]]; then
  echo "Set SURGE_TOKEN to republish https://$DOMAIN" >&2
  exit 1
fi
tar czf - -C "$STAGE" . | curl -fsS -X PUT "https://surge.surge.sh/$DOMAIN" \
  -u "token:${SURGE_TOKEN}" \
  -H "Content-Type: application/gzip" \
  -H "Accept: application/x-ndjson" \
  --data-binary @-
echo
echo "Published https://$DOMAIN"
