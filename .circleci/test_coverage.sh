#!/bin/bash

set -e

jest --coverage --maxWorkers=2
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
