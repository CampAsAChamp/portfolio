#!/bin/bash
# Run lighthouse tests for both desktop and mobile

set -e

echo "======================================"
echo "🖥️  Running Desktop Lighthouse Tests"
echo "======================================"
echo ""

yarn build
lhci autorun --config=.lighthouserc.desktop.json

echo ""
echo "======================================"
echo "📱 Running Mobile Lighthouse Tests"
echo "======================================"
echo ""

# Don't rebuild, just run the tests with mobile config
lhci autorun --config=.lighthouserc.mobile.json --no-lighthouserc

# Copy results to test_results directory
mkdir -p test_results/lighthouse
cp -r .lighthouseci/* test_results/lighthouse/

echo ""
echo "======================================"
echo "📊 Summary of Results"
echo "======================================"
echo ""

node scripts/print-lighthouse-scores.js

