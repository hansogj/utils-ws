#!/bin/bash

# Helpers invoked per-package (typically via `pnpm -r exec`).

function version() {
    local package=$(node -e "const p  = require('./package.json'); console.log(p.name); ")
    local current=$(node -e "const p  = require('./package.json'); console.log(p.version); ")
    local published=$(pnpm view $package version --no-workspaces 2>/dev/null &)
    printf "%-50s: [current version: %-10s published version: %-10s] \n" $package "$current," "${published:-Not published}"
}

function gitCommitTagPush() {
    local PN=${PWD##*/}
    local V=$(node -e "const p  = require('./package.json'); console.log(p.version); ")
    local TAG="$PN@$V"
    git commit -a -m "$TAG" --no-verify
    git tag -a $TAG -m "$TAG"
    git push --follow-tags
}

function set-version() {
    pnpm version $1
    gitCommitTagPush
}

"$@"
