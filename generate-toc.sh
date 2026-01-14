#!/bin/bash
# Table of Contents Generator Wrapper
# This script generates and displays a table of contents for the rogue-defense-protocol project

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOC_MD="$SCRIPT_DIR/TABLE_OF_CONTENTS.md"
TOC_JSON="$SCRIPT_DIR/TABLE_OF_CONTENTS.json"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Generating Table of Contents...${NC}"

# Run the Python script
python3 "$SCRIPT_DIR/generate-toc.py"

echo ""
echo -e "${GREEN}✓ Done!${NC}"
echo ""
echo "Generated files:"
echo "  - Markdown: $TOC_MD"
echo "  - JSON: $TOC_JSON"
echo ""
echo "Usage:"
echo "  - View as text: cat TABLE_OF_CONTENTS.md"
echo "  - View in editor: code TABLE_OF_CONTENTS.md"
echo "  - Access JSON programmatically: cat TABLE_OF_CONTENTS.json"
echo ""
echo "Pro tip: Share TABLE_OF_CONTENTS.md with AI assistants for quick code navigation!"
