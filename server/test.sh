#!/bin/bash
DEBUG=server:* NODE_ENV=test NODE_PATH=. mocha --debug -R list
