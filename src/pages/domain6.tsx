import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Layers,
  ShieldCheck,
  BookOpen,
  Target,
  Siren,
  CheckCircle,
  AlertTriangle,
  Fingerprint,
  FileSearch,
  Lock,
  Terminal,
  FlaskConical,
  Bug,
} from 'lucide-react'
import CalloutBox from './components/CalloutBox'
import CodeBlock from './components/CodeBlock'
import QuizCard from './components/QuizCard'
import type { QuizQuestion } from './components/QuizCard'

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: easeOutExpo },
}

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: easeOutExpo },
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which tool runs the CIS Kubernetes Benchmark assessment?',
    options: ['Kubescape', 'kube-bench', 'Falco', 'Trivy'],
    correctIndex: 1,
    explanation: 'kube-bench is the open-source tool by Aqua Security that checks whether Kubernetes is deployed according to security best practices as defined in the CIS Kubernetes Benchmark. It produces PASS/FAIL/WARN/INFO results.',
  },
  {
    id: 2,
    question: 'How many safeguards are in CIS Controls v8?',
    options: ['12', '15', '18', '20'],
    correctIndex: 2,
    explanation: 'CIS Controls v8 contains 18 safeguards covering areas like asset inventory, software inventory, data protection, secure configuration, account management, access control, vulnerability management, and audit log management.',
  },
  {
    id: 3,
    question: 'What does PASTA stand for?',
    options: [
      'Process for Attack Simulation and Threat Analysis',
      'Platform for Advanced Security Threat Assessment',
      'Program for Automated Security Testing and Analysis',
      'Protocol for Advanced Security Threat Avoidance',
    ],
    correctIndex: 0,
    explanation: 'PASTA stands for "Process for Attack Simulation and Threat Analysis." It is a seven-stage risk-centric threat modeling methodology that includes defining objectives, scope, application decomposition, threat analysis, vulnerability detection, attack enumeration, and risk/impact analysis.',
  },
  {
    id: 4,
    question: 'Which framework provides a tactics/techniques matrix for container attacks?',
    options: ['STRIDE', 'OCTAVE', 'MITRE ATT&CK', 'PASTA'],
    correctIndex: 2,
    explanation: 'MITRE ATT&CK for Containers provides a matrix of tactics and techniques specifically for containerized environments. It includes tactics like Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, and Impact.',
  },
  {
    id: 5,
    question: 'What SLSA level requires signed build provenance?',
    options: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    correctIndex: 1,
    explanation: 'SLSA Level 2 requires signed build provenance and a hosted build service. Level 1 only requires provenance to exist (documented). Level 3 adds hardened build platforms and hermetic builds. Level 4 adds two-person review and reproducible builds.',
  },
  {
    id: 6,
    question: 'What is the difference between CIS Benchmark Level 1 and Level 2?',
    options: [
      'Level 1 is for testing, Level 2 is for production',
      'Level 1 is practical/minimally restrictive; Level 2 is defense in depth',
      'Level 1 is free, Level 2 requires a paid license',
      'Level 1 checks API server; Level 2 checks worker nodes',
    ],
    correctIndex: 1,
    explanation: 'CIS Benchmark Level 1 recommendations are practical, minimally restrictive, and designed to lower the attack surface while maintaining functionality. Level 2 recommendations provide defense in depth and may impact functionality — they are for environments with stronger security requirements.',
  },
  {
    id: 7,
    question: 'Which tool generates RBAC rules from audit logs showing actual usage?',
    options: ['kubectl auth can-i', 'audit2rbac', 'kube-bench', 'Kubescape'],
    correctIndex: 1,
    explanation: 'audit2rbac generates RBAC role and clusterrole resources from Kubernetes audit logs, showing the actual permissions that workloads use. kubectl auth can-i checks permissions but does not generate roles from audit data.',
  },
  {
    id: 8,
    question: 'What does OCTAVE focus on?',
    options: [
      'Automated vulnerability scanning',
      'Operationally critical risk assessment, organization-driven',
      'Container runtime security',
      'Network policy enforcement',
    ],
    correctIndex: 1,
    explanation: 'OCTAVE (Operationally Critical Threat, Asset, and Vulnerability Evaluation) is a risk-based strategic assessment framework. It has three phases: build asset-based threat profiles, identify infrastructure vulnerabilities, and develop security strategy. It is self-directed and organization-driven.',
  },
  {
    id: 9,
    question: 'Which NIST CSF 2.0 function was newly added in the 2.0 update?',
    options: ['Identify', 'Protect', 'Govern', 'Detect'],
    correctIndex: 2,
    explanation: 'GOVERN (GV) is the newly added sixth function in NIST CSF 2.0 (2024). It establishes cybersecurity risk management strategy, expectations, policy, and oversight. The other five functions (Identify, Protect, Detect, Respond, Recover) were present in CSF 1.1.',
  },
  {
    id: 10,
    question: 'What does the DREAD risk assessment model evaluate?',
    options: [
      'Damage, Reproducibility, Exploitability, Affected Users, Discoverability',
      'Data, Resources, Encryption, Access, Detection',
      'Defense, Response, Exploitability, Attack Surface, Damage',
      'Deployment, Risk, Exposure, Attack Vector, Defense',
    ],
    correctIndex: 0,
    explanation: 'DREAD evaluates threats based on five components: Damage Potential, Reproducibility, Exploitability, Affected Users, and Discoverability. Each component is scored, and the final risk score is the average of all five.',
  },
]

const complianceFrameworks = [
  {
    name: 'CIS Controls',
    scope: 'General IT security',
    k8s: '18 safeguards, CIS Kubernetes Benchmark',
  },
  {
    name: 'NIST SP 800-53',
    scope: 'Federal systems',
    k8s: 'Security controls mapping (AC, AU, CM, SC, SI families)',
  },
  {
    name: 'NIST SP 800-190',
    scope: 'Container security',
    k8s: 'Specific container security guidance',
  },
  {
    name: 'NIST CSF 2.0',
    scope: 'Cybersecurity risk',
    k8s: 'Govern, Identify, Protect, Detect, Respond, Recover',
  },
  {
    name: 'PCI DSS',
    scope: 'Payment card data',
    k8s: 'Network segmentation, encryption, audit logging',
  },
  {
    name: 'HIPAA',
    scope: 'Healthcare data',
    k8s: 'PHI protection, encryption at rest/in transit',
  },
  {
    name: 'GDPR',
    scope: 'EU personal data',
    k8s: 'Data subject rights, minimization, DPIAs',
  },
  {
    name: 'SOC 2',
    scope: 'Organization controls',
    k8s: '5 Trust Services Criteria (Security, Availability, etc.)',
  },
]

const cisSafeguards = [
  'Inventory and Control of Enterprise Assets',
  'Inventory and Control of Software Assets',
  'Data Protection',
  'Secure Configuration of Enterprise Assets and Software',
  'Account Management',
  'Access Control Management',
  'Continuous Vulnerability Management',
  'Audit Log Management',
  'Email and Web Browser Protections',
  'Malware Defenses',
  'Data Recovery',
  'Network Infrastructure Management',
  'Network Monitoring and Defense',
  'Security Awareness and Skills Training',
  'Service Provider Management',
  'Application Software Security',
  'Incident Response Management',
  'Penetration Testing',
]

const nistFamilies = [
  { code: 'AC', name: 'Access Control', k8s: 'RBAC, service accounts' },
  { code: 'AU', name: 'Audit & Accountability', k8s: 'Kubernetes audit logging' },
  { code: 'CM', name: 'Configuration Management', k8s: 'CIS benchmarks, GitOps' },
  { code: 'IA', name: 'Identification & Authentication', k8s: 'OIDC, client certificates' },
  { code: 'RA', name: 'Risk Assessment', k8s: 'Vulnerability scanning' },
  { code: 'SC', name: 'System & Communications Protection', k8s: 'TLS, etcd encryption' },
  { code: 'SI', name: 'System & Information Integrity', k8s: 'Runtime detection, Falco' },
  { code: 'IR', name: 'Incident Response', k8s: 'Runtime alerts, forensics' },
]

const cisBenchmarkSections = [
  { section: '1.x', coverage: 'Control Plane Components (API Server, Controller Manager, Scheduler, etcd)' },
  { section: '2.x', coverage: 'etcd configuration (encryption, TLS, permissions)' },
  { section: '3.x', coverage: 'Control Plane Configuration (auth, logging, admission)' },
  { section: '4.x', coverage: 'Worker Nodes (Kubelet, kube-proxy, node configuration)' },
  { section: '5.x', coverage: 'Policies (RBAC, Network Policies, PSS, secrets)' },
]

const mitreTactics = [
  { tactic: 'Initial Access', techniques: 'Exposed dashboard, compromised image registry' },
  { tactic: 'Execution', techniques: 'Exec into container, bash via sidecar' },
  { tactic: 'Persistence', techniques: 'CronJob, backdoor container, web shell' },
  { tactic: 'Privilege Escalation', techniques: 'Privileged container, hostPath mount' },
  { tactic: 'Defense Evasion', techniques: 'Clear container logs, delete K8s events' },
  { tactic: 'Credential Access', techniques: 'Access Secret in etcd, SA token theft' },
  { tactic: 'Discovery', techniques: 'Access K8s API, access Kubelet API' },
  { tactic: 'Lateral Movement', techniques: 'Access cloud resources, container SA' },
  { tactic: 'Collection', techniques: 'Mount service principal, access container logs' },
  { tactic: 'Impact', techniques: 'Data destruction, resource hijacking, endpoint DoS' },
]

const securityTools = [
  { tool: 'kube-bench', category: 'Compliance', purpose: 'CIS Benchmark assessment' },
  { tool: 'Kubescape', category: 'Security scanning', purpose: 'Multi-framework (NSA, MITRE, CIS)' },
  { tool: 'Falco', category: 'Runtime detection', purpose: 'Behavioral monitoring and alerting' },
  { tool: 'Trivy', category: 'Vulnerability scanning', purpose: 'Image, filesystem, and repo scanning' },
  { tool: 'Kyverno', category: 'Policy enforcement', purpose: 'Kubernetes-native admission control' },
  { tool: 'OPA Gatekeeper', category: 'Policy enforcement', purpose: 'Rego-based admission control' },
  { tool: 'Cosign', category: 'Image signing', purpose: 'Sigstore image signing/verification' },
  { tool: 'cert-manager', category: 'Certificate mgmt', purpose: 'Automated TLS certificate lifecycle' },
  { tool: 'kubectl-who-can', category: 'RBAC audit', purpose: 'Check who can perform actions' },
  { tool: 'audit2rbac', category: 'RBAC generation', purpose: 'Generate RBAC from audit logs' },
]

const studyChecklist = [
  { text: 'Memorize all component ports (6443, 2379, 2380, 10250, 10257, 10259, 10249)', critical: true },
  { text: 'Know PSS Baseline vs Restricted differences cold', critical: true },
  { text: 'Know all 11 RBAC verbs', critical: false },
  { text: 'Understand NetworkPolicy default behavior and selectors', critical: false },
  { text: 'Know encryption at rest provider order (identity to kms v2)', critical: true },
  { text: 'Know the 4Cs model (Cloud, Cluster, Container, Code)', critical: false },
  { text: 'Understand STRIDE mapping to Kubernetes', critical: false },
  { text: 'Know SLSA levels 1-4', critical: true },
  { text: 'Know admission controller types (mutating vs validating)', critical: true },
  { text: 'Understand ServiceAccount token evolution (v1.24+)', critical: false },
  { text: 'Know Kubelet security flags (--anonymous-auth=false, --authorization-mode=Webhook)', critical: false },
  { text: 'Understand container escape vectors and mitigations', critical: false },
]

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function Domain6Page() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)

      try {
        const stored = localStorage.getItem('kcsa-progress')
        const data = stored ? JSON.parse(stored) : {}
        if (!data.domain6) data.domain6 = {}
        data.domain6.scrollPercent = Math.round(progress)
        if (progress > 90) {
          data.domain6.read = true
          data.domain6.lastReadAt = new Date().toISOString()
        }
        localStorage.setItem('kcsa-progress', JSON.stringify(data))
      } catch {
        // localStorage not available
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      {/* Progress bar */}
      <div
        className="fixed top-[60px] left-0 right-0 h-[3px] z-30"
        style={{ backgroundColor: 'var(--border-subtle)' }}
      >
        <motion.div
          className="h-full"
          style={{ background: 'var(--accent-gradient)' }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Breadcrumb */}
      <motion.nav
        {...fadeUp}
        className="flex items-center gap-2 mb-6 text-sm"
      >
        <Link
          to="/"
          className="transition-colors duration-200 hover:underline"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Home
        </Link>
        <span style={{ color: 'var(--text-tertiary)' }}>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Domain 6</span>
      </motion.nav>

      {/* Chapter Header */}
      <motion.header {...fadeUp} className="mb-10">
        <div
          className="mb-2 text-xs font-semibold uppercase tracking-[0.06em]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Domain 6
        </div>
        <h1
          className="text-4xl font-normal mb-4"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
          }}
        >
          Compliance and Security Frameworks
        </h1>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(242, 196, 77, 0.15)',
              color: 'var(--accent-amber)',
            }}
          >
            10% exam weight
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Clock size={14} />
            ~40 min read
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Layers size={14} />
            6 sections
          </span>
        </div>

        <CalloutBox variant="exam-focus">
          <strong>10% of exam (~8 questions).</strong> CIS Benchmark sections, kube-bench usage, and
          MITRE ATT&CK for containers are the most frequently tested topics in this domain. Know the
          NIST CSF 2.0 six functions cold — especially the new <strong>GOVERN</strong> function.
        </CalloutBox>
      </motion.header>

      {/* Section 6.1 — Compliance Frameworks */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4, 80, 54, 0.1)' }}
          >
            <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            6.1 Compliance Frameworks
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Compliance frameworks provide structured guidance for securing Kubernetes environments.
          Understanding which framework applies to which scenario is critical for both the exam and
          real-world implementations.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Framework', 'Scope', 'Kubernetes Relevance'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complianceFrameworks.map((fw, i) => (
                <tr
                  key={fw.name}
                  style={{
                    borderBottom: `1px solid ${i < complianceFrameworks.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td className="px-3 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {fw.name}
                  </td>
                  <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {fw.scope}
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {fw.k8s}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          CIS Controls v8 — 18 Safeguards
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The CIS Controls are a prioritized set of actions to protect organizations from known
          cyber-attack vectors. While not Kubernetes-specific, they provide the foundation for the CIS
          Kubernetes Benchmark.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-6">
          {cisSafeguards.map((sg, i) => (
            <motion.div
              key={i}
              {...staggerChild}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center gap-3 py-1.5"
            >
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  color: 'var(--accent-primary)',
                }}
              >
                {i + 1}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {sg}
              </span>
            </motion.div>
          ))}
        </div>

        <CalloutBox variant="exam-focus">
          <strong>NIST CSF 2.0 has 6 functions.</strong> The newest is{' '}
          <strong>GOVERN (GV)</strong>, added in 2024. The full list: Govern, Identify, Protect,
          Detect, Respond, Recover. Kubernetes compliance maps to all six: Identify (asset
          inventory), Protect (RBAC, Network Policies), Detect (runtime security), Respond (incident
          response), Recover (backups), Govern (policies).
        </CalloutBox>

        {/* NIST 800-53 */}
        <h3
          className="text-lg font-semibold mb-3 mt-8"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          NIST SP 800-53 Control Families
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Family', 'Name', 'K8s Application'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nistFamilies.map((f, i) => (
                <tr
                  key={f.code}
                  style={{
                    borderBottom: `1px solid ${i < nistFamilies.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td className="px-3 py-2.5">
                    <code
                      className="px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-primary)' }}
                    >
                      {f.code}
                    </code>
                  </td>
                  <td className="px-3 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {f.name}
                  </td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {f.k8s}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PCI DSS / HIPAA / GDPR quick refs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              title: 'PCI DSS',
              icon: CreditCardIcon,
              items: ['Network segmentation for CDE', 'TLS encryption + etcd at rest', 'RBAC + MFA', 'Audit logging + vuln scanning'],
            },
            {
              title: 'HIPAA',
              icon: Siren,
              items: ['Privacy, Security, Breach rules', 'PHI encryption at rest/in transit', '6-year audit log retention', 'Access controls for ePHI'],
            },
            {
              title: 'GDPR',
              icon: Lock,
              items: ['Data subject rights (access, erasure)', 'Data Protection by Design', 'DPIAs for high-risk processing', '72-hour breach notification'],
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <card.icon size={18} className="mb-2" style={{ color: 'var(--accent-primary)' }} />
              <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                {card.title}
              </h4>
              <ul className="space-y-1">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 6.2 — CIS Kubernetes Benchmarks */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(50, 108, 229, 0.1)' }}
          >
            <BookOpen size={20} style={{ color: 'var(--k8s-blue)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            6.2 CIS Kubernetes Benchmarks
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          The CIS Kubernetes Benchmark is the most critical compliance framework for Kubernetes
          security. It provides prescriptive, consensus-driven recommendations for securely
          configuring clusters and workloads. Available for vanilla Kubernetes, EKS, AKS, and GKE.
        </p>

        <CalloutBox variant="exam-focus">
          <strong>CIS Benchmark recommendations are organized across 3 levels:</strong> Cluster-Level
          Security (infrastructure, components), Node OS-Level Security (OS hardening), and
          Workload-Level Security (containers, code, registries).
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Benchmark Sections (v1.9)
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Section', 'Coverage'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cisBenchmarkSections.map((s, i) => (
                <tr
                  key={s.section}
                  style={{
                    borderBottom: `1px solid ${i < cisBenchmarkSections.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td
                    className="px-3 py-3 font-mono text-xs font-bold"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {s.section}
                  </td>
                  <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {s.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Scored vs. Not Scored
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--success)' }}>
              <CheckCircle size={16} />
              Scored
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Represents a security setting that should be configured as recommended. Failure directly
              impacts the security score.
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: 'var(--warning)' }}>
              <AlertTriangle size={16} />
              Not Scored
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Represents a recommended practice but may not apply to all environments. Requires manual
              review and organizational decision.
            </p>
          </div>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          CIS Benchmark Levels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
              Level 1
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Practical, minimally restrictive recommendations. Designed to lower attack surface while
              maintaining full functionality. Should be implemented in all environments.
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
              Level 2
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Defense in depth recommendations. May impact functionality or have performance
              implications. For environments with stronger security requirements.
            </p>
          </div>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Running kube-bench
        </h3>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          kube-bench is the official open-source tool for automated CIS Kubernetes Benchmark
          checking. It runs as a Job in the cluster or directly on nodes, producing a
          pass/fail/warn/info report per benchmark section.
        </p>

        <CodeBlock
          language="bash"
          code={`# Run as Kubernetes Job (simplest)
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl wait --for=condition=complete job/kube-bench --timeout=300s
kubectl logs job/kube-bench

# Run directly on nodes
sudo ./kube-bench run --targets master    # Control plane
sudo ./kube-bench run --targets node      # Worker nodes

# Targeted scans
kube-bench run --targets master --check 1.2   # API server only
kube-bench run --targets master --check 2     # etcd only

# JSON output for CI/CD
kube-bench run --json > kube-bench-results.json`}
        />

        <CalloutBox variant="tip">
          <strong>Status meanings:</strong> PASS = check passed. FAIL = check failed, requires
          remediation. WARN = requires manual verification or review. INFO = informational only.
          Integrate kube-bench into CI/CD for continuous compliance.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Key CIS Checks (Must-Know)
        </h3>
        <div className="space-y-2 mb-6">
          {[
            'API Server: --anonymous-auth=false, --authorization-mode=Node,RBAC',
            'API Server: --enable-admission-plugins must include NodeRestriction',
            'API Server: --encryption-provider-config for etcd encryption',
            'etcd: --client-cert-auth=true, --auto-tls=false',
            'Kubelet: --anonymous-auth=false, --authorization-mode=Webhook',
            'Kubelet: --read-only-port=0 (disable read-only port)',
            'Policies: RBAC enabled, PSS enforced, NetworkPolicies restrict traffic',
          ].map((check, i) => (
            <motion.div
              key={i}
              {...staggerChild}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
              <code className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {check}
              </code>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 6.3 — Threat Modeling */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232, 122, 93, 0.1)' }}
          >
            <Target size={20} style={{ color: 'var(--accent-coral)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            6.3 Threat Modeling Frameworks
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Threat modeling provides systematic approaches to identifying, analyzing, and mitigating
          security threats. Four frameworks are commonly used in Kubernetes security.
        </p>

        {/* Frameworks */}
        <div className="space-y-4 mb-6">
          {/* STRIDE */}
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--accent-coral)' }}>
              STRIDE
            </h4>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
              Microsoft's threat categorization framework. Six threat categories mapped to Kubernetes:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { letter: 'S', name: 'Spoofing', example: 'Rogue pod steals SA token' },
                { letter: 'T', name: 'Tampering', example: 'Supply chain attack on image' },
                { letter: 'R', name: 'Repudiation', example: 'Unauthorized secret modification' },
                { letter: 'I', name: 'Info Disclosure', example: 'Unauthorized secret access' },
                { letter: 'D', name: 'Denial of Service', example: 'Resource exhaustion attack' },
                { letter: 'E', name: 'Elevation of Privilege', example: 'Container escape via hostPath' },
              ].map((cat) => (
                <div
                  key={cat.letter}
                  className="flex items-start gap-2 p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--surface-elevated)' }}
                >
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'var(--accent-coral)', color: '#fff' }}
                  >
                    {cat.letter}
                  </span>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {cat.name}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                      {cat.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OCTAVE */}
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-lavender)' }}>
              OCTAVE
            </h4>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              Operationally Critical Threat, Asset, and Vulnerability Evaluation. A risk-based,
              self-directed, organization-driven assessment framework.
            </p>
            <ol className="space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
              {[
                'Build asset-based threat profiles',
                'Identify infrastructure vulnerabilities',
                'Develop security strategy and plans',
              ].map((phase, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--accent-lavender-soft)', color: 'var(--accent-lavender)' }}
                  >
                    {i + 1}
                  </span>
                  {phase}
                </li>
              ))}
            </ol>
          </div>

          {/* PASTA */}
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-primary)' }}>
              PASTA
            </h4>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
              Process for Attack Simulation and Threat Analysis. A 7-stage risk-centric methodology.
              Attack trees are created in Stage 4 (Threat Analysis).
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Define objectives',
                'Define scope',
                'Decomposition',
                'Threat analysis',
                'Vulnerability detection',
                'Attack enumeration',
                'Risk & impact analysis',
              ].map((stage, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span style={{ color: 'var(--accent-primary)' }}>{i + 1}.</span>
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK */}
        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          MITRE ATT&CK for Containers
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          A globally-accessible knowledge base of adversary tactics and techniques based on real-world
          observations. The Containers Matrix has 10 tactics starting with Initial Access (not
          Reconnaissance like the Enterprise matrix).
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Tactic', 'Example Techniques'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mitreTactics.map((t, i) => (
                <tr
                  key={t.tactic}
                  style={{
                    borderBottom: `1px solid ${i < mitreTactics.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td className="px-3 py-2.5 font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                    {t.tactic}
                  </td>
                  <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {t.techniques}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DREAD */}
        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          DREAD Risk Assessment
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {[
            { letter: 'D', name: 'Damage', desc: 'Impact if exploited' },
            { letter: 'R', name: 'Reproducibility', desc: 'How reproducible' },
            { letter: 'E', name: 'Exploitability', desc: 'Difficulty' },
            { letter: 'A', name: 'Affected Users', desc: 'How many' },
            { letter: 'D', name: 'Discoverability', desc: 'How easy to find' },
          ].map((d) => (
            <div
              key={d.letter + d.name}
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span
                className="inline-block w-6 h-6 rounded-full text-xs font-bold leading-6 mb-1"
                style={{ backgroundColor: 'var(--accent-amber)', color: '#fff' }}
              >
                {d.letter}
              </span>
              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {d.name}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
          Score each factor 0-10. Final score = average of all five. Low: 0-3, Medium: 4-7, High: 8-10.
        </p>
      </motion.section>

      {/* Section 6.4 — Supply Chain Compliance */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(242, 196, 77, 0.12)' }}
          >
            <Fingerprint size={20} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            6.4 Supply Chain Compliance
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Supply chain compliance ensures that software artifacts are traceable, verifiable, and
          secure throughout their lifecycle from source code to runtime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              title: 'SLSA as Compliance Framework',
              icon: ShieldCheck,
              desc: 'SLSA levels provide a measurable compliance target. Organizations can require SLSA Level 3 for production artifacts, ensuring hardened builds with signed provenance.',
            },
            {
              title: 'Image Provenance',
              icon: FileSearch,
              desc: 'Knowing where images came from, who built them, and what source code was used. Provenance includes build metadata, dependencies, and the build platform used.',
            },
            {
              title: 'Signed SBOMs',
              icon: Lock,
              desc: 'SBOMs should be signed as compliance artifacts. They provide a machine-readable inventory of all components, enabling vulnerability tracking and license compliance.',
            },
            {
              title: 'Chain of Custody',
              icon: Fingerprint,
              desc: 'Documenting every transformation from source to runtime. Required by regulations like US EO 14028 for government software procurement.',
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <card.icon size={18} className="mb-2" style={{ color: 'var(--accent-primary)' }} />
              <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {card.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 6.5 — Security Automation Tools */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155, 135, 245, 0.1)' }}
          >
            <Terminal size={20} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            6.5 Security Automation Tools
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Security automation tools enable continuous compliance, vulnerability scanning, runtime
          detection, and policy enforcement. Understanding each tool's purpose and scope is critical.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Tool', 'Category', 'Purpose'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {securityTools.map((tool, i) => (
                <tr
                  key={tool.tool}
                  style={{
                    borderBottom: `1px solid ${i < securityTools.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td className="px-3 py-3 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {tool.tool}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        backgroundColor: 'var(--surface-elevated)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {tool.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {tool.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CalloutBox variant="tip">
          <strong>Kubescape</strong> scans against three frameworks: NSA-CISA, MITRE ATT&CK, and CIS
          Benchmarks. <strong>Trivy</strong> is the most versatile scanner — it covers images,
          filesystems, repos, Kubernetes clusters, and generates SBOMs in both CycloneDX and SPDX
          formats. <strong>Falco</strong> detects but does not block; <strong>Tetragon</strong> can
          do both detection and enforcement at the kernel level.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          kube-bench CI/CD Integration
        </h3>
        <CodeBlock
          language="yaml"
          filename=".github/workflows/cis-compliance.yaml"
          code={`name: CIS Compliance Check
on: [push, pull_request]
jobs:
  kube-bench:
    runs-on: ubuntu-latest
    steps:
    - name: Run kube-bench
      run: |
        kubectl apply -f kube-bench-job.yaml
        kubectl wait --for=condition=complete job/kube-bench
        kubectl logs job/kube-bench > kube-bench-results.txt
    - name: Check for failures
      run: |
        FAILURES=$(grep "FAIL" kube-bench-results.txt | wc -l)
        if [ "$FAILURES" -gt 0 ]; then
          echo "$FAILURES CIS checks failed"
          cat kube-bench-results.txt
          exit 1
        fi`}
        />
      </motion.section>

      {/* Section 6.6 — Exam Preparation Strategy */}
      <motion.section {...fadeUp} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4, 80, 54, 0.1)' }}
          >
            <FlaskConical size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            6.6 Exam Preparation Strategy
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          This final section consolidates key study points and provides a time management strategy for
          the 90-minute KCSA exam.
        </p>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Final Study Checklist
        </h3>
        <div className="space-y-2 mb-6">
          {studyChecklist.map((item, i) => (
            <motion.div
              key={i}
              {...staggerChild}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span
                className="flex-shrink-0 mt-0.5"
                style={{ color: item.critical ? 'var(--accent-coral)' : 'var(--accent-primary)' }}
              >
                {item.critical ? <Bug size={16} /> : <CheckCircle size={16} />}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {item.text}
              </span>
              {item.critical && (
                <span
                  className="flex-shrink-0 ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: 'rgba(232, 122, 93, 0.1)', color: 'var(--accent-coral)' }}
                >
                  High Yield
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Time Allocation Strategy
        </h3>
        <div
          className="p-5 rounded-xl mb-6"
          style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
        >
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            The exam is 90 minutes with ~60 questions. Average: <strong>1.5 minutes per question</strong>.
          </p>
          <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
            {[
              'Read questions carefully — note "which is NOT" vs "which IS"',
              'Flag uncertain questions and return at the end',
              'Eliminate obviously wrong answers first',
              'Trust your first instinct unless you find clear evidence otherwise',
              'Spend less time on straightforward recall questions; save time for scenario-based ones',
              'If stuck, make an educated guess and move on — no penalty for wrong answers',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                <span style={{ color: 'var(--accent-primary)' }} className="mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <CalloutBox variant="info">
          <strong>Weight distribution across all 6 domains:</strong> Domain 1 (14%), Domain 2 (22%),
          Domain 3 (22%), Domain 4 (16%), Domain 5 (16%), Domain 6 (10%). Focus your study time
          proportionally — Domains 2 and 3 together account for nearly half the exam.
        </CalloutBox>
      </motion.section>

      {/* Quiz */}
      <motion.section {...fadeUp} className="mb-12">
        <h2
          className="text-2xl font-normal mb-6"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Chapter Quiz
        </h2>
        <QuizCard questions={quizQuestions} domainId="6" />
      </motion.section>

      {/* Chapter Footer */}
      <motion.footer
        {...fadeUp}
        className="flex items-center justify-between py-6"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <Link
          to="/domain5"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          <span>Domain 5: Platform Security</span>
        </Link>
        <Link
          to="/practice-exam"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--accent-primary)' }}
        >
          <span>Practice Exam</span>
          <ArrowRight size={16} />
        </Link>
      </motion.footer>
    </div>
  )
}

/* Simple icon components for compliance frameworks */
function CreditCardIcon(props: { size: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      style={props.style}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
