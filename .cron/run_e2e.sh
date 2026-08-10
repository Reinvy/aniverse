#!/bin/bash
cd /opt/data/workspace/aniverse
# Playwright browsers live at /opt/data/.playwright (has chromium_headless_shell-1228).
# The ambient PLAYWRIGHT_BROWSERS_PATH=/opt/hermes/.playwright only has the stale
# 1217 build, which makes every browser test fail with "Executable doesn't exist".
URL=https://aniverse-one-khaki.vercel.app PLAYWRIGHT_BROWSERS_PATH=/opt/data/.playwright npx playwright test --reporter=json
