# KCSA Exam Prep — Pass Guarantee Plan

**Goal:** Transform the current app from a "solid review tool" (6.5/10) into a **"guaranteed pass" resource** (9.5/10).

**Strategy:** Fix critical content gaps first, then layer in memorization scaffolding, then expand question quality and volume.

---

## Phase 1: Critical Gaps (Must Fix Before Exam)

> **Time Estimate:** 2-3 weeks of focused work  
> **Impact:** These alone can account for **30-40% of exam questions.** Missing them guarantees failure.

---

### 1.1 Memorization & Comprehension Infrastructure (TOP PRIORITY)

**Why this is #1:** The user explicitly identified that the app is "critically lacking memorization tips and clear understanding aids." A learner who reads everything but remembers nothing will fail.

#### Action 1.1.1: Create a `MemoryHook` Callout Component

- **File:** `src/components/MemoryHook.tsx`
- **Design:** Distinct visual style (e.g., brain icon 🧠, purple border, light purple background) — visually different from `Callout`/`CalloutBox`
- **Usage:** Inject into every domain page where rote memorization is required
- **Content pattern:**
  - **Mnemonic:** A memory sentence, rhyme, or acronym expansion
  - **Analogy:** "Think of it like..." real-world comparison
  - **Pattern:** "If the exam says X, answer Y"
  - **Why:** One-sentence real-world consequence

**Concrete targets for MemoryHooks:**

| Topic | MemoryHook Content | Location |
|-------|-------------------|----------|
| 4Cs | "Cloud, Cluster, Container, Code — **C**ommanders **C**ontrol **C**ontainers' **C**ode" | Domain 1 |
| 13 Baseline Capabilities | Grouped mnemonic: "AUDIT + CHOWN + DAC_OVERRIDE + FOWNER + FSETID + KILL + MKNOD + NET_BIND_SERVICE + SETFCAP + SETPCAP + SYS_CHROOT + SETGID + SETUID = **13**. Remember: Restricted drops ALL except **NET_BIND_SERVICE** (the only one that matters for the exam)." | Domain 3 |
| 11 RBAC Verbs | "8 normal + 3 dangerous = 11. **BEI** the privilege escalator: **B**ind, **E**scalate, **I**mpersonate." | Domain 3 |
| STRIDE | "**S**ome **T**hieves **R**ob **I**mportant **D**ata **E**very **D**ay" → Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege | Domain 4 |
| SLSA Levels | "1 = Provenance, 2 = Signed, 3 = Hardened, 4 = Two-person review. Think of a **safe**: 1=you wrote what's inside, 2=you locked it, 3=it's in a vault, 4=two guards check the vault." | Domain 5 |
| Ports | "**64-43** = API Server (the front door). **23-79/80** = etcd (the bank vault — client + peer). **102-50** = Kubelet (the worker's radio). **102-57/59** = The bosses (Controller + Scheduler). **102-48** = Health check (no auth). **102-55** = DANGER (read-only, disable it)." | Domain 2 / Cheat Sheet |
| Encryption Chain | "identity = **NO** encryption. aescbc = **OLD**. aesgcm = **GOOD**. secretbox = **BETTER**. kms v1 = **EXTERNAL**. kms v2 = **BEST** (exam answer)." | Domain 2 |
| Audit Levels | "None → Metadata → Request → RequestResponse. Think of a **volume knob**: 0=silent, 1=who called, 2=what they sent, 3=everything including the response." | Domain 3 |
| NetworkPolicy Selectors | Visual mnemonic: `podSelector` = "pods in THIS room", `namespaceSelector` = "pods in OTHER rooms with matching name tags", `ipBlock` = "specific phone numbers" | Domain 3 |
| PSS Profiles | "**Privileged** = wild west. **Baseline** = no guns, no host break-in. **Restricted** = minimum security prison." | Domain 3 |
| MITRE Techniques | "T1611 = Escape to Host (Privilege Escalation). T1610 = Deploy Container (Execution). T1552.007 = Steal API creds. T1053.003 = CronJob (Persistence)." | Domain 4 |

#### Action 1.1.2: Add "Why This Matters" Context to Dry Facts

Every `CodeBlock` or table showing a security setting must be followed by a `<Callout variant="warning" title="Why This Matters">` explaining the real-world exploit consequence.

**Examples to add:**
- `--anonymous-auth=false`: "Without this, anyone on the internet can query your API Server. This is how clusters get discovered and exploited by Shodan scanners."
- `readOnlyRootFilesystem: true`: "If an attacker compromises this pod, they can't install malware or modify binaries. They can only write to explicitly mounted volumes."
- `hostPID: true`: "This lets the container see ALL host processes. An attacker can use `nsenter` to escape into the host namespace and gain root."
- Default-deny NetworkPolicy: "Without this, a compromised frontend pod can directly reach your database pod. NetworkPolicy is your zero-trust network."

#### Action 1.1.3: Create Visual Flow Diagrams

| Diagram | Topic | File | Description |
|---------|-------|------|-------------|
| RBAC Flow | Domain 3 | `src/components/RBACFlowDiagram.tsx` | `kubectl` → `AuthN (who are you?)` → `AuthZ/RBAC (what can you do?)` → `Admission (should we allow it?)` → `etcd (store it)` |
| Admission Pipeline | Domain 2/3/5 | `src/components/AdmissionPipelineDiagram.tsx` | Mutating controllers (LimitRanger, ServiceAccount) → Validating controllers (NodeRestriction, ResourceQuota, PodSecurity) → `etcd`. Show that mutating runs FIRST. |
| Encryption Chain | Domain 2 | `src/components/EncryptionChainDiagram.tsx` | Pod Secret → `base64` (not encryption) → `aescbc/aesgcm/secretbox` (DEK) → `kms v1/v2` (KEK in HSM). Visual triangle showing DEK per resource, KEK in KMS, HSM root. |
| ServiceAccount Token Lifecycle | Domain 2 | `src/components/TokenLifecycleDiagram.tsx` | Legacy token (long-lived Secret) vs Bound token (TokenRequest API → projected volume → short-lived → auto-rotated). Show the 1.24 timeline. |
| NetworkPolicy Evaluation | Domain 3 | `src/components/NetpolEvaluationDiagram.tsx` | Show a pod with multiple policies. Ingress rules OR together. Egress rules OR together. Both ingress AND egress must allow traffic for it to flow. |
| Supply Chain Security | Domain 5 | `src/components/SupplyChainDiagram.tsx` | Source (Git) → Build (CI/CD, SLSA provenance) → Package (Registry, SBOM, Cosign sign) → Deploy (Admission verify) → Runtime (Falco monitor). |
| STRIDE → Kubernetes Mapping | Domain 4 | `src/components/StrideK8sDiagram.tsx` | Circular diagram: Spoofing (stolen SA token) → Tampering (etcd direct access) → Repudiation (missing audit logs) → Info Disclosure (unencrypted secrets) → DoS (resource exhaustion) → Elevation (privileged container) → back to Spoofing. |

**Implementation note:** These should be SVG-based or CSS-based (not image files) so they render sharply and can be printed.

#### Action 1.1.4: Create a "Quick Recall" / Flashcard Page

- **File:** `src/pages/QuickRecall.tsx`
- **Route:** `/quick-recall`
- **Design:** Full-screen flashcard interface. Card shows question/prompt on front. Click or press Space to flip. Arrow keys to navigate.
- **Content sources:**
  - Ports (front: "API Server port?" back: "6443 (HTTPS)")
  - PSS rules (front: "Restricted: capabilities?" back: "Drop ALL; only NET_BIND_SERVICE addable")
  - RBAC verbs (front: "What does 'bind' allow?" back: "Binding any role to yourself = privilege escalation")
  - Encryption (front: "Recommended provider?" back: "KMS v2")
  - SLSA (front: "Level 4 requirement?" back: "Two-person review + reproducible builds")
  - MITRE (front: "T1611?" back: "Escape to Host (Privilege Escalation)")
  - Frameworks (front: "PCI DSS scope?" back: "Payment card data — network segmentation, encryption, audit logging")
- **Modes:** Shuffle, Filter by domain, "Only missed" (integrates with quiz performance)

#### Action 1.1.5: Add "Exam Trap" Callouts

A new `Callout` variant or dedicated component: `ExamTrap` (red border, skull icon ☠️ or trap icon).

Content examples:
- "Trap: The exam shows `pod-security.kubernetes.io/enforce: restricted` and asks what happens. The answer is REJECT violating pods — NOT 'warn' or 'audit'."
- "Trap: `namespaceSelector` selects by LABEL, not by NAME. But Kubernetes auto-adds `kubernetes.io/metadata.name: <namespace-name>` as a label."
- "Trap: Base64 is NOT encryption. Secrets are base64-encoded by default in etcd. You need `EncryptionConfiguration` for real protection."
- "Trap: A RoleBinding CAN reference a ClusterRole. The permissions are then scoped to the RoleBinding's namespace."
- "Trap: `privileged: true` is forbidden by BOTH Baseline and Restricted. Don't think Baseline allows it."
- "Trap: The first NetworkPolicy on a pod ISOLATES that direction. Default is allow-all. Adding a policy changes the default for that pod+direction."
- "Trap: `impersonate` lets you ACT AS another user. `escalate` lets you CREATE roles with more permissions. `bind` lets you ATTACH any role to yourself."

---

### 1.2 Critical Content Gaps (Exam-Blocking)

#### Action 1.2.1: Add etcd Backup/Restore Security Section

- **Location:** Domain 2, between "etcd Security" and "Kubelet"
- **Content:**
  - `etcdctl snapshot save` command
  - Why backups contain ALL secrets (must be encrypted)
  - Storing backups in object storage with encryption (S3 SSE-KMS, etc.)
  - Restore procedure and security implications
  - **MemoryHook:** "etcd backup = photocopy of the vault. If you leave it on the desk, anyone can read it."

#### Action 1.2.2: Add TLS Bootstrapping / CSR Section

- **Location:** Domain 2, in "Client Security (ServiceAccounts)" or as a new subsection
- **Content:**
  - How new nodes join: bootstrap token → CSR → approval → certificate
  - `CertificateSigningRequest` resource
  - `kubectl certificate approve/deny`
  - Node auto-approval risks
  - **MemoryHook:** "Bootstrap = temp ID card → HR checks you → issues real badge."

#### Action 1.2.3: Expand Supply Chain Security (Sigstore Ecosystem)

- **Location:** Domain 5, Section 5.1
- **Content to add:**
  - **Rekor:** Transparency log — "who signed what when"
  - **Fulcio:** CA for keyless signing — "ID card for builds"
  - **in-toto:** Supply chain attestation framework — "provenance paper trail"
  - SLSA provenance generation (not just the levels)
  - **MemoryHook:** "Sigstore = Cosign (the pen) + Rekor (the logbook) + Fulcio (the notary)."

#### Action 1.2.4: Add Trust Boundaries and Data Flow Section

- **Location:** Domain 4, as a new top-level section before STRIDE
- **Content:**
  - Define trust boundary: "where data crosses between components with different privilege levels"
  - Key Kubernetes trust boundaries: User→API Server, Pod→Pod, Pod→Node, Container→Host, Cluster→Cloud Metadata
  - Data flow diagram: Request enters → API Server → AuthN/AuthZ → Admission → etcd / Kubelet / Other pods
  - **MemoryHook:** "Trust boundaries are like airport security checkpoints. You must verify identity and intent at each one."

#### Action 1.2.5: Add "Attacker on the Network" Section

- **Location:** Domain 4, new section
- **Content:**
  - Flat network problem (already covered but reframe as "attacker on the network")
  - Cloud metadata service abuse (169.254.169.254)
  - ARP spoofing / DNS hijacking in container networks
  - NetworkPolicy as the primary defense
  - Service mesh mTLS as defense-in-depth
  - **MemoryHook:** "In K8s, every pod is on the same LAN. An attacker on the LAN can reach everything unless you segment."

#### Action 1.2.6: Add NIST SP 800-190 Coverage

- **Location:** Domain 6, in "NIST & Standards"
- **Content:**
  - NIST SP 800-190 is the "Application Container Security Guide"
  - Covers image security, registry security, orchestrator security, container runtime security
  - **MemoryHook:** "800-190 = 1-9-0 = 'One Container Security Guide' — NIST's container-specific book."

#### Action 1.2.7: Add Cloud Provider Security Specifics

- **Location:** Domain 1, new subsection "Cloud Provider Security"
- **Content:**
  - AWS: IAM roles for service accounts (IRSA), IMDSv2, private EKS clusters
  - GCP: Workload Identity, private GKE clusters, shielded nodes
  - Azure: AKS managed identity, private clusters, Azure Policy for K8s
  - **MemoryHook:** "Cloud provider secures the foundation. You secure what you build on it."

---

### 1.3 Question Bank Critical Fixes

#### Action 1.3.1: Remove or Rewrite Duplicates

| Duplicate Set | Action |
|---------------|--------|
| Q3 (D1), Q23 (D3), D3-Quiz-Q7 | Keep ONE in Domain 3. Rewrite D1 version to focus on "which layer handles image signing?" |
| D3-Quiz-Q1 vs Exam Q25 | D3-Quiz-Q1 → change to "Which capability is allowed in Baseline but NOT in Restricted?" |
| D5-Quiz-Q2 vs Exam Q23 | D5-Quiz-Q2 → change to "What is the difference between PSA and OPA Gatekeeper?" |
| D5-Quiz-Q5 vs Exam Q54 | D5-Quiz-Q5 → change to "Which tool detects anomalous syscalls at runtime AND logs to stdout?" |

#### Action 1.3.2: Add 20 Scenario-Based YAML Questions

These are the **highest-yield** question type for the real exam.

**Templates to create:**
1. "Given this pod spec, which PSS profile does it violate?" (show YAML with `privileged: true` or `hostPID: true`)
2. "Given this NetworkPolicy, can pod A reach pod B?" (show YAML with ingress/egress rules)
3. "Given this RBAC manifest, what can the user do?" (show Role + RoleBinding)
4. "Given this audit log entry, what is the audit level?" (show JSON with requestBody + responseBody)
5. "Given this EncryptionConfiguration, which provider is used for NEW secrets?" (show YAML with provider list)
6. "Given this ServiceAccount manifest, what type of token will be mounted?" (show `automountServiceAccountToken: false` vs legacy)
7. "Given this admission controller list, which one is MUTATING?" (show `--enable-admission-plugins` flag)
8. "Given this kube-bench output, which CIS section failed?" (show output text)
9. "Given this namespace label, what happens to a violating pod?" (show `enforce: restricted`)
10. "Given this container runtime config, which security feature is enabled?" (show seccomp profile path)

**Add 2 of each = 20 questions.** Distribute across domains.

#### Action 1.3.3: Add 10 "NOT/EXCEPT" Questions

Examples:
- "Which of the following is NOT a mutating admission controller?"
- "Which capability is NOT allowed in the Baseline PSS profile?"
- "Which port should NOT be exposed to the network?"
- "Which of the following does NOT prevent container escape?"
- "Which framework is NOT primarily used for threat modeling?"

#### Action 1.3.4: Add 10 Multi-Select Questions

The app's `QuizComponent` needs to support `type: 'multi-select'` with checkboxes instead of radio buttons.

Examples:
- "Select TWO admission controllers that are validating."
- "Select ALL capabilities allowed in Baseline."
- "Select THREE requirements of SLSA Level 3."
- "Select ALL tools that perform runtime security detection."

#### Action 1.3.5: Add 5 Version-Specific Questions

- "Starting in Kubernetes 1.24, what changed about ServiceAccount tokens?"
- "Which feature was removed in Kubernetes 1.25?"
- "Which port changed from HTTP to HTTPS between older and modern Kubernetes?"
- "Since Kubernetes 1.24, which token type is preferred?"
- "PodSecurityPolicy was deprecated in 1.21 and removed in which version?"

#### Action 1.3.6: Expand Domain 6 to 6 Questions

Add 2 more Domain 6 questions to match the 10% weight proportionally.

Topics:
- "Which NIST publication is specifically about container security?" (SP 800-190)
- "What is the difference between CIS Benchmark Level 1 and Level 2?"

---

## Phase 2: Quality Improvements (Nice to Have)

> **Time Estimate:** 1-2 weeks  
> **Impact:** Separates a "pass" from a "confident pass."

---

### 2.1 Cheat Sheet Expansion

| Addition | Content |
|----------|---------|
| TLS Bootstrapping commands | `kubeadm token create`, `kubectl certificate approve` |
| Audit policy YAML template | Full `AuditPolicy` with rules for Secrets, RBAC, pods |
| EncryptionConfiguration YAML | `apiVersion: apiserver.config.k8s.io/v1`, `providers` list |
| PSA label quick ref | `enforce/warn/audit` × `privileged/baseline/restricted` matrix |
| Falco rule snippet | `rule: Terminal Shell in Container` example |
| cert-manager Certificate YAML | `kind: Certificate`, `issuerRef`, `secretName` |
| kube-hunter command | `kube-hunter --remote some.node.com` |
| MITRE technique quick ref | T1611, T1610, T1552.007, T1053.003 with descriptions |
| SLSA level quick ref | 1-4 in one-line summaries |
| CVSS severity scale | Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9) |

### 2.2 Glossary Expansion

Add these missing high-yield terms:

| Term | Definition |
|------|------------|
| `IMDSv2` | AWS Instance Metadata Service v2 — session-based, protects against metadata service abuse |
| `IRSA` | IAM Roles for Service Accounts — AWS way to give pods IAM roles without node credentials |
| `Workload Identity` | GCP/Azure equivalent of IRSA — maps K8s SA to cloud IAM |
| `CertificateSigningRequest` | K8s resource for requesting x509 certificates; used in TLS bootstrapping |
| `Bootstrap Token` | Short-lived token used for node join and TLS bootstrapping |
| `aggregationRule` | RBAC feature allowing ClusterRoles to be composed from other ClusterRoles |
| `in-toto` | Framework for software supply chain integrity through attestations |
| `Rekor` | Sigstore transparency log for signed artifacts |
| `Fulcio` | Sigstore CA for keyless code signing via OIDC |
| `CVSS` | Common Vulnerability Scoring System — severity metric for CVEs |
| `eBPF` | Extended Berkeley Packet Filter — kernel technology for observability and security |
| `Cilium` | eBPF-based CNI with L7 policy and service mesh capabilities |
| `Projected Volume` | Volume type that mounts multiple sources (including SA tokens) into one dir |
| `NIST SP 800-190` | NIST Application Container Security Guide |

### 2.3 Practice Exam Feature Enhancements

| Feature | Description | Effort |
|---------|-------------|--------|
| **Study Mode vs Exam Mode** | Toggle: Study = instant explanation; Exam = hide until end | Low |
| **Topic Drill** | Filter practice exam by topic ("Only RBAC questions", "Only NetworkPolicy") | Medium |
| **Previously Incorrect Mode** | Load only questions the user got wrong in past attempts | Medium |
| **Timer Customization** | 30-question sprint (45 min), 60-question full (90 min), untimed | Low |
| **Performance Analytics** | Chart showing score trends across attempts per domain | Medium |
| **Question Bank 150+** | Expand from 60 to at least 150 questions | High |
| **Shuffled Answers** | Randomize option order on each attempt | Low |
| **Explanation Enhancement** | For every wrong answer in a question, add a one-line "Why this is wrong" | Medium |

### 2.4 Domain Content Depth Improvements

| Domain | Improvement |
|--------|-------------|
| 1 | Add OWASP Top 10 for containers, dependency confusion, secure coding checklist |
| 2 | Add API Server request lifecycle diagram, CNI security comparison (Calico vs Cilium), static pod risks |
| 3 | Add default RBAC roles explainer (`cluster-admin`, `edit`, `view`), webhook auth flow diagram, ABAC vs RBAC comparison table |
| 4 | Add cloud metadata abuse section, compromised application behaviors, mutating webhook risks |
| 5 | Add Vault/External Secrets Operator, Cilium service mesh, SPIFFE/SPIRE basics, OPA Rego syntax primer |
| 6 | Add PCI DSS K8s mapping, HIPAA technical safeguards mapping, incident response framework basics |

### 2.5 UX/Polish Improvements

| Feature | Description | Effort |
|---------|-------------|--------|
| Search within domain pages | Ctrl+F-style search scoped to current domain content | Medium |
| Dark mode toggle | `dark` class on html + CSS variables | Low |
| Print-optimized domain pages | `@media print` styles for each domain | Low |
| Progress tracking fix | Replace hardcoded `totalRead = 5` with actual scroll/localStorage tracking | Low |
| Consolidate quiz components | Merge `QuizComponent` and `Quiz` into one reusable component | Medium |
| Breadcrumbs on all pages | Domain 3 has breadcrumbs; add to Domains 1, 2, 4, 5, 6 | Low |
| Scroll progress on all domains | Domain 5 has a scroll progress bar; add to all | Low |

---

## Phase 3: Memorization & Comprehension Improvements (Detailed Spec)

This section is a **standalone implementation guide** for the memorization work, since it was declared top priority.

### 3.1 Component Spec: `MemoryHook.tsx`

```tsx
// src/components/MemoryHook.tsx
interface MemoryHookProps {
  mnemonic?: string;      // e.g., "BEI the privilege escalator"
  analogy?: string;       // e.g., "RBAC is like a building keycard system..."
  pattern?: string;         // e.g., "If the exam mentions 'drop ALL', think Restricted"
  why?: string;             // e.g., "Without this, any pod can reach any other pod"
  visual?: ReactNode;       // Optional inline SVG or emoji diagram
}
```

**Styling:**
- Border: `2px solid var(--accent-lavender)` (#9B87F5)
- Background: `rgba(155, 135, 245, 0.08)`
- Icon: Brain or Sparkles (lucide-react)
- Title: "🧠 Memory Hook" or "🔥 Remember This"

**Placement rules:**
- One MemoryHook per memorization-heavy subsection
- Always placed AFTER the factual content, never before
- Group related MemoryHooks in a "Memory Corner" at the end of a section for review

### 3.2 Component Spec: `ExamTrap.tsx`

```tsx
// src/components/ExamTrap.tsx
interface ExamTrapProps {
  trap: string;             // The common mistake
  explanation: string;    // Why it's wrong
  correctThinking: string; // How to approach it
}
```

**Styling:**
- Border: `2px solid var(--accent-coral)` (#E87A5D)
- Background: `rgba(232, 122, 93, 0.08)`
- Icon: Skull or AlertOctagon
- Title: "☠️ Exam Trap"

**Placement rules:**
- One ExamTrap per section where the exam historically tricks candidates
- Place near the quiz section as a "before you test" reminder

### 3.3 Page Spec: `QuickRecall.tsx`

**Route:** `/quick-recall`
**Nav link:** Add to Home page "Quick Access" grid and Navbar

**Features:**
- Keyboard shortcuts: Space = flip, ←/→ = navigate, F = flag for review
- Progress bar: "47/150 mastered"
- Modes:
  - **Shuffle:** Random order
  - **By Domain:** Filter cards
  - **Weak Areas:** Pull from lowest-scoring quiz domains
  - **Exam Traps:** Only flagged traps
- Card content sourced from:
  - `src/data/flashcards.ts` (new file)
  - Each card: `{ id, front, back, domain, category, difficulty }`
  - Categories: ports, pss, rbac, encryption, network, audit, slsa, mitre, frameworks, traps

### 3.4 Content Spec: Visual Diagrams

All diagrams should be:
- **SVG-based** for sharp scaling
- **Print-friendly** (black/white readable)
- **A11y-friendly** (aria labels, alt text)
- **No external dependencies** (no D3, no Recharts — plain SVG or CSS)

**Priority order for diagram creation:**
1. RBAC Flow Diagram (highest exam impact)
2. Admission Pipeline Diagram (high exam impact)
3. Encryption Chain Diagram (high exam impact)
4. ServiceAccount Token Lifecycle (medium exam impact)
5. NetworkPolicy Evaluation (medium exam impact)
6. Supply Chain Security (medium exam impact)
7. STRIDE → Kubernetes Mapping (medium exam impact)

### 3.5 Content Spec: "Why This Matters" Callouts

Every security setting in the app should have a consequence sentence.

**Audit task:** Go through each `CodeBlock` in each domain. For every security-related YAML or flag, add a `<Callout variant="warning" title="Why This Matters">` if one doesn't exist.

**Template:**
> Without [this setting], an attacker who [compromises X] can [do Y], leading to [Z consequence]. This is why [best practice].

---

## Implementation Roadmap

### Week 1: Memorization Infrastructure + Critical Content Gaps

| Day | Task |
|-----|------|
| 1 | Build `MemoryHook.tsx` and `ExamTrap.tsx` components. Add 5 MemoryHooks to Domain 3 (highest impact). |
| 2 | Add etcd backup/restore section to Domain 2. Add TLS bootstrapping section to Domain 2. |
| 3 | Add Trust Boundaries + Data Flow section to Domain 4. Add "Attacker on the Network" section to Domain 4. |
| 4 | Expand Sigstore ecosystem in Domain 5 (Rekor, Fulcio, in-toto). Add cloud provider security to Domain 1. |
| 5 | Add NIST SP 800-190 to Domain 6. Add 2 more Domain 6 exam questions. |
| 6 | Create RBAC Flow Diagram + Admission Pipeline Diagram components. Embed in Domains 2/3. |
| 7 | Create Encryption Chain Diagram + Token Lifecycle Diagram. Embed in Domain 2. |

### Week 2: Question Quality + Flashcards

| Day | Task |
|-----|------|
| 8 | Rewrite/remove duplicate questions. Add 10 scenario-based YAML questions. |
| 9 | Add 10 "NOT/EXCEPT" questions. Add 10 multi-select questions (update QuizComponent). |
| 10 | Add 5 version-specific questions. Expand question bank to 100 total. |
| 11 | Build `QuickRecall.tsx` flashcard page. Create `src/data/flashcards.ts` with 100 cards. |
| 12 | Add NetworkPolicy Evaluation Diagram + Supply Chain Diagram. |
| 13 | Add STRIDE→K8s Diagram. Add 5 MemoryHooks per remaining domain. |
| 14 | Add "Why This Matters" callouts to all CodeBlocks in Domains 1-4. |

### Week 3: Polish + Expansion

| Day | Task |
|-----|------|
| 15 | Expand cheat sheet with missing tabs (TLS bootstrap, audit policy, Falco, MITRE). |
| 16 | Expand glossary with 15 missing terms. |
| 17 | Add Study Mode vs Exam Mode to PracticeExam. Add topic drill filter. |
| 18 | Add "Previously Incorrect" mode. Add timer customization. |
| 19 | Expand question bank to 150. Add shuffled answers. |
| 20 | Add search within domain pages. Fix progress tracking. |
| 21 | Consolidate quiz components. Add breadcrumbs to all domains. |

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Total exam questions | 60 | 150+ |
| Scenario-based (YAML/code) questions | ~5 | 30+ |
| "NOT/EXCEPT" questions | ~0 | 15+ |
| Multi-select questions | 0 | 15+ |
| MemoryHook callouts | 0 | 30+ |
| ExamTrap callouts | 0 | 20+ |
| Visual flow diagrams | 2 | 8+ |
| Flashcards | 0 | 100+ |
| Glossary terms | 100 | 115+ |
| Cheat sheet tabs | 8 | 12+ |
| Domain 6 exam questions | 4 | 6+ |
| Content gap coverage (per audit) | ~65% | 95%+ |

---

## Quick Wins (Do These First for Immediate Impact)

If you only have a few hours, do these in order:

1. **Add 5 MemoryHooks to Domain 3** (ports, capabilities, RBAC verbs, PSS, NetworkPolicy)
2. **Add 10 scenario-based YAML questions** (highest exam ROI)
3. **Add etcd backup/restore section to Domain 2** (critical gap)
4. **Add ExamTrap callouts for the 5 most common exam mistakes**
5. **Create the Quick Recall flashcard page with 50 cards** (memorization ROI)

---

*End of Pass Guarantee Plan*
