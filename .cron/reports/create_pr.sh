#!/usr/bin/env bash
set -euo pipefail

TOKEN=$(.cron/git_helper.sh extract-token)

# Build JSON payload carefully to avoid parsing issues
read -r -d '' PAYLOAD << 'EOJSON' || true
{
  "title": "feat: add Monochrome Accent style + enhanced gallery search",
  "head": "feat/aniverse-trending-styles-and-search",
  "base": "main",
  "body": "## What\n\nAdded new Monochrome Accent style preset + enhanced gallery search.\n\n### Changes\n1. New style preset: Monochrome Accent (constants.ts)\n2. New Pollinations prompt prefix (create/page.tsx)\n3. Enhanced gallery search: descriptions + styles (gallery/page.tsx)\n\n## Why\nFrom A1 Market Research: Monochrome Accent trending for character art.",
  "maintainer_can_modify": true
}
EOJSON

curl -s -X POST "https://api.github.com/repos/Reinvy/aniverse/pulls" \
  -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
