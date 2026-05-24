import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import Quiz from '@/components/Quiz';
import type { QuizQuestion } from '@/components/Quiz';
import SectionHeader from '@/components/SectionHeader';
import ComparisonTable from '@/components/ComparisonTable';

const DOMAIN_ID = 'domain3';


/* ─── Quiz Data ─── */
const quizQuestions: QuizQuestion[] = [
  {
    question: 'What is the key difference between Baseline and Restricted PSS regarding Linux capabilities?',
    options: [
      'Baseline allows all capabilities, Restricted allows none',
      'Baseline allows 13 specific capabilities; Restricted requires dropping ALL, only NET_BIND_SERVICE can be added',
      'Baseline drops all capabilities; Restricted allows 13',
      'There is no difference between Baseline and Restricted for capabilities',
    ],
    correctIndex: 1,
    explanation: 'Baseline allows exactly 13 capabilities (AUDIT_WRITE, CHOWN, DAC_OVERRIDE, FOWNER, FSETID, KILL, MKNOD, NET_BIND_SERVICE, SETFCAP, SETGID, SETPCAP, SETUID, SYS_CHROOT). Restricted requires dropping ALL capabilities and only NET_BIND_SERVICE may be re-added.',
  },
  {
    question: 'Which PSA mode will reject a pod that violates the configured Pod Security Standard?',
    options: ['warn', 'audit', 'enforce', 'log'],
    correctIndex: 2,
    explanation: 'The enforce mode rejects pods that violate the policy (pod is not created). The warn mode allows the pod but shows a warning to the user. The audit mode allows the pod but records an audit annotation.',
  },
  {
    question: 'How many RBAC verbs exist in Kubernetes?',
    options: ['8', '9', '10', '11'],
    correctIndex: 3,
    explanation: 'Kubernetes RBAC has 11 verbs: get, list, watch, create, update, patch, delete, deletecollection, impersonate, bind, and escalate. The last three (impersonate, bind, escalate) are especially dangerous as they can lead to privilege escalation.',
  },
  {
    question: 'Which RBAC verb allows a user to create or modify roles with more permissions than they currently possess?',
    options: ['bind', 'impersonate', 'escalate', 'deletecollection'],
    correctIndex: 2,
    explanation: 'The escalate verb allows users to bypass RBAC protections and create roles with more permissions than they possess. Normally, RBAC prevents users from creating roles that exceed their own permissions. The escalate verb is the exception.',
  },
  {
    question: 'What is the default network behavior in Kubernetes when no NetworkPolicy is defined?',
    options: [
      'Deny all ingress and egress',
      'Deny ingress, allow egress',
      'Allow all ingress and egress',
      'Allow ingress, deny egress',
    ],
    correctIndex: 2,
    explanation: 'By default, Kubernetes allows ALL ingress and egress traffic between all pods across all namespaces. No network isolation exists unless explicitly configured via NetworkPolicy resources. This is why implementing default-deny policies is a zero-trust best practice.',
  },
  {
    question: 'Which authentication method is recommended for production user authentication in Kubernetes?',
    options: [
      'Static token file',
      'X.509 client certificates',
      'OIDC (OpenID Connect)',
      'Anonymous authentication',
    ],
    correctIndex: 2,
    explanation: 'OIDC (OpenID Connect) is the recommended method for production user authentication. It integrates with external identity providers (Google, Azure AD, Okta, Keycloak), supports MFA, and enables centralized user management. Static token files and anonymous auth are insecure for production.',
  },
  {
    question: 'What replaced the deprecated PodSecurityPolicy (PSP) starting in Kubernetes v1.25?',
    options: [
      'OPA Gatekeeper',
      'Pod Security Admission (PSA)',
      'Kyverno',
      'ValidatingAdmissionWebhook',
    ],
    correctIndex: 1,
    explanation: 'Pod Security Admission (PSA) replaced PodSecurityPolicy (PSP) in Kubernetes v1.25. PSA is a built-in admission controller (not a webhook) that enforces Pod Security Standards via namespace labels. It is enabled by default.',
  },
  {
    question: 'How are Kubernetes Secrets stored in etcd by default?',
    options: [
      'AES-256 encrypted',
      'Base64-encoded (not encrypted)',
      'Plain text',
      'RSA encrypted',
    ],
    correctIndex: 1,
    explanation: 'By default, Kubernetes Secrets are stored as base64-encoded strings in etcd. Base64 is merely a transport encoding, NOT encryption. Anyone with direct etcd access can read all secrets. You must enable encryption at rest via EncryptionConfiguration with a provider like KMS v2.',
  },
  {
    question: 'Which audit level logs the request body + response body for the most comprehensive logging?',
    options: ['None', 'Metadata', 'Request', 'RequestResponse'],
    correctIndex: 3,
    explanation: 'RequestResponse is the most comprehensive audit level, logging request metadata, request body, and response body. Use it for high-sensitivity resources like Secrets and RBAC changes. Metadata only logs request metadata. Request logs metadata + request body. None logs nothing.',
  },
  {
    question: 'Which NetworkPolicy selector matches pods in other namespaces by their namespace labels?',
    options: [
      'podSelector',
      'namespaceSelector',
      'ipBlock',
      'serviceSelector',
    ],
    correctIndex: 1,
    explanation: 'namespaceSelector selects pods in namespaces that match the given label(s). Note: you cannot select by namespace name directly, but Kubernetes adds an immutable label kubernetes.io/metadata.name to every namespace that equals the namespace name. podSelector only matches pods in the same namespace as the NetworkPolicy.',
  },
  {
    question: 'What is the recommended way to consume secrets in pods?',
    options: [
      'As environment variables',
      'As volume mounts (files)',
      'Via the Kubernetes API',
      'Hardcoded in the container image',
    ],
    correctIndex: 1,
    explanation: 'Secrets should be mounted as volumes (files) rather than environment variables. Env vars can leak via /proc, process listings, container inspect output, and application crash dumps. Volume-mounted secrets are stored in tmpfs (RAM-backed) and never written to non-volatile storage.',
  },
  {
    question: 'Which admission controller enforces Pod Security Standards (PSS)?',
    options: [
      'NamespaceLifecycle',
      'PodSecurity',
      'LimitRanger',
      'ResourceQuota',
    ],
    correctIndex: 1,
    explanation: 'The PodSecurity admission controller (type: Validating) enforces Pod Security Standards. It runs in the validating phase after all mutating controllers have completed. It is enabled by default in Kubernetes. It validates the final state of pod specs against namespace PSS labels.',
  },
];

/* ─── PSS Comparison Table Data ─── */
const pssColumns = [
  { key: 'restriction', header: 'Restriction', width: '35%' },
  { key: 'baseline', header: 'Baseline', width: '32.5%' },
  { key: 'restricted', header: 'Restricted', width: '32.5%' },
];

const pssRows = [
  { restriction: 'hostPID / hostIPC / hostNetwork', baseline: 'Forbidden', restricted: 'Forbidden' },
  { restriction: 'Privileged containers', baseline: 'Forbidden', restricted: 'Forbidden' },
  { restriction: 'Capabilities', baseline: 'Drop all except 13 allowed', restricted: 'Must drop ALL; only NET_BIND_SERVICE can be added' },
  { restriction: 'runAsNonRoot', baseline: 'Not required', restricted: 'Required (MUST be true)' },
  { restriction: 'seccompProfile', baseline: 'Must not be Unconfined', restricted: 'MUST be RuntimeDefault or Localhost' },
  { restriction: 'Volume types', baseline: 'No hostPath', restricted: 'Only 8 types allowed' },
  { restriction: 'allowPrivilegeEscalation', baseline: 'Not restricted', restricted: 'MUST be false' },
  { restriction: 'readOnlyRootFilesystem', baseline: 'Not required', restricted: 'Best practice: true' },
  { restriction: 'hostPath volumes', baseline: 'Forbidden', restricted: 'Forbidden' },
  { restriction: 'hostPort', baseline: 'Forbidden', restricted: 'Forbidden' },
  { restriction: 'runAsUser: 0', baseline: 'Allowed', restricted: 'Prohibited' },
];

/* ─── RBAC Verbs Table ─── */
const rbacVerbsColumns = [
  { key: 'verb', header: 'Verb', width: '25%' },
  { key: 'action', header: 'Action', width: '75%' },
];

const rbacVerbsRows = [
  { verb: 'get', action: 'Read a specific resource' },
  { verb: 'list', action: 'Read all resources of a type' },
  { verb: 'watch', action: 'Stream changes to resources' },
  { verb: 'create', action: 'Create new resources' },
  { verb: 'update', action: 'Full update (replace)' },
  { verb: 'patch', action: 'Partial update' },
  { verb: 'delete', action: 'Delete a specific resource' },
  { verb: 'deletecollection', action: 'Delete a collection of resources' },
  { verb: 'impersonate', action: 'Act as another user/group' },
  { verb: 'bind', action: 'Bind a RoleBinding to an elevated role' },
  { verb: 'escalate', action: 'Create/modify roles with more permissions than current user' },
];

/* ─── Audit Levels ─── */
const auditColumns = [
  { key: 'level', header: 'Level', width: '25%' },
  { key: 'logged', header: "What's Logged", width: '40%' },
  { key: 'useCase', header: 'Use Case', width: '35%' },
];

const auditRows = [
  { level: 'None', logged: 'Nothing', useCase: 'High-volume, low-risk endpoints' },
  { level: 'Metadata', logged: 'Request metadata (user, timestamp, resource)', useCase: 'Low-sensitivity resources' },
  { level: 'Request', logged: 'Metadata + request body', useCase: 'Moderate sensitivity' },
  { level: 'RequestResponse', logged: 'Everything including response body', useCase: 'High-sensitivity (Secrets, RBAC changes)' },
];

/* ─── Secret Types ─── */
const secretTypesColumns = [
  { key: 'type', header: 'Type', width: '35%' },
  { key: 'usage', header: 'Usage', width: '65%' },
];

const secretTypesRows = [
  { type: 'Opaque', usage: 'Arbitrary user-defined data (default type)' },
  { type: 'kubernetes.io/tls', usage: 'TLS certificates and private keys' },
  { type: 'kubernetes.io/dockerconfigjson', usage: 'Private registry authentication' },
  { type: 'kubernetes.io/service-account-token', usage: 'ServiceAccount tokens (legacy)' },
  { type: 'kubernetes.io/basic-auth', usage: 'Username/password credentials' },
  { type: 'kubernetes.io/ssh-auth', usage: 'SSH private keys' },
  { type: 'bootstrap.kubernetes.io/token', usage: 'Node bootstrap/joining tokens' },
];

/* ─── Main Component ─── */
export default function Domain3Page() {
  const { progress, completeQuiz } = useProgress(DOMAIN_ID);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

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
        <span>Domain 3</span>
      </nav>

      {/* Chapter Header */}
      <div
        className="mb-10"
      >
        <div className="mb-3 flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: 'rgba(242, 196, 77, 0.15)',
              color: 'var(--accent-amber)',
            }}
          >
            <BookOpen size={12} />
            22% exam weight
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>~70 min read</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>8 sections</span>
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
          Kubernetes Security Fundamentals
        </h1>

        <p
          className="text-lg leading-relaxed max-w-[680px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Deep coverage of Pod Security Standards, authentication, RBAC authorization, Network Policies,
          secrets management, audit logging, and cluster segmentation. This domain represents 22% of the
          exam (approximately 17 questions) and is where exam questions cluster most heavily around
          specific configuration details.
        </p>

        {/* Exam Focus Banner */}
        <Callout variant="exam">
          <strong>Exam Focus: 22% of exam (~17 questions).</strong> PSS restrictions, RBAC verbs, and
          Network Policy behavior are HIGH-YIELD topics. Memorize the PSS Baseline vs Restricted
          differences and all 11 RBAC verbs.
        </Callout>
      </div>

      {/* ─── Section 3.1: Pod Security Standards ─── */}
      <section id="pss">
        <SectionHeader number="3.1" title="Pod Security Standards (PSS)" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          PSS defines three progressively more restrictive security levels for pods:
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {[
            {
              name: 'Privileged',
              desc: 'Unrestricted policy providing the widest possible level of permissions. For trusted workloads and cluster administrators only.',
              color: 'var(--accent-amber)',
            },
            {
              name: 'Baseline',
              desc: 'Minimally restrictive policy which prevents known privilege escalations. Allows most common application configurations.',
              color: 'var(--accent-amber)',
            },
            {
              name: 'Restricted',
              desc: 'Heavily restricted policy following current Pod hardening best practices. For security-critical applications and multi-tenant environments.',
              color: 'var(--accent-sage)',
            },
          ].map((profile) => (
            <div
              key={profile.name}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: `1px solid ${profile.color}30`,
              }}
            >
              <h3 className="text-sm font-bold mb-2" style={{ color: profile.color }}>
                {profile.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {profile.desc}
              </p>
            </div>
          ))}
        </div>

        <Callout variant="info">
          The policies are <strong>cumulative</strong> — Restricted INHERITS all Baseline restrictions,
          and Baseline is a subset of what Restricted enforces. Privileged has NO restrictions (entirely open).
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          PSS Comparison: Baseline vs Restricted
        </h3>

        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          This is the most exam-critical table in this domain. Memorize it.
        </p>

        <ComparisonTable columns={pssColumns} rows={pssRows} />

        <Callout variant="exam">
          <strong>Memorize this table.</strong> The key differences for Restricted are:
          <strong> runAsNonRoot=true</strong>, <strong>drop ALL capabilities</strong> (only NET_BIND_SERVICE addable),{' '}
          <strong>allowPrivilegeEscalation=false</strong>,{' '}
          <strong>seccompProfile=RuntimeDefault/Localhost</strong>, and only <strong>8 volume types</strong> allowed.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Restricted PSS Compliant Pod Example
        </h3>

        <CodeBlock
          code={`apiVersion: v1
kind: Pod
metadata:
  name: restricted-pod
spec:
  securityContext:
    runAsNonRoot: true        # Required for Restricted
    seccompProfile:
      type: RuntimeDefault     # Required for Restricted
    runAsUser: 1000
  containers:
  - name: app
    image: nginx:alpine
    securityContext:
      allowPrivilegeEscalation: false   # Required for Restricted
      readOnlyRootFilesystem: true      # Best practice
      capabilities:
        drop:
        - ALL                         # Required for Restricted
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: cache
      mountPath: /var/cache/nginx
    - name: run
      mountPath: /var/run
  volumes:                            # Only allowed volume types for Restricted
  - name: tmp
    emptyDir: {}
  - name: cache
    emptyDir: {}
  - name: run
    emptyDir: {}}`}
          language="yaml"
        />
      </section>

      {/* ─── Section 3.2: Pod Security Admission ─── */}
      <section id="psa">
        <SectionHeader number="3.2" title="Pod Security Admission (PSA)" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          PSA is the built-in admission controller that enforces PSS. It replaced the deprecated
          PodSecurityPolicy (PSP) in Kubernetes v1.25. PSA is a <strong>validating</strong> admission
          controller (does not mutate objects) that runs in the validating phase after all mutating
          controllers have completed.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Three Enforcement Modes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { mode: 'enforce', desc: 'Policy violations cause pod REJECTION', detail: 'Pod is not created' },
            { mode: 'warn', desc: 'Policy violations trigger a warning', detail: 'Warning returned but pod is allowed' },
            { mode: 'audit', desc: 'Policy violations trigger an annotation', detail: 'Annotation in audit log, pod allowed' },
          ].map((m) => (
            <div
              key={m.mode}
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>
                {m.mode}
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{m.desc}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{m.detail}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Namespace Labels
        </h3>

        <CodeBlock
          code={`apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted`}
          language="yaml"
          filename="namespace-psa.yaml"
        />

        <Callout variant="tip">
          The <code>latest</code> version tag automatically uses the most recent PSS version. You can
          specify a specific version like <code>v1.30</code>. Different levels can be set per mode — e.g.,{' '}
          <code>enforce: baseline</code>, <code>audit: restricted</code>.
        </Callout>

        <CodeBlock
          code={`# Enforce restricted on a namespace
kubectl label --overwrite ns payroll \\
  pod-security.kubernetes.io/enforce=restricted

# Common pattern: enforce baseline, warn/audit for restricted
kubectl label --overwrite ns example \\
  pod-security.kubernetes.io/enforce=baseline \\
  pod-security.kubernetes.io/warn=restricted \\
  pod-security.kubernetes.io/audit=restricted

# Dry-run to test existing pods
kubectl label --dry-run=server --overwrite ns --all \\
  pod-security.kubernetes.io/enforce=baseline`}
          language="bash"
          filename="kubectl commands"
        />

        <Callout variant="exam">
          PSA replaced the deprecated PodSecurityPolicy (PSP). Enforcement is configured via namespace
          <strong> LABELS</strong>, not API objects. Three modes: <strong>enforce</strong> (reject),{' '}
          <strong>warn</strong> (warning), <strong>audit</strong> (annotation). You can set different
          levels for each mode on the same namespace.
        </Callout>

        {/* PSA Timeline */}
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          PSA Timeline
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { ver: 'v1.21', event: 'PSP deprecated' },
            { ver: 'v1.23', event: 'PSA beta (enabled by default)' },
            { ver: 'v1.25', event: 'PSA GA; PSP removed' },
            { ver: 'v1.30+', event: 'AppArmor in securityContext' },
          ].map((item) => (
            <div
              key={item.ver}
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{item.ver}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{item.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 3.3: Authentication Methods ─── */}
      <section id="authentication">
        <SectionHeader number="3.3" title="Authentication Methods" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Authentication determines <strong>WHO you are</strong>. The API server passes credentials
          through a chain of authenticators — the first one that can verify the credential wins. If none
          can, the request is treated as anonymous. Kubernetes supports multiple auth methods simultaneously.
        </p>

        <Callout variant="info">
          Kubernetes has <strong>NO User object</strong>. There is no{' '}<code>kubectl create user</code>{' '}
          command. Users are ephemeral identities extracted from credentials by external systems.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Authentication Methods
        </h3>

        <div className="space-y-4 mb-6">
          {[
            {
              name: 'X.509 Client Certificates',
              desc: 'Most common for cluster admins. CN becomes username, O becomes groups. system:masters group has built-in cluster-admin access and bypasses ALL authorization.',
              recommended: true,
            },
            {
              name: 'ServiceAccount Tokens',
              desc: 'For pod-to-API-Server communication. Bound tokens (v1.22+ GA) are time-bound (1hr default), audience-bound, object-bound, and auto-rotated. Legacy Secret-based token auto-creation disabled in v1.24.',
              recommended: true,
            },
            {
              name: 'OIDC (OpenID Connect)',
              desc: 'For user authentication via external identity providers (Google, Azure AD, Okta, Keycloak). Uses id_token (not access_token). Recommended for production.',
              recommended: true,
            },
            {
              name: 'Webhook Token Authentication',
              desc: 'Delegate auth to external service via TokenReview API. Uses kubeconfig-format file. Cache TTL defaults to 2 minutes.',
              recommended: false,
            },
            {
              name: 'Anonymous',
              desc: 'system:anonymous user and system:unauthenticated group. Enabled by default. Must be disabled with --anonymous-auth=false in production.',
              recommended: false,
            },
            {
              name: 'Static Token File',
              desc: 'INSECURE — plaintext tokens in a CSV file. Requires API server restart to change. Not recommended for production.',
              recommended: false,
            },
          ].map((method) => (
            <div
              key={method.name}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {method.name}
                </h4>
                {method.recommended && (
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: 'rgba(163, 196, 168, 0.15)',
                      color: 'var(--accent-sage)',
                    }}
                  >
                    Standard
                  </span>
                )}
                {!method.recommended && method.name !== 'Static Token File' && (
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full uppercase"
                    style={{
                      backgroundColor: 'rgba(179, 134, 0, 0.1)',
                      color: 'var(--warning)',
                    }}
                  >
                    Caution
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{method.desc}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Authentication Flow
        </h3>

        <CodeBlock
          code={`User/Pod → Presents credentials → API Server → Authentication module → 
Identity established → Pass to Authorization → RBAC check`}
          language="bash"
          showLineNumbers={false}
        />

        <Callout variant="exam">
          For X.509 certs: <strong>CN → username, O → groups</strong>. The{' '}
          <strong>system:masters</strong> group bypasses ALL authorization checks. Bound SA tokens
          (v1.22+ GA) have 5 properties: time-bound, audience-bound, object-bound, auto-rotated (at 80%
          TTL), and backward-compatible mount path.
        </Callout>
      </section>

      {/* ─── Section 3.4: Authorization (RBAC) ─── */}
      <section id="authorization">
        <SectionHeader number="3.4" title="Authorization (RBAC, ABAC, Node, Webhook)" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Authorization determines <strong>WHAT an authenticated user CAN DO</strong>. In Kubernetes,
          authorization happens as a separate step from authentication. Multiple authorization modes can
          be configured simultaneously using <code>--authorization-mode=Node,RBAC,Webhook</code>. The
          order specified matters — earlier modules have higher priority.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Four Authorization Modes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              name: 'RBAC',
              desc: 'Role-Based Access Control — the primary and recommended method. Grant permissions via Roles/ClusterRoles bound to users/groups/ServiceAccounts.',
              highlight: true,
            },
            {
              name: 'ABAC',
              desc: 'Attribute-Based Access Control — JSON policy files, requires API server restart. Legacy, not recommended for new deployments.',
              highlight: false,
            },
            {
              name: 'Node',
              desc: 'Special-purpose authorization for Kubelet access. Always enabled alongside RBAC. Must use system:nodes group with username system:node:<nodeName>.',
              highlight: false,
            },
            {
              name: 'Webhook',
              desc: 'Delegate authorization decisions to external service via SubjectAccessReview. Uses kubeconfig-format file. Synchronous callout.',
              highlight: false,
            },
          ].map((mode) => (
            <div
              key={mode.name}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: mode.highlight ? 'rgba(4, 80, 54, 0.04)' : 'var(--surface-base)',
                border: mode.highlight ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              }}
            >
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>
                {mode.name}
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{mode.desc}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          RBAC Verbs — Memorize All 11
        </h3>

        <ComparisonTable columns={rbacVerbsColumns} rows={rbacVerbsRows} />

        <Callout variant="warning">
          <strong>Dangerous verbs:</strong> <code>bind</code> (can bind any role to self),{' '}
          <code>escalate</code> (can create roles with more permissions), and{' '}
          <code>impersonate</code> (can act as another user) — all can lead to privilege escalation.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Role vs ClusterRole
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
            <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Role</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>Namespace-scoped permissions</li>
              <li>Must specify a namespace</li>
              <li>Applied within a single namespace</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}>
            <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>ClusterRole</h4>
            <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <li>Cluster-wide permissions</li>
              <li>Not namespaced</li>
              <li>Can also be bound within a namespace via RoleBinding</li>
            </ul>
          </div>
        </div>

        <Callout variant="info">
          A <strong>RoleBinding</strong> can reference a <strong>ClusterRole</strong> — this grants
          ClusterRole permissions scoped to the RoleBinding&apos;s namespace. This is a common pattern for
          reusing role definitions across namespaces.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          RBAC Configuration Example
        </h3>

        <CodeBlock
          code={`# Least-privilege Role for a developer
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: developer
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: production
  name: developer-binding
subjects:
- kind: User
  name: "alice@company.com"
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io`}
          language="yaml"
          filename="rbac-example.yaml"
        />

        <CodeBlock
          code={`# Check permissions
kubectl auth can-i create pods --as=alice@company.com -n production
kubectl auth can-i --list --as=alice@company.com -n production

# Check who can perform an action
kubectl auth can-i create secrets --all-namespaces`}
          language="bash"
          filename="permission-checks.sh"
        />

        <Callout variant="exam">
          RBAC permissions are <strong>purely additive</strong> — there are NO &quot;deny&quot; rules.
          <strong> system:masters</strong> bypasses ALL authorization. The{' '}
          <code>roleRef</code> in a binding is <strong>immutable</strong>. subresources (pods/log,
          pods/exec) require explicit permissions — they are NOT included in the parent resource.
        </Callout>
      </section>

      {/* ─── Section 3.5: Secrets Management ─── */}
      <section id="secrets">
        <SectionHeader number="3.5" title="Secrets Management" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Kubernetes Secrets are designed to store sensitive data (passwords, tokens, keys). However,
          by default they are stored as base64-encoded (NOT encrypted) in etcd. Proper secrets management
          is critical for cluster security.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Built-in Secret Types
        </h3>

        <ComparisonTable columns={secretTypesColumns} rows={secretTypesRows} />

        <Callout variant="warning">
          Base64 encoding is NOT encryption. Anyone with direct etcd access can read all secrets. You
          must enable encryption at rest via <code>--encryption-provider-config</code>.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Encryption Providers
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { name: 'identity', desc: 'No encryption (default)', status: 'Not recommended' },
            { name: 'aescbc', desc: 'AES-CBC with PKCS#7', status: 'NOT recommended (padding oracle)' },
            { name: 'aesgcm', desc: 'AES-GCM with random nonce', status: 'Must rotate every 200k writes' },
            { name: 'secretbox', desc: 'XSalsa20 and Poly1305', status: 'Strong, not FIPS' },
            { name: 'kms v1', desc: 'Envelope encryption', status: 'Deprecated since v1.28' },
            { name: 'kms v2', desc: 'Envelope encryption', status: 'Recommended (v1.29+)' },
          ].map((p) => {
            const statusColor = (() => {
              if (p.name === 'kms v2') {
                return 'var(--accent-sage)'
              }
              if (p.status.includes('Not') || p.status.includes('Deprecated')) {
                return 'var(--accent-coral)'
              }
              return 'var(--text-tertiary)'
            })()
            return (
            <div
              key={p.name}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{p.desc}</div>
              <div
                className="text-xs mt-1 font-medium"
                style={{
                  color: statusColor,
                }}
              >
                {p.status}
              </div>
            </div>
          )})}
        </div>

        <CodeBlock
          code={`# EncryptionConfiguration with KMS v2 (recommended)
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
      - configmaps
    providers:
      - kms:
          name: myKMSPlugin
          endpoint: unix:///var/run/kmsplugin/socket.sock
          cachesize: 1000
          timeout: 3s
      - identity: {}  # Fallback for reading unencrypted data`}
          language="yaml"
          filename="encryption-config.yaml"
        />

        <Callout variant="tip">
          The <strong>first provider</strong> in the list is used for encryption of new data.{' '}
          <strong>All providers</strong> are tried for decryption (in order). The identity provider
          must be included as a fallback until all existing secrets are re-encrypted.
        </Callout>

        <CodeBlock
          code={`# Re-encrypt all existing secrets after enabling encryption
kubectl get secrets --all-namespaces -o json | kubectl replace -f -

# Verify encryption by reading directly from etcd
ETCDCTL_API=3 etcdctl \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key \\
  get /registry/secrets/default/my-secret`}
          language="bash"
          filename="re-encrypt.sh"
        />

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Best Practices
        </h3>

        <div className="space-y-3 mb-6">
          {[
            'Enable encryption at rest with KMS v2',
            'Use RBAC to restrict Secret read access to only pods/users that need it',
            'Mount secrets as files (volumes) instead of environment variables',
            'Use external secret managers (Vault, AWS Secrets Manager, Azure Key Vault)',
            'Mark secrets as immutable when they do not need to change (v1.21+)',
            'Rotate secrets regularly and update pods',
            'Use short-lived ServiceAccount tokens (projected volumes)',
          ].map((practice, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}>
                {idx + 1}
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{practice}</span>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`# Mount secrets as volume (recommended)
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secret
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: my-secret
      defaultMode: 0400  # Read-only for owner`}
          language="yaml"
          filename="secret-volume.yaml"
        />

        <Callout variant="exam">
          By default, secrets are <strong>base64-encoded, NOT encrypted</strong>. Enable encryption at
          rest via <code>--encryption-provider-config</code>. KMS v2 is the recommended provider
          (stable since v1.29). Volume mounts are backed by tmpfs (RAM) and are preferred over env
          vars. Secret size limit is <strong>1 MiB</strong>.
        </Callout>
      </section>

      {/* ─── Section 3.6: Isolation and Segmentation ─── */}
      <section id="isolation">
        <SectionHeader number="3.6" title="Isolation and Segmentation" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Multi-tenancy in Kubernetes requires multiple layers of isolation — network, access control,
          resource, and runtime isolation. No single mechanism provides complete isolation.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Multi-Tenancy Strategies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { name: 'Namespace-per-team', desc: 'Most common. Each team gets a namespace with RBAC, resource quotas, and network policies.', level: 'Logical' },
            { name: 'Hierarchical Namespaces', desc: 'Parent-child namespace relationships for inherited policies and resource sharing.', level: 'Logical' },
            { name: 'Virtual Clusters', desc: 'Full isolated clusters within a cluster (vcluster). Stronger isolation than namespaces.', level: 'Stronger' },
            { name: 'Cluster-per-tenant', desc: 'Physical isolation. Most secure but most expensive.', level: 'Physical' },
          ].map((s) => (
            <div
              key={s.name}
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.name}</h4>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-tertiary)' }}>
                  {s.level}
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Segmentation Controls
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { name: 'Network Policies', desc: 'L3/L4 network segmentation' },
            { name: 'RBAC', desc: 'Access control segmentation' },
            { name: 'Resource Quotas', desc: 'Prevent resource exhaustion' },
            { name: 'Limit Ranges', desc: 'Default/max resource constraints' },
            { name: 'Pod Security Admission', desc: 'Security profile enforcement' },
            { name: 'Service Mesh mTLS', desc: 'Service-to-service auth' },
          ].map((ctrl) => (
            <div
              key={ctrl.name}
              className="p-3 rounded-lg text-center"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-xs font-bold" style={{ color: 'var(--accent-primary)' }}>{ctrl.name}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{ctrl.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 3.7: Audit Logging ─── */}
      <section id="audit">
        <SectionHeader number="3.7" title="Audit Logging" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          Audit logging records API server requests for security analysis, compliance, and forensics.
          The AuditPolicy defines what should be logged and at what level.
        </p>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Audit Levels
        </h3>

        <ComparisonTable columns={auditColumns} rows={auditRows} />

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Audit Backends
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {
              name: 'Log Backend',
              desc: 'Write audit events to a local file. Configure with --audit-log-path. Can also specify --audit-log-maxage, --audit-log-maxbackup, --audit-log-maxsize.',
            },
            {
              name: 'Webhook Backend',
              desc: 'Send audit events to an external HTTP service. Configure with --audit-webhook-config-file. Useful for SIEM integration.',
            },
          ].map((backend) => (
            <div
              key={backend.name}
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--accent-primary)' }}>{backend.name}</h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{backend.desc}</p>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  # Log pod changes at RequestResponse level
  - level: RequestResponse
    resources:
    - group: ""
      resources: ["pods"]
  
  # Log auth changes at Request level
  - level: Request
    resources:
    - group: "rbac.authorization.k8s.io"
      resources: ["roles", "rolebindings", "clusterroles", "clusterrolebindings"]
  
  # Log metadata for everything else
  - level: Metadata
    omitStages: ["RequestReceived"]`}
          language="yaml"
          filename="audit-policy.yaml"
        />

        <Callout variant="exam">
          <strong>RequestResponse</strong> logs everything (metadata + request body + response body) —
          use for Secrets and RBAC changes. <strong>Metadata</strong> only logs request metadata.
          <strong> Request</strong> logs metadata + request body. <strong> None</strong> logs nothing.
        </Callout>
      </section>

      {/* ─── Section 3.8: Network Policies ─── */}
      <section id="network-policies">
        <SectionHeader number="3.8" title="Network Policies (Deep Dive)" />

        <p
          className="mb-4 text-base leading-relaxed"
          style={{ color: 'var(--text-primary)', maxWidth: '680px' }}
        >
          NetworkPolicy is the native Kubernetes mechanism for controlling pod-to-pod network traffic.
          It operates at L3/L4 only (IP/Port) — not L7 (HTTP path/method).
        </p>

        <Callout variant="exam">
          <strong>Key exam rules:</strong> Default = allow ALL. First policy on a pod = isolation for
          that traffic direction. Multiple policies = OR logic (more permissive). Native NetworkPolicy
          does NOT do L7 — use service mesh for that.
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          NetworkPolicy Rules to Remember
        </h3>

        <div className="space-y-3 mb-6">
          {[
            'Default: Allow ALL traffic (no isolation)',
            'First policy on a pod = isolation for that traffic direction',
            'Selectors: podSelector (labels), namespaceSelector (namespace labels), ipBlock (CIDR ranges)',
            'Multiple policies = OR logic (more permissive)',
            'L3/L4 only: Native NetworkPolicy does NOT do L7',
            'Only affects ingress/egress between pods — does not control north-south traffic by default',
            'Both source egress AND destination ingress policies must allow the connection',
            'Default deny egress also blocks DNS — must add explicit DNS allow policy',
          ].map((rule, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(4, 80, 54, 0.1)', color: 'var(--accent-primary)' }}>
                {idx + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{rule}</p>
            </div>
          ))}
        </div>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Complete NetworkPolicy Examples
        </h3>

        <CodeBlock
          code={`# 1. Default deny all ingress and egress
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress`}
          language="yaml"
          filename="01-default-deny.yaml"
        />

        <CodeBlock
          code={`# 2. Allow DNS egress (REQUIRED after default deny egress)
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53`}
          language="yaml"
          filename="02-allow-dns.yaml"
        />

        <CodeBlock
          code={`# 3. Allow frontend to backend on port 8080
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-to-backend
  namespace: production
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
      port: 8080`}
          language="yaml"
          filename="03-frontend-to-backend.yaml"
        />

        <CodeBlock
          code={`# 4. Allow backend egress to database on port 5432
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432`}
          language="yaml"
          filename="04-backend-to-db.yaml"
        />

        <Callout variant="tip">
          Use <code>namespaceSelector</code> with <code>kubernetes.io/metadata.name</code> label to
          select namespaces by name:{' '}
          <code>namespaceSelector: matchLabels: kubernetes.io/metadata.name: production</code>
        </Callout>

        <h3
          className="text-lg font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          What NetworkPolicy CANNOT Do
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            'Force traffic through a common gateway',
            'TLS-related enforcement (use service mesh)',
            'Node-specific policies',
            'Target services by name (use labels)',
            'Apply default policies to all namespaces automatically',
            'Log network security events',
            'Layer 7 (HTTP path, method) filtering',
            'Explicitly deny — only allow rules exist',
          ].map((limit, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-subtle)' }}
            >
              <span style={{ color: 'var(--accent-coral)' }}>✕</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{limit}</span>
            </div>
          ))}
        </div>

        <Callout variant="exam">
          Remember: <strong>Both</strong> the source pod&apos;s egress policy AND the destination pod&apos;s
          ingress policy must allow the connection for traffic to flow. NetworkPolicies are{' '}
          <strong>additive</strong> — there is no explicit DENY, only allow-by-default or allow-by-policy.
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
          to="/domain2"
          className="flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronRight size={14} className="rotate-180" />
          Previous: Domain 2
        </Link>
        <Link
          to="/domain4"
          className="flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: 'var(--accent-primary)' }}
        >
          Next: Domain 4
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
