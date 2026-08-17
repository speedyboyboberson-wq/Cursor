#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -a "$ROOT"/*.html "$ROOT"/*.svg "$ROOT"/robots.txt "$ROOT"/sitemap.xml "$ROOT"/harvis.json "$STAGE"/
cp -a "$ROOT"/css "$ROOT"/js "$ROOT"/images "$STAGE"/
cp -a "$ROOT"/.nojekyll "$STAGE"/ 2>/dev/null || true
npx --yes hosting deploy "$STAGE"
