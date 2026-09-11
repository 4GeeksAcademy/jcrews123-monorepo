#!/bin/sh
set -eu

website_pid=""
backoffice_pid=""

ensure_dependencies() {
  app_dir="$1"
  cd "$app_dir"

  expected_hash="$(sha256sum package-lock.json | cut -d " " -f 1)"
  installed_hash="$(cat node_modules/.package-lock.sha256 2>/dev/null || true)"

  if [ "$expected_hash" != "$installed_hash" ]; then
    echo "Dependencies changed for $app_dir; synchronizing node_modules..."
    npm ci
    printf '%s\n' "$expected_hash" > node_modules/.package-lock.sha256
  fi
}

cleanup() {
  trap - INT TERM EXIT
  [ -z "$website_pid" ] || kill "$website_pid" 2>/dev/null || true
  [ -z "$backoffice_pid" ] || kill "$backoffice_pid" 2>/dev/null || true
  wait 2>/dev/null || true
}

trap cleanup INT TERM EXIT

ensure_dependencies /workspace/uis/website
ensure_dependencies /workspace/uis/backoffice

cd /workspace/uis/website
./node_modules/.bin/next dev --hostname 0.0.0.0 --port 3000 --webpack &
website_pid=$!

cd /workspace/uis/backoffice
./node_modules/.bin/next dev --hostname 0.0.0.0 --port 3001 --webpack &
backoffice_pid=$!

wait
