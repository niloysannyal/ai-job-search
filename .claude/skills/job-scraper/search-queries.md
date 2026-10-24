# Search Queries for Job Scraper

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first.
For Niloy Sannyal, the primary search tools are:
- **`linkedin-search`**: Field-agnostic, country-agnostic. Runs searches for remote worldwide roles, Dhaka/Bangladesh local roles, and global tech hubs (US, UK, Germany, Canada, Singapore, Australia, Gulf).
- **`freehire-search`**: Multi-market tech aggregator querying ~50 ATS platforms for software, data, ML, and engineering vacancies with `--remote` and skill-faceted flags.

The Danish demo portals (`jobbank-search`, `jobdanmark-search`, `jobindex-search`, `jobnet-search`) remain installed and disabled by default unless targeting Denmark.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

## Query Categories

Queries are grouped by priority based on Niloy Sannyal's core expertise in production Agentic AI, LLM systems, RAG, and Machine Learning.

### Priority 1: AI Engineer & Agentic AI / LLM Systems (Core Direction)

Matches strongest production background in enterprise agentic workflows, multi-provider LLM routing, and RAG.

```
site:linkedin.com/jobs "AI Engineer" "Remote"
site:linkedin.com/jobs "AI Engineer" "Dhaka"
site:linkedin.com/jobs "Agentic AI" OR "LLM Engineer" "Remote"
site:linkedin.com/jobs "RAG" "FastAPI" "Python" "Remote"
site:linkedin.com/jobs "AI Platform Engineer" "Remote"
```

### Priority 2: Machine Learning Engineer & Data Scientist (Predictive Modeling & MLOps)

Matches end-to-end ML pipelines, feature engineering, low-latency prediction APIs, and algorithmic rigor.

```
site:linkedin.com/jobs "Machine Learning Engineer" "Remote"
site:linkedin.com/jobs "ML Engineer" "Dhaka"
site:linkedin.com/jobs "Data Scientist" "Remote"
site:linkedin.com/jobs "MLOps Engineer" "Remote"
site:linkedin.com/jobs "Computer Vision Engineer" "Python" "Remote"
```

### Priority 3: Business Intelligence & Automation / Solutions

Matches experience in Odoo CRM integration, n8n automations, client consulting, and factory digitization.

```
site:linkedin.com/jobs "Business Intelligence Analyst" "Remote"
site:linkedin.com/jobs "AI Solutions Architect" "Remote"
site:linkedin.com/jobs "Automation Engineer" "Python" "Remote"
```

### Priority 4: Robotics & IoT / Embedded Systems

Adjacent hardware, sensor, and robotics background.

```
site:linkedin.com/jobs "Robotics Engineer" "Remote" OR "Dhaka"
site:linkedin.com/jobs "IoT Engineer" "Python" OR "C++" "Remote"
site:linkedin.com/jobs "Embedded Software Engineer" "Robotics"
```

## Location & Work Mode Filter

- **Tier 1 (Ideal):** 100% Remote worldwide / Remote US / Remote EU / Remote APAC (async or standard overlap)
- **Tier 2 (Ideal Local):** On-site / Hybrid in Dhaka, Bangladesh (min 45,000 BDT/month, target 75,000+ BDT/month)
- **Tier 3 (Relocation):** Worldwide on-site in US, UK, Germany, Canada, Australia, EU, Singapore, Gulf **ONLY IF** visa sponsorship and relocation assistance are explicitly provided (target 100k - 250k USD/year)
- **Unacceptable (Deal-breaker):** On-site or hybrid outside Bangladesh without visa sponsorship

## Language Filter

- **Declared languages:** Bengali (Native), English (Professional working proficiency), Hindi (Conversational).
- **Rule:** A posting requiring an undeclared language (e.g. German, Japanese, French) as a mandatory job condition is excluded before scoring. Postings requiring professional English or Bengali pass cleanly.

## Date Filter

Only include jobs posted within the last 14 days, or with an open application deadline.

## Adapting Queries

When running `/scrape <focus_area>`, prioritize that category:
- `/scrape agentic` -> Focus on Agentic AI, LLM chains, LangGraph, tool use
- `/scrape data science` -> Focus on Data Science, ML models, predictive analytics
- `/scrape dhaka` -> Focus on on-site and hybrid roles in Dhaka, Bangladesh
