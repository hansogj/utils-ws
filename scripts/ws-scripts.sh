#!/bin/bash

PACKAGES=packages

function version() {
    local package=$(node -e "const p  = require('./package.json'); console.log(p.name); ")
    local current=$(node -e "const p  = require('./package.json'); console.log(p.version); ")
    local published=$(pnpm view $package version --no-workspaces 2>/dev/null &)
    printf "%-50s: [current version: %-10s published version: %-10s] \n" $package "$current," "${published:-Not published}"
}

function local-dependencies() {

    local DEPS=$(grep @hansogj $1/package.json | grep -v name)
    if [ "$DEPS" != "" ]; then
        echo $1
        echo "    >>" $DEPS
    fi
}

function pack() {
    pnpm pack
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
    local PWD=$(pwd)
    pnpm version $1
    gitCommitTagPush
}

function every() {
    cd $PACKAGES
    for name in */; do
        cd $name
        ${@:1}
        cd ../
    done
    cd ../

}

function workspaces() {
    local FN=$1
    for package in $PACKAGES/*; do $FN $package ${@:2}; done
}

"$@"
