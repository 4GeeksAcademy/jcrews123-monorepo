# Project Brief — Brasaland Digital Monorepo

## Company

**Brasaland** is a grilled food restaurant chain founded in 2008 in Medellín, Colombia. It operates **14 company-owned locations** across **Colombia and the United States (Florida)**, employs approximately **115 people**, and generates around **$6M in annual revenue**.

The brand stands on three pillars: consistent product quality, warm reliable service, and speed of kitchen operations.

## Your team

You are part of **Brasaland Digital**, the internal technology unit led by **CTO Nicolás Park** (Medellín). The mandate is to build tools, systems, and automations that let Brasaland operate as a modern multi-market company without losing its identity.

## Problem this monorepo solves

Brasaland runs a two-country operation with fragmented tools: static website, outdated app, separate POS systems, spreadsheets, and manual HR/process workflows. Leadership lacks real-time visibility into sales, inventory, customers, and people metrics.

This repository is the **single engineering workspace** for all Brasaland Digital deliverables: public web, internal apps, backend services, data pipelines, and (in later milestones) AI agents and workflows.

## Department needs (summary)

| Department | Lead | Core need |
|------------|------|-----------|
| Restaurant Operations | Felipe Guerrero | Real-time sales dashboard, smart ordering, opening-hour alerts |
| Procurement | Lucía Fernández | Supplier platform, consolidated purchasing across markets |
| Marketing & Digital | Camila Ospina | Digital loyalty, CRM, personalisation |
| People & Culture | Ashley Turner | HR portal, automated onboarding, turnover KPIs |
| Training & Quality | Jake Morrison | Searchable recipe catalogue, push updates to all locations |
| Technology | Nicolás Park | Central API, telemetry, data pipeline |
| Executive | Mariana Restrepo | Unified dashboard, natural-language assistant, weekly reports |

## Project objectives

1. **Public presence** — corporate website aligned with brand (`uis/website`)
2. **Internal operations** — backoffice and department tools (`uis/backoffice`, future apps)
3. **Data & logic** — TypeScript utilities and future APIs (`apps/operations`, `services/`)
4. **AI-ready development** — memory bank, agent rules, and skills so coding agents work safely in this repo
5. **Future milestones** — RAG, agents, workflows, real-time telemetry built on this foundation

## Source of truth

Company facts, field names, and constraints live in root [`CONTEXT.md`](../CONTEXT.md). All new work must align with that briefing.
