#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -a "$ROOT"/*.html "$ROOT"/*.svg "$ROOT"/robots.txt "$ROOT"/sitemap.xml "$STAGE"/
cp -a "$ROOT"/css "$ROOT"/js "$ROOT"/images "$STAGE"/
cp -a "$ROOT"/wrangler.toml "$STAGE"/ 2>/dev/null || true
cd "$STAGE"
npx --yes wrangler@latest deploy --name king-of-gyro --temporary --compatibility-date 2026-08-17
