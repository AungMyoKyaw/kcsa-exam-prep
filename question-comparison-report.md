# KCSA Question Comparison Report

## Analysis Summary

### External Sources Analyzed
1. **KCSA_Practice_Exam.txt** — 60 questions from a practice exam book
2. **report.md** — 140 questions from a large question dump

### Existing App Question Bank
- `examQuestions.ts` — 86 questions (ids 1–60 base + 303 new + 248–272 multi-select)
- `examQuestionsNew.ts` — 45 questions (ids 61–105)
- `examQuestionsDump.ts` — 140 questions (ids 106–245)
- `examQuestionsScenario.ts` — 30 scenario questions (ids 273–302)
- **Total after addition: 301 questions**

---

## Findings

### Source 1: report.md (140 questions)
**Result: ALL 140 questions are already in the app (duplicates).**

The `report.md` file is the **exact source** that was previously imported into `examQuestionsDump.ts`. Automated text-similarity comparison confirmed 139 questions at ≥65% similarity (the 1 below threshold was a code-heavy YAML question where the similarity algorithm under-weighted the prose — it is also a confirmed duplicate).

| report.md Question | examQuestionsDump.ts ID | Similarity | Match Type |
|---|---|---|---|
| Q1 (Least privilege) | id 106 | 1.00 | Exact match |
| Q2 (Shared responsibility) | id 107 | 1.00 | Exact match |
| Q3 (Immutable infrastructure) | id 108 | 1.00 | Exact match |
| Q4 (4C outermost layer) | id 109 | 1.00 | Exact match |
| Q5 (Defense in Depth) | id 110 | 1.00 | Exact match |
| ... | ... | ... | ... |
| Q140 (PSS apply via labels) | id 188 | 1.00 | Exact match |

**Duplicates skipped: 140**

---

### Source 2: KCSA_Practice_Exam.txt (60 questions)
**Result: 59 duplicates, 1 new question added.**

Automated text-similarity comparison found 59 questions at ≥65% similarity with existing app questions. The remaining question (Q60) covers a genuinely new angle not present in the existing bank.

#### 5 Examples of Questions Skipped as Duplicates:

| Practice Exam Q | Core Concept | Existing App Question | Similarity |
|---|---|---|---|
| Q1: 4C outermost layer | 4C model — outermost = Cloud | id 1 (base), id 109 (dump) | 1.00 |
| Q2: Defense in Depth | Multiple security layers | id 7 (base), id 110 (dump) | 1.00 |
| Q3: Zero Trust principle | "Never Trust, Always Verify" | id 111 (dump) | 1.00 |
| Q5: MD5 password hash | Invalid auth mechanism | id 185 (dump) | 0.77 |
| Q15: STRIDE acronym | Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation | id 195 (dump) | 1.00 |

#### The 1 Question Added as New:

**Practice Exam Q60:**
> *"As a Kubernetes and Cloud Native Security Associate, a user can set up audit logging in a cluster. What is the risk of logging every event at the full RequestResponse level?"*
>
> **Answer:** B — Increased storage requirements and potential impact on performance
>
> **Why it was added:** The app has existing questions about *which* audit level captures full request/response (ids 233, 237) and about the *purpose* of audit logging (id 236), but **none** ask about the *risk/cost* of using the most verbose level for every event. This is a new angle on an existing topic, with a unique correct answer and explanation not found elsewhere.
>
> **Assigned ID:** 303
> **Domain:** 6 — Compliance and Security Frameworks
> **Difficulty:** Medium

---

## New Questions Added

**1 question added:**
- Practice Exam Q60 → App ID 303 (Domain 6)

**199 questions skipped as duplicates:**
- 140 from report.md
- 59 from practice exam

---

## Build Status

✅ **Build passes successfully.**

```
$ tsc -b && vite build
✓ 2640 modules transformed
✓ built in 1.81s
```

---

## Recommendations

1. **Both external sources have been fully evaluated.** The report.md dump was already 100% incorporated into `examQuestionsDump.ts` — no new questions were available from that source.
2. **Future imports** — Before importing new question dumps, run a text-similarity check against the full bank (ids 1–302+) to avoid re-importing duplicates.
3. **Consider enriching explanations** — Some practice exam questions have slightly more detailed explanations than their app counterparts. A future task could merge richer explanations into existing duplicate questions without adding new IDs.
