export interface GlossaryTerm {
  term: string;
  acronym?: string;
  definition: string;
  relatedTerms?: string[];
  domain?: number;
}

export const glossaryTerms: GlossaryTerm[] = [
  // === A ===
  {
    term: 'ABAC',
    acronym: 'Attribute-Based Access Control',
    definition: 'Legacy authorization method using policy files to define permissions based on attributes. Replaced by RBAC in modern Kubernetes due to complexity and lack of flexibility.',
    relatedTerms: ['RBAC', 'Authorization'],
    domain: 3,
  },
  {
    term: 'Admission Controller',
    definition: 'A Kubernetes plugin that intercepts API Server requests after authentication and authorization but before persistence. Can be mutating (modifies requests) or validating (approves/rejects only). Examples: NodeRestriction, ResourceQuota, PodSecurity.',
    relatedTerms: ['API Server', 'Mutating Admission Controller', 'Validating Admission Controller'],
    domain: 2,
  },
  {
    term: 'AES-GCM',
    acronym: 'Advanced Encryption Standard - Galois/Counter Mode',
    definition: 'Authenticated encryption algorithm used as one of the encryption at rest providers for etcd data. Provides both confidentiality and integrity.',
    relatedTerms: ['Encryption at Rest', 'AES-CBC', 'KMS'],
    domain: 3,
  },
  {
    term: 'AES-CBC',
    acronym: 'Advanced Encryption Standard - Cipher Block Chaining',
    definition: 'Older encryption at rest provider for etcd. Less secure than AES-GCM because it does not provide authenticated encryption. Being phased out in favor of KMS v2.',
    relatedTerms: ['Encryption at Rest', 'AES-GCM', 'KMS'],
    domain: 3,
  },
  {
    term: 'API Server',
    acronym: 'kube-apiserver',
    definition: 'The central management component of Kubernetes that exposes the Kubernetes API. Listens on port 6443. All components communicate through it, and it is the only component that talks directly to etcd.',
    relatedTerms: ['etcd', 'Kubelet', 'Admission Controller'],
    domain: 2,
  },
  {
    term: 'AppArmor',
    definition: 'Linux security module that uses profiles to restrict container capabilities. Alternative to SELinux. Enforces Mandatory Access Control (MAC) policies on programs.',
    relatedTerms: ['SELinux', 'seccomp', 'Capabilities'],
    domain: 2,
  },
  {
    term: 'Audit Log',
    definition: 'A record of API Server requests for compliance and forensics. Configured via AuditPolicy with different levels (Metadata, Request, RequestResponse) and backends.',
    relatedTerms: ['API Server', 'AuditPolicy', 'Compliance'],
    domain: 3,
  },
  // === B ===
  {
    term: 'Baseline',
    acronym: 'PSS Baseline',
    definition: 'The middle Pod Security Standard that prevents known privilege escalations while allowing common configurations. Forbids host namespaces, privileged containers, and some capabilities but is less restrictive than Restricted.',
    relatedTerms: ['Pod Security Standards', 'Restricted', 'Privileged'],
    domain: 3,
  },
  {
    term: 'Bind',
    acronym: 'RBAC verb',
    definition: 'An RBAC verb that allows a user to bind any Role or ClusterRole to themselves or others. This is a critical privilege escalation risk because it allows granting permissions without having them.',
    relatedTerms: ['RBAC', 'Escalate', 'Impersonate', 'RoleBinding'],
    domain: 3,
  },
  {
    term: 'Bound Token',
    definition: 'A short-lived ServiceAccount token created via the TokenRequest API. Bound to a specific pod with a limited lifetime and audience. Preferred since Kubernetes 1.24 over legacy long-lived tokens.',
    relatedTerms: ['ServiceAccount', 'TokenRequest', 'Legacy Token'],
    domain: 2,
  },
  // === C ===
  {
    term: 'CNI',
    acronym: 'Container Network Interface',
    definition: 'Standard interface between container runtimes and network plugins in Kubernetes. Examples include Calico, Cilium, Flannel, and Weave. CNI plugins handle pod networking, IP allocation, and network policies.',
    relatedTerms: ['NetworkPolicy', 'kube-proxy', 'Pod'],
    domain: 2,
  },
  {
    term: 'Capabilities',
    definition: 'Linux feature providing fine-grained privileges to processes. Containers should drop ALL capabilities and add only the minimum needed. Restricted PSS allows only NET_BIND_SERVICE.',
    relatedTerms: ['Pod Security Standards', 'seccomp', 'Privileged Container'],
    domain: 2,
  },
  {
    term: 'cert-manager',
    definition: 'Kubernetes add-on for automating TLS certificate management — issuance, renewal, and storing certificates as Secrets. Supports Let\'s Encrypt, HashiCorp Vault, and self-signed CAs.',
    relatedTerms: ['TLS', 'PKI', 'Secret', 'Certificate'],
    domain: 5,
  },
  {
    term: 'CIS',
    acronym: 'Center for Internet Security',
    definition: 'Non-profit organization that publishes security benchmarks, including the Kubernetes Benchmark. The CIS Kubernetes Benchmark is the industry standard for Kubernetes hardening.',
    relatedTerms: ['CIS Benchmark', 'kube-bench', 'Compliance'],
    domain: 6,
  },
  {
    term: 'CIS Benchmark',
    definition: 'Community-developed security configuration guide for Kubernetes. Provides prescriptive recommendations for securing clusters, assessed with tools like kube-bench.',
    relatedTerms: ['CIS', 'kube-bench', 'Hardening'],
    domain: 6,
  },
  {
    term: 'ClusterRole',
    definition: 'A cluster-wide RBAC role that defines permissions across all namespaces or for non-namespaced resources. Can also be used within a namespace via RoleBinding.',
    relatedTerms: ['Role', 'ClusterRoleBinding', 'RBAC', 'RoleBinding'],
    domain: 3,
  },
  {
    term: 'ClusterRoleBinding',
    definition: 'Binds a ClusterRole to subjects (users, groups, ServiceAccounts) across the entire cluster. Grants cluster-wide permissions. Contrast with RoleBinding which is namespace-scoped.',
    relatedTerms: ['ClusterRole', 'RoleBinding', 'RBAC'],
    domain: 3,
  },
  {
    term: 'Cosign',
    definition: 'Tool from the Sigstore project for signing and verifying container images. Supports key-based and keyless signing using OIDC identity. Integrates with OCI registries.',
    relatedTerms: ['Sigstore', 'Image Signing', 'Supply Chain'],
    domain: 5,
  },
  {
    term: 'CRI',
    acronym: 'Container Runtime Interface',
    definition: 'API between Kubernetes (Kubelet) and container runtimes. Implemented by containerd and CRI-O. Abstracts container operations so different runtimes can be used interchangeably.',
    relatedTerms: ['containerd', 'CRI-O', 'Kubelet', 'Runtime'],
    domain: 2,
  },
  {
    term: 'CRI-O',
    definition: 'Lightweight container runtime designed specifically for Kubernetes. Implements the Container Runtime Interface (CRI). Alternative to containerd, focused on simplicity and Kubernetes integration.',
    relatedTerms: ['CRI', 'containerd', 'Runtime'],
    domain: 2,
  },
  // === D ===
  {
    term: 'DaemonSet',
    definition: 'A Kubernetes workload resource that ensures a copy of a pod runs on every node. Useful for node-level services (logging, monitoring) but can be exploited by attackers for persistence.',
    relatedTerms: ['Deployment', 'Persistence', 'Node'],
    domain: 4,
  },
  {
    term: 'Default Deny',
    definition: 'A NetworkPolicy pattern that blocks all traffic by default, then selectively whitelists allowed traffic. Recommended security practice: start with default deny and explicitly allow needed communication.',
    relatedTerms: ['NetworkPolicy', 'Zero Trust', 'Security Policy'],
    domain: 3,
  },
  {
    term: 'Defense in Depth',
    definition: 'Security strategy using multiple layers of protection across the 4Cs (Cloud, Cluster, Container, Code). If one layer is compromised, other layers still provide protection.',
    relatedTerms: ['4Cs', 'Security Framework', 'Zero Trust'],
    domain: 1,
  },
  {
    term: 'DevSecOps',
    definition: 'Practice of integrating security into the DevOps pipeline. Shift-left security approach where security testing (SAST, DAST, image scanning) runs automatically in CI/CD.',
    relatedTerms: ['Shift-Left', 'CI/CD', 'SAST', 'DAST'],
    domain: 1,
  },
  {
    term: 'DAST',
    acronym: 'Dynamic Application Security Testing',
    definition: 'Testing running applications for vulnerabilities. Tools like OWASP ZAP scan live applications to find runtime security issues. Complements SAST which analyzes source code.',
    relatedTerms: ['SAST', 'Security Testing', 'DevSecOps'],
    domain: 1,
  },
  // === E ===
  {
    term: 'Encryption at Rest',
    definition: 'Encrypting data stored in etcd, especially Secrets. Providers include: identity (no encryption), aescbc, aesgcm, secretbox, kms v1, and kms v2 (recommended).',
    relatedTerms: ['etcd', 'KMS', 'Secret', 'AES-GCM'],
    domain: 3,
  },
  {
    term: 'EncryptionConfiguration',
    definition: 'Kubernetes resource defining encryption providers for etcd data. Specifies which provider to use and in what order for decrypting existing data.',
    relatedTerms: ['Encryption at Rest', 'etcd', 'KMS'],
    domain: 3,
  },
  {
    term: 'Escalate',
    acronym: 'RBAC verb',
    definition: 'An RBAC verb that allows creating or modifying roles to have more permissions than the creator currently possesses. Critical privilege escalation risk.',
    relatedTerms: ['RBAC', 'Bind', 'Impersonate', 'Privilege Escalation'],
    domain: 3,
  },
  {
    term: 'etcd',
    definition: 'Distributed key-value store holding all Kubernetes cluster state. Uses ports 2379 (client API) and 2380 (peer/Raft). Must have TLS enabled for both client and peer communication.',
    relatedTerms: ['API Server', 'Encryption at Rest', 'TLS'],
    domain: 2,
  },
  {
    term: 'Egress',
    definition: 'Outgoing network traffic from a pod. Controlled by NetworkPolicy egress rules. By default, all egress is allowed unless restricted by policy.',
    relatedTerms: ['Ingress', 'NetworkPolicy', 'Traffic'],
    domain: 3,
  },
  // === F ===
  {
    term: 'Falco',
    definition: 'CNCF incubating project for runtime security detection. Monitors syscalls and Kubernetes audit logs to detect anomalous behavior, unauthorized access, and policy violations at runtime.',
    relatedTerms: ['Runtime Security', 'Audit Log', 'seccomp'],
    domain: 5,
  },
  {
    term: 'Flat Network',
    definition: 'Default Kubernetes network model where all pods can communicate freely across all namespaces. Enables lateral movement if a pod is compromised. NetworkPolicies must be used for segmentation.',
    relatedTerms: ['NetworkPolicy', 'CNI', 'Lateral Movement'],
    domain: 4,
  },
  // === G ===
  {
    term: 'GDPR',
    acronym: 'General Data Protection Regulation',
    definition: 'EU data protection law affecting Kubernetes deployments handling EU citizen data. Requires data protection measures, breach notification, and privacy by design.',
    relatedTerms: ['Compliance', 'HIPAA', 'PCI DSS', 'Data Protection'],
    domain: 6,
  },
  // === H ===
  {
    term: 'HIPAA',
    acronym: 'Health Insurance Portability and Accountability Act',
    definition: 'US healthcare data protection law. Kubernetes deployments handling PHI (Protected Health Information) must implement HIPAA-compliant security controls.',
    relatedTerms: ['Compliance', 'GDPR', 'PCI DSS'],
    domain: 6,
  },
  {
    term: 'hostNetwork',
    definition: 'Pod spec field that gives the pod the host\'s network namespace. High security risk — the pod can bind to any host port and access all host network interfaces. Forbidden by Baseline and Restricted PSS.',
    relatedTerms: ['hostPID', 'hostIPC', 'Pod Security Standards'],
    domain: 2,
  },
  {
    term: 'hostPath',
    definition: 'Volume type that mounts a host directory into a pod. Can enable container escape by exposing host filesystem. Restricted PSS only allows 8 safe volume types.',
    relatedTerms: ['Volume', 'Container Escape', 'Pod Security Standards'],
    domain: 4,
  },
  {
    term: 'hostPID',
    definition: 'Pod spec field that gives the pod the host\'s PID namespace. Extremely high security risk — allows seeing and interacting with host processes. Forbidden by both Baseline and Restricted PSS.',
    relatedTerms: ['hostNetwork', 'hostIPC', 'Privileged Container'],
    domain: 2,
  },
  // === I ===
  {
    term: 'Identity Provider',
    definition: 'External system for authentication (e.g., Okta, Azure AD, Google). Used with OIDC to integrate external identity into Kubernetes cluster authentication.',
    relatedTerms: ['OIDC', 'Authentication', 'ServiceAccount'],
    domain: 2,
  },
  {
    term: 'Impersonate',
    acronym: 'RBAC verb',
    definition: 'An RBAC verb that allows acting as another user or group. Critical privilege escalation risk — enables gaining all permissions of the impersonated account.',
    relatedTerms: ['RBAC', 'Escalate', 'Bind', 'Spoofing'],
    domain: 3,
  },
  {
    term: 'Ingress',
    definition: 'Incoming network traffic to a pod. Controlled by NetworkPolicy ingress rules. Also refers to the Kubernetes API object for HTTP routing (Ingress resource).',
    relatedTerms: ['Egress', 'NetworkPolicy', 'Service'],
    domain: 3,
  },
  {
    term: 'IPVS',
    acronym: 'IP Virtual Server',
    definition: 'Kernel-level load balancing mode for kube-proxy. Better performance than iptables at scale due to O(1) lookup complexity regardless of service count.',
    relatedTerms: ['kube-proxy', 'iptables', 'Service'],
    domain: 2,
  },
  // === K ===
  {
    term: 'KMS',
    acronym: 'Key Management Service',
    definition: 'External key management for etcd encryption at rest. KMS v2 is recommended over v1 for better performance and security. Enables integration with cloud provider key management services.',
    relatedTerms: ['Encryption at Rest', 'etcd', 'AES-GCM'],
    domain: 3,
  },
  {
    term: 'Kube-bench',
    definition: 'Tool from Aqua Security for running CIS Kubernetes Benchmark checks. Outputs pass/fail/warn results for each benchmark item. Run as a Job in the cluster.',
    relatedTerms: ['CIS Benchmark', 'Compliance', 'Automation'],
    domain: 6,
  },
  {
    term: 'Kubeconfig',
    definition: 'Client configuration file containing cluster, user, and context definitions for kubectl. Located at ~/.kube/config by default. Includes server URL, credentials, and context mappings.',
    relatedTerms: ['kubectl', 'Context', 'Authentication'],
    domain: 2,
  },
  {
    term: 'Kubelet',
    definition: 'Agent running on each worker node that manages pod lifecycle. Communicates with the API Server. Port 10250 (HTTPS). Must have --anonymous-auth=false and --authorization-mode=Webhook.',
    relatedTerms: ['Node', 'API Server', 'Pod', 'Kube-proxy'],
    domain: 2,
  },
  {
    term: 'Kubescape',
    definition: 'Security scanner by ARMO that evaluates Kubernetes clusters against multiple frameworks: NSA, MITRE, CIS. Provides risk scoring and remediation suggestions.',
    relatedTerms: ['kube-bench', 'Security Scanner', 'Compliance'],
    domain: 6,
  },
  {
    term: 'Kyverno',
    definition: 'Kubernetes-native policy engine using YAML-based policies for validation, mutation, and generation. Alternative to OPA Gatekeeper — more accessible as it uses familiar YAML instead of Rego.',
    relatedTerms: ['OPA', 'Admission Controller', 'Policy'],
    domain: 5,
  },
  // === L ===
  {
    term: 'LimitRange',
    definition: 'Sets default and maximum resource constraints (CPU, memory) for containers in a namespace. A mutating admission controller that applies defaults if not specified.',
    relatedTerms: ['ResourceQuota', 'Namespace', 'Admission Controller'],
    domain: 3,
  },
  {
    term: 'Linkerd',
    definition: 'Lightweight service mesh providing automatic mTLS and observability. Simpler than Istio with lower resource overhead. Uses a sidecar-less architecture in newer versions.',
    relatedTerms: ['Service Mesh', 'Istio', 'mTLS'],
    domain: 5,
  },
  {
    term: 'Lateral Movement',
    definition: 'Attack technique where a compromised pod attempts to access other pods, services, or cluster resources. Enabled by Kubernetes\' default flat network unless NetworkPolicies restrict traffic.',
    relatedTerms: ['Flat Network', 'NetworkPolicy', 'Threat Model'],
    domain: 4,
  },
  {
    term: 'Legacy Token',
    definition: 'Long-lived ServiceAccount token stored as a Kubernetes Secret. Automatically created before Kubernetes 1.24. Less secure than bound tokens because they do not expire and are valid cluster-wide.',
    relatedTerms: ['Bound Token', 'ServiceAccount', 'Secret'],
    domain: 2,
  },
  // === M ===
  {
    term: 'MITRE ATT&CK',
    definition: 'Globally accessible knowledge base of adversary tactics and techniques. Has a Containers matrix mapping attacker behaviors to Kubernetes-specific techniques and mitigations.',
    relatedTerms: ['STRIDE', 'Threat Model', 'Containers Matrix'],
    domain: 6,
  },
  {
    term: 'mTLS',
    acronym: 'Mutual TLS',
    definition: 'Both client and server present certificates for mutual authentication. Used in service meshes (Istio, Linkerd) to secure service-to-service communication with strong identity verification.',
    relatedTerms: ['TLS', 'Service Mesh', 'Certificate'],
    domain: 5,
  },
  {
    term: 'Mutating Admission Controller',
    definition: 'An admission controller that can modify API requests/objects before they are persisted. Examples: LimitRanger (applies resource defaults), ServiceAccount (adds default SA). Contrast with validating controllers that only approve/reject.',
    relatedTerms: ['Validating Admission Controller', 'Admission Controller', 'LimitRanger'],
    domain: 2,
  },
  // === N ===
  {
    term: 'Namespace',
    definition: 'Logical isolation boundary in Kubernetes. Provides scope for resource names but NOT network isolation by default. Used to organize resources and apply policies (RBAC, ResourceQuota) per tenant.',
    relatedTerms: ['NetworkPolicy', 'ResourceQuota', 'RBAC'],
    domain: 3,
  },
  {
    term: 'NetworkPolicy',
    definition: 'Resource for controlling pod-to-pod traffic at L3/L4. Default: allow ALL traffic. First policy on a pod isolates that traffic direction. Selectors: podSelector, namespaceSelector, ipBlock. Policies are additive (OR logic).',
    relatedTerms: ['CNI', 'Ingress', 'Egress', 'Default Deny'],
    domain: 3,
  },
  {
    term: 'Node',
    definition: 'Worker machine in a Kubernetes cluster that runs Kubelet, container runtime, and kube-proxy. The control plane (API Server, etcd, etc.) may run on dedicated master nodes or co-located.',
    relatedTerms: ['Kubelet', 'Kube-proxy', 'Cluster'],
    domain: 2,
  },
  {
    term: 'NodeRestriction',
    definition: 'Built-in admission controller limiting each Kubelet to modifying only pods bound to its own node. Prevents Kubelets from seeing or modifying other nodes\' pods. Essential for multi-node security.',
    relatedTerms: ['Kubelet', 'Admission Controller', 'Node'],
    domain: 2,
  },
  {
    term: 'NIST',
    acronym: 'National Institute of Standards and Technology',
    definition: 'US federal agency that publishes cybersecurity standards. Relevant publications: SP 800-53 (security controls), SP 800-190 (container security guide), and SP 800-204 (microservices security).',
    relatedTerms: ['Compliance', 'Security Framework', 'SP 800-53'],
    domain: 6,
  },
  {
    term: 'NSA/CISA Kubernetes Hardening Guide',
    definition: 'Government guidance published by the US National Security Agency and Cybersecurity and Infrastructure Security Agency for securing Kubernetes clusters. Covers network separation, authentication, audit logging, and more.',
    relatedTerms: ['Hardening', 'Security Guide', 'CISA'],
    domain: 6,
  },
  // === O ===
  {
    term: 'OIDC',
    acronym: 'OpenID Connect',
    definition: 'Authentication protocol for integrating external identity providers with Kubernetes. Enables SSO and centralized identity management. Recommended over X.509 for user authentication at scale.',
    relatedTerms: ['Authentication', 'Identity Provider', 'OAuth'],
    domain: 3,
  },
  {
    term: 'OPA',
    acronym: 'Open Policy Agent',
    definition: 'General-purpose policy engine using the Rego policy language. Gatekeeper is its Kubernetes integration, providing admission control based on custom policies.',
    relatedTerms: ['Gatekeeper', 'Kyverno', 'Admission Controller', 'Rego'],
    domain: 5,
  },
  {
    term: 'OCTAVE',
    acronym: 'Operationally Critical Threat, Asset, and Vulnerability Evaluation',
    definition: 'Risk-based threat modeling framework focused on organizational risk. Identifies critical assets, evaluates threats, and prioritizes mitigation based on operational impact.',
    relatedTerms: ['Threat Modeling', 'PASTA', 'STRIDE', 'Risk Assessment'],
    domain: 6,
  },
  // === P ===
  {
    term: 'PASTA',
    acronym: 'Process for Attack Simulation and Threat Analysis',
    definition: 'Seven-stage risk-centric threat modeling process: Define objectives, Define technical scope, Application decomposition, Threat analysis, Vulnerability analysis, Attack modeling, Risk analysis.',
    relatedTerms: ['Threat Modeling', 'STRIDE', 'OCTAVE'],
    domain: 6,
  },
  {
    term: 'PCI DSS',
    acronym: 'Payment Card Industry Data Security Standard',
    definition: 'Security standard for organizations that handle credit card data. Applies to containerized payment processing environments with requirements for network segmentation, access control, and encryption.',
    relatedTerms: ['Compliance', 'GDPR', 'HIPAA'],
    domain: 6,
  },
  {
    term: 'PKI',
    acronym: 'Public Key Infrastructure',
    definition: 'System for managing certificates and public-key encryption. Kubernetes uses extensive internal PKI for component-to-component TLS, client certificates, and service mesh identity.',
    relatedTerms: ['Certificate', 'TLS', 'mTLS', 'cert-manager'],
    domain: 5,
  },
  {
    term: 'Pod',
    definition: 'Smallest deployable unit in Kubernetes. Contains one or more containers that share network namespace and storage. The basic building block of Kubernetes workloads.',
    relatedTerms: ['Container', 'Deployment', 'Namespace'],
    domain: 2,
  },
  {
    term: 'Pod Security Admission',
    acronym: 'PSA',
    definition: 'Built-in admission controller enforcing Pod Security Standards via namespace labels. Replaced Pod Security Policies (PSP) in Kubernetes 1.25. Supports enforce, warn, and audit modes.',
    relatedTerms: ['Pod Security Standards', 'PSS', 'Admission Controller', 'Namespace'],
    domain: 3,
  },
  {
    term: 'Pod Security Policy',
    acronym: 'PSP',
    definition: 'Deprecated admission controller for pod security. Removed in Kubernetes 1.25. Was complex and confusing. Replaced by Pod Security Admission (PSA).',
    relatedTerms: ['Pod Security Admission', 'PSS', 'Deprecated'],
    domain: 3,
  },
  {
    term: 'Pod Security Standards',
    acronym: 'PSS',
    definition: 'Three security profiles defined by Kubernetes SIG-Security: Privileged (unrestricted), Baseline (prevents known privilege escalations), and Restricted (follows hardening best practices). Enforced by PSA.',
    relatedTerms: ['Pod Security Admission', 'Baseline', 'Restricted', 'Privileged'],
    domain: 3,
  },
  {
    term: 'Privileged',
    acronym: 'PSS Privileged',
    definition: 'The most permissive Pod Security Standard. No restrictions — allows privileged containers, host namespaces, and any capabilities. Only for trusted, system-level workloads.',
    relatedTerms: ['Pod Security Standards', 'Baseline', 'Restricted'],
    domain: 3,
  },
  {
    term: 'Privileged Container',
    definition: 'Container with full access to host devices (securityContext.privileged: true). Major container escape vector. Forbidden by both Baseline and Restricted PSS profiles.',
    relatedTerms: ['Container Escape', 'Pod Security Standards', 'Security Context'],
    domain: 4,
  },
  // === R ===
  {
    term: 'RBAC',
    acronym: 'Role-Based Access Control',
    definition: 'Primary Kubernetes authorization method. Uses Roles (namespace-scoped), ClusterRoles (cluster-wide), RoleBindings, and ClusterRoleBindings to define and assign permissions. Has 11 verbs.',
    relatedTerms: ['Role', 'ClusterRole', 'RoleBinding', 'Authorization'],
    domain: 3,
  },
  {
    term: 'ReadOnlyRootFilesystem',
    definition: 'Security setting preventing writes to the container root filesystem. Required by Restricted PSS. Containers should write to mounted volumes only. Prevents attackers from modifying container files.',
    relatedTerms: ['Pod Security Standards', 'Security Context', 'Volume'],
    domain: 3,
  },
  {
    term: 'Rego',
    definition: 'Declarative policy language used by Open Policy Agent (OPA) and Gatekeeper. Used to write custom admission control policies for Kubernetes. Contrast with Kyverno which uses YAML.',
    relatedTerms: ['OPA', 'Gatekeeper', 'Kyverno', 'Admission Controller'],
    domain: 5,
  },
  {
    term: 'ResourceQuota',
    definition: 'Limits aggregate resource consumption per namespace. Prevents DoS via resource exhaustion by capping total CPU, memory, pod count, and other resources a namespace can consume.',
    relatedTerms: ['LimitRange', 'Namespace', 'DoS', 'Admission Controller'],
    domain: 4,
  },
  {
    term: 'Restricted',
    acronym: 'PSS Restricted',
    definition: 'The most restrictive Pod Security Standard. Follows current hardening best practices: requires runAsNonRoot, drops ALL capabilities, uses RuntimeDefault seccomp, and requires readOnlyRootFilesystem.',
    relatedTerms: ['Pod Security Standards', 'Baseline', 'Privileged'],
    domain: 3,
  },
  {
    term: 'Role',
    definition: 'Namespace-scoped RBAC role defining permissions within a single namespace. Cannot grant access to cluster-scoped or non-namespaced resources — use ClusterRole for those.',
    relatedTerms: ['ClusterRole', 'RoleBinding', 'RBAC', 'Namespace'],
    domain: 3,
  },
  {
    term: 'RoleBinding',
    definition: 'Binds a Role or ClusterRole to subjects (users, groups, ServiceAccounts) within a single namespace. The permissions are scoped to that namespace only, even when referencing a ClusterRole.',
    relatedTerms: ['Role', 'ClusterRoleBinding', 'RBAC'],
    domain: 3,
  },
  {
    term: 'Runtime',
    definition: 'Software responsible for running containers. Implements the Container Runtime Interface (CRI). Examples: containerd, CRI-O. Handles image pulling, container lifecycle, and low-level resource isolation.',
    relatedTerms: ['CRI', 'containerd', 'CRI-O', 'Kubelet'],
    domain: 2,
  },
  // === S ===
  {
    term: 'SAST',
    acronym: 'Static Application Security Testing',
    definition: 'Analyzing source code for vulnerabilities without executing it. Integrates into CI/CD pipelines for shift-left security. Complements DAST which tests running applications.',
    relatedTerms: ['DAST', 'DevSecOps', 'Shift-Left', 'Security Testing'],
    domain: 1,
  },
  {
    term: 'SBOM',
    acronym: 'Software Bill of Materials',
    definition: 'Machine-readable inventory of all components in software. Formats: SPDX and CycloneDX. Essential for supply chain security, vulnerability tracking, and license compliance.',
    relatedTerms: ['Supply Chain', 'SLSA', 'Compliance'],
    domain: 5,
  },
  {
    term: 'seccomp',
    acronym: 'Secure Computing Mode',
    definition: 'Linux feature that filters available syscalls for a process. The RuntimeDefault profile is recommended over Unconfined. Restricted PSS requires RuntimeDefault or Localhost seccomp profiles.',
    relatedTerms: ['AppArmor', 'SELinux', 'Capabilities', 'Pod Security Standards'],
    domain: 2,
  },
  {
    term: 'Secret',
    definition: 'Kubernetes API object for storing sensitive data like passwords, tokens, and keys. Stored in etcd — must enable encryption at rest! Access should be restricted via RBAC.',
    relatedTerms: ['etcd', 'Encryption at Rest', 'ConfigMap', 'RBAC'],
    domain: 3,
  },
  {
    term: 'Secretbox',
    definition: 'Encryption at rest provider using XSalsa20 and Poly1305 for authenticated encryption. More secure than aescbc but KMS v2 is now the recommended provider.',
    relatedTerms: ['Encryption at Rest', 'KMS', 'AES-GCM'],
    domain: 3,
  },
  {
    term: 'Security Context',
    definition: 'Pod/Container-level settings for privileges: runAsNonRoot, runAsUser, capabilities, seccompProfile, readOnlyRootFilesystem, allowPrivilegeEscalation. Defines the security posture of a pod or container.',
    relatedTerms: ['Pod Security Standards', 'Capabilities', 'seccomp'],
    domain: 3,
  },
  {
    term: 'SELinux',
    acronym: 'Security-Enhanced Linux',
    definition: 'Label-based mandatory access control (MAC) common in RHEL/CentOS. Uses security contexts on files and processes to enforce access policies. Alternative to AppArmor.',
    relatedTerms: ['AppArmor', 'seccomp', 'MAC'],
    domain: 2,
  },
  {
    term: 'ServiceAccount',
    definition: 'Identity for processes running in pods. Provides API access tokens. Since Kubernetes 1.24, tokens are no longer automatically created as Secrets — use TokenRequest API for bound tokens.',
    relatedTerms: ['Token', 'RBAC', 'Authentication', 'Bound Token'],
    domain: 3,
  },
  {
    term: 'Service Mesh',
    definition: 'Infrastructure layer adding security (mTLS), observability, and reliability to service communication. Examples: Istio, Linkerd. Uses sidecar proxies to intercept and manage traffic.',
    relatedTerms: ['mTLS', 'Istio', 'Linkerd', 'Observability'],
    domain: 5,
  },
  {
    term: 'Shift-Left',
    definition: 'Integrating security early in the development lifecycle. Core DevSecOps principle — catch security issues in code, not production. Includes SAST, dependency scanning, and policy checks in CI/CD.',
    relatedTerms: ['DevSecOps', 'SAST', 'CI/CD'],
    domain: 1,
  },
  {
    term: 'SLSA',
    acronym: 'Supply-chain Levels for Software Artifacts',
    definition: 'Framework with 4 levels (1-4) for supply chain security. Level 4 requires two-person review and reproducible builds. Guides organizations in securing their software supply chain.',
    relatedTerms: ['Supply Chain', 'SBOM', 'Compliance'],
    domain: 5,
  },
  {
    term: 'STRIDE',
    definition: 'Microsoft\'s threat classification model: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Used to systematically identify and categorize threats.',
    relatedTerms: ['Threat Model', 'MITRE ATT&CK', 'OCTAVE', 'PASTA'],
    domain: 6,
  },
  {
    term: 'Supply Chain',
    definition: 'All steps from source code to running application: development, source control, CI/CD, image registry, runtime deployment. Each step is a potential attack vector requiring security controls.',
    relatedTerms: ['SLSA', 'SBOM', 'Cosign', 'Image Scanning'],
    domain: 5,
  },
  // === T ===
  {
    term: 'Trivy',
    definition: 'Comprehensive vulnerability scanner for containers, filesystems, and repositories by Aqua Security. Scans images for CVEs, checks IaC misconfigurations, and detects secrets.',
    relatedTerms: ['Image Scanning', 'CVE', 'Security Scanner'],
    domain: 5,
  },
  {
    term: 'Trust Boundary',
    definition: 'Point where data passes between components with different privilege levels or trust assumptions. In Kubernetes: user-to-API Server, pod-to-pod, container-to-host, cluster-to-external-service.',
    relatedTerms: ['Threat Model', 'STRIDE', 'Security Architecture'],
    domain: 4,
  },
  {
    term: 'Typosquatting',
    definition: 'Attack where malicious images use names similar to legitimate ones (e.g., "nginix" instead of "nginx"). Users who mistype image names may pull and run malicious containers.',
    relatedTerms: ['Supply Chain', 'Image Security', 'Container Registry'],
    domain: 5,
  },
  // === V ===
  {
    term: 'Validating Admission Controller',
    definition: 'An admission controller that can only approve or reject API requests. Cannot modify objects. Examples: NodeRestriction, ResourceQuota, PodSecurity. Contrast with mutating controllers.',
    relatedTerms: ['Mutating Admission Controller', 'Admission Controller', 'NodeRestriction'],
    domain: 2,
  },
  {
    term: 'Vault',
    acronym: 'HashiCorp Vault',
    definition: 'Secret management tool for storing and accessing credentials, API keys, and certificates. Integrates with Kubernetes via the Vault Agent Injector or CSI driver for external secret management.',
    relatedTerms: ['Secret', 'External Secrets', 'PKI'],
    domain: 5,
  },
  {
    term: 'Volume',
    definition: 'Mountable storage available to pods. Restricted PSS allows only 8 volume types: configMap, downwardAPI, emptyDir, projected, secret, persistentVolumeClaim, ephemeral, csi.',
    relatedTerms: ['Pod Security Standards', 'PersistentVolumeClaim', 'Storage'],
    domain: 3,
  },
  // === W ===
  {
    term: 'Webhook',
    definition: 'HTTP callback mechanism used for authentication (Webhook token) and authorization (Webhook mode). The API Server sends requests to an external service for authentication/authorization decisions.',
    relatedTerms: ['Authentication', 'Authorization', 'API Server'],
    domain: 3,
  },
  {
    term: 'Wildcard',
    acronym: 'RBAC Wildcard',
    definition: 'Using * for resources or verbs in RBAC rules. Grants excessive permissions and should be avoided in production. Use explicit resource names and verbs instead for least-privilege access.',
    relatedTerms: ['RBAC', 'Least Privilege', 'Security Best Practice'],
    domain: 3,
  },
];

export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return glossaryTerms.filter((t) => t.term[0].toUpperCase() === letter.toUpperCase());
}

export function getAllLetters(): string[] {
  const letters = new Set<string>();
  glossaryTerms.forEach((t) => {
    if (t.term[0]) letters.add(t.term[0].toUpperCase());
  });
  return Array.from(letters).sort();
}
