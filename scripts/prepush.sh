#!/usr/bin/env bash

if [[ -z "$CI" ]]; then
  git diff-index --quiet HEAD --
fi
