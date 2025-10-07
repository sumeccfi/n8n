#!/usr/bin/env node

// Load the network call blocker first
require('./block-external-calls.js');

// Then load the main n8n application
require('./packages/cli/dist/index.js');