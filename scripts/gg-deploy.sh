#!/usr/bin/env bash

set -euo pipefail

usage() {
  echo "Usage: gg-deploy /srv/project-directory [branch]" >&2
  exit 64
}

project_directory="${1:-}"
[[ -n "$project_directory" ]] || usage

case "$project_directory" in
  /srv/*) ;;
  *) echo "Deployment directories must be inside /srv." >&2; exit 64 ;;
esac

[[ -d "$project_directory/.git" ]] || { echo "No Git checkout at $project_directory." >&2; exit 66; }

checkout_owner="$(stat -c '%U' "$project_directory")"
manifest_file="$project_directory/gg-deploy.env"
manifest_branch=""
manifest_compose_file=""
manifest_environment_file=""

if [[ -f "$manifest_file" ]]; then
  while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" == \#* ]] && continue
    [[ "$value" =~ ^[A-Za-z0-9._/-]+$ ]] || { echo "Invalid value in $manifest_file." >&2; exit 65; }
    case "$key" in
      BRANCH) manifest_branch="$value" ;;
      COMPOSE_FILE) manifest_compose_file="$value" ;;
      ENV_FILE) manifest_environment_file="$value" ;;
      *) echo "Unknown key '$key' in $manifest_file." >&2; exit 65 ;;
    esac
  done < "$manifest_file"
fi

branch="${2:-$manifest_branch}"
[[ -n "$branch" ]] || branch="$(sudo -H -u "$checkout_owner" git -C "$project_directory" branch --show-current)"
[[ -n "$branch" ]] || { echo "The checkout has no current branch; pass the branch explicitly." >&2; exit 65; }

git_config=()
[[ -n "${GIT_AUTHORIZATION:-}" ]] && git_config=(-c "http.https://github.com/.extraheader=$GIT_AUTHORIZATION")
sudo -H -u "$checkout_owner" git "${git_config[@]}" -C "$project_directory" fetch origin "$branch"
sudo -H -u "$checkout_owner" git "${git_config[@]}" -C "$project_directory" merge --ff-only "origin/$branch"

[[ -n "$manifest_compose_file" && -n "$manifest_environment_file" ]] || { echo "A complete gg-deploy.env is required." >&2; exit 65; }
[[ -f "$project_directory/$manifest_compose_file" ]] || { echo "Compose file '$manifest_compose_file' does not exist." >&2; exit 66; }

cd "$project_directory"
if [[ -f "$manifest_environment_file" ]]; then
  docker compose --env-file "$manifest_environment_file" -f "$manifest_compose_file" up -d --build
  docker compose --env-file "$manifest_environment_file" -f "$manifest_compose_file" ps
else
  docker compose -f "$manifest_compose_file" up -d --build
  docker compose -f "$manifest_compose_file" ps
fi
