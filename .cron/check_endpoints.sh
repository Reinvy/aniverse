#!/bin/bash
curl -s -o /dev/null -w "%{http_code}" "https://aniverse-one-khaki.vercel.app/api/dashboard/stats" 2>&1
echo ""
curl -s -o /dev/null -w "%{http_code}" "https://aniverse-one-khaki.vercel.app/api/artworks" 2>&1
echo ""
# Check key pages
for page in dashboard create challenges gallery marketplace; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://aniverse-one-khaki.vercel.app/$page" 2>&1)
  echo "$page: $code"
done
