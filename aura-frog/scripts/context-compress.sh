#!/bin/bash
# Context Compression Generator
# Creates token-efficient project context summaries
# Version: 1.0.0

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Directories
OUTPUT_DIR="${1:-.claude/context}"
PROJECT_ROOT="${2:-.}"

usage() {
    echo "Context Compression Generator v1.0.0"
    echo ""
    echo "Usage: $0 [output-dir] [project-root]"
    echo ""
    echo "Generates compressed project context for AI consumption."
    echo "Reduces context size by ~90% while preserving essential info."
    echo ""
    echo "Output files:"
    echo "  summary.toon     - Compressed project summary (~500 tokens)"
    echo "  structure.toon   - Directory structure (~200 tokens)"
    echo "  patterns.toon    - Code patterns detected (~300 tokens)"
    echo "  full-context.md  - Reference file (not loaded into context)"
}

# Detect project type and tech stack
detect_tech_stack() {
    local techs=""

    # Frontend
    [ -f "package.json" ] && grep -q '"react"' package.json 2>/dev/null && techs+="react,"
    [ -f "package.json" ] && grep -q '"next"' package.json 2>/dev/null && techs+="nextjs,"
    [ -f "package.json" ] && grep -q '"vue"' package.json 2>/dev/null && techs+="vue,"
    [ -f "angular.json" ] && techs+="angular,"
    [ -f "app.json" ] && grep -q '"expo"' app.json 2>/dev/null && techs+="react-native,"
    [ -f "pubspec.yaml" ] && techs+="flutter,"

    # Backend
    [ -f "package.json" ] && grep -q '"express"' package.json 2>/dev/null && techs+="express,"
    [ -f "package.json" ] && grep -q '"@nestjs"' package.json 2>/dev/null && techs+="nestjs,"
    [ -f "requirements.txt" ] || [ -f "pyproject.toml" ] && techs+="python,"
    [ -f "go.mod" ] && techs+="go,"
    [ -f "composer.json" ] && grep -q '"laravel"' composer.json 2>/dev/null && techs+="laravel,"

    # Database
    [ -f "prisma/schema.prisma" ] && techs+="prisma,"
    grep -rq "mongoose" --include="*.js" --include="*.ts" . 2>/dev/null && techs+="mongodb,"
    grep -rq "sequelize\|typeorm" --include="*.js" --include="*.ts" . 2>/dev/null && techs+="sql,"

    # Testing
    [ -f "jest.config.js" ] || [ -f "jest.config.ts" ] && techs+="jest,"
    [ -f "cypress.config.js" ] || [ -f "cypress.config.ts" ] && techs+="cypress,"
    [ -f "vitest.config.ts" ] && techs+="vitest,"

    # Remove trailing comma
    echo "${techs%,}"
}

# Count files by type
count_files() {
    local pattern="$1"
    find . -name "$pattern" -type f 2>/dev/null | wc -l | tr -d ' '
}

# Get directory structure (depth 2)
get_structure() {
    find . -maxdepth 2 -type d ! -path '*/\.*' ! -path './node_modules*' ! -path './vendor*' ! -path './.git*' 2>/dev/null | head -50
}

# Detect coding patterns
detect_patterns() {
    local patterns=""

    # Component patterns
    [ -d "src/components" ] && patterns+="component-based,"
    [ -d "src/features" ] && patterns+="feature-sliced,"
    [ -d "src/modules" ] && patterns+="modular,"

    # State patterns
    grep -rq "useContext\|createContext" --include="*.tsx" --include="*.jsx" . 2>/dev/null && patterns+="context-api,"
    grep -rq "zustand\|create\(" --include="*.ts" --include="*.tsx" . 2>/dev/null && patterns+="zustand,"
    [ -d "src/store" ] || [ -d "src/redux" ] && patterns+="redux,"

    # API patterns
    grep -rq "useQuery\|useMutation" --include="*.ts" --include="*.tsx" . 2>/dev/null && patterns+="tanstack-query,"
    grep -rq "createApi\|fetchBaseQuery" --include="*.ts" . 2>/dev/null && patterns+="rtk-query,"

    # Styling
    [ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ] && patterns+="tailwind,"
    grep -rq "styled-components\|emotion" --include="*.ts" --include="*.tsx" . 2>/dev/null && patterns+="css-in-js,"
    [ -d "src/styles" ] || find . -name "*.module.css" -type f | head -1 | grep -q . && patterns+="css-modules,"

    echo "${patterns%,}"
}

# Get key files
get_key_files() {
    local files=""

    # Config files
    [ -f "package.json" ] && files+="package.json,"
    [ -f "tsconfig.json" ] && files+="tsconfig.json,"
    [ -f ".env.example" ] && files+=".env.example,"

    # Entry points
    [ -f "src/index.ts" ] && files+="src/index.ts,"
    [ -f "src/index.tsx" ] && files+="src/index.tsx,"
    [ -f "src/App.tsx" ] && files+="src/App.tsx,"
    [ -f "src/main.ts" ] && files+="src/main.ts,"
    [ -f "app/page.tsx" ] && files+="app/page.tsx,"

    echo "${files%,}"
}

# Generate summary.toon
generate_summary() {
    local project_name=$(basename "$(pwd)")
    local tech_stack=$(detect_tech_stack)
    local patterns=$(detect_patterns)
    local key_files=$(get_key_files)

    # Count files
    local ts_count=$(count_files "*.ts")
    local tsx_count=$(count_files "*.tsx")
    local js_count=$(count_files "*.js")
    local vue_count=$(count_files "*.vue")
    local py_count=$(count_files "*.py")
    local go_count=$(count_files "*.go")
    local php_count=$(count_files "*.php")

    cat << EOF
# Project Context Summary (Compressed)
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Token savings: ~90% vs full context

---

## Project

\`\`\`toon
project:
  name: $project_name
  root: $(pwd)
  tech_stack: $tech_stack
  patterns: $patterns
\`\`\`

---

## File Counts

\`\`\`toon
files{type,count}:
  TypeScript,$ts_count
  TSX,$tsx_count
  JavaScript,$js_count
  Vue,$vue_count
  Python,$py_count
  Go,$go_count
  PHP,$php_count
\`\`\`

---

## Key Files

\`\`\`toon
key_files: $key_files
\`\`\`

---

## Quick Reference

- **For full context:** Read \`full-context.md\`
- **For structure:** Read \`structure.toon\`
- **For patterns:** Read \`patterns.toon\`

EOF
}

# Generate structure.toon
generate_structure() {
    cat << EOF
# Directory Structure (Compressed)
# Depth: 2 levels

\`\`\`toon
structure:
EOF

    # Get unique directories at depth 1
    for dir in $(find . -maxdepth 1 -type d ! -path '.' ! -path './node_modules' ! -path './vendor' ! -path './.git' ! -path './.next' ! -path './dist' ! -path './build' 2>/dev/null | sort); do
        local dirname=$(basename "$dir")
        local subcount=$(find "$dir" -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
        local filecount=$(find "$dir" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d ' ')
        echo "  $dirname/: $((subcount-1)) dirs, $filecount files"
    done

    echo "\`\`\`"
}

# Generate patterns.toon
generate_patterns() {
    local patterns=$(detect_patterns)

    cat << EOF
# Code Patterns (Detected)

\`\`\`toon
patterns: $patterns
\`\`\`

---

## Naming Conventions

\`\`\`toon
conventions{type,pattern,example}:
EOF

    # Detect naming conventions
    [ -n "$(find . -name '*.component.ts' -type f 2>/dev/null | head -1)" ] && echo "  Component,*.component.ts,user.component.ts"
    [ -n "$(find . -name '*.service.ts' -type f 2>/dev/null | head -1)" ] && echo "  Service,*.service.ts,auth.service.ts"
    [ -n "$(find . -name '*.module.ts' -type f 2>/dev/null | head -1)" ] && echo "  Module,*.module.ts,app.module.ts"
    [ -n "$(find . -name '*Controller.php' -type f 2>/dev/null | head -1)" ] && echo "  Controller,*Controller.php,UserController.php"
    [ -n "$(find . -name '*.test.ts' -o -name '*.spec.ts' -type f 2>/dev/null | head -1)" ] && echo "  Test,*.test.ts/*.spec.ts,auth.test.ts"
    [ -n "$(find . -name 'use*.ts' -o -name 'use*.tsx' -type f 2>/dev/null | head -1)" ] && echo "  Hook,use*.ts,useAuth.ts"

    echo "\`\`\`"
}

# Generate full context (reference file)
generate_full_context() {
    cat << EOF
# Full Project Context
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# NOTE: This file is for reference only. Load summary.toon for AI context.

## Project: $(basename "$(pwd)")

### Tech Stack
$(detect_tech_stack | tr ',' '\n' | sed 's/^/- /')

### Directory Structure
\`\`\`
$(tree -L 3 -I 'node_modules|vendor|.git|.next|dist|build|coverage' 2>/dev/null || get_structure)
\`\`\`

### Key Configuration Files

EOF

    # Include key config content
    if [ -f "package.json" ]; then
        echo "#### package.json (dependencies)"
        echo "\`\`\`json"
        jq '{name, version, dependencies, devDependencies}' package.json 2>/dev/null || cat package.json
        echo "\`\`\`"
        echo ""
    fi

    if [ -f "tsconfig.json" ]; then
        echo "#### tsconfig.json"
        echo "\`\`\`json"
        cat tsconfig.json
        echo "\`\`\`"
        echo ""
    fi
}

# Main
main() {
    if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
        usage
        exit 0
    fi

    cd "$PROJECT_ROOT"

    echo -e "${CYAN}Context Compression Generator v1.0.0${NC}"
    echo "======================================="
    echo ""
    echo -e "Project: ${GREEN}$(basename "$(pwd)")${NC}"
    echo -e "Output:  ${BLUE}$OUTPUT_DIR${NC}"
    echo ""

    mkdir -p "$OUTPUT_DIR"

    echo -e "${YELLOW}Generating summary.toon...${NC}"
    generate_summary > "$OUTPUT_DIR/summary.toon"

    echo -e "${YELLOW}Generating structure.toon...${NC}"
    generate_structure > "$OUTPUT_DIR/structure.toon"

    echo -e "${YELLOW}Generating patterns.toon...${NC}"
    generate_patterns > "$OUTPUT_DIR/patterns.toon"

    echo -e "${YELLOW}Generating full-context.md...${NC}"
    generate_full_context > "$OUTPUT_DIR/full-context.md"

    echo ""
    echo -e "${GREEN}Done!${NC}"
    echo ""
    echo "Generated files:"
    for f in "$OUTPUT_DIR"/*; do
        local size=$(wc -c < "$f" | tr -d ' ')
        local tokens=$((size / 4))  # Rough estimate: 4 chars per token
        echo "  - $(basename "$f"): ~$tokens tokens"
    done

    echo ""
    echo -e "${CYAN}Usage:${NC}"
    echo "  Load summary.toon into AI context (~500 tokens)"
    echo "  Reference full-context.md when detailed info needed"
}

main "$@"
