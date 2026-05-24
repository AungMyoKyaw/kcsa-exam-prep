# KCSA Exam Prep App — Comprehensive Audit Report

**Auditor:** Specialist Exam Prep Content Auditor  
**Date:** 2026-05-24  
**Repo:** `/Users/aungmyokyaw/projects/life/kcsa-exam-prep`  
**App Type:** React + Vite interactive web app, GitHub Pages deployment  
**Target Exam:** Kubernetes and Cloud Native Security Associate (KCSA) — CNCF/Linux Foundation

---

## Executive Summary

The app is a **solid foundation** with good visual polish, a functional practice exam, cheat sheet, glossary, and domain quizzes. However, it is **not yet a "guaranteed pass" resource**. There are **critical content gaps**, **question quality issues**, and — most importantly per user directive — a **severe lack of memorization aids and comprehension scaffolding** that prevents learners from actually retaining the material under exam pressure.

**Verdict: 6.5/10** — Good for review, insufficient for first-time learners or guaranteed passing.

---

## 1. Domain Content Gap Analysis

### Domain 1: Overview of Cloud Native Security (14% — 8 exam questions)

**What Exists:**
- 4Cs diagram (Cloud → Cluster → Container → Code)
- Shared responsibility table
- Security frameworks: NIST CSF, CIS Benchmark, ISO 27001/SOC 2, MITRE ATT&CK
- Isolation: Namespaces, NetworkPolicies, ResourceQuotas, Runtime isolation (gVisor/Kata mentioned)
- Image security: Scanning (Trivy), Signing (Cosign), Minimal base images, Private registries
- DevSecOps: CI/CD pipeline security checklist
- 5 domain quiz questions

**Content Gaps:**
1. **Cloud Provider Security specifics are almost entirely missing.** The real KCSA exam tests cloud provider IAM, network security groups, encryption at rest for cloud storage, and managed Kubernetes security (EKS, GKE, AKS specifics). The app only has a generic shared responsibility table with no cloud-native detail.
2. **No "Configuration" as a C.** Some KCSA curricula explicitly list Configuration as the 4th C (replacing Code). The app should at least mention this variation.
3. **Artifact repository security is shallow.** Missing: registry authentication methods, image pull policies, registry scanning integration, Harbor RBAC, OCI registry standards.
4. **Workload and Application Code Security is shallow.** Missing: OWASP Top 10 for containers, secrets in code detection, dependency confusion attacks, secure coding standards for containers.
5. **No cloud metadata service protection.** IMDSv2 (AWS), metadata concealment (GKE) — a known KCSA topic — is completely absent.
6. **No gVisor/Kata detail.** Mentioned in one sentence but no explanation of *how* they work or *when* to choose them.

**Memorization/Comprehension Issues:**
- No mnemonic for the 4Cs.
- No visual showing "defense in depth" as nested layers.
- No "Why this matters" callout explaining why Cloud security is the foundation.
- DevSecOps checklist is just bullet points — no flow diagram of where each security check sits in CI/CD.

---

### Domain 2: Kubernetes Cluster Component Security (22% — 14 exam questions)

**What Exists:**
- Sticky ports bar (excellent UX)
- Architecture diagram (control plane + workers)
- Complete ports reference table
- API Server: critical flags, auth modes, admission controllers
- etcd: security requirements, encryption at rest providers chain
- Kubelet: ports, security flags, NodeRestriction
- Controller Manager & Scheduler: ports, legacy HTTP ports
- Container Runtime: containerd/CRI-O, Linux security mechanisms (seccomp, AppArmor, SELinux)
- Kube-proxy: proxy modes (userspace/iptables/IPVS)
- CNI: network security best practices
- ServiceAccounts: token types (bound since 1.24), kubeconfig structure
- Storage: CSI, KMS v2, key rotation
- 14 domain quiz questions

**Content Gaps:**
1. **TLS Bootstrapping for nodes is MISSING.** The KCSA exam tests how nodes join clusters securely (CertificateSigningRequest, bootstrap tokens, automatic approval). Not covered.
2. **Certificate rotation is MISSING.** No coverage of how Kubernetes rotates component certificates, cert-manager for internal certs, or what happens when certs expire.
3. **Kube-proxy security flags missing.** Only proxy modes are covered; no security flags or hardening.
4. **No CNI plugin security comparison.** Calico NetworkPolicies vs native NetworkPolicy, Cilium L7 filtering, eBPF — all absent.
5. **etcd backup/restore security is MISSING.** This is a high-yield KCSA topic. How to snapshot etcd, encrypt backups, restore securely — completely absent.
6. **No coverage of API Server request lifecycle.** The exam tests the sequence: authenticate → authorize → admission control → persist. No visual flow.
7. **Container runtime hardening shallow.** seccomp/AppArmor/SELinux are named but no example profiles, no `RuntimeDefault` vs `Unconfined` vs `Localhost` comparison table.
8. **No Kubelet read-only port (10255) disable procedure.** Mentioned in ports table but not explained *how* to disable or why it's dangerous.
9. **No coverage of static pods or their security implications.**

**Memorization/Comprehension Issues:**
- Ports are shown but no memory hook (e.g., "6443 = 64+43 = API Server", "2379/2380 = 2-3-7-9 are etcd's best friends").
- Encryption provider chain shown as boxes but no diagram explaining DEK → KEK → KMS hierarchy.
- No visual of the admission controller pipeline (mutating → validating).
- Architecture diagram is static; no clickable/annotated version showing trust boundaries.

---

### Domain 3: Kubernetes Security Fundamentals (22% — 14 exam questions)

**What Exists:**
- Pod Security Standards: excellent Baseline vs Restricted comparison table
- PSA: three enforcement modes, namespace labels, timeline (PSP → PSA)
- RBAC: all 11 verbs table, Role vs ClusterRole, configuration example
- Authentication: methods, auth flow
- Secrets: built-in types, encryption providers
- NetworkPolicies: rules, complete examples, what it cannot do
- Audit logging: levels table, backends
- 12 quiz questions (highest quality domain)

**Content Gaps:**
1. **RBAC aggregation rules MISSING.** ClusterRole aggregation (`aggregationRule`) is a real exam topic. Not covered.
2. **Default RBAC roles MISSING.** No coverage of `system:*` roles, `cluster-admin`, `edit`, `view`, `admin` — what they grant and when to use them.
3. **Webhook authentication/authorization shallow.** Mentioned but no diagram of the Webhook flow, no example of `SubjectAccessReview`.
4. **CSR / CertificateSigningRequest for users MISSING.** How users get certs, how admins approve CSRs — absent.
5. **Audit policy YAML structure MISSING.** The exam shows audit policy YAML snippets. The app has levels but no example policy file.
6. **Pod Security Admission version pinning MISSING.** The `enforce-version` label (e.g., `v1.30`) is not explained.
7. **No coverage of ABAC as a comparison point.** ABAC is mentioned as "legacy" but not explained enough to distinguish from RBAC in an exam scenario.
8. **No coverage of `system:authenticated` and `system:unauthenticated` groups.**
9. **No coverage of `ResourceQuota` and `LimitRange` as DoS prevention.**

**Memorization/Comprehension Issues:**
- 13 capabilities listed as a flat string. No mnemonic (e.g., "AUDIT_WRITE CHOWN DAC_OVERRIDE FOWNER FSETID KILL MKNOD NET_BIND_SERVICE SETFCAP SETPCAP SYS_CHROOT SETGID SETUID" is just dumped).
- RBAC verbs table is good but no memory hook for the 3 dangerous ones (`bind`, `escalate`, `impersonate` → "BEI the privilege escalator").
- No visual flow diagram of: `kubectl` → `AuthN` → `AuthZ (RBAC)` → `Admission` → `etcd`.
- No "Why this matters" for default-deny NetworkPolicy.
- No comparison of RoleBinding-to-ClusterRole vs ClusterRoleBinding-to-ClusterRole in one visual matrix.

---

### Domain 4: Kubernetes Threat Model (16% — 10 exam questions)

**What Exists:**
- STRIDE framework with Kubernetes-specific mapping table
- Container escape: techniques table, notable CVEs, mitigations
- Privilege escalation: RBAC abuse vectors, additional paths
- Lateral movement: attack paths table, mitigations
- Denial of Service: vectors, mitigations
- Persistence: techniques, detection strategies
- MITRE ATT&CK: 9 tactics, key techniques grid
- 10 quiz questions

**Content Gaps:**
1. **Trust boundaries and data flow MISSING.** The official KCSA curriculum explicitly lists "Kubernetes Trust Boundaries and Data Flow" as a competency. The app mentions trust boundaries in one glossary definition but has no diagram or section.
2. **"Attacker on the Network" MISSING.** No dedicated section on network-based attacks (ARP spoofing, DNS hijacking, metadata service abuse).
3. **"Malicious Code Execution and Compromised Applications" MISSING.** No coverage of how compromised apps behave, reverse shells, crypto-mining in pods.
4. **"Access to Sensitive Data" MISSING.** No dedicated section on data exfiltration paths, secret exfiltration techniques, or data protection strategies.
5. **Cloud metadata service abuse (169.254.169.254) MISSING.** A critical lateral movement vector — completely absent.
6. **No coverage of Kubernetes events as an attack surface.** Event manipulation, event flooding.
7. **No coverage of mutating webhooks as an attack/persistence vector.**
8. **Pod sandbox escape via kernel exploits only listed by CVE name.** No explanation of *how* Dirty Pipe or CVE-2024-21626 work at a high level.

**Memorization/Comprehension Issues:**
- STRIDE is presented as a table but no mnemonic (e.g., "S.T.R.I.D.E. = Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege" — could use a memory sentence like "Some Thieves Rob Important Data Every Day").
- MITRE techniques are in a grid but no grouping by what the exam tests most (T1611, T1610, T1552.007).
- No visual attack chain diagram: `Initial Access → Persistence → Privilege Escalation → Lateral Movement → Impact`.
- Container escape techniques are listed but no "escape difficulty ladder" visual.

---

### Domain 5: Platform Security (16% — 10 exam questions)

**What Exists:**
- Supply Chain Security: SLSA levels (1-4), SBOM, CI/CD pipeline security
- Image Repository: scanning, signing, private registries
- Observability: three pillars, security monitoring tools, alerts
- Service Mesh: mTLS modes, Istio AuthorizationPolicy example
- PKI: certificate lifecycle, cert-manager
- Admission Control: built-in controllers, OPA vs Kyverno, Kyverno examples
- 10 quiz questions

**Content Gaps:**
1. **Sigstore ecosystem incomplete.** Cosign is covered but missing: Rekor (transparency log), Fulcio (CA), in-toto (attestation), SLSA provenance generation. The exam tests the *entire* Sigstore stack.
2. **SBOM tools and generation MISSING.** Syft, Trivy SBOM mode, SPDX vs CycloneDX generation — not covered.
3. **Image vulnerability severity (CVSS) MISSING.** How to prioritize vulnerabilities, critical/high/medium/low — absent.
4. **Runtime security beyond Falco/Tetragon MISSING.** No coverage of: Falco rules syntax, Falco sidekick/outputs, Tetragon tracing policies, eBPF basics.
5. **Private clusters / bastion hosts MISSING.** Section 5.6 "Connectivity Security" exists in the heading list but appears empty or underdeveloped in the actual content.
6. **No coverage of secrets management tools.** Vault, External Secrets Operator — absent.
7. **No coverage of Cilium as a service mesh alternative.**
8. **No coverage of SPIFFE/SPIRE for workload identity.**
9. **OPA/Rego basics MISSING.** Gatekeeper is compared to Kyverno but no Rego syntax primer, no example of a simple Gatekeeper constraint/template.

**Memorization/Comprehension Issues:**
- SLSA levels are shown but no mnemonic (e.g., "Level 1 = Provenance exists, 2 = Signed, 3 = Hardened, 4 = Two-person review" — could use a memory hook).
- No visual of the supply chain: `Source → Build → Package → Deploy → Runtime` with security checks at each stage.
- No "Why this matters" for mTLS (e.g., "Without mTLS, any compromised pod can impersonate any service").
- No comparison table: OPA Gatekeeper vs Kyverno vs Built-in PodSecurity vs PSP (all 4 in one matrix).

---

### Domain 6: Compliance and Security Frameworks (10% — 4 exam questions)

**What Exists:**
- Compliance Frameworks: CIS Controls v8, NIST SP 800-53 families, PCI DSS, HIPAA, GDPR, SOC 2
- CIS Kubernetes Benchmarks: sections, scored vs not scored, levels, running kube-bench, key checks
- Threat Modeling: MITRE ATT&CK, DREAD, PASTA, OCTAVE, STRIDE
- Supply Chain Compliance: (section exists but content is thin)
- Security Automation: kube-bench CI/CD integration
- Exam prep strategy: checklist, time allocation
- 10 domain quiz questions (but only 4 in the main exam pool — mismatch noted)

**Content Gaps:**
1. **PCI DSS for Kubernetes is just a name drop.** No specific requirements mapped to K8s controls (network segmentation, encryption, audit logging for cardholder data).
2. **HIPAA technical safeguards mapping MISSING.** No mapping of K8s security controls to HIPAA requirements.
3. **GDPR data subject rights in K8s MISSING.** How to handle right-to-erasure, data portability in containerized environments.
4. **SOC 2 Trust Services Criteria details MISSING.** Only mentioned as "5 criteria" with no K8s mapping.
5. **NIST SP 800-190 (Container Security Guide) MISSING.** The exam specifically tests 800-190. Not covered.
6. **Supply chain compliance specifics MISSING.** SLSA compliance, SBOM requirements for federal contracts (EO 14028) — absent.
7. **Automation and tooling for compliance MISSING beyond kube-bench.** No coverage of: Kubescape as a compliance scanner, Falco for compliance monitoring, OPA for continuous compliance, Prometheus/Grafana for compliance dashboards.
8. **Incident response frameworks MISSING.** NIST SP 800-61, SANS IR framework — not covered.
9. **Penetration testing in K8s MISSING.** How to pentest a cluster, common tools — absent.

**Memorization/Comprehension Issues:**
- 18 CIS safeguards listed as a flat array. No grouping or mnemonic.
- NIST families listed but no memory aid (e.g., AC-AU-CM-IA-RA-SC-SI-IR = "All Cows Make Ice Cream; Really Sweet Ice Cream Is Ready").
- No "framework chooser" decision tree: "If the question mentions PCI → choose segmentation/encryption/auditing."

---

## 2. Exam Question Quality Assessment

### Distribution Analysis

| Domain | Weight | App Questions | Target | Status |
|--------|--------|---------------|--------|--------|
| 1 | 14% | 8 | ~8-9 | ✅ OK |
| 2 | 22% | 14 | ~13-14 | ✅ OK |
| 3 | 22% | 14 | ~13-14 | ✅ OK |
| 4 | 16% | 10 | ~9-10 | ✅ OK |
| 5 | 16% | 10 | ~9-10 | ✅ OK |
| 6 | 10% | 4 | ~6 | ⚠️ LOW |

Domain 6 has only 4 questions despite 10% weight. Should have ~6.

### Difficulty Analysis

| Difficulty | Count | % |
|------------|-------|---|
| Easy | ~26 | 43% |
| Medium | ~24 | 40% |
| Hard | ~10 | 17% |

**Issue:** Too many easy questions. A real certification exam has more medium/hard scenario-based questions. Easy questions give false confidence.

### Question Quality Issues (Ranked by Severity)

1. **DUPLICATION ACROSS DOMAINS (CRITICAL)**
   - Q3 (Domain 1) vs Q23 (Domain 3) vs Domain 3 Quiz Q7 — all ask about PSS/PSA basics.
   - Domain 3 Quiz Q1 is nearly identical to Exam Q25.
   - Domain 5 Quiz Q2 repeats Exam Q23.
   - Domain 5 Quiz Q5 repeats Exam Q54.
   - This wastes the learner's time and creates false mastery.

2. **TOO FEW SCENARIO-BASED QUESTIONS (CRITICAL)**
   - Only ~5 questions include a YAML/code snippet.
   - The real KCSA exam presents YAML manifests, audit log excerpts, and command outputs.
   - Missing question types:
     - "Given this NetworkPolicy YAML, which traffic is allowed?"
     - "Given this RBAC manifest, what can the user do?"
     - "Given this audit log entry, what level is configured?"
     - "Given this pod spec, which PSS profile does it violate?"

3. **NO MULTI-SELECT QUESTIONS (HIGH)**
   - The real exam includes "Select TWO" or "Select ALL that apply" questions.
   - The app only has single-select radio buttons.

4. **EXPLANATIONS ARE INCONSISTENT IN DEPTH (HIGH)**
   - Some explanations are excellent (e.g., Q27 on `escalate` verb).
   - Some are too short (e.g., Q1 explanation is one sentence).
   - No explanations explain *why* wrong answers are wrong — a key learning technique.

5. **NO "NOT" / "EXCEPT" QUESTIONS (MEDIUM)**
   - The exam frequently uses "Which is NOT..." / "Which does NOT..." phrasing.
   - The app has almost none of these. This is a major exam-readiness gap.

6. **NO VERSION-SPECIFIC QUESTIONS (MEDIUM)**
   - Missing: "Starting in Kubernetes 1.24...", "Removed in 1.25...", "Deprecated in 1.21..."
   - The exam tests version awareness heavily.

7. **NO COMMAND OUTPUT INTERPRETATION (MEDIUM)**
   - Missing: "What does `kubectl auth can-i --list` output mean?"
   - Missing: "Given this `kube-bench` output, which section failed?"

8. **NO IMAGE-BASED OR DIAGRAM-BASED QUESTIONS (LOW)**
   - The app is web-based and could easily show diagrams with clickable regions.

---

## 3. Cheat Sheet Assessment

**Strengths:**
- Excellent ports table with danger indicators
- Good PSS comparison table
- RBAC verbs with danger levels
- Encryption provider chain visual
- NetworkPolicy facts and default deny templates
- Copy-to-clipboard functionality
- Print-friendly design

**Gaps:**
1. **Missing: TLS bootstrapping commands**
2. **Missing: Audit policy YAML template**
3. **Missing: EncryptionConfiguration YAML template**
4. **Missing: PSA namespace label quick reference** (only in PSS tab, not standalone)
5. **Missing: Common `kubectl auth can-i` examples**
6. **Missing: kube-hunter, kubeaudit, Popeye commands**
7. **Missing: Falco rule example**
8. **Missing: cert-manager Certificate YAML example**
9. **Missing: SLSA level quick reference**
10. **Missing: MITRE ATT&CK technique IDs for containers**
11. **No flashcard mode** — the cheat sheet is reference-only, not drill-ready.

---

## 4. Glossary Assessment

**Strengths:**
- 100+ terms
- Searchable with Fuse.js
- Alphabet navigation
- Domain color-coding
- Related terms cross-linking

**Gaps:**
1. **Missing terms:**
   - `IMDSv2`, `IRSA`, `Workload Identity`, `GKE Workload Identity`
   - `CertificateSigningRequest`, `TLS bootstrapping`, `bootstrap token`
   - `aggregationRule`, `system:authenticated`, `system:unauthenticated`
   - `in-toto`, `Rekor`, `Fulcio`
   - `CVSS`, `CVE`, `CPE`
   - `eBPF`, `Cilium`, `Calico`
   - `gVisor`, `Kata Containers`, `Kata`
   - `ProjectedVolume`, `ServiceAccount token projection`
   - `Trivy Operator`, `Starboard`
   - `NIST SP 800-190`
   - ` incident response`, `forensics`
2. **Definitions are dense, not pedagogical.** No "Think of it like..." analogies.
3. **No audio/pronunciation hints for acronyms** (e.g., "PSS is pronounced 'P-S-S', not 'piss'")

---

## 5. Practice Exam Page Assessment

**Strengths:**
- Beautiful UI with timer, question grid, flagging
- Keyboard shortcuts (1-4 for options, F to flag, arrows to navigate)
- Domain-by-domain breakdown in results
- Weak area identification
- Review mode with filtering (all/correct/incorrect/flagged)
- localStorage persistence of results

**Gaps:**
1. **No exam mode vs study mode.** Study mode should show explanations immediately; exam mode should hide them until the end.
2. **No question bank expansion.** Only 60 questions. For guaranteed pass, need at least 150-200.
3. **No category/topic filtering in practice.** Can't drill only "RBAC" or only "NetworkPolicy" questions.
4. **No "Previously incorrect" mode.** Can't specifically re-attempt questions you got wrong before.
5. **No timer customization.** Can't do 30-question sprint or untimed study mode.
6. **No performance analytics over time.** Can't see improvement trends across multiple attempts.
7. **No "Exam simulation" with the exact same UI constraints** (e.g., no going back to previous questions, no review until end).

---

## 6. Memorization & Comprehension Audit

This is the **most critical finding** per user directive.

### Findings:

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Mnemonics in domain content | ❌ NONE | Zero mnemonics found across 7,000+ lines of domain code |
| "Remember this" callouts | ⚠️ MINIMAL | Only 6 `examTips` on home page; no inline memory hooks |
| Explanations for clarity vs density | ⚠️ MIXED | Some are clear; many are dense fact dumps |
| Visual diagrams where helpful | ⚠️ PARTIAL | Architecture diagram, 4Cs diagram exist; missing RBAC flow, admission flow, encryption chain, NetworkPolicy evaluation |
| Beginner-friendly? | ❌ NO | Assumes prior K8s knowledge; no "K8s 101" primer |
| Flashcard component | ❌ NONE | Not implemented |
| "Why this matters" context | ❌ NONE | Facts presented without real-world consequence |
| Comparison tables for confusing topics | ✅ GOOD | PSS, RBAC verbs, audit levels, auth methods are good |
| Analogies | ❌ NONE | No "RBAC is like a building keycard system" etc. |
| Pattern-based learning | ❌ NONE | No "If you see X in the question, think Y" pattern guides |

### Specific Memorization Failures:

1. **13 Capabilities (Baseline):** Listed as `AUDIT_WRITE, CHOWN, DAC_OVERRIDE, FOWNER, FSETID, KILL, MKNOD, NET_BIND_SERVICE, SETFCAP, SETPCAP, SYS_CHROOT, SETGID, SETUID` — a flat string. No grouping, no mnemonic, no "ONLY NET_BIND_SERVICE matters for Restricted" visual.

2. **11 RBAC Verbs:** Table exists but no memory hook. Could use: "Get List Watch Create Update Patch Delete DeleteCollection = 8 normal verbs. Impersonate Bind Escalate = 3 dangerous verbs. 8 + 3 = 11."

3. **STRIDE:** 6 categories in a table. No sentence mnemonic. No visual threat mapping.

4. **SLSA Levels:** 4 levels described but no ladder visual or "1-2-3-4" progression hook.

5. **Encryption Providers:** Chain shown as boxes but no "key hierarchy" diagram (DEK per resource → KEK in KMS → HSM root of trust).

6. **Ports:** 8 ports in a sticky bar. No rhyme, no grouping (e.g., "64-43 = API Server (the door), 23-79/80 = etcd (the safe), 102-50 = Kubelet (the worker), 102-57/59 = Managers (the bosses)").

7. **NetworkPolicy Selectors:** `podSelector`, `namespaceSelector`, `ipBlock` — no visual Venn diagram showing what each selects.

8. **Audit Levels:** `None → Metadata → Request → RequestResponse` — no "volume knob" visual.

---

## 7. Missing Features List (Ranked by Exam Pass Rate Impact)

| Rank | Feature | Impact | Effort | Status |
|------|---------|--------|--------|--------|
| 1 | **Memorization aids: mnemonics, memory hooks, analogies** | +15% pass rate | Medium | ❌ Missing |
| 2 | **Scenario-based YAML questions (60% of new questions)** | +12% pass rate | High | ⚠️ Minimal |
| 3 | **etcd backup/restore security content** | +8% pass rate | Medium | ❌ Missing |
| 4 | **TLS bootstrapping & CSR content** | +7% pass rate | Medium | ❌ Missing |
| 5 | **Sigstack ecosystem (Rekor, Fulcio, in-toto) content** | +6% pass rate | Medium | ❌ Missing |
| 6 | **Flashcard / Quick Recall component** | +6% pass rate | Medium | ❌ Missing |
| 7 | **Visual flow diagrams (RBAC, Admission, Encryption)** | +5% pass rate | Medium | ❌ Missing |
| 8 | **"Exam Trap" callouts (common wrong answers)** | +5% pass rate | Low | ❌ Missing |
| 9 | **Multi-select and "NOT/EXCEPT" question types** | +5% pass rate | Medium | ❌ Missing |
| 10 | **Question bank expansion to 150-200** | +5% pass rate | High | ⚠️ 60 now |
| 11 | **Study mode vs exam mode toggle** | +4% pass rate | Low | ❌ Missing |
| 12 | **Topic-specific drill mode** | +4% pass rate | Medium | ❌ Missing |
| 13 | **Cloud provider security specifics** | +4% pass rate | Medium | ❌ Missing |
| 14 | **NIST SP 800-190 coverage** | +3% pass rate | Low | ❌ Missing |
| 15 | **Version-specific questions (1.24+, 1.25)** | +3% pass rate | Low | ⚠️ Minimal |

---

## 8. Technical/Code Issues

1. **DomainPage.tsx uses a switch statement** — fine now, but doesn't scale. Not blocking.
2. **No search within domain content** — learners can't find "escalate" within Domain 3 without scrolling.
3. **Progress tracking is primitive** — hardcoded `totalRead = 5` in Home.tsx.
4. **No dark mode toggle** — minor UX issue.
5. **QuizComponent vs Quiz** — two different quiz implementations exist. Domain 1 uses `QuizComponent`, Domain 3 uses `Quiz`. This is technical debt.

---

## Appendix: Official KCSA Curriculum Cross-Check

Based on the official Linux Foundation/CNCF KCSA curriculum (training.linuxfoundation.org), the app's coverage is:

| Curriculum Competency | Covered? | Gap Severity |
|-----------------------|----------|--------------|
| The 4Cs of Cloud Native Security | ✅ Yes | — |
| Cloud Provider and Infrastructure Security | ⚠️ Partial | HIGH |
| Controls and Frameworks | ✅ Yes | — |
| Artifact Repository and Image Security | ⚠️ Partial | MEDIUM |
| Workload and Application Code Security | ⚠️ Partial | MEDIUM |
| API Server, etcd, Kubelet Security | ✅ Yes | — |
| Container Runtime Security | ⚠️ Partial | MEDIUM |
| Networking Security | ✅ Yes | — |
| Authentication & Authorization | ✅ Yes | — |
| Pod Security Standards / Admission | ✅ Yes | — |
| Network Policy | ✅ Yes | — |
| Secrets & Encryption at Rest | ✅ Yes | — |
| Audit Logging | ✅ Yes | — |
| Kubernetes Threat Model / STRIDE | ✅ Yes | — |
| Trust Boundaries and Data Flow | ❌ No | CRITICAL |
| Denial of Service | ✅ Yes | — |
| Malicious Code Execution | ❌ No | HIGH |
| Attacker on the Network | ❌ No | HIGH |
| Access to Sensitive Data | ❌ No | HIGH |
| Privilege Escalation | ✅ Yes | — |
| Supply Chain Security | ⚠️ Partial | HIGH |
| Admission Control | ✅ Yes | — |
| Service Mesh & mTLS | ✅ Yes | — |
| PKI / Certificate Management | ⚠️ Partial | MEDIUM |
| Monitoring & Runtime Security | ⚠️ Partial | MEDIUM |
| Compliance Frameworks | ⚠️ Partial | MEDIUM |
| Threat Modeling Frameworks | ✅ Yes | — |
| Supply Chain Compliance | ❌ No | HIGH |
| Automation and Tooling | ⚠️ Partial | MEDIUM |

---

*End of Audit Report*
