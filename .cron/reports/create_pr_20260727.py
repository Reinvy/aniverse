#!/usr/bin/env python3
"""Create a GitHub PR for AniVerse social media content."""
import json
import urllib.request
import urllib.error
import os
import re
import sys

# Get token from ~/.git-credentials
cred_file = os.path.expanduser("~/.git-credentials")
token = None
if os.path.exists(cred_file):
    with open(cred_file) as f:
        for line in f:
            m = re.match(r'^https?://[^:]+:([^@]+)@github\.com', line)
            if m:
                token = m.group(1)
                break

if not token:
    import subprocess
    result = subprocess.run(
        ["git", "credential", "fill"],
        input=b"protocol=https\nhost=github.com\n",
        capture_output=True, text=True,
        cwd="/opt/data/workspace/aniverse"
    )
    for line in result.stdout.split("\n"):
        if line.startswith("password="):
            token = line.split("=", 1)[1]
            break

if not token:
    print("Failed to get GitHub token")
    sys.exit(1)

pr_data = {
    "title": "feat: social media content for July 27, 2026",
    "head": "feat/aniverse-social-20260727",
    "base": "main",
    "body": "## What\nAgent A7 (Social Media Empire) generated daily social media posts.\n\n## Files Added\n- src/data/social/twitter-20260727.ts - 5-tweet thread\n- src/data/social/instagram-20260727.ts - 8-slide carousel caption\n- src/data/social/pinterest-20260727.ts - 8 pins across 2 boards\n- src/data/social/tiktok-20260727.ts - 3 video variants\n\n## How to Test\nRun npx tsc --noEmit to verify TypeScript.\n\n## Posting Schedule (WIB)\nTwitter: 10:05-10:45 | Instagram: 10:00 | Pinterest: 10:00 | TikTok: 11:00/14:00/17:00\n\n## Environment\nNo env vars affected.",
    "maintainer_can_modify": True,
}

req = urllib.request.Request(
    "https://api.github.com/repos/Reinvy/aniverse/pulls",
    data=json.dumps(pr_data).encode(),
    headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req) as resp:
        response_data = json.loads(resp.read())
        print(f"PR #{response_data['number']} created: {response_data['html_url']}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.read().decode()}")
    sys.exit(1)
