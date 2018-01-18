#!/bin/bash

set -e
sudo npm install -g jest
jest --coverage --maxWorkers=2
cat ./coverage/lcov.info | ./node_modules/.bin/coveralls
