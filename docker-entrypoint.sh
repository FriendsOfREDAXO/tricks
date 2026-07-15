#!/bin/bash
set -e

bundle install --retry 5 --jobs 20
ruby /site/generate_recent_articles.rb

exec "$@"
