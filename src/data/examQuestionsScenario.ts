import type { ExamQuestion } from './examQuestions'

export const examQuestionsScenario: ExamQuestion[] = [
  // ===== SCENARIO 1: Pod Security violations (5 questions) — Domain 3 =====
  {
    id: 273,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `Given this Pod spec, what is the PRIMARY security concern?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: web-app
spec:
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      privileged: true
      runAsRoot: true
    volumeMounts:
    - name: host
      mountPath: /host
  volumes:
  - name: host
    hostPath:
      path: /
\`\`\``,
    options: ['Using :latest tag', 'Privileged + hostPath root', 'No resource limits', 'Missing liveness probe'],
    correctAnswer: 1,
    explanation: 'privileged: true gives full host device access. hostPath: / mounts the entire host filesystem. Combined with runAsRoot, this is an instant container escape to host root. The :latest tag is a secondary concern.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 274,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `A security audit flags this Pod. What is the MOST critical issue?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: monitoring-agent
spec:
  hostPID: true
  hostNetwork: true
  containers:
  - name: agent
    image: monitoring:v1.2
    securityContext:
      privileged: true
\`\`\``,
    options: ['Image is not using :latest', 'hostPID + hostNetwork + privileged enables trivial container escape', 'Missing resource limits', 'No nodeSelector specified'],
    correctAnswer: 1,
    explanation: 'hostPID: true shares the host PID namespace, allowing process visibility and signal sending. hostNetwork: true shares the host network stack. privileged: true grants full device access. Together they provide multiple trivial paths for container escape and host compromise.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 275,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `What security control is MISSING in this Pod that would mitigate root-level exploits?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: batch-processor
spec:
  containers:
  - name: worker
    image: batch:v3
    securityContext:
      runAsRoot: true
      allowPrivilegeEscalation: true
\`\`\``,
    options: ['seccomp profile', 'AppArmor annotation', 'SELinux context', 'PodDisruptionBudget'],
    correctAnswer: 0,
    explanation: 'A seccomp (Secure Computing Mode) profile restricts the syscalls a container can make, dramatically reducing kernel attack surface. With runAsRoot and allowPrivilegeEscalation: true, missing seccomp is a major gap. The fix is to add seccompProfile.type: RuntimeDefault or a custom profile.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 276,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `This Deployment is deployed to a namespace enforcing the restricted Pod Security Standard. What will happen?

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api:1.0
        securityContext:
          privileged: true
          runAsUser: 0
        ports:
        - containerPort: 8080
\`\`\``,
    options: ['Deployment will run successfully', 'Pod creation will be denied by the Pod Security Admission controller', 'Deployment will run but kubelet will reject it', 'Only the replicaset will be created'],
    correctAnswer: 1,
    explanation: 'The restricted Pod Security Standard forbids privileged: true and requires runAsNonRoot. When a namespace is labeled with pod-security.kubernetes.io/enforce=restricted, the Pod Security Admission controller rejects any Pod spec that violates these constraints at creation time.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 277,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `What is the primary risk of this Pod configuration?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-helper
spec:
  hostIPC: true
  containers:
  - name: helper
    image: helper:v1
    volumeMounts:
    - name: etc
      mountPath: /etc-host
  volumes:
  - name: etc
    hostPath:
      path: /etc
\`\`\``,
    options: ['Missing readiness probe', 'hostIPC + hostPath /etc exposes host system configuration', 'Image uses a fixed tag', 'No network policy attached'],
    correctAnswer: 1,
    explanation: 'hostIPC: true shares the host inter-process communication namespace, allowing shared memory access with host processes. Mounting /etc via hostPath exposes sensitive host configuration files. Combined, this provides a path to inspect or modify host system state from within the container.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },

  // ===== SCENARIO 2: RBAC over-permissions (5 questions) — Domain 3 =====
  {
    id: 278,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `What is the PRIMARY risk in this Role?

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: secret-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["*"]
\`\`\``,
    options: ['It applies to the wrong namespace', 'Wildcard verbs on secrets grant full CRUD access', 'Missing apiGroups', 'No resourceNames specified'],
    correctAnswer: 1,
    explanation: 'verbs: ["*"] grants ALL actions (get, list, watch, create, update, patch, delete) on secrets. This violates least privilege. The fix is to enumerate only required verbs, e.g., ["get", "list"], and add resourceNames to scope to specific secrets if possible.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 279,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `This RoleBinding was found in a cluster security audit. What is the MOST critical issue?

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: super-admin
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
\`\`\``,
    options: ['RoleBinding is in the default namespace', 'The default ServiceAccount is bound to cluster-admin', 'A RoleBinding cannot reference a ClusterRole', 'Missing apiGroup in roleRef'],
    correctAnswer: 1,
    explanation: 'Binding cluster-admin to the default ServiceAccount means every Pod that runs without an explicit serviceAccountName gets cluster-wide root-equivalent access. The default ServiceAccount is automatically mounted into Pods unless automountServiceAccountToken: false is set. This is a critical privilege escalation vector.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 280,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `What is wrong with this ClusterRole from a least-privilege perspective?

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: broad-reader
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["get", "list", "watch"]
\`\`\``,
    options: ['Read-only verbs cannot cause harm', 'It grants read access to ALL resources cluster-wide', 'Missing nonResourceURLs', 'ClusterRoles should only be used for nodes'],
    correctAnswer: 1,
    explanation: 'apiGroups: ["*"], resources: ["*"] grants read access to every resource type across all API groups cluster-wide, including secrets, configmaps, and custom resources. Even read-only access to secrets is a significant credential exposure risk. The fix is to enumerate exact apiGroups and resources needed.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 281,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `This Role was created for a CI/CD service account. What is the security concern?

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: cicd-deployer
  namespace: staging
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
\`\`\``,
    options: ['The CI/CD account should be a ClusterRole', 'Full CRUD on secrets violates least privilege', 'Missing endpoints resource', 'Should use impersonation'],
    correctAnswer: 1,
    explanation: 'A CI/CD deployer needs to create/update pods, services, and configmaps, but rarely needs full CRUD on secrets. Granting delete and update on secrets means a compromised CI/CD pipeline can exfiltrate or destroy all secrets in the namespace. Separate secret management into a dedicated role with minimal verbs.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c3',
  },
  {
    id: 282,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `What is the risk of this ClusterRoleBinding?

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: everyone-is-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
\`\`\``,
    options: ['Group names must be prefixed with oidc:', 'system:authenticated includes ANY authenticated user in the cluster', 'ClusterRoleBinding should use a Role instead', 'system:authenticated is not a valid group'],
    correctAnswer: 1,
    explanation: 'system:authenticated is a virtual group containing every user who has successfully authenticated to the API server, regardless of identity source. Binding cluster-admin to this group grants cluster-wide root-equivalent access to every single authenticated user, including service accounts and OIDC users.',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c3',
  },

  // ===== SCENARIO 3: NetworkPolicy gaps (5 questions) — Domain 5 =====
  {
    id: 283,
    domain: 5,
    domainName: 'Platform Security',
    question: `This namespace contains sensitive payment processing Pods. What is the security gap?

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: payments
---
# No NetworkPolicy resources exist in this namespace
\`\`\``,
    options: ['Namespace name is too short', 'Default-deny is not implemented; all pod-to-pod traffic is allowed', 'Missing ResourceQuota', 'Pods should use a dedicated node pool'],
    correctAnswer: 1,
    explanation: 'Without any NetworkPolicy, Kubernetes defaults to allow-all for both ingress and egress. Any compromised Pod in the cluster can reach payment processing Pods. The fix is to deploy a default-deny NetworkPolicy and then explicitly allow required traffic.',
    difficulty: 'Medium',
    relatedSection: '/domain5/d5-c1',
  },
  {
    id: 284,
    domain: 5,
    domainName: 'Platform Security',
    question: `What is the PRIMARY limitation of this NetworkPolicy?

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress
  namespace: frontend
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: backend
    ports:
    - protocol: TCP
      port: 8080
\`\`\``,
    options: ['It blocks all egress traffic', 'Ingress is fine but egress is unrestricted', 'It should use podSelector instead of namespaceSelector', 'Port 8080 is not a standard port'],
    correctAnswer: 1,
    explanation: 'The policy only specifies policyTypes: [Ingress]. Without an explicit egress policy, all outbound traffic from the web Pods is allowed. A compromised web Pod could exfiltrate data to external C2 servers. The fix is to add an egress rule set with policyTypes: [Ingress, Egress].',
    difficulty: 'Hard',
    relatedSection: '/domain5/d5-c1',
  },
  {
    id: 285,
    domain: 5,
    domainName: 'Platform Security',
    question: `An attacker gained access to a Pod in namespace 'dev'. Which NetworkPolicy misconfiguration enabled lateral movement to 'production'?

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: cross-ns
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 9090
\`\`\``,
    options: ['namespaceSelector: {} matches ALL namespaces', 'port 9090 is exposed', 'Missing egress policy', 'Should use podSelector instead'],
    correctAnswer: 0,
    explanation: 'namespaceSelector: {} with no matchLabels matches every namespace in the cluster. This means any Pod in any namespace (including dev) can reach production APIs on port 9090. The fix is to specify exact namespace labels in matchLabels, e.g., matchLabels: { name: trusted }.',
    difficulty: 'Hard',
    relatedSection: '/domain5/d5-c1',
  },
  {
    id: 286,
    domain: 5,
    domainName: 'Platform Security',
    question: `What is the effect of deploying this NetworkPolicy in a namespace with 50 Pods?

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector: {}
    ports:
    - protocol: TCP
      port: 80
\`\`\``,
    options: ['Only port 80 is open between all Pods in the namespace', 'All Pods can reach each other on port 80, but nothing is restricted across namespaces', 'All traffic is blocked', 'All ingress from any namespace is allowed on port 80'],
    correctAnswer: 1,
    explanation: 'podSelector: {} selects ALL Pods in the namespace. The ingress rule allows traffic from any Pod in the same namespace on port 80. However, this policy does NOT restrict cross-namespace traffic or egress, leaving a broad attack surface. A more targeted policy should use specific matchLabels.',
    difficulty: 'Medium',
    relatedSection: '/domain5/d5-c1',
  },
  {
    id: 287,
    domain: 5,
    domainName: 'Platform Security',
    question: `What critical ingress risk exists in this NetworkPolicy?

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: web-allow
  namespace: public
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
  - Ingress
  ingress:
  - from:
    - ipBlock:
        cidr: 0.0.0.0/0
    ports:
    - protocol: TCP
      port: 80
\`\`\``,
    options: ['Should use HTTPS on 443', 'ipBlock 0.0.0.0/0 allows traffic from ANY source', 'Missing namespaceSelector', 'port 80 is deprecated'],
    correctAnswer: 1,
    explanation: 'ipBlock.cidr: 0.0.0.0/0 allows ingress from any IP address on the internet. If this policy is applied to internal-only services, it exposes them publicly. NetworkPolicy should restrict to known CIDR ranges, namespaceSelectors, or podSelectors. Ingress controllers should handle external exposure, not broad ipBlock rules.',
    difficulty: 'Hard',
    relatedSection: '/domain5/d5-c1',
  },

  // ===== SCENARIO 4: Image security (5 questions) — Domain 2 =====
  {
    id: 288,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `What is the primary supply-chain risk in this Deployment?

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    spec:
      containers:
      - name: app
        image: myregistry/frontend:latest
        ports:
        - containerPort: 3000
\`\`\``,
    options: ['No readiness probe', 'Using :latest tag makes builds non-reproducible and hides version', 'Port 3000 is not standard', 'Missing resource limits'],
    correctAnswer: 1,
    explanation: 'The :latest tag is mutable — the same tag can point to different image digests over time. This makes deployments non-reproducible, hides what version is actually running, and bypasses image pinning verification. The fix is to use immutable tags or digests, e.g., image: myregistry/frontend:v1.2.3@sha256:abc...',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c1',
  },
  {
    id: 289,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `A cluster security scan flagged this workload. What is the MOST critical image security issue?

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-agent
spec:
  selector:
    matchLabels:
      name: node-agent
  template:
    spec:
      containers:
      - name: agent
        image: docker.io/unknown/node-agent
        imagePullPolicy: IfNotPresent
\`\`\``,
    options: ['DaemonSet runs on all nodes', 'Untrusted public registry with no signature verification and IfNotPresent caching', 'Missing resource limits', 'No nodeSelector'],
    correctAnswer: 1,
    explanation: 'docker.io/unknown/node-agent is from an untrusted public registry with no provenance. imagePullPolicy: IfNotPresent means a locally cached (potentially tampered) image will be used without re-pulling. Combined with no signature verification (e.g., Sigstore/cosign or admission policy), this is a major supply-chain risk. The fix is to use a private trusted registry, enforce image signing, and use Always with digest pinning.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c1',
  },
  {
    id: 290,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `The following CI/CD pipeline builds container images. What security step is MISSING?

\`\`\`yaml
# .github/workflows/build.yml (simplified)
name: build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t app:$GITHUB_SHA .
      - name: Push to registry
        run: docker push app:$GITHUB_SHA
\`\`\``,
    options: ['Should use :latest tag', 'No vulnerability scanning (Trivy/Snyk/Grype) before push', 'Missing docker login', 'Should use podman instead of docker'],
    correctAnswer: 1,
    explanation: 'The pipeline builds and pushes images without any vulnerability scanning. A scanning step (e.g., Trivy, Snyk, Grype, Clair) should run after build and before push to detect CVEs in OS packages and application dependencies. Failing the pipeline on critical CVEs prevents vulnerable images from reaching the registry.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c1',
  },
  {
    id: 291,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `What image verification control is missing in this Pod spec?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: payment-service
spec:
  containers:
  - name: app
    image: internal-registry/payments:v2.1.0
    imagePullPolicy: Always
\`\`\``,
    options: ['Should use IfNotPresent', 'No image digest pinning or signature verification', 'Missing readiness probe', 'Registry is internal so no verification needed'],
    correctAnswer: 1,
    explanation: 'Even with an internal registry and a version tag, there is no guarantee the image has not been tampered with. The fix is to pin by digest (image: internal-registry/payments:v2.1.0@sha256:...) and enforce admission controller signature verification (e.g., Ratify, Kyverno image verification, or OPA/Gatekeeper) to ensure only signed images run.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c1',
  },
  {
    id: 292,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `A production cluster allows this Pod. What policy gap enables a known-vulnerable image to run?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: legacy-app
spec:
  containers:
  - name: app
    image: oldregistry/app:v1.0
    securityContext:
      runAsNonRoot: true
\`\`\``,
    options: ['runAsNonRoot is set so it is safe', 'No admission policy blocks images with critical CVEs', 'Image tag is too short', 'Registry is old'],
    correctAnswer: 1,
    explanation: 'Setting runAsNonRoot does not protect against vulnerable application code or base images. Without an admission controller policy (e.g., Kyverno, OPA/Gatekeeper) that queries a vulnerability scanner or enforces maximum image age/CVE score, known-vulnerable images can be deployed. The fix is to integrate an admission policy with image scanning data.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c1',
  },

  // ===== SCENARIO 5: etcd/encryption misconfig (5 questions) — Domain 2 =====
  {
    id: 293,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `The cluster was deployed with this API server configuration. What is the encryption risk?

\`\`\`yaml
# /etc/kubernetes/manifests/kube-apiserver.yaml (relevant args)
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
spec:
  containers:
  - name: kube-apiserver
    image: registry.k8s.io/kube-apiserver:v1.30.0
    command:
    - kube-apiserver
    - --etcd-servers=https://10.0.0.1:2379
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    # No --encryption-provider-config argument
\`\`\``,
    options: ['etcd is not using TLS', 'Secrets are stored in etcd as plaintext without encryption at rest', 'Missing audit log configuration', 'API server should use HTTP'],
    correctAnswer: 1,
    explanation: 'Without --encryption-provider-config, the API server writes all Secrets (and other resources) to etcd as plaintext. Anyone with etcd access or etcd snapshot backups can read Secret values directly. The fix is to configure an EncryptionConfiguration with a KMS or AES provider and rotate keys regularly.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c2',
  },
  {
    id: 294,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `What is the PRIMARY etcd security concern in this setup?

\`\`\`yaml
# etcd static pod manifest
apiVersion: v1
kind: Pod
metadata:
  name: etcd
spec:
  containers:
  - name: etcd
    image: registry.k8s.io/etcd:3.5.13
    command:
    - etcd
    - --listen-peer-urls=http://0.0.0.0:2380
    - --listen-client-urls=https://0.0.0.0:2379
    - --cert-file=/etc/kubernetes/pki/etcd/server.crt
    - --key-file=/etc/kubernetes/pki/etcd/server.key
    - --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    # No --peer-cert-file or --peer-key-file
\`\`\``,
    options: ['Client URLs should use HTTP', 'Peer communication is unencrypted (HTTP)', 'etcd should not listen on 0.0.0.0', 'Missing --client-cert-auth'],
    correctAnswer: 1,
    explanation: 'listen-peer-urls uses http:// and there are no --peer-cert-file / --peer-key-file arguments. This means etcd peer-to-peer replication traffic between cluster nodes is sent in plaintext, exposing all cluster data (including Secrets) to network eavesdropping. The fix is to use https:// for peer URLs and provide peer TLS certificates.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c2',
  },
  {
    id: 295,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `What is the risk of this etcd configuration?

\`\`\`yaml
# etcd command-line flags
etcd \
  --listen-client-urls=https://0.0.0.0:2379 \
  --advertise-client-urls=https://10.0.0.1:2379 \
  --cert-file=/etc/etcd/server.crt \
  --key-file=/etc/etcd/server.key \
  --trusted-ca-file=/etc/etcd/ca.crt
  # No --client-cert-auth flag
\`\`\``,
    options: ['TLS is not used', 'Client certificate authentication is disabled; anyone with network access can connect', 'Missing peer URLs', 'etcd should not run as root'],
    correctAnswer: 1,
    explanation: 'Without --client-cert-auth, etcd accepts TLS connections from any client that presents a certificate signed by the trusted CA. It does not verify that the certificate belongs to an authorized entity (like the API server). This means any compromised host or insider with a valid CA-signed cert can read or modify etcd data. The fix is to enable --client-cert-auth and restrict CA issuance.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c2',
  },
  {
    id: 296,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `This etcd backup script runs nightly. What is the security concern?

\`\`\`yaml
# CronJob manifest for etcd backup
apiVersion: batch/v1
kind: CronJob
metadata:
  name: etcd-backup
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: etcdctl:v3.5
            command:
            - sh
            - -c
            - |
              etcdctl snapshot save /backup/etcd-$(date +%F).db
              aws s3 cp /backup/etcd-$(date +%F).db s3://company-backups/etcd/
          volumes:
          - name: backup
            emptyDir: {}
\`\`\``,
    options: ['Backup is not encrypted before upload', 'Should use a PersistentVolume', 'Schedule is too frequent', 'Missing nodeSelector'],
    correctAnswer: 0,
    explanation: 'The etcd snapshot contains the entire cluster state, including all Secrets in plaintext (unless etcd encryption at rest is configured). Uploading an unencrypted snapshot to S3 means anyone with S3 read access can extract Secret values. The fix is to encrypt the snapshot with a tool like gpg or aws s3 server-side encryption with KMS before upload.',
    difficulty: 'Hard',
    relatedSection: '/domain2/d2-c2',
  },
  {
    id: 297,
    domain: 2,
    domainName: 'Kubernetes Cluster Component Security',
    question: `What API server misconfiguration weakens etcd security?

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
spec:
  containers:
  - name: kube-apiserver
    image: registry.k8s.io/kube-apiserver:v1.30.0
    command:
    - kube-apiserver
    - --etcd-servers=http://10.0.0.1:2379
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
\`\`\``,
    options: ['etcd CA file is wrong', 'API server connects to etcd over HTTP instead of HTTPS', 'Should use multiple etcd servers', 'etcd IP is hardcoded'],
    correctAnswer: 1,
    explanation: 'The API server is configured to connect to etcd via HTTP (--etcd-servers=http://...). This means all cluster data — including Secrets — traverses the network in plaintext between the API server and etcd. The fix is to use https:// and ensure proper client certificate authentication.',
    difficulty: 'Medium',
    relatedSection: '/domain2/d2-c2',
  },

  // ===== SCENARIO 6: Admission controller / PSS (5 questions) — Domain 3 =====
  {
    id: 298,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `Why is this namespace configuration a security concern?

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: team-alpha
\`\`\``,
    options: ['Missing ResourceQuota', 'No Pod Security Admission labels are set', 'Name is too short', 'No NetworkPolicy'],
    correctAnswer: 1,
    explanation: 'Without Pod Security Admission labels (pod-security.kubernetes.io/enforce, /warn, /audit), the namespace inherits the cluster default, which is often no enforcement. This allows any Pod — including privileged, root-running, hostPath-mounted Pods — to be deployed. The fix is to label the namespace with an appropriate PSS level (baseline or restricted).',
    difficulty: 'Medium',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 299,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `This namespace runs customer-facing microservices. What is wrong with its Pod Security Standard configuration?

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: customer-api
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v1.30
\`\`\``,
    options: ['baseline is too strict', 'baseline allows many risky capabilities that restricted would block', 'enforce-version should be latest', 'Missing warn and audit labels'],
    correctAnswer: 1,
    explanation: 'The baseline profile permits capabilities that the restricted profile blocks: running as root, privilege escalation, hostPath mounts (with restrictions), and more. For customer-facing or sensitive workloads, restricted should be used. The restricted profile enforces non-root users, no privilege escalation, no host namespaces, and requires seccomp and dropping all capabilities.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 300,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `A cluster upgrade removed PodSecurityPolicy. What admission control gap now exists?

\`\`\`yaml
# kube-apiserver flags (post-upgrade)
- --enable-admission-plugins=NodeRestriction,NamespaceLifecycle
# No PodSecurity admission plugin enabled
\`\`\``,
    options: ['PodSecurityPolicy still works', 'Pod Security Admission is not enabled; no pod security enforcement exists', 'NamespaceLifecycle handles pod security', 'NodeRestriction replaces PSP'],
    correctAnswer: 1,
    explanation: 'PodSecurityPolicy (PSP) was deprecated and removed in Kubernetes v1.25+. The replacement is Pod Security Admission (PSA). If PSA is not included in --enable-admission-plugins, there is no built-in pod security enforcement at admission time. The fix is to add PodSecurity to the admission plugin list.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 301,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `A Pod with this spec is created in the namespace below. What is the outcome?

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: secure-zone
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
---
apiVersion: v1
kind: Pod
metadata:
  name: bad-pod
  namespace: secure-zone
spec:
  containers:
  - name: app
    image: app:v1
    securityContext:
      privileged: true
      runAsUser: 0
\`\`\``,
    options: ['Pod runs with warnings', 'Pod creation is denied by Pod Security Admission', 'Pod runs but kubelet rejects it', 'Only audit logs are generated'],
    correctAnswer: 1,
    explanation: 'The namespace enforces restricted at the enforce level. privileged: true and runAsUser: 0 both violate the restricted Pod Security Standard. With enforce=restricted, the Pod Security Admission controller denies the Pod creation request at the API server before it is persisted. The user sees an admission denied error.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
  {
    id: 302,
    domain: 3,
    domainName: 'Kubernetes Security Fundamentals',
    question: `What enforcement gap exists in this namespace configuration?

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  labels:
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted
    # No enforce label
\`\`\``,
    options: ['warn and audit are sufficient', 'There is no enforce level; violating Pods will still be created', 'audit should be baseline', 'warn should be baseline'],
    correctAnswer: 1,
    explanation: 'warn and audit levels only generate warnings and audit log events respectively. They do NOT prevent Pods from being created. Without an enforce label (e.g., pod-security.kubernetes.io/enforce: restricted), any Pod that violates the standard will be admitted and scheduled. The enforce label is required for actual prevention.',
    difficulty: 'Hard',
    relatedSection: '/domain3/d3-c2',
  },
]
