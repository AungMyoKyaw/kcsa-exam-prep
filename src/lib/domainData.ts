export interface DomainChapter {
  id: string;
  title: string;
}

export interface Domain {
  id: number;
  number: string;
  title: string;
  shortName: string;
  weight: number;
  description: string;
  chapters: DomainChapter[];
  topics: string[];
}

export const domains: Domain[] = [
  {
    id: 1,
    number: "Domain 1",
    title: "Overview of Cloud Native Security",
    shortName: "Overview",
    weight: 14,
    description: "The 4Cs of Cloud Native Security, security frameworks, isolation techniques, image security, and DevSecOps practices.",
    chapters: [
      { id: "d1-c1", title: "The 4Cs Model" },
      { id: "d1-c2", title: "Security Frameworks" },
      { id: "d1-c3", title: "Isolation Techniques" },
      { id: "d1-c4", title: "Image Security" },
      { id: "d1-c5", title: "DevSecOps Practices" },
      { id: "d1-c6", title: "Quiz" },
    ],
    topics: [
      "The 4Cs model (Cloud, Cluster, Container, Code)",
      "NIST, CIS, and ISO 27001 frameworks",
      "Namespace and Network Policy isolation",
      "Image scanning and signing",
    ],
  },
  {
    id: 2,
    number: "Domain 2",
    title: "Kubernetes Cluster Component Security",
    shortName: "Cluster Components",
    weight: 22,
    description: "Secure every component in the Kubernetes control plane and data plane — from API Server to Kubelet to container runtime.",
    chapters: [
      { id: "d2-c1", title: "API Server Security" },
      { id: "d2-c2", title: "etcd Security" },
      { id: "d2-c3", title: "Kubelet & Node Security" },
      { id: "d2-c4", title: "Container Runtime" },
      { id: "d2-c5", title: "Networking & CNI" },
      { id: "d2-c6", title: "Authentication" },
      { id: "d2-c7", title: "Storage Security" },
      { id: "d2-c8", title: "Quiz" },
    ],
    topics: [
      "API Server, etcd, and Kubelet hardening",
      "Container runtime security (containerd, CRI-O)",
      "CNI and network security",
      "Authentication and ServiceAccounts",
    ],
  },
  {
    id: 3,
    number: "Domain 3",
    title: "Kubernetes Security Fundamentals",
    shortName: "Security Fundamentals",
    weight: 22,
    description: "Master Pod Security Standards, RBAC, Network Policies, audit logging, and secret management.",
    chapters: [
      { id: "d3-c1", title: "Pod Security Standards" },
      { id: "d3-c2", title: "Pod Security Admission" },
      { id: "d3-c3", title: "RBAC Authorization" },
      { id: "d3-c4", title: "Authentication Methods" },
      { id: "d3-c5", title: "Secrets Management" },
      { id: "d3-c6", title: "Network Policies" },
      { id: "d3-c7", title: "Audit Logging" },
      { id: "d3-c8", title: "Quiz" },
    ],
    topics: [
      "Pod Security Standards and Admission",
      "RBAC authorization patterns",
      "Authentication methods (X.509, OIDC, Webhook)",
      "Network Policies and segmentation",
    ],
  },
  {
    id: 4,
    number: "Domain 4",
    title: "Kubernetes Threat Model",
    shortName: "Threat Model",
    weight: 16,
    description: "Understand how attackers think. Map STRIDE to Kubernetes, identify persistence mechanisms, and prevent container escape.",
    chapters: [
      { id: "d4-c1", title: "STRIDE Framework" },
      { id: "d4-c2", title: "Container Escape" },
      { id: "d4-c3", title: "Privilege Escalation" },
      { id: "d4-c4", title: "Lateral Movement" },
      { id: "d4-c5", title: "Denial of Service" },
      { id: "d4-c6", title: "Persistence" },
      { id: "d4-c7", title: "Quiz" },
    ],
    topics: [
      "STRIDE threat framework",
      "Container escape and privilege escalation",
      "Lateral movement and network attacks",
      "Denial of Service vectors",
    ],
  },
  {
    id: 5,
    number: "Domain 5",
    title: "Platform Security",
    shortName: "Platform Security",
    weight: 16,
    description: "Secure the software supply chain, implement service mesh, manage PKI, and deploy admission controllers.",
    chapters: [
      { id: "d5-c1", title: "Supply Chain Security" },
      { id: "d5-c2", title: "Image Repository" },
      { id: "d5-c3", title: "Observability" },
      { id: "d5-c4", title: "Service Mesh" },
      { id: "d5-c5", title: "PKI & Certificates" },
      { id: "d5-c6", title: "Admission Control" },
      { id: "d5-c7", title: "Quiz" },
    ],
    topics: [
      "Supply chain security and SLSA",
      "Service mesh (Istio, Linkerd) and mTLS",
      "Admission control (OPA, Kyverno)",
      "Image scanning and signing",
    ],
  },
  {
    id: 6,
    number: "Domain 6",
    title: "Compliance and Security Frameworks",
    shortName: "Compliance",
    weight: 10,
    description: "Apply compliance frameworks, automate security scanning, and align with industry standards.",
    chapters: [
      { id: "d6-c1", title: "CIS Benchmarks" },
      { id: "d6-c2", title: "NIST & Standards" },
      { id: "d6-c3", title: "MITRE ATT&CK" },
      { id: "d6-c4", title: "Automation Tools" },
      { id: "d6-c5", title: "Supply Chain Compliance" },
      { id: "d6-c6", title: "Quiz" },
    ],
    topics: [
      "CIS Kubernetes Benchmarks",
      "NIST, PCI DSS, HIPAA, GDPR alignment",
      "kube-bench, Kubescape, Falco automation",
      "MITRE ATT&CK for containers",
    ],
  },
];

export interface ExamTip {
  id: number;
  category: string;
  categoryColor: string;
  tip: string;
  detail: string;
}

export const examTips: ExamTip[] = [
  {
    id: 1,
    category: "Ports",
    categoryColor: "#9B87F5",
    tip: "API Server listens on port 6443",
    detail: "All other components communicate through the API Server. This is the single most important port to memorize.",
  },
  {
    id: 2,
    category: "PSS",
    categoryColor: "#A3C4A8",
    tip: "Restricted PSS drops ALL capabilities",
    detail: "Only NET_BIND_SERVICE can be added. Baseline allows 13 capabilities, Restricted allows only 1.",
  },
  {
    id: 3,
    category: "RBAC",
    categoryColor: "#326CE5",
    tip: "RBAC has 11 verbs",
    detail: "Remember: get, list, watch, create, update, patch, delete, deletecollection, impersonate, bind, escalate",
  },
  {
    id: 4,
    category: "Encryption",
    categoryColor: "#E87A5D",
    tip: "Encryption at rest: KMS v2 recommended",
    detail: "Order: identity → aescbc → aesgcm → secretbox → kms v1 → kms v2 (most secure)",
  },
  {
    id: 5,
    category: "NetworkPolicy",
    categoryColor: "#F2C44D",
    tip: "NetworkPolicy default = allow all",
    detail: "First policy on a pod isolates that traffic direction. Policies are additive (OR logic).",
  },
  {
    id: 6,
    category: "etcd",
    categoryColor: "#045036",
    tip: "etcd uses ports 2379 (client) and 2380 (peer)",
    detail: "Always enable peer and client TLS. Enable encryption at rest for sensitive data.",
  },
];
