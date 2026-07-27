#!/bin/bash
cd /opt/data/workspace/aniverse
URL=https://aniverse-one-khaki.vercel.app PLAYWRIGHT_BROWSERS_PATH=/opt/data/.playwright npx playwright test --reporter=json
