import { Link } from 'react-router';
import {
  Cloud,
  Server,
  Container,
  Code2,
  ArrowRight,
  Lock,
  FileCheck,
  Users,
  Check,
  Flame,
  Shield,
} from 'lucide-react';
import ELI5 from '@/components/ELI5';
import ExplainLikeImFive from '@/components/ExplainLikeImFive';
import Callout from '@/components/Callout';
import CalloutBox from '@/components/CalloutBox';
import CodeBlock from '@/components/CodeBlock';
import ComparisonTable from '@/components/ComparisonTable';
import QuizComponent from '@/components/QuizComponent';
import MemorizeThis from '@/components/MemorizeThis';
import PatternTable from '@/components/PatternTable';
import MnemonicStory from '@/components/MnemonicStory';
import SectionComplete from '@/components/SectionComplete';
import { useProgress } from '@/hooks/useProgress';
import type { QuizQuestion } from '@/components/QuizComponent';

import MemoryHook from '@/components/MemoryHook';
import ExamTrap from '@/components/ExamTrap';

/* ── Simple Section Wrapper ── */
function Section({ children, id, className = '', color = 'var(--accent-primary)' }: { children: React.ReactNode; id?: string; className?: string; color?: string }) {
  return (
    <section id={id} className={`mb-16 pl-2 md:pl-4 ${className}`} style={{ borderLeft: `3px solid ${color}20`, paddingBottom: '1rem', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '0 12px 12px 0' }}>
      {children}
    </section>
  );
}

/* ── Progress Indicator ── */
function DomainProgress({ completed, total }: { completed: number; total: number }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="mb-8 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Domain Progress</span>
        <span className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{completed} / {total} sections</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: 'var(--accent-primary)' }} />
      </div>
    </div>
  );
}

/* ── Key Takeaway Box ── */
function KeyTakeaway({ items }: { items: string[] }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(4,80,54,0.04)', border: '1px solid var(--accent-primary)' }}>
      <div className="px-5 py-3" style={{ backgroundColor: 'rgba(4,80,54,0.06)', borderBottom: '1px solid rgba(4,80,54,0.1)' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>📌 Key Takeaways</span>
      </div>
      <div className="px-4 md:px-5 py-4">
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-primary)' }}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── 4Cs Diagram ── */
function FourCsDiagram() {
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
    <div className="max-w-[560px] mx-auto my-10">
      <div className="flex flex-col gap-3">
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <div key={layer.label} className="flex items-center gap-4 px-5 py-4 rounded-lg border-2" style={{ borderColor: layer.color, backgroundColor: `${layer.color}12` }}>
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${layer.color}20` }}>
                <Icon size={22} style={{ color: layer.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: layer.color }}>{layer.label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {layer.items.map((item) => (
                    <span key={item} className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: 'var(--surface-base)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1 my-3">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Defense flows inward</span>
        <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} />
      </div>
    </div>
  );
}

/* ── Shared Responsibility Table ── */
function SharedResponsibilityTable() {
  const rows = [
    { layer: 'Physical / Hypervisor', provider: true, customer: false },
    { layer: 'Host OS (managed K8s)', provider: true, customer: 'Limited' },
    { layer: 'Kubernetes Control Plane', provider: true, customer: false },
    { layer: 'Worker Nodes', provider: 'Partial', customer: true },
    { layer: 'Pod / Workload', provider: false, customer: true },
    { layer: 'Application / Code', provider: false, customer: true },
  ];

  const getCellColor = (value: string | boolean) => {
    if (typeof value === 'string') { return 'var(--text-secondary)'; }
    if (value) { return 'var(--accent-sage)'; }
    return 'var(--text-tertiary)';
  };

  const getCellText = (value: string | boolean) => {
    if (typeof value === 'string') { return value; }
    if (value) { return '✓'; }
    return '—';
  };

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th className="px-4 py-3 text-left rounded-tl-lg" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)' }}>Layer</th>
            <th className="px-4 py-3 text-center" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)' }}>Cloud Provider</th>
            <th className="px-4 py-3 text-center rounded-tr-lg" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-subtle)', borderTop: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>Customer</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)', borderLeft: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>{row.layer}</td>
              <td className="px-4 py-3 text-center" style={{ borderBottom: '1px solid var(--border-subtle)', color: getCellColor(row.provider) }}>
                {getCellText(row.provider)}
              </td>
              <td className="px-4 py-3 text-center" style={{ borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', color: getCellColor(row.customer) }}>
                {getCellText(row.customer)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Section Mini Quiz Questions ── */
const d1c1Questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which layer of the 4Cs is the foundation?',
    options: ['Cloud', 'Cluster', 'Container', 'Code'],
    correctIndex: 0,
    explanation: 'Cloud is the outermost layer and the foundation. Without secure cloud infrastructure, everything above it is at risk.',
  },
  {
    id: 2,
    question: 'In the shared responsibility model, who secures worker nodes in a managed Kubernetes service?',
    options: ['Cloud provider only', 'Customer only', 'Both share responsibility', 'Neither'],
    correctIndex: 2,
    explanation: 'Worker nodes are a shared responsibility — the provider manages the OS patches for managed node pools, but the customer configures network policies, RBAC, and workload security.',
  },
  {
    id: 3,
    question: 'Which layer includes image scanning and signing?',
    options: ['Cloud', 'Cluster', 'Container', 'Code'],
    correctIndex: 2,
    explanation: 'Image scanning, signing, and runtime protection are all Container layer concerns.',
  },
  {
    id: 4,
    question: 'What does "defense in depth" mean in the context of the 4Cs?',
    options: ['Using the most expensive security tools', 'Applying security controls at every layer', 'Focusing only on the perimeter', 'Encrypting everything with the same key'],
    correctIndex: 1,
    explanation: 'Defense in depth means applying security controls at every layer so that if one layer is breached, the next layer still provides protection.',
  },
];

const d1c2Questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which tool automatically assesses your cluster against the CIS Kubernetes Benchmark?',
    options: ['Falco', 'kube-bench', 'Trivy', 'OPA Gatekeeper'],
    correctIndex: 1,
    explanation: 'kube-bench is the official tool from Aqua Security that checks your cluster configuration against the CIS Kubernetes Benchmark.',
  },
  {
    id: 2,
    question: 'What are the five functions of the NIST Cybersecurity Framework?',
    options: ['Plan, Do, Check, Act, Improve', 'Identify, Protect, Detect, Respond, Recover', 'Prevent, Detect, Analyze, Contain, Eradicate', 'Assess, Monitor, Enforce, Report, Remediate'],
    correctIndex: 1,
    explanation: 'NIST CSF has five core functions: Identify, Protect, Detect, Respond, and Recover.',
  },
  {
    id: 3,
    question: 'Which framework maps adversary tactics to specific Kubernetes threats?',
    options: ['CIS Benchmark', 'NIST 800-53', 'MITRE ATT&CK for Containers', 'ISO 27001'],
    correctIndex: 2,
    explanation: 'MITRE ATT&CK for Containers maps tactics like Initial Access, Execution, and Persistence to Kubernetes-specific techniques.',
  },
  {
    id: 4,
    question: 'ISO 27001 and SOC 2 are primarily what type of frameworks?',
    options: ['Technical hardening guides', 'Audit and compliance frameworks', 'Threat intelligence feeds', 'Runtime security tools'],
    correctIndex: 1,
    explanation: 'ISO 27001 and SOC 2 are audit/compliance frameworks that require documented policies and evidence of security controls.',
  },
];

const d1c3Questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Are namespaces a security boundary by default?',
    options: ['Yes, pods cannot communicate across namespaces', 'No, pods can still communicate across namespaces without NetworkPolicies', 'Only with RBAC enabled', 'Only in restricted namespaces'],
    correctIndex: 1,
    explanation: 'Namespaces provide logical separation but are NOT a security boundary by default. You need NetworkPolicies and RBAC for true isolation.',
  },
  {
    id: 2,
    question: 'What happens if you apply a ResourceQuota but no LimitRange in a namespace?',
    options: ['Pods get default resource limits', 'Pods without explicit requests are rejected', 'All pods run with unlimited resources', 'The quota is ignored'],
    correctIndex: 1,
    explanation: 'A ResourceQuota without a LimitRange will reject pods that do not specify explicit resource requests — there is no default to fall back to.',
  },
  {
    id: 3,
    question: 'Which runtime isolation technology runs containers in lightweight VMs?',
    options: ['seccomp', 'AppArmor', 'gVisor', 'SELinux'],
    correctIndex: 2,
    explanation: 'gVisor and Kata Containers provide stronger isolation by running containers in sandboxed or VM-like environments.',
  },
  {
    id: 4,
    question: 'What is the recommended first NetworkPolicy in any namespace?',
    options: ['Allow all ingress from any namespace', 'Allow all egress to the internet', 'Default deny all ingress and egress', 'Allow DNS only'],
    correctIndex: 2,
    explanation: 'A default-deny NetworkPolicy blocks all traffic until you explicitly allow required flows. This is defense in depth.',
  },
];

const d1c4Questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which image scanning tool is commonly used in CI/CD pipelines?',
    options: ['kube-bench', 'Falco', 'Trivy', 'Vault'],
    correctIndex: 2,
    explanation: 'Trivy is a popular open-source scanner for container images, filesystems, and repositories.',
  },
  {
    id: 2,
    question: 'What is the modern standard for container image signing?',
    options: ['GPG', 'Docker Content Trust', 'Sigstore / cosign', 'x509 certificates'],
    correctIndex: 2,
    explanation: 'Sigstore (with cosign) is the modern, keyless signing standard backed by the OpenSSF.',
  },
  {
    id: 3,
    question: 'Which base image type removes package managers and shells to reduce attack surface?',
    options: ['Alpine', 'Ubuntu', 'Distroless', 'Debian'],
    correctIndex: 2,
    explanation: 'Distroless images contain only your application and its runtime dependencies — no shell, no package manager, nothing extra to exploit.',
  },
  {
    id: 4,
    question: 'Why should you use private registries instead of public Docker Hub for production?',
    options: ['They are always faster', 'They provide scanning, RBAC, and retention policies', 'Public registries are illegal', 'Private registries are free'],
    correctIndex: 1,
    explanation: 'Private registries like Harbor, ECR, and GCR offer vulnerability scanning, access control, and policy enforcement that public registries lack.',
  },
];

const d1c4bQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does IMDSv2 require that IMDSv1 did not?',
    options: ['mTLS certificates', 'A session token from a PUT request', 'Kerberos authentication', 'API keys'],
    correctIndex: 1,
    explanation: 'IMDSv2 requires a session token obtained via a PUT request, which prevents simple SSRF attacks that worked against IMDSv1.',
  },
  {
    id: 2,
    question: 'Which GKE feature maps Kubernetes ServiceAccounts to Google IAM?',
    options: ['Metadata Concealment', 'Workload Identity', 'Managed Identity', 'IRSA'],
    correctIndex: 1,
    explanation: 'GKE Workload Identity maps K8s ServiceAccounts to Google IAM service accounts, giving pods short-lived OAuth tokens.',
  },
  {
    id: 3,
    question: 'What is the AWS equivalent of GKE Workload Identity?',
    options: ['Metadata Concealment', 'IRSA / EKS Pod Identity', 'Azure AD', 'Managed Identity'],
    correctIndex: 1,
    explanation: 'IRSA (IAM Roles for ServiceAccounts) and the newer EKS Pod Identity provide AWS IAM integration for pods.',
  },
  {
    id: 4,
    question: 'Without IMDSv2, what IP address can a compromised pod query to steal node IAM credentials?',
    options: ['127.0.0.1', '10.0.0.1', '169.254.169.254', '8.8.8.8'],
    correctIndex: 2,
    explanation: '169.254.169.254 is the link-local address for instance metadata services. IMDSv2 blocks simple GET requests to this address.',
  },
];

const d1c4cQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which is the BEST practice for registry authentication?',
    options: ['imagePullSecrets on every pod', 'ServiceAccount imagePullSecrets', 'Node-wide credential providers', 'Hardcoded credentials in Dockerfiles'],
    correctIndex: 1,
    explanation: 'Attaching imagePullSecrets to a ServiceAccount is the best practice — all pods using that SA automatically inherit the credentials.',
  },
  {
    id: 2,
    question: 'What is the danger of using IfNotPresent with :latest tag?',
    options: ['It pulls too often', 'It silently uses a stale cached image', 'It always fails', 'It exposes credentials'],
    correctIndex: 1,
    explanation: 'IfNotPresent with :latest means if the image is cached locally, Kubernetes will NOT pull a newer version. You get a silent stale image.',
  },
  {
    id: 3,
    question: 'Which open-source registry has built-in vulnerability scanning and RBAC?',
    options: ['Docker Hub', 'Amazon ECR', 'Harbor', 'Google GCR'],
    correctIndex: 2,
    explanation: 'Harbor is an open-source registry with built-in scanning (via Trivy or Clair), RBAC, and image signing support.',
  },
  {
    id: 4,
    question: 'What image pull policy should you use with immutable tags in production?',
    options: ['Never', 'IfNotPresent', 'Always', 'Latest'],
    correctIndex: 2,
    explanation: 'Always ensures you always get the exact tagged image from the registry, preventing node cache poisoning attacks.',
  },
];

const d1c4dQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the leading cause of cloud data breaches according to industry reports?',
    options: ['Zero-day exploits', 'Misconfiguration', 'Insider threats', 'DDoS attacks'],
    correctIndex: 1,
    explanation: 'The Cloud Security Alliance and multiple reports consistently rank misconfiguration as the #1 cause of cloud data breaches.',
  },
  {
    id: 2,
    question: 'Which of the following is a misconfiguration risk?',
    options: ['Overly permissive S3 bucket', 'Default security group allowing all traffic', 'Missing encryption on storage', 'All of the above'],
    correctIndex: 3,
    explanation: 'All are classic misconfiguration risks. A single overly permissive resource can expose an entire organization.',
  },
  {
    id: 3,
    question: 'Some curricula list "Configuration" as the 4th C instead of Code. Why?',
    options: ['Code is not important', 'Misconfiguration causes more breaches than code vulnerabilities', 'Configuration is easier to test', 'It is a newer standard'],
    correctIndex: 1,
    explanation: 'The variation emphasizes that misconfiguration — not fancy exploits — is the primary cause of cloud breaches.',
  },
];

const d1c5Questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does "shifting left" mean in DevSecOps?',
    options: ['Moving workloads to western data centers', 'Integrating security earlier in the development lifecycle', 'Using left-handed security tools', 'Deploying on the left side of a cluster diagram'],
    correctIndex: 1,
    explanation: '"Shifting left" means integrating security practices earlier in the SDLC — before deployment, not after.',
  },
  {
    id: 2,
    question: 'What is "immutable infrastructure" in container security?',
    options: ['Infrastructure that never changes', 'Rebuild and redeploy instead of patching running containers', 'Using immutable Linux distributions', 'Infrastructure that cannot be deleted'],
    correctIndex: 1,
    explanation: 'Immutable infrastructure means you never patch a running container. You rebuild the image and redeploy.',
  },
  {
    id: 3,
    question: 'Which tools enforce Policy as Code in Kubernetes?',
    options: ['Falco and Trivy', 'OPA / Gatekeeper and Kyverno', 'kube-bench and Vault', 'Prometheus and Grafana'],
    correctIndex: 1,
    explanation: 'OPA (Open Policy Agent) with Gatekeeper and Kyverno are the leading Policy-as-Code tools for Kubernetes.',
  },
  {
    id: 4,
    question: 'Why should CI/CD pipelines "fail fast" on critical vulnerabilities?',
    options: ['To save compute costs', 'To prevent vulnerable code from reaching production', 'To speed up builds', 'Because auditors require it'],
    correctIndex: 1,
    explanation: 'Failing fast means blocking the build when critical vulnerabilities are found, preventing them from ever reaching production.',
  },
];

/* ── End-of-Domain Quiz Questions ── */
const domain1Questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What are the four layers of the 4Cs of Cloud Native Security model?',
    options: ['Cloud, Cluster, Container, Code', 'Cloud, Cluster, Compute, Code', 'Cloud, Control Plane, Container, Code', 'Cloud, Cluster, Container, Configuration'],
    correctIndex: 0,
    explanation: 'The 4Cs model consists of Cloud (infrastructure), Cluster (Kubernetes), Container (runtime), and Code (application).',
  },
  {
    id: 2,
    question: 'Which standard provides prescriptive recommendations for Kubernetes hardening?',
    options: ['ISO 27001', 'NIST 800-53', 'CIS Kubernetes Benchmark', 'SOC 2'],
    correctIndex: 2,
    explanation: 'The CIS Kubernetes Benchmark is the industry standard for Kubernetes hardening, providing specific configuration recommendations.',
  },
  {
    id: 3,
    question: 'What is the primary purpose of Pod Security Standards?',
    options: ['Encrypt secrets at rest', 'Restrict what pods can do in a cluster', 'Monitor pod network traffic', 'Automatically update pod images'],
    correctIndex: 1,
    explanation: 'Pod Security Standards define three policies (Privileged, Baseline, Restricted) that restrict what pods can do in a cluster.',
  },
  {
    id: 4,
    question: 'In a managed Kubernetes service, who is typically responsible for securing the control plane?',
    options: ['The customer', 'The cloud provider', 'Both equally', 'Neither'],
    correctIndex: 1,
    explanation: 'In managed Kubernetes (EKS, GKE, AKS), the cloud provider manages and secures the control plane components.',
  },
  {
    id: 5,
    question: 'What does "shifting left" mean in DevSecOps?',
    options: ['Moving workloads to the left in a cluster diagram', 'Integrating security earlier in the development lifecycle', 'Deploying to western data centers', 'Using left-handed security tools'],
    correctIndex: 1,
    explanation: '"Shifting left" means integrating security practices earlier in the software development lifecycle, before deployment.',
  },
];

/* ═══════════════════════════════════════════════
   DOMAIN 1 PAGE
   ═══════════════════════════════════════════════ */
export default function Domain1Page() {
  useProgress('domain1');

  const totalSections = 8;
  const DOMAIN_COLOR = '#0969da';
  const DOMAIN_BG = '#ddf4ff';

  return (
    <div>
      {/* Header */}
      <div
        className="mb-10 p-6 rounded-xl border-l-4"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderLeftColor: DOMAIN_COLOR,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield size={20} style={{ color: DOMAIN_COLOR }} />
          <span className="text-sm font-bold" style={{ color: DOMAIN_COLOR, fontFamily: 'var(--font-mono)' }}>
            Domain 1
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: DOMAIN_BG, color: DOMAIN_COLOR }}>
            14% of exam
          </span>
        </div>
        <h1 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
          Overview of Cloud Native Security
        </h1>
        <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
          The 4Cs of Cloud Native Security, security frameworks, isolation techniques, image security, and DevSecOps practices.
        </p>
      </div>

      <DomainProgress completed={0} total={totalSections} />

      {/* ═══════ The 4Cs Model ═══════ */}
      <Section id="d1-c1" color={DOMAIN_COLOR}>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(232,122,93,0.1)', color: 'var(--accent-coral)' }}>
          <Flame size={12} />
          🔥 This section covers ~4% of the exam
        </div>

        <h2 className="flex items-center gap-3">
          <Lock size={24} style={{ color: 'var(--accent-primary)' }} />
          The 4Cs of Cloud Native Security
        </h2>

        <Callout variant="exam" title="Why This Matters for the Exam">
          The 4Cs model is the foundational mental model for the entire KCSA exam. Nearly every question can be mapped back to which layer a control belongs in. If you understand the 4Cs, you understand 30% of what the exam tests.
        </Callout>

        <ELI5 title="🧒 ELI5: The 4Cs of Cloud Native Security">
          <p className="mb-2">
            Imagine you're building a sandcastle on a beach. The <strong>Cloud</strong> is the beach itself — if the tide comes in and washes away the beach, your castle is gone no matter how well you built it. The <strong>Cluster</strong> is the moat and walls around your castle — they protect the overall structure. The <strong>Container</strong> is each individual tower — some are strong, some are weak. The <strong>Code</strong> is the sand recipe you use — even with perfect walls, if your sand is bad, the castle collapses.
          </p>
          <p>
            <strong>In other words:</strong> You can't secure the inside if the outside is broken. Security flows inward from the foundation (Cloud) to the application (Code).
          </p>
        </ELI5>

        <p style={{ color: 'var(--text-secondary)' }}>
          Cloud native security is built in layers, often referred to as the <strong>4Cs</strong>: Cloud, Cluster, Container, and Code. Each layer builds on the security of the previous one. You cannot secure containers properly if the cluster is compromised, and you cannot secure the cluster if the cloud infrastructure is insecure.
        </p>

        <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
          <strong>💼 Real-World Impact:</strong> Misconfiguration at the Cloud layer (like an open S3 bucket) has caused more data breaches than any advanced hacking technique. Fix the foundation first.
        </p>

        <FourCsDiagram />

        <MemoryHook title="🧠 The 4Cs — Memorize the Order">
          <p className="mb-2"><strong>Think of it like peeling an onion from the outside in:</strong></p>
          <ol className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li><strong>1. Cloud</strong> — The infrastructure ground floor</li>
            <li><strong>2. Cluster</strong> — The Kubernetes building</li>
            <li><strong>3. Container</strong> — The individual offices</li>
            <li><strong>4. Code</strong> — What happens inside each office</li>
          </ol>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam tip: Questions often ask which layer a control belongs to. IAM or NSG = Cloud. API server or etcd = Cluster. Image scanning = Container.</p>
        </MemoryHook>

        <ExplainLikeImFive concept="namespaces" />

        <MnemonicStory title="The Office Building Memory Palace" pattern="Cloud = Ground floor (foundation) → Cluster = Building management → Container = Individual offices → Code = What happens inside each office">
          Imagine a corporate office building. <strong>Cloud</strong> is the ground, the foundation, the power grid, the security guards at the gate — if the ground is shaky, the whole building falls. <strong>Cluster</strong> is the building management system — elevators, HVAC, keycard access to floors. <strong>Container</strong> is each individual office — some have glass walls, some are locked vaults. <strong>Code</strong> is what the employees actually do inside — no matter how secure the building, if an employee opens every door and invites thieves in, you are compromised.
        </MnemonicStory>

        <h3>Cloud Layer</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Cloud layer is the foundation. It includes the physical infrastructure, the hypervisor, the network, and the cloud provider&apos;s security controls. This is where you configure IAM policies, network security groups, encryption at rest, and logging.
        </p>

        <Callout variant="exam">
          The Cloud provider manages the control plane in managed Kubernetes services (EKS, GKE, AKS). You are responsible for worker nodes, workloads, and applications.
        </Callout>

        <h3>Cluster Layer</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Cluster layer includes the Kubernetes control plane (API Server, etcd, Scheduler, Controller Manager) and the worker nodes. Security here involves TLS between components, RBAC, network policies, admission controllers, and pod security.
        </p>

        <h3>Container Layer</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Container security focuses on the images and runtime. Key practices: scan images for vulnerabilities, sign images with cosign/notation, enforce resource limits, avoid running as root, use distroless images, and apply seccomp/AppArmor profiles.
        </p>

        <h3>Code Layer</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Code layer is the innermost and most critical. Even with perfect infrastructure security, a vulnerable application can be exploited. Practices: SAST/DAST scanning, dependency vulnerability checks, secrets management, input validation, and secure coding standards.
        </p>

        <SharedResponsibilityTable />

        <CalloutBox variant="tip">
          Defense in depth means applying security controls at every layer. If an attacker breaches one layer, the next layer should still provide protection.
        </CalloutBox>

        <MemorizeThis
          title="The 4Cs — Memorize the Order"
          selfTest={{ question: 'Name the 4Cs in order from outermost to innermost.', answer: 'Cloud → Cluster → Container → Code' }}
        >
          <p className="mb-2">Think of it like peeling an onion from the outside in:</p>
          <ol className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li><strong>1. Cloud</strong> — The infrastructure ground floor</li>
            <li><strong>2. Cluster</strong> — The Kubernetes building</li>
            <li><strong>3. Container</strong> — The individual offices</li>
            <li><strong>4. Code</strong> — What happens inside each office</li>
          </ol>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam tip: Questions often ask which layer a control belongs to. If it involves IAM or network security groups, it is Cloud. If it involves API server or etcd, it is Cluster. If it involves image scanning, it is Container.</p>
        </MemorizeThis>

        <KeyTakeaway items={[
          'The 4Cs are Cloud, Cluster, Container, Code — defense flows inward from the foundation.',
          'You cannot secure upper layers if lower layers are compromised.',
          'In managed K8s, the provider secures the control plane; you secure worker nodes and workloads.',
          'Defense in depth requires security controls at every layer, not just the perimeter.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c1Questions} domainId="d1-c1" />
        </div>

        <SectionComplete sectionName="The 4Cs of Cloud Native Security" sectionNumber={1} totalSections={totalSections} />
      </Section>

      {/* ═══════ Security Frameworks ═══════ */}
      <Section id="d1-c2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(232,122,93,0.1)', color: 'var(--accent-coral)' }}>
          <Flame size={12} />
          🔥 This section covers ~3% of the exam
        </div>

        <h2 className="flex items-center gap-3">
          <FileCheck size={24} style={{ color: 'var(--accent-primary)' }} />
          Security Frameworks
        </h2>

        <Callout variant="exam" title="Why This Matters for the Exam">
          Expect 2-3 questions that ask you to match a framework to its purpose. The exam loves testing whether you know the difference between technical standards (CIS), compliance frameworks (ISO/SOC 2), and threat models (MITRE).
        </Callout>

        <ELI5 title="🧒 ELI5: Security Frameworks">
          <p className="mb-2">
            Imagine you want to build a house. Different frameworks are like different guides:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>CIS Benchmark</strong> = The building code inspector who gives you a checklist: "Did you use fire-resistant materials? Are the locks on the doors?" (specific, testable)</li>
            <li><strong>NIST CSF</strong> = The emergency plan: "What do we do before, during, and after a fire?" (process-oriented)</li>
            <li><strong>ISO 27001 / SOC 2</strong> = The home insurance company that says "Prove you have smoke detectors and we'll cover you." (audit/compliance)</li>
            <li><strong>MITRE ATT&CK</strong> = The neighborhood watch that documents how burglars actually break in, so you know what to defend against. (threat intelligence)</li>
          </ul>
          <p>
            <strong>In other words:</strong> CIS tells you <em>what</em> to do. NIST tells you <em>when</em> to do it. ISO/SOC 2 makes you <em>prove</em> you did it. MITRE tells you <em>what the bad guys do</em>.
          </p>
        </ELI5>

        <h3>NIST Cybersecurity Framework</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The NIST CSF provides five core functions: Identify, Protect, Detect, Respond, and Recover. For Kubernetes, this translates to asset inventory, hardening configurations, audit logging, incident response playbooks, and backup/restore procedures.
        </p>

        <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
          <strong>🎯 Why This Matters:</strong> This appears on ~10% of exam questions. Know the 5 functions in order.
        </p>

        <MnemonicStory title="The Firefighter Story" pattern="Identify → Protect → Detect → Respond → Recover">
          Imagine you are a fire chief. First you <strong>Identify</strong> where fires could start (risk assessment). Then you <strong>Protect</strong> buildings with sprinklers and fire doors (hardening). You install smoke detectors to <strong>Detect</strong> fires early (monitoring). When a fire happens, you <strong>Respond</strong> with hoses and trucks (incident response). Finally, you <strong>Recover</strong> by rebuilding (backups, DR). NIST CSF is your fire department playbook.
        </MnemonicStory>

        <h3>CIS Kubernetes Benchmark</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Center for Internet Security (CIS) publishes the definitive Kubernetes hardening guide. It contains specific, testable recommendations for every component. Tools like <strong>kube-bench</strong> automatically assess your cluster against the benchmark.
        </p>

        <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
          <strong>💼 Real-World Impact:</strong> Failing CIS checks is like leaving your house with unlocked doors — easy to fix, but devastating if ignored.
        </p>

        <CodeBlock
          language="bash"
          code={`# Run kube-bench as a job in your cluster
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

# Check results
kubectl logs job/kube-bench`}
        />

        <MemorizeThis
          selfTest={{ question: 'Which tool runs the CIS Kubernetes Benchmark automatically?', answer: 'kube-bench' }}
        >
          <p><strong>CIS = Center for Internet Security</strong></p>
          <p className="mt-1">The CIS Benchmark is prescriptive — it tells you exactly what settings to change. kube-bench automates the checking.</p>
        </MemorizeThis>

        <h3>ISO 27001 / SOC 2</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          These are audit and compliance frameworks rather than technical standards. They require documented policies, access controls, incident management, and continuous monitoring. Kubernetes environments must be able to demonstrate compliance through audit logs and policy enforcement.
        </p>

        <PatternTable
          title="Framework Pattern Match"
          subtitle="What each framework actually does"
          headers={['Framework', 'Type', 'What It Gives You']}
          rows={[
            { label: 'CIS Benchmark', values: ['Technical standard', 'Specific, testable hardening recommendations'], highlight: true },
            { label: 'NIST CSF', values: ['Risk framework', '5 functions: Identify, Protect, Detect, Respond, Recover'] },
            { label: 'ISO 27001', values: ['Compliance / Audit', 'Requires documented policies and evidence'] },
            { label: 'SOC 2', values: ['Compliance / Audit', 'Trust services criteria for service organizations'] },
            { label: 'MITRE ATT&CK', values: ['Threat model', 'Maps adversary tactics to specific techniques'] },
          ]}
          tip="Exam trap: CIS is prescriptive (do this). ISO/SOC 2 are audit frameworks (prove you did it). MITRE is a threat model (know what enemies do)."
        />

        <ExplainLikeImFive concept="cis" />

        <MemoryHook title="🧠 Framework Distinction Mnemonic">
          <p className="mb-2"><strong>CIS</strong> tells you <em>what</em> to do. <strong>NIST</strong> tells you <em>when</em> to do it. <strong>ISO/SOC 2</strong> makes you <em>prove</em> you did it. <strong>MITRE</strong> tells you <em>what the bad guys do</em>.</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam trap: CIS is prescriptive (do this). ISO/SOC 2 are audit frameworks (prove you did it). MITRE is a threat model (know what enemies do).</p>
        </MemoryHook>

        <h3>MITRE ATT&CK for Containers</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          MITRE&apos;s container matrix maps adversary tactics (Initial Access, Execution, Persistence, etc.) to specific Kubernetes threats. Use it to threat-model your cluster and validate that your defenses cover each tactic.
        </p>

        <KeyTakeaway items={[
          'CIS Benchmark = prescriptive hardening guide (kube-bench tests it).',
          'NIST CSF = 5 functions: Identify, Protect, Detect, Respond, Recover.',
          'ISO 27001 / SOC 2 = audit/compliance frameworks requiring documentation.',
          'MITRE ATT&CK = threat model mapping adversary tactics to K8s techniques.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c2Questions} domainId="d1-c2" />
        </div>

        <SectionComplete sectionName="Security Frameworks" sectionNumber={2} totalSections={totalSections} />
      </Section>

      {/* ═══════ Isolation Techniques ═══════ */}
      <Section id="d1-c3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(232,122,93,0.1)', color: 'var(--accent-coral)' }}>
          <Flame size={12} />
          🔥 This section covers ~2% of the exam
        </div>

        <h2 className="flex items-center gap-3">
          <Users size={24} style={{ color: 'var(--accent-primary)' }} />
          Isolation Techniques
        </h2>

        <Callout variant="exam" title="⚠️ Common Mistake">
          Many candidates think namespaces are a security boundary. They are NOT — they are a logical grouping mechanism. Without NetworkPolicies and RBAC, pods in different namespaces can freely communicate and access each other&apos;s resources.
        </Callout>

        <h3>Namespace Isolation</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Namespaces provide logical separation of resources. They are <strong>not</strong> a security boundary by default — pods in different namespaces can still communicate. Combine namespaces with NetworkPolicies and RBAC to create effective isolation.
        </p>

        <CodeBlock
          language="yaml"
          code={`apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    environment: prod
    pod-security.kubernetes.io/enforce: restricted`}
        />

        <ExplainLikeImFive concept="namespaces" />

        <h3>Network Policies</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          NetworkPolicies are the Kubernetes-native firewall. By default, all pods can talk to all other pods. Apply a default-deny policy, then explicitly allow required traffic.
        </p>

        <CodeBlock
          language="yaml"
          code={`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress`}
        />

        <Callout variant="warning" title="⚠️ Common Mistake">
          A common trap: applying a ResourceQuota without a LimitRange. The ResourceQuota will reject any pod that does not specify explicit resource requests because there is no default value to fall back to.
        </Callout>

        <ExamTrap title="⚠️ Namespace Isolation Trap">
          <strong>Namespaces are NOT a security boundary by default.</strong> Pods in different namespaces can still communicate freely and access each other&apos;s resources unless you add NetworkPolicies and RBAC. Think of namespaces as labeled folders — they organize files but don&apos;t lock the drawers.
        </ExamTrap>

        <h3>Resource Quotas & Limits</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          ResourceQuotas prevent a single namespace from consuming all cluster resources. LimitRanges enforce default and maximum resource requests/limits per pod/container.
        </p>

        <MemorizeThis
          selfTest={{ question: 'What happens if you have a ResourceQuota but NO LimitRange?', answer: 'Pods without explicit resource requests are REJECTED' }}
        >
          <p><strong>ResourceQuota</strong> = caps total resources in a namespace.</p>
          <p><strong>LimitRange</strong> = sets defaults and max per pod.</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>They work together. Without a LimitRange, the ResourceQuota has no default to assign, so it rejects pods missing explicit requests.</p>
        </MemorizeThis>

        <h3>Runtime Isolation</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Beyond namespaces, use gVisor or Kata Containers for stronger isolation. These run containers in lightweight VMs or sandboxed environments, protecting against container escape vulnerabilities.
        </p>

        <KeyTakeaway items={[
          'Namespaces are NOT a security boundary by default — add NetworkPolicies and RBAC.',
          'Default-deny NetworkPolicy should be your first policy in every namespace.',
          'ResourceQuota + LimitRange work together; missing LimitRange causes pod rejection.',
          'gVisor/Kata provide VM-level isolation for high-risk workloads.',
        ]} />

        <MemoryHook title="🧠 ResourceQuota + LimitRange">
          <p><strong>ResourceQuota</strong> = caps total resources in a namespace.</p>
          <p><strong>LimitRange</strong> = sets defaults and max per pod.</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>Without a LimitRange, the ResourceQuota has no default to assign, so it rejects pods missing explicit requests. They work as a pair — like a budget (quota) and a spending limit per person (limit range).</p>
        </MemoryHook>

        <div className="mt-8">
          <QuizComponent questions={d1c3Questions} domainId="d1-c3" />
        </div>

        <SectionComplete sectionName="Isolation Techniques" sectionNumber={3} totalSections={totalSections} />
      </Section>

      {/* ═══════ Image Security ═══════ */}
      <Section id="d1-c4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(232,122,93,0.1)', color: 'var(--accent-coral)' }}>
          <Flame size={12} />
          🔥 This section covers ~2% of the exam
        </div>

        <h2 className="flex items-center gap-3">
          <Lock size={24} style={{ color: 'var(--accent-primary)' }} />
          Image Security
        </h2>

        <Callout variant="exam" title="Why This Matters for the Exam">
          Image security is a recurring topic across multiple domains. Questions may ask about scanning tools, signing methods, or base image choices. Know the difference between Trivy (scanning), cosign (signing), and distroless (minimal base images).
        </Callout>

        <ExplainLikeImFive concept="image" />

        <h3>Image Scanning</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Scan images for known CVEs before deployment. Tools: Trivy, Snyk, Clair, Grype. Integrate scanning into CI/CD so vulnerable images never reach the registry.
        </p>

        <CodeBlock
          language="bash"
          code={`# Scan with Trivy
trivy image myregistry/app:v1.2.3

# Scan filesystem (before building)
trivy filesystem ./`}
        />

        <h3>Image Signing</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Sign images to verify their authenticity. Sigstore/cosign is the modern standard. Combined with admission controllers (Kyverno, OPA Gatekeeper), you can enforce that only signed images may be deployed.
        </p>

        <CodeBlock
          language="bash"
          code={`# Sign an image with cosign
cosign sign --key cosign.key myregistry/app:v1.2.3

# Verify before deployment
cosign verify --key cosign.pub myregistry/app:v1.2.3`}
        />

        <MemorizeThis
          selfTest={{ question: 'What is the modern keyless image signing standard?', answer: 'Sigstore / cosign' }}
        >
          <p><strong>Scanning</strong> = find vulnerabilities (Trivy, Snyk, Clair).</p>
          <p><strong>Signing</strong> = prove authenticity (Sigstore/cosign).</p>
          <p><strong>Enforcement</strong> = only allow signed images (Kyverno, OPA Gatekeeper).</p>
        </MemorizeThis>

        <h3>Minimal Base Images</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Use distroless, scratch, or Alpine images to reduce attack surface. Remove package managers, shells, and unnecessary binaries from production images.
        </p>

        <h3>Private Registries</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Host your own registry (Harbor, ECR, GCR, ACR) with vulnerability scanning, RBAC, and retention policies. Never pull images from public registries without verification.
        </p>

        <Callout variant="warning" title="⚠️ Common Mistake">
          Using :latest tag in production. It is non-deterministic — you never know exactly what code is running. Always use immutable tags or digests.
        </Callout>

        <ExamTrap title="⚠️ :latest + IfNotPresent = Silent Stale Image">
          <strong>IfNotPresent with :latest is a dangerous combination.</strong> If the image is cached locally, Kubernetes will NOT pull a newer version. You get a silent stale image that may contain known vulnerabilities. Always use immutable tags or digests with <code>Always</code> or <code>IfNotPresent</code>.
        </ExamTrap>

        <KeyTakeaway items={[
          'Scan images with Trivy/Snyk/Clair before deployment.',
          'Sign images with Sigstore/cosign; enforce with admission controllers.',
          'Use distroless/scratch images to minimize attack surface.',
          'Never use :latest in production — use immutable tags or digests.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c4Questions} domainId="d1-c4" />
        </div>

        <SectionComplete sectionName="Image Security" sectionNumber={4} totalSections={totalSections} />
      </Section>

      {/* ═══════ Cloud Provider Security ═══════ */}
      <Section id="d1-c4b">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(232,122,93,0.1)', color: 'var(--accent-coral)' }}>
          <Flame size={12} />
          🔥 This section covers ~2% of the exam
        </div>

        <h2 className="flex items-center gap-3">
          <Cloud size={24} style={{ color: 'var(--accent-primary)' }} />
          Cloud Provider Security Specifics
        </h2>

        <Callout variant="exam" title="Why This Matters for the Exam">
          Expect at least one question on each major provider. Know the names: IMDSv2 (AWS), Workload Identity (GKE), Azure AD Workload Identity (AKS). The exam tests whether you know the specific mechanism, not just the general concept.
        </Callout>

        <h3>AWS IMDSv2</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Instance Metadata Service (IMDS) provides credentials and configuration to EC2 instances. <strong>IMDSv1</strong> was vulnerable to SSRF attacks that could steal IAM credentials from pods. <strong>IMDSv2</strong> requires a session token obtained via a PUT request, making SSRF exploitation nearly impossible.
        </p>

        <Callout variant="warning">
          Without IMDSv2, a compromised pod can steal the node&apos;s IAM role credentials via a simple HTTP request to 169.254.169.254. This is a critical exam topic — always enforce IMDSv2 on EKS worker nodes.
        </Callout>

        <MnemonicStory title="The Coffee Shop Wi-Fi Story" pattern={`169.254.169.254 = the "secret back door" IP that SSRF attackers love`}>
          Imagine a coffee shop with "free Wi-Fi" — anyone can connect. That is IMDSv1. Now imagine the shop requires you to ask the barista for a one-time token before you can use the Wi-Fi. That is IMDSv2. Without the token (session token from PUT request), you cannot access the network (instance metadata). The secret back door IP is <strong>169.254.169.254</strong> — memorize it like a phone number: 169-254-169-254.
        </MnemonicStory>

        <h3>GKE Metadata Concealment &amp; Workload Identity</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          GKE offers two mechanisms to prevent pod access to node metadata:
        </p>
        <ul className="space-y-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
          <li className="flex items-start gap-2 text-sm">
            <span style={{ color: 'var(--accent-primary)' }}>•</span>
            <strong>Metadata Concealment</strong>: A daemonset proxy that blocks pod access to sensitive metadata endpoints (legacy).
          </li>
          <li className="flex items-start gap-2 text-sm">
            <span style={{ color: 'var(--accent-primary)' }}>•</span>
            <strong>Workload Identity</strong>: Maps Kubernetes ServiceAccounts to Google IAM service accounts. Pods get short-lived OAuth tokens instead of node credentials.
          </li>
        </ul>

        <h3>AKS Managed Identity</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Azure Kubernetes Service uses <strong>Managed Identity</strong> for the control plane and node pool authentication. User-assigned managed identities replace service principals, eliminating long-lived credentials. AKS also supports <strong>Azure AD Workload Identity</strong> (federated credentials) for pod-level IAM.
        </p>

        <h3>Shared Responsibility Per Provider</h3>
        <ComparisonTable
          columns={[
            { key: 'provider', header: 'Provider' },
            { key: 'managed', header: 'Managed Control Plane' },
            { key: 'nodeIAM', header: 'Node IAM Protection' },
            { key: 'podIAM', header: 'Pod IAM Mechanism' },
          ]}
          rows={[
            { provider: 'AWS EKS', managed: 'Yes', nodeIAM: 'IMDSv2 required', podIAM: 'IRSA / Pod Identity' },
            { provider: 'GKE', managed: 'Yes', nodeIAM: 'Metadata concealment', podIAM: 'Workload Identity' },
            { provider: 'AKS', managed: 'Yes', nodeIAM: 'Managed Identity', podIAM: 'Azure AD Workload Identity' },
          ]}
        />

        <MemorizeThis
          selfTest={{ question: 'What IP address is the AWS instance metadata endpoint?', answer: '169.254.169.254' }}
        >
          <p><strong>AWS</strong>: IMDSv2 prevents SSRF to 169.254.169.254. Pod IAM = IRSA / EKS Pod Identity.</p>
          <p><strong>GKE</strong>: Workload Identity maps K8s SA → Google IAM. Metadata concealment blocks node metadata access.</p>
          <p><strong>AKS</strong>: Managed Identity for nodes. Azure AD Workload Identity for pods.</p>
        </MemorizeThis>

        <Callout variant="tip">
          Cloud is the FOUNDATION — if the cloud is broken, nothing above matters. Think of it as the ground floor of a building.
        </Callout>

        <KeyTakeaway items={[
          'IMDSv2 requires a PUT-request session token to prevent SSRF credential theft.',
          'AWS pod IAM: IRSA / EKS Pod Identity. GKE: Workload Identity. AKS: Azure AD Workload Identity.',
          'Metadata endpoint IP: 169.254.169.254 — memorize this.',
          'Cloud provider security is the foundation; if it fails, everything above fails.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c4bQuestions} domainId="d1-c4b" />
        </div>

        <SectionComplete sectionName="Cloud Provider Security" sectionNumber={5} totalSections={totalSections} />
      </Section>

      {/* ═══════ Artifact Registry Security ═══════ */}
      <Section id="d1-c4c">
        <h2 className="flex items-center gap-3">
          <Container size={24} style={{ color: 'var(--accent-primary)' }} />
          Artifact Registry Security
        </h2>

        <Callout variant="exam" title="⚠️ Common Mistake">
          Many candidates confuse imagePullSecrets placement. Putting imagePullSecrets on every individual pod is tedious and error-prone. The exam expects you to know that attaching them to the ServiceAccount is the scalable, recommended approach.
        </Callout>

        <h3>Registry Authentication Methods</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Kubernetes supports multiple ways to authenticate to private registries:
        </p>
        <div className="space-y-3 mb-6">
          {[
            { title: 'imagePullSecrets', desc: 'Per-pod Secret with .dockerconfigjson. Most explicit but requires manual pod configuration.' },
            { title: 'ServiceAccount imagePullSecrets', desc: 'Attach the Secret to a ServiceAccount — all pods using that SA automatically inherit it. Best practice for most workloads.' },
            { title: 'Node-wide credential providers', desc: 'Cloud-specific: ECR credential helper, GCR helper, ACR helper. Transparent to pods but less explicit.' },
          ].map((method) => (
            <div key={method.title} className="flex items-start gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{method.title}:</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>{method.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <h3>Image Pull Policies</h3>
        <ComparisonTable
          columns={[
            { key: 'policy', header: 'Policy' },
            { key: 'behavior', header: 'Behavior' },
            { key: 'safe', header: 'When Safe' },
            { key: 'danger', header: 'When Dangerous' },
          ]}
          rows={[
            { policy: 'Always', behavior: 'Pull every time pod starts', safe: 'Immutable tags, production', danger: 'Slower startup, registry dependency' },
            { policy: 'IfNotPresent', behavior: 'Pull only if not cached locally', safe: 'Immutable tags, digests', danger: 'With :latest tag — silent stale image' },
            { policy: 'Never', behavior: 'Never pull; must exist locally', safe: 'Air-gapped, pre-loaded images', danger: 'If image missing, pod fails' },
          ]}
        />

        <Callout variant="warning">
          IfNotPresent with :latest tag = silent stale image. Always use digests in production.
        </Callout>

        <ExamTrap title="⚠️ imagePullSecrets Placement Trap">
          <strong>Putting imagePullSecrets on every individual pod is tedious and error-prone.</strong> The exam expects you to know that attaching them to the <code>ServiceAccount</code> is the scalable, recommended approach — all pods using that SA automatically inherit the credentials.
        </ExamTrap>

        <MemorizeThis
          selfTest={{ question: 'Which pull policy silently uses a stale image with :latest?', answer: 'IfNotPresent' }}
        >
          <p><strong>Always</strong> = pull every start. Safest with immutable tags.</p>
          <p><strong>IfNotPresent</strong> = pull only if missing. Dangerous with :latest.</p>
          <p><strong>Never</strong> = never pull. Only for air-gapped/pre-loaded.</p>
        </MemorizeThis>

        <h3>Harbor &amp; OCI Standards</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Harbor is an open-source registry with built-in vulnerability scanning, RBAC, and image signing. It supports OCI (Open Container Initiative) standards for artifacts, meaning you can store Helm charts, SBOMs, and signatures alongside images.
        </p>

        <KeyTakeaway items={[
          'Best practice: attach imagePullSecrets to ServiceAccount, not individual pods.',
          'IfNotPresent + :latest = silent stale image. Use immutable tags or digests.',
          'Harbor = open-source registry with scanning, RBAC, and OCI artifact support.',
          'Cloud providers offer credential helpers for transparent node-wide auth.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c4cQuestions} domainId="d1-c4c" />
        </div>

        <SectionComplete sectionName="Artifact Registry Security" sectionNumber={6} totalSections={totalSections} />
      </Section>

      {/* ═══════ Configuration as a Security Layer ═══════ */}
      <Section id="d1-c4d">
        <h2 className="flex items-center gap-3">
          <FileCheck size={24} style={{ color: 'var(--accent-primary)' }} />
          Configuration as a Security Layer
        </h2>

        <p style={{ color: 'var(--text-secondary)' }}>
          Some curricula list <strong>Configuration</strong> as the 4th C instead of Code. This variation emphasizes that misconfiguration — not fancy exploits — is the number one cause of cloud breaches.
        </p>

        <Callout variant="exam">
          The Cloud Security Alliance (CSA) and multiple industry reports consistently rank misconfiguration as the leading cause of cloud data breaches. A single overly permissive S3 bucket or Security Group can expose an entire organization.
        </Callout>

        <p style={{ color: 'var(--text-secondary)' }}>
          Configuration security covers: IAM policies, network ACLs, storage buckets, encryption settings, logging configuration, and Kubernetes resource definitions. Every YAML file is a potential security control.
        </p>

        <Callout variant="tip">
          4Cs = Cloud Cluster Container Code. But some say Cloud Cluster Container Config. Either way, Cloud is the base.
        </Callout>

        <KeyTakeaway items={[
          'Misconfiguration is the #1 cause of cloud data breaches.',
          'Configuration security = IAM, ACLs, buckets, encryption, logging, K8s YAML.',
          'The 4th C can be Code or Config — both are innermost layers.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c4dQuestions} domainId="d1-c4d" />
        </div>

        <SectionComplete sectionName="Configuration as a Security Layer" sectionNumber={7} totalSections={totalSections} />
      </Section>

      {/* ═══════ DevSecOps ═══════ */}
      <Section id="d1-c5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'rgba(232,122,93,0.1)', color: 'var(--accent-coral)' }}>
          <Flame size={12} />
          🔥 This section covers ~1% of the exam
        </div>

        <h2 className="flex items-center gap-3">
          <Check size={24} style={{ color: 'var(--accent-primary)' }} />
          DevSecOps Practices
        </h2>

        <Callout variant="exam" title="Why This Matters for the Exam">
          DevSecOps questions usually focus on "shifting left" and CI/CD pipeline security. Know the difference between SAST (static, white-box), DAST (dynamic, black-box), and SCA (dependency scanning).
        </Callout>

        <p style={{ color: 'var(--text-secondary)' }}>
          DevSecOps integrates security into every stage of the software development lifecycle. Instead of a separate security review before release, security checks run continuously in CI/CD pipelines.
        </p>

        <h3>CI/CD Pipeline Security</h3>

        <div className="space-y-3 mb-6">
          {[
            { title: 'Automate security testing', desc: 'Every code commit triggers security scans in CI/CD.' },
            { title: 'Fail fast', desc: 'Block builds with critical vulnerabilities — do not let them reach production.' },
            { title: 'Immutable infrastructure', desc: 'Do not patch running containers. Rebuild and redeploy instead.' },
            { title: 'Continuous compliance', desc: 'Policy as Code with OPA/Kyverno for automated compliance checking.' },
            { title: 'Security observability', desc: 'Runtime threat detection with Falco, Tetragon, and comprehensive audit logging.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
              <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}:</span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <MemorizeThis
          selfTest={{ question: 'What does "shifting left" mean?', answer: 'Integrating security EARLIER in the development lifecycle (before deployment)' }}
        >
          <p><strong>Shift Left</strong> = security checks in CI/CD, not at release time.</p>
          <p><strong>Fail Fast</strong> = block builds with critical CVEs.</p>
          <p><strong>Immutable</strong> = rebuild, never patch running containers.</p>
          <p><strong>Policy as Code</strong> = OPA/Gatekeeper + Kyverno enforce rules automatically.</p>
        </MemorizeThis>

        <CalloutBox variant="tip">
          DevSecOps strengthens cloud-native security by integrating proactive security checks into CI/CD pipelines, automating container image scanning, and enforcing Kubernetes policies like network segmentation and pod security.
        </CalloutBox>

        <KeyTakeaway items={[
          '"Shifting left" means security earlier in the SDLC, not at release.',
          'Fail fast = block builds with critical vulnerabilities.',
          'Immutable infrastructure = rebuild and redeploy, never patch live containers.',
          'OPA/Gatekeeper and Kyverno enforce Policy as Code in Kubernetes.',
        ]} />

        <div className="mt-8">
          <QuizComponent questions={d1c5Questions} domainId="d1-c5" />
        </div>

        <SectionComplete sectionName="DevSecOps Practices" sectionNumber={8} totalSections={totalSections} />
      </Section>

      {/* ═══════ End-of-Domain Quiz ═══════ */}
      <Section id="d1-c6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface-elevated)' }}>
            <FileCheck size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h2 style={{ color: 'var(--text-primary)' }}>Final Domain Quiz</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Comprehensive test of all Domain 1 concepts</p>
          </div>
        </div>

        <Callout variant="tip" title="💡 Study Tip">
          You have already completed 8 section quizzes. Use this final quiz to identify any weak spots. If you score below 80%, review the corresponding section before moving to Domain 2.
        </Callout>

        <QuizComponent questions={domain1Questions} domainId="domain1" />
      </Section>

      {/* Footer */}
      <div className="flex items-center justify-between mt-16 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <ArrowRight size={14} className="rotate-180" />
          Back to Dashboard
        </Link>

        <Link to="/domain2" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)', color: 'var(--accent-primary)' }}>
          Next: Domain 2
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
