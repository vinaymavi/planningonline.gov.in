#!/bin/bash

set -e

yarn test --coverage --maxWorkers=2
if [ -z $CI_PULL_REQUEST ]; then
  cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
fi
