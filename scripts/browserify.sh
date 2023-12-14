#!/usr/bin/env bash

ENTRY_POINTS=(
  ""
  "transliterate"
)

for entry_point in "${ENTRY_POINTS[@]}"; do
  export ENTRY_POINT=${entry_point}
  rollup -c
done
