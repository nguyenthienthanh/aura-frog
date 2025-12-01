#!/bin/bash

# Aura Frog Installation Script
# Version: 1.0.0
# Description: Install Aura Frog - A Claude Code plugin for AI-powered development! 🐸✨
# Platform: Claude Code (https://docs.anthropic.com/en/docs/claude-code)
#
# ⚠️  DEPRECATED: This script is for manual installation only.
# ⚠️  The recommended method is now the Claude Code plugin system:
# ⚠️
# ⚠️  In Claude Code terminal, run:
# ⚠️  /plugin marketplace add nguyenthienthanh/aura-frog
# ⚠️  /plugin install aura-frog@aurafrog
# ⚠️
# ⚠️  See: aura-frog/docs/PLUGIN_INSTALLATION.md
#
# This script remains for backwards compatibility and legacy installations.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CCPM_VERSION="1.0.0"
INSTALL_DIR=".claude"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "🐸 Aura Frog Installation v${CCPM_VERSION}"
    echo -e "A Plugin for Claude Code ✨"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        print_error "curl is not installed. Please install curl first."
        exit 1
    fi

    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git first."
        exit 1
    fi

    # Check if jq is installed (optional but recommended)
    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. Some features may not work. Install with: brew install jq"
    fi

    print_success "Prerequisites checked"
}

# Detect project type
detect_project_type() {
    print_info "Detecting project type..."

    local project_type="generic"

    if [ -f "package.json" ]; then
        if grep -q "\"react-native\"" package.json; then
            project_type="react-native"
        elif grep -q "\"next\"" package.json; then
            project_type="nextjs"
        elif grep -q "\"react\"" package.json; then
            project_type="react"
        elif grep -q "\"vue\"" package.json; then
            project_type="vue"
        elif grep -q "\"@angular/core\"" package.json; then
            project_type="angular"
        else
            project_type="nodejs"
        fi
    elif [ -f "composer.json" ] && [ -f "artisan" ]; then
        project_type="laravel"
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        project_type="python"
    elif [ -f "go.mod" ]; then
        project_type="go"
    fi

    echo "$project_type"
}

# Check if Aura Frog is already installed
check_existing_installation() {
    if [ -d "$INSTALL_DIR" ]; then
        print_warning "Aura Frog is already installed in this project"
        read -p "Do you want to reinstall/update? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Installation cancelled"
            exit 0
        fi
        print_info "Backing up existing installation..."
        mv "$INSTALL_DIR" "${INSTALL_DIR}.backup.$(date +%Y%m%d-%H%M%S)"
        print_success "Backup created"
    fi
}

# Install core files
install_core() {
    print_info "Installing core files..."

    # Check if aura-frog directory exists in script directory
    if [ ! -d "$SCRIPT_DIR/aura-frog" ]; then
        print_error "Source aura-frog directory not found at $SCRIPT_DIR/aura-frog"
        print_info "Please run this script from the Aura Frog repository root"
        exit 1
    fi

    # Create .claude directory structure
    mkdir -p "$INSTALL_DIR"

    # Copy core files from aura-frog to .claude
    cp -r "$SCRIPT_DIR/aura-frog/"* "$INSTALL_DIR/"

    print_success "Core files installed"
}

# Install project template
install_template() {
    local project_type="$1"

    print_info "Installing $project_type template..."

    # Create project context directory
    mkdir -p "$INSTALL_DIR/project-contexts/current"

    # Copy template if exists
    if [ -d "$INSTALL_DIR/project-contexts/template" ]; then
        cp -r "$INSTALL_DIR/project-contexts/template/"* "$INSTALL_DIR/project-contexts/current/"
    fi

    print_success "Template installed"
}

# Create configuration files
create_config() {
    print_info "Creating configuration files..."

    # Copy example config if not exists
    if [ ! -f "$INSTALL_DIR/ccpm-config.yaml" ] && [ -f "$INSTALL_DIR/ccpm-config.example.yaml" ]; then
        cp "$INSTALL_DIR/ccpm-config.example.yaml" "$INSTALL_DIR/ccpm-config.yaml"
    fi

    # Copy .envrc template if not exists
    if [ ! -f "$INSTALL_DIR/.envrc" ] && [ -f "$INSTALL_DIR/.envrc.template" ]; then
        cp "$INSTALL_DIR/.envrc.template" "$INSTALL_DIR/.envrc"
    fi

    print_success "Configuration files created"
}

# Set permissions
set_permissions() {
    print_info "Setting permissions..."

    # Make scripts executable
    if [ -d "$INSTALL_DIR/scripts" ]; then
        chmod +x "$INSTALL_DIR/scripts/"*.sh 2>/dev/null || true
    fi

    # Secure .envrc
    if [ -f "$INSTALL_DIR/.envrc" ]; then
        chmod 600 "$INSTALL_DIR/.envrc"
    fi

    print_success "Permissions set"
}

# Update .gitignore
update_gitignore() {
    print_info "Updating .gitignore..."

    local gitignore_entries=(
        "$INSTALL_DIR/.envrc"
        "$INSTALL_DIR/logs/"
        "$INSTALL_DIR/ccpm-config.yaml"
        "$INSTALL_DIR/active-workflow.txt"
    )

    if [ ! -f .gitignore ]; then
        touch .gitignore
    fi

    for entry in "${gitignore_entries[@]}"; do
        if ! grep -q "^$entry" .gitignore; then
            echo "$entry" >> .gitignore
        fi
    done

    print_success ".gitignore updated"
}

# Interactive setup
interactive_setup() {
    echo ""
    print_info "Interactive Setup (optional)"
    echo ""

    # Ask about integrations
    read -p "Enable JIRA integration? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_jira
    fi

    read -p "Enable Figma integration? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_figma
    fi

    read -p "Enable Slack integration? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_slack
    fi
}

# Setup JIRA integration
setup_jira() {
    print_info "Setting up JIRA integration..."

    read -p "JIRA URL (e.g., https://company.atlassian.net): " jira_url
    read -p "JIRA Email: " jira_email
    read -p "JIRA Project Key: " jira_project_key

    # Update .envrc
    if [ -f "$INSTALL_DIR/.envrc" ]; then
        {
            echo ""
            echo "# JIRA Configuration"
            echo "export JIRA_URL=\"$jira_url\""
            echo "export JIRA_EMAIL=\"$jira_email\""
            echo "export JIRA_PROJECT_KEY=\"$jira_project_key\""
            echo "export JIRA_API_TOKEN=\"\""
        } >> "$INSTALL_DIR/.envrc"
    fi

    print_success "JIRA integration configured"
    print_warning "Don't forget to add your JIRA API token to $INSTALL_DIR/.envrc"
}

# Setup Figma integration
setup_figma() {
    print_info "Setting up Figma integration..."

    print_warning "You'll need to generate a Figma access token:"
    print_info "1. Go to https://www.figma.com/developers/api#access-tokens"
    print_info "2. Generate a personal access token"
    print_info "3. Add it to $INSTALL_DIR/.envrc"

    # Update .envrc
    if [ -f "$INSTALL_DIR/.envrc" ]; then
        {
            echo ""
            echo "# Figma Configuration"
            echo "export FIGMA_API_TOKEN=\"\""
        } >> "$INSTALL_DIR/.envrc"
    fi

    print_success "Figma integration ready (token needed)"
}

# Setup Slack integration
setup_slack() {
    print_info "Setting up Slack integration..."

    read -p "Slack Channel ID: " slack_channel

    # Update .envrc
    if [ -f "$INSTALL_DIR/.envrc" ]; then
        {
            echo ""
            echo "# Slack Configuration"
            echo "export SLACK_BOT_TOKEN=\"\""
            echo "export SLACK_CHANNEL_ID=\"$slack_channel\""
        } >> "$INSTALL_DIR/.envrc"
    fi

    print_success "Slack integration configured"
    print_warning "Don't forget to add your Slack bot token to $INSTALL_DIR/.envrc"
}

# Health check
run_health_check() {
    print_info "Running health check..."

    local errors=0

    # Check core files
    if [ ! -f "$INSTALL_DIR/CLAUDE.md" ]; then
        print_error "CLAUDE.md not found"
        ((errors++))
    fi

    if [ ! -d "$INSTALL_DIR/agents" ]; then
        print_error "agents/ directory not found"
        ((errors++))
    fi

    if [ ! -d "$INSTALL_DIR/commands" ]; then
        print_error "commands/ directory not found"
        ((errors++))
    fi

    # Check scripts
    if [ -d "$INSTALL_DIR/scripts" ]; then
        local script_count=$(ls "$INSTALL_DIR/scripts/"*.sh 2>/dev/null | wc -l)
        if [ "$script_count" -eq 0 ]; then
            print_warning "No scripts found in $INSTALL_DIR/scripts/"
        else
            print_success "Found $script_count integration scripts"
        fi
    fi

    # Check configuration
    if [ ! -f "$INSTALL_DIR/ccpm-config.yaml" ]; then
        print_warning "ccpm-config.yaml not found"
    fi

    if [ "$errors" -eq 0 ]; then
        print_success "Health check passed"
        return 0
    else
        print_error "Health check failed with $errors error(s)"
        return 1
    fi
}

# Show next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Aura Frog Installation Complete!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📚 Next Steps:${NC}"
    echo ""
    echo "  1. Configure API tokens:"
    echo "     Edit $INSTALL_DIR/.envrc"
    echo ""
    echo "  2. Load environment variables:"
    echo "     source $INSTALL_DIR/.envrc"
    echo ""
    echo "  3. Start your first workflow:"
    echo "     workflow:start \"Your task description\""
    echo ""
    echo -e "${BLUE}📖 Documentation:${NC}"
    echo "  • Quick Start: $INSTALL_DIR/GET_STARTED.md"
    echo "  • Full Guide: $INSTALL_DIR/README.md"
    echo "  • Integrations: $INSTALL_DIR/docs/INTEGRATION_SETUP_GUIDE.md"
    echo ""
    echo -e "${BLUE}🔧 Useful Commands:${NC}"
    echo "  • agent:list          - List all available agents"
    echo "  • workflow:status     - Check workflow status"
    echo "  • project:init        - Initialize project context"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
    echo ""
}

# Main installation flow
main() {
    print_header

    # Check prerequisites
    check_prerequisites

    # Detect project type
    local project_type=$(detect_project_type)
    print_success "Detected project type: $project_type"

    # Check existing installation
    check_existing_installation

    # Install core files
    install_core

    # Install template
    install_template "$project_type"

    # Create configuration
    create_config

    # Set permissions
    set_permissions

    # Update .gitignore
    update_gitignore

    # Interactive setup (optional)
    read -p "Run interactive setup? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        interactive_setup
    fi

    # Health check
    run_health_check || {
        print_error "Installation completed with warnings"
    }

    # Show next steps
    show_next_steps
}

# Run installation
main "$@"
