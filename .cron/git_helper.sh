#!/usr/bin/env bash
# ==============================================================================
# AniVerse Git Helper — for cron agents
#
# Extracts GITHUB_TOKEN from the git credential store, clones/pulls the repo,
# creates branches, creates PRs, and squash-merges via the GitHub API.
#
# Dependencies: bash, git, curl, jq (optional but recommended)
# ==============================================================================
set -euo pipefail

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------
REPO_OWNER="Reinvy"
REPO_NAME="aniverse"
REPO_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
WORKDIR="${WORKDIR:-/opt/data/workspace/aniverse}"
API_BASE="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}"

# Colors for human-readable output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# -------------------------------------------------------------------
# Utility: log functions
# -------------------------------------------------------------------
log_info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }
log_step()  { echo -e "${CYAN}[STEP]${NC}  $*"; }

# -------------------------------------------------------------------
# Error handler — captures line number and exit code
# -------------------------------------------------------------------
trap '_err=$?; log_error "Fatal error on line $LINENO (exit $_err)"; exit $_err' ERR

# -------------------------------------------------------------------
# extract_token: Retrieve GITHUB_TOKEN from git credential store
#
# The credential helper is set to "store", which saves credentials to
# ~/.git-credentials in the format:
#   https://USERNAME:PASSWORD@github.com
# We parse the PASSWORD (token) portion.
# -------------------------------------------------------------------
extract_token() {
    local cred_file="${HOME}/.git-credentials"
    local token=""

    if [[ -f "$cred_file" ]]; then
        # Match lines for github.com and extract the password (token)
        token=$(grep -E '^https?://[^:]+:[^@]+@github\.com' "$cred_file" \
                | sed -E 's|^https?://[^:]+:([^@]+)@github\.com$|\1|' \
                | head -1)
    fi

    # Fallback: try querying git credential directly
    if [[ -z "$token" ]]; then
        token=$(echo -e "protocol=https\nhost=github.com" \
                | git credential fill 2>/dev/null \
                | grep -E '^password=' \
                | sed 's/^password=//')
    fi

    # Fallback: check GITHUB_TOKEN environment variable
    if [[ -z "$token" && -n "${GITHUB_TOKEN:-}" ]]; then
        token="$GITHUB_TOKEN"
    fi

    if [[ -z "$token" ]]; then
        log_error "Could not extract GITHUB_TOKEN from credential store, env, or ~/.git-credentials."
        log_error "Ensure the credential helper is configured and credentials are stored."
        exit 1
    fi

    echo "$token"
}

# -------------------------------------------------------------------
# ensure_repo: Clone the repo if missing, or pull latest if present.
# Always uses --ff-only to avoid merge commits.
# -------------------------------------------------------------------
ensure_repo() {
    local workdir="$1"

    if [[ ! -d "$workdir/.git" ]]; then
        log_step "Cloning repository into ${workdir}..."
        mkdir -p "$(dirname "$workdir")"
        git clone "$REPO_URL" "$workdir"
        cd "$workdir"
    else
        log_step "Repository exists at ${workdir}. Fetching latest..."
        cd "$workdir"
        git fetch origin
    fi

    # Always reset to origin/main with fast-forward
    log_step "Checking out main and fast-forwarding..."
    git checkout main
    git pull --ff-only origin main

    log_info "Repo at $(git rev-parse --short HEAD) on branch $(git branch --show-current)"
}

# -------------------------------------------------------------------
# create_branch: Create a feature branch from latest main
#   Args: branch_name
# -------------------------------------------------------------------
create_branch() {
    local branch="$1"

    if [[ -z "$branch" ]]; then
        log_error "create_branch requires a branch name argument."
        exit 1
    fi

    # Validate branch naming convention
    if [[ ! "$branch" =~ ^feat/aniverse- ]]; then
        log_warn "Branch name '${branch}' does not follow convention 'feat/aniverse-{description}'."
        log_warn "Proceeding anyway, but consider renaming."
    fi

    # Check if branch already exists locally or remotely
    if git show-ref --verify --quiet "refs/heads/${branch}"; then
        log_warn "Branch '${branch}' already exists locally. Deleting and recreating..."
        git branch -D "$branch"
    fi
    if git show-ref --verify --quiet "refs/remotes/origin/${branch}"; then
        log_warn "Branch '${branch}' exists on origin. Deleting remote..."
        git push origin --delete "$branch" 2>/dev/null || true
    fi

    git checkout -b "$branch" main
    log_info "Created and switched to branch '${branch}' (based on $(git rev-parse --short main))"
}

# -------------------------------------------------------------------
# create_pr: Create a Pull Request via GitHub API
#   Args: title  [body_file]
#   Reads GITHUB_TOKEN from stdin (piped) or env
# -------------------------------------------------------------------
create_pr() {
    local title="$1"
    local body_file="${2:-}"
    local token="$3"
    local body=""

    if [[ -n "$body_file" && -f "$body_file" ]]; then
        body=$(cat "$body_file")
    else
        body="Automated PR created by cron agent.\n\n## What\n${title}\n\n## Why\nAutomated workflow.\n\n## Testing\nReview changes and run the project."
    fi

    local branch
    branch=$(git branch --show-current)

    log_step "Creating PR: '${title}' from '${branch}' → 'main'..."

    local response
    response=$(curl -s -f -X POST "$API_BASE/pulls" \
        -H "Authorization: token ${token}" \
        -H "Accept: application/vnd.github+json" \
        -H "Content-Type: application/json" \
        -d "$(cat <<EOF
{
  "title": "${title}",
  "head": "${branch}",
  "base": "main",
  "body": "${body}",
  "maintainer_can_modify": true
}
EOF
)") || {
        local exit_code=$?
        log_error "Failed to create PR (curl exit $exit_code)."
        curl -s -X POST "$API_BASE/pulls" \
            -H "Authorization: token ${token}" \
            -H "Accept: application/vnd.github+json" \
            -H "Content-Type: application/json" \
            -d "$(cat <<EOF
{
  "title": "${title}",
  "head": "${branch}",
  "base": "main",
  "body": "${body}"
}
EOF
)" 1>&2
        exit $exit_code
    }

    local pr_number
    pr_number=$(echo "$response" | grep -o '"number":[0-9]*' | head -1 | cut -d: -f2)
    local pr_url
    pr_url=$(echo "$response" | grep -o '"html_url":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [[ -z "$pr_number" ]]; then
        log_error "Could not parse PR number from response. Response:"
        echo "$response" >&2
        exit 1
    fi

    log_info "✅ PR #${pr_number} created: ${pr_url}"
    echo "$pr_number"
}

# -------------------------------------------------------------------
# squash_merge: Squash-merge a PR via GitHub API
#   Args: pr_number  commit_title  [commit_message]
# -------------------------------------------------------------------
squash_merge() {
    local pr_number="$1"
    local commit_title="$2"
    local commit_message="${3:-}"
    local token="$4"

    log_step "Squash-merging PR #${pr_number}..."

    local merge_body
    merge_body=$(cat <<EOF
{
  "commit_title": "${commit_title}",
  "commit_message": "${commit_message}",
  "merge_method": "squash"
}
EOF
)

    local response
    response=$(curl -s -f -X PUT "${API_BASE}/pulls/${pr_number}/merge" \
        -H "Authorization: token ${token}" \
        -H "Accept: application/vnd.github+json" \
        -H "Content-Type: application/json" \
        -d "$merge_body") || {
        local exit_code=$?
        log_error "Squash-merge failed for PR #${pr_number} (curl exit $exit_code)."
        echo "Response: $(curl -s -X PUT "${API_BASE}/pulls/${pr_number}/merge" \
            -H "Authorization: token ${token}" \
            -H "Accept: application/vnd.github+json" \
            -H "Content-Type: application/json" \
            -d "$merge_body")" >&2
        return $exit_code
    }

    local merged
    merged=$(echo "$response" | grep -o '"merged":true' || true)

    if [[ -n "$merged" ]]; then
        log_info "✅ PR #${pr_number} successfully squash-merged."
    else
        log_warn "Merge response did not confirm success. Response:"
        echo "$response" >&2
        return 1
    fi
}

# -------------------------------------------------------------------
# merge_conflict_check: Check if current branch has merge conflicts
#   Returns 0 if no conflicts, 1 if conflicts exist
# -------------------------------------------------------------------
merge_conflict_check() {
    local target_branch="${1:-main}"

    log_step "Checking for merge conflicts with '${target_branch}'..."

    # Fetch latest and try a dry-run merge
    git fetch origin "$target_branch" 2>/dev/null || true

    # Try merging in dry-run mode
    if git merge --no-commit --no-ff "origin/${target_branch}" 2>/dev/null; then
        # Success — no conflicts. Abort the dry-run merge.
        git merge --abort 2>/dev/null || true
        log_info "No merge conflicts with '${target_branch}'."
        return 0
    else
        # Merge failed — conflicts detected
        git merge --abort 2>/dev/null || true
        log_warn "⚠️  Merge conflicts detected with '${target_branch}'."

        # List conflicted files
        local conflicts
        conflicts=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
        if [[ -n "$conflicts" ]]; then
            log_warn "Conflicted files:"
            echo "$conflicts" | while IFS= read -r f; do echo "  - $f"; done
        fi

        return 1
    fi
}

# -------------------------------------------------------------------
# resolve_conflicts: Attempt automatic conflict resolution
#   Uses a strategy of keeping both sides (diff3) — then reports remaining.
# -------------------------------------------------------------------
resolve_conflicts() {
    log_step "Attempting automatic conflict resolution..."

    # For each conflicted file, try to keep both sides where possible
    local conflicted_files
    conflicted_files=$(git diff --name-only --diff-filter=U 2>/dev/null || true)

    if [[ -z "$conflicted_files" ]]; then
        log_info "No conflicted files to resolve."
        return 0
    fi

    # Try to use merge-recursive with ours/theirs depending on context
    # Simpler approach: just report and let the caller handle
    log_warn "Automatic resolution not always possible. Conflicted files:"
    echo "$conflicted_files" | while IFS= read -r f; do echo "  - $f"; done

    # Attempt to resolve using 'theirs' for conflicts on automated branches
    # (the automated branch is assumed correct for cron-triggered changes)
    local resolved_count=0
    local failed_count=0

    while IFS= read -r f; do
        if [[ -n "$f" ]] && git checkout --theirs "$f" 2>/dev/null; then
            git add "$f"
            resolved_count=$((resolved_count + 1))
            log_info "  Resolved '${f}' using theirs strategy."
        else
            failed_count=$((failed_count + 1))
            log_error "  Could not auto-resolve '${f}'."
        fi
    done <<< "$conflicted_files"

    if [[ $failed_count -eq 0 ]]; then
        log_info "All conflicts resolved automatically."
        return 0
    else
        log_warn "${failed_count} file(s) still have conflicts requiring manual resolution."
        return 1
    fi
}

# -------------------------------------------------------------------
# push_branch: Push current branch to origin
# -------------------------------------------------------------------
push_branch() {
    local branch
    branch=$(git branch --show-current)

    log_step "Pushing branch '${branch}' to origin..."
    git push -u origin "$branch" 2>&1 || {
        log_error "Failed to push branch '${branch}'."
        log_error "Try: git fetch origin && git rebase origin/main and resolve conflicts."
        exit 1
    }
    log_info "Branch '${branch}' pushed."
}

# -------------------------------------------------------------------
# cleanup_branch: Delete local and remote branch after merge
# -------------------------------------------------------------------
cleanup_branch() {
    local branch="$1"

    if [[ -z "$branch" ]]; then
        branch=$(git branch --show-current)
    fi

    log_step "Cleaning up branch '${branch}'..."

    # Switch back to main first
    git checkout main 2>/dev/null || true

    # Delete remote
    git push origin --delete "$branch" 2>/dev/null || log_warn "Could not delete remote branch '${branch}' (may not exist)."

    # Delete local
    git branch -D "$branch" 2>/dev/null || log_warn "Could not delete local branch '${branch}'."

    log_info "Cleanup complete."
}

# -------------------------------------------------------------------
# Usage / help
# -------------------------------------------------------------------
usage() {
    cat <<EOF
Usage: $(basename "$0") <command> [args...]

Commands:
  extract-token           Print the GitHub token (for export/verification)
  ensure-repo [workdir]   Clone or pull the repo (default workdir: ${WORKDIR})
  create-branch <name>    Create a feature branch from latest main
  push-branch             Push current branch to origin
  create-pr <title> [body_file]  Create a PR (reads token from stdin or env)
  squash-merge <pr> <title> [msg] Squash-merge a PR (reads token from stdin or env)
  check-conflicts [base]  Check current branch for merge conflicts (default base: main)
  resolve-conflicts       Attempt automatic conflict resolution
  cleanup [branch]        Delete local and remote branch (default: current)

Environment:
  GITHUB_TOKEN            Optional fallback token
  WORKDIR                 Working directory (default: ${WORKDIR})

Examples:
  # Full workflow:
  export GITHUB_TOKEN=\$(./git_helper.sh extract-token)
  ./git_helper.sh ensure-repo
  ./git_helper.sh create-branch feat/aniverse-add-thing
  # ... make changes, git add, git commit ...
  ./git_helper.sh push-branch
  ./git_helper.sh create-pr "Add thing" pr_body.md
  # ... after QA approves ...
  ./git_helper.sh squash-merge 42 "feat: add thing" "Detailed message"
  ./git_helper.sh cleanup
EOF
    exit 0
}

# -------------------------------------------------------------------
# Main dispatch
# -------------------------------------------------------------------
main() {
    local cmd="${1:-help}"
    shift 2>/dev/null || true

    case "$cmd" in
        extract-token)
            extract_token
            ;;
        ensure-repo)
            local workdir="${1:-$WORKDIR}"
            ensure_repo "$workdir"
            ;;
        create-branch)
            create_branch "$1"
            ;;
        push-branch)
            push_branch
            ;;
        create-pr)
            local title="$1"
            local body_file="${2:-}"
            # Read token from stdin if piped, else from extract-token
            local token
            if [[ ! -t 0 ]]; then
                read -r token
            else
                token=$(extract_token)
            fi
            if [[ -z "$token" ]]; then
                log_error "No token available for create-pr."
                exit 1
            fi
            create_pr "$title" "$body_file" "$token"
            ;;
        squash-merge)
            local pr_number="$1"
            local commit_title="$2"
            local commit_message="${3:-}"
            local token
            if [[ ! -t 0 ]]; then
                read -r token
            else
                token=$(extract_token)
            fi
            if [[ -z "$token" ]]; then
                log_error "No token available for squash-merge."
                exit 1
            fi
            squash_merge "$pr_number" "$commit_title" "$commit_message" "$token"
            ;;
        check-conflicts)
            local base="${1:-main}"
            merge_conflict_check "$base"
            ;;
        resolve-conflicts)
            resolve_conflicts
            ;;
        cleanup)
            cleanup_branch "${1:-}"
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            log_error "Unknown command: ${cmd}"
            usage
            ;;
    esac
}

main "$@"
