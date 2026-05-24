import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import {
  BookOpen,
  Shield,
  Container,
  Search,
  ScanEye,
  Network,
  Lock,
  KeyRound,
  Filter,
  ArrowLeft,
  ArrowRight,
  Clock,
  Layers,
  GitBranch,
  Fingerprint,
} from 'lucide-react'
import CalloutBox from '@/components/CalloutBox'
import CodeBlock from '@/components/CodeBlock'
import QuizComponent from '@/components/QuizComponent'
import type { QuizQuestion } from '@/components/QuizComponent'




/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What SLSA level requires two-person review for all changes?',
    options: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    correctIndex: 3,
    explanation: 'SLSA Level 4 is the highest level and requires two-person review for all changes, hermetic and reproducible builds, and an independent audit. Level 1 only requires provenance, Level 2 adds signed provenance, Level 3 adds hardened build platforms.',
  },
  {
    id: 2,
    question: 'Which admission controller enforces Pod Security Standards (PSS)?',
    options: ['NodeRestriction', 'PodSecurity', 'NamespaceLifecycle', 'ResourceQuota'],
    correctIndex: 1,
    explanation: 'The PodSecurity admission controller (part of Pod Security Admission) enforces Pod Security Standards. It replaced PodSecurityPolicy (PSP) which was deprecated in v1.21 and removed in v1.25.',
  },
  {
    id: 3,
    question: 'What does mTLS (Mutual TLS) provide in a service mesh?',
    options: [
      'Only server-side authentication',
      'Mutual authentication between client and server',
      'Encryption without authentication',
      'Authentication without encryption',
    ],
    correctIndex: 1,
    explanation: 'mTLS (Mutual TLS) authenticates both the client and server, providing both encryption in transit and mutual identity verification. Both sides present certificates for authentication.',
  },
  {
    id: 4,
    question: 'What is the key difference between a mutating and validating admission controller?',
    options: [
      'Mutating runs after validating',
      'Mutating can modify objects; validating can only approve or reject',
      'Validating can modify objects; mutating can only approve or reject',
      'There is no difference',
    ],
    correctIndex: 1,
    explanation: 'Mutating admission controllers can modify the request/object (e.g., inject sidecars, set defaults). Validating admission controllers can only approve or reject requests. Mutating controllers run BEFORE validating controllers.',
  },
  {
    id: 5,
    question: 'Which tool is best known for runtime threat detection in Kubernetes using system calls?',
    options: ['Trivy', 'kube-bench', 'Falco', 'Kubescape'],
    correctIndex: 2,
    explanation: 'Falco is the CNCF-graduated runtime security tool that detects suspicious behavior using eBPF or kernel modules to monitor system calls. Trivy does vulnerability scanning, kube-bench checks CIS benchmarks, and Kubescape does multi-framework scanning.',
  },
  {
    id: 6,
    question: 'Which language does OPA Gatekeeper use for policy definitions?',
    options: ['YAML', 'JSON', 'Rego', 'Python'],
    correctIndex: 2,
    explanation: 'OPA Gatekeeper uses the Rego policy language for defining policies. This is a key difference from Kyverno, which uses native Kubernetes YAML for policies. Rego is powerful but has a learning curve.',
  },
  {
    id: 7,
    question: 'What project automates TLS certificate management in Kubernetes?',
    options: ['cert-manager', 'OpenSSL', 'Vault', 'Let\'s Encrypt'],
    correctIndex: 0,
    explanation: 'cert-manager is a CNCF incubating project that automates TLS certificate management in Kubernetes. It integrates with Let\'s Encrypt, Vault, and private CAs through Certificate and Issuer/ClusterIssuer CRDs.',
  },
  {
    id: 8,
    question: 'What is the primary benefit of a private Kubernetes cluster?',
    options: [
      'Faster pod scheduling',
      'API Server is not exposed to the public internet',
      'Automatic certificate rotation',
      'Built-in image scanning',
    ],
    correctIndex: 1,
    explanation: 'A private cluster has an API Server with a private IP only, not exposed to the public internet. Access is via bastion host, VPN, or private connectivity (AWS PrivateLink, Azure Private Link). This is the most secure configuration for production.',
  },
  {
    id: 9,
    question: 'Which SBOM format is maintained by the Linux Foundation?',
    options: ['CycloneDX', 'SWID', 'SPDX', 'CPE'],
    correctIndex: 2,
    explanation: 'SPDX (System Package Data Exchange) is the SBOM format maintained by the Linux Foundation. CycloneDX is maintained by OWASP, and SWID is an ISO standard.',
  },
  {
    id: 10,
    question: 'Which service mesh is known for being lightweight and simple with minimal resource overhead?',
    options: ['Istio', 'Consul Connect', 'Linkerd', 'Cilium Service Mesh'],
    correctIndex: 2,
    explanation: 'Linkerd is known for being lightweight and simpler than Istio, with minimal resource overhead (~10MB memory per proxy). It focuses on mTLS and observability. Istio is more feature-rich but more complex.',
  },
]

const slsaLevels = [
  { level: 1, name: 'Provenance', desc: 'Build process documented (who built it, what source)', color: '#A3C4A8' },
  { level: 2, name: 'Signed Provenance', desc: 'Signed build provenance, hosted build service', color: '#F2C44D' },
  { level: 3, name: 'Hardened Build', desc: 'Hardened build platform, hermetic/sealed builds', color: '#E87A5D' },
  { level: 4, name: 'Maximum Security', desc: 'Two-person review, hermetic + reproducible builds', color: '#D42B1E' },
]

const monitoringTools = [
  { name: 'Prometheus', type: 'Metrics', purpose: 'Collect and alert on cluster metrics' },
  { name: 'Grafana', type: 'Visualization', purpose: 'Dashboards for metrics and logs' },
  { name: 'Falco', type: 'Runtime detection', purpose: 'Behavioral monitoring, anomalous syscalls' },
  { name: 'Tetragon', type: 'eBPF security', purpose: 'Kernel-level security observability' },
  { name: 'audit2rbac', type: 'RBAC audit', purpose: 'Generate RBAC rules from audit logs' },
  { name: 'kube-bench', type: 'Compliance', purpose: 'CIS Kubernetes Benchmark assessment' },
  { name: 'Kubescape', type: 'Security scanner', purpose: 'Multi-framework security scanning' },
]

const admissionControllers = [
  { name: 'NodeRestriction', type: 'Validating', purpose: 'Limits Kubelet to its own node' },
  { name: 'NamespaceLifecycle', type: 'Validating', purpose: 'Enforces namespace lifecycle rules' },
  { name: 'LimitRanger', type: 'Mutating', purpose: 'Applies LimitRange defaults' },
  { name: 'ResourceQuota', type: 'Validating', purpose: 'Enforces ResourceQuota limits' },
  { name: 'PodSecurity', type: 'Validating', purpose: 'Enforces PSS (PSA)' },
  { name: 'ServiceAccount', type: 'Mutating', purpose: 'Auto-mounts ServiceAccount tokens' },
  { name: 'DefaultStorageClass', type: 'Mutating', purpose: 'Sets default StorageClass' },
]

const pkiComponents = [
  { name: 'Cluster CA', desc: 'Signs all component certificates, stored securely' },
  { name: 'API Server', desc: 'Serving cert + client cert for etcd and Kubelet' },
  { name: 'etcd', desc: 'Peer cert + client cert for secure communication' },
  { name: 'Kubelet', desc: 'Client cert for API Server auth + serving cert' },
  { name: 'Front Proxy CA', desc: 'For aggregated API servers (metrics-server)' },
]

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function Domain5Page() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)

      // Save progress to localStorage
      try {
        const stored = localStorage.getItem('kcsa-progress')
        const data = stored ? JSON.parse(stored) : {}
        if (!data.domain5) {data.domain5 = {}}
        data.domain5.scrollPercent = Math.round(progress)
        if (progress > 90) {
          data.domain5.read = true
          data.domain5.lastReadAt = new Date().toISOString()
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
        />
      </div>

      {/* Breadcrumb */}
      <nav
        
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
        <span style={{ color: 'var(--text-secondary)' }}>Domain 5</span>
      </nav>

      {/* Chapter Header */}
      <header  className="mb-10">
        <div
          className="mb-2 text-xs font-semibold uppercase tracking-[0.06em]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Domain 5
        </div>
        <h1
          className="text-4xl font-normal mb-4"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
          }}
        >
          Platform Security
        </h1>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(242, 196, 77, 0.15)',
              color: 'var(--accent-amber)',
            }}
          >
            16% exam weight
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Clock size={14} />
            ~55 min read
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <Layers size={14} />
            7 sections
          </span>
        </div>

        <CalloutBox variant="exam">
          <strong>16% of exam (~13 questions).</strong> SLSA levels, admission controller differences
          (OPA vs Kyverno vs built-in), and PKI/cert-manager concepts are frequently tested. Pay
          special attention to the mutating vs. validating admission controller distinction.
        </CalloutBox>
      </header>

      {/* Section 5.1 — Supply Chain Security */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4, 80, 54, 0.1)' }}
          >
            <GitBranch size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.1 Supply Chain Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          The supply chain includes every step from writing code to running it in production. Each
          step is a potential attack vector. The CNCF Software Supply Chain Best Practices whitepaper
          recommends automating everything, standardizing pipelines, using single-use build workers,
          and adopting GitOps methodology.
        </p>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          SLSA Framework (Levels 1–4)
        </h3>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          SLSA (Supply-chain Levels for Software Artifacts) is a security framework from the OpenSSF
          designed to prevent tampering and improve integrity across the software supply chain.
        </p>

        {/* SLSA Levels */}
        <div className="space-y-3 mb-6">
          {slsaLevels.map((l) => (
            <div
              key={l.level}
              
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: `${l.color}20`, color: l.color }}
              >
                {l.level}
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {l.name}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {l.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <CalloutBox variant="exam">
          <strong>SLSA has 4 levels (1-4).</strong> Level 1 = provenance exists. Level 2 = signed
          provenance + hosted build. Level 3 = hardened build platform + hermetic builds. Level 4 =
          two-person review + reproducible builds. Higher levels = more security guarantees.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-8"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          SBOM (Software Bill of Materials)
        </h3>
        <ul className="space-y-2 mb-5" style={{ color: 'var(--text-secondary)' }}>
          {[
            'Machine-readable list of all components in a software artifact',
            'Formats: SPDX (Linux Foundation), CycloneDX (OWASP), SWID (ISO)',
            'Required by US Executive Order 14028 for government software',
            'Generated during build phase, stored alongside artifacts',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span style={{ color: 'var(--accent-primary)' }} className="mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Securing CI/CD Pipelines
        </h3>
        <ul className="space-y-2 mb-6" style={{ color: 'var(--text-secondary)' }}>
          {[
            'Eliminate static credentials — use workload identity federation',
            'Pin exact versions with checksums for package integrity',
            'Integrate vulnerability scanning (Snyk, Dependabot, Trivy)',
            'Segregate pipeline access by environment (dev, staging, prod)',
            'Require approvals for production deployments',
            'Generate and sign SBOMs; sign artifacts with Sigstore/Cosign',
            'Apply least privilege — start with zero permissions',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span style={{ color: 'var(--accent-primary)' }} className="mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Section 5.2 — Image Repository Security */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155, 135, 245, 0.1)' }}
          >
            <Container size={20} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.2 Image Repository Security
          </h2>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Image Scanning
        </h3>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Image scanning should happen at multiple points: during CI build, before pushing to
          registry, continuously (as CVE databases update), and before deployment (via admission
          control). Scan for OS packages, language dependencies, configuration files, and secrets.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { tool: 'Trivy', vendor: 'Aqua Security', scope: 'Images, fs, repos, K8s, IaC, SBOM' },
            { tool: 'Grype', vendor: 'Anchore', scope: 'Images, filesystems, SBOMs' },
            { tool: 'Snyk', vendor: 'Snyk', scope: 'Commercial platform with K8s API integration' },
            { tool: 'Clair', vendor: 'Red Hat', scope: 'Container images only (PostgreSQL required)' },
          ].map((scanner) => (
            <motion.div
              key={scanner.tool}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {scanner.tool}
              </div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {scanner.vendor}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {scanner.scope}
              </div>
            </motion.div>
          ))}
        </div>

        <CodeBlock
          language="bash"
          code={`# Scan an image for vulnerabilities
trivy image myregistry.io/app:v1.0.0

# Scan with specific severity threshold
trivy image --severity HIGH,CRITICAL myregistry.io/app:v1.0.0

# Scan in CI and fail on critical vulnerabilities
trivy image --exit-code 1 --severity CRITICAL myregistry.io/app:v1.0.0

# Generate SBOM
trivy image --format spdx-json --output sbom.json myregistry.io/app:v1.0.0`}
        />

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Image Signing
        </h3>
        <div className="space-y-3 mb-6">
          {[
            { tool: 'Cosign (Sigstore)', desc: 'Sign and verify using keyless signing (Fulcio + Rekor). Primarily for open source.' },
            { tool: 'Notation (Notary v2)', desc: 'CNCF standard for image signing. Recommended by Microsoft (AKS) and Amazon (EKS) for enterprise.' },
          ].map((signer) => (
            <div
              key={signer.tool}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {signer.tool}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {signer.desc}
              </div>
            </div>
          ))}
        </div>

        <CalloutBox variant="info">
          <strong>Docker Content Trust (DCT) is deprecated</strong> and replaced by Notary v2
          (Notation). Cosign is the modern Sigstore-based approach for image signing and
          verification.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Private Registries
        </h3>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Always use private registries in production — never pull from public repos directly.
          Options include Harbor, ECR, ACR, GAR, and Docker Hub private repos. Authenticate via{' '}
          <code>imagePullSecrets</code>, node-level <code>dockercfg</code>, or cloud-native
          mechanisms like IRSA/EKS IAM roles.
        </p>
      </section>

      {/* Section 5.3 — Observability */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(242, 196, 77, 0.12)' }}
          >
            <ScanEye size={20} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.3 Observability and Monitoring
          </h2>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Three Pillars of Observability
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { name: 'Metrics', icon: Search, desc: 'Numerical data over time — CPU, memory, request latency, error rates' },
            { name: 'Logs', icon: BookOpen, desc: 'Text records of events — application, audit, and system logs' },
            { name: 'Traces', icon: Network, desc: 'Request flow across services — distributed tracing' },
          ].map((pillar) => (
            <motion.div
              key={pillar.name}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl text-center"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <pillar.icon size={24} className="mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
              <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                {pillar.name}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {pillar.desc}
              </div>
            </motion.div>
          ))}
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Security Monitoring Tools
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Tool', 'Type', 'Purpose'].map((h) => (
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
              {monitoringTools.map((tool, i) => (
                <tr
                  key={tool.name}
                  style={{
                    borderBottom: `1px solid ${i < monitoringTools.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td className="px-3 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {tool.name}
                  </td>
                  <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {tool.type}
                  </td>
                  <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {tool.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CalloutBox variant="tip">
          <strong>Falco is detection-focused (alerts only).</strong> It does NOT block by default.
          For in-line blocking, use Tetragon or Falco Talon. Falco uses eBPF or kernel modules to
          monitor system calls through a YAML-based rules engine.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Security Alerts to Configure
        </h3>
        <ul className="space-y-2 mb-5" style={{ color: 'var(--text-secondary)' }}>
          {[
            'Privileged container creation',
            'RBAC changes (new bindings, role modifications)',
            'Secret access patterns (unusual read patterns)',
            'Image pull failures',
            'API Server anonymous requests',
            'NetworkPolicy violations',
          ].map((alert, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
              <span style={{ color: 'var(--accent-coral)' }} className="mt-1">!</span>
              {alert}
            </li>
          ))}
        </ul>
      </section>

      {/* Section 5.4 — Service Mesh */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(50, 108, 229, 0.1)' }}
          >
            <Network size={20} style={{ color: 'var(--k8s-blue)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.4 Service Mesh
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          A service mesh is a dedicated infrastructure layer that adds observability, security, and
          reliability to service-to-service communication without modifying application code. It uses
          a sidecar proxy pattern where all network traffic is transparently intercepted.
        </p>

        {/* Istio vs Linkerd */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl"
            style={{
              backgroundColor: 'var(--surface-base)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Istio
            </h4>
            <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {[
                'Full-featured with extensive capabilities',
                'Envoy proxy sidecar injected into every pod',
                'mTLS (automatic or strict mode)',
                'Authorization policies + JWT validation',
                'Advanced traffic management: canary, circuit breakers',
                'Built-in metrics, tracing, dashboards',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span style={{ color: 'var(--k8s-blue)' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl"
            style={{
              backgroundColor: 'var(--surface-base)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              Linkerd
            </h4>
            <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {[
                'Lightweight and simpler than Istio',
                'Automatic mTLS for all pod-to-pod communication',
                '~10MB memory per proxy (minimal overhead)',
                'Easier to install and operate',
                'Best for: mTLS + observability needs',
                'CNCF graduated project',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span style={{ color: 'var(--accent-primary)' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          mTLS Modes
        </h3>
        <div className="space-y-2 mb-6">
          {[
            { mode: 'PERMISSIVE', desc: 'Accepts both mTLS and plaintext (default in Istio — use only during migration)' },
            { mode: 'STRICT', desc: 'Requires mTLS for all connections (production standard)' },
            { mode: 'DISABLE', desc: 'No mTLS (not recommended for production)' },
          ].map((m) => (
            <div key={m.mode} className="flex items-start gap-3 text-sm">
              <code
                className="flex-shrink-0 px-2 py-0.5 rounded text-xs"
                style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-primary)' }}
              >
                {m.mode}
              </code>
              <span style={{ color: 'var(--text-secondary)' }}>{m.desc}</span>
            </div>
          ))}
        </div>

        <CalloutBox variant="warning">
          Istio's default mTLS mode is <strong>PERMISSIVE</strong> — the sidecar accepts both mTLS
          and plain-text traffic. This default exists for migration convenience. In PERMISSIVE mode,
          an attacker's pod without an Istio sidecar can make plain-text HTTP calls to any mesh
          service. Always switch to STRICT after migration.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Istio AuthorizationPolicy Example
        </h3>
        <CodeBlock
          language="yaml"
          code={`# Require mTLS for all services in the mesh
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT
---
# Allow only frontend to call backend on port 8080
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: backend-policy
  namespace: production
spec:
  selector:
    matchLabels:
      app: backend
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/production/sa/frontend"]
    to:
    - operation:
        methods: ["GET"]
        ports: ["8080"]`}
        />
      </section>

      {/* Section 5.5 — PKI */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232, 122, 93, 0.1)' }}
          >
            <KeyRound size={20} style={{ color: 'var(--accent-coral)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.5 PKI and Certificate Management
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Kubernetes uses certificates extensively for component authentication. The PKI architecture
          includes three separate CAs: the main Kubernetes CA, the etcd CA, and the front-proxy CA.
        </p>

        <div className="space-y-3 mb-6">
          {pkiComponents.map((comp) => (
            <motion.div
              key={comp.name}
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Fingerprint size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-coral)' }} />
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {comp.name}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {comp.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Certificate Lifecycle
        </h3>
        <ol className="space-y-2 mb-6" style={{ color: 'var(--text-secondary)' }}>
          {[
            'Generation: Tools — cfssl, openssl, kubeadm, cert-manager',
            'Distribution: Secure channels, never commit to Git',
            'Rotation: Before expiry, with zero downtime',
            'Revocation: Remove from trust stores, update CA bundles',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          cert-manager
        </h3>
        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          cert-manager is a CNCF incubating project for automatic certificate management. It
          integrates with Let's Encrypt, Vault, and private CAs via <code>Certificate</code> and{' '}
          <code>Issuer</code>/<code>ClusterIssuer</code> CRDs, with automatic renewal before expiry.
        </p>

        <CodeBlock
          language="yaml"
          code={`apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@company.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: app-tls
  namespace: production
spec:
  secretName: app-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - app.company.com`}
        />
      </section>

      {/* Section 5.6 — Connectivity */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4, 80, 54, 0.1)' }}
          >
            <Lock size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.6 Connectivity Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              title: 'Private Clusters',
              icon: Shield,
              items: [
                'API Server has private IP only',
                'Access via bastion host or VPN',
                'Most secure for production',
              ],
            },
            {
              title: 'Ingress Security',
              icon: Network,
              items: [
                'TLS termination at ingress',
                'Rate limiting at ingress level',
                'WAF for L7 protection',
              ],
            },
            {
              title: 'Egress Security',
              icon: Filter,
              items: [
                'Control outbound traffic from pods',
                'Egress NetworkPolicies',
                'Block cloud metadata (169.254.169.254)',
              ],
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -2 }}
              className="p-5 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <card.icon size={20} className="mb-3" style={{ color: 'var(--accent-primary)' }} />
              <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                {card.title}
              </h4>
              <ul className="space-y-1.5">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5.7 — Admission Control */}
      <section  className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155, 135, 245, 0.1)' }}
          >
            <Filter size={20} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            5.7 Admission Control
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          Admission controllers intercept requests to the API Server <strong>after</strong>{' '}
          authentication and authorization but <strong>before</strong> the object is persisted. There
          are two types: <strong>Mutating</strong> (can modify the request) and{' '}
          <strong>Validating</strong> (can only approve or reject).
        </p>

        <CalloutBox variant="exam">
          <strong>Request lifecycle order:</strong> 1. Authentication → 2. Authorization/RBAC → 3.
          Admission Control (mutating first, then validating) → 4. Persistence to etcd. If any
          controller rejects the request, it fails immediately.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Built-in Admission Controllers
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                {['Controller', 'Type', 'Purpose'].map((h) => (
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
              {admissionControllers.map((ctrl, i) => (
                <tr
                  key={ctrl.name}
                  style={{
                    borderBottom: `1px solid ${i < admissionControllers.length - 1 ? 'var(--border-subtle)' : 'transparent'}`,
                  }}
                >
                  <td className="px-3 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {ctrl.name}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          ctrl.type === 'Mutating'
                            ? 'rgba(155, 135, 245, 0.12)'
                            : 'rgba(4, 80, 54, 0.08)',
                        color:
                          ctrl.type === 'Mutating'
                            ? 'var(--accent-lavender)'
                            : 'var(--accent-primary)',
                      }}
                    >
                      {ctrl.type}
                    </span>
                  </td>
                  <td className="px-3 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {ctrl.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OPA vs Kyverno */}
        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          OPA Gatekeeper vs. Kyverno
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl"
            style={{
              backgroundColor: 'var(--surface-base)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-lavender)' }}>
              OPA Gatekeeper
            </h4>
            <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {[
                'Uses Rego language for policies',
                'ConstraintTemplate defines policy logic',
                'Constraint applies template to resources',
                'Very flexible, multi-cluster support',
                'Large policy library available',
                'Rego has a learning curve',
                'Separate component to manage',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span style={{ color: 'var(--accent-lavender)' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-xl"
            style={{
              backgroundColor: 'var(--surface-base)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--accent-primary)' }}>
              Kyverno
            </h4>
            <ul className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {[
                'Native Kubernetes YAML policies',
                'No new language to learn',
                'Mutating + validating + generating',
                'verifyImages for supply chain',
                'Lighter resource footprint',
                'Kubernetes-only (not cross-platform)',
                'CNCF graduated (2024)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span style={{ color: 'var(--accent-primary)' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <CalloutBox variant="exam">
          <strong>Know the difference:</strong> OPA Gatekeeper uses the Rego policy language (very
          flexible). Kyverno uses Kubernetes-native YAML policies (easier to learn). Both enforce
          policies at admission time. The built-in PodSecurity admission controller enforces PSS.
        </CalloutBox>

        <h3
          className="text-lg font-semibold mb-3 mt-6"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
        >
          Kyverno Policy Examples
        </h3>
        <CodeBlock
          language="yaml"
          code={`# Require labels on all namespaces
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: Enforce
  rules:
  - name: check-team-label
    match:
      resources:
        kinds:
        - Namespace
    validate:
      message: "All namespaces must have a team label"
      pattern:
        metadata:
          labels:
            team: "?*"
---
# Mutate pods to add security context
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: add-security-context
spec:
  rules:
  - name: set-runAsNonRoot
    match:
      resources:
        kinds:
        - Pod
    mutate:
      patchStrategicMerge:
        spec:
          securityContext:
            runAsNonRoot: true`}
        />
      </section>

      {/* Quiz */}
      <section  className="mb-12">
        <h2
          className="text-2xl font-normal mb-6"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Chapter Quiz
        </h2>
        <QuizComponent questions={quizQuestions} domainId="5" />
      </section>

      {/* Chapter Footer */}
      <footer
        
        className="flex items-center justify-between py-6"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <Link
          to="/domain4"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          <span>Domain 4: Threat Model</span>
        </Link>
        <Link
          to="/domain6"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--accent-primary)' }}
        >
          <span>Domain 6: Compliance</span>
          <ArrowRight size={16} />
        </Link>
      </footer>
    </div>
  )
}
