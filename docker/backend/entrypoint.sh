#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

if [ -f .gitkeep ]; then
  file_count="$(find . -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')"
  if [ "$file_count" = "1" ]; then
    rm -f .gitkeep
  fi
fi

if [ ! -f composer.json ]; then
  file_count="$(find . -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ')"
  if [ "$file_count" = "0" ]; then
    echo "Initializing Symfony 7 project..."
    composer create-project symfony/skeleton:"7.*" /tmp/sesa-symfony --no-interaction
    cp -a /tmp/sesa-symfony/. /var/www/html/
    rm -rf /tmp/sesa-symfony

    echo "Installing API Platform..."
    composer require api --no-interaction

    cat > .env.local <<'EOF'
DATABASE_URL="mysql://sesa:sesa@db:3306/sesa?serverVersion=8.0&charset=utf8mb4"
EOF
  else
    echo "Skipping Symfony init: backend is not empty and composer.json is missing."
  fi
fi

mkdir -p public

if [ ! -f public/index.php ] && [ ! -f composer.json ]; then
  cat > public/index.php <<'EOF'
<?php
echo "Backend not initialized. Empty ./backend and restart this container.";
EOF
fi

mkdir -p var/cache var/log
chown -R www-data:www-data /var/www/html || true

exec apache2-foreground
