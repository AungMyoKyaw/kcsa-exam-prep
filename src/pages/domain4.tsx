import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, ArrowRight, Globe } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import Quiz from '@/components/Quiz';
import type { QuizQuestion } from '@/components/Quiz';
import SectionHeader from '@/components/SectionHeader';
import ComparisonTable from '@/components/ComparisonTable';
import StrideDiagram from '@/components/StrideDiagram';
import StrideK8sDiagram from '@/components/diagrams/StrideK8sDiagram'
import ELI5 from '@/components/ELI5'
import MemoryHook from '@/components/MemoryHook'
import ExamTrap from '@/components/ExamTrap'

const DOMAIN_ID = 'domain4';

/* ─── Quiz Data ─── */
const quizQuestions: QuizQuestion[] = [
  {
    question: 'Which STRIDE category covers stealing a ServiceAccount token to access the API server?',
    options: ['Tampering', 'Spoofing', 'Information Disclosure', 'Elevation of Privilege'],
    correctIndex: 1,
    explanation: 'Spoofing involves impersonating another identity. A stolen ServiceAccount token allows an attacker to impersonate a legitimate pod/service and access the API server with that identity\'s permissions.',
  },
  {
    question: 'Which trust boundary is MOST critical to protect because it stores ALL cluster state including Secrets?',
    options: [
      'Pod → Pod',
      'API Server → Kubelet',
      'API Server → etcd',
      'External User → API Server',
    ],
    correctIndex: 2,
    explanation: 'The API Server → etcd boundary is the most critical because etcd stores ALL cluster state, including Secrets (which are only Base64-encoded by default). Compromising etcd means compromising the entire cluster.',
  },
  {
    question: 'In the "Attacker on the Network" scenario, what is the MOST effective first-line defense against MITM attacks between pods?',
    options: [
      'Pod Security Standards',
      'NetworkPolicy with default-deny',
      'RBAC least privilege',
      'Audit logging',
    ],
    correctIndex: 1,
    explanation: 'NetworkPolicy with a default-deny posture is the foundational control for network-level attacks. It segments pod-to-pod traffic so a compromised pod cannot freely communicate with other pods. TLS everywhere and service mesh mTLS add defense-in-depth.',
  },
  {
    question: 'If an attacker compromises a worker node, what is the MOST dangerous container configuration they can exploit?',
    options: [
      'A container with readOnlyRootFilesystem: true',
      'A privileged container with hostPID: true',
      'A container running as non-root',
      'A container with RuntimeDefault seccomp',
    ],
    correctIndex: 1,
    explanation: 'A privileged container with hostPID: true is the most dangerous configuration. privileged gives root access to all host devices, and hostPID allows seeing all host processes. With nsenter, the attacker can enter all host namespaces and gain full host root access instantly.',
  },
  {
    question: 'Which persistence mechanism uses a hostPath volume to maintain access to the host filesystem?',
    options: ['CronJob scheduling', 'hostPath mount', 'Mutating webhook', 'RBAC manipulation'],
    correctIndex: 1,
    explanation: 'A hostPath volume mounts a directory from the host filesystem into the pod. An attacker can write to /etc/cron.d, /etc/rc.local, or other startup locations to persist across pod restarts and even node reboots.',
  },
  {
    question: 'What security mechanism prevents container escape by filtering dangerous system calls?',
    options: ['AppArmor', 'SELinux', 'seccomp', 'NetworkPolicy'],
    correctIndex: 2,
    explanation: 'seccomp (secure computing mode) filters which system calls a container can make. It blocks dangerous syscalls that could enable container escape. The RuntimeDefault profile is recommended for most workloads.',
  },
  {
    question: 'What is the default pod-to-pod network behavior in Kubernetes without NetworkPolicies?',
    options: [
      'All pods can communicate freely',
      'No pods can communicate',
      'Only pods in the same namespace can communicate',
      'Only pods with matching labels can communicate',
    ],
    correctIndex: 0,
    explanation: 'By default, all pods in a Kubernetes cluster can communicate with each other freely across namespaces. This flat network model is the #1 enabler of lateral movement. NetworkPolicies must be explicitly configured to segment traffic.',
  },
  {
    question: 'Which RBAC verb allows a user to grant themselves any role, including cluster-admin?',
    options: ['impersonate', 'escalate', 'bind', 'deletecollection'],
    correctIndex: 2,
    explanation: 'The bind verb allows a user to create RoleBindings or ClusterRoleBindings to any role, including cluster-admin — even if they don\'t have the permissions in that role. This is a critical privilege escalation vector.',
  },
  {
    question: 'What is the most effective defense against pod-to-pod lateral movement?',
    options: [
      'Service mesh mTLS',
      'Network Policies with default-deny',
      'Pod Security Standards',
      'Encryption at rest',
    ],
    correctIndex: 1,
    explanation: 'Network Policies with a default-deny posture are the most effective defense against lateral movement. Combined with explicit allow rules, they enforce zero-trust networking by default. mTLS adds authentication but NetworkPolicy is the foundational control.',
  },
  {
    question: 'Under which STRIDE category does a privileged container escape fall?',
    options: ['Spoofing', 'Tampering', 'Denial of Service', 'Elevation of Privilege'],
    correctIndex: 3,
    explanation: 'A privileged container escape is Elevation of Privilege — gaining unauthorized capabilities beyond what was granted. The attacker goes from container-level access to host-level root access.',
  },
  {
    question: 'Which ResourceQuota field limits the number of pods in a namespace?',
    options: ['cpu', 'memory', 'pods', 'requests.storage'],
    correctIndex: 2,
    explanation: 'The "pods" field in ResourceQuota limits the total number of pods in a namespace. Other important fields include requests.cpu, requests.memory, limits.cpu, limits.memory, services, persistentvolumeclaims, secrets, and configmaps.',
  },
  {
    question: 'What is the most dangerous container configuration combination for container escape?',
    options: [
      'privileged: true + hostPID: true',
      'readOnlyRootFilesystem: false',
      'allowPrivilegeEscalation: true',
      'hostNetwork: true',
    ],
    correctIndex: 0,
    explanation: 'privileged: true combined with hostPID: true is the most dangerous combination. A privileged container has root access to all host devices, and hostPID allows it to see all host processes. With nsenter, the attacker can enter all host namespaces and gain full host root access instantly.',
  },
  {
    question: 'Which MITRE ATT&CK technique ID corresponds to "Escape to Host" in containers?',
    options: ['T1610', 'T1611', 'T1053.003', 'T1552.007'],
    correctIndex: 1,
    explanation: 'T1611 (Escape to Host) is the MITRE ATT&CK technique for container escape. It falls under the Privilege Escalation tactic. T1610 is Deploy Container, T1053.003 is Scheduled Task/Job (Cron), and T1552.007 is Container API credential access.',
  },
];

/* ─── STRIDE Table Data ─── */
const strideColumns = [
  { key: 'stride', header: 'STRIDE', width: '20%' },
  { key: 'component', header: 'Component at Risk', width: '25%' },
  { key: 'attack', header: 'Attack Vector', width: '25%' },
  { key: 'mitigation', header: 'Mitigation', width: '30%' },
];

const strideRows = [
  { stride: 'S — Spoofing', component: 'API Server', attack: 'Stolen token/cert', mitigation: 'Short-lived tokens, OIDC, cert rotation' },
  { stride: 'S — Spoofing', component: 'Kubelet', attack: 'Forged client cert', mitigation: 'Client CA verification, NodeRestriction' },
  { stride: 'T — Tampering', component: 'etcd', attack: 'Direct data access', mitigation: 'Peer/client TLS, encryption at rest' },
  { stride: 'T — Tampering', component: 'Container images', attack: 'Image compromise', mitigation: 'Image signing (Cosign), admission verification' },
  { stride: 'R — Repudiation', component: 'Audit system', attack: 'Missing audit logs', mitigation: 'Audit policy (RequestResponse), webhook backend' },
  { stride: 'I — Info Disclosure', component: 'Secrets', attack: 'etcd access, RBAC misconfig', mitigation: 'Encryption at rest, least-privilege RBAC, Vault' },
  { stride: 'I — Info Disclosure', component: 'Network', attack: 'Unencrypted pod traffic', mitigation: 'NetworkPolicy, service mesh mTLS' },
  { stride: 'D — DoS', component: 'API Server', attack: 'Request flooding', mitigation: 'Rate limiting, resource quotas, priority classes' },
  { stride: 'D — DoS', component: 'etcd', attack: 'Key flooding', mitigation: 'Resource quotas, defragmentation, size limits' },
  { stride: 'E — Privilege Esc.', component: 'RBAC', attack: 'bind/escalate abuse', mitigation: 'Least-privilege RBAC, regular audits' },
  { stride: 'E — Privilege Esc.', component: 'Containers', attack: 'Privileged container escape', mitigation: 'PSS Restricted, seccomp, AppArmor/SELinux' },
];

/* ─── Container Escape Vectors ─── */
const escapeVectorsColumns = [
  { key: 'technique', header: 'Technique', width: '30%' },
  { key: 'description', header: 'Description', width: '70%' },
];

const escapeVectorsRows = [
  { technique: 'Privileged containers', description: 'Full host access, can escape via nsenter or device access. MOST dangerous.' },
  { technique: 'hostPID', description: 'Access host process namespace, can see and interact with host processes' },
  { technique: 'hostNetwork', description: 'Access host network, can sniff traffic, bind host ports, access metadata' },
  { technique: 'hostIPC', description: 'Access host IPC namespace, can read shared memory' },
  { technique: 'hostPath mounts', description: 'Mount host directories, read/write host filesystem for persistence' },
  { technique: 'Writable rootfs', description: 'Modify container filesystem, exploit SETUID binaries' },
  { technique: 'Dangerous capabilities', description: 'CAP_SYS_ADMIN, CAP_SYS_PTRACE, CAP_SYS_MODULE — each enables escape' },
  { technique: 'Kernel exploits', description: 'CVEs in shared kernel: DirtyCow, Dirty Pipe, CVE-2024-21626' },
];

/* ─── Lateral Movement Paths ─── */
const lateralPathsColumns = [
  { key: 'path', header: 'Attack Path', width: '35%' },
  { key: 'method', header: 'Method', width: '65%' },
];

const lateralPathsRows = [
  { path: 'Pod → Pod', method: 'Direct IP communication between any pods (flat network)' },
  { path: 'Pod → Service → Pod', method: 'Using Kubernetes DNS to discover and reach services' },
  { path: 'Pod → API Server', method: 'Using mounted ServiceAccount token with RBAC permissions' },
  { path: 'Pod → Node', method: 'Via privileged container or hostPath mount' },
  { path: 'Pod → etcd', method: 'Through API Server if token has sufficient RBAC' },
  { path: 'Pod → Cloud metadata', method: 'Access 169.254.169.254 for cloud IAM credentials' },
];

/* ─── MITRE ATT&CK Tactics ─── */
const mitreTacticsColumns = [
  { key: 'tactic', header: 'Tactic', width: '30%' },
  { key: 'description', header: 'Description', width: '70%' },
];

const mitreTacticsRows = [
  { tactic: 'Initial Access', description: 'Gaining a foothold (exposed dashboard, compromised kubeconfig)' },
  { tactic: 'Execution', description: 'Running malicious code in containers' },
  { tactic: 'Persistence', description: 'Maintaining access via CronJobs, hostPath, static pods' },
  { tactic: 'Privilege Escalation', description: 'Escalating via RBAC abuse, container escape, host access' },
  { tactic: 'Defense Evasion', description: 'Clearing logs, using obfuscation, mimicking legitimate pods' },
  { tactic: 'Credential Access', description: 'Stealing SA tokens, accessing secrets, cloud metadata' },
  { tactic: 'Discovery', description: 'Scanning services, enumerating RBAC, probing network' },
  { tactic: 'Lateral Movement', description: 'Moving through flat network, exploiting service accounts' },
  { tactic: 'Impact', description: 'Resource hijacking, data destruction, denial of service' },
];

export default function Domain4Page() {
  const { progress, completeQuiz } = useProgress(DOMAIN_ID);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [, setActiveStride] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setQuizComplete(true);
    completeQuiz(score);
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-xs mb-6"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <Link to="/" className="hover:underline" style={{ color: 'var(--accent-primary)' }}>Home</Link>
        <ChevronRight size={12} />
        <span>Domain 4</span>
      </nav>

      {/* Chapter Header */}
      <div
        className="mb-10 p-6 rounded-xl border-l-4"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderLeftColor: '#9a6700',
        }}
      >
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <Globe size={20} style={{ color: '#9a6700' }} />
          <span className="text-sm font-bold" style={{ color: '#9a6700', fontFamily: 'var(--font-mono)' }}>
            Domain 4
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#fff8c5', color: '#9a6700' }}>
            16% exam weight
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>~55 min read</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>7 sections</span>
          {quizComplete && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(61, 217, 160, 0.15)',
                color: 'var(--accent-primary)',
              }}
            >
              Quiz: {quizScore}/{quizQuestions.length}
            </span>
          )}
        </div>

        <h1
          className="text-3xl md:text-4xl font-normal mb-4"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Kubernetes Threat Model
        </h1>

        <p
          className="text-lg leading-relaxed max-w-[680px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Understand how attackers think. Map STRIDE to Kubernetes components, identify persistence
          mechanisms, prevent container escape, and defend against privilege escalation, lateral movement,
          and denial of service attacks. This domain represents 16% of the exam (approximately 13 questions).
        </p>

        <Callout variant="exam">
          <strong>Exam Focus: 16% of exam (~13 questions).</strong> STRIDE mapping to Kubernetes
          components, container escape vectors, and privilege escalation paths are high-frequency topics.
        </Callout>

        <p className="text-sm italic my-2" style={{ color: 'var(--text-tertiary)' }}>
          <strong>💼 Real-World Impact:</strong> Threat modeling with STRIDE finds vulnerabilities BEFORE attackers do. It's like doing a fire drill — you identify exits before the fire starts.
        </p>
      </div>

      {/* ─── Section 4.1: Trust Boundaries and Data Flow ─── */}
      <section id="trust-boundaries">
        <SectionHeader number="4.1" title="Trust Boundaries and Data Flow" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          A <strong>trust boundary</strong> is where data or control passes between components with
          different privilege levels. Understanding trust boundaries is fundamental to threat modeling
          — every boundary is a potential attack surface.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Key Trust Boundaries in Kubernetes
        </h3>

        <div className="space-y-3 mb-6">
          {[
            {
              name: 'External User → API Server',
              desc: 'Authentication and TLS terminate here. The API Server is the single most critical trust boundary.',
              critical: true,
            },
            {
              name: 'API Server → etcd',
              desc: 'Client TLS certificates, encryption at rest. etcd stores ALL cluster state including secrets.',
              critical: true,
            },
            {
              name: 'API Server → Kubelet',
              desc: 'Node authorization, certificate auth. Kubelet has significant power on the node.',
              critical: true,
            },
            {
              name: 'Kubelet → Container Runtime',
              desc: 'CRI over Unix socket (local). Controls pod lifecycle.',
              critical: false,
            },
            {
              name: 'Pod → API Server',
              desc: 'ServiceAccount token authentication. Every pod can potentially reach the API server.',
              critical: false,
            },
            {
              name: 'Pod → Pod',
              desc: 'Network Policy enforcement point. Default: no restrictions.',
              critical: true,
            },
            {
              name: 'Pod → Node (host)',
              desc: 'Privileged container boundary. The container-runtime boundary.',
              critical: true,
            },
            {
              name: 'Pod → External service',
              desc: 'Egress control point. Default: unrestricted outbound access.',
              critical: false,
            },
          ].map((boundary, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: boundary.critical ? 'rgba(212, 43, 30, 0.04)' : 'var(--surface-base)',
                border: `1px solid ${boundary.critical ? 'rgba(212, 43, 30, 0.15)' : 'var(--border-subtle)'}`,
              }}
            >
              <ArrowRight size={16} className="flex-shrink-0 mt-0.5" style={{ color: boundary.critical ? 'var(--accent-coral)' : 'var(--accent-primary)' }} />
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{boundary.name}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{boundary.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Typical Request Flow
        </h3>

        <CodeBlock
          code={`User (kubectl) → API Server (6443, TLS, Auth, RBAC) → etcd (2379, TLS)
                                        ↓
                                    Kubelet (10250, TLS, Node auth)
                                        ↓
                                    Container Runtime (CRI, local socket)
                                        ↓
                                    Container (namespaces, cgroups, seccomp)`}
          language="bash"
          showLineNumbers={false}
        />

        <MemoryHook title="🧠 Trust Boundaries = The Gatekeeper">
          <p><strong>API Server = The Gatekeeper.</strong> Everything passes through it.</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>The API Server → etcd boundary is the most critical because etcd stores ALL cluster state, including Secrets. Compromise etcd = compromise the entire cluster.</p>
        </MemoryHook>

        <Callout variant="tip">
          When analyzing security, always trace the data flow. <strong>Every hop is a potential attack
          surface.</strong> The API Server is the most critical trust boundary — if compromised, the
          entire cluster is at risk.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Data Flow Diagrams for Threat Modeling
        </h3>
        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Threat modeling requires visualizing how data moves across trust boundaries. Here are the three most important data flows to analyze:
        </p>

        <div className="space-y-3 mb-6">
          {[
            {
              name: 'Control Plane ↔ Worker Node',
              desc: 'API Server → Kubelet (10250, TLS, Node auth). Kubelet → API Server (client cert). All control decisions flow through this channel. An attacker who intercepts this can execute arbitrary commands on nodes.',
              critical: true,
            },
            {
              name: 'Pod ↔ Pod',
              desc: 'By default, ALL pods can communicate freely (flat network). NetworkPolicy is the ONLY control here. If one pod is compromised, the attacker can scan and attack every other pod in the cluster.',
              critical: true,
            },
            {
              name: 'User → API Server',
              desc: 'kubectl → API Server (6443, TLS, AuthN, AuthZ). This is the primary entry point. Anonymous auth must be disabled. RBAC must enforce least privilege.',
              critical: false,
            },
          ].map((flow, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: flow.critical ? 'rgba(212, 43, 30, 0.04)' : 'var(--surface-base)',
                border: `1px solid ${flow.critical ? 'rgba(212, 43, 30, 0.15)' : 'var(--border-subtle)'}`,
              }}
            >
              <ArrowRight size={16} className="flex-shrink-0 mt-0.5" style={{ color: flow.critical ? 'var(--accent-coral)' : 'var(--accent-primary)' }} />
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{flow.name}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{flow.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Quiz
          questions={[
            {
              question: 'Which trust boundary stores ALL cluster state including Secrets, making it the MOST critical to protect?',
              options: [
                'Pod → Pod',
                'API Server → etcd',
                'Kubelet → Container Runtime',
                'User → API Server',
              ],
              correctIndex: 1,
              explanation: 'The API Server → etcd boundary is the most critical because etcd stores ALL cluster state. Anyone with direct etcd access can read every Secret (which are only Base64-encoded by default). This is why etcd must be firewalled to API Server nodes only and encryption at rest is mandatory.',
            },
            {
              question: 'In a flat Kubernetes network without NetworkPolicies, what is the default pod-to-pod communication behavior?',
              options: [
                'Pods can only communicate within the same namespace',
                'All pods can communicate freely across namespaces',
                'Pods require explicit service mesh authorization',
                'Only pods with matching labels can communicate',
              ],
              correctIndex: 1,
              explanation: 'By default, ALL pods in a Kubernetes cluster can communicate with each other freely across namespaces. This flat network is the #1 enabler of lateral movement. NetworkPolicies must be explicitly configured to segment traffic.',
            },
          ]}
          domainId="domain4-trust"
          onComplete={() => {}}
        />
      </section>

      {/* ─── Section 4.2: STRIDE Framework ─── */}
      <section id="stride">
        <SectionHeader number="4.2" title="STRIDE Framework Applied to Kubernetes" color="#9a6700" />

      <ELI5 title="🧒 ELI5: STRIDE Threat Modeling">
          <p className="mb-2">
            Imagine you're planning security for a <strong>bank</strong>:
          </p>
          <ul className="space-y-1 mb-2">
            <li><strong>Spoofing</strong> = Someone wears a fake security guard uniform to get past the front door. 👮</li>
            <li><strong>Tampering</strong> = Someone opens the vault and swaps real gold with painted lead. 🔧</li>
            <li><strong>Repudiation</strong> = Someone erases the security camera footage so there's no proof they were ever there. 📹</li>
            <li><strong>Information Disclosure</strong> = Someone reads the bank's customer list through a window. 👀</li>
            <li><strong>Denial of Service</strong> = Someone parks a truck across the bank's entrance so no one can enter. 🚛</li>
            <li><strong>Elevation of Privilege</strong> = A janitor finds the manager's keys and empties the vault. 🔑</li>
          </ul>
          <p>
            <strong>In other words:</strong> STRIDE is a checklist of 6 ways attackers can hurt you. For each category, ask: "How could an attacker do this to our Kubernetes cluster?"
          </p>
        </ELI5>

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          <strong>STRIDE</strong> is a threat classification model from Microsoft. Each letter represents
          a threat category. For the KCSA exam, you must be able to map each STRIDE category to a
          concrete Kubernetes attack and mitigation.
        </p>

        <MemoryHook title="🧠 S.T.R.I.D.E. Mnemonic">
          <p className="mb-2"><strong>S.T.R.I.D.E. = Spoofing, Tampering, Repudiation, Info Disclosure, Denial of Service, Elevation of Privilege</strong></p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Exam tip: Know the mapping cold — Spoofing = auth compromise, Tampering = data/code modification, Repudiation = missing audit, Info Disclosure = secret/network leaks, DoS = resource exhaustion, Elevation of Privilege = container escape/RBAC abuse.</p>
        </MemoryHook>

        {/* Interactive STRIDE Diagram */}
        <StrideDiagram onHover={setActiveStride} />

        {/* STRIDE Mapping Table */}
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          STRIDE-to-Kubernetes Mapping
        </h3>

        <ComparisonTable columns={strideColumns} rows={strideRows} />

        <MemoryHook title="🧠 STRIDE vs Attack Trees">
          <p><strong>STRIDE finds WHAT, attack trees find HOW.</strong></p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>STRIDE is a checklist — it tells you which categories of threats to look for. Attack trees trace the actual paths an attacker takes step by step. Use STRIDE to know what to defend against, then use attack trees to understand the paths.</p>
        </MemoryHook>

        <ExamTrap title="⚠️ Spoofing vs Tampering">
          <strong>Don't confuse Spoofing vs Tampering — spoofing = fake identity, tampering = changing data.</strong> Spoofing is wearing a fake security guard uniform to get past the door. Tampering is opening the vault and swapping real gold with painted lead. On the exam, stolen SA tokens = Spoofing. Modified ConfigMaps = Tampering.
        </ExamTrap>

        <ExamTrap title="⚠️ STRIDE is a Checklist, NOT a Risk Scoring System">
          <strong>STRIDE is a checklist, NOT a risk scoring system.</strong> It categorizes threats but does NOT tell you how dangerous each one is. For risk scoring, use DREAD (Damage, Reproducibility, Exploitability, Affected Users, Discoverability). The exam may ask which framework is used for risk assessment — the answer is DREAD, not STRIDE.
        </ExamTrap>

        <Callout variant="exam">
          Know how to map each STRIDE category: <strong>Spoofing</strong> = auth compromise,{' '}
          <strong>Tampering</strong> = data/code modification, <strong>Repudiation</strong> = missing
          audit, <strong>Information Disclosure</strong> = secret/network leaks,{' '}
          <strong>Denial of Service</strong> = resource exhaustion, <strong>Elevation of Privilege</strong>
          {' '} = container escape/RBAC abuse.
        </Callout>
      </section>

      <StrideK8sDiagram />

      {/* ─── Section 4.3: Persistence Mechanisms ─── */}
      <section id="persistence">
        <SectionHeader number="4.3" title="Persistence Mechanisms" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Attackers aim to maintain access after initial compromise. Understanding persistence
          mechanisms is essential for both defending clusters and understanding the threat model.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Kubernetes-Specific Persistence Techniques
        </h3>

        <div className="space-y-3 mb-6">
          {[
            {
              name: 'CronJobs',
              desc: 'Schedule malicious containers to run periodically. MITRE ATT&CK T1053.003.',
              level: 'High',
            },
            {
              name: 'hostPath volumes',
              desc: 'Mount host filesystem into pod for persistent access to node.',
              level: 'Critical',
            },
            {
              name: 'Mutating Webhooks',
              desc: 'Inject malicious sidecars into new pods automatically.',
              level: 'High',
            },
            {
              name: 'RBAC manipulation',
              desc: 'Create backdoor ServiceAccounts or Roles with elevated permissions.',
              level: 'High',
            },
            {
              name: 'Malicious container images',
              desc: 'Replace images in registries or use typosquatting.',
              level: 'Medium',
            },
            {
              name: 'Static pods',
              desc: 'Place pod manifest on node for automatic execution, survives reboots.',
              level: 'High',
            },
            {
              name: 'DaemonSets',
              desc: 'Ensure malicious pod runs on every node.',
              level: 'High',
            },
            {
              name: 'ConfigMap/Secret tampering',
              desc: 'Modify application configuration to introduce backdoors.',
              level: 'Medium',
            },
          ].map((technique, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span
                className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
                style={{
                  backgroundColor: technique.level === 'Critical' ? 'rgba(232, 122, 93, 0.15)' : 'rgba(179, 134, 0, 0.1)',
                  color: technique.level === 'Critical' ? 'var(--accent-coral)' : 'var(--warning)',
                }}
              >
                {technique.level}
              </span>
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{technique.name}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{technique.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Detection Strategies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            'Audit logs for RBAC changes and new CronJobs',
            'Falco rules for suspicious pod creation patterns',
            'Image integrity monitoring',
            'Drift detection with Kubescape',
            'Unexpected webhook configurations',
            'Node filesystem integrity monitoring',
          ].map((strategy, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              {strategy}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 4.4: Denial of Service ─── */}
      <section id="dos">
        <SectionHeader number="4.4" title="Denial of Service" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Denial of Service (DoS) attacks aim to disrupt service availability. In Kubernetes, DoS can
          target any component from the API Server down to individual pods.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          DoS Attack Vectors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              name: 'Resource Exhaustion',
              desc: 'Pods without limits consume all CPU/memory. Resource limits are security controls, not optional.',
            },
            {
              name: 'etcd Flooding',
              desc: 'Excessive write operations fill etcd storage. Each object revision is stored.',
            },
            {
              name: 'API Server Overload',
              desc: 'Too many requests, large LIST operations. Use Priority and Fairness (APF).',
            },
            {
              name: 'IP Exhaustion',
              desc: 'Creating too many Services of type LoadBalancer/NodePort.',
            },
            {
              name: 'Disk Pressure',
              desc: 'Excessive logging, large images, emptyDir without size limits.',
            },
            {
              name: 'Connection Exhaustion',
              desc: 'SYN floods targeting Services.',
            },
          ].map((vector, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--accent-coral)' }}>{vector.name}</h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{vector.desc}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Mitigations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            { name: 'ResourceQuota', desc: 'Limit resources per namespace' },
            { name: 'LimitRange', desc: 'Set default request/limit values' },
            { name: 'PriorityClass', desc: 'Ensure critical pods get scheduled' },
            { name: 'etcd monitoring', desc: 'Monitor and alert on database size' },
            { name: 'API Priority & Fairness', desc: 'Protect API Server from overload' },
            { name: 'Network Policies', desc: 'Restrict unnecessary traffic' },
          ].map((mit, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-sage)' }}>{mit.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{mit.desc}</div>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`# Protect namespace from resource exhaustion
apiVersion: v1
kind: ResourceQuota
metadata:
  name: namespace-protection
  namespace: tenant-a
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
    services: "10"
    persistentvolumeclaims: "10"
---
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: tenant-a
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "100m"
      memory: "128Mi"
    type: Container`}
          language="yaml"
          filename="resource-protection.yaml"
        />

        <Callout variant="exam">
          Resource limits are <strong>security controls</strong>, not just performance tuning.
          ResourceQuota limits resources per namespace. LimitRange sets defaults. etcd can reach
          capacity and cause cluster downtime — monitor and set object quotas.
        </Callout>
      </section>

      {/* ─── Section 4.5: Container Escape ─── */}
      <section id="container-escape">
        <SectionHeader number="4.5" title="Malicious Code Execution & Container Escape" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Container escapes fall into three main categories: exploiting vulnerabilities, using
          privileged containers, and leveraging misconfigurations. Container escape is one of the
          most tested topics on the KCSA exam.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Container Escape Techniques
        </h3>

        <ComparisonTable columns={escapeVectorsColumns} rows={escapeVectorsRows} />

        <ExamTrap title="⚠️ Privileged + hostPID = Instant Root Escape">
          <strong>Privileged container + hostPID = instant root escape (most dangerous combo).</strong> A privileged container has root access to all host devices, and hostPID allows it to see all host processes. With <code>nsenter</code>, the attacker can enter all host namespaces and gain full host root access instantly. PSS Restricted blocks both of these vectors entirely.
        </ExamTrap>

        <Callout variant="warning">
          <strong>privileged + hostPID is the MOST dangerous combination</strong> — it effectively
          gives root on the host. With nsenter, the attacker can enter all host namespaces:
          <code>nsenter --target 1 --mount --uts --ipc --net --pid -- bash</code>
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Notable Container Escape CVEs
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { cve: 'CVE-2019-5736', desc: 'runc binary overwrite', year: '2019' },
            { cve: 'CVE-2016-5195', desc: 'Dirty COW', year: '2016' },
            { cve: 'CVE-2022-0847', desc: 'Dirty Pipe', year: '2022' },
            { cve: 'CVE-2024-21626', desc: 'Leaky Vessels', year: '2024' },
          ].map((c) => (
            <div
              key={c.cve}
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-coral)' }}>{c.cve}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-primary)' }}>{c.desc}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{c.year}</div>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Mitigations
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { name: 'PSS Restricted', desc: 'Blocks most escape vectors' },
            { name: 'seccomp', desc: 'Filters dangerous syscalls' },
            { name: 'AppArmor/SELinux', desc: 'Mandatory access controls' },
            { name: 'readOnlyRootFilesystem', desc: 'Prevents filesystem modification' },
            { name: 'Minimal images', desc: 'Reduce attack surface' },
            { name: 'Runtime detection', desc: 'Falco, Tetragon monitoring' },
            { name: 'Regular patching', desc: 'Keep kernel and runtime updated' },
            { name: 'gVisor/Kata', desc: 'Sandboxed runtimes for untrusted' },
          ].map((mit, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-sage)' }}>{mit.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{mit.desc}</div>
            </div>
          ))}
        </div>

        <Callout variant="exam">
          Container escape is one of the most tested topics. Know these 8 escape vectors and their
          mitigations. <strong>Privileged + hostPID = host root.</strong> PSS Restricted prevents all
          of these vectors. Dirty Pipe (CVE-2022-0847) and Dirty COW are the most famous kernel-level
          container escape CVEs.
        </Callout>
      </section>

      {/* ─── Section 4.6: Lateral Movement ─── */}
      <section id="lateral-movement">
        <SectionHeader number="4.6" title="Attacker on the Network — Lateral Movement" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          By default, all pods in a cluster can communicate with each other (flat network). An attacker
          who compromises one pod can potentially reach any other pod. This is the #1 enabler of lateral
          movement in Kubernetes.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Attack Paths
        </h3>

        <ComparisonTable columns={lateralPathsColumns} rows={lateralPathsRows} />

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Mitigations
        </h3>

        <MemoryHook title="🧠 NetworkPolicy + TLS = Defense in Depth">
          <p><strong>NetworkPolicy segments who can talk to whom. TLS encrypts what they say.</strong></p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>NetworkPolicy alone doesn't encrypt traffic — it only controls pod-to-pod connectivity. Combine with service mesh mTLS or pod-level TLS for true defense in depth. The exam loves testing whether you know NetworkPolicy only controls traffic, not external threats or encryption.</p>
        </MemoryHook>

        <div className="space-y-3 mb-6">
          {[
            {
              name: 'Network Policies (default-deny)',
              desc: 'The most important control. Start with deny-all, then explicitly allow required traffic.',
              critical: true,
            },,
            {
              name: 'Namespace isolation',
              desc: 'Segment workloads by team/application with namespace boundaries.',
              critical: false,
            },
            {
              name: 'Service mesh mTLS',
              desc: 'Authenticate and encrypt service-to-service communication (Istio, Linkerd).',
              critical: false,
            },
            {
              name: 'Restricted SA tokens',
              desc: 'Use short-lived, audience-scoped projected ServiceAccount tokens.',
              critical: false,
            },
            {
              name: 'IMDSv2 / metadata protection',
              desc: 'Block cloud metadata access (169.254.169.254) from pods.',
              critical: true,
            },
            {
              name: 'Pod Security Standards',
              desc: 'Restrict pod capabilities that enable lateral movement.',
              critical: false,
            },
          ].map((mit, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: mit!.critical ? 'rgba(4, 80, 54, 0.04)' : 'var(--surface-base)',
                border: `1px solid ${mit!.critical ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
              >
                {idx + 1}
              </span>
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{mit!.name}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{mit!.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <ExamTrap title="⚠️ NetworkPolicy is NOT a Firewall">
          <strong>NetworkPolicy is NOT a firewall — it only controls pod-to-pod, not external traffic.</strong> It operates at Layer 3/4 (IP/port) within the cluster and has no concept of Layer 7 (HTTP paths), no NAT, no stateful inspection, and no egress filtering to external endpoints by default. For external traffic control, you need cloud security groups, NAT gateways, or service mesh egress gateways.
        </ExamTrap>

        <Callout variant="exam">
          A zero-trust Kubernetes posture starts with <strong>default-deny NetworkPolicies</strong>,
          then explicitly allows only required traffic. The flat network is the #1 enabler of lateral
          movement. Service mesh mTLS adds defense-in-depth but NetworkPolicy is the foundational
          control.
        </Callout>
      </section>

      {/* ─── Section 4.7: Privilege Escalation ─── */}
      <section id="privilege-escalation">
        <SectionHeader number="4.7" title="Privilege Escalation & RBAC Abuse" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Privilege escalation in Kubernetes involves gaining unauthorized capabilities beyond what was
          originally granted. RBAC misconfigurations are the most common source.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          RBAC Abuse Vectors
        </h3>

        <div className="space-y-3 mb-6">
          {[
            {
              name: 'bind verb',
              desc: 'User with bind permission can bind any Role/ClusterRole to themselves — including cluster-admin.',
              risk: 'Critical',
            },
            {
              name: 'escalate verb',
              desc: 'User with escalate can create/modify roles to grant more permissions than they have.',
              risk: 'Critical',
            },
            {
              name: 'impersonate verb',
              desc: 'Act as another user/group to bypass RBAC checks entirely.',
              risk: 'High',
            },
            {
              name: 'Wildcard rules (*)',
              desc: 'Rules with * on resources/verbs grant excessive permissions including future CRDs.',
              risk: 'High',
            },
            {
              name: 'Cluster-admin binding',
              desc: 'Binding cluster-admin to regular users or service accounts.',
              risk: 'Critical',
            },
            {
              name: 'ServiceAccount token theft',
              desc: 'Steal and use a privileged ServiceAccount token from a compromised pod.',
              risk: 'High',
            },
          ].map((vector, idx) => (
            <div
              key={idx}
              className="px-4 py-3 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{vector.name}</h4>
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: vector.risk === 'Critical' ? 'rgba(232, 122, 93, 0.15)' : 'rgba(179, 134, 0, 0.1)',
                    color: vector.risk === 'Critical' ? 'var(--accent-coral)' : 'var(--warning)',
                  }}
                >
                  {vector.risk}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{vector.desc}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Additional Escalation Paths
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            { name: 'PersistentVolume creation', desc: 'hostPath volume access to host filesystem' },
            { name: 'nodes/proxy subresource', desc: 'Kubelet API access — bypasses audit and admission' },
            { name: 'serviceaccounts/token create', desc: 'Issue tokens for existing ServiceAccounts' },
            { name: 'Webhook configuration control', desc: 'Inject arbitrary mutating webhooks' },
            { name: 'Namespace modification', desc: 'Change Pod Security Admission labels' },
            { name: 'Pod creation', desc: 'Create privileged pods to escape to host' },
          ].map((path, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-coral)' }}>{path.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{path.desc}</div>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Checking Permissions
        </h3>

        <CodeBlock
          code={`# Check if a user can perform an action
kubectl auth can-i create pods --as=alice@company.com -n production

# List all permissions for a user
kubectl auth can-i --list --as=alice@company.com -n production

# Check who can perform a specific action
kubectl who-can create secrets --all-namespaces

# Review RBAC bindings
kubectl get rolebindings,clusterrolebindings --all-namespaces \\
  -o custom-columns='KIND:kind,NAMESPACE:metadata.namespace,NAME:metadata.name,SUBJECT:subjects[*].name'`}
          language="bash"
          filename="rbac-audit.sh"
        />

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Best Practices
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            'Grant minimum necessary permissions (least privilege)',
            'Regular RBAC audits with kubectl auth can-i --list',
            'Avoid wildcard verbs — explicitly list required verbs',
            'Use break-glass procedures for elevated access',
            'Audit log all RBAC changes',
            'Tools: kubectl-who-can, rbac-lookup, Kubescape RBAC visualizer',
          ].map((practice, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span style={{ color: 'var(--accent-sage)' }}>✓</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{practice}</span>
            </div>
          ))}
        </div>

        <Callout variant="exam">
          The three dangerous verbs are <strong>bind</strong>, <strong>escalate</strong>, and{' '}
          <strong>impersonate</strong>. Access to <code>nodes/proxy</code> is NOT read-only — it
          allows command execution on every pod on the node, bypassing audit logging and admission
          control. The ability to create pods is effectively cluster-admin if combined with privileged
          or hostPath access.
        </Callout>
      </section>

      {/* ─── Section 4.8: MITRE ATT&CK for Containers ─── */}
      <section id="mitre">
        <SectionHeader number="4.8" title="MITRE ATT&CK for Containers" color="#9a6700" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          MITRE ATT&CK for Containers maps real-world adversary techniques to container environments.
          The matrix covers 9 tactics relevant to Kubernetes, from initial access to impact.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          The 9 Tactics of the Containers Matrix
        </h3>

        <ComparisonTable columns={mitreTacticsColumns} rows={mitreTacticsRows} />

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Key MITRE Techniques for Kubernetes
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { id: 'T1610', name: 'Deploy Container', tactics: 'Execution, Defense Evasion' },
            { id: 'T1611', name: 'Escape to Host', tactics: 'Privilege Escalation' },
            { id: 'T1053.003', name: 'CronJob', tactics: 'Persistence, Execution' },
            { id: 'T1552.007', name: 'Container API', tactics: 'Credential Access' },
            { id: 'T1040', name: 'Network Sniffing', tactics: 'Credential Access, Discovery' },
            { id: 'T1550', name: 'Use Alt. Auth Material', tactics: 'Lateral Movement' },
            { id: 'T1496', name: 'Resource Hijacking', tactics: 'Impact' },
            { id: 'T1083', name: 'File Discovery', tactics: 'Discovery' },
          ].map((technique) => (
            <div
              key={technique.id}
              className="p-3 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{technique.id}</div>
              <div className="text-xs mt-0.5 font-medium" style={{ color: 'var(--text-primary)' }}>{technique.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{technique.tactics}</div>
            </div>
          ))}
        </div>

        <Callout variant="info">
          <strong>T1611 (Escape to Host)</strong> is categorized under Privilege Escalation, NOT
          Lateral Movement. Microsoft maintains the threat matrix at{' '}
          <strong>aka.ms/KubernetesThreatMatrix</strong>. The 9 tactics cover the full attack lifecycle
          from initial access through impact.
        </Callout>
      </section>

      {/* ─── Quiz Section ─── */}
      <section id="quiz" className="mt-16 mb-8">
        <div
          className="text-center mb-8"
        >
          <h2
            className="text-2xl font-normal mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Chapter Quiz
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Test your knowledge with {quizQuestions.length} questions
          </p>
          {progress.quizCompleted && (
            <p className="text-sm mt-2" style={{ color: 'var(--accent-primary)' }}>
              Previous score: {progress.quizScore}/{quizQuestions.length}
            </p>
          )}
        </div>

        <Quiz
          questions={quizQuestions}
          domainId={DOMAIN_ID}
          onComplete={handleQuizComplete}
        />
      </section>

      {/* ─── Footer Navigation ─── */}
      <div
        className="flex items-center justify-between mt-12 pt-6"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <Link
          to="/domain3"
          className="flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronRight size={14} className="rotate-180" />
          Previous: Domain 3
        </Link>
        <Link
          to="/domain5"
          className="flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: 'var(--accent-primary)' }}
        >
          Next: Domain 5
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
