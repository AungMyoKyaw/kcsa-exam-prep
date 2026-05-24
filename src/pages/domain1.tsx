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
} from 'lucide-react';
import Callout from '@/components/Callout';
import CalloutBox from '@/components/CalloutBox';
import CodeBlock from '@/components/CodeBlock';
import ComparisonTable from '@/components/ComparisonTable';
import QuizComponent from '@/components/QuizComponent';
import { useProgress } from '@/hooks/useProgress';

/* ── Simple Section Wrapper ── */
function Section({ children, id, className = '' }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className={`mb-16 ${className}`}>
      {children}
    </section>
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

/* ── Quiz Questions ── */
const domain1Questions = [
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

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <span className="text-sm font-bold" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>Domain 1</span>
        <h1 className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Overview of Cloud Native Security</h1>
        <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
          The 4Cs of Cloud Native Security, security frameworks, isolation techniques, image security, and DevSecOps practices.
        </p>
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          14% of exam
        </div>
      </div>

      {/* ═══════ The 4Cs Model ═══════ */}
      <Section id="d1-c1">
        <h2 className="flex items-center gap-3">
          <Lock size={24} style={{ color: 'var(--accent-primary)' }} />
          The 4Cs of Cloud Native Security
        </h2>

        <p style={{ color: 'var(--text-secondary)' }}>
          Cloud native security is built in layers, often referred to as the <strong>4Cs</strong>: Cloud, Cluster, Container, and Code. Each layer builds on the security of the previous one. You cannot secure containers properly if the cluster is compromised, and you cannot secure the cluster if the cloud infrastructure is insecure.
        </p>

        <FourCsDiagram />

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
      </Section>

      {/* ═══════ Security Frameworks ═══════ */}
      <Section id="d1-c2">
        <h2 className="flex items-center gap-3">
          <FileCheck size={24} style={{ color: 'var(--accent-primary)' }} />
          Security Frameworks
        </h2>

        <h3>NIST Cybersecurity Framework</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The NIST CSF provides five core functions: Identify, Protect, Detect, Respond, and Recover. For Kubernetes, this translates to asset inventory, hardening configurations, audit logging, incident response playbooks, and backup/restore procedures.
        </p>

        <h3>CIS Kubernetes Benchmark</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Center for Internet Security (CIS) publishes the definitive Kubernetes hardening guide. It contains specific, testable recommendations for every component. Tools like <strong>kube-bench</strong> automatically assess your cluster against the benchmark.
        </p>

        <CodeBlock
          language="bash"
          code={`# Run kube-bench as a job in your cluster
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

# Check results
kubectl logs job/kube-bench`}
        />

        <h3>ISO 27001 / SOC 2</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          These are audit and compliance frameworks rather than technical standards. They require documented policies, access controls, incident management, and continuous monitoring. Kubernetes environments must be able to demonstrate compliance through audit logs and policy enforcement.
        </p>

        <h3>MITRE ATT&CK for Containers</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          MITRE&apos;s container matrix maps adversary tactics (Initial Access, Execution, Persistence, etc.) to specific Kubernetes threats. Use it to threat-model your cluster and validate that your defenses cover each tactic.
        </p>
      </Section>

      {/* ═══════ Isolation Techniques ═══════ */}
      <Section id="d1-c3">
        <h2 className="flex items-center gap-3">
          <Users size={24} style={{ color: 'var(--accent-primary)' }} />
          Isolation Techniques
        </h2>

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

        <h3>Resource Quotas & Limits</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          ResourceQuotas prevent a single namespace from consuming all cluster resources. LimitRanges enforce default and maximum resource requests/limits per pod/container.
        </p>

        <Callout variant="exam">
          A namespace with a ResourceQuota but no LimitRange will reject pods that don&apos;t specify explicit resource requests — the pod won&apos;t get a default.
        </Callout>

        <h3>Runtime Isolation</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Beyond namespaces, use gVisor or Kata Containers for stronger isolation. These run containers in lightweight VMs or sandboxed environments, protecting against container escape vulnerabilities.
        </p>
      </Section>

      {/* ═══════ Image Security ═══════ */}
      <Section id="d1-c4">
        <h2 className="flex items-center gap-3">
          <Lock size={24} style={{ color: 'var(--accent-primary)' }} />
          Image Security
        </h2>

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

        <h3>Minimal Base Images</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Use distroless, scratch, or Alpine images to reduce attack surface. Remove package managers, shells, and unnecessary binaries from production images.
        </p>

        <h3>Private Registries</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Host your own registry (Harbor, ECR, GCR, ACR) with vulnerability scanning, RBAC, and retention policies. Never pull images from public registries without verification.
        </p>
      </Section>

      {/* ═══════ Cloud Provider Security ═══════ */}
      <Section id="d1-c4b">
        <h2 className="flex items-center gap-3">
          <Cloud size={24} style={{ color: 'var(--accent-primary)' }} />
          Cloud Provider Security Specifics
        </h2>

        <p style={{ color: 'var(--text-secondary)' }}>
          Each cloud provider implements the shared responsibility model differently. Understanding provider-specific security controls is critical for the exam.
        </p>

        <h3>AWS IMDSv2</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The Instance Metadata Service (IMDS) provides credentials and configuration to EC2 instances. <strong>IMDSv1</strong> was vulnerable to SSRF attacks that could steal IAM credentials from pods. <strong>IMDSv2</strong> requires a session token obtained via a PUT request, making SSRF exploitation nearly impossible.
        </p>

        <Callout variant="warning">
          Without IMDSv2, a compromised pod can steal the node&apos;s IAM role credentials via a simple HTTP request to 169.254.169.254. This is a critical exam topic — always enforce IMDSv2 on EKS worker nodes.
        </Callout>

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

        <Callout variant="tip">
          Cloud is the FOUNDATION — if the cloud is broken, nothing above matters. Think of it as the ground floor of a building.
        </Callout>
      </Section>

      {/* ═══════ Artifact Registry Security ═══════ */}
      <Section id="d1-c4c">
        <h2 className="flex items-center gap-3">
          <Container size={24} style={{ color: 'var(--accent-primary)' }} />
          Artifact Registry Security
        </h2>

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

        <h3>Harbor &amp; OCI Standards</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Harbor is an open-source registry with built-in vulnerability scanning, RBAC, and image signing. It supports OCI (Open Container Initiative) standards for artifacts, meaning you can store Helm charts, SBOMs, and signatures alongside images.
        </p>
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
      </Section>

      {/* ═══════ DevSecOps ═══════ */}
      <Section id="d1-c5">
        <h2 className="flex items-center gap-3">
          <Check size={24} style={{ color: 'var(--accent-primary)' }} />
          DevSecOps Practices
        </h2>

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

        <CalloutBox variant="tip">
          DevSecOps strengthens cloud-native security by integrating proactive security checks into CI/CD pipelines, automating container image scanning, and enforcing Kubernetes policies like network segmentation and pod security.
        </CalloutBox>
      </Section>

      {/* ═══════ Quiz ═══════ */}
      <Section id="d1-c6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--surface-elevated)' }}>
            <FileCheck size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h2 style={{ color: 'var(--text-primary)' }}>Chapter Quiz</h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Test your knowledge of Domain 1 concepts</p>
          </div>
        </div>

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
