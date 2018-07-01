#!/bin/bash

set -o errexit -o nounset

if [ -n "${GITHUB_TOKEN+1}" ] # is github token declared?
then
    echo "Use github metadata for build"
    JEKYLL_GITHUB_TOKEN=$GITHUB_TOKEN bundle exec jekyll build
else
    echo "Do not use github metadata for build"
    bundle exec jekyll build
fi