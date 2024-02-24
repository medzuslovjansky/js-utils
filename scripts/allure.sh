#!/usr/bin/env bash

if [ -z "$ALLURE_URL" ]; then
  echo "Usage: ALLURE_URL=<url> scripts/allure.sh"
  exit 1
fi

if [ ! -d "allure-results" ]; then
  echo "allure-results directory does not exist"
  exit 1
fi

npm run allure:generate
npx --yes surge --project ./allure-report --domain "$ALLURE_URL"
