import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Globe,
  Lock,
  ChevronRight,
  ArrowRight,
  Shield,
  Network,
  Container,
  Eye,
  Check,
} from 'lucide-react';
import CalloutBox from '@/components/CalloutBox';
import ComparisonTable from '@/components/ComparisonTable'
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import QuizComponent from '@/components/QuizComponent';
import { useProgress } from '@/hooks/useProgress';
import MemoryHook from '@/components/MemoryHook'
import ExamTrap from '@/components/ExamTrap'
import RBACFlowDiagram from '@/components/diagrams/RBACFlowDiagram'
import AdmissionPipelineDiagram from '@/components/diagrams/AdmissionPipelineDiagram'
import EncryptionChainDiagram from '@/components/diagrams/EncryptionChainDiagram'
import TokenLifecycleDiagram from '@/components/diagrams/TokenLifecycleDiagram'
import PortMemorySystem from '@/components/PortMemorySystem'
import ExplainLikeImFive from '@/components/ExplainLikeImFive';
import ELI5 from '@/components/ELI5'


/* ────────────────────── Simple Section Wrapper ────────────────────── */
function Section({ children, id, className = '', color = 'var(--accent-sage)' }: { children: React.ReactNode; id?: string; className?: string; color?: string }) {
  return (
    <section id={id} className={`mb-16 pl-2 md:pl-4 ${className}`} style={{ borderLeft: `3px solid ${color}20` }}>
      {children}
    </section>
  );
}

/* ────────────────────── Sticky Ports Bar ────────────────────── */
const portsData = [
  { port: '6443', label: 'API Server', color: 'var(--accent-lavender)' },
  { port: '2379', label: 'etcd client', color: 'var(--accent-primary)' },
  { port: '2380', label: 'etcd peer', color: 'var(--accent-primary)' },
  { port: '10250', label: 'Kubelet', color: 'var(--accent-amber)' },
  { port: '10248', label: 'Kubelet healthz', color: 'var(--accent-amber)' },
  { port: '10257', label: 'Controller Mgr', color: 'var(--accent-coral)' },
  { port: '10259', label: 'Scheduler', color: 'var(--accent-coral)' },
  { port: '10249', label: 'Kube-proxy', color: 'var(--info)' },
];

function StickyPortsBar() {
  const [isSticky, setIsSticky] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const sentinel = document.getElementById('ports-sentinel');
    if (sentinel) {observer.observe(sentinel);}
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div id="ports-sentinel" />
      <div
        ref={barRef}
        className="mb-8 overflow-x-auto"
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? '60px' : 'auto',
          left: isSticky ? '0' : 'auto',
          right: isSticky ? '0' : 'auto',
          zIndex: 20,
          backgroundColor: isSticky ? 'var(--surface-elevated)' : 'transparent',
          backdropFilter: isSticky ? 'blur(12px)' : 'none',
          borderBottom: isSticky ? '1px solid var(--border-subtle)' : 'none',
          padding: isSticky ? '8px 16px' : '0',
        }}
      >
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-semibold mr-2" style={{ color: 'var(--text-tertiary)' }}>
            Ports:
          </span>
          {portsData.map((p, _i) => (
            <div
              key={p.port}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-default transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 'var(--surface-code)',
                border: `1px solid var(--border-subtle)`,
                color: 'var(--text-primary)',
              }}
              title={`${p.label} - Port ${p.port}`}
            >
              <span className="font-bold font-mono" style={{ color: p.color }}>
                {p.port}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ────────────────────── Architecture Diagram ────────────────────── */
function ArchitectureDiagram() {
  const controlPlane = [
    { name: 'etcd', ports: '2379 / 2380', detail: 'All cluster state', color: 'var(--accent-primary)', x: 10, y: 10 },
    { name: 'kube-apiserver', ports: '6443', detail: 'Central management', color: 'var(--accent-lavender)', x: 40, y: 10, highlight: true },
    { name: 'kube-controller-manager', ports: '10257', detail: 'Control loops', color: 'var(--accent-coral)', x: 70, y: 10 },
    { name: 'kube-scheduler', ports: '10259', detail: 'Pod placement', color: 'var(--accent-coral)', x: 40, y: 40 },
  ];

  const workerNodes = [
    {
      name: 'Worker Node 1',
      x: 10, y: 60,
      components: [
        { name: 'Kubelet', port: '10250' },
        { name: 'Kube-proxy', port: '10249' },
        { name: 'Container Runtime', port: 'CRI' },
      ],
    },
    {
      name: 'Worker Node 2',
      x: 55, y: 60,
      components: [
        { name: 'Kubelet', port: '10250' },
        { name: 'Kube-proxy', port: '10249' },
        { name: 'Container Runtime', port: 'CRI' },
      ],
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto my-10">
      <div
        className="relative rounded-xl p-6 overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-base)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Control Plane Zone */}
        <div
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: 'rgba(155,135,245,0.06)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Server size={14} style={{ color: 'var(--accent-lavender)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-lavender)' }}>
              Control Plane
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {controlPlane.map((comp, _i) => (
              <div
                key={comp.name}
                className="rounded-lg p-3 text-center transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: comp.highlight === true ? `${comp.color}20` : 'var(--surface-elevated)',
                  border: `1.5px solid ${comp.highlight === true ? comp.color : 'var(--border-subtle)'}`,
                }}
              >
                <div className="text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {comp.name}
                </div>
                <div
                  className="text-xs font-mono font-semibold"
                  style={{ color: comp.color }}
                >
                  :{comp.ports}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {comp.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection arrows */}
        <div className="flex justify-center my-2">
          <div
            className="text-xs flex items-center gap-1 px-3 py-1 rounded-full"
            style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-tertiary)' }}
          >
            <Network size={12} />
            HTTPS / mTLS
          </div>
        </div>

        {/* Worker Nodes Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workerNodes.map((node, _ni) => (
            <div
              key={node.name}
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'rgba(4,80,54,0.04)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <HardDrive size={14} style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                  {node.name}
                </span>
              </div>
              <div className="space-y-2">
                {node.components.map((comp) => (
                  <div
                    key={comp.name}
                    className="flex items-center justify-between px-3 py-2 rounded-md"
                    style={{ backgroundColor: 'var(--surface-elevated)' }}
                  >
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {comp.name}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      {comp.port}
                    </span>
                  </div>
                ))}
                {/* Pod placeholder */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-md mt-2" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                  <Container size={12} style={{ color: 'var(--accent-amber)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Pods</span>
                  <div className="flex gap-1 ml-auto">
                    {[1, 2].map((p) => (
                      <div
                        key={p}
                        className="w-6 h-4 rounded-sm"
                        style={{ backgroundColor: 'rgba(242,196,77,0.3)', border: '1px solid var(--accent-amber)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* External Client */}
        <div
          className="flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-lg mx-auto w-fit"
          style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <Eye size={12} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            kubectl → API Server:6443 (HTTPS)
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── Ports Reference Table ────────────────────── */
function PortsTable() {
  const ports = [
    { port: '6443', component: 'kube-apiserver', purpose: 'Kubernetes API (HTTPS)', auth: 'X.509, OIDC, SA tokens', critical: true },
    { port: '2379', component: 'etcd', purpose: 'Client API (gRPC/HTTPS)', auth: 'Client certificate', critical: true },
    { port: '2380', component: 'etcd', purpose: 'Peer communication (Raft)', auth: 'Peer certificate', critical: true },
    { port: '10250', component: 'Kubelet', purpose: 'Kubelet API (HTTPS)', auth: 'Client certificate', critical: true },
    { port: '10248', component: 'Kubelet', purpose: 'Healthz endpoint', auth: 'None (localhost)', critical: false },
    { port: '10257', component: 'kube-controller-manager', purpose: 'Metrics/health (HTTPS)', auth: 'Client certificate', critical: true },
    { port: '10259', component: 'kube-scheduler', purpose: 'Metrics/health (HTTPS)', auth: 'Client certificate', critical: true },
    { port: '10249', component: 'kube-proxy', purpose: 'Metrics endpoint', auth: 'None', critical: false },
    { port: '10256', component: 'kube-proxy', purpose: 'Health check', auth: 'None', critical: false },
  ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {['Port', 'Component', 'Purpose', 'Auth Required', ''].map((h) => (
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
          {ports.map((p, i) => (
            <tr
              key={p.port}
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
              }}
            >
              <td className="px-4 py-3 font-mono font-bold" style={{ color: p.critical ? 'var(--accent-coral)' : 'var(--accent-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.port}
              </td>
              <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.component}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.purpose}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.auth}
              </td>
              <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {p.critical && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(232,122,93,0.15)', color: 'var(--accent-coral)' }}
                  >
                    Critical
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────── CNI Comparison Table ────────────────────── */
function CniTable() {
  const plugins = [
    { name: 'Calico', routing: 'L3 routing (BGP)', policies: 'Yes', notes: 'Most popular in production; tiered policies' },
    { name: 'Cilium', routing: 'eBPF-based', policies: 'Yes (L7)', notes: 'Advanced observability, high performance' },
    { name: 'Flannel', routing: 'VXLAN overlay', policies: 'No', notes: 'Simple; needs Canal/Calico for policies' },
    { name: 'Weave Net', routing: 'Mesh overlay', policies: 'Yes', notes: 'Encrypted communication, easy setup' },
    { name: 'AWS VPC CNI', routing: 'Native VPC', policies: 'Yes', notes: 'Uses ENIs; integrates with Security Groups' },
  ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {['Plugin', 'Routing', 'NetworkPolicy', 'Notes'].map((h) => (
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
          {plugins.map((p, i) => (
            <tr
              key={p.name}
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
              }}
            >
              <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.name}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.routing}
              </td>
              <td className="px-4 py-3" style={{ color: p.policies === 'Yes' || p.policies === 'Yes (L7)' ? 'var(--accent-sage)' : 'var(--accent-coral)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.policies}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────── Encryption Providers Table ────────────────────── */
function EncryptionTable() {
  const providers = [
    { name: 'kms v2', strength: 'Strongest', speed: 'Fast', notes: 'Recommended. Stable since K8s 1.29', recommended: true },
    { name: 'secretbox', strength: 'Strong', speed: 'Faster', notes: 'XSalsa20 and Poly1305', recommended: false },
    { name: 'aesgcm', strength: 'Strong', speed: 'Fastest', notes: 'Must rotate every 200K writes', recommended: false },
    { name: 'aescbc', strength: 'Weak', speed: 'Fast', notes: 'Padding oracle attacks. NOT recommended', recommended: false },
    { name: 'identity', strength: 'None', speed: 'N/A', notes: 'Default — no encryption!', recommended: false },
  ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {['Provider', 'Strength', 'Speed', 'Notes', ''].map((h) => (
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
          {providers.map((p, _i) => {
            const strengthColor = (() => {
              if (p.strength === 'Strongest') { return 'var(--accent-sage)' }
              if (p.strength === 'Weak') { return 'var(--accent-coral)' }
              if (p.strength === 'None') { return 'var(--danger)' }
              return 'var(--text-secondary)'
            })()
            return (
            <tr
              key={p.name}
              style={{
                backgroundColor: _i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
              }}
            >
              <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.name}
              </td>
              <td className="px-4 py-3" style={{
                color: strengthColor,
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                {p.strength}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.speed}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                {p.notes}
              </td>
              <td className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {p.recommended && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(163,196,168,0.15)', color: 'var(--accent-sage)' }}>
                    Recommended
                  </span>
                )}
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────── Quiz Data ────────────────────── */
const domain2Questions = [
  {
    id: 1,
    question: 'What is the default secure port for the Kubernetes API Server?',
    options: ['8080', '6443', '443', '10250'],
    correctIndex: 1,
    explanation: 'The Kubernetes API Server (kube-apiserver) listens on port 6443 by default for HTTPS traffic with authentication and authorization enabled. Port 8080 was the deprecated insecure port. Port 443 is commonly used for ingress/LoadBalancer services. Port 10250 is the Kubelet port.',
  },
  {
    id: 2,
    question: 'Which etcd port is used for peer (inter-etcd) communication?',
    options: ['2379', '2380', '6443', '10259'],
    correctIndex: 1,
    explanation: 'etcd uses port 2379 for client (API server) communication and port 2380 for peer (inter-etcd / Raft) communication. Both MUST be secured with TLS certificates. Port 6443 is the API Server, and 10259 is the Scheduler.',
  },
  {
    id: 3,
    question: 'What should --read-only-port be set to on the Kubelet in production?',
    options: ['10255', '0', '10248', '6443'],
    correctIndex: 1,
    explanation: 'The Kubelet read-only port (10255) provides unauthenticated, read-only access to Kubelet metrics and system data. It should be disabled by setting --read-only-port=0. This is a CIS Benchmark requirement (CIS 4.2.4). Port 10248 is the healthz endpoint, and 6443 is the API Server.',
  },
  {
    id: 4,
    question: 'What admission plugin restricts a Kubelet to only modify pods bound to its own node?',
    options: ['PodSecurity', 'NodeRestriction', 'NamespaceLifecycle', 'LimitRanger'],
    correctIndex: 1,
    explanation: 'The NodeRestriction admission plugin limits which Node and Pod objects a kubelet can modify. Kubelets using credentials in the system:nodes group can only modify their own Node object and Pods bound to their node. It prevents kubelets from reading/writing other nodes\' pods or secrets.',
  },
  {
    id: 5,
    question: 'Which component is the ONLY one that directly accesses etcd?',
    options: ['kubelet', 'kube-scheduler', 'kube-apiserver', 'kube-controller-manager'],
    correctIndex: 2,
    explanation: 'The API Server is the ONLY component that communicates directly with etcd. All other components (Kubelet, Controller Manager, Scheduler) must go through the API Server. This is a critical design principle — etcd should be firewalled to only accept connections from API Server nodes.',
  },
  {
    id: 6,
    question: 'What is the recommended encryption at rest provider for Kubernetes secrets?',
    options: ['aescbc', 'identity', 'kms v2', 'aesgcm'],
    correctIndex: 2,
    explanation: 'KMS v2 is the recommended encryption provider for production. It uses envelope encryption with a DEK per API server and is stable since Kubernetes 1.29. aescbc is weak (vulnerable to padding oracle attacks). identity means NO encryption. aesgcm requires key rotation every 200K writes.',
  },
  {
    id: 7,
    question: 'What Kubelet authorization mode delegates authorization decisions to the API Server?',
    options: ['AlwaysAllow', 'Webhook', 'ABAC', 'RBAC'],
    correctIndex: 1,
    explanation: 'Webhook mode consults the API Server for authorization decisions via SubjectAccessReview. AlwaysAllow is insecure and should never be used in production. RBAC is an API Server authorization mode, not a Kubelet mode. ABAC is deprecated.',
  },
  {
    id: 8,
    question: 'What port does the kube-scheduler use for its secure HTTPS endpoint?',
    options: ['10257', '10259', '10251', '6443'],
    correctIndex: 1,
    explanation: 'The kube-scheduler listens on port 10259 (HTTPS with authentication and authorization). Port 10257 is the kube-controller-manager. Port 10251 was the deprecated insecure port. Port 6443 is the API Server.',
  },
  {
    id: 9,
    question: 'Which CNI plugin uses eBPF for high-performance networking and L7 policy support?',
    options: ['Calico', 'Flannel', 'Cilium', 'Weave Net'],
    correctIndex: 2,
    explanation: 'Cilium uses eBPF (extended Berkeley Packet Filter) at the kernel level for high-performance networking and supports Layer 7 policies (HTTP/gRPC). Calico uses L3 routing (BGP) or eBPF optionally. Flannel is a simple overlay with no NetworkPolicy support.',
  },
  {
    id: 10,
    question: 'What are the three main Linux security mechanisms for containers?',
    options: [
      'RBAC, NetworkPolicy, Pod Security',
      'seccomp, AppArmor, SELinux',
      'TLS, mTLS, VPN',
      'OAuth, OIDC, LDAP',
    ],
    correctIndex: 1,
    explanation: 'The three main Linux kernel security mechanisms for containers are: seccomp (filters syscalls), AppArmor (path-based MAC for resources), and SELinux (label-based MAC for access control). These are distinct from Kubernetes-level controls like RBAC and NetworkPolicy.',
  },
  {
    id: 11,
    question: 'Since Kubernetes 1.24, how should pods obtain API tokens?',
    options: [
      'Auto-mounted Secret with long-lived token',
      'TokenRequest API with projected volumes',
      'Direct etcd access',
      'Environment variables with base64 tokens',
    ],
    correctIndex: 1,
    explanation: 'Since Kubernetes 1.24, the recommended approach is the TokenRequest API, which provides short-lived, bound, audience-scoped tokens via serviceAccountToken projected volumes. Legacy auto-mounted token Secrets are no longer recommended. Never use environment variables for tokens.',
  },
  {
    id: 12,
    question: 'What is the primary difference between iptables and IPVS proxy modes in kube-proxy?',
    options: [
      'iptables is faster for all cluster sizes',
      'IPVS uses kernel-level load balancing and scales better for large clusters',
      'IPVS requires a separate load balancer appliance',
      'iptables supports Layer 7 routing',
    ],
    correctIndex: 1,
    explanation: 'IPVS (IP Virtual Server) uses kernel-level load balancing with hash tables, making it faster and more efficient for large clusters (1000+ services). iptables (default) creates iptables rules for each Service endpoint and scales to ~5,000 services with O(n) rule traversal. nftables is now the modern recommended mode.',
  },
  {
    id: 13,
    question: 'What flag should be set on the Controller Manager to use individual ServiceAccounts per controller?',
    options: [
      '--use-service-account-credentials=true',
      '--anonymous-auth=false',
      '--authorization-mode=RBAC',
      '--profiling=false',
    ],
    correctIndex: 0,
    explanation: '--use-service-account-credentials=true creates separate service accounts for each controller instead of using the default admin account. This follows the principle of least privilege — if one controller is compromised, the blast radius is limited.',
  },
  {
    id: 14,
    question: 'By default, are Kubernetes Secrets encrypted in etcd?',
    options: [
      'Yes, encrypted with AES-256 by default',
      'No, they are only Base64 encoded',
      'Yes, when using a managed Kubernetes service',
      'Only when stored in a separate Secret namespace',
    ],
    correctIndex: 1,
    explanation: 'Kubernetes Secrets are stored in etcd as Base64-encoded text by default — NOT encrypted. Anyone with direct access to etcd can read all secrets. You MUST explicitly enable encryption at rest via the --encryption-provider-config flag on the API Server.',
  },
  {
    id: 15,
    question: 'What is the FIRST step when restoring etcd from a snapshot in a disaster recovery scenario?',
    options: [
      'Run etcdctl snapshot restore immediately',
      'Stop the API Server to prevent split-brain writes',
      'Rotate all ServiceAccount tokens',
      'Backup the current (potentially corrupted) etcd data',
    ],
    correctIndex: 1,
    explanation: 'The FIRST step in any etcd restore is stopping the API Server (move the manifest out of /etc/kubernetes/manifests). This prevents the API Server from writing to etcd while you are reconstructing it. Rotating tokens happens AFTER restore.',
  },
  {
    id: 16,
    question: 'Which command is used to verify that a restored etcd cluster is healthy?',
    options: [
      'etcdctl snapshot status',
      'etcdctl endpoint health',
      'kubectl get etcd',
      'systemctl status etcd',
    ],
    correctIndex: 1,
    explanation: 'etcdctl endpoint health verifies that the etcd endpoint can successfully commit a proposal. snapshot status only reads snapshot file metadata. There is no etcd resource in kubectl.',
  },
  {
    id: 17,
    question: 'What is the purpose of a bootstrap token in TLS bootstrapping?',
    options: [
      'It is a long-lived credential for the kubelet',
      'It provides temporary authentication for a new node to submit a CSR',
      'It replaces the need for a Certificate Authority',
      'It encrypts etcd peer communication',
    ],
    correctIndex: 1,
    explanation: 'A bootstrap token is a short-lived Secret in the kube-system namespace. It provides temporary credentials so a new kubelet can authenticate to the API Server and submit a CertificateSigningRequest (CSR). After the CSR is approved, the kubelet uses its permanent certificate.',
  },
  {
    id: 18,
    question: 'Which Kubernetes resource does a kubelet create during TLS bootstrapping to request a permanent certificate?',
    options: [
      'Certificate',
      'CertificateSigningRequest',
      'Secret',
      'ServiceAccount',
    ],
    correctIndex: 1,
    explanation: 'During TLS bootstrapping, the kubelet generates a private key and creates a CertificateSigningRequest (CSR) resource. An administrator or auto-approver then approves the CSR, and the kubelet downloads the signed certificate from the CSR status.',
  },
];

/* ══════════════════════════ DOMAIN 2 PAGE ══════════════════════════ */
export default function Domain2Page() {
  const { markRead, updateScroll } = useProgress('domain2');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.round((scrollTop / docHeight) * 100);
        updateScroll('domain2-main', pct);
        if (pct >= 90) {markRead('domain2-main');}
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [markRead, updateScroll]);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      {/* ── Breadcrumb ── */}
      <nav
        className="flex items-center gap-2 text-xs mb-6"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <Link to="/" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>
          Home
        </Link>
        <ChevronRight size={14} />
        <span>Domain 2: Kubernetes Cluster Component Security</span>
      </nav>

      {/* ── Chapter Header ── */}
      <div
        className="mb-10 p-6 rounded-xl border-l-4"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderLeftColor: '#1a7f37',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Server size={20} style={{ color: '#1a7f37' }} />
          <span className="text-sm font-bold" style={{ color: '#1a7f37', fontFamily: 'var(--font-mono)' }}>
            Domain 2
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#dafbe1', color: '#1a7f37' }}>
            22% exam weight — HIGHEST
          </span>
        </div>
        <h1
          className="text-3xl lg:text-4xl font-normal mb-4"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
        >
          Kubernetes Cluster Component Security
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            ~65 min read
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            9 sections
          </span>
        </div>

        <CalloutBox variant="exam">
          <strong>22% of the exam</strong> (approximately 17 questions). This is the highest-weighted
          domain. You MUST memorize ALL port numbers and their associated components. Understand how
          each component authenticates and authorizes. Pay special attention to API Server flags,
          etcd encryption, and Kubelet hardening.
        </CalloutBox>

        <ELI5 title="🧒 ELI5: Kubernetes Cluster Architecture">
          <p className="mb-2">
            Imagine a <strong>five-star hotel</strong>:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>API Server (6443)</strong> = The front desk. Every guest, staff, and delivery person MUST check in here first. Nothing happens without going through the front desk.</li>
            <li><strong>etcd (2379/2380)</strong> = The hotel's master ledger. Every room booking, key assignment, and staff schedule is recorded here. If someone steals the ledger, they own the hotel.</li>
            <li><strong>Kubelet (10250)</strong> = The floor manager on each level. They make sure rooms are clean, guests are served, and report back to the front desk.</li>
            <li><strong>Controller Manager (10257)</strong> = The automated systems that adjust thermostats, turn on lights, and handle routine tasks without human intervention.</li>
            <li><strong>Scheduler (10259)</strong> = The room assignment system that decides which floor and room each guest gets based on their needs.</li>
          </ul>
          <p>
            <strong>In other words:</strong> The API Server is the gatekeeper. etcd is the memory. Kubelet is the worker. Controller Manager and Scheduler are the brains behind the scenes.
          </p>
        </ELI5>
      </div>

      {/* ── Sticky Ports Bar ── */}
      <StickyPortsBar />

      {/* ── Architecture Diagram ── */}
      <Section id="d2-architecture">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155,135,245,0.15)' }}
          >
            <Network size={22} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Cluster Architecture Overview
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Understanding the complete Kubernetes architecture is essential. Every component has specific
          ports, security configurations, and hardening requirements. Hover over the diagram components
          to see their details.
        </p>

        <ArchitectureDiagram />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          Complete Port Reference
        </h3>

        <PortsTable />

        <CalloutBox variant="exam">
          <strong>🎯 Exam Focus:</strong> Memorize these ports cold: <strong style={{ color: 'var(--accent-coral)' }}>6443</strong> (API
          Server), <strong style={{ color: 'var(--accent-coral)' }}>2379/2380</strong> (etcd
          client/peer), <strong style={{ color: 'var(--accent-coral)' }}>10250</strong> (Kubelet),{' '}
          <strong style={{ color: 'var(--accent-coral)' }}>10257</strong> (Controller Manager),{' '}
          <strong style={{ color: 'var(--accent-coral)' }}>10259</strong> (Scheduler),{' '}
          <strong style={{ color: 'var(--accent-coral)' }}>10249</strong> (Kube-proxy metrics). These
          are heavily tested on the exam.
        </CalloutBox>

        <ExamTrap title="⚠️ etcd Access Trap">
          <strong>The API Server is the ONLY component that talks directly to etcd.</strong> All other components (Kubelet, Controller Manager, Scheduler) must go through the API Server. etcd should be firewalled to only accept connections from API Server nodes. If anything else connects directly to etcd, your cluster is compromised.
        </ExamTrap>

        <PortMemorySystem />

        <MemoryHook title="🧠 Port Number Mnemonics">
          <p className="mb-2"><strong>Memorize these port patterns:</strong></p>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li><strong>6443</strong> = "Admin" — kubectl and all admin traffic goes here</li>
            <li><strong>2379 / 2380</strong> = "etcd twins" — 2379=client, 2380=peer (Raft)</li>
            <li><strong>10250</strong> = "kubeLET (5=LET)" — Kubelet main API</li>
            <li><strong>10257</strong> = "Controller (7=control)" — Controller Manager</li>
            <li><strong>10259</strong> = "Scheduler (9=schedule)" — Scheduler</li>
            <li><strong>10249</strong> = "Kube-proxy metrics" — less critical</li>
          </ul>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam tip: If a question asks which port a component uses, look for these patterns. 6443 and the 102xx ports are the most heavily tested.</p>
        </MemoryHook>
      </Section>

      {/* ══════════ Section 2.1: API Server ══════════ */}
      <Section id="d2-apiserver">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155,135,245,0.15)' }}
          >
            <Server size={22} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.1 API Server
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The kube-apiserver is the <strong>central management point</strong> for the entire cluster.
          All components, users, and external tools communicate through it. It is the only component
          that communicates directly with etcd.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Critical API Server Flags
        </h3>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Flag', 'Secure Value', 'Purpose'].map((h) => (
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
                { flag: '--anonymous-auth', value: 'false', purpose: 'Disable anonymous access' },
                { flag: '--authorization-mode', value: 'Node,RBAC', purpose: 'Enable Node + RBAC authorization' },
                { flag: '--enable-admission-plugins', value: 'NodeRestriction,...', purpose: 'Enable security-critical admission plugins' },
                { flag: '--audit-log-path', value: '/var/log/audit.log', purpose: 'Enable audit logging' },
                { flag: '--tls-cert-file', value: 'Path to cert', purpose: 'Strong TLS certificate' },
                { flag: '--tls-private-key-file', value: 'Path to key', purpose: 'Private key for TLS' },
                { flag: '--client-ca-file', value: 'Path to CA', purpose: 'CA for client cert validation' },
                { flag: '--service-account-lookup', value: 'true', purpose: 'Validate SA tokens exist' },
              ].map((row, i) => (
                <tr
                  key={row.flag}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
                  }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.flag}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--accent-sage)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.value}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Authentication Modes
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The API Server supports multiple authentication strategies simultaneously: X.509 client
          certificates, bearer tokens (static, bootstrap, ServiceAccount), OIDC tokens, authenticating
          proxies, and webhook token authentication. The first successful authenticator wins.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Admission Controllers
        </h3>

        <ELI5 title="🧒 ELI5: Admission Controllers">
          <p className="mb-2">
            Imagine a <strong>nightclub with a bouncer</strong>:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>Authentication (AuthN)</strong> = The bouncer checks your ID. "Are you who you say you are?" ✅</li>
            <li><strong>Authorization (AuthZ / RBAC)</strong> = The bouncer checks if you're on the guest list. "Can you enter the VIP section?" ✅</li>
            <li><strong>Mutating Admission</strong> = The coat check that adds a stamp to your hand or gives you a wristband. It <em>modifies</em> your request before you enter. 📝</li>
            <li><strong>Validating Admission</strong> = The security guard who checks your bag. "No weapons allowed!" If you have something forbidden, you're <em>rejected</em>. ❌</li>
          </ul>
          <p>
            <strong>In other words:</strong> Admission controllers are the final quality and security checks before something gets into the cluster. Mutating ones can <em>fix</em> your request. Validating ones can <em>reject</em> it.
          </p>
        </ELI5>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Admission controllers intercept requests to the API Server after authentication and
          authorization. <strong>Mutating</strong> webhooks run first, then <strong>Validating</strong>{' '}
          webhooks. Key security-related admission controllers include: NodeRestriction, PodSecurity,
          NamespaceLifecycle, LimitRanger, and CertificateSubjectRestriction.
        </p>

        <p className="text-sm italic my-3" style={{ color: 'var(--text-tertiary)' }}>
          <strong>🎯 Why This Matters:</strong> Admission controllers appear on ~5% of exam questions. The most common trap: mutating runs BEFORE validating.
        </p>

        <CalloutBox variant="exam">
          The API Server is the ONLY component that talks directly to etcd. Every other component
          must go through the API Server. Port <strong>6443</strong>. Anonymous auth must be FALSE
          in production. Always use --authorization-mode=Node,RBAC.
        </CalloutBox>

        <ExamTrap title="⚠️ Anonymous Auth Trap">
          <strong>Leaving --anonymous-auth=true (default) is dangerous.</strong> The API Server accepts requests from system:anonymous user and system:unauthenticated group. A rogue node or attacker could probe the API Server without any credentials. Always set <code>--anonymous-auth=false</code> in production.
        </ExamTrap>

        <CodeBlock
          language="yaml"
          code={`# Audit policy: Log all requests from authenticated users
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log pod changes at RequestResponse level
  - level: RequestResponse
    resources:
    - group: ""
      resources: ["pods"]

  # Log auth failures at Metadata level
  - level: Metadata
    omitStages:
    - RequestReceived
    nonResourceURLs:
    - "/login*"
    - "/logout*"

  # Catch-all: log everything else at Request level
  - level: Request
    omitStages:
    - RequestReceived`}
        />
      </Section>

      <AdmissionPipelineDiagram />

      {/* ══════════ Section 2.1b: API Server Request Lifecycle ══════════ */}
      <Section id="d2-apiserver-lifecycle">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155,135,245,0.15)' }}
          >
            <Lock size={22} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.1b API Server Request Lifecycle
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Every request to the API Server follows a strict pipeline. Understanding this flow is essential for debugging auth failures and designing admission policies.
        </p>

        <div className="space-y-2 mb-6">
          {[
            { step: '1. kubectl', desc: 'User or component sends HTTPS request to :6443' },
            { step: '2. AuthN', desc: 'Who are you? X.509, bearer token, OIDC, or webhook authentication' },
            { step: '3. AuthZ / RBAC', desc: 'What can you do? RBAC checks roles and role bindings' },
            { step: '4. Admission', desc: 'Should we allow or modify this? Mutating then Validating webhooks' },
            { step: '5. Validation', desc: 'Schema validation — does the object conform to the API spec?' },
            { step: '6. Persist', desc: 'Write to etcd. Only the API Server talks to etcd.' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span className="text-xs font-mono font-bold flex-shrink-0 px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-primary)' }}>
                {item.step}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        <MemoryHook title="🧠 AuthN vs AuthZ vs Admission">
          <p className="mb-2"><strong>AuthN</strong> knows your NAME. <strong>AuthZ</strong> knows your ROLE. <strong>Admission</strong> can CHANGE your request.</p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Request lifecycle: 1. AuthN (who are you?) → 2. AuthZ/RBAC (what can you do?) → 3. Mutating Admission (modify) → 4. Validating Admission (approve/reject) → 5. Persist to etcd. The most common trap: mutating runs BEFORE validating.</p>
        </MemoryHook>
      </Section>

      <RBACFlowDiagram />

      <ELI5 title="🧒 ELI5: RBAC (Role-Based Access Control)">
        <p className="mb-2">
          Imagine a <strong>theater</strong>:
        </p>
        <ul className="space-y-1 mb-2">
          <li><strong>Role</strong> = The job description. "Stagehands can move props and adjust lights." 🎭</li>
          <li><strong>RoleBinding</strong> = The employment contract that gives a specific person that job. "Alice is hired as a stagehand." 📄</li>
          <li><strong>ClusterRole</strong> = A job that works across ALL theaters in the chain. 🌐</li>
          <li><strong>verbs</strong> = The specific actions allowed. get, list, watch, create, update, patch, delete, deletecollection, impersonate, bind, escalate. 🎬</li>
        </ul>
        <p>
          <strong>In other words:</strong> RBAC separates WHAT can be done (Role) from WHO can do it (Binding). Never give someone cluster-admin just because it's easier — that's like giving every employee the master key.
        </p>
      </ELI5>

      <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
        <strong>💼 Real-World Impact:</strong> RBAC misconfigurations are the #1 cause of privilege escalation in Kubernetes. The dangerous verbs — bind, escalate, impersonate — are like giving someone the master key to the theater.
      </p>

      {/* ══════════ Section 2.2: etcd ══════════ */}
      <Section id="d2-etcd">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <Database size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.2 etcd
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          etcd is the distributed key-value store that holds <strong>ALL cluster state</strong> —
          including all Secrets (which are only Base64 encoded by default). Compromising etcd means
          compromising the entire cluster.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          etcd Security Requirements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            'Peer TLS: All peer communication MUST be encrypted',
            'Client TLS: All client (API Server) communication MUST use TLS',
            'Encryption at Rest: Enable via EncryptionConfiguration',
            'Access Restriction: Firewall etcd to API Server nodes only',
            'Regular encrypted backups: etcd contains all secrets',
            'Enable authentication and RBAC on etcd',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
            >
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              {item}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Encryption at Rest Providers
        </h3>

        <ELI5 title="🧒 ELI5: Encryption at Rest">
          <p className="mb-2">
            Imagine <strong>etcd as the hotel's master safe</strong>:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>Without encryption (identity provider)</strong> = All valuables are sitting in the safe in plain sight. Anyone who cracks the safe can read everything instantly. 🚫</li>
            <li><strong>With basic encryption (aescbc, aesgcm, secretbox)</strong> = Valuables are in envelopes sealed with a hotel key. Better, but if someone steals the hotel key, all envelopes open. 🔑</li>
            <li><strong>With KMS v2 (recommended)</strong> = Each envelope gets its own unique seal (DEK), and the master key (KEK) is kept in a separate, ultra-secure vault (HSM/cloud KMS). Even if someone steals one envelope seal, they can't open anything else. 🏦</li>
          </ul>
          <p>
            <strong>In other words:</strong> KMS v2 uses <em>envelope encryption</em> — a unique key for every encryption operation, wrapped by a master key stored externally. It's like having a locksmith make a new key for every letter you send.
          </p>
        </ELI5>

        <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
          <strong>🎯 Why This Matters:</strong> This concept appears on ~8% of exam questions. Know that KMS v2 is recommended and identity means NO encryption.
        </p>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The first provider in the list handles encryption; ALL providers are tried for decryption.
          Always put the strongest provider first. <strong>identity: {}</strong> must be LAST (fallback
          for reading unencrypted data only).
        </p>

        <EncryptionTable />

        <MemoryHook title="🧠 Encryption Provider Order">
          <p className="mb-2"><strong>The first provider encrypts; ALL providers are tried for decryption.</strong> Always put the strongest provider first. <code>identity: {}</code> must be LAST (fallback for reading unencrypted data only).</p>
          <ul className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li><strong>kms v2</strong> = Recommended. Envelope encryption with external KEK.</li>
            <li><strong>aesgcm</strong> = Fast but MUST rotate every 200K writes.</li>
            <li><strong>secretbox</strong> = Strong (XSalsa20 + Poly1305), not FIPS.</li>
            <li><strong>aescbc</strong> = Weak — padding oracle attacks. NOT recommended.</li>
            <li><strong>identity</strong> = NO encryption. Must be last.</li>
          </ul>
        </MemoryHook>

        <CalloutBox variant="exam">
          etcd ports: <strong>2379</strong> (client) and <strong>2380</strong> (peer). ALWAYS enable
          both peer and client TLS. etcd stores ALL Secrets in plaintext by default — you MUST enable
          encryption at rest. <strong>KMS v2 is the recommended provider.</strong>
        </CalloutBox>

        <CodeBlock
          language="yaml"
          code={`# EncryptionConfiguration for etcd encryption at rest
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    - configmaps
    providers:
    - kms:
        apiVersion: v2  # RECOMMENDED: kms v2
        name: myKMSPlugin
        endpoint: unix:///var/run/k8s-kms-plugin/socket.sock
        cachesize: 1000
        timeout: 3s
    - aesgcm:
        keys:
        - name: key1
          secret: <base64-encoded-32-byte-key>
    - aescbc:
        keys:
        - name: key1
          secret: <base64-encoded-32-byte-key>
    - secretbox:
        keys:
        - name: key1
          secret: <base64-encoded-32-byte-key>
    - identity: {}  # NO ENCRYPTION - must be LAST`}
        />
      </Section>

      <EncryptionChainDiagram />

      <ExplainLikeImFive concept="etcd" />

      {/* ══════════ Section 2.2b: etcd Backup & Restore Security ══════════ */}
      <Section id="d2-etcd-backup">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <Database size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.2b etcd Backup &amp; Restore Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          etcd backups contain the entire cluster state — including all Secrets in plaintext if encryption at rest is not enabled. Securing backups is as critical as securing etcd itself.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Taking an Encrypted Snapshot
        </h3>

        <CodeBlock
          language="bash"
          code={`# Create an etcd snapshot with client certificate authentication
etcdctl snapshot save /backup/etcd-snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Encrypt the snapshot before storing it offsite
gpg --symmetric --cipher-algo AES256 /backup/etcd-snapshot.db`}
        />

        <ExamTrap title="etcd Snapshots">
          Never store etcd snapshots in plaintext. A snapshot contains every Secret, ConfigMap, and cluster credential. Treat it like a raw database dump — encrypt it before backup.
        </ExamTrap>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Restoring from Snapshot
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Restoring etcd reverts the entire cluster state to the snapshot point-in-time. This affects ALL resources — not just the ones you intended to recover.
        </p>

        <CodeBlock
          language="bash"
          code={`# 1. Stop the API Server (prevents writes during restore)
mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/

# 2. Restore the snapshot
etcdctl snapshot restore /backup/etcd-snapshot.db \\
  --data-dir=/var/lib/etcd-restored \\
  --initial-cluster=master-1=https://192.168.1.10:2380 \\
  --initial-advertise-peer-urls=https://192.168.1.10:2380 \\
  --name=master-1

# 3. Update etcd data-dir if needed, then restart API Server
mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/`}
        />

        <Callout variant="warning">
          Restoring etcd reverts ALL cluster state, not just what you wanted. Plan accordingly.
        </Callout>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Disaster Recovery Scenario
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Imagine a compromised etcd node where an attacker deleted critical ConfigMaps and Service accounts. Your disaster recovery playbook should look like this:
        </p>
        <div className="space-y-2 mb-6">
          {[
            { step: '1. Isolate', desc: 'Stop the API Server on all control plane nodes to prevent split-brain writes.' },
            { step: '2. Restore', desc: 'Use etcdctl snapshot restore on a NEW data-dir (never overwrite live data).' },
            { step: '3. Verify', desc: 'Start a single API Server, verify resources with kubectl get all -A.' },
            { step: '4. Roll out', desc: 'Bring remaining control plane nodes online one at a time.' },
            { step: '5. Post-incident', desc: 'Rotate ALL credentials (SA tokens, certs) — backups may contain compromised state.' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span className="text-xs font-mono font-bold flex-shrink-0 px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-primary)' }}>
                {item.step}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        <ExamTrap title="etcd Backup Verification">
          The exam loves backup verification questions. After restoring, always verify with etcdctl endpoint status and kubectl get nodes. If the API Server reports errors, the restored etcd may be missing the latest raft index.
        </ExamTrap>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Exam-Style: Backup Verification YAML
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          A common exam question asks how to verify etcd health after restore. You must check both etcd member status AND API Server connectivity.
        </p>

        <CodeBlock
          language="bash"
          code={`# Verify etcd cluster health after restore
etcdctl endpoint health \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Expected output: https://127.0.0.1:2379 is healthy: successfully committed proposal

# Verify API Server can read from restored etcd
kubectl get nodes
kubectl get pods -A | head -10`}
        />

        <MemoryHook title="etcd Backup">
          etcd backup = cluster state. Encrypt it like you&apos;d encrypt a database dump.
        </MemoryHook>

        <QuizComponent
          questions={[
            {
              id: 101,
              question: 'You restored etcd from a snapshot but the API Server fails to start. What is the MOST likely cause?',
              options: [
                'The snapshot was encrypted with the wrong KMS key',
                'The API Server manifest was not moved out before restore',
                'The restored etcd data-dir has the wrong permissions',
                'The snapshot was taken while the API Server was running',
              ],
              correctIndex: 1,
              explanation: 'You MUST stop the API Server before restoring etcd (move the manifest out of /etc/kubernetes/manifests). If the API Server is running during restore, it will attempt to write to etcd while etcd is being reconstructed, causing corruption.',
            },
            {
              id: 102,
              question: 'Which command verifies etcd health after a snapshot restore?',
              options: [
                'etcdctl snapshot status',
                'etcdctl endpoint health',
                'kubectl get etcd',
                'systemctl status etcd',
              ],
              correctIndex: 1,
              explanation: 'etcdctl endpoint health is the correct command to verify etcd cluster health after restore. It checks that the endpoint can successfully commit a proposal. snapshot status only inspects the snapshot file metadata, not the running cluster.',
            },
          ]}
          domainId="domain2-backup"
        />
      </Section>

      {/* ══════════ Section 2.3: Kubelet ══════════ */}
      <Section id="d2-kubelet">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(242,196,77,0.15)' }}
          >
            <Cpu size={22} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.3 Kubelet
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The Kubelet runs on every worker node and manages pod lifecycle. It is a critical security
          target because it has direct access to node resources and container runtimes.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Kubelet Ports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
            { port: '10250', name: 'HTTPS API', desc: 'Full read/write access', secure: true },
            { port: '10248', name: 'Healthz', desc: 'Localhost health checks', secure: false },
            { port: '10255', name: 'Read-only', desc: 'Unauthenticated — DISABLE (set to 0)', secure: false, danger: true },
          ].map((p) => (
            <div
              key={p.port}
              className="rounded-lg p-4"
              style={{
                backgroundColor: p.danger === true ? 'rgba(232,122,93,0.08)' : 'var(--surface-base)',
                border: `1.5px solid ${p.danger === true ? 'var(--accent-coral)' : 'var(--border-subtle)'}`,
              }}
            >
              <div className="font-mono text-lg font-bold" style={{ color: p.danger === true ? 'var(--accent-coral)' : 'var(--accent-primary)' }}>
                {p.port}
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {p.name}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        <ExplainLikeImFive concept="kubelet" />

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Kubelet Security Flags
        </h3>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Flag', 'Secure Value', 'Purpose'].map((h) => (
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
                { flag: '--anonymous-auth', value: 'false', purpose: 'Disable anonymous access' },
                { flag: '--authorization-mode', value: 'Webhook', purpose: 'Delegate auth to API Server' },
                { flag: '--client-ca-file', value: 'Path to CA', purpose: 'Validate client certificates' },
                { flag: '--tls-cert-file', value: 'Path to cert', purpose: 'Kubelet serving certificate' },
                { flag: '--read-only-port', value: '0', purpose: 'Disable read-only port (10255)' },
                { flag: '--rotate-certificates', value: 'true', purpose: 'Auto-rotate client certificates' },
                { flag: '--rotate-server-certificates', value: 'true', purpose: 'Auto-rotate serving certificates' },
              ].map((row, i) => (
                <tr
                  key={row.flag}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
                  }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.flag}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--accent-sage)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.value}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Read-Only Port Disable (10255)
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The Kubelet read-only port (10255) provides unauthenticated access to pod specs, node metrics, and environment variables. An attacker on the node network can extract sensitive data including Secrets passed as environment variables.
        </p>

        <CodeBlock
          language="bash"
          code={`# Kubelet config: disable the read-only port
--read-only-port=0

# Verify it is disabled
curl http://localhost:10255/pods
# Should fail: connection refused`}
        />

        <ExamTrap title="⚠️ Kubelet Read-Only Port = Secret Leakage">
          <strong>Port 10255 provides unauthenticated access to pod specs, env vars, and node metrics.</strong> An attacker on the node network can extract Secrets passed as environment variables. Always set <code>--read-only-port=0</code> in production to disable it completely. This is a CIS Benchmark requirement (CIS 4.2.4).
        </ExamTrap>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          NodeRestriction Admission Plugin
        </h3>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The NodeRestriction admission plugin restricts a Kubelet to only modify pods bound to its
          own node. Without it, a compromised Kubelet could access or modify pods on other nodes.
          Requirements: Kubelet credentials must be in the <strong>system:nodes</strong> group with
          username <strong>system:node:&lt;nodeName&gt;</strong>.
        </p>

        <CalloutBox variant="exam">
          Kubelet ports: <strong>10250</strong> (HTTPS, main) and <strong>10248</strong> (healthz).
          Port <strong>10255</strong> (read-only) MUST be set to 0 (disabled). Always use
          --anonymous-auth=false and --authorization-mode=Webhook. NodeRestriction admission plugin
          is essential for preventing kubelet privilege escalation.
        </CalloutBox>
      </Section>

      {/* ══════════ Section 2.4: Controller Manager ══════════ */}
      <Section id="d2-controller">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232,122,93,0.15)' }}
          >
            <Server size={22} style={{ color: 'var(--accent-coral)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.4 Controller Manager
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The kube-controller-manager runs control loops that regulate cluster state: Replication,
          Endpoints, ServiceAccount token management, and more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Secure Port', value: '10257 (HTTPS)', note: 'Previously 10252 (HTTP, removed in 1.24+)' },
            { label: 'Bind Address', value: '127.0.0.1', note: 'Or use authentication' },
            { label: '--use-service-account-credentials', value: 'true', note: 'Individual SAs per controller (least privilege)' },
            { label: '--profiling', value: 'false', note: 'Disable pprof endpoint' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg p-4"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {item.label}
              </div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════ Section 2.5: Scheduler ══════════ */}
      <Section id="d2-scheduler">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232,122,93,0.15)' }}
          >
            <HardDrive size={22} style={{ color: 'var(--accent-coral)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.5 Scheduler
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The kube-scheduler assigns pods to nodes based on resource availability, affinity/anti-affinity
          rules, taints/tolerations, and priority.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Secure Port', value: '10259', desc: 'HTTPS with auth (was 10251)' },
            { label: 'Bind Address', value: '127.0.0.1', desc: 'Restrict access' },
            { label: 'Profiling', value: '--profiling=false', desc: 'Disable pprof' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg p-4 text-center"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {item.label}
              </div>
              <div className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        <CalloutBox variant="tip">
          The three control plane secure ports are: <strong>6443</strong> (API Server),{' '}
          <strong>10257</strong> (Controller Manager), and <strong>10259</strong> (Scheduler).
          All three previously had insecure HTTP ports that were removed in Kubernetes 1.24+.
        </CalloutBox>
      </Section>

      {/* ══════════ Section 2.6: Container Runtime ══════════ */}
      <Section id="d2-runtime">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(163,196,168,0.15)' }}
          >
            <Container size={22} style={{ color: 'var(--accent-sage)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.6 Container Runtime
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Kubernetes supports multiple container runtimes via the Container Runtime Interface (CRI).
          Both containerd (industry standard) and CRI-O (lightweight, K8s-native) implement CRI.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Linux Security Mechanisms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              name: 'seccomp',
              desc: 'Secure Computing Mode — filters syscalls available to containers',
              levels: ['RuntimeDefault', 'Localhost', 'Unconfined'],
              icon: Shield,
            },
            {
              name: 'AppArmor',
              desc: 'Linux security module for mandatory access control — path-based',
              levels: ['enforce', 'complain', 'disabled'],
              icon: Lock,
            },
            {
              name: 'SELinux',
              desc: 'Label-based mandatory access control — common on RHEL/CentOS',
              levels: ['enforcing', 'permissive', 'disabled'],
              icon: Eye,
            },
          ].map((mech) => (
            <div
              key={mech.name}
              className="rounded-lg p-4"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <mech.icon size={16} style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {mech.name}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                {mech.desc}
              </p>
              <div className="flex flex-wrap gap-1">
                {mech.levels.map((level) => (
                  <span
                    key={level}
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      color: 'var(--text-tertiary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          seccomp Profile Comparison
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          seccomp (Secure Computing Mode) restricts which syscalls a container can make. Kubernetes supports three profile types via the securityContext.
        </p>

        <ComparisonTable
          columns={[
            { key: 'profile', header: 'Profile' },
            { key: 'syscalls', header: 'Syscalls Allowed' },
            { key: 'useCase', header: 'Use Case' },
            { key: 'risk', header: 'Risk Level' },
          ]}
          rows={[
            { profile: 'RuntimeDefault', syscalls: 'Subset — ~44 safe syscalls', useCase: 'General workloads', risk: 'Low' },
            { profile: 'Unconfined', syscalls: 'ALL syscalls', useCase: 'Legacy / debugging only', risk: 'High' },
            { profile: 'Localhost', syscalls: 'Custom whitelist', useCase: 'Hardened workloads', risk: 'Low (if profile is correct)' },
          ]}
        />

        <MemoryHook title="seccomp Profiles">
          RuntimeDefault = sandbox. Unconfined = no walls. Localhost = custom walls.
        </MemoryHook>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Falco vs seccomp vs AppArmor vs SELinux
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          These tools are often confused. Here's the key difference: some <strong>detect</strong>, others <strong>prevent</strong>.
        </p>

        <ComparisonTable
          columns={[
            { key: 'tool', header: 'Tool' },
            { key: 'mechanism', header: 'Mechanism' },
            { key: 'action', header: 'Action' },
            { key: 'examNote', header: 'Exam Note' },
          ]}
          rows={[
            { tool: 'Falco', mechanism: 'eBPF / kernel module', action: 'DETECTS and ALERTS', examNote: 'Detection only — does NOT block' },
            { tool: 'seccomp', mechanism: 'Syscall filter', action: 'PREVENTS', examNote: 'Blocks forbidden syscalls' },
            { tool: 'AppArmor', mechanism: 'Path-based MAC', action: 'PREVENTS', examNote: 'Restricts file + capability access' },
            { tool: 'SELinux', mechanism: 'Label-based MAC', action: 'PREVENTS', examNote: 'Restricts resource access by label' },
          ]}
        />

        <p className="text-sm italic my-3" style={{ color: 'var(--text-tertiary)' }}>
          <strong>🎯 Why This Matters:</strong> Exam questions love testing whether you know that Falco detects but does NOT prevent. seccomp, AppArmor, and SELinux actually block actions.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          AppArmor Profile Loading
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          AppArmor is a Linux MAC system that confines programs to a set of files, capabilities, and network access. Profiles are loaded into the kernel with <code>apparmor_parser</code> and referenced by name in pod annotations.
        </p>

        <CodeBlock
          language="bash"
          code={`# Load a custom AppArmor profile on the node
apparmor_parser -r -W /etc/apparmor.d/containers/nginx-profile

# Reference it in a pod (legacy annotation)
# container.apparmor.security.beta.kubernetes.io/nginx: localhost/nginx-profile`}
        />

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          SELinux Contexts for Containers
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          SELinux uses type enforcement to label processes and files. For containers, the container runtime assigns an SELinux context automatically. In enforcing mode, a container process can only access files with a matching or allowed label.
        </p>

        <CodeBlock
          language="yaml"
          code={`# Explicit SELinux options in a pod
spec:
  securityContext:
    seLinuxOptions:
      level: "s0:c123,c456"
      role: "system_r"
      type: "container_t"
      user: "system_u"`}
        />

        <CalloutBox variant="exam">
          <strong>seccomp</strong> = syscall filtering. <strong>AppArmor</strong> = path-based MAC.
          <strong> SELinux</strong> = label-based MAC. Best practice: drop ALL capabilities, then add
          only what is needed. Never run containers as root. Use RuntimeDefault seccomp profile.
        </CalloutBox>

        <CodeBlock
          language="yaml"
          code={`apiVersion: v1
kind: Pod
metadata:
  name: secure-app
  annotations:
    # AppArmor profile (legacy annotation)
    container.apparmor.security.beta.kubernetes.io/app: runtime/default
    # seccomp profile (newer API via securityContext)
spec:
  securityContext:
    # SELinux options
    seLinuxOptions:
      level: "s0:c123,c456"
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL`}
        />
      </Section>

      {/* ══════════ Section 2.7: Kube-proxy ══════════ */}
      <Section id="d2-kubeproxy">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(26,95,180,0.1)' }}
          >
            <Globe size={22} style={{ color: 'var(--info)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.7 Kube-proxy
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Kube-proxy runs on every node, maintaining network rules for pod-to-service communication.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Proxy Modes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              name: 'iptables',
              desc: 'Creates iptables rules for each Service endpoint. Default. Scales to ~5,000 services. O(n) traversal.',
              recommended: false,
            },
            {
              name: 'IPVS',
              desc: 'Uses Linux IP Virtual Server for L4 load balancing. Hash tables. Better for 1000+ services. Multiple schedulers.',
              recommended: true,
            },
            {
              name: 'nftables',
              desc: 'Modern recommended mode. Better performance than both iptables and IPVS. Available in newer Kubernetes.',
              recommended: true,
            },
          ].map((mode) => (
            <div
              key={mode.name}
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: `1.5px solid ${mode.recommended ? 'var(--accent-sage)' : 'var(--border-subtle)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {mode.name}
                </span>
                {mode.recommended && (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(163,196,168,0.15)', color: 'var(--accent-sage)' }}
                  >
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {mode.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Security Settings
          </h4>
          <div className="space-y-2">
            {[
              '--metrics-bind-address=127.0.0.1:10249 (localhost only)',
              '--nodeport-addresses=primary or specific CIDRs',
              'kubeconfig file permissions: 600 (CIS requirement)',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Check size={12} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════ Section 2.8: CNI ══════════ */}
      <Section id="d2-cni">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(155,135,245,0.15)' }}
          >
            <Network size={22} style={{ color: 'var(--accent-lavender)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.8 Container Networking (CNI)
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The Container Network Interface (CNI) is the standard between container runtimes and network
          plugins. CNI plugins configure pod network interfaces and IP allocation when pods are created.
        </p>

        <CniTable />

        <CalloutBox variant="warning">
          Not all CNIs enforce NetworkPolicy. <strong>Flannel alone does NOT enforce policies.</strong>
          You need Calico, Cilium, or a policy-enforcing CNI. Default Kubernetes networking allows ALL
          pod-to-pod traffic — use Network Policies for isolation.
        </CalloutBox>

        <ExplainLikeImFive concept="cni" />

        <h3 className="text-lg font-semibold mb-3 mt-8" style={{ color: 'var(--text-primary)' }}>
          Network Security Best Practices
        </h3>

        <div className="space-y-2">
          {[
            'Use Network Policies for pod-to-pod traffic control',
            'Isolate namespaces with default-deny policies',
            'Use service mesh (Istio/Linkerd) for L7/application-layer security',
            'Encrypt pod-to-pod traffic with WireGuard (Calico) or service mesh mTLS',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
            >
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════ Section 2.9: Client Security ══════════ */}
      <Section id="d2-client">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <Lock size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.9 Client Security (ServiceAccounts)
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          ServiceAccounts provide identity for processes running in pods. Understanding token
          management and kubeconfig security is essential.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          ServiceAccount Token Types (since Kubernetes 1.24)
        </h3>

        <ELI5 title="🧒 ELI5: ServiceAccount Tokens">
          <p className="mb-2">
            Imagine <strong>API tokens as hotel room keys</strong>:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>Legacy Token (auto-mounted Secret)</strong> = A permanent metal key that never expires. If someone steals it, they can enter your room forever. You have to physically change the lock to invalidate it. 🗝️</li>
            <li><strong>Bound Token (TokenRequest API)</strong> = A modern keycard that expires after 1 hour and only works for YOUR room. If stolen, it's useless after a short time. Plus, it's tied to your specific reservation. 💳</li>
          </ul>
          <p>
            <strong>In other words:</strong> Legacy tokens are long-lived and dangerous. Bound tokens are short-lived, audience-scoped, and auto-rotated. Since Kubernetes 1.24, always use bound tokens.
          </p>
        </ELI5>

        <ComparisonTable
          columns={[
            { key: 'property', header: 'Property' },
            { key: 'legacy', header: 'Legacy (Secret-based)' },
            { key: 'bound', header: 'Bound (TokenRequest API)' },
          ]}
          rows={[
            { property: 'Lifespan', legacy: 'Long-lived (until Secret deleted)', bound: 'Short-lived (~1 hour default)' },
            { property: 'Rotation', legacy: 'Manual', bound: 'Auto-rotated at 80% TTL' },
            { property: 'Audience', legacy: 'Any (broad)', bound: 'Scoped to specific audience' },
            { property: 'Bound to', legacy: 'Nothing (portable if stolen)', bound: 'Specific pod/object' },
            { property: 'Storage', legacy: 'Kubernetes Secret in etcd', bound: 'Projected volume (tmpfs, in-memory)' },
            { property: 'Recommended', legacy: '❌ No (since 1.24)', bound: '✅ Yes' },
          ]}
        />

        <p className="text-sm italic my-3" style={{ color: 'var(--text-tertiary)' }}>
          <strong>🎯 Why This Matters:</strong> Token type questions appear on ~5% of exam questions. Know that legacy auto-mounted Secret tokens were disabled by default in Kubernetes 1.24.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          kubeconfig Structure
        </h3>

        <CodeBlock
          language="yaml"
          code={`# kubeconfig structure
apiVersion: v1
kind: Config
clusters:
- name: production
  cluster:
    certificate-authority-data: <CA_CERT_B64>
    server: https://api-server:6443
users:
- name: admin
  user:
    client-certificate-data: <CERT_B64>
    client-key-data: <KEY_B64>
contexts:
- name: production-admin
  context:
    cluster: production
    user: admin
    namespace: default
current-context: production-admin`}
        />

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Best Practices
        </h3>

        <div className="space-y-2">
          {[
            'Use short-lived certificates or token-based auth',
            'Limit kubeconfig scope (namespace, RBAC)',
            'Never share admin kubeconfigs',
            'Use kubectl auth can-i to verify permissions',
            'Rotate credentials regularly',
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-secondary)' }}
            >
              <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-sage)' }} />
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════ Section 2.9b: TLS Bootstrapping ══════════ */}
      <Section id="d2-bootstrap">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <Lock size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.9b TLS Bootstrapping &amp; Node Join Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          When a new worker node joins the cluster, it needs a valid client certificate to authenticate to the API Server. Kubernetes provides an automated TLS bootstrapping mechanism so nodes can join securely without manual certificate distribution.
        </p>

        <ELI5 title="🧒 ELI5: TLS Bootstrapping">
          <p className="mb-2">
            Imagine you're starting at a <strong>new company</strong>:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>Bootstrap Token</strong> = Your temporary visitor pass. It's short-lived and lets you into the building once. 🎫</li>
            <li><strong>kubelet presents token</strong> = You show your visitor pass at the front desk. 🪪</li>
            <li><strong>CSR submitted</strong> = You fill out an application for a permanent employee badge. 📝</li>
            <li><strong>Approval</strong> = HR reviews your application and approves it. ✅</li>
            <li><strong>Certificate issued</strong> = You get your permanent employee badge with your photo and access level. 🪪</li>
          </ul>
          <p>
            <strong>In other words:</strong> TLS bootstrapping is like onboarding a new employee. Start with a temp pass, then get a permanent badge after verification. Without this process, you'd have to hand-deliver badges to every new hire — impossible at scale.
          </p>
        </ELI5>

        <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
          <strong>🎯 Why This Matters:</strong> This appears on ~5% of exam questions. Know the 5-step flow and that the bootstrap token is a Secret in kube-system.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Bootstrap Flow
        </h3>
        <div className="space-y-2 mb-6">
          {[
            { step: '1. Bootstrap Token', desc: 'A short-lived Secret is created in the kube-system namespace with a token ID and secret.' },
            { step: '2. kubelet uses token', desc: 'The new kubelet presents the bootstrap token to the API Server as initial credentials.' },
            { step: '3. CSR submitted', desc: 'The kubelet generates a private key and submits a CertificateSigningRequest (CSR).' },
            { step: '4. Approval', desc: 'An administrator or an auto-approver approves the CSR.' },
            { step: '5. Certificate issued', desc: 'The kubelet downloads the signed certificate and begins normal operation.' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span className="text-xs font-mono font-bold flex-shrink-0 px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-primary)' }}>
                {item.step}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Bootstrap Token Secret
        </h3>

        <CodeBlock
          language="yaml"
          code={`apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-07401b
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  token-id: "07401b"
  token-secret: "f395ac634246ae72d1d8974f5bc"
  usage-bootstrap-authentication: "true"
  usage-bootstrap-signing: "true"
  auth-extra-groups: system:bootstrappers:worker`}
        />

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          CertificateSigningRequest Resource
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          The CSR resource holds the certificate request. After approval, the certificate is written to the status.certificate field.
        </p>

        <CodeBlock
          language="bash"
          code={`# List pending CSRs
kubectl get csr

# Approve a CSR manually
kubectl certificate approve <csr-name>

# Deny a suspicious CSR
kubectl certificate deny <csr-name>`}
        />

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Node Auto-Approval vs Manual Approval
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Auto-Approval
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              The <code>NodeAutoApproval</code> controller or RBAC-based auto-approver automatically approves CSR requests from nodes in the <code>system:bootstrappers</code> group. Convenient but requires strict token lifecycle management.
            </div>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Manual Approval
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              An administrator reviews each CSR with <code>kubectl get csr</code> and explicitly approves or denies. More secure for regulated environments but operational overhead is higher.
            </div>
          </div>
        </div>

        <ExamTrap title="Anonymous Auth">
          Why <code>--anonymous-auth=false</code> matters: if left enabled, the API Server accepts anonymous requests. A rogue node or attacker could probe the API Server without credentials. Always disable anonymous authentication in production.
        </ExamTrap>

        <QuizComponent
          questions={[
            {
              id: 103,
              question: 'During TLS bootstrapping, what is the purpose of the bootstrap token?',
              options: [
                'It is a long-lived credential used by the kubelet forever',
                'It provides temporary authentication so the kubelet can submit a CSR',
                'It encrypts communication between the kubelet and etcd',
                'It replaces the kubelet client certificate entirely',
              ],
              correctIndex: 1,
              explanation: 'The bootstrap token is a short-lived Secret in kube-system. It gives a new kubelet temporary credentials to authenticate to the API Server and submit a CertificateSigningRequest. After CSR approval, the kubelet uses its permanent certificate.',
            },
            {
              id: 104,
              question: 'An administrator sees a pending CSR from an unknown node. What is the SAFEST action?',
              options: [
                'Approve it immediately so the node can join',
                'Investigate the node identity before approving or denying',
                'Ignore it — pending CSRs expire automatically',
                'Delete the CSR resource to hide the evidence',
              ],
              correctIndex: 1,
              explanation: 'CSRs from unknown nodes should be investigated before approval. Approving blindly could let a rogue node join the cluster. Manual approval is the safest approach in regulated environments.',
            },
          ]}
          domainId="domain2-bootstrap"
        />
      </Section>

      <TokenLifecycleDiagram />

      {/* ══════════ Section 2.10: Storage ══════════ */}
      <Section id="d2-storage">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(50,108,229,0.1)' }}
          >
            <Database size={22} style={{ color: 'var(--k8s-blue)' }} />
          </div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            2.10 Storage Security
          </h2>
        </div>

        <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          Storage security involves encrypting data at rest on volumes and protecting data in transit
          between storage components.
        </p>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Encryption at Rest for Storage
        </h3>

        <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            StorageClass with Encryption
          </h4>
          <CodeBlock
            language="yaml"
            code={`apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: encrypted-gp3
provisioner: ebs.csi.aws.com
parameters:
  encrypted: "true"
  type: gp3
  kmsKeyId: "arn:aws:kms:us-east-1:111122223333:key/12345678-1234-1234-1234-123456789012"
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer`}
          />
        </div>

        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Key Points
        </h3>

        <div className="space-y-3">
          {[
            {
              title: 'CSI Drivers',
              desc: 'Support both at-rest encryption (via storage backend like AWS KMS for EBS) and in-transit encryption (via TLS/mTLS between components).',
            },
            {
              title: 'KMS Integration',
              desc: 'Use KMS v2 for etcd encryption at rest. Envelope encryption uses a DEK per encryption operation + a KEK stored in HSM.',
            },
            {
              title: 'Key Rotation',
              desc: 'Key rotation creates new key versions for FUTURE encryption only. Existing data is NOT re-encrypted. You must explicitly trigger re-encryption.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg p-4"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>
                {item.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <CalloutBox variant="exam">
          Encryption at rest must be configured at multiple layers: <strong>etcd</strong> (for Secrets),
          <strong> persistent volumes</strong> (via StorageClass encryption), and{' '}
          <strong>backups</strong>. etcd backups contain ALL secrets — they must be encrypted and stored
          securely.
        </CalloutBox>
      </Section>

      {/* ══════════ Quiz ══════════ */}
      <Section id="d2-quiz">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(4,80,54,0.1)' }}
          >
            <Check size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div>
            <h2
              className="text-2xl font-normal"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              Chapter Quiz
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Test your knowledge of Domain 2 concepts — the highest-weighted domain
            </p>
          </div>
        </div>

        <QuizComponent questions={domain2Questions} domainId="domain2" />
      </Section>

      {/* ══════════ Chapter Footer ══════════ */}
      <div
        className="flex items-center justify-between mt-16 pt-8"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <Link
          to="/domain1"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowRight size={14} className="rotate-180" />
          Domain 1: Overview
        </Link>

        <Link
          to="/domain3"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--surface-base)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-primary)',
          }}
        >
          Domain 3: Security Fundamentals
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
