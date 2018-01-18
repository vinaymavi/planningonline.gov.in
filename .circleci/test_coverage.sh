#!/bin/bash

set -e

yarn test --coverage --maxWorkers=2
pwd 
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
