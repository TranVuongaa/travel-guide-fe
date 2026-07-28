---
id: "2026-07-29-translate-readme-to-english"
status: completed
created_at: "2026-07-29T00:52:38+07:00"
confirmed_at: "2026-07-29T01:19:31+07:00"
completed_at: "2026-07-29T01:20:09+07:00"
---

# Goal

Translate the polished root README from Vietnamese to clear, natural English.

# Skills read

- None.

# Existing code inspected

- `ai-context/project-overview.md`
- `ai-context/ai-workflow-rules.md`
- `README.md`
- Current Git status
- The current `HEAD` version of `README.md` after it changed following confirmation

# Files likely to change

- `README.md`
- `ai-context/prompts/2026-07-29-translate-readme-to-english.md` for workflow status updates

# Decisions / assumptions

- Translate all descriptive content, headings, link labels, table headings, and notes into English.
- Keep the Vietnamese product name `Vạn Nẻo` unchanged as a proper name.
- Preserve the current concise Markdown structure, technical facts, and URLs.
- Do not restore the setup, environment, checks, architecture, security, or deployment sections that are no longer
  present in the current README.
- Do not revise application UI localization; this request applies only to the README.

# Open questions

- None.

# Implementation requirements

- Use concise, natural technical English throughout `README.md`.
- Preserve the existing title, introduction, demo/API links, and technology table.
- Keep the file encoded as UTF-8 with a final newline.

# API contract and external backend dependencies

- No API contract or backend dependency changes.
- Preserve the current demo and API documentation URLs.

# Security requirements

- Do not introduce secrets or copy values from the local `.env`.
- Do not introduce new security or configuration claims.

# Accessibility requirements

- Preserve the logical heading hierarchy, descriptive link labels, readable tables, and language-tagged code blocks.

# Acceptance criteria

- All README prose is in English, except the `Vạn Nẻo` product name.
- Technical meaning and the current concise scope remain unchanged.
- Markdown remains clean and easy to scan.
- Only README and workflow prompt files change.

# Checks to run

- `git diff --check`
- Manually inspect the README for remaining Vietnamese prose.
- Manually compare URLs and technology names before and after translation.

# Manual testing steps

1. Open the rendered `README.md` preview.
2. Confirm all headings, descriptions, table labels, and notes are in English.
3. Confirm links and code blocks still render correctly.
