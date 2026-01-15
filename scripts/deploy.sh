#!/bin/bash
#
# Rogue Defense Protocol - Automated Deployment Script
# Triggers GitHub Actions build, waits for completion, and redeploys
#
# Usage: ./deploy.sh [options]
#   -y, --yes     Non-interactive mode (auto-confirm prompts)
#   -h, --help    Show this help
#

set -e

# Parse arguments
AUTO_CONFIRM=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -y|--yes)
            AUTO_CONFIRM=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "  -y, --yes     Non-interactive mode (auto-confirm prompts)"
            echo "  -h, --help    Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
REPO="svidal-nlive/rogue-defense-protocol"
IMAGE="ghcr.io/${REPO}:latest"
CONTAINER_NAME="rogue-defense-protocol"
MAX_WORKFLOW_WAIT=300  # 5 minutes
MAX_HEALTH_WAIT=60     # 1 minute
POLL_INTERVAL=5

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Report variables
REPORT_FILE="${PROJECT_DIR}/deploy-report.txt"
START_TIME=$(date +%s)
STEPS_PASSED=0
STEPS_FAILED=0
COMMIT_SHA=""

# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------

confirm() {
    local prompt="$1"
    if [[ "$AUTO_CONFIRM" == "true" ]]; then
        echo -e "  ${prompt} (auto-confirmed)"
        return 0
    fi
    read -p "  ${prompt} (y/N) " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

print_header() {
    echo -e "\n${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} ${BOLD}$1${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    STEPS_PASSED=$((STEPS_PASSED + 1))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    STEPS_FAILED=$((STEPS_FAILED + 1))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    while ps -p $pid > /dev/null 2>&1; do
        for i in $(seq 0 9); do
            printf "\r  ${CYAN}${spinstr:$i:1}${NC} $2"
            sleep $delay
        done
    done
    printf "\r"
}

get_elapsed_time() {
    local end_time=$(date +%s)
    local elapsed=$((end_time - START_TIME))
    echo "${elapsed}s"
}

# -----------------------------------------------------------------------------
# Pre-flight Checks
# -----------------------------------------------------------------------------

preflight_checks() {
    print_header "Pre-flight Checks"
    
    # Check for required commands
    local required_cmds=("git" "gh" "docker" "jq")
    for cmd in "${required_cmds[@]}"; do
        if command -v "$cmd" &> /dev/null; then
            print_success "$cmd is available"
        else
            print_error "$cmd is not installed"
            exit 1
        fi
    done
    
    # Check GitHub CLI authentication
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI authenticated"
    else
        print_error "GitHub CLI not authenticated. Run 'gh auth login'"
        exit 1
    fi
    
    # Check we're in a git repository
    if git rev-parse --git-dir &> /dev/null; then
        print_success "Git repository detected"
    else
        print_error "Not in a git repository"
        exit 1
    fi
    
    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "Uncommitted changes detected"
        if ! confirm "Continue anyway?"; then
            exit 1
        fi
    else
        print_success "Working directory clean"
    fi
}

# -----------------------------------------------------------------------------
# Git Operations
# -----------------------------------------------------------------------------

push_changes() {
    print_header "Pushing to Remote"
    
    cd "$PROJECT_DIR"
    
    # Get current branch
    local branch=$(git rev-parse --abbrev-ref HEAD)
    print_info "Current branch: ${BOLD}$branch${NC}"
    
    # Check if there are commits to push
    local ahead=$(git rev-list --count origin/$branch..$branch 2>/dev/null || echo "0")
    
    if [[ "$ahead" -eq 0 ]]; then
        print_warning "No new commits to push"
        
        # Option to force a workflow run with empty commit
        if confirm "Create empty commit to trigger build?"; then
            git commit --allow-empty -m "chore: trigger deployment [$(date '+%Y-%m-%d %H:%M:%S')]"
            print_success "Empty commit created"
        else
            # Use most recent commit SHA for workflow lookup
            COMMIT_SHA=$(git rev-parse --short HEAD)
            print_info "Using existing commit ${BOLD}$COMMIT_SHA${NC} for workflow lookup"
            return 0
        fi
    fi
    
    # Push changes
    print_step "Pushing to origin/$branch..."
    if git push origin "$branch" 2>&1; then
        COMMIT_SHA=$(git rev-parse --short HEAD)
        print_success "Pushed commit ${BOLD}$COMMIT_SHA${NC}"
    else
        print_error "Failed to push changes"
        exit 1
    fi
}

# -----------------------------------------------------------------------------
# GitHub Actions
# -----------------------------------------------------------------------------

wait_for_workflow() {
    print_header "Waiting for GitHub Actions"
    
    local waited=0
    local run_id=""
    local status=""
    local conclusion=""
    local target_sha="${COMMIT_SHA}"
    
    # Get full SHA if we only have short SHA
    if [[ -n "$target_sha" ]]; then
        target_sha=$(git rev-parse HEAD)
    fi
    
    # Wait for workflow to start for our commit
    print_step "Waiting for workflow to start (commit: ${target_sha:0:7})..."
    while [[ $waited -lt 60 ]]; do
        # Look for a workflow run matching our commit
        local run_info=$(gh run list --limit 5 --json databaseId,status,headSha 2>/dev/null)
        
        # Find run matching our SHA
        run_id=$(echo "$run_info" | jq -r --arg sha "$target_sha" '.[] | select(.headSha == $sha) | .databaseId' 2>/dev/null | head -1)
        
        if [[ -n "$run_id" && "$run_id" != "null" ]]; then
            status=$(echo "$run_info" | jq -r --arg id "$run_id" '.[] | select(.databaseId == ($id | tonumber)) | .status' 2>/dev/null)
            break
        fi
        
        printf "\r  ${CYAN}⏳${NC} Waiting for workflow... (${waited}s)"
        sleep 3
        waited=$((waited + 3))
    done
    printf "\r                                                    \r"
    
    if [[ -z "$run_id" || "$run_id" == "null" ]]; then
        print_error "No workflow run detected for commit ${target_sha:0:7} after 60 seconds"
        print_info "Check manually: gh run list"
        exit 1
    fi
    
    print_success "Workflow started (Run ID: ${BOLD}$run_id${NC})"
    
    # Wait for workflow to complete
    print_step "Waiting for workflow to complete..."
    waited=0
    while [[ $waited -lt $MAX_WORKFLOW_WAIT ]]; do
        local run_info=$(gh run view "$run_id" --json status,conclusion 2>/dev/null)
        status=$(echo "$run_info" | jq -r '.status')
        conclusion=$(echo "$run_info" | jq -r '.conclusion')
        
        if [[ "$status" == "completed" ]]; then
            break
        fi
        
        printf "\r  ${CYAN}⏳${NC} Workflow running... (${waited}s / ${MAX_WORKFLOW_WAIT}s max)"
        sleep $POLL_INTERVAL
        waited=$((waited + POLL_INTERVAL))
    done
    echo ""
    
    if [[ "$status" != "completed" ]]; then
        print_error "Workflow timed out after ${MAX_WORKFLOW_WAIT}s"
        print_info "Check status: gh run view $run_id"
        exit 1
    fi
    
    # Check conclusion
    if [[ "$conclusion" == "success" ]]; then
        local duration=$(gh run view "$run_id" --json updatedAt,createdAt --jq '(((.updatedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) | tostring) + "s"' 2>/dev/null || echo "N/A")
        print_success "Workflow completed successfully (Duration: ${BOLD}$duration${NC})"
        WORKFLOW_RUN_ID=$run_id
        WORKFLOW_DURATION=$duration
    else
        print_error "Workflow failed with conclusion: $conclusion"
        print_info "View logs: gh run view $run_id --log"
        exit 1
    fi
}

# -----------------------------------------------------------------------------
# Docker Operations
# -----------------------------------------------------------------------------

verify_image() {
    print_header "Verifying Docker Image"
    
    print_step "Checking image on registry..."
    
    # Get image digest
    local digest=$(docker manifest inspect "$IMAGE" 2>/dev/null | jq -r '.manifests[0].digest' 2>/dev/null || echo "")
    
    if [[ -n "$digest" && "$digest" != "null" ]]; then
        print_success "Image available on registry"
        print_info "Digest: ${digest:0:20}..."
        IMAGE_DIGEST=$digest
    else
        print_error "Image not found on registry: $IMAGE"
        exit 1
    fi
}

pull_image() {
    print_header "Pulling Docker Image"
    
    print_step "Pulling latest image..."
    
    cd "$PROJECT_DIR"
    
    if docker compose pull 2>&1 | while read line; do echo "  $line"; done; then
        print_success "Image pulled successfully"
    else
        print_error "Failed to pull image"
        exit 1
    fi
}

deploy_container() {
    print_header "Deploying Container"
    
    cd "$PROJECT_DIR"
    
    # Get old container info
    local old_image=$(docker inspect "$CONTAINER_NAME" --format '{{.Image}}' 2>/dev/null || echo "none")
    
    print_step "Stopping existing container..."
    docker compose down 2>/dev/null || true
    print_success "Container stopped"
    
    print_step "Starting new container..."
    if docker compose up -d 2>&1 | while read line; do echo "  $line"; done; then
        print_success "Container started"
    else
        print_error "Failed to start container"
        exit 1
    fi
}

wait_for_health() {
    print_header "Health Check"
    
    local waited=0
    local health_status=""
    
    print_step "Waiting for container to become healthy..."
    
    while [[ $waited -lt $MAX_HEALTH_WAIT ]]; do
        health_status=$(docker inspect "$CONTAINER_NAME" --format '{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
        
        case $health_status in
            "healthy")
                print_success "Container is healthy"
                CONTAINER_HEALTH="healthy"
                return 0
                ;;
            "unhealthy")
                print_error "Container is unhealthy"
                print_info "Check logs: docker logs $CONTAINER_NAME"
                CONTAINER_HEALTH="unhealthy"
                return 1
                ;;
            *)
                printf "\r  ${CYAN}⏳${NC} Health status: $health_status (${waited}s / ${MAX_HEALTH_WAIT}s max)"
                ;;
        esac
        
        sleep 2
        ((waited+=2))
    done
    echo ""
    
    print_warning "Health check timed out (status: $health_status)"
    CONTAINER_HEALTH=$health_status
}

# -----------------------------------------------------------------------------
# Report Generation
# -----------------------------------------------------------------------------

generate_report() {
    print_header "Deployment Report"
    
    local end_time=$(date +%s)
    local total_time=$((end_time - START_TIME))
    
    # Get container info
    local container_image=$(docker inspect "$CONTAINER_NAME" --format '{{.Config.Image}}' 2>/dev/null || echo "N/A")
    local container_created=$(docker inspect "$CONTAINER_NAME" --format '{{.Created}}' 2>/dev/null || echo "N/A")
    local container_status=$(docker inspect "$CONTAINER_NAME" --format '{{.State.Status}}' 2>/dev/null || echo "N/A")
    
    # Build report
    local report=""
    report+="╔══════════════════════════════════════════════════════════════╗\n"
    report+="║              DEPLOYMENT REPORT                               ║\n"
    report+="║              $(date '+%Y-%m-%d %H:%M:%S')                            ║\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="║ SUMMARY                                                      ║\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="  Total Time:        ${total_time}s\n"
    report+="  Steps Passed:      ${STEPS_PASSED}\n"
    report+="  Steps Failed:      ${STEPS_FAILED}\n"
    report+="\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="║ GIT                                                          ║\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="  Repository:        ${REPO}\n"
    report+="  Commit:            ${COMMIT_SHA:-N/A}\n"
    report+="  Branch:            $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')\n"
    report+="\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="║ GITHUB ACTIONS                                               ║\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="  Workflow Run ID:   ${WORKFLOW_RUN_ID:-N/A}\n"
    report+="  Workflow Duration: ${WORKFLOW_DURATION:-N/A}\n"
    report+="  Workflow URL:      https://github.com/${REPO}/actions/runs/${WORKFLOW_RUN_ID:-''}\n"
    report+="\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="║ DOCKER                                                       ║\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="  Image:             ${container_image}\n"
    report+="  Image Digest:      ${IMAGE_DIGEST:0:30}...\n"
    report+="  Container:         ${CONTAINER_NAME}\n"
    report+="  Container Status:  ${container_status}\n"
    report+="  Health Status:     ${CONTAINER_HEALTH:-N/A}\n"
    report+="\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="║ SERVICE                                                      ║\n"
    report+="╠══════════════════════════════════════════════════════════════╣\n"
    report+="  URL:               https://rogue-defense.vectorhost.net\n"
    report+="╚══════════════════════════════════════════════════════════════╝\n"
    
    # Print to console
    echo -e "$report"
    
    # Save to file
    echo -e "$report" > "$REPORT_FILE"
    print_info "Report saved to: $REPORT_FILE"
    
    # Final status
    if [[ $STEPS_FAILED -eq 0 ]]; then
        echo -e "\n${GREEN}${BOLD}✓ DEPLOYMENT SUCCESSFUL${NC}\n"
        return 0
    else
        echo -e "\n${RED}${BOLD}✗ DEPLOYMENT COMPLETED WITH ERRORS${NC}\n"
        return 1
    fi
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main() {
    print_header "Rogue Defense Protocol - Deployment"
    print_info "Starting automated deployment at $(date '+%Y-%m-%d %H:%M:%S')"
    
    preflight_checks
    push_changes
    wait_for_workflow
    verify_image
    pull_image
    deploy_container
    wait_for_health
    generate_report
}

# Run main function
main "$@"
