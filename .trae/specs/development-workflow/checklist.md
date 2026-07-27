# Orcaru Development Workflow - Verification Checklist

## Branching Strategy
- [ ] Branch naming convention is defined and documented (feature/*, bugfix/*, etc.)
- [ ] `main` branch is protected and always deployable
- [ ] Feature branches are created from `main`
- [ ] Merge process is clear (squash merge, commit message conventions)
- [ ] Netlify creates deploy previews for feature branches
- [ ] Rollback process is documented and testable

## Spec Workflow
- [ ] Specs live in `.trae/specs/<feature-name>/` with spec.md, tasks.md, checklist.md
- [ ] Spec lifecycle is defined: idea → spec → approved → in-progress → deployed
- [ ] Specs are reviewed and approved before implementation starts
- [ ] Specs include Figma references (node IDs, links)
- [ ] Specs include acceptance criteria and test requirements

## Feature Tracking
- [ ] A single file (FEATURES.md) tracks all features and their status
- [ ] Status values are defined: idea, designing, spec-ready, in-progress, review, deployed, archived
- [ ] Each feature has a Figma reference (link + node ID)
- [ ] Each feature has a spec reference if spec'd
- [ ] It's easy to see which features are ready to implement next
- [ ] It's easy to see which features are currently deployed

## Frontend/Backend Contract
- [ ] TypeScript interfaces define all data shapes (API contract)
- [ ] API calls are centralized in service files (e.g., src/services/)
- [ ] Mock data is clearly separated from component logic
- [ ] BACKEND_INTEGRATION.md exists and explains the pattern
- [ ] A backend developer can identify required endpoints from the codebase

## Deploy & Rollback
- [ ] Production deploys automatically when main is updated
- [ ] Netlify CLI can check deploy status
- [ ] Rollback via Netlify UI works (publish previous deploy)
- [ ] Rollback via git revert works
- [ ] Post-deploy verification steps are defined (check site loads, check key features)
- [ ] Production stability is maintained — no broken deploys reach users
