#!/usr/bin/env bash

set -Eeuo pipefail

readonly refresh_url="${ECONOMY_REFRESH_URL:-http://127.0.0.1:5000/api/economy/store}"
readonly lock_file="${ECONOMY_REFRESH_LOCK:-/tmp/global-economy-refresh.lock}"

exec 9>"$lock_file"
if ! flock -n 9; then
  printf '[%s] Refresh skipped because another import is running.\n' "$(date --iso-8601=seconds)"
  exit 0
fi

printf '[%s] Starting economy database refresh.\n' "$(date --iso-8601=seconds)"
curl_args=(
  --fail-with-body
  --silent
  --show-error
  --max-time 1800
  -X POST
)

if [[ -n "${ECONOMY_REFRESH_TOKEN:-}" ]]; then
  curl_args+=(-H "Authorization: Bearer ${ECONOMY_REFRESH_TOKEN}")
fi

curl "${curl_args[@]}" "$refresh_url"
printf '\n[%s] Economy database refresh completed.\n' "$(date --iso-8601=seconds)"
