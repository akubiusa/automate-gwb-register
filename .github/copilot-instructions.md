# Copilot review instructions

Project overview, commands and conventions are in `AGENTS.md`. This file lists what to focus on in reviews.

## Language

Deliverables (PR text, review comments, code comments, docs) are written in English. Runtime messages are English. Quotations, technical identifiers, generated files and external source text are exempt.

## Review checklist

- Secrets: `PERSONAL_ACCESS_TOKEN`, `WEBHOOK_SECRET` and `DISCORD_WEBHOOK_URL` must not be hardcoded or newly logged. The existing plain-text configuration log is intentional.
- Destructive operations: changes around `deleteWebhook` / `createWebhook` must keep the `archived` and `fork` exclusion and the `GWB_CHECK_MODE` (`BASE_URL` / `FULL_URL`) branches correct, and must not delete unrelated webhooks.
- Legacy migration: the current `GWB_BASE_URL` host must never be treated as legacy; hosts are compared via `URL().origin`.
- Error handling: missing required environment variables or an invalid `GWB_CHECK_MODE` must set `process.exitCode = 1` and stop.
- Pagination: use `octokit.paginate` for full listings.
- Types: no new `any`, no `skipLibCheck`.
- Do not flag style that Prettier/ESLint fix automatically, the emoji log style, or the absence of tests.
- Commits and PR titles follow Conventional Commits.
