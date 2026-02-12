#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[1/4] Stopping all running Docker containers..."
running_containers="$(docker ps -q)"
if [ -n "$running_containers" ]; then
  docker stop $running_containers >/dev/null
  echo "Running containers stopped."
else
  echo "No running containers found."
fi

stop_service() {
  service_name="$1"

  if command -v systemctl >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
      sudo systemctl stop "$service_name" >/dev/null 2>&1 || true
    else
      systemctl stop "$service_name" >/dev/null 2>&1 || true
    fi
    return
  fi

  if command -v service >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
      sudo service "$service_name" stop >/dev/null 2>&1 || true
    else
      service "$service_name" stop >/dev/null 2>&1 || true
    fi
  fi
}

echo "[2/4] Stopping local apache2 and mysql..."
stop_service apache2
stop_service mysql
stop_service mariadb

echo "[3/4] Building and starting sesa containers..."
docker compose -f "$root_dir/docker-compose.yml" up -d --build

echo "[4/4] Stack started."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8080"
