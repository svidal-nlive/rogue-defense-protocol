# Rogue Defense Protocol - Makefile
# 
# Usage:
#   make deploy    - Full deployment (push, build, pull, redeploy)
#   make status    - Check current status
#   make logs      - View container logs
#   make pull      - Pull latest image only
#   make restart   - Restart container without rebuild
#   make workflow  - Check GitHub Actions workflow status

.PHONY: deploy status logs pull restart workflow clean help

# Configuration
CONTAINER_NAME := rogue-defense-protocol
IMAGE := ghcr.io/svidal-nlive/rogue-defense-protocol:latest
COMPOSE_FILE := docker-compose.yml

# Colors
GREEN := \033[0;32m
YELLOW := \033[1;33m
CYAN := \033[0;36m
NC := \033[0m

# Default target
.DEFAULT_GOAL := help

## deploy: Full deployment - push, wait for build, pull, and redeploy (auto-confirm)
deploy:
	@echo "$(CYAN)Starting full deployment...$(NC)"
	@chmod +x scripts/deploy.sh
	@./scripts/deploy.sh -y

## deploy-interactive: Full deployment with manual confirmations
deploy-interactive:
	@echo "$(CYAN)Starting interactive deployment...$(NC)"
	@chmod +x scripts/deploy.sh
	@./scripts/deploy.sh

## status: Show current container and image status
status:
	@echo "$(CYAN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(CYAN)║   Container & Image Status             ║$(NC)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Container:$(NC)"
	@docker ps -a --filter name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || true
	@echo ""
	@echo "$(YELLOW)Health Status:$(NC)"
	@docker inspect $(CONTAINER_NAME) --format '{{.State.Health.Status}}' 2>/dev/null || echo "  Container not found"
	@echo ""
	@echo "$(YELLOW)Image:$(NC)"
	@docker images $(IMAGE) --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" || true
	@echo ""
	@echo "$(YELLOW)Latest Workflow Run:$(NC)"
	@gh run list --limit 1 2>/dev/null || echo "  Unable to fetch workflow status"

## logs: View container logs (follow mode)
logs:
	@docker logs -f $(CONTAINER_NAME)

## logs-tail: View last 100 lines of logs
logs-tail:
	@docker logs --tail 100 $(CONTAINER_NAME)

## pull: Pull latest image from registry
pull:
	@echo "$(CYAN)Pulling latest image...$(NC)"
	@docker compose -f $(COMPOSE_FILE) pull
	@echo "$(GREEN)✓ Image pulled$(NC)"

## restart: Restart container with current image
restart:
	@echo "$(CYAN)Restarting container...$(NC)"
	@docker compose -f $(COMPOSE_FILE) restart
	@echo "$(GREEN)✓ Container restarted$(NC)"

## up: Start container
up:
	@echo "$(CYAN)Starting container...$(NC)"
	@docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✓ Container started$(NC)"

## down: Stop container
down:
	@echo "$(CYAN)Stopping container...$(NC)"
	@docker compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)✓ Container stopped$(NC)"

## redeploy: Pull latest and restart (no push/build)
redeploy: pull
	@echo "$(CYAN)Redeploying container...$(NC)"
	@docker compose -f $(COMPOSE_FILE) up -d
	@echo "$(CYAN)Waiting for health check...$(NC)"
	@sleep 15
	@docker ps --filter name=$(CONTAINER_NAME) --format "table {{.Names}}\t{{.Status}}"
	@echo "$(GREEN)✓ Redeploy complete$(NC)"

## workflow: Check latest GitHub Actions workflow status
workflow:
	@echo "$(CYAN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(CYAN)║   GitHub Actions Workflow Status       ║$(NC)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@gh run list --limit 5

## workflow-watch: Watch current workflow run
workflow-watch:
	@gh run watch

## workflow-logs: View logs for latest workflow
workflow-logs:
	@gh run view --log | tail -50

## build-local: Build image locally (for testing)
build-local:
	@echo "$(CYAN)Building image locally...$(NC)"
	@docker build -t $(IMAGE) .
	@echo "$(GREEN)✓ Local build complete$(NC)"

## shell: Open shell in running container
shell:
	@docker exec -it $(CONTAINER_NAME) /bin/sh

## health: Check container health endpoint
health:
	@echo "$(CYAN)Checking health endpoint...$(NC)"
	@docker exec $(CONTAINER_NAME) node -e "require('http').get('http://localhost:3000/health', (r) => { console.log('Status:', r.statusCode); r.on('data', d => console.log(d.toString())); }).on('error', e => console.error('Error:', e.message))"

## clean: Remove stopped containers and unused images
clean:
	@echo "$(CYAN)Cleaning up...$(NC)"
	@docker compose -f $(COMPOSE_FILE) down --remove-orphans 2>/dev/null || true
	@docker image prune -f
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

## git-status: Show git status and remote info
git-status:
	@echo "$(CYAN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(CYAN)║   Git Status                           ║$(NC)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Branch:$(NC)"
	@git branch -v
	@echo ""
	@echo "$(YELLOW)Remote:$(NC)"
	@git remote -v
	@echo ""
	@echo "$(YELLOW)Status:$(NC)"
	@git status --short
	@echo ""
	@echo "$(YELLOW)Recent commits:$(NC)"
	@git log --oneline -5

## push: Push changes to remote (triggers workflow)
push:
	@echo "$(CYAN)Pushing to remote...$(NC)"
	@git push origin $$(git rev-parse --abbrev-ref HEAD)
	@echo "$(GREEN)✓ Push complete$(NC)"

## help: Show this help message
help:
	@echo "$(CYAN)╔════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(CYAN)║   Rogue Defense Protocol - Makefile Commands               ║$(NC)"
	@echo "$(CYAN)╚════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Deployment:$(NC)"
	@echo "  $(GREEN)make deploy$(NC)        - Full deployment (push → build → pull → redeploy)"
	@echo "  $(GREEN)make redeploy$(NC)      - Pull latest image and restart (skip build)"
	@echo "  $(GREEN)make push$(NC)          - Push changes to trigger workflow"
	@echo ""
	@echo "$(YELLOW)Container Management:$(NC)"
	@echo "  $(GREEN)make up$(NC)            - Start container"
	@echo "  $(GREEN)make down$(NC)          - Stop container"
	@echo "  $(GREEN)make restart$(NC)       - Restart container"
	@echo "  $(GREEN)make pull$(NC)          - Pull latest image"
	@echo "  $(GREEN)make shell$(NC)         - Open shell in container"
	@echo ""
	@echo "$(YELLOW)Monitoring:$(NC)"
	@echo "  $(GREEN)make status$(NC)        - Show container and workflow status"
	@echo "  $(GREEN)make logs$(NC)          - Follow container logs"
	@echo "  $(GREEN)make logs-tail$(NC)     - View last 100 log lines"
	@echo "  $(GREEN)make health$(NC)        - Check health endpoint"
	@echo ""
	@echo "$(YELLOW)GitHub Actions:$(NC)"
	@echo "  $(GREEN)make workflow$(NC)      - List recent workflow runs"
	@echo "  $(GREEN)make workflow-watch$(NC) - Watch current workflow"
	@echo "  $(GREEN)make workflow-logs$(NC) - View workflow logs"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  $(GREEN)make build-local$(NC)   - Build image locally"
	@echo "  $(GREEN)make git-status$(NC)    - Show git info"
	@echo "  $(GREEN)make clean$(NC)         - Remove unused resources"
