export interface QuickRecallCard {
  id: number;
  category: string;
  front: string;
  back: string;
  hint?: string;
}

export const quickRecallCards: QuickRecallCard[] = [
  // Ports
  { id: 1, category: 'Ports', front: 'API Server listens on which port?', back: '6443 (HTTPS)', hint: 'Think of 64-bit security + 43 (4+3=7, lucky secure port)' },
  { id: 2, category: 'Ports', front: 'etcd client port?', back: '2379', hint: '2379 = etcd client requests' },
  { id: 3, category: 'Ports', front: 'etcd peer port?', back: '2380', hint: '2380 = etcd peer communication (one more than client)' },
  { id: 4, category: 'Ports', front: 'kubelet healthz port?', back: '10248', hint: '10248 = kubelet health check' },
  { id: 5, category: 'Ports', front: 'kubelet read-only port?', back: '10255 (deprecated, disabled by default)', hint: '10255 = read-only (no auth needed historically)' },
  { id: 6, category: 'Ports', front: 'kubelet HTTPS port?', back: '10250', hint: '10250 = kubelet API (secure)' },
  { id: 7, category: 'Ports', front: 'Scheduler port?', back: '10259 (HTTPS)', hint: '10259 = scheduler (secure)' },
  { id: 8, category: 'Ports', front: 'Controller Manager port?', back: '10257 (HTTPS)', hint: '10257 = controller manager (secure)' },
  { id: 9, category: 'Ports', front: 'NodePort range?', back: '30000–32767', hint: 'Default NodePort service range' },

  // PSS (Pod Security Standards)
  { id: 10, category: 'PSS', front: '3 Pod Security Standards levels?', back: 'Privileged, Baseline, Restricted', hint: 'PBS: Privileged (open), Baseline (moderate), Restricted (locked down)' },
  { id: 11, category: 'PSS', front: 'Which PSS level is the most restrictive?', back: 'Restricted', hint: 'Restricted = maximum security, minimal privileges' },
  { id: 12, category: 'PSS', front: 'Which capability is allowed in Restricted PSS?', back: 'NET_BIND_SERVICE only', hint: 'Drop ALL except NET_BIND_SERVICE (bind to low ports)' },
  { id: 13, category: 'PSS', front: 'What must runAsNonRoot be set to in Restricted?', back: 'true', hint: 'Restricted forbids running as root' },
  { id: 14, category: 'PSS', front: 'Restricted PSS: which seccomp profile required?', back: 'RuntimeDefault or Localhost', hint: 'Cannot use Unconfined in Restricted' },
  { id: 15, category: 'PSS', front: 'Restricted PSS: what are the readOnlyRootFilesystem requirements?', back: 'Must be true (immutable root filesystem)', hint: 'Container root filesystem must be read-only' },
  { id: 16, category: 'PSS', front: 'Restricted PSS: can you use hostNetwork, hostPID, hostIPC?', back: 'No — all forbidden', hint: 'Restricted disallows all host namespace sharing' },
  { id: 17, category: 'PSS', front: 'Baseline PSS: can you run as root?', back: 'Yes — root is allowed in Baseline', hint: 'Baseline is less strict; root + most capabilities allowed' },
  { id: 18, category: 'PSS', front: 'Which Kubernetes version graduated PodSecurity to stable?', back: 'v1.25 (GA, replacing PodSecurityPolicy)', hint: 'PSP deprecated in v1.21, removed in v1.25, replaced by PSS' },

  // RBAC
  { id: 19, category: 'RBAC', front: 'RBAC dangerous verbs?', back: 'BEI: Bind, Escalate, Impersonate', hint: 'B-E-I: Bind (bind roles), Escalate (escalate privileges), Impersonate (act as another user)' },
  { id: 20, category: 'RBAC', front: 'What does the "escalate" verb allow?', back: 'Create/modify roles with more permissions than you have', hint: 'Escalate = privilege escalation via role editing' },
  { id: 21, category: 'RBAC', front: 'What does "bind" verb allow?', back: 'Bind a rolebinding/clusterrolebinding to any role/clusterrole', hint: 'Bind = attach roles to users/groups' },
  { id: 22, category: 'RBAC', front: 'What does "impersonate" verb allow?', back: 'Act as another user, group, or service account', hint: 'Impersonate = make requests as another identity' },
  { id: 23, category: 'RBAC', front: 'Default RBAC policy for anonymous users?', back: 'Default denies all (no permissions)', hint: 'Anonymous = no auth; denied unless explicitly allowed' },
  { id: 24, category: 'RBAC', front: 'How to prevent privilege escalation in roles?', back: 'Set allowPrivilegeEscalation: false in securityContext', hint: 'Container-level setting, not RBAC verb' },
  { id: 25, category: 'RBAC', front: 'Role vs ClusterRole scope?', back: 'Role = namespaced; ClusterRole = cluster-wide', hint: 'RoleBinding binds Role (namespace); ClusterRoleBinding binds ClusterRole (cluster)' },

  // Encryption
  { id: 26, category: 'Encryption', front: 'Recommended encryption provider for Secrets at rest?', back: 'KMS v2', hint: 'KMS v2 > KMS v1 > aescbc > secretbox > identity' },
  { id: 27, category: 'Encryption', front: 'What does KMS v2 provider use for DEK/KEK?', back: 'Per-resource DEK, KEK from external KMS', hint: 'DEK = data encryption key; KEK = key encryption key from external provider' },
  { id: 28, category: 'Encryption', front: 'Where is encryption configuration defined?', back: '--encryption-provider-config flag on API Server', hint: 'API server startup flag pointing to encryption config file' },
  { id: 29, category: 'Encryption', front: 'Which API server flag enables audit logging?', back: '--audit-log-path', hint: '--audit-log-path specifies where to write audit logs' },
  { id: 30, category: 'Encryption', front: 'Best practice when rotating encryption config?', back: 'Write new config, restart API server, re-encrypt all secrets, remove old provider', hint: 'Must re-encrypt all data before removing old provider' },
  { id: 31, category: 'Encryption', front: 'What happens if you remove old provider before re-encrypting?', back: 'You lose access to data encrypted with old provider', hint: 'Old provider must stay until all data is re-encrypted' },

  // NetworkPolicy
  { id: 32, category: 'NetworkPolicy', front: 'Default NetworkPolicy behavior?', back: 'Allow all ingress and egress (no restriction)', hint: 'Without NetworkPolicy = everything is open' },
  { id: 33, category: 'NetworkPolicy', front: 'Which CNI plugins support NetworkPolicy enforcement?', back: 'Calico, Cilium, Weave Net, Antrea, kube-router', hint: 'Not all CNIs enforce policies (e.g., Flannel alone does not)' },
  { id: 34, category: 'NetworkPolicy', front: 'What policyTypes values are valid?', back: 'Ingress, Egress, or both', hint: 'policyTypes: ["Ingress", "Egress"]' },
  { id: 35, category: 'NetworkPolicy', front: 'Does a deny-all NetworkPolicy block external traffic?', back: 'Yes — empty ingress rules = deny all ingress', hint: 'Empty spec.ingress = no allowed ingress sources' },
  { id: 36, category: 'NetworkPolicy', front: 'NetworkPolicy applies at which OSI layer?', back: 'Layer 3/4 (IP and port), NOT Layer 7 (HTTP path)', hint: 'Cannot filter by URL path or HTTP method' },

  // STRIDE
  { id: 37, category: 'STRIDE', front: 'STRIDE acronym?', back: 'Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege', hint: 'S-T-R-I-D-E: 6 threat categories from Microsoft' },
  { id: 38, category: 'STRIDE', front: 'STRIDE: Spoofing means?', back: 'Pretending to be someone/something else', hint: 'Authentication threats — fake identity' },
  { id: 39, category: 'STRIDE', front: 'STRIDE: Tampering means?', back: 'Modifying data or code maliciously', hint: 'Integrity threats — unauthorized changes' },
  { id: 40, category: 'STRIDE', front: 'STRIDE: Repudiation means?', back: 'Denying an action took place', hint: 'Non-repudiation threats — no audit trail' },
  { id: 41, category: 'STRIDE', front: 'STRIDE: Information Disclosure means?', back: 'Exposing information to unauthorized parties', hint: 'Confidentiality threats — data leaks' },
  { id: 42, category: 'STRIDE', front: 'STRIDE: Denial of Service means?', back: 'Making a service unavailable', hint: 'Availability threats — resource exhaustion' },
  { id: 43, category: 'STRIDE', front: 'STRIDE: Elevation of Privilege means?', back: 'Gaining unauthorized access to elevated permissions', hint: 'Authorization threats — privilege escalation' },

  // SLSA
  { id: 44, category: 'SLSA', front: 'SLSA Level 1?', back: 'Provenance exists (build process documented)', hint: 'Level 1 = basic provenance, no guarantees' },
  { id: 45, category: 'SLSA', front: 'SLSA Level 2?', back: 'Signed provenance + hosted build service', hint: 'Level 2 = signed + trusted builder' },
  { id: 46, category: 'SLSA', front: 'SLSA Level 3?', back: 'Hardened builds + source integrity + audit', hint: 'Level 3 = security hardening on build environment' },
  { id: 47, category: 'SLSA', front: 'SLSA Level 4?', back: 'Two-person reviewed + hermetic + reproducible builds', hint: 'Level 4 = maximum trust: reviews, hermetic, reproducible' },
  { id: 48, category: 'SLSA', front: 'SLSA: "hermetic" build means?', back: 'Build is isolated from external network/influence', hint: 'Hermetic = no external dependencies during build' },
  { id: 49, category: 'SLSA', front: 'SLSA: "reproducible" build means?', back: 'Same inputs always produce same outputs (bit-for-bit)', hint: 'Reproducible = deterministic builds' },

  // Audit
  { id: 50, category: 'Audit', front: 'Audit log levels in order (least to most verbose)?', back: 'None → Metadata → Request → RequestResponse', hint: 'N-M-R-RR: None (off), Metadata (who/what/when), Request (body), RequestResponse (both)' },
  { id: 51, category: 'Audit', front: 'Audit "Metadata" level logs what?', back: 'Request metadata only (user, timestamp, verb, resource) — NO body', hint: 'Metadata = who did what to which resource, when' },
  { id: 52, category: 'Audit', front: 'Audit "Request" level logs what?', back: 'Metadata + request body', hint: 'Request = metadata + what was sent' },
  { id: 53, category: 'Audit', front: 'Audit "RequestResponse" level logs what?', back: 'Metadata + request body + response body', hint: 'RequestResponse = everything, most verbose' },
  { id: 54, category: 'Audit', front: 'Which stage records the response in audit events?', back: 'ResponseComplete', hint: 'ResponseStarted = beginning of stream; ResponseComplete = final response' },
  { id: 55, category: 'Audit', front: 'Where are audit logs written by default?', back: 'To a file (if --audit-log-path set) or webhook', hint: 'Can log to file or send to webhook endpoint' },

  // ServiceAccounts
  { id: 56, category: 'ServiceAccounts', front: 'Default service account token behavior in v1.24+?', back: 'No auto-generated secret token; use TokenRequest API / projected volumes', hint: 'v1.24+ removed legacy auto-token Secret creation' },
  { id: 57, category: 'ServiceAccounts', front: 'How to get a short-lived token for a ServiceAccount?', back: 'Create a TokenRequest or use projected service account volume', hint: 'Projected volume = automatic token rotation' },
  { id: 58, category: 'ServiceAccounts', front: 'Can you disable auto-mount of default service account token?', back: 'Yes — automountServiceAccountToken: false', hint: 'Set on Pod spec or ServiceAccount resource' },
  { id: 59, category: 'ServiceAccounts', front: 'What is the default service account name?', back: 'default', hint: 'Every namespace has a "default" SA' },

  // Runtime Security
  { id: 60, category: 'Runtime Security', front: 'Which syscall filter is used in Kubernetes runtime security?', back: 'seccomp (secure computing mode)', hint: 'seccomp = filter syscalls; apparmor/selinux = MAC' },
  { id: 61, category: 'Runtime Security', front: 'What is the default seccomp profile for containers?', back: 'RuntimeDefault', hint: 'RuntimeDefault = container runtime default filter' },
  { id: 62, category: 'Runtime Security', front: 'How to enable AppArmor in Kubernetes?', back: 'Use container.apparmor.security.beta.kubernetes.io annotation', hint: 'Annotation on Pod: profile name' },
  { id: 63, category: 'Runtime Security', front: 'SELinux mode for enforcing policies?', back: 'Enforcing (not Permissive or Disabled)', hint: 'Enforcing = active blocking; Permissive = logging only' },
  { id: 64, category: 'Runtime Security', front: 'What does OPA/Gatekeeper enforce?', back: 'Admission-time policies (not runtime)', hint: 'OPA/Gatekeeper = admission controller, not runtime monitoring' },
  { id: 65, category: 'Runtime Security', front: 'Which tools detect runtime anomalies?', back: 'Falco, Tetragon, Sysdig', hint: 'Falco = CNCF runtime threat detection' },

  // Misc
  { id: 66, category: 'Misc', front: 'Pod Security labels on namespace?', back: 'pod-security.kubernetes.io/enforce, warn, audit + enforce-version', hint: 'enforce, warn, audit with level (privileged/baseline/restricted)' },
  { id: 67, category: 'Misc', front: 'What is the kubeconfig default location?', back: '~/.kube/config', hint: 'KUBECONFIG env var overrides default path' },
  { id: 68, category: 'Misc', front: 'Which command rotates certificates?', back: 'kubeadm certs renew all', hint: 'kubeadm handles cluster certificate rotation' },
  { id: 69, category: 'Misc', front: 'Container runtime default in modern Kubernetes?', back: 'containerd (since Docker shim removal in v1.24)', hint: 'v1.24 removed dockershim; use containerd or CRI-O' },
  { id: 70, category: 'Misc', front: 'What is the CRI?', back: 'Container Runtime Interface — standard between kubelet and runtime', hint: 'CRI = gRPC API for container runtimes' },
  { id: 71, category: 'Misc', front: 'Admission controller that limits resource usage?', back: 'LimitRanger', hint: 'LimitRanger = enforce min/max resource constraints per namespace' },
  { id: 72, category: 'Misc', front: 'Admission controller for quota enforcement?', back: 'ResourceQuota', hint: 'ResourceQuota = limit total resources per namespace' },
  { id: 73, category: 'Misc', front: 'Which admission controller is always enabled and cannot be disabled?', back: 'NamespaceLifecycle', hint: 'NamespaceLifecycle = enforce namespace existence; cannot be turned off' },
  { id: 74, category: 'Misc', front: 'Where is the Kubernetes PKI usually stored?', back: '/etc/kubernetes/pki', hint: 'Default path for cluster certificates and keys' },
  { id: 75, category: 'Misc', front: 'Certificate validity for Kubernetes components?', back: '1 year by default (configurable)', hint: 'kubeadm default CA cert = 10 years; component certs = 1 year' },
  { id: 76, category: 'Misc', front: 'What does mTLS stand for?', back: 'Mutual TLS (both client and server authenticate)', hint: 'mTLS = mutual authentication via certificates' },
];

export const quickRecallCategories = Array.from(
  new Set(quickRecallCards.map((c) => c.category))
);
