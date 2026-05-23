import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Cloud,
  Server,
  Container,
  Code2,
  ChevronRight,
  ArrowRight,
  Lock,
  FileCheck,
  Network,
  Users,
  Check,
} from 'lucide-react';
import CalloutBox from '@/components/CalloutBox';
import CodeBlock from '@/components/CodeBlock';
import QuizComponent from '@/components/QuizComponent';
import { useProgress } from '@/hooks/useProgress';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ────────────────────── Animated Section Wrapper ────────────────────── */
function Section({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className={`mb-16 ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ────────────────────── 4Cs Interactive Diagram ────────────────────── */
function FourCsDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const layers = [
    {
      label: 'Cloud',
      icon: Cloud,
      color: 'var(--accent-lavender)',
      items: ['IAM & Access Control', 'Network Security Groups', 'Encryption at Rest', 'Logging & Monitoring'],
    },
    {
      label: 'Cluster',
      icon: Server,
      color: 'var(--accent-primary)',
      items: ['API Server Security', 'etcd Encryption', 'Node Hardening', 'Network Policies'],
    },
    {
      label: 'Container',
      icon: Container,
      color: 'var(--accent-amber)',
      items: ['Image Scanning', 'Image Signing', 'Runtime Protection', 'Resource Limits'],
    },
    {
      label: 'Code',
      icon: Code2,
      color: 'var(--accent-coral)',
      items: ['SAST/DAST', 'Dependency Scanning', 'Secrets Management', 'Secure Coding'],
    },
  ];

  return (
    <div ref={ref} className="max-w-[560px] mx-auto my-10">
      <div className="flex flex-col gap-3">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: easeOutExpo, delay: i * 0.15 }}
              className="relative group"
            >
              <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] cursor-default"
                style={{
                  borderColor: layer.color,
                  backgroundColor: `${layer.color}15`,
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${layer.color}25` }}
                >
                  <Icon size={22} style={{ color: layer.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: layer.color }}>
                      {layer.label}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${layer.color}20`,
                        color: layer.color,
                      }}
                    >
                      Layer {4 - i}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: 'var(--surface-base)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Direction arrows */}
      <div className="flex items-center justify-center gap-1 my-3">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Defense flows inward
        </span>
        <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} />
      </div>
    </div>
  );
}

/* ────────────────────── Shared Responsibility Table ────────────────────── */
function SharedResponsibilityTable() {
  const rows = [
    { layer: 'Physical / Hypervisor', provider: true, customer: false },
    { layer: 'Host OS (managed K8s)', provider: true, customer: 'Limited' },
    { layer: 'Kubernetes Control Plane', provider: true, customer: false },
    { layer: 'Worker Nodes', provider: 'Partial', customer: true },
    { layer: 'Pod / Workload', provider: false, customer: true },
    { layer: 'Application / Code', provider: false, customer: true },
  ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th
              className="px-4 py-3 text-left rounded-tl-lg"
              style={{
                backgroundColor: 'rgba(4,80,54,0.08)',
                color: 'var(--accent-primary)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              Layer
            </th>
            <th
              className="px-4 py-3 text-center"
              style={{
                backgroundColor: 'rgba(4,80,54,0.08)',
                color: 'var(--accent-primary)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              Cloud Provider
            </th>
            <th
              className="px-4 py-3 text-center rounded-tr-lg"
              style={{
                backgroundColor: 'rgba(4,80,54,0.08)',
                color: 'var(--accent-primary)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              Customer
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.layer}
              style={{
                backgroundColor:
                  i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
              }}
            >
              <td
                className="px-4 py-3 font-medium"
                style={{
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {row.layer}
              </td>
              <td
                className="px-4 py-3 text-center"
                style={{
                  color: row.provider === true ? 'var(--accent-sage)' : row.provider === false ? 'var(--text-tertiary)' : 'var(--accent-amber)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {row.provider === true ? 'Yes' : row.provider === false ? 'No' : 'Partial'}
              </td>
              <td
                className="px-4 py-3 text-center"
                style={{
                  color: row.customer === true ? 'var(--accent-sage)' : row.customer === false ? 'var(--text-tertiary)' : 'var(--accent-amber)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {row.customer === true ? 'Yes' : row.customer === false ? 'No' : 'Limited'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────── Frameworks Comparison Table ────────────────────── */
function FrameworksTable() {
  const frameworks = [
    {
      name: 'NIST CSF',
      scope: 'Federal & Enterprise',
      functions: 'Identify, Protect, Detect, Respond, Recover',
      k8sRelevance: 'NIST SP 800-190: Container Security Guide',
    },
    {
      name: 'CIS Controls',
      scope: 'Kubernetes-specific',
      functions: '18 prioritized safeguards',
      k8sRelevance: 'CIS K8s Benchmark + kube-bench tool',
    },
    {
      name: 'ISO 27001',
      scope: 'International ISMS',
      functions: '114 controls, 14 categories',
      k8sRelevance: 'Risk-based approach to K8s security',
    },
  ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {['Framework', 'Scope', 'Key Functions', 'K8s Relevance'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left"
                style={{
                  backgroundColor: 'rgba(4,80,54,0.08)',
                  color: 'var(--accent-primary)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {frameworks.map((f, i) => (
            <tr
              key={f.name}
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
              }}
            >
              <td
                className="px-4 py-3 font-semibold"
                style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {f.name}
              </td>
              <td
                className="px-4 py-3"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {f.scope}
              </td>
              <td
                className="px-4 py-3"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {f.functions}
              </td>
              <td
                className="px-4 py-3"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {f.k8sRelevance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────── Quiz Data ────────────────────── */
const domain1Questions = [
  {
    id: 1,
    question: 'In the 4Cs model of Cloud Native Security, which layer is the innermost?',
    options: ['Cloud', 'Cluster', 'Container', 'Code'],
    correctIndex: 3,
    explanation: 'The 4Cs are ordered from outermost to innermost: Cloud (layer 1) → Cluster (layer 2) → Container (layer 3) → Code (layer 4). Code is the innermost layer and the one over which developers have the most control. Each layer builds on the security of the layers beneath it.',
  },
  {
    id: 2,
    question: 'What is the default NetworkPolicy behavior in Kubernetes?',
    options: [
      'Deny all traffic',
      'Allow all traffic',
      'Allow only same-namespace traffic',
      'Deny all ingress, allow all egress',
    ],
    correctIndex: 1,
    explanation: 'By default, Kubernetes allows ALL pod-to-pod traffic with no network isolation. The first NetworkPolicy applied to a pod isolates that traffic direction (ingress or egress). This is a critical exam point: you must explicitly create NetworkPolicies to restrict traffic.',
  },
  {
    id: 3,
    question: 'Which tool is used to run the CIS Kubernetes Benchmark for automated compliance checking?',
    options: ['kube-bench', 'kubectl', 'kubeadm', 'Falco'],
    correctIndex: 0,
    explanation: 'kube-bench is the open-source tool from Aqua Security that checks whether Kubernetes is deployed according to the CIS Kubernetes Benchmark. It tests control plane components, worker nodes, RBAC, secrets management, and network policies.',
  },
  {
    id: 4,
    question: 'What does SAST stand for in application security?',
    options: [
      'Static Application Security Testing',
      'Systematic Application Security Testing',
      'Secure Application Source Testing',
      'Security Audit System Tool',
    ],
    correctIndex: 0,
    explanation: 'SAST (Static Application Security Testing) analyzes source code for vulnerabilities without executing it. It finds issues like SQL injection, XSS, buffer overflows, and hard-coded credentials. Contrast this with DAST (Dynamic Application Security Testing) which tests running applications.',
  },
  {
    id: 5,
    question: 'In a managed Kubernetes service (EKS, AKS, GKE), who is responsible for pod security?',
    options: [
      'The cloud provider',
      'The customer',
      'Shared equally',
      'The Kubernetes community',
    ],
    correctIndex: 1,
    explanation: 'Even with managed Kubernetes, the customer is ALWAYS responsible for pod security, network policies, workload configuration, and application-level security. The cloud provider manages the control plane components but NOT what you deploy on the cluster.',
  },
  {
    id: 6,
    question: 'Which of the following provides the STRONGEST network isolation between namespaces?',
    options: [
      'Namespaces alone',
      'RBAC',
      'Network Policies',
      'Resource Quotas',
    ],
    correctIndex: 2,
    explanation: 'Network Policies provide actual network-level isolation by controlling pod-to-pod traffic. Namespaces alone are NOT a strong security boundary by default — they provide logical isolation but do not restrict network communication. RBAC controls API access, not network traffic.',
  },
  {
    id: 7,
    question: 'What is the recommended way to handle secrets in Kubernetes?',
    options: [
      'Store them in ConfigMaps',
      'Hardcode them in application code',
      'Use Kubernetes Secrets with encryption at rest or an external secret manager',
      'Store them as environment variables in plain text',
    ],
    correctIndex: 2,
    explanation: 'Kubernetes Secrets (with encryption at rest enabled) or external secret managers like HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault are the recommended approaches. Never hardcode secrets. Note that Kubernetes Secrets are only Base64 encoded by default — you MUST explicitly enable encryption at rest.',
  },
  {
    id: 8,
    question: 'What does "shift-left" security mean?',
    options: [
      'Moving security tools to the left side of the network diagram',
      'Integrating security early in the development lifecycle',
      'Prioritizing physical security over application security',
      'Using only cloud-native security tools',
    ],
    correctIndex: 1,
    explanation: 'Shift-left security means integrating security practices EARLY in the development lifecycle — during coding, building, and testing phases — rather than after deployment. It catches vulnerabilities before they reach production, which is significantly cheaper and faster.',
  },
  {
    id: 9,
    question: 'Which NIST publication provides a specific guide for Application Container Security?',
    options: [
      'NIST SP 800-53',
      'NIST SP 800-190',
      'NIST SP 800-171',
      'NIST CSF 2.0',
    ],
    correctIndex: 1,
    explanation: 'NIST SP 800-190 (Application Container Security Guide) is specifically focused on container security. NIST SP 800-53 covers general security controls for federal systems, while NIST CSF 2.0 provides the broader cybersecurity framework with five functions (Identify, Protect, Detect, Respond, Recover).',
  },
  {
    id: 10,
    question: 'What should you use to ensure only signed images are deployed to a Kubernetes cluster?',
    options: [
      'Network Policies',
      'Admission controller with image verification policy',
      'Resource Quotas',
      'Pod Security Standards',
    ],
    correctIndex: 1,
    explanation: 'An admission controller (such as Kyverno or OPA Gatekeeper) with an image verification policy can enforce that only signed images from trusted registries are deployed. This happens at deploy time, blocking any pods that use unsigned or untrusted images.',
  },
  {
    id: 11,
    question: 'Which three security frameworks are most commonly referenced for Kubernetes security?',
    options: [
      'NIST, CIS, ISO 27001',
      'OWASP, PCI DSS, HIPAA',
      'COBIT, ITIL, TOGAF',
      'SOC 2, GDPR, CCPA',
    ],
    correctIndex: 0,
    explanation: 'The three primary security frameworks for Kubernetes are: NIST (Cybersecurity Framework + SP 800-190 for containers), CIS (Kubernetes Benchmark + kube-bench tool), and ISO 27001 (ISMS standard with risk-based controls). These are frequently tested on the KCSA exam.',
  },
  {
    id: 12,
    question: 'What is the correct order of the 4Cs from outermost to innermost?',
    options: [
      'Code → Container → Cluster → Cloud',
      'Cloud → Cluster → Container → Code',
      'Cluster → Cloud → Container → Code',
      'Cloud → Container → Cluster → Code',
    ],
    correctIndex: 1,
    explanation: 'The correct order is: Cloud (outermost, the trusted computing base) → Cluster (orchestrator security) → Container (image and runtime security) → Code (innermost, application-level security). Each layer depends on the security of the layers beneath it.',
  },
];

/* ══════════════════════════ DOMAIN 1 PAGE ══════════════════════════ */
export default function Domain1Page() {
  const { markRead, updateScroll } = useProgress('domain1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.round((scrollTop / docHeight) * 100);
        updateScroll('domain1-main', pct);
        if (pct >= 90) markRead('domain1-main');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [markRead, updateScroll]);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* ── Breadcrumb ── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 text-xs mb-6"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <Link to="/" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
          Home
        </Link>
        <ChevronRight size={14} />
        <span>Domain 1: Overview of Cloud Native Security</span>
      </motion.nav>

      {/* ── Chapter Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="mb-10"
      >
        <h1
          className="text-3xl lg:text-4xl font-normal mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Overview of Cloud Native Security
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(242,196,77,0.15)',
              color: 'var(--accent-amber)',
            }}
          >
            14% exam weight
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            ~45 min read
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            7 sections
          </span>
        </div>

        <CalloutBox variant="exam">
          <strong>14% of the exam</strong> (approximately 11 questions). Focus on the 4Cs model
          (order and purpose of each layer), isolation techniques (Namespaces do NOT provide network
          isolation by themselves), image security best practices, and the shared responsibility model.
        </CalloutBox>
      </motion.div>

      {/* ══════════ Section 1.1: The 4Cs ══════════ */}
      <Section id="d1-4cs">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155,135,245,0.15)' }}
          >
            <Shield size={22} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.1 The 4Cs of Cloud Native Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The 4Cs of Cloud Native Security is a <strong>layered defense model</strong> — each layer builds
          on the one below it. You cannot secure an upper layer without first securing the layers beneath it.
          This is the foundational mental model for all cloud-native security.
        </p>

        <FourCsDiagram />

        <div className="space-y-4 mt-6">
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
            <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--accent-lavender)' }}>
              Cloud (Layer 1 — Outermost)
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The Cloud layer is the <strong>trusted computing base</strong> of a Kubernetes cluster.
              If compromised, nothing built on top can be considered secure. Covers: physical/virtual
              servers, network infrastructure, storage, IAM (AWS IAM, Azure RBAC, GCP IAM), encryption
              at rest, security groups, and VPN/bastion access. The cloud provider manages most of this
              in managed services.
            </p>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
            <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
              Cluster (Layer 2)
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Covers securing Kubernetes components: API Server, etcd, Controller Manager, Scheduler,
              Kubelet, and Kube-proxy. Key areas: RBAC authorization, Network Policies, Pod Security
              Standards, TLS for all component communication, etcd encryption at rest, and audit logging.
              This is the primary focus of the KCSA exam.
            </p>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
            <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--accent-amber)' }}>
              Container (Layer 3)
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Covers container <strong>image security</strong> and <strong>runtime security</strong>.
              Use minimal base images (distroless, Alpine, scratch), scan for CVEs (Trivy, Grype),
              sign images (Cosign/Notation), use trusted registries (Harbor, ECR, ACR), enforce
              non-root execution, apply seccomp/AppArmor/SELinux profiles, and set resource limits.
            </p>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
            <h4 className="text-base font-semibold mb-2" style={{ color: 'var(--accent-coral)' }}>
              Code (Layer 4 — Innermost)
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The layer developers have the most control over. Covers: no hard-coded secrets, SAST/DAST
              scanning, dependency scanning (SCA), secure coding practices (OWASP Top 10), code reviews,
              input validation, parameterized queries, and mTLS for all service-to-service communication.
            </p>
          </div>
        </div>

        <CalloutBox variant="exam">
          The 4Cs are applied <strong>OUTWARD to INWARD</strong> — you cannot secure the Code layer
          without first securing Cloud, Cluster, and Container. Each layer provides security for the
          layers inside it. Defense in Depth means securing ALL four layers independently.
        </CalloutBox>

        <CodeBlock
          language="yaml"
          code={`# Example: Security applied at multiple 4C layers

# CLOUD: AWS Security Group - restrict API Server access
# Only allow access from bastion hosts or authorized CIDR blocks

# CLUSTER: Network Policy - default deny all
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

# CONTAINER: Pod Security Context
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL

# CODE: Never hardcode secrets
# Use Kubernetes Secrets or external secret managers (Vault, AWS Secrets Manager)`}
        />
      </Section>

      {/* ══════════ Section 1.2: Cloud Provider ══════════ */}
      <Section id="d1-cloud">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155,135,245,0.15)' }}
          >
            <Cloud size={22} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.2 Cloud Provider and Infrastructure Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          In cloud-native deployments, security responsibility is <strong>shared</strong> between the
          cloud provider and the customer. Understanding this boundary is critical for the exam.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Shared Responsibility Model
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The rule of thumb: <strong>&quot;If you can access or configure it, it&apos;s your responsibility.&quot;</strong>
          You cannot walk into an Azure datacenter and touch the servers, but you CAN log into the portal
          and configure networking — therefore, networking is your responsibility.
        </p>

        <SharedResponsibilityTable />

        <CalloutBox variant="exam">
          Even with <strong>managed Kubernetes</strong> (EKS, AKS, GKE), the customer is ALWAYS responsible
          for: pod security, network policies, workload configuration, and application-level security.
          The provider manages the control plane components but NOT what you deploy on it.
        </CalloutBox>

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          Key Security Controls at the Cloud Layer
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              icon: Lock,
              title: 'IAM & Access Control',
              desc: 'Principle of least privilege, MFA, service account key rotation, group-level permissions.',
            },
            {
              icon: Network,
              title: 'Network Security',
              desc: 'VPC/VNet isolation, security groups, private subnets, bastion hosts, VPN access.',
            },
            {
              icon: Shield,
              title: 'Encryption',
              desc: 'Data at rest (EBS, S3), data in transit (TLS), key management (KMS, CloudHSM).',
            },
            {
              icon: FileCheck,
              title: 'Logging & Monitoring',
              desc: 'CloudTrail (AWS), Activity Logs (Azure), Cloud Audit Logs (GCP) — audit all API calls.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <item.icon size={16} style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════ Section 1.3: Controls & Frameworks ══════════ */}
      <Section id="d1-frameworks">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <FileCheck size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.3 Controls and Frameworks
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Multiple security frameworks guide cloud-native security practices. Understanding their
          scope and purpose is essential for the KCSA exam.
        </p>

        <FrameworksTable />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          Defense in Depth
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Defense in Depth (DiD) is a military-derived cybersecurity strategy employing{' '}
          <strong>multiple layers of security controls</strong>. If one layer fails, others continue
          to provide protection. The 4Cs model IS the implementation of defense in depth for
          cloud-native environments.
        </p>

        <CalloutBox variant="tip">
          Each layer of the 4Cs provides its own attack surface and may not be protected by the other
          layers. It is very important to apply security controls to each layer independently.
        </CalloutBox>

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          Running kube-bench
        </h3>

        <CodeBlock
          language="yaml"
          code={`# Run CIS Kubernetes Benchmark using kube-bench as a Job
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: Job
metadata:
  name: kube-bench
spec:
  template:
    spec:
      hostPID: true
      containers:
      - name: kube-bench
        image: aquasec/kube-bench:latest
        command: ["kube-bench"]
        volumeMounts:
        - name: var-lib-kubelet
          mountPath: /var/lib/kubelet
        - name: etc-systemd
          mountPath: /etc/systemd
        - name: etc-kubernetes
          mountPath: /etc/kubernetes
      volumes:
      - name: var-lib-kubelet
        hostPath:
          path: "/var/lib/kubelet"
      - name: etc-systemd
        hostPath:
          path: "/etc/systemd"
      - name: etc-kubernetes
        hostPath:
          path: "/etc/kubernetes"
      restartPolicy: Never
EOF`}
        />
      </Section>

      {/* ══════════ Section 1.4: Isolation Techniques ══════════ */}
      <Section id="d1-isolation">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(163,196,168,0.15)' }}
          >
            <Users size={22} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.4 Isolation Techniques
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Kubernetes provides multiple isolation mechanisms, each with different scope and strength.
          Understanding the differences is critical for the exam.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Namespaces
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Namespaces provide <strong>logical isolation</strong> within a cluster — resource grouping,
          access control boundaries, and resource quota scoping. The default namespaces are:{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>default</code>,{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>kube-system</code>,{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>kube-public</code>,{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>kube-node-lease</code>.
          Use them for dev/staging/prod separation and team boundaries.
        </p>

        <CalloutBox variant="warning">
          Namespaces are <strong>NOT a strong security boundary</strong> by default. They do NOT
          provide network isolation — you MUST implement Network Policies to enforce network isolation
          between namespaces.
        </CalloutBox>

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          Network Policies
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Default behavior: <strong>ALLOW ALL</strong> traffic. The first policy on a pod isolates
          that traffic direction (ingress or egress). Selectors include{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>podSelector</code>,{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>namespaceSelector</code>, and{' '}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-code)' }}>ipBlock</code>.
          Policies are additive (OR logic). Native NetworkPolicy is L3/L4 only — not application-layer (L7).
        </p>

        <CalloutBox variant="exam">
          The default NetworkPolicy behavior in Kubernetes is <strong>allow ALL</strong>. You need a
          CNI that enforces policies (Calico, Cilium). Flannel alone does NOT enforce NetworkPolicy.
          Without NetworkPolicies, any pod can communicate with any other pod in the cluster.
        </CalloutBox>

        <CodeBlock
          language="yaml"
          code={`# Create production namespace with resource quotas
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    environment: prod
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
---
# Default deny all ingress in production
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress`}
        />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          RBAC (Role-Based Access Control)
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          RBAC controls <strong>who</strong> can access <strong>which</strong> resources. Key components:
          <strong>Role</strong> (namespace-scoped permissions),{' '}
          <strong>ClusterRole</strong> (cluster-wide permissions),{' '}
          <strong>RoleBinding</strong> (grants Role to users/groups/SAs in a namespace),{' '}
          <strong>ClusterRoleBinding</strong> (grants ClusterRole cluster-wide).
          Best practice: least privilege, avoid wildcards, restrict cluster-admin, audit regularly.
        </p>
      </Section>

      {/* ══════════ Section 1.5: Image Security ══════════ */}
      <Section id="d1-images">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(242,196,77,0.15)' }}
          >
            <Container size={22} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.5 Artifact Repository and Image Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Container images are the deployable artifacts in Kubernetes. Securing them is critical
          because a compromised image can introduce vulnerabilities across the entire cluster.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Image Security Best Practices
        </h3>

        <div className="space-y-3 mb-6">
          {[
            {
              title: 'Use minimal base images',
              desc: 'distroless, scratch, Alpine — smaller attack surface, fewer CVEs.',
            },
            {
              title: 'Scan for vulnerabilities',
              desc: 'Trivy, Grype, Snyk — scan in CI/CD pipeline before deployment.',
            },
            {
              title: 'Sign images',
              desc: 'Cosign (Sigstore), Notation — verify authenticity before deployment.',
            },
            {
              title: 'Use private registries',
              desc: 'Harbor, ECR, ACR, GCR — never pull from public Docker Hub in production.',
            },
            {
              title: 'Use immutable references',
              desc: 'Reference images by digest SHA (image@sha256:...) not tags (image:latest).',
            },
            {
              title: 'Admission control',
              desc: 'Only allow images from trusted registries (Kyverno/OPA policy).',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo, delay: i * 0.06 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                }}
              >
                {i + 1}
              </span>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Image Signing with Cosign
        </h3>

        <CodeBlock
          language="bash"
          code={`# Generate a key pair for signing
cosign generate-key-pair

# Sign an image
cosign sign --key cosign.key myregistry.io/myapp:v1.0.0

# Verify signature in CI/CD or admission controller
cosign verify --key cosign.pub myregistry.io/myapp:v1.0.0`}
        />
      </Section>

      {/* ══════════ Section 1.6: Workload Security ══════════ */}
      <Section id="d1-workload">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232,122,93,0.15)' }}
          >
            <Lock size={22} style={{ color: 'var(--accent-coral)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.6 Workload and Application Code Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Application-level security is the final and most granular layer of the 4Cs. This is where
          developers have the most direct control.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Secrets Management
        </h3>

        <CalloutBox variant="exam">
          Kubernetes Secrets are only <strong>Base64 encoded</strong> by default — NOT encrypted.
          Anyone with access to etcd can decode and read them. You MUST explicitly enable encryption
          at rest via the EncryptionConfiguration.
        </CalloutBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            'Never hardcode secrets in source code or ConfigMaps',
            'Use Kubernetes Secrets with encryption at rest',
            'Use external secret managers (Vault, AWS Secrets Manager)',
            'Mount secrets as volumes (more secure than env vars)',
            'Rotate secrets regularly',
            'Use RBAC to control secret access',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                color: 'var(--text-secondary)',
              }}
            >
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              {item}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          SAST, DAST, and SCA
        </h3>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Type', 'When', 'What It Finds', 'Tools'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left"
                    style={{
                      backgroundColor: 'rgba(4,80,54,0.08)',
                      color: 'var(--accent-primary)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  type: 'SAST',
                  when: 'Before execution',
                  finds: 'SQL injection, XSS, hardcoded secrets',
                  tools: 'SonarQube, Checkmarx, Semgrep',
                },
                {
                  type: 'DAST',
                  when: 'Runtime testing',
                  finds: 'Auth weaknesses, config errors, API issues',
                  tools: 'OWASP ZAP, Burp Suite',
                },
                {
                  type: 'SCA',
                  when: 'Dependency analysis',
                  finds: 'Vulnerable open-source libraries',
                  tools: 'Snyk, Trivy, OWASP Dependency-Check',
                },
              ].map((row, i) => (
                <tr
                  key={row.type}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
                  }}
                >
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.type}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.when}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.finds}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.tools}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ══════════ Section 1.7: DevSecOps ══════════ */}
      <Section id="d1-devsecops">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <Shield size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            1.7 DevSecOps and Shift-Left Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Shift-left security means integrating security practices <strong>early</strong> in the
          software development lifecycle — during coding, building, and testing — rather than after
          deployment. Security is everyone&apos;s responsibility, not just a security team.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          DevSecOps Pipeline
        </h3>

        <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { stage: 'Plan', sec: 'Threat model' },
              { stage: 'Develop', sec: 'SAST scan' },
              { stage: 'Build', sec: 'Image scan' },
              { stage: 'Test', sec: 'DAST scan' },
              { stage: 'Release', sec: 'Sign image' },
              { stage: 'Deploy', sec: 'Config audit' },
              { stage: 'Operate', sec: 'Runtime detect' },
              { stage: 'Monitor', sec: 'SIEM/alert' },
            ].map((step, i) => (
              <div key={step.stage} className="flex items-center gap-2">
                <div
                  className="px-3 py-2 rounded-lg text-center"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {step.stage}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--accent-primary)' }}>
                    {step.sec}
                  </div>
                </div>
                {i < 7 && (
                  <ArrowRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Key DevSecOps Principles
        </h3>

        <div className="space-y-3 mb-6">
          {[
            {
              title: 'Automate security testing',
              desc: 'Every code commit triggers security scans in CI/CD.',
            },
            {
              title: 'Fail fast',
              desc: 'Block builds with critical vulnerabilities — do not let them reach production.',
            },
            {
              title: 'Immutable infrastructure',
              desc: 'Do not patch running containers. Rebuild and redeploy instead.',
            },
            {
              title: 'Continuous compliance',
              desc: 'Policy as Code with OPA/Kyverno for automated compliance checking.',
            },
            {
              title: 'Security observability',
              desc: 'Runtime threat detection with Falco, Tetragon, and comprehensive audit logging.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.title}:
                </span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <CalloutBox variant="tip">
          DevSecOps strengthens cloud-native security by integrating proactive security checks into
          CI/CD pipelines, automating container image scanning, and enforcing Kubernetes policies
          like network segmentation and pod security.
        </CalloutBox>
      </Section>

      {/* ══════════ Quiz ══════════ */}
      <Section id="d1-quiz">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <FileCheck size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h2
              className="text-2xl font-normal"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Chapter Quiz
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Test your knowledge of Domain 1 concepts
            </p>
          </div>
        </div>

        <QuizComponent questions={domain1Questions} domainId="domain1" />
      </Section>

      {/* ══════════ Chapter Footer ══════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mt-16 pt-8"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowRight size={14} className="rotate-180" />
          Back to Dashboard
        </Link>

        <Link
          to="/domain2"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-primary)',
          }}
        >
          Domain 2: Cluster Components
          <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
