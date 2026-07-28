#!/usr/bin/env python3
"""Create a GitHub PR with proper JSON encoding."""
import json
import os
import sys
import urllib.request
import urllib.error

def main():
    token = sys.stdin.read().strip()
    if not token:
        print("Error: No token provided via stdin", file=sys.stderr)
        sys.exit(1)

    branch = os.popen("git branch --show-current").read().strip()
    body_text = open(".cron/reports/pr-body-blog-20260728.md").read()

    payload = {
        "title": "feat: SEO Blog - 5 Tools AI Anime Terbaik 2026",
        "head": branch,
        "base": "main",
        "body": body_text,
        "maintainer_can_modify": True
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.github.com/repos/Reinvy/aniverse/pulls",
        data=data,
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            pr_number = result["number"]
            pr_url = result["html_url"]
            print(f"✅ PR #{pr_number} created: {pr_url}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
