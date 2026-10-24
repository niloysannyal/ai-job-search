---
framework_version: 1.0.0
---

# Interview Preparation Guide

<!-- SETUP: STAR examples are personalized by running /setup based on your actual experience -->

## STAR Format

Structure answers as: **Situation** (context), **Task** (your responsibility), **Action** (what you did), **Result** (outcome).

Keep answers to 1-2 minutes. Be specific. End with what you learned or would do differently.

## Ready-Made STAR Examples

### 1. Betopia Sales Agent (Multi-Provider Agentic AI & CRM Integration)
**S:** Betopia Group needed an autonomous sales intelligence system for 600+ sales agents embedded directly into their Odoo CRM, but relying on a single LLM provider created uptime vulnerabilities and token rate-limit risks.
**T:** As sole architect, design and ship an agentic assistant capable of psychological client profiling, conversation-stage detection, and lead-closing recommendations with high availability.
**A:** Built a dynamic multi-provider LLM chain routing between OpenAI, Anthropic, and Gemini with automatic slot failover. Implemented Redis AOF for persistent conversation states, FastAPI async endpoints, and a Next.js 15 administrative control panel.
**R:** Successfully deployed to 600+ sales agents across Betopia Group, maintaining high uptime, sub-second routing, and real-time observability for executive leadership.
**Use for:** "Tell me about a complex system you architected from scratch", "How do you handle reliability and third-party API failovers?", "Tell me about building with Agentic AI."

### 2. Enterprise RAG on Qdrant (Low-Latency Retrieval & Context Injection)
**S:** Sales agents were generating proposals inconsistently, missing historical high-converting sales phrasing and approved proposal templates.
**T:** Build a production-grade semantic search and retrieval layer to inject context-aware historical proposal templates into live model prompts.
**A:** Designed and deployed a vector RAG pipeline on Qdrant. Embedded and indexed historical sales conversations and Fiverr proposal templates. Optimized collection schemas, backup/restore scripts on Linux VPS, and integrated async similarity search directly into the FastAPI pipeline.
**R:** Empowered agents to draft tailored, high-converting client responses in seconds, significantly accelerating lead response times and proposal consistency.
**Use for:** "Describe your experience building production RAG systems", "How do you optimize vector databases for low latency?", "How do you manage Linux/VPS production infrastructure?"

### 3. HA-MEEM Group Factory Digitization (Client Consulting & Technical Leadership)
**S:** HA-MEEM Group (a major RMG manufacturer) had disparate, manual factory-floor operations across inventory, washing recipes, fabric QC, cutting, and management reporting.
**T:** Lead an external technical consulting engagement to scope, analyze, and architect a five-module factory digitization system.
**A:** Met directly with plant managers and operations leaders to extract domain constraints. Scoped 5 operational modules (inventory & needle tracking, wash recipe control, shade/shrinkage fabric QC, cutting & waste management, master admin dashboard) and authored client-ready technical architecture diagrams.
**R:** Produced full system blueprints and data flow pipelines that established clear technical milestones for factory floor automation.
**Use for:** "Tell me about a time you worked with non-technical clients", "How do you translate ambiguous business requirements into system architecture?", "Demonstrate technical leadership."

### 4. Full Send Sports AI -- UFC Prediction Platform (End-to-End MLOps & Production Latency)
**S:** Needed a real-time, low-latency predictive service to forecast outcomes of UFC fights based on deep fighter historical stats.
**T:** Build an end-to-end ML pipeline with high predictive accuracy, trained on 10,000+ fights, and serve real-time predictions with sub-100ms response time.
**A:** Engineered 80+ features capturing rolling fighter stats, strike efficiency, and fight conditions. Trained and tuned ensemble models (XGBoost, LightGBM, Scikit-learn), wrapped inference in an async FastAPI service, and deployed the production backend on AWS with Docker.
**R:** Platform launched live on the iOS App Store, serving live production traffic with sub-100ms inference latency.
**Use for:** "Tell me about an end-to-end ML project you shipped", "How do you approach feature engineering for tabular/event data?", "How do you optimize model latency?"

## Common Tough Questions

### "Why did you leave [previous company]?"
> [PREPARE YOUR ANSWER - be honest, forward-looking, no negativity about former employer]

### "You don't have [specific skill/experience]."
> [PREPARE YOUR ANSWER - acknowledge the gap, bridge to adjacent experience, show willingness to learn]

### "Where do you see yourself in 5 years?"
> [PREPARE YOUR ANSWER - show ambition aligned with the role's growth path]

### "What's your biggest weakness?"
> [PREPARE YOUR ANSWER - genuine weakness with concrete mitigation strategy]

### "Why this company specifically?"
> Customize per company. Must reference: specific projects, company values, market position, or team structure. Never give a generic answer.

## Questions You Should Ask Interviewers

### About the Role
- "What does a typical week look like in this role?"
- "What would success look like in the first 6 months?"
- "What's the biggest challenge the team is facing right now?"

### About the Team
- "How big is the team, and how do you divide work?"
- "What does the development/project lifecycle look like, from idea to production?"
- "How do you onboard new team members?"

### About Tech & Growth
- "What's your current tech stack for [relevant area]?"
- "Is there room to grow into more architectural or strategic decisions?"
- "How does the team stay current with new tools and methods?"

### About Culture (use these to prevent disappointment)
- "How would you describe the team culture?"
- "What does professional development look like here?"
- "Is there flexibility for remote/hybrid work?"
- "What's the balance between development/new projects and maintenance work?"
- "How would you describe the leadership style in this team?"
- "What do people who thrive here have in common?"

## Phone/Video Interview Tips
- Have STAR examples written out (use this file)
- Keep a glass of water nearby
- Smile when speaking (it changes your tone)
- Ask for clarification if a question is vague
- It's OK to take 5 seconds to think before answering
- End with: "Is there anything else you'd like to know about my background?"

## After the Application (Best Practice)

### Follow-Up Etiquette
- **Don't call to "stand out"** or to learn more about the role post-submission - this risks a negative impression
- If the employer specified a timeline, respect it and wait
- If no timeline was given and significant time has passed (2+ weeks), a brief call to ask about status is acceptable
- If you have genuinely new, relevant information to share, a short follow-up is fine

### Thank-You Notes
- When you receive any update (interview invitation, rejection, or status update), send a brief thank-you message
- Express appreciation for their time and the process
- Keep it short (2-3 sentences)

## Roleplay Guidelines
When the user asks for interview practice:
1. Ask which role/company to simulate
2. Start with easy warm-up questions ("Tell me about yourself")
3. Progress to role-specific technical questions
4. Include 1-2 behavioral questions using the competencies from the job posting
5. End with a tough question or curveball
6. After each answer, give brief feedback: what worked, what to sharpen
7. Suggest which STAR example would work best for each question
