#!/bin/bash

function npm-upgrade() {
    cd $1
    printf "%0.s#" {1..60}
    printf "\n### \t ws: $1 \n\n"
    npx npm-check-updates --dep peer,prod,dev -i -u
    cd -
}

function list-version() {
    node scripts/versions.js $1
}

function local-dependencies() {

    local DEPS=$(grep @hansogj $1/package.json | grep -v name)
    if [ "$DEPS" != "" ]; then
        echo $1
        echo "    >>" $DEPS
    fi
}

function gitCommitTagPush() {
    git commit -a -m "$1" --no-verify
    git tag -a $1 -m "$1"
    git push --follow-tags
}

function set-version() {
    local PACKAGE=$1
    local V=$2

    if [ "$V" == "" ] || [ "$PACKAGE" == "" ]; then
        echo "Could not bump package with name \"$PACKAGE\" and version number \"$V\""
        exit 0
    fi

    npm version --workspace $PACKAGE $V
    gitCommitTagPush ${PACKAGE/packages\//""}@$V

}

function workspaces() {
    local FN=$1
    for package in packages/*; do $FN $package ${@:2}; done
}

"$@"
