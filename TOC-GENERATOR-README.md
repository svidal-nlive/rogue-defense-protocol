# Table of Contents Generator

This directory contains tools to automatically generate a comprehensive table of contents for the rogue-defense-protocol project. This is useful when working with AI coding assistants, as it allows quick navigation to specific functions and classes without having to read through entire files.

## Files

- **`generate-toc.py`** - Python script that parses all TypeScript/JavaScript files and extracts functions, classes, interfaces, types, and other code elements with their line numbers
- **`generate-toc.sh`** - Bash wrapper script for easy execution
- **`TABLE_OF_CONTENTS.md`** - Generated markdown table of contents (human-readable)
- **`TABLE_OF_CONTENTS.json`** - Generated JSON table of contents (machine-readable)
- **`TOC-GENERATOR-README.md`** - This file

## Quick Start

### Generate the Table of Contents

Run either of these commands from the project root:

```bash
# Using the shell wrapper (recommended)
./generate-toc.sh

# Or run the Python script directly
python3 generate-toc.py
```

### View the Generated TOC

```bash
# View in terminal
cat TABLE_OF_CONTENTS.md

# View in VS Code
code TABLE_OF_CONTENTS.md

# Access the JSON version programmatically
cat TABLE_OF_CONTENTS.json | jq .
```

## What Gets Generated

The script generates two files:

### 1. TABLE_OF_CONTENTS.md

A formatted markdown document containing:
- **Quick Navigation** - Links to all files in the project
- **File-by-File Details** - Each file is documented with:
  - All classes and their line numbers
  - All interfaces and their line numbers
  - All types and their line numbers
  - All functions and their line numbers
  - All methods and their line numbers
- **Flat Index** - All code elements grouped by type across the entire project

Example entry:
```
- **GuardianScreen** (component) - [Line 42](components/Screens/GuardianScreen.tsx#L42)
```

### 2. TABLE_OF_CONTENTS.json

A machine-readable JSON file that can be:
- Parsed by scripts for automated navigation
- Integrated with build tools or IDEs
- Used by extensions or custom automation

## Using with AI Assistants

When asking an AI model (Claude, GPT, etc.) for help with code:

1. **Generate the TOC**: Run `./generate-toc.sh`
2. **Share the TOC**: Copy the content of `TABLE_OF_CONTENTS.md` and share it with the AI
3. **Reference specific items**: Instead of pasting large code blocks, use line numbers:
   - "Look at line 42 in GuardianScreen.tsx"
   - "Check the `handleBattleExit` function at line 22 in App.tsx"

This saves tokens, reduces context clutter, and makes assistance more efficient.

## Customization

### Modifying the Parser

To customize what gets extracted, edit `generate-toc.py`:

- **Add file types**: Modify the `extensions` tuple in the `scan_project()` method
- **Change patterns**: Update the regex patterns in `parse_file()` to capture different code structures
- **Adjust filtering**: Modify the directory skip list in `scan_project()` (currently skips: `node_modules`, `dist`, `.git`, `public`)

### Excluding Directories

To exclude additional directories from the scan, modify this line in `generate-toc.py`:

```python
dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.git', 'public']]
```

## Automation

### Add to CI/CD

To regenerate the TOC on every commit, add to your Git pre-commit hook:

```bash
#!/bin/bash
cd apps/stacks/rogue-defense-protocol
./generate-toc.sh
git add TABLE_OF_CONTENTS.md TABLE_OF_CONTENTS.json
```

### Watch Mode

To automatically regenerate the TOC when files change:

```bash
# Using inotify-tools (Linux)
while inotifywait -r -e modify *.ts *.tsx components utils; do
  ./generate-toc.sh
done
```

## Output Example

```markdown
## App.tsx

### Functions

- **navigateTo** (const function) - [Line 18](App.tsx#L18)
- **handleBattleExit** (const function) - [Line 22](App.tsx#L22)
- **handleSummaryClose** (const function) - [Line 30](App.tsx#L30)

### Classes

[No classes found in this file]

### Methods

- **setCurrentScreen** (method) - [Line 19](App.tsx#L19)
- **setShowBattleSummary** (method) - [Line 24](App.tsx#L24)
```

## Troubleshooting

### Script doesn't find any files

- Ensure you're running the script from the project root
- Check that Python 3 is installed: `python3 --version`
- Verify file permissions: `chmod +x generate-toc.py generate-toc.sh`

### Missing code elements

The parser uses regex patterns to find code. Complex or unconventional syntax might not be detected. You can manually edit `TABLE_OF_CONTENTS.md` or improve the regex patterns in the script.

### Slow performance on large projects

The script is reasonably fast, but for very large projects, consider:
- Excluding additional directories
- Running the script during off-hours
- Using the JSON output for faster programmatic access

## Requirements

- Python 3.6+
- Bash 4.0+ (for the shell wrapper)
- No external dependencies required (uses only Python standard library)

## License

This tool is part of the rogue-defense-protocol project and follows the same license.
