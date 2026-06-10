# BrandOS — Learnings Log

> Add an entry every time you hit a wall and solve it.  
> Format: **What broke → What we did → The reusable rule**  
> Tag each feature: `[core]` (any service business needs this) or `[brandos]` (specific to us)

---

## Entry 001 — The Overwrite Problem
**Date:** June 2026  
**What broke:** Working directly on the main branch / live site meant one bad push could wipe or break the whole thing. Zach experienced this firsthand during an earlier project.  
**What we did:** Formalized the branch-based workflow from day one. Each builder gets their own branch and their own Vercel preview URL. Nothing touches `main` without a pull request. Branch protection is on so the rule is enforced by the system, not by memory.  
**The reusable rule:** Never let two people (or two sessions) write directly to the same live codebase. Branches are free. Rebuilding from a broken deploy is not. `[core]`

---

## Entry 002 — Multi-tenant data from day one
**Date:** June 2026  
**What broke:** N/A — this was a deliberate architectural choice made before it could bite us.  
**What we did:** Put a `brand_id` column on every table even though v1 serves only one brand (BrandOS itself). The screens are scoped to one brand, but the data model already supports many.  
**The reusable rule:** If the endgame is multi-client, tag every row with a tenant ID before you write a single query. Adding it later means rewriting migrations, rewriting queries, and re-auditing every RLS policy. Doing it first costs one column. `[core]`

---

## Entry 003 — Claude API key: server-side only
**Date:** June 2026  
**What broke:** N/A — caught in design.  
**What we did:** Named the Claude API key `ANTHROPIC_API_KEY` (no `NEXT_PUBLIC_` prefix) so Next.js never exposes it to the browser. All Claude calls go through `/api/generate` (a server-side route), never from client JS.  
**The reusable rule:** Any API key that costs money or has rate limits lives server-side only. `NEXT_PUBLIC_` = anyone with DevTools can read it. `[core]`

---

<!-- Add new entries below this line -->
