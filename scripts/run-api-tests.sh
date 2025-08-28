#!/usr/bin/env bash

# Run API tests with detailed output
npx cucumber-js --profile api --format @cucumber/pretty-formatter
