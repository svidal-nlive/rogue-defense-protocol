#!/usr/bin/env python3
"""
Table of Contents Generator for TypeScript/JavaScript Projects
Generates a comprehensive table of contents with functions, classes, and exports
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple
from datetime import datetime

class CodeParser:
    """Parse TypeScript/JavaScript files and extract functions, classes, and interfaces"""
    
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.files_data = []
        
    def parse_file(self, filepath: str) -> List[Dict]:
        """Parse a single file and extract functions, classes, interfaces, and exports"""
        items = []
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return items
        
        relative_path = os.path.relpath(filepath, self.project_root)
        
        # Patterns for different code elements
        patterns = [
            (r'^\s*export\s+(?:default\s+)?(?:async\s+)?function\s+(\w+)', 'function', 'export function'),
            (r'^\s*(?:export\s+)?(?:async\s+)?function\s+(\w+)', 'function', 'function'),
            (r'^\s*export\s+(?:default\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(', 'function', 'const function'),
            (r'^\s*const\s+(\w+)\s*=\s*(?:async\s*)?\(', 'function', 'const function'),
            (r'^\s*export\s+class\s+(\w+)', 'class', 'class'),
            (r'^\s*class\s+(\w+)', 'class', 'class'),
            (r'^\s*export\s+interface\s+(\w+)', 'interface', 'interface'),
            (r'^\s*interface\s+(\w+)', 'interface', 'interface'),
            (r'^\s*export\s+type\s+(\w+)', 'type', 'type'),
            (r'^\s*type\s+(\w+)', 'type', 'type'),
            (r'^\s*(?:private|protected|public)?\s*(?:static\s+)?(?:async\s+)?(\w+)\s*\(', 'method', 'method'),
        ]
        
        for line_num, line in enumerate(lines, 1):
            for pattern, item_type, label in patterns:
                match = re.search(pattern, line)
                if match:
                    name = match.group(1)
                    # Avoid duplicates and skip common noise
                    if name not in ['if', 'for', 'while', 'switch', 'catch']:
                        items.append({
                            'name': name,
                            'type': item_type,
                            'label': label,
                            'line': line_num,
                            'file': relative_path
                        })
                    break
        
        return items
    
    def scan_project(self) -> None:
        """Scan all source files in the project"""
        extensions = ('.ts', '.tsx', '.js', '.jsx')
        
        for root, dirs, files in os.walk(self.project_root):
            # Skip node_modules and dist
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.git', 'public']]
            
            for file in files:
                if file.endswith(extensions):
                    filepath = os.path.join(root, file)
                    items = self.parse_file(filepath)
                    if items:
                        self.files_data.append({
                            'file': os.path.relpath(filepath, self.project_root),
                            'items': items
                        })
    
    def generate_markdown_toc(self, output_file: str) -> None:
        """Generate a markdown table of contents"""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("# Project Table of Contents\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write("This document provides a quick reference guide to all files, functions, classes, ")
            f.write("interfaces, and types in the project. Use the line numbers to quickly navigate ")
            f.write("to specific code sections when working with AI coding assistants.\n\n")
            f.write("---\n\n")
            
            # Generate table of contents by file
            f.write("## Quick Navigation\n\n")
            
            for file_data in sorted(self.files_data, key=lambda x: x['file']):
                file_path = file_data['file']
                f.write(f"- [{file_path}](#{file_path.replace('/', '-').lower()})\n")
            
            f.write("\n---\n\n")
            
            # Generate detailed sections for each file
            for file_data in sorted(self.files_data, key=lambda x: x['file']):
                file_path = file_data['file']
                items = file_data['items']
                
                # File header
                anchor = file_path.replace('/', '-').lower()
                f.write(f"## {file_path}\n\n")
                
                # Group items by type
                items_by_type = {}
                for item in items:
                    item_type = item['type']
                    if item_type not in items_by_type:
                        items_by_type[item_type] = []
                    items_by_type[item_type].append(item)
                
                # Write items grouped by type
                type_order = ['class', 'interface', 'type', 'function', 'method']
                for item_type in type_order:
                    if item_type in items_by_type:
                        f.write(f"### {item_type.capitalize()}s\n\n")
                        for item in sorted(items_by_type[item_type], key=lambda x: x['line']):
                            f.write(f"- **{item['name']}** ({item['label']}) - [Line {item['line']}]({file_path}#{item['line']})\n")
                        f.write("\n")
            
            # Generate flat index
            f.write("---\n\n")
            f.write("## Flat Index (All Items by Type)\n\n")
            
            # Collect all items
            all_items = []
            for file_data in self.files_data:
                all_items.extend(file_data['items'])
            
            # Group by type
            items_by_type = {}
            for item in all_items:
                item_type = item['type']
                if item_type not in items_by_type:
                    items_by_type[item_type] = []
                items_by_type[item_type].append(item)
            
            # Write flat index
            for item_type in type_order:
                if item_type in items_by_type:
                    items = sorted(items_by_type[item_type], key=lambda x: x['name'])
                    f.write(f"### {item_type.capitalize()}s\n\n")
                    for item in items:
                        f.write(f"- **{item['name']}** - [{item['file']}:{item['line']}]({item['file']}#L{item['line']})\n")
                    f.write("\n")
    
    def generate_json_toc(self, output_file: str) -> None:
        """Generate a JSON table of contents for programmatic access"""
        output = {
            'generated': datetime.now().isoformat(),
            'project_root': self.project_root,
            'files': self.files_data
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2)


def main():
    """Main entry point"""
    project_root = os.path.dirname(os.path.abspath(__file__))
    
    print(f"Scanning project: {project_root}")
    
    parser = CodeParser(project_root)
    parser.scan_project()
    
    print(f"Found {len(parser.files_data)} files with code elements")
    
    # Generate outputs
    markdown_output = os.path.join(project_root, 'TABLE_OF_CONTENTS.md')
    json_output = os.path.join(project_root, 'TABLE_OF_CONTENTS.json')
    
    print(f"Generating {markdown_output}...")
    parser.generate_markdown_toc(markdown_output)
    
    print(f"Generating {json_output}...")
    parser.generate_json_toc(json_output)
    
    print("✓ Table of contents generated successfully!")
    print(f"  - Markdown: {markdown_output}")
    print(f"  - JSON: {json_output}")


if __name__ == '__main__':
    main()
