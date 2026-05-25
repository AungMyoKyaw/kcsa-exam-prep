export interface QuickRecallCard {
  id: number;
  category: string;
  front: string;
  back: string;
  hint?: string;
}

export const quickRecallCards: QuickRecallCard[] = [
  // ═══════════════════════════════════════════════════════════════
  // PORTS — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 1, category: 'Ports', front: 'API Server listens on which port?', back: '6443 (HTTPS)', hint: 'Think of 64-bit security + 43 (4+3=7, lucky secure port)' },
  { id: 2, category: 'Ports', front: 'etcd client port?', back: '2379', hint: '2379 = etcd client requests' },
  { id: 3, category: 'Ports', front: 'etcd peer port?', back: '2380', hint: '2380 = etcd peer communication (one more than client)' },
  { id: 4, category: 'Ports', front: 'kubelet healthz port?', back: '10248', hint: '10248 = kubelet health check' },
  { id: 5, category: 'Ports', front: 'kubelet read-only port?', back: '10255 (deprecated, disabled by default)', hint: '10255 = read-only (no auth needed historically)' },
  { id: 6, category: 'Ports', front: 'kubelet HTTPS port?', back: '10250', hint: '10250 = kubelet API (secure)' },
  { id: 7, category: 'Ports', front: 'Scheduler port?', back: '10259 (HTTPS)', hint: '10259 = scheduler (secure)' },
  { id: 8, category: 'Ports', front: 'Controller Manager port?', back: '10257 (HTTPS)', hint: '10257 = controller manager (secure)' },
  { id: 9, category: 'Ports', front: 'NodePort range?', back: '30000–32767', hint: 'Default NodePort service range' },
  { id: 10, category: 'Ports', front: 'kube-proxy metrics port?', back: '10249', hint: '10249 = kube-proxy metrics endpoint' },
  { id: 11, category: 'Ports', front: 'kube-apiserver insecure port (deprecated)?', back: '8080 (disabled by default, do NOT use)', hint: '8080 = old insecure HTTP port; always disable in production' },
  { id: 12, category: 'Ports', front: 'Default HTTP port for Ingress/LoadBalancer?', back: '80', hint: 'Standard HTTP port for web traffic' },
  { id: 13, category: 'Ports', front: 'Default HTTPS port for Ingress/LoadBalancer?', back: '443', hint: 'Standard HTTPS port for secure web traffic' },
  { id: 14, category: 'Ports', front: 'DNS service port in Kubernetes?', back: '53 (UDP/TCP)', hint: 'CoreDNS listens on port 53 for DNS queries' },
  { id: 15, category: 'Ports', front: 'Metrics Server port?', back: '443 (served via API aggregation)', hint: 'Metrics Server exposes metrics through the API server aggregation layer' },

  // ═══════════════════════════════════════════════════════════════
  // RBAC — 20 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 16, category: 'RBAC', front: 'RBAC dangerous verbs?', back: 'BEI: Bind, Escalate, Impersonate', hint: 'B-E-I: Bind (bind roles), Escalate (escalate privileges), Impersonate (act as another user)' },
  { id: 17, category: 'RBAC', front: 'What does the "escalate" verb allow?', back: 'Create/modify roles with more permissions than you have', hint: 'Escalate = privilege escalation via role editing' },
  { id: 18, category: 'RBAC', front: 'What does "bind" verb allow?', back: 'Bind a rolebinding/clusterrolebinding to any role/clusterrole', hint: 'Bind = attach roles to users/groups' },
  { id: 19, category: 'RBAC', front: 'What does "impersonate" verb allow?', back: 'Act as another user, group, or service account', hint: 'Impersonate = make requests as another identity' },
  { id: 20, category: 'RBAC', front: 'Default RBAC policy for anonymous users?', back: 'Default denies all (no permissions)', hint: 'Anonymous = no auth; denied unless explicitly allowed' },
  { id: 21, category: 'RBAC', front: 'How to prevent privilege escalation in roles?', back: 'Set allowPrivilegeEscalation: false in securityContext', hint: 'Container-level setting, not RBAC verb' },
  { id: 22, category: 'RBAC', front: 'Role vs ClusterRole scope?', back: 'Role = namespaced; ClusterRole = cluster-wide', hint: 'RoleBinding binds Role (namespace); ClusterRoleBinding binds ClusterRole (cluster)' },
  { id: 23, category: 'RBAC', front: 'What are the 11 RBAC verbs?', back: 'get, list, watch, create, update, patch, delete, deletecollection, impersonate, bind, escalate', hint: 'Remember: GLW-CUP-DD-IBE' },
  { id: 24, category: 'RBAC', front: 'What is the difference between RoleBinding and ClusterRoleBinding?', back: 'RoleBinding is namespaced; ClusterRoleBinding is cluster-wide', hint: 'Both can reference ClusterRoles, but binding scope differs' },
  { id: 25, category: 'RBAC', front: 'Can a RoleBinding reference a ClusterRole?', back: 'Yes — the ClusterRole permissions are scoped to the binding\'s namespace', hint: 'Useful for applying cluster-wide rules to a single namespace' },
  { id: 26, category: 'RBAC', front: 'What is the default service account in every namespace?', back: 'default', hint: 'Each namespace gets a "default" service account automatically' },
  { id: 27, category: 'RBAC', front: 'How do you disable auto-mount of service account tokens?', back: 'Set automountServiceAccountToken: false on Pod or ServiceAccount', hint: 'Reduces attack surface by preventing token exposure' },
  { id: 28, category: 'RBAC', front: 'What does the "create" verb allow?', back: 'Create new resources', hint: 'One of the standard write verbs in RBAC' },
  { id: 29, category: 'RBAC', front: 'What does the "deletecollection" verb allow?', back: 'Delete multiple resources at once (e.g., delete all pods)', hint: 'More dangerous than single delete — use carefully' },
  { id: 30, category: 'RBAC', front: 'What is the purpose of aggregationRule in ClusterRole?', back: 'Dynamically combine permissions from multiple ClusterRoles via label selectors', hint: 'Used by admin/edit/view built-in roles' },
  { id: 31, category: 'RBAC', front: 'Which built-in ClusterRole allows full cluster admin access?', back: 'cluster-admin', hint: 'cluster-admin = superuser for the entire cluster' },
  { id: 32, category: 'RBAC', front: 'Which built-in ClusterRole allows namespace-level admin?', back: 'admin', hint: 'admin = full control within a namespace' },
  { id: 33, category: 'RBAC', front: 'Which built-in ClusterRole allows read-only access across cluster?', back: 'view', hint: 'view = get/list/watch on most resources' },
  { id: 34, category: 'RBAC', front: 'What is the "edit" ClusterRole for?', back: 'Read/write access to most resources in a namespace, excluding secrets', hint: 'edit = standard developer role' },
  { id: 35, category: 'RBAC', front: 'How are service account tokens bound in v1.24+?', back: 'TokenRequest API creates short-lived, audience-bound tokens', hint: 'Legacy Secret tokens are no longer auto-generated' },

  // ═══════════════════════════════════════════════════════════════
  // Pod Security Standards (PSS) — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 36, category: 'PSS', front: '3 Pod Security Standards levels?', back: 'Privileged, Baseline, Restricted', hint: 'PBS: Privileged (open), Baseline (moderate), Restricted (locked down)' },
  { id: 37, category: 'PSS', front: 'Which PSS level is the most restrictive?', back: 'Restricted', hint: 'Restricted = maximum security, minimal privileges' },
  { id: 38, category: 'PSS', front: 'Which capability is allowed in Restricted PSS?', back: 'NET_BIND_SERVICE only', hint: 'Drop ALL except NET_BIND_SERVICE (bind to low ports)' },
  { id: 39, category: 'PSS', front: 'What must runAsNonRoot be set to in Restricted?', back: 'true', hint: 'Restricted forbids running as root' },
  { id: 40, category: 'PSS', front: 'Restricted PSS: which seccomp profile required?', back: 'RuntimeDefault or Localhost', hint: 'Cannot use Unconfined in Restricted' },
  { id: 41, category: 'PSS', front: 'Restricted PSS: what are the readOnlyRootFilesystem requirements?', back: 'Must be true (immutable root filesystem)', hint: 'Container root filesystem must be read-only' },
  { id: 42, category: 'PSS', front: 'Restricted PSS: can you use hostNetwork, hostPID, hostIPC?', back: 'No — all forbidden', hint: 'Restricted disallows all host namespace sharing' },
  { id: 43, category: 'PSS', front: 'Baseline PSS: can you run as root?', back: 'Yes — root is allowed in Baseline', hint: 'Baseline is less strict; root + most capabilities allowed' },
  { id: 44, category: 'PSS', front: 'Which Kubernetes version graduated PodSecurity to stable?', back: 'v1.25 (GA, replacing PodSecurityPolicy)', hint: 'PSP deprecated in v1.21, removed in v1.25, replaced by PSS' },
  { id: 45, category: 'PSS', front: 'Baseline PSS: are hostPath volumes allowed?', back: 'No — hostPath volumes are forbidden', hint: 'Baseline blocks hostPath to prevent host filesystem access' },
  { id: 46, category: 'PSS', front: 'Privileged PSS: are there any restrictions?', back: 'No — Privileged is unrestricted, full permissions allowed', hint: 'Privileged = no restrictions; use only for system workloads' },
  { id: 47, category: 'PSS', front: 'Baseline PSS: can you add capabilities?', back: 'Only NET_BIND_SERVICE is allowed; no other additions', hint: 'Baseline limits added capabilities' },
  { id: 48, category: 'PSS', front: 'Restricted PSS: what are the volume restrictions?', back: 'Only specific volume types allowed (ConfigMap, Secret, emptyDir, etc.)', hint: 'No hostPath, no FlexVolume, no CSI with host interaction' },
  { id: 49, category: 'PSS', front: 'Restricted PSS: what is the allowPrivilegeEscalation requirement?', back: 'Must be false', hint: 'Prevents processes from gaining more privileges than parent' },
  { id: 50, category: 'PSS', front: 'How do you enforce PSS on a namespace?', back: 'Use labels: pod-security.kubernetes.io/enforce, /warn, /audit', hint: 'e.g., enforce=restricted, warn=restricted, audit=restricted' },

  // ═══════════════════════════════════════════════════════════════
  // NetworkPolicy — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 51, category: 'NetworkPolicy', front: 'Default NetworkPolicy behavior?', back: 'Allow all ingress and egress (no restriction)', hint: 'Without NetworkPolicy = everything is open' },
  { id: 52, category: 'NetworkPolicy', front: 'Which CNI plugins support NetworkPolicy enforcement?', back: 'Calico, Cilium, Weave Net, Antrea, kube-router', hint: 'Not all CNIs enforce policies (e.g., Flannel alone does not)' },
  { id: 53, category: 'NetworkPolicy', front: 'What policyTypes values are valid?', back: 'Ingress, Egress, or both', hint: 'policyTypes: ["Ingress", "Egress"]' },
  { id: 54, category: 'NetworkPolicy', front: 'Does a deny-all NetworkPolicy block external traffic?', back: 'Yes — empty ingress rules = deny all ingress', hint: 'Empty spec.ingress = no allowed ingress sources' },
  { id: 55, category: 'NetworkPolicy', front: 'NetworkPolicy applies at which OSI layer?', back: 'Layer 3/4 (IP and port), NOT Layer 7 (HTTP path)', hint: 'Cannot filter by URL path or HTTP method' },
  { id: 56, category: 'NetworkPolicy', front: 'What is a default-deny ingress policy?', back: 'A NetworkPolicy with policyTypes: ["Ingress"] and no ingress rules', hint: 'Blocks all incoming traffic unless explicitly allowed' },
  { id: 57, category: 'NetworkPolicy', front: 'Can NetworkPolicy block pod-to-pod traffic within the same namespace?', back: 'Yes — if no matching ingress rule allows it', hint: 'Intra-namespace traffic is NOT implicitly allowed' },
  { id: 58, category: 'NetworkPolicy', front: 'What does namespaceSelector do in NetworkPolicy?', back: 'Selects namespaces to allow/deny traffic from/to', hint: 'Used for cross-namespace traffic control' },
  { id: 59, category: 'NetworkPolicy', front: 'What does podSelector do in NetworkPolicy?', back: 'Selects pods within the policy\'s namespace', hint: 'Empty podSelector = applies to all pods in namespace' },
  { id: 60, category: 'NetworkPolicy', front: 'Can you block egress DNS with NetworkPolicy?', back: 'Yes — but you must explicitly allow DNS (UDP 53) or pods lose DNS resolution', hint: 'Default-deny egress breaks DNS unless port 53 is allowed' },
  { id: 61, category: 'NetworkPolicy', front: 'Do NetworkPolicies combine with OR or AND logic?', back: 'OR logic across policies — if ANY policy allows, traffic is allowed', hint: 'Multiple policies are additive, not restrictive' },
  { id: 62, category: 'NetworkPolicy', front: 'Which field defines allowed ports in a NetworkPolicy rule?', back: 'ports: [protocol, port]', hint: 'Protocol (TCP/UDP/SCTP) and port number or name' },
  { id: 63, category: 'NetworkPolicy', front: 'Can NetworkPolicy restrict access from specific IP blocks?', back: 'Yes — use ipBlock in ingress/egress rules', hint: 'ipBlock allows CIDR-based filtering with except lists' },
  { id: 64, category: 'NetworkPolicy', front: 'What is the effect of multiple NetworkPolicies on the same pod?', back: 'Union of all rules — traffic allowed if any policy permits it', hint: 'Policies are ORed together, not ANDed' },
  { id: 65, category: 'NetworkPolicy', front: 'Which CNI is known for Layer 7 (HTTP) policy support?', back: 'Cilium', hint: 'Cilium supports L3/L4/L7 policies via eBPF' },

  // ═══════════════════════════════════════════════════════════════
  // Encryption — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 66, category: 'Encryption', front: 'Recommended encryption provider for Secrets at rest?', back: 'KMS v2', hint: 'KMS v2 > KMS v1 > aescbc > secretbox > identity' },
  { id: 67, category: 'Encryption', front: 'What does KMS v2 provider use for DEK/KEK?', back: 'Per-resource DEK, KEK from external KMS', hint: 'DEK = data encryption key; KEK = key encryption key from external provider' },
  { id: 68, category: 'Encryption', front: 'Where is encryption configuration defined?', back: '--encryption-provider-config flag on API Server', hint: 'API server startup flag pointing to encryption config file' },
  { id: 69, category: 'Encryption', front: 'Which API server flag enables audit logging?', back: '--audit-log-path', hint: '--audit-log-path specifies where to write audit logs' },
  { id: 70, category: 'Encryption', front: 'Best practice when rotating encryption config?', back: 'Write new config, restart API server, re-encrypt all secrets, remove old provider', hint: 'Must re-encrypt all data before removing old provider' },
  { id: 71, category: 'Encryption', front: 'What happens if you remove old provider before re-encrypting?', back: 'You lose access to data encrypted with old provider', hint: 'Old provider must stay until all data is re-encrypted' },
  { id: 72, category: 'Encryption', front: 'What is a DEK?', back: 'Data Encryption Key — encrypts the actual resource data', hint: 'DEK is unique per resource; KEK protects the DEK' },
  { id: 73, category: 'Encryption', front: 'What is a KEK?', back: 'Key Encryption Key — encrypts the DEK', hint: 'KEK is stored in external KMS; never exposed to Kubernetes' },
  { id: 74, category: 'Encryption', front: 'What is the difference between aescbc and aesgcm?', back: 'aescbc = CBC mode; aesgcm = GCM mode (authenticated encryption)', hint: 'aesgcm is preferred due to built-in authentication' },
  { id: 75, category: 'Encryption', front: 'Which encryption provider is DEPRECATED and should be avoided?', back: 'aescbc', hint: 'aescbc is deprecated; use aesgcm or KMS v2 instead' },
  { id: 76, category: 'Encryption', front: 'What is the "identity" encryption provider?', back: 'No encryption — stores data in plaintext', hint: 'identity = pass-through, no encryption at rest' },
  { id: 77, category: 'Encryption', front: 'What resources can be encrypted at rest?', back: 'Secrets, ConfigMaps, Ingresses, CRDs, and more', hint: 'Any resource type can be configured in EncryptionConfiguration' },
  { id: 78, category: 'Encryption', front: 'How do you trigger re-encryption of all secrets?', back: 'Write a no-op update to each secret or use a script to touch all resources', hint: 'Any update causes the API server to rewrite with new provider' },
  { id: 79, category: 'Encryption', front: 'What is the EncryptionConfiguration API version?', back: 'apiserver.config.k8s.io/v1', hint: 'Used in the encryption config YAML file' },
  { id: 80, category: 'Encryption', front: 'What does KMS v2 improve over KMS v1?', back: 'Better performance, health checks, and reduced API server load', hint: 'KMS v2 caches DEKs and has async health polling' },

  // ═══════════════════════════════════════════════════════════════
  // Admission Controllers — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 81, category: 'Admission Controllers', front: 'What is the difference between mutating and validating admission controllers?', back: 'Mutating = can modify the request; Validating = only approve/reject', hint: 'Mutating runs first, then validating' },
  { id: 82, category: 'Admission Controllers', front: 'Which admission controller enforces Pod Security Standards?', back: 'PodSecurity', hint: 'Replaced PodSecurityPolicy admission controller' },
  { id: 83, category: 'Admission Controllers', front: 'What does LimitRanger do?', back: 'Enforces min/max resource limits per namespace or container', hint: 'Prevents containers from requesting too little or too much' },
  { id: 84, category: 'Admission Controllers', front: 'What does ResourceQuota do?', back: 'Limits total resource consumption per namespace', hint: 'Controls aggregate CPU, memory, object counts per namespace' },
  { id: 85, category: 'Admission Controllers', front: 'Which admission controller prevents deletion of default namespaces?', back: 'NamespaceLifecycle', hint: 'Cannot delete default, kube-system, kube-public' },
  { id: 86, category: 'Admission Controllers', front: 'Which admission controller is always enabled and cannot be disabled?', back: 'NamespaceLifecycle', hint: 'NamespaceLifecycle = enforce namespace existence; cannot be turned off' },
  { id: 87, category: 'Admission Controllers', front: 'What does ServiceAccount admission controller do?', back: 'Auto-mounts default service account token if not specified', hint: 'Runs if automountServiceAccountToken is not explicitly set' },
  { id: 88, category: 'Admission Controllers', front: 'What does DefaultStorageClass admission controller do?', back: 'Automatically adds a default StorageClass to PVCs without one', hint: 'Ensures every PVC has a storage class' },
  { id: 89, category: 'Admission Controllers', front: 'What does MutatingAdmissionWebhook do?', back: 'Calls external webhooks that can modify incoming resources', hint: 'Used by tools like Istio, OPA/Gatekeeper for mutation' },
  { id: 90, category: 'Admission Controllers', front: 'What does ValidatingAdmissionWebhook do?', back: 'Calls external webhooks that validate but cannot modify resources', hint: 'Used for policy enforcement without mutation' },
  { id: 91, category: 'Admission Controllers', front: 'What is the difference between AlwaysPullImages and ImagePolicyWebhook?', back: 'AlwaysPullImages = forces pull policy; ImagePolicyWebhook = external image validation', hint: 'ImagePolicyWebhook calls external service for image approval' },
  { id: 92, category: 'Admission Controllers', front: 'Which admission controller prevents using the default namespace for new objects?', back: 'None directly — but NamespaceLifecycle prevents deleting it', hint: 'You CAN create objects in default; not recommended though' },
  { id: 93, category: 'Admission Controllers', front: 'What does NodeRestriction admission controller do?', back: 'Limits what kubelet can modify — only its own node and pods', hint: 'Prevents kubelets from accessing other nodes\' resources' },
  { id: 94, category: 'Admission Controllers', front: 'How do you enable/disable admission controllers?', back: '--enable-admission-plugins and --disable-admission-plugins flags on API server', hint: 'Comma-separated list of plugin names' },
  { id: 95, category: 'Admission Controllers', front: 'What is the recommended approach for custom admission policies?', back: 'Use ValidatingAdmissionPolicy (built-in) or admission webhooks', hint: 'VAP = native CEL-based policy, no webhook needed' },

  // ═══════════════════════════════════════════════════════════════
  // Supply Chain — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 96, category: 'Supply Chain', front: 'SLSA Level 1?', back: 'Provenance exists (build process documented)', hint: 'Level 1 = basic provenance, no guarantees' },
  { id: 97, category: 'Supply Chain', front: 'SLSA Level 2?', back: 'Signed provenance + hosted build service', hint: 'Level 2 = signed + trusted builder' },
  { id: 98, category: 'Supply Chain', front: 'SLSA Level 3?', back: 'Hardened builds + source integrity + audit', hint: 'Level 3 = security hardening on build environment' },
  { id: 99, category: 'Supply Chain', front: 'SLSA Level 4?', back: 'Two-person reviewed + hermetic + reproducible builds', hint: 'Level 4 = maximum trust: reviews, hermetic, reproducible' },
  { id: 100, category: 'Supply Chain', front: 'SLSA: "hermetic" build means?', back: 'Build is isolated from external network/influence', hint: 'Hermetic = no external dependencies during build' },
  { id: 101, category: 'Supply Chain', front: 'SLSA: "reproducible" build means?', back: 'Same inputs always produce same outputs (bit-for-bit)', hint: 'Reproducible = deterministic builds' },
  { id: 102, category: 'Supply Chain', front: 'What is Cosign used for?', back: 'Signing and verifying container images with Sigstore', hint: 'Cosign = keyless signing via OIDC + Rekor transparency log' },
  { id: 103, category: 'Supply Chain', front: 'What is Rekor?', back: 'Transparency log for software artifacts and signatures', hint: 'Rekor = immutable tamper-evident log of signatures' },
  { id: 104, category: 'Supply Chain', front: 'What is Fulcio?', back: 'Free CA for code signing via OIDC identity', hint: 'Fulcio = ephemeral certificates tied to developer identity' },
  { id: 105, category: 'Supply Chain', front: 'What is an SBOM?', back: 'Software Bill of Materials — inventory of components in software', hint: 'SBOM = list of dependencies, libraries, and licenses' },
  { id: 106, category: 'Supply Chain', front: 'What is the SPDX format?', back: 'Standard format for SBOM exchange', hint: 'SPDX = Linux Foundation standard for software components' },
  { id: 107, category: 'Supply Chain', front: 'What is Syft used for?', back: 'Generating SBOMs from container images and filesystems', hint: 'Syft = Anchore CLI tool for SBOM generation' },
  { id: 108, category: 'Supply Chain', front: 'What is Grype used for?', back: 'Vulnerability scanning of container images using SBOM data', hint: 'Grype = Anchore scanner that matches SBOM against vulnerability DB' },
  { id: 109, category: 'Supply Chain', front: 'What is Trivy used for?', back: 'Comprehensive scanner for images, filesystems, repos, and IaC', hint: 'Trivy = Aqua Security scanner, popular in CI/CD' },
  { id: 110, category: 'Supply Chain', front: 'What is imagePullPolicy: Always?', back: 'Always pull the image from registry, never use local cache', hint: 'Ensures latest image is used every time' },

  // ═══════════════════════════════════════════════════════════════
  // Compliance — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 111, category: 'Compliance', front: 'Audit log levels in order (least to most verbose)?', back: 'None → Metadata → Request → RequestResponse', hint: 'N-M-R-RR: None (off), Metadata (who/what/when), Request (body), RequestResponse (both)' },
  { id: 112, category: 'Compliance', front: 'Audit "Metadata" level logs what?', back: 'Request metadata only (user, timestamp, verb, resource) — NO body', hint: 'Metadata = who did what to which resource, when' },
  { id: 113, category: 'Compliance', front: 'Audit "Request" level logs what?', back: 'Metadata + request body', hint: 'Request = metadata + what was sent' },
  { id: 114, category: 'Compliance', front: 'Audit "RequestResponse" level logs what?', back: 'Metadata + request body + response body', hint: 'RequestResponse = everything, most verbose' },
  { id: 115, category: 'Compliance', front: 'Which stage records the response in audit events?', back: 'ResponseComplete', hint: 'ResponseStarted = beginning of stream; ResponseComplete = final response' },
  { id: 116, category: 'Compliance', front: 'Where are audit logs written by default?', back: 'To a file (if --audit-log-path set) or webhook', hint: 'Can log to file or send to webhook endpoint' },
  { id: 117, category: 'Compliance', front: 'What does CIS stand for?', back: 'Center for Internet Security', hint: 'CIS = nonprofit providing security benchmarks' },
  { id: 118, category: 'Compliance', front: 'What is kube-bench?', back: 'CIS Kubernetes Benchmark automated checker', hint: 'kube-bench = Aqua Security tool for CIS compliance' },
  { id: 119, category: 'Compliance', front: 'What are the 5 NIST CSF functions?', back: 'Identify, Protect, Detect, Respond, Recover', hint: 'IPDRR: Identify, Protect, Detect, Respond, Recover' },
  { id: 120, category: 'Compliance', front: 'What is the MITRE ATT&CK framework?', back: 'Knowledge base of adversary tactics and techniques', hint: 'MITRE = structured threat intelligence for defense' },
  { id: 121, category: 'Compliance', front: 'Which CIS section covers API server configuration?', back: 'CIS Section 1', hint: 'CIS Section 1 = Control Plane Components' },
  { id: 122, category: 'Compliance', front: 'Which CIS section covers etcd?', back: 'CIS Section 2', hint: 'CIS Section 2 = etcd configuration' },
  { id: 123, category: 'Compliance', front: 'Which CIS section covers worker nodes?', back: 'CIS Section 4', hint: 'CIS Section 4 = Worker Node Configuration' },
  { id: 124, category: 'Compliance', front: 'Which CIS section covers policies (RBAC, PSS, NetworkPolicy)?', back: 'CIS Section 5', hint: 'CIS Section 5 = Kubernetes Policies' },
  { id: 125, category: 'Compliance', front: 'What is the purpose of a Pod Security Admission audit label?', back: 'Logs policy violations without blocking pod creation', hint: 'audit = log only; warn = user-facing warning; enforce = block' },

  // ═══════════════════════════════════════════════════════════════
  // STRIDE — 10 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 126, category: 'STRIDE', front: 'STRIDE acronym?', back: 'Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege', hint: 'S-T-R-I-D-E: 6 threat categories from Microsoft' },
  { id: 127, category: 'STRIDE', front: 'STRIDE: Spoofing means?', back: 'Pretending to be someone/something else', hint: 'Authentication threats — fake identity' },
  { id: 128, category: 'STRIDE', front: 'STRIDE: Tampering means?', back: 'Modifying data or code maliciously', hint: 'Integrity threats — unauthorized changes' },
  { id: 129, category: 'STRIDE', front: 'STRIDE: Repudiation means?', back: 'Denying an action took place', hint: 'Non-repudiation threats — no audit trail' },
  { id: 130, category: 'STRIDE', front: 'STRIDE: Information Disclosure means?', back: 'Exposing information to unauthorized parties', hint: 'Confidentiality threats — data leaks' },
  { id: 131, category: 'STRIDE', front: 'STRIDE: Denial of Service means?', back: 'Making a service unavailable', hint: 'Availability threats — resource exhaustion' },
  { id: 132, category: 'STRIDE', front: 'STRIDE: Elevation of Privilege means?', back: 'Gaining unauthorized access to elevated permissions', hint: 'Authorization threats — privilege escalation' },
  { id: 133, category: 'STRIDE', front: 'STRIDE → Kubernetes: Spoofing maps to?', back: 'Stolen credentials, fake service accounts, man-in-the-middle', hint: 'Prevent with mTLS, strong auth, token rotation' },
  { id: 134, category: 'STRIDE', front: 'STRIDE → Kubernetes: Tampering maps to?', back: 'Modified images, etcd data tampering, config drift', hint: 'Prevent with image signing, etcd encryption, GitOps' },
  { id: 135, category: 'STRIDE', front: 'STRIDE → Kubernetes: Information Disclosure maps to?', back: 'Secret leaks, overly permissive RBAC, verbose logs', hint: 'Prevent with RBAC least privilege, encryption, audit tuning' },

  // ═══════════════════════════════════════════════════════════════
  // TLS/Certs — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 136, category: 'TLS/Certs', front: 'Where is the Kubernetes PKI usually stored?', back: '/etc/kubernetes/pki', hint: 'Default path for cluster certificates and keys' },
  { id: 137, category: 'TLS/Certs', front: 'Certificate validity for Kubernetes components?', back: '1 year by default (configurable)', hint: 'kubeadm default CA cert = 10 years; component certs = 1 year' },
  { id: 138, category: 'TLS/Certs', front: 'What does mTLS stand for?', back: 'Mutual TLS (both client and server authenticate)', hint: 'mTLS = mutual authentication via certificates' },
  { id: 139, category: 'TLS/Certs', front: 'What is a bootstrap token used for?', back: 'Initial node authentication to join the cluster', hint: 'Bootstrap token = temporary auth for kubeadm join' },
  { id: 140, category: 'TLS/Certs', front: 'How do you create a CSR for a new user?', back: 'Generate private key, create CSR object in Kubernetes, approve it', hint: 'kubectl create csr + kubectl certificate approve' },
  { id: 141, category: 'TLS/Certs', front: 'What is the purpose of the front-proxy CA?', back: 'Authenticates requests to the API server aggregation layer', hint: 'Used by extension API servers like metrics-server' },
  { id: 142, category: 'TLS/Certs', front: 'Which command rotates all certificates?', back: 'kubeadm certs renew all', hint: 'kubeadm handles cluster certificate rotation' },
  { id: 143, category: 'TLS/Certs', front: 'What is the service account token format in v1.24+?', back: 'Projected volume with short-lived JWT tokens', hint: 'No more Secret-based long-lived tokens by default' },
  { id: 144, category: 'TLS/Certs', front: 'What is a projected service account volume?', back: 'A volume that auto-rotates short-lived service account tokens', hint: 'Token is mounted at a path and automatically refreshed' },
  { id: 145, category: 'TLS/Certs', front: 'How often are projected service account tokens rotated?', back: 'When they reach 80% of their lifetime or after 24 hours', hint: 'Automatic rotation by kubelet' },
  { id: 146, category: 'TLS/Certs', front: 'What is the default service account token lifetime?', back: '1 hour (configurable via --service-account-max-token-expiration)', hint: 'Short-lived by design for security' },
  { id: 147, category: 'TLS/Certs', front: 'What does --tls-cert-file flag specify?', back: 'The TLS certificate for the API server', hint: 'Used for serving HTTPS on port 6443' },
  { id: 148, category: 'TLS/Certs', front: 'What does --client-ca-file flag specify?', back: 'The CA bundle for verifying client certificates', hint: 'Used for mTLS client authentication' },
  { id: 149, category: 'TLS/Certs', front: 'What is the purpose of etcd peer certificates?', back: 'Encrypt and authenticate etcd node-to-node communication', hint: 'etcd peer mTLS = cluster-internal encryption' },
  { id: 150, category: 'TLS/Certs', front: 'What is certificate transparency?', back: 'Public logging of all issued certificates to detect misissuance', hint: 'CT logs = append-only logs of cert history' },

  // ═══════════════════════════════════════════════════════════════
  // Container Security — 15 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 151, category: 'Container Security', front: 'Which syscall filter is used in Kubernetes runtime security?', back: 'seccomp (secure computing mode)', hint: 'seccomp = filter syscalls; apparmor/selinux = MAC' },
  { id: 152, category: 'Container Security', front: 'What is the default seccomp profile for containers?', back: 'RuntimeDefault', hint: 'RuntimeDefault = container runtime default filter' },
  { id: 153, category: 'Container Security', front: 'How to enable AppArmor in Kubernetes?', back: 'Use container.apparmor.security.beta.kubernetes.io annotation', hint: 'Annotation on Pod: profile name' },
  { id: 154, category: 'Container Security', front: 'SELinux mode for enforcing policies?', back: 'Enforcing (not Permissive or Disabled)', hint: 'Enforcing = active blocking; Permissive = logging only' },
  { id: 155, category: 'Container Security', front: 'What does OPA/Gatekeeper enforce?', back: 'Admission-time policies (not runtime)', hint: 'OPA/Gatekeeper = admission controller, not runtime monitoring' },
  { id: 156, category: 'Container Security', front: 'Which tools detect runtime anomalies?', back: 'Falco, Tetragon, Sysdig', hint: 'Falco = CNCF runtime threat detection' },
  { id: 157, category: 'Container Security', front: 'What is a privileged container escape vector?', back: 'Full host access via shared namespaces, hostPath, or cap_sys_admin', hint: 'Privileged = root on host; avoid in production' },
  { id: 158, category: 'Container Security', front: 'What does readOnlyRootFilesystem prevent?', back: 'Modifying container filesystem — forces immutable containers', hint: 'Use emptyDir or volumes for writable locations' },
  { id: 159, category: 'Container Security', front: 'What is the danger of running as root in a container?', back: 'If escaped, attacker has root on the host', hint: 'Always set runAsNonRoot: true and runAsUser' },
  { id: 160, category: 'Container Security', front: 'What does allowPrivilegeEscalation: false prevent?', back: 'Processes from gaining more privileges than their parent', hint: 'Blocks setuid binaries from elevating privileges' },
  { id: 161, category: 'Container Security', front: 'What is a seccomp Localhost profile?', back: 'A custom seccomp profile stored on the node and referenced by path', hint: 'Localhost = node-local JSON profile file' },
  { id: 162, category: 'Container Security', front: 'What is the difference between AppArmor and SELinux?', back: 'AppArmor = path-based MAC; SELinux = label-based MAC', hint: 'AppArmor on Ubuntu/Debian; SELinux on RHEL/CentOS/Fedora' },
  { id: 163, category: 'Container Security', front: 'What is Tetragon used for?', back: 'eBPF-based runtime security and observability', hint: 'Tetragon = Cilium project for kernel-level threat detection' },
  { id: 164, category: 'Container Security', front: 'What is the risk of mounting /var/run/docker.sock?', back: 'Full host compromise via Docker API access', hint: 'docker.sock = root on host; never mount in containers' },
  { id: 165, category: 'Container Security', front: 'What is a non-root user best practice for containers?', back: 'Set runAsUser to a high UID (e.g., 1000+) and runAsNonRoot: true', hint: 'Avoid UID 0; use least-privilege UIDs' },

  // ═══════════════════════════════════════════════════════════════
  // General — 30 cards
  // ═══════════════════════════════════════════════════════════════
  { id: 166, category: 'General', front: 'What is the kubeconfig default location?', back: '~/.kube/config', hint: 'KUBECONFIG env var overrides default path' },
  { id: 167, category: 'General', front: 'Which command rotates certificates?', back: 'kubeadm certs renew all', hint: 'kubeadm handles cluster certificate rotation' },
  { id: 168, category: 'General', front: 'Container runtime default in modern Kubernetes?', back: 'containerd (since Docker shim removal in v1.24)', hint: 'v1.24 removed dockershim; use containerd or CRI-O' },
  { id: 169, category: 'General', front: 'What is the CRI?', back: 'Container Runtime Interface — standard between kubelet and runtime', hint: 'CRI = gRPC API for container runtimes' },
  { id: 170, category: 'General', front: 'Pod Security labels on namespace?', back: 'pod-security.kubernetes.io/enforce, warn, audit + enforce-version', hint: 'enforce, warn, audit with level (privileged/baseline/restricted)' },
  { id: 171, category: 'General', front: 'What are the 4Cs of cloud-native security?', back: 'Code, Container, Cluster, Cloud', hint: '4Cs = layered security model for cloud-native' },
  { id: 172, category: 'General', front: 'What is ImagePullPolicy: IfNotPresent?', back: 'Pull only if image not already cached locally', hint: 'Default for tagged images; avoids unnecessary pulls' },
  { id: 173, category: 'General', front: 'What is ImagePullPolicy: Never?', back: 'Never pull from registry; must exist locally', hint: 'Used in air-gapped or pre-loaded environments' },
  { id: 174, category: 'General', front: 'What are the 3 probe types in Kubernetes?', back: 'Liveness, Readiness, Startup', hint: 'Liveness = restart; Readiness = traffic; Startup = initial delay' },
  { id: 175, category: 'General', front: 'What does a Liveness probe do?', back: 'Restarts the container if it fails', hint: 'Liveness = is the app alive? If not, kill and recreate' },
  { id: 176, category: 'General', front: 'What does a Readiness probe do?', back: 'Removes pod from service endpoints if it fails', hint: 'Readiness = is the app ready to serve traffic?' },
  { id: 177, category: 'General', front: 'What does a Startup probe do?', back: 'Disables liveness/readiness checks until the container starts', hint: 'Startup = for slow-starting apps; prevents premature restarts' },
  { id: 178, category: 'General', front: 'What are the 3 restart policies?', back: 'Always, OnFailure, Never', hint: 'Always = default for Deployments; OnFailure = Jobs; Never = manual' },
  { id: 179, category: 'General', front: 'What is the default restart policy?', back: 'Always', hint: 'Containers are always restarted unless explicitly stopped' },
  { id: 180, category: 'General', front: 'What is the difference between a Secret and a ConfigMap?', back: 'Secret = sensitive data (base64 encoded); ConfigMap = non-sensitive configuration', hint: 'Secrets are for passwords, tokens, keys; ConfigMaps for settings' },
  { id: 181, category: 'General', front: 'What is etcd?', back: 'Distributed key-value store used as Kubernetes backing store', hint: 'etcd = consistent and highly-available store for all cluster data' },
  { id: 182, category: 'General', front: 'What is the quorum requirement for etcd?', back: 'Majority of nodes (n/2 + 1)', hint: '3 nodes need 2; 5 nodes need 3 for consensus' },
  { id: 183, category: 'General', front: 'What is the kubelet?', back: 'Agent that runs on each node, managing pods and containers', hint: 'kubelet = node-level pod lifecycle manager' },
  { id: 184, category: 'General', front: 'What is kube-proxy?', back: 'Network proxy that maintains network rules for Services', hint: 'kube-proxy = handles iptables/IPVS for ClusterIP, NodePort, LB' },
  { id: 185, category: 'General', front: 'What is the difference between a Deployment and a StatefulSet?', back: 'Deployment = stateless, interchangeable pods; StatefulSet = stable identity, ordered scaling', hint: 'StatefulSet = persistent storage, ordered names, headless service' },
  { id: 186, category: 'General', front: 'What is a DaemonSet?', back: 'Ensures one pod runs on every (or selected) node(s)', hint: 'DaemonSet = node-level workloads like logging, monitoring' },
  { id: 187, category: 'General', front: 'What is a Job vs CronJob?', back: 'Job = run once to completion; CronJob = scheduled recurring Jobs', hint: 'CronJob = cron-like scheduling for batch tasks' },
  { id: 188, category: 'General', front: 'What is the difference between ClusterIP, NodePort, and LoadBalancer?', back: 'ClusterIP = internal; NodePort = external via node IP; LoadBalancer = cloud LB', hint: 'ClusterIP < NodePort < LoadBalancer in exposure level' },
  { id: 189, category: 'General', front: 'What is an Ingress?', back: 'Layer 7 HTTP/HTTPS routing rules for external access', hint: 'Ingress = host/path-based routing; requires Ingress controller' },
  { id: 190, category: 'General', front: 'What is the default Service type?', back: 'ClusterIP', hint: 'ClusterIP = internal-only virtual IP' },
  { id: 191, category: 'General', front: 'What is RBAC least privilege principle?', back: 'Grant only the minimum permissions necessary for a task', hint: 'Never give cluster-admin by default; use specific verbs/resources' },
  { id: 192, category: 'General', front: 'What is defense in depth?', back: 'Multiple layers of security controls', hint: 'If one layer fails, others still protect the system' },
  { id: 193, category: 'General', front: 'What is a zero trust architecture?', back: 'Never trust, always verify — no implicit trust based on network location', hint: 'Every request is authenticated and authorized regardless of origin' },
  { id: 194, category: 'General', front: 'What is the principle of least astonishment in security?', back: 'Security controls should be predictable and understandable', hint: 'Avoid surprising behavior; clear defaults, explicit permissions' },
  { id: 195, category: 'General', front: 'What is the difference between authentication and authorization?', back: 'Authentication = who are you; Authorization = what can you do', hint: 'AuthN = identity; AuthZ = permissions' },
  { id: 196, category: 'General', front: 'What is a PodDisruptionBudget?', back: 'Ensures a minimum number of pods remain available during voluntary disruptions', hint: 'PDB = protects against draining, upgrades, or scaling events' },
  { id: 197, category: 'General', front: 'What is the HorizontalPodAutoscaler (HPA)?', back: 'Automatically scales pods based on CPU, memory, or custom metrics', hint: 'HPA = scale out/in; VPA = scale up/down (resource requests)' },
  { id: 198, category: 'General', front: 'What is the difference between HPA and VPA?', back: 'HPA changes pod count; VPA changes pod resource requests/limits', hint: 'HPA = horizontal scaling; VPA = vertical scaling' },
  { id: 199, category: 'General', front: 'What is a ResourceQuota?', back: 'Limits total resource consumption and object count per namespace', hint: 'Prevents a single namespace from consuming all cluster resources' },
  { id: 200, category: 'General', front: 'What is a LimitRange?', back: 'Sets default/min/max resource constraints for containers in a namespace', hint: 'Ensures no container requests 0 CPU or 100Gi memory by mistake' },
  { id: 201, category: 'General', front: 'What is the purpose of a PodSecurityContext?', back: 'Sets security settings for the entire pod (UID, GID, SELinux, seccomp)', hint: 'SecurityContext at pod level applies to all containers' },
  { id: 202, category: 'General', front: 'What is the difference between PodSecurityContext and container securityContext?', back: 'PodSecurityContext = pod-wide; container securityContext = per-container overrides', hint: 'Container-level settings override pod-level settings' },
  { id: 203, category: 'General', front: 'What is a NetworkPolicy default-deny egress?', back: 'Blocks all outgoing traffic unless explicitly allowed', hint: 'Useful for preventing data exfiltration from pods' },
  { id: 204, category: 'General', front: 'What is an init container?', back: 'A container that runs before app containers and must complete successfully', hint: 'Init containers = setup tasks (migrations, config generation)' },
  { id: 205, category: 'General', front: 'What is a sidecar container?', back: 'A secondary container that runs alongside the main app container in the same pod', hint: 'Sidecars = logging, monitoring, proxy, config reloading' },
  { id: 206, category: 'General', front: 'What is the difference between a headless service and ClusterIP?', back: 'Headless = no ClusterIP; returns pod IPs directly for direct pod-to-pod access', hint: 'Headless = clusterIP: None; useful for StatefulSets' },
  { id: 207, category: 'General', front: 'What is ExternalDNS?', back: 'Automatically creates DNS records in external providers for Kubernetes Services/Ingresses', hint: 'ExternalDNS = bridge between K8s and Route53/CloudDNS' },
  { id: 208, category: 'General', front: 'What is cert-manager used for?', back: 'Automatically provisions and renews TLS certificates in Kubernetes', hint: 'cert-manager = ACME/Let\'s Encrypt + internal CA automation' },
  { id: 209, category: 'General', front: 'What is the Kubernetes API aggregation layer?', back: 'Allows extending the API server with custom APIs via APIService objects', hint: 'Used by metrics-server, custom controllers, service catalog' },
  { id: 210, category: 'General', front: 'What is a CRD (CustomResourceDefinition)?', back: 'Extends the Kubernetes API with custom resource types', hint: 'CRD = define new K8s objects; operator = logic to manage them' },
];

export const quickRecallCategories = Array.from(
  new Set(quickRecallCards.map((c) => c.category))
);
