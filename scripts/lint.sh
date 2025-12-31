#!/bin/bash

# Lint script with progress indicators
# Usage: ./scripts/lint.sh [--fix]

set -e  # Exit on error

# Color definitions
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
RESET='\033[0m'

FIX_MODE=false

# Check for --fix flag
if [ "$1" = "--fix" ]; then
  FIX_MODE=true
fi

# Stage 1: ESLint
echo ""
echo -e "${BLUE}${BOLD}[1/3] Running ESLint...${RESET}"
if [ "$FIX_MODE" = true ]; then
  eslint "src/**/*.{js,jsx,ts,tsx}" --fix
else
  eslint "src/**/*.{js,jsx,ts,tsx}"
fi

# Stage 2: TypeScript type checking
echo ""
echo -e "${CYAN}${BOLD}[2/3] Running TypeScript type checking...${RESET}"
tsc --noEmit

# Stage 3: Stylelint
echo ""
echo -e "${YELLOW}${BOLD}[3/3] Running Stylelint...${RESET}"
if [ "$FIX_MODE" = true ]; then
  stylelint "src/**/*.css" --fix
else
  stylelint "src/**/*.css"
fi

# Success message
echo ""
echo -e "${GREEN}${BOLD}✓ All linting passed!${RESET}"

