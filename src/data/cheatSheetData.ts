export interface PortEntry {
  component: string;
  port: string;
  protocol: string;
  notes: string;
  danger?: boolean;
}

export interface PSSComparison {
  restriction: string;
  baseline: string;
  restricted: string;
  highlight?: 'baseline' | 'restricted' | 'both';
}

export interface RBACVerb {
  verb: string;
  description: string;
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface KubectlCommand {
  command: string;
  purpose: string;
}

export interface ExamTip {
  number: number;
  title: string;
  detail: string;
}

export const portsData: PortEntry[] = [
  { component: 'API Server', port: '6443', protocol: 'HTTPS', notes: 'Central management point. Only component that talks to etcd.' },
  { component: 'etcd client', port: '2379', protocol: 'gRPC/TLS', notes: 'Client API, accessed by API Server only.' },
  { component: 'etcd peer', port: '2380', protocol: 'gRPC/TLS', notes: 'Peer/Raft communication between etcd members.' },
  { component: 'Kubelet', port: '10250', protocol: 'HTTPS', notes: 'Read/write endpoint. Must use Webhook auth.' },
  { component: 'Kubelet healthz', port: '10248', protocol: 'HTTP', notes: 'Health check endpoint.' },
  { component: 'Kubelet read-only', port: '10255', protocol: 'HTTP', notes: 'Must be disabled (set to 0).', danger: true },
  { component: 'Controller Manager', port: '10257', protocol: 'HTTPS', notes: 'Previously 10252 (HTTP).' },
  { component: 'Scheduler', port: '10259', protocol: 'HTTPS', notes: 'Previously 10251 (HTTP).' },
  { component: 'Kube-proxy metrics', port: '10249', protocol: 'HTTP', notes: 'Metrics endpoint.' },
];

export const pssComparisonData: PSSComparison[] = [
  { restriction: 'hostPID / hostIPC / hostNetwork', baseline: 'Forbidden', restricted: 'Forbidden', highlight: 'both' },
  { restriction: 'Privileged containers', baseline: 'Forbidden', restricted: 'Forbidden', highlight: 'both' },
  { restriction: 'Capabilities', baseline: 'Drop all except 13 allowed', restricted: 'Drop ALL, only NET_BIND_SERVICE addable', highlight: 'restricted' },
  { restriction: 'runAsNonRoot', baseline: 'Not required', restricted: 'Required', highlight: 'restricted' },
  { restriction: 'seccompProfile', baseline: 'Not Unconfined', restricted: 'RuntimeDefault or Localhost', highlight: 'restricted' },
  { restriction: 'Volume types', baseline: 'No hostPath', restricted: 'Only 8 types allowed', highlight: 'restricted' },
  { restriction: 'allowPrivilegeEscalation', baseline: 'Not restricted', restricted: 'Must be false', highlight: 'restricted' },
  { restriction: 'readOnlyRootFilesystem', baseline: 'Not required', restricted: 'Required', highlight: 'restricted' },
];

export const pssAllowedCapabilities = 'AUDIT_WRITE, CHOWN, DAC_OVERRIDE, FOWNER, FSETID, KILL, MKNOD, NET_BIND_SERVICE, SETFCAP, SETPCAP, SYS_CHROOT, SETGID, SETUID';

export const pssAllowedVolumes = 'configMap, downwardAPI, emptyDir, projected, secret, persistentVolumeClaim, ephemeral, csi';

export const psaLabels = `pod-security.kubernetes.io/enforce: restricted
pod-security.kubernetes.io/enforce-version: latest
pod-security.kubernetes.io/warn: restricted
pod-security.kubernetes.io/audit: restricted`;

export const rbacVerbsData: RBACVerb[] = [
  { verb: 'get', description: 'Read a specific resource', dangerLevel: 'Low' },
  { verb: 'list', description: 'Read all resources of a type', dangerLevel: 'Low' },
  { verb: 'watch', description: 'Stream resource changes', dangerLevel: 'Low' },
  { verb: 'create', description: 'Create new resources', dangerLevel: 'Medium' },
  { verb: 'update', description: 'Full resource replace', dangerLevel: 'Medium' },
  { verb: 'patch', description: 'Partial resource update', dangerLevel: 'Medium' },
  { verb: 'delete', description: 'Delete a specific resource', dangerLevel: 'High' },
  { verb: 'deletecollection', description: 'Delete a collection of resources', dangerLevel: 'High' },
  { verb: 'impersonate', description: 'Act as another user or group', dangerLevel: 'Critical' },
  { verb: 'bind', description: 'Bind any role to yourself', dangerLevel: 'Critical' },
  { verb: 'escalate', description: 'Grant more permissions than you have', dangerLevel: 'Critical' },
];

export const rbacBindingRules = [
  { from: 'RoleBinding', to: 'Role', scope: 'Namespace-scoped' },
  { from: 'RoleBinding', to: 'ClusterRole', scope: 'Namespace-scoped (reuses template)' },
  { from: 'ClusterRoleBinding', to: 'ClusterRole', scope: 'Cluster-wide' },
];

export const encryptionChain = [
  { provider: 'identity', description: 'NO encryption (pass-through)' },
  { provider: 'aescbc', description: 'Older CBC mode' },
  { provider: 'aesgcm', description: 'Authenticated encryption' },
  { provider: 'secretbox', description: 'XSalsa20 + Poly1305' },
  { provider: 'kms v1', description: 'External key management' },
  { provider: 'kms v2', description: 'RECOMMENDED - best performance & security' },
];

export const networkPolicyFacts = [
  'Default: allow ALL traffic (no isolation)',
  'First policy on a pod = isolation for that direction',
  'Selectors: podSelector, namespaceSelector, ipBlock',
  'Policies are additive (OR logic)',
  'Native NetworkPolicy is L3/L4 only (NOT L7)',
];

export const networkPolicyDefaults = `\u0023 Deny all ingress
spec:
  podSelector: {}
  policyTypes: [Ingress]

\u0023 Deny all egress
spec:
  podSelector: {}
  policyTypes: [Egress]

\u0023 Deny all (both directions)
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]`;

export const kubectlCommands: KubectlCommand[] = [
  { command: 'kubectl auth can-i create pods', purpose: 'Check if you can create pods' },
  { command: 'kubectl auth can-i --list', purpose: 'List all your permissions' },
  { command: 'kubectl get pods -o yaml', purpose: 'Get pod in YAML format' },
  { command: 'kubectl describe pod <name>', purpose: 'Detailed pod information' },
  { command: 'kubectl logs <pod>', purpose: 'View pod logs' },
  { command: 'kubectl exec -it <pod> -- /bin/sh', purpose: 'Execute into container' },
  { command: 'kubectl get netpol --all-namespaces', purpose: 'List all NetworkPolicies' },
  { command: 'kubectl get roles,rolebindings -n <ns>', purpose: 'List RBAC in namespace' },
  { command: 'kubectl api-resources', purpose: 'List all API resources' },
  { command: 'kubectl version -o yaml', purpose: 'Cluster version info' },
];

export const kubeBenchCommand = `# Run kube-bench as a Job
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml

# View results
kubectl logs job/kube-bench`;

export const falcoCommand = `# Install via Helm
helm install falco falcosecurity/falco

# View alerts
kubectl logs -l app.kubernetes.io/name=falco`;

export const authMethods = [
  { method: 'OIDC', description: 'Recommended for users', secure: true },
  { method: 'X.509 Client Certificates', description: 'Good for admins', secure: true },
  { method: 'Webhook Token', description: 'External auth systems', secure: true },
  { method: 'ServiceAccount Tokens', description: 'For pods (bound tokens preferred)', secure: true },
  { method: 'Anonymous', description: 'Must be disabled', secure: false },
];

export const authorizationModes = [
  { mode: 'RBAC', use: 'Primary method — always enabled' },
  { mode: 'Node', use: 'Kubelet access — always enabled' },
  { mode: 'ABAC', use: 'Legacy — not recommended' },
  { mode: 'Webhook', use: 'External authorization — advanced' },
];

export const runtimeSecurity = [
  { feature: 'seccomp', description: 'Filters syscalls' },
  { feature: 'AppArmor', description: 'MAC profiles for containers' },
  { feature: 'SELinux', description: 'Label-based MAC' },
  { feature: 'Capabilities', description: 'Fine-grained Linux privileges' },
];

export const examTipsData: ExamTip[] = [
  { number: 1, title: 'API Server = 6443', detail: 'etcd = 2379/2380, Kubelet = 10250. These are the most important ports.' },
  { number: 2, title: 'Default NetworkPolicy = allow ALL', detail: 'No isolation by default. First policy on a pod isolates that direction.' },
  { number: 3, title: 'Restricted PSS drops ALL capabilities', detail: 'Only NET_BIND_SERVICE can be added. Baseline allows 13 capabilities.' },
  { number: 4, title: 'KMS v2 is the recommended encryption provider', detail: 'Chain: identity -> aescbc -> aesgcm -> secretbox -> kms v1 -> kms v2' },
  { number: 5, title: 'RBAC has 11 verbs', detail: 'Know that bind, escalate, and impersonate are dangerous critical-risk verbs.' },
  { number: 6, title: 'SLSA Level 4 = two-person review + reproducible builds', detail: 'Level 1: Provenance. Level 2: Signed provenance. Level 3: Hermetic builds.' },
  { number: 7, title: 'PSA replaced PSP', detail: 'Configured via namespace labels. PSP was removed in Kubernetes 1.25.' },
  { number: 8, title: '--anonymous-auth=false', detail: 'Required on both API Server and Kubelet to prevent unauthenticated access.' },
  { number: 9, title: 'NodeRestriction admission plugin', detail: 'Limits Kubelet scope to only its own node\'s pods. Critical for multi-node security.' },
  { number: 10, title: 'STRIDE: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation', detail: 'Microsoft\'s threat classification model for systematic threat analysis.' },
  { number: 11, title: 'Default ServiceAccount has NO permissions', detail: 'Must be explicitly bound via RoleBinding/ClusterRoleBinding to gain any access.' },
  { number: 12, title: 'NetworkPolicy is NOT a firewall', detail: 'Only L3/L4 filtering. Policies use additive OR logic — multiple policies widen access.' },
  { number: 13, title: 'Pod Security Admission = namespace labels', detail: 'Not admission webhook configuration. Set pod-security.kubernetes.io/enforce on namespaces.' },
  { number: 14, title: 'Image digest > image tag', detail: 'Tags are mutable, digests are immutable SHA256 hashes. Use digest for supply chain integrity.' },
  { number: 15, title: 'ResourceQuota limits total namespace resources', detail: 'LimitRanger limits per-pod/per-container defaults and maxima. Different scopes!' },
];

export const timeManagementTips = [
  '90 minutes, ~60 questions = 1.5 min per question',
  'Flag uncertain questions, return later',
  'Eliminate obviously wrong answers first',
  'Read carefully: "which is NOT" vs "which IS"',
];

export const auditPolicyTemplate = `apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log all requests at the Metadata level
  - level: Metadata
    resources:
      - group: ''
        resources: ['pods', 'services']
    omitStages:
      - RequestReceived
  # Log secret changes at RequestResponse level
  - level: RequestResponse
    resources:
      - group: ''
        resources: ['secrets']
    omitStages:
      - RequestReceived
  # Log auth-related at Request level
  - level: Request
    resources:
      - group: 'rbac.authorization.k8s.io'
        resources: ['roles', 'rolebindings']
  # Default: don't log high-volume resources
  - level: None
    resources:
      - group: ''
        resources: ['configmaps', 'endpoints']`;

export const mitreK8sTechniques = [
  { technique: 'T1611', name: 'Escape to Host', tactic: 'Privilege Escalation', k8sExample: 'Privileged container + hostPID' },
  { technique: 'T1610', name: 'Deploy Container', tactic: 'Execution', k8sExample: 'Malicious image in registry' },
  { technique: 'T1552.007', name: 'Kubernetes API Credentials', tactic: 'Credential Access', k8sExample: 'Stolen SA token from pod' },
  { technique: 'T1053.003', name: 'Scheduled Task/Job', tactic: 'Persistence', k8sExample: 'Malicious CronJob' },
  { technique: 'T1098.005', name: 'Cloud Account Manipulation', tactic: 'Persistence', k8sExample: 'Compromised cloud IAM role' },
];

export const slsaQuickRef = `Level | Requirement | Exam Keyword
1     | Provenance exists | "documented"
2     | Signed + hosted build | "signed"
3     | Hardened + hermetic | "vault"
4     | Two-person + reproducible | "guards"`;

export const falcoRulesExample = `- rule: Privileged Container Started
  desc: Detect privileged container spawn
  condition: >
    spawned_process and
    container and
    proc.name = "docker-init" and
    (proc.args contains "--privileged" or
     container.privileged = true)
  output: >
    Privileged container started
    user=%user.name command=%proc.cmdline
    container=%container.name
  priority: CRITICAL`;

export const tlsBootstrapSteps = [
  { step: 1, action: 'Create bootstrap token Secret', command: 'kubeadm token create' },
  { step: 2, action: 'Node presents token to API Server', detail: 'Kubelet uses --bootstrap-kubeconfig' },
  { step: 3, action: 'API Server creates CertificateSigningRequest', detail: 'Auto-approval or manual approval' },
  { step: 4, action: 'Node receives signed certificate', detail: 'Stored in /var/lib/kubelet/pki' },
];

export const etcdBackupRestoreCommands = `# Snapshot backup with TLS
etcdctl snapshot save /backup/snapshot.db \\
  --cacert=/etc/etcd/ca.crt \\
  --cert=/etc/etcd/server.crt \\
  --key=/etc/etcd/server.key \\
  --endpoints=https://127.0.0.1:2379

# Snapshot restore
etcdctl snapshot restore /backup/snapshot.db \\
  --data-dir=/var/lib/etcd-new

# WARNING: Stop API Server before restore
# kubectl drain <node> && systemctl stop kube-apiserver`;
