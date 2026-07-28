#!/bin/bash
for page in dashboard dashboard/gallery dashboard/create dashboard/challenges dashboard/marketplace login register; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://aniverse-one-khaki.vercel.app/$page" 2>&1)
  echo "$page: $code"
done
