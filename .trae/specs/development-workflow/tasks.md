# Orcaru Development Workflow - Implementation Plan

## [ ] Task 1: Set up branching strategy and repository structure
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Define and document the branching model: `main` (production), `feature/*` (feature branches), optional `staging` later
  - Set branch naming conventions: `feature/short-kebab-name` (e.g., `feature/calendar-overhaul`)
  - Document merge process: feature branch → test on preview → squash merge to main
  - Document rollback process: `git revert <commit>` + push, or Netlify "publish previous deploy"
  - Create `.github` or repo-level docs if needed (keep simple — a `DEVELOPMENT.md` file in the repo root is fine)
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**:
  - `programmatic` TR-1.1: A new feature branch can be created from main and pushed to origin
  - `programmatic` TR-1.2: Netlify creates a deploy preview for the feature branch
  - `human-judgement` TR-1.3: The branching strategy is clearly documented and understandable by a new developer
- **Notes**: Netlify branch deploys should be verified — check if they're auto-enabled for all branches

## [ ] Task 2: Create feature tracking system (feature inventory)
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Create a `FEATURES.md` file (or a simple structured file) that tracks all features and their status
  - Status values: `idea` / `designing` / `spec-ready` / `in-progress` / `review` / `deployed` / `archived`
  - Each feature entry should have: name, description, Figma reference (node ID + link), status, spec file path, branch name, deployed date
  - Include a "Feature Inventory" section that maps Figma pages/frames to implementable features
  - Keep it simple — a single markdown file in the repo is fine for now
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR-2.1: You can look at one file and immediately see the status of all features
  - `human-judgement` TR-2.2: Each feature has a clear link to its Figma location and spec
- **Notes**: Start with a manual triage of the Figma file. Rob reviews Figma pages and categorizes them.

## [ ] Task 3: Define and document the spec workflow
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - Document how specs are created, reviewed, and approved
  - Spec lifecycle: idea → triage → spec draft → review → approved → in-progress → deployed
  - Specs live in `.trae/specs/<feature-name>/` with `spec.md`, `tasks.md`, `checklist.md`
  - Use `/spec` command in TRAE to create specs
  - Approval: Rob reviews and approves specs before implementation starts
  - When a spec is approved, a feature branch is created and implementation begins
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-3.1: The spec workflow is clearly documented
  - `human-judgement` TR-3.2: Someone new to the project can understand how to create and approve a spec
- **Notes**: This current spec (development-workflow) is the first spec and serves as an example.

## [ ] Task 4: Set up frontend/backend contract pattern
- **Priority**: medium
- **Depends On**: Task 1
- **Description**:
  - Create a clear pattern in the frontend code for API calls and data types
  - Use TypeScript interfaces/types to define all data shapes (these become the contract)
  - Centralize API calls in service files (e.g., `src/services/campaigns.ts`, `src/services/content.ts`)
  - Use mock data that matches the TypeScript interfaces until backend is ready
  - Add a `BACKEND_INTEGRATION.md` file explaining the contract pattern for the backend dev
  - The pattern should make it obvious: when backend is ready, just replace mock implementations with real API calls
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR-4.1: A backend developer can read BACKEND_INTEGRATION.md and understand what API endpoints are needed
  - `human-judgement` TR-4.2: All data shapes are defined as TypeScript types/interfaces
  - `human-judgement` TR-4.3: Mock data is clearly separated from component logic
- **Notes**: Current code has inline mock data in components. This is fine for now — the pattern just needs to be defined for future features. We can refactor existing code later.

## [ ] Task 5: Define deploy and rollback process
- **Priority**: medium
- **Depends On**: Task 1, Task 3
- **Description**:
  - Document the deploy process: merge to main → Netlify auto-deploys → verify production
  - Document how to verify a deploy (Netlify CLI + live site check)
  - Document rollback options:
    - Option A: Netlify UI → Deploys → pick previous deploy → "Publish deploy"
    - Option B: `git revert <merge-commit-sha>` → push to main → Netlify auto-deploys revert
  - Document how to verify rollback success
- **Acceptance Criteria Addressed**: AC-5, AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: `netlify api listSiteDeploys` shows the current production deploy
  - `programmatic` TR-5.2: A revert commit can be created and pushed cleanly
  - `human-judgement` TR-5.3: Rollback process is documented and takes <5 minutes
- **Notes**: We already have Netlify CLI working. We can write a simple helper or just use it manually.

## [ ] Task 6: Do initial Figma triage and populate feature inventory
- **Priority**: high
- **Depends On**: Task 2
- **Description**:
  - Rob reviews the Figma file and categorizes each page/section
  - Categorize as: "Ready to implement", "Needs more design", "Experiment/test", "Deprecated"
  - For "Ready to implement" items, estimate size (small/medium/large) and priority (high/medium/low)
  - Populate `FEATURES.md` with all items and their status
  - Pick the first 1-2 features to implement
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR-6.1: All significant Figma pages/frames are catalogued in FEATURES.md
  - `human-judgement` TR-6.2: It's clear which features are ready to implement next
- **Notes**: This is primarily a Rob task since it requires design judgment. The assistant can help format and organize.
