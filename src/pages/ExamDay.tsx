import { useState, useCallback } from 'react';
import {
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Shield,
  Terminal,
  BookOpen,
  ListChecks,
  Lock,
  Network,
} from 'lucide-react';

function useCopyButton() {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const handleCopy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMap((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedMap((prev) => ({ ...prev, [key]: false })), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedMap((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedMap((prev) => ({ ...prev, [key]: false })), 2000);
    }
  }, []);
  return { copiedMap, handleCopy };
}

function CopyBtn({ text, copyKey, onCopy, copied }: { text: string; copyKey: string; onCopy: (t: string, k: string) => void | Promise<void>; copied: boolean }) {
  return (
    <button
      onClick={() => { void onCopy(text, copyKey); }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 print:hidden"
      style={{
        backgroundColor: copied ? 'rgba(10,123,62,0.1)' : 'var(--surface-elevated)',
        color: copied ? 'var(--success)' : 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* ===== DATA ===== */

const portsData = [
  { component: 'Kubernetes API Server', port: '6443', protocol: 'TCP', notes: 'All cluster communication' },
  { component: 'etcd Client API', port: '2379', protocol: 'TCP', notes: 'Read/write to datastore' },
  { component: 'etcd Peer', port: '2380', protocol: 'TCP', notes: 'Raft consensus between etcd nodes' },
  { component: 'Kubelet API', port: '10250', protocol: 'TCP', notes: 'Metrics, exec, logs — MUST be secured' },
  { component: 'Kubelet Read-Only', port: '10255', protocol: 'TCP', notes: 'DEPRECATED — disable immediately', danger: true },
  { component: 'Kube-Scheduler', port: '10259', protocol: 'TCP', notes: 'Secure, authn required' },
  { component: 'Kube-Controller', port: '10257', protocol: 'TCP', notes: 'Secure, authn required' },
  { component: 'kube-proxy', port: '10249', protocol: 'TCP', notes: 'Metrics / healthz' },
  { component: 'CoreDNS', port: '53', protocol: 'UDP/TCP', notes: 'Cluster DNS resolution' },
  { component: 'NodePort Range', port: '30000-32767', protocol: 'TCP/UDP', notes: 'External service exposure' },
  { component: 'Container Port', port: 'any', protocol: 'TCP/UDP', notes: 'Defined in Pod spec' },
  { component: 'Service Port', port: 'any', protocol: 'TCP/UDP', notes: 'Virtual IP targetPort → containerPort' },
];

const oneLinerFacts = [
  'etcd stores Secrets in plaintext without encryption at rest — always configure EncryptionConfiguration.',
  'NetworkPolicy default = allow ALL traffic (ingress + egress).',
  'Privileged + hostPID = instant root escape to the host.',
  'RBAC verbs: get, list, watch, create, update, patch, delete, deletecollection, impersonate, bind, escalate.',
  'PSS levels: Privileged (open) → Baseline (some limits) → Restricted (lockdown).',
  'PSA (Pod Security Admission) is built-in; replaced PodSecurityPolicy (PSP) in v1.25.',
  'Secrets are base64-encoded, NOT encrypted, in etcd by default.',
  'ServiceAccount token is mounted into every Pod at /var/run/secrets/kubernetes.io/serviceaccount.',
  'Never use hostNetwork unless absolutely necessary — breaks NetworkPolicy isolation.',
  'Admission Controllers intercept requests after authn/authz, before object persistence.',
  'Mutating webhooks run BEFORE validating webhooks.',
  'ResourceQuota limits total resources per namespace; LimitRange sets per-Pod/container defaults.',
  'kube-bench runs CIS Benchmark checks against nodes and control plane.',
  'Falco monitors syscalls for runtime threat detection.',
  'OPA Gatekeeper and Kyverno are policy-as-code admission controllers.',
  'AppArmor and seccomp reduce the kernel attack surface per container.',
  'readOnlyRootFilesystem prevents container filesystem modification at runtime.',
  'runAsNonRoot: true rejects containers running as UID 0.',
  'allowPrivilegeEscalation: false blocks setuid binaries from gaining more privileges.',
  'drop: ["ALL"] in securityContext.capabilities removes all Linux capabilities.',
  'Kubernetes API server is the only component that talks to etcd directly.',
  'etcd should run on dedicated nodes with TLS peer/client encryption.',
  'Kubelet authentication uses X509 client certs or token-based auth.',
  'Anonymous auth on kubelet (–anonymous-auth=true) is a critical security risk.',
  'CertificateSigningRequest (CSR) objects allow nodes/users to request certs.',
  'ClusterRoles are cluster-scoped; Roles are namespace-scoped.',
  'RoleBinding binds a Role/ClusterRole to subjects in ONE namespace.',
  'ClusterRoleBinding binds a ClusterRole to subjects cluster-wide.',
  'ClusterRole can be bound with RoleBinding to limit scope to a namespace.',
  'ServiceAccount tokens are JWTs; bound tokens (v1.24+) are tied to a specific Pod.',
  'TokenRequest API generates short-lived, audience-bound service account tokens.',
  'ABAC is deprecated; use RBAC exclusively.',
  'Node authorization mode + NodeRestriction admission limits kubelet permissions.',
  'imagePullPolicy: Always ensures freshest image but increases registry load.',
  'imagePullPolicy: IfNotPresent pulls only if not cached locally.',
  'imagePullPolicy: Never never pulls — only for local/dev images.',
  'Image signing (Cosign, Notary) verifies image provenance before deployment.',
  'SLSA levels define supply chain artifact integrity maturity.',
  'CVE scanning happens at build time (Trivy, Clair, Grype) and runtime (Falco).',
  'NetworkPolicy applies only to pods WITH matching labels in the same namespace.',
  'Egress rules are rarely used in exams but critical for data exfiltration prevention.',
  'Calico and Cilium implement NetworkPolicy and provide additional features.',
  'DNS policies (ClusterFirst, Default, ClusterFirstWithHostNet, None) control Pod DNS.',
  'Audit logs capture who did what, when, where — configure via AuditPolicy.',
  'Log retention is NOT handled by Kubernetes — use external SIEM (Splunk, ELK).',
  'Static pods (manifests in /etc/kubernetes/manifests) are managed by kubelet, NOT the API server.',
  'Ephemeral containers debug running pods without restarting them.',
  'PodDisruptionBudget (PDB) ensures minimum availability during voluntary disruptions.',
  'Taints and tolerations repel pods from nodes; nodeAffinity attracts them.',
  'PodTopologySpread ensures pods are distributed across failure domains.',
  'ConfigMap stores non-sensitive config; Secrets store sensitive data.',
  'Immutable Secrets (immutable: true) prevent accidental updates and improve performance.',
  'A ValidatingAdmissionWebhook can reject a Deployment; a Mutating one can inject a sidecar.',
  'Least privilege: grant ONLY the RBAC verbs needed for the specific resource.',
];

const examTraps = [
  { question: 'Does a NetworkPolicy with no rules block all traffic?', answer: 'No — an empty spec (no rules) means ALLOW ALL ingress and egress.', trap: 'Assuming default deny' },
  { question: 'Does etcd encrypt Secrets by default?', answer: 'No — Secrets are base64-encoded in etcd. Encryption at rest must be configured with EncryptionConfiguration.', trap: 'Base64 ≠ encryption' },
  { question: 'Does readOnlyRootFilesystem stop an attacker from writing ANYWHERE?', answer: 'No — emptyDir volumes, /tmp (if tmpfs), and writable mounted volumes are still writable.', trap: 'Forgetting writable volumes' },
  { question: 'Can a Pod with hostNetwork be protected by NetworkPolicy?', answer: 'No — NetworkPolicy does NOT apply to hostNetwork pods.', trap: 'NetworkPolicy bypass' },
  { question: 'Is allowPrivilegeEscalation: false the same as privileged: false?', answer: 'No — privileged: false can still allow setuid escalation unless allowPrivilegeEscalation is also false.', trap: 'Confusing two controls' },
  { question: 'Does a RoleBinding referencing a ClusterRole grant cluster-wide access?', answer: 'No — it grants the ClusterRole\'s permissions only within the RoleBinding\'s namespace.', trap: 'ClusterRole scope confusion' },
  { question: 'Is the default ServiceAccount in a namespace unrestricted by default?', answer: 'No — it has NO permissions by default (RBAC is deny-all by default), but automounting tokens is risky.', trap: 'Default SA assumptions' },
  { question: 'Does Pod Security Admission replace PodSecurityPolicy automatically?', answer: 'No — PSA is enabled via namespace labels; PSP required explicit cluster enablement and was removed in v1.25.', trap: 'Assuming automatic migration' },
  { question: 'Can you patch an immutable Secret after creation?', answer: 'No — immutable Secrets cannot be updated or deleted without recreating the Secret.', trap: 'Immutable means immutable' },
  { question: 'Is kubelet port 10250 safe to expose publicly?', answer: 'No — 10250 exposes exec/logs/metrics. It must be firewalled and use cert-based auth.', trap: 'Exposing kubelet API' },
  { question: 'Does RBAC "create" on pods allow deleting pods?', answer: 'No — "create" and "delete" are separate verbs. You need explicit "delete" permission.', trap: 'Verb conflation' },
  { question: 'Does a PodSecurityPolicy restrict runtime behavior?', answer: 'No — PSP (removed v1.25) was admission-time only. Runtime security needs Falco, seccomp, AppArmor.', trap: 'Admission vs runtime' },
  { question: 'Is an image scan at build time sufficient for runtime security?', answer: 'No — CVEs discovered after deployment need runtime scanning and continuous monitoring.', trap: 'One-time scanning myth' },
  { question: 'Does enabling audit logging prevent security incidents?', answer: 'No — audit logging is detective, not preventive. You also need preventive controls (RBAC, PSP/PSA, etc.).', trap: 'Detective vs preventive' },
  { question: 'Can you use NetworkPolicy to block traffic to the API server?', answer: 'No — NetworkPolicy controls Pod-to-Pod traffic, not control plane component access.', trap: 'Wrong tool for API protection' },
  { question: 'Does "automountServiceAccountToken: false" remove existing mounted tokens?', answer: 'No — it only prevents FUTURE mounts. Existing pods keep their tokens until recreated.', trap: 'Does not retroactively remove' },
  { question: 'Is TLS termination at the ingress enough for end-to-end encryption?', answer: 'No — traffic from ingress to Pod may be unencrypted. Use mTLS (Istio, Linkerd) for full E2E.', trap: 'TLS termination gap' },
  { question: 'Does a ResourceQuota limit the number of Nodes?', answer: 'No — ResourceQuota limits resources per namespace, not cluster node count.', trap: 'ResourceQuota scope' },
  { question: 'Can you grant "escalate" verb safely to developers?', answer: 'No — "escalate" allows modifying roles to grant more permissions = privilege escalation.', trap: 'Escalate verb danger' },
  { question: 'Does Kyverno replace OPA Gatekeeper?', answer: 'No — they are alternatives. Kyverno is Kubernetes-native YAML; Gatekeeper uses Rego/Rego language.', trap: 'Kyverno vs Gatekeeper confusion' },
];

const yamlSnippets = {
  securePod: `apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  automountServiceAccountToken: false
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: nginx:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL`,

  defaultDeny: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress`,

  allowIngress: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080`,

  rbacRole: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: readonly-pods
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: readonly-pods-binding
subjects:
- kind: ServiceAccount
  name: reader
roleRef:
  kind: Role
  name: readonly-pods
  apiGroup: rbac.authorization.k8s.io`,

  encryptionConfig: `apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
    - secrets
    - configmaps
    providers:
    - aescbc:
        keys:
        - name: key1
          secret: <base64-encoded-32-byte-key>
    - identity: {}`,
};

const frameworkMapping = [
  { framework: 'STRIDE', target: 'Kubernetes Threat Model', mapping: 'Spoofing → impersonation; Tampering → etcd / API; Repudiation → audit logs; Info Disclosure → Secrets / NetPol; DoS → ResourceQuota / Limits; Elevation → RBAC / Privileged Pods' },
  { framework: 'CIS Benchmarks', target: 'kube-bench', mapping: 'CIS controls are implemented via kube-bench scans. Run: kube-bench run --targets=master,node' },
  { framework: 'NIST 800-53', target: 'K8s Controls', mapping: 'AC (Access Control) → RBAC; AU (Audit) → AuditPolicy; CM (Config Mgmt) → GitOps / ConfigMaps; IA (Identification) → X.509 / OIDC' },
  { framework: 'MITRE ATT&CK', target: 'K8s TTPs', mapping: 'Initial Access → Exposed dashboard; Execution → exec into pod; Persistence → backdoor container image; Privilege Escalation → privileged pod; Defense Evasion → clear logs; Credential Access → SA token theft' },
  { framework: 'OWASP Top 10', target: 'Container Security', mapping: 'A01 Broken Access Control → RBAC gaps; A02 Cryptographic Failures → unencrypted etcd; A05 Security Misconfiguration → open kubelet; A07 Auth Failures → weak authN modes' },
  { framework: 'SLSA', target: 'Supply Chain', mapping: 'SLSA levels 1-4 define build provenance. Use signed artifacts (Cosign), reproducible builds, and isolated build environments.' },
  { framework: 'ISO 27001 / SOC 2', target: 'Compliance', mapping: 'Kubernetes provides controls (RBAC, audit, encryption) that map to A.9 (Access), A.12 (Ops), A.13 (Communications) in ISO 27001.' },
];

const slsaLevels = [
  { level: '1', title: 'Basic Provenance', description: 'Build process is scripted/automated. Provenance (who built it, how) exists. No guarantees of integrity.' },
  { level: '2', title: 'Signed Provenance + Build Service', description: 'Builds run on a hosted build service (not developer laptop). Provenance is signed. Consumer can verify origin.' },
  { level: '3', title: 'Hardened Build + Audit', description: 'Build environment is hardened and isolated. Source code is version-controlled and immutable. Reproducible builds preferred. Audit trail exists.' },
  { level: '4', title: 'Hermetic + Reproducible', description: 'Hermetic builds: no network access, no external dependencies at build time. Fully reproducible: same input always yields same output. Two-person review enforced.' },
];

const checklistItems = [
  { item: 'All critical port numbers (6443, 2379, 2380, 10250, 10259, 10257, 53, 30000-32767)', category: 'Ports' },
  { item: 'RBAC 11 verbs by heart', category: 'RBAC' },
  { item: 'PSS 3 levels and what each restricts', category: 'PSS' },
  { item: 'EncryptionConfiguration file structure', category: 'Encryption' },
  { item: 'NetworkPolicy default behavior and default-deny YAML', category: 'Network' },
  { item: 'Difference between Role, ClusterRole, RoleBinding, ClusterRoleBinding', category: 'RBAC' },
  { item: 'Pod Security Admission namespace labels', category: 'PSS' },
  { item: 'Falco vs kube-bench vs Kyverno vs OPA use cases', category: 'Tools' },
  { item: 'STRIDE 6 categories and Kubernetes examples', category: 'Threat Model' },
  { item: 'SLSA 4 levels and what each means', category: 'Supply Chain' },
  { item: 'Authentication methods ordered by security (X.509 > OIDC > webhook > token > basic > anonymous)', category: 'Auth' },
  { item: 'Authorization modes (Node, RBAC, Webhook, ABAC, AlwaysAllow, AlwaysDeny)', category: 'Auth' },
  { item: 'Runtime security controls (seccomp, AppArmor, SELinux, capabilities, readOnlyRootFilesystem)', category: 'Runtime' },
  { item: 'How to restrict kubelet and why anonymous auth must be disabled', category: 'Node' },
  { item: 'Immutable Secrets and why they help', category: 'Secrets' },
  { item: 'ServiceAccount token types (legacy vs bound vs projected)', category: 'Auth' },
  { item: 'Admission controller order: mutating before validating', category: 'Admission' },
  { item: 'Image scanning vs image signing vs runtime detection', category: 'Supply Chain' },
  { item: 'Audit policy levels (None, Metadata, Request, RequestResponse)', category: 'Compliance' },
  { item: 'ResourceQuota vs LimitRange vs PodDisruptionBudget use cases', category: 'Scheduling' },
  { item: 'Common exam traps (NetworkPolicy default allow, empty spec, hostNetwork bypass)', category: 'Traps' },
  { item: 'Difference between detective, preventive, and corrective controls', category: 'Frameworks' },
];

/* ===== COMPONENTS ===== */

function Section({ title, icon: Icon, children, id }: { title: string; icon: React.ElementType; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="mb-8 break-inside-avoid-page">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Icon size={18} style={{ color: 'var(--accent-primary)' }} />
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function CodeBlock({ code, label, copyKey, copiedMap, handleCopy }: { code: string; label: string; copyKey: string; copiedMap: Record<string, boolean>; handleCopy: (t: string, k: string) => void | Promise<void> }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <CopyBtn text={code} copyKey={copyKey} onCopy={handleCopy} copied={copiedMap[copyKey]} />
      </div>
      <pre
        className="text-xs p-3 rounded-lg overflow-x-auto"
        style={{ backgroundColor: 'var(--surface-code)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: '1.5' }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ExamDay() {
  const { copiedMap, handleCopy } = useCopyButton();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = useCallback((idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-[calc(100dvh-60px)] px-4 py-6 md:px-6">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; color: #000 !important; }
          main { padding-left: 0 !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
          pre { background: #f6f8fa !important; border: 1px solid #d0d7de !important; }
          .trap-card { background: #fff8e6 !important; border: 1px solid #f0b429 !important; }
          .fact-row { background: transparent !important; }
          .checklist-item { border: 1px solid #d0d7de !important; }
        }
      `}</style>

      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b flex flex-wrap items-start justify-between gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h1 className="text-3xl md:text-4xl font-normal mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Exam Day Cram
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Last-minute review — ports, facts, traps, YAML, frameworks, and checklist. Print this page and take it with you.
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] no-print"
            style={{
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface-base)',
            }}
          >
            <Printer size={15} /> Print
          </button>
        </div>

        {/* ===== 1. PORT NUMBERS ===== */}
        <Section title="Port Numbers" icon={Network} id="ports">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Component</th>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Port</th>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Proto</th>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {portsData.map((row) => (
                  <tr
                    key={row.component}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: row.danger ? 'rgba(207,34,46,0.05)' : 'transparent',
                    }}
                  >
                    <td className="py-1.5 px-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.component}</td>
                    <td className="py-1.5 px-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: row.danger ? 'var(--danger)' : 'var(--accent-primary)', backgroundColor: row.danger ? 'rgba(207,34,46,0.08)' : 'rgba(9,105,218,0.08)' }}>
                        {row.port}
                      </span>
                      {row.danger && <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: '#fff', backgroundColor: 'var(--danger)' }}>DISABLE</span>}
                    </td>
                    <td className="py-1.5 px-2 font-mono" style={{ color: 'var(--text-secondary)' }}>{row.protocol}</td>
                    <td className="py-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ===== 2. ONE-LINER FACTS ===== */}
        <Section title="One-Liner Facts" icon={BookOpen} id="facts">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            50 must-memorize facts. Read aloud. Bold = likely exam question.
          </p>
          <div className="grid grid-cols-1 gap-1">
            {oneLinerFacts.map((fact, i) => (
              <div
                key={i}
                className="fact-row flex items-start gap-2 px-2 py-1.5 rounded-md text-xs"
                style={{ backgroundColor: i % 2 === 0 ? 'rgba(9,105,218,0.02)' : 'transparent' }}
              >
                <span className="flex-shrink-0 font-mono font-bold text-[10px] w-5 text-center mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  {i + 1}
                </span>
                <span style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  {fact.split(/\b(etcd|Secrets|NetworkPolicy|RBAC|PSS|PSA|ServiceAccount|hostNetwork|hostPID|Privileged|kube-bench|Falco|Kyverno|OPA Gatekeeper|AppArmor|seccomp|readOnlyRootFilesystem|runAsNonRoot|allowPrivilegeEscalation|capabilities| encryption at rest|base64|TLS|audit|immutable|SLSA|CVE|mTLS|ResourceQuota|LimitRange|PodDisruptionBudget|NodeRestriction|ABAC|escalate|impersonate|bind|deletecollection|TokenRequest|imagePullPolicy|Cosign|Notary|ClusterRole|RoleBinding|automountServiceAccountToken|ephemeral|static pods)\b/g).map((part, idx) =>
                    /^(etcd|Secrets|NetworkPolicy|RBAC|PSS|PSA|ServiceAccount|hostNetwork|hostPID|Privileged|kube-bench|Falco|Kyverno|OPA Gatekeeper|AppArmor|seccomp|readOnlyRootFilesystem|runAsNonRoot|allowPrivilegeEscalation|capabilities|encryption at rest|base64|TLS|audit|immutable|SLSA|CVE|mTLS|ResourceQuota|LimitRange|PodDisruptionBudget|NodeRestriction|ABAC|escalate|impersonate|bind|deletecollection|TokenRequest|imagePullPolicy|Cosign|Notary|ClusterRole|RoleBinding|automountServiceAccountToken|ephemeral|static pods)$/.test(part)
                      ? <strong key={idx} style={{ color: 'var(--accent-primary)' }}>{part}</strong>
                      : <span key={idx}>{part}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 3. EXAM TRAPS ===== */}
        <Section title="Common Exam Traps" icon={AlertTriangle} id="traps">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            20 traps that catch even experienced candidates. <strong style={{ color: 'var(--accent-amber)' }}>Read the trap column first.</strong>
          </p>
          <div className="space-y-2">
            {examTraps.map((trap, i) => (
              <div
                key={i}
                className="trap-card p-3 rounded-xl border"
                style={{
                  backgroundColor: 'rgba(154,103,0,0.04)',
                  borderColor: 'rgba(154,103,0,0.2)',
                }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-amber)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold mb-1" style={{ color: 'var(--accent-amber)' }}>
                      TRAP #{i + 1}: {trap.trap}
                    </p>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      Q: {trap.question}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <strong style={{ color: 'var(--success)' }}>A:</strong> {trap.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 4. YAML QUICK REFERENCE ===== */}
        <Section title="YAML Quick Reference" icon={Terminal} id="yaml">
          <CodeBlock code={yamlSnippets.securePod} label="Secure Pod Template" copyKey="pod" copiedMap={copiedMap} handleCopy={handleCopy} />
          <CodeBlock code={yamlSnippets.defaultDeny} label="NetworkPolicy — Default Deny All" copyKey="deny" copiedMap={copiedMap} handleCopy={handleCopy} />
          <CodeBlock code={yamlSnippets.allowIngress} label="NetworkPolicy — Allow from Label" copyKey="allow" copiedMap={copiedMap} handleCopy={handleCopy} />
          <CodeBlock code={yamlSnippets.rbacRole} label="RBAC Role + RoleBinding" copyKey="rbac" copiedMap={copiedMap} handleCopy={handleCopy} />
          <CodeBlock code={yamlSnippets.encryptionConfig} label="EncryptionConfiguration Snippet" copyKey="enc" copiedMap={copiedMap} handleCopy={handleCopy} />
        </Section>

        {/* ===== 5. FRAMEWORK MAPPING ===== */}
        <Section title="Framework Mapping" icon={Shield} id="frameworks">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Framework</th>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>K8s Target</th>
                  <th className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Mapping</th>
                </tr>
              </thead>
              <tbody>
                {frameworkMapping.map((row) => (
                  <tr key={row.framework} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="py-2 px-2 font-semibold" style={{ color: 'var(--accent-primary)' }}>{row.framework}</td>
                    <td className="py-2 px-2 font-medium" style={{ color: 'var(--text-primary)' }}>{row.target}</td>
                    <td className="py-2 px-2" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{row.mapping}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ===== 6. SLSA LEVELS ===== */}
        <Section title="SLSA Supply Chain Levels" icon={Lock} id="slsa">
          <div className="space-y-2">
            {slsaLevels.map((s) => (
              <div
                key={s.level}
                className="flex items-start gap-3 p-3 rounded-xl border"
                style={{
                  backgroundColor: s.level === '4' ? 'rgba(9,105,218,0.04)' : 'var(--surface-elevated)',
                  borderColor: s.level === '4' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: s.level === '4' ? 'var(--accent-primary)' : 'var(--surface-base)',
                    color: s.level === '4' ? '#fff' : 'var(--text-primary)',
                    border: s.level === '4' ? 'none' : '1px solid var(--border-subtle)',
                  }}
                >
                  {s.level}
                </span>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 7. LAST MINUTE CHECKLIST ===== */}
        <Section title="Last Minute Checklist" icon={ListChecks} id="checklist">
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Check each box only when you can recite the answer from memory.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {checklistItems.map((c, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="checklist-item flex items-start gap-2.5 p-2.5 rounded-lg border text-left text-xs transition-all duration-150"
                style={{
                  backgroundColor: checkedItems[i] ? 'rgba(26,127,55,0.06)' : 'var(--surface-elevated)',
                  borderColor: checkedItems[i] ? 'var(--success)' : 'var(--border-subtle)',
                }}
              >
                <span
                  className="flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5"
                  style={{
                    borderColor: checkedItems[i] ? 'var(--success)' : 'var(--border-medium)',
                    backgroundColor: checkedItems[i] ? 'var(--success)' : 'transparent',
                  }}
                >
                  {checkedItems[i] && <Check size={10} color="#fff" />}
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: checkedItems[i] ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {c.category}
                  </span>
                  <p className="mt-0.5" style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    {c.item}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div
            className="mt-4 p-3 rounded-xl border text-center"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {Object.values(checkedItems).filter(Boolean).length} / {checklistItems.length} mastered
            </p>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-base)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(Object.values(checkedItems).filter(Boolean).length / checklistItems.length) * 100}%`,
                  backgroundColor: Object.values(checkedItems).filter(Boolean).length === checklistItems.length ? 'var(--success)' : 'var(--accent-primary)',
                }}
              />
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
          <p>Good luck on your KCSA exam. You have prepared for this. Trust your memory.</p>
          <p className="mt-1">KCSA Exam Prep App — Exam Day Cram Sheet</p>
        </div>
      </div>
    </div>
  );
}
