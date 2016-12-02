#!/bin/bash

set -o pipefail

declare Pkg=travis-build
declare Version=0.1.0

function msg() {
    echo "$Pkg: $*"
}

function err() {
    msg "$*" 1>&2
}

function main () {
    local formula_url=https://raw.githubusercontent.com/atomist/homebrew-tap/master/Formula/rug-cli.rb
    local formula
    formula=$(curl -s -f "$formula_url")
    if [[ $? -ne 0 || ! $formula ]]; then
        err "failed to download homebrew formula $formula_url: $formula"
        return 1
    fi

    local version
    version=$(echo "$formula" | grep -o  '\([0-9]*\.[0-9]*\.[0-9]*\)' | head -n1)
    if [[ $? -ne 0 || ! $version ]]; then
        err "failed to parse brew formula for version: $version"
        err "$formula"
        return 1
    fi
    msg "rug CLI version: $version"

    local rug=$HOME/.atomist/rug-cli-$version/bin/rug
    if [[ ! -x $rug ]]; then
        msg "downloading rug CLI"
        if ! mkdir -p "$HOME/.atomist"; then
            err "failed to make ~/.atomist directory"
            return 1
        fi

        local rug_cli_url=https://atomist.jfrog.io/atomist/libs-release/com/atomist/rug-cli/$version/rug-cli-$version-bin.tar.gz
        local rug_cli_tgz=$HOME/.atomist/rug-cli-$version.tar.gz
        if ! curl -s -f -o "$rug_cli_tgz" "$rug_cli_url"; then
            err "failed to download rug CLI from $rug_cli_url"
            return 1
        fi

        if ! tar -xzf "$rug_cli_tgz" -C "$HOME/.atomist"; then
            err "failed to extract rug CLI archive"
            return 1
        fi
    fi
    rug="$rug -qX"

    msg "running tests"
    $rug test

    msg "installing archive"
    $rug install

    local archive_version project_version cli_yml_url
    archive_version=$(awk -F: '$1 == "version" { print $2 }' .atomist/manifest.yml | sed 's/[^.0-9]//g')
    if [[ $? -ne 0 || ! $archive_version ]]; then
        err "failed to extract archive version from manifest: $archive_version"
        return 1
    fi
    if [[ $TRAVIS_TAG =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        if [[ $archive_version != $TRAVIS_TAG ]]; then
            err "archive version ($archive_version) does not match git tag ($TRAVIS_TAG)"
            return 1
        fi
        project_version=$TRAVIS_TAG
        cli_yml_url=https://atomist.jfrog.io/atomist/rugs-release/cli.yml
    else
        local timestamp
        timestamp=$(date +%Y%m%d%H%M%S)
        if [[ $? -ne 0 || ! $timestamp ]]; then
            err "failed to generate timestamp: $timestamp"
            return 1
        fi
        project_version=$archive_version-$timestamp
        cli_yml_url=https://atomist.jfrog.io/atomist/rugs-dev/cli.yml
    fi
    msg "branch: $TRAVIS_BRANCH"
    msg "archive version: $project_version"
    if ! curl -s -f -o $HOME/.atomist/cli.yml "$cli_yml_url"; then
        err "failed to download $cli_yml_url"
        return 1
    fi

    [[ $TRAVIS_PULL_REQUEST == false ]] || return 0
    if [[ $TRAVIS_BRANCH == master || $TRAVIS_TAG =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        msg "publishing archive"
        if ! $rug publish -a "$project_version"; then
            err "failed to publish archive $project_version"
            return 1
        fi
        if ! git config --global user.email "travis-ci@atomist.com"; then
            err "failed to set git user email"
            return 1
        fi
        if ! git config --global user.name "Travis CI"; then
            err "failed to set git user name"
            return 1
        fi
        local git_tag=$project_version+travis$TRAVIS_BUILD_NUMBER
        if ! git tag "$git_tag" -m "Generated tag from TravisCI build $TRAVIS_BUILD_NUMBER"; then
            err "failed to create git tag: $git_tag"
            return 1
        fi
        if ! git push --quiet --tags "https://$GITHUB_TOKEN@github.com/$TRAVIS_REPO_SLUG" > /dev/null 2>&1; then
            err "failed to push git tags"
            return 1
        fi
    fi
}

main "$@" || exit 1
exit 0
