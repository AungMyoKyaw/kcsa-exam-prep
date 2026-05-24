import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EthernetPort,
  Shield,
  KeyRound,
  Lock,
  Network,
  Terminal,
  Box,
  Star,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import {
  portsData,
  pssComparisonData,
  pssAllowedCapabilities,
  pssAllowedVolumes,
  psaLabels,
  rbacVerbsData,
  rbacBindingRules,
  encryptionChain,
  networkPolicyFacts,
  networkPolicyDefaults,
  kubectlCommands,
  kubeBenchCommand,
  falcoCommand,
  authMethods,
  authorizationModes,
  runtimeSecurity,
  examTipsData,
  timeManagementTips,
} from '@/data/cheatSheetData';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const tabs = [
  { id: 'ports', label: 'Ports', icon: EthernetPort },
  { id: 'pss', label: 'Pod Security', icon: Shield },
  { id: 'rbac', label: 'RBAC', icon: KeyRound },
  { id: 'encryption', label: 'Encryption', icon: Lock },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'commands', label: 'Commands', icon: Terminal },
  { id: 'components', label: 'Components', icon: Box },
  { id: 'tips', label: 'Exam Tips', icon: Star },
];

function useCopyButton() {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const handleCopy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMap((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopiedMap((prev) => ({ ...prev, [key]: false })), 2000);
    } catch {
      // Fallback
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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200"
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

// ===== Tab Content Components =====

function PortsTab({ copiedMap, handleCopy }: { copiedMap: Record<string, boolean>; handleCopy: (t: string, k: string) => void | Promise<void> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          All Kubernetes component ports you need to memorize for the exam.
        </p>
        <CopyBtn text={portsData.map((p) => `${p.component}: ${p.port}`).join('\n')} copyKey="all-ports" onCopy={handleCopy} copied={copiedMap['all-ports']} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Component</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Port</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Protocol</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {portsData.map((row, i) => (
              <motion.tr
                key={row.port + row.component}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  backgroundColor: row.danger === true ? 'rgba(232,122,93,0.06)' : 'transparent',
                }}
              >
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{row.component}</td>
                <td className="py-3 px-4">
                  <span
                    className="font-mono text-base font-semibold px-2 py-0.5 rounded"
                    style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(4,80,54,0.08)' }}
                  >
                    {row.port}
                  </span>
                  {row.danger === true && (
                    <span
                      className="ml-2 text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ color: 'var(--accent-coral)', backgroundColor: 'rgba(232,122,93,0.12)' }}
                    >
                      DISABLE
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono" style={{ color: 'var(--text-secondary)' }}>{row.protocol}</td>
                <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{row.notes}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PSSTab({ copiedMap, handleCopy }: { copiedMap: Record<string, boolean>; handleCopy: (t: string, k: string) => void | Promise<void> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Pod Security Standards: Baseline vs Restricted comparison.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Restriction</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Baseline</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Restricted</th>
            </tr>
          </thead>
          <tbody>
            {pssComparisonData.map((row, i) => (
              <motion.tr
                key={row.restriction}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td className="py-3 px-4 font-medium" style={{ color: 'var(--text-primary)' }}>{row.restriction}</td>
                <td className="py-3 px-4" style={{ color: row.highlight === 'baseline' || row.highlight === 'both' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {row.baseline}
                </td>
                <td
                  className="py-3 px-4 font-medium"
                  style={{
                    color: row.highlight === 'restricted' || row.highlight === 'both' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    backgroundColor: row.highlight === 'restricted' ? 'rgba(4,80,54,0.04)' : 'transparent',
                  }}
                >
                  {row.restricted}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Allowed Capabilities */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>13 Allowed Capabilities (Baseline)</span>
          <CopyBtn text={pssAllowedCapabilities} copyKey="caps" onCopy={handleCopy} copied={copiedMap['caps']} />
        </div>
        <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{pssAllowedCapabilities}</p>
      </div>

      {/* Allowed Volumes */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>8 Allowed Volume Types (Restricted)</span>
          <CopyBtn text={pssAllowedVolumes} copyKey="volumes" onCopy={handleCopy} copied={copiedMap['volumes']} />
        </div>
        <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{pssAllowedVolumes}</p>
      </div>

      {/* PSA Labels */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>PSA Namespace Labels</span>
          <CopyBtn text={psaLabels} copyKey="psa" onCopy={handleCopy} copied={copiedMap['psa']} />
        </div>
        <pre className="text-sm font-mono p-3 rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--text-primary)' }}>
          <code>{psaLabels}</code>
        </pre>
      </div>
    </div>
  );
}

function RBACTab() {
  const dangerColors: Record<string, string> = {
    Low: 'var(--accent-sage)',
    Medium: 'var(--accent-amber)',
    High: 'var(--accent-coral)',
    Critical: 'var(--danger)',
  };

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        All 11 RBAC verbs with danger levels.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Verb</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Description</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Danger Level</th>
            </tr>
          </thead>
          <tbody>
            {rbacVerbsData.map((v, i) => (
              <motion.tr
                key={v.verb}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td className="py-3 px-4">
                  <code
                    className="font-mono text-sm font-semibold px-2 py-0.5 rounded"
                    style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(4,80,54,0.08)' }}
                  >
                    {v.verb}
                  </code>
                </td>
                <td className="py-3 px-4" style={{ color: 'var(--text-primary)' }}>{v.description}</td>
                <td className="py-3 px-4">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      color: dangerColors[v.dangerLevel],
                      backgroundColor: `${dangerColors[v.dangerLevel]  }18`,
                    }}
                  >
                    {v.dangerLevel}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Binding Rules */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Binding Rules</h4>
        <div className="space-y-2">
          {rbacBindingRules.map((r, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <code className="font-mono px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-primary)' }}>
                {r.from}
              </code>
              <span style={{ color: 'var(--text-tertiary)' }}>&rarr;</span>
              <code className="font-mono px-2 py-1 rounded" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--accent-lavender)' }}>
                {r.to}
              </code>
              <span style={{ color: 'var(--text-secondary)' }}>({r.scope})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EncryptionTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Encryption provider chain for etcd encryption at rest, from least to most secure.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {encryptionChain.map((item, i) => (
          <motion.div
            key={item.provider}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-2"
          >
            <div
              className="px-4 py-3 rounded-xl border text-center"
              style={{
                backgroundColor: i === encryptionChain.length - 1 ? 'rgba(4,80,54,0.08)' : 'var(--surface-elevated)',
                borderColor: i === encryptionChain.length - 1 ? 'var(--accent-primary)' : 'var(--border-subtle)',
              }}
            >
              <div
                className="font-mono text-sm font-semibold"
                style={{ color: i === encryptionChain.length - 1 ? 'var(--accent-primary)' : 'var(--text-primary)' }}
              >
                {item.provider}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </div>
            </div>
            {i < encryptionChain.length - 1 && (
              <span className="text-lg" style={{ color: 'var(--text-tertiary)' }}>&rarr;</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>etcd Ports</h4>
        <div className="flex gap-6 text-sm">
          <div>
            <code className="font-mono text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>2379</code>
            <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>— Client API</span>
          </div>
          <div>
            <code className="font-mono text-lg font-semibold" style={{ color: 'var(--accent-primary)' }}>2380</code>
            <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>— Peer communication</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkTab({ copiedMap, handleCopy }: { copiedMap: Record<string, boolean>; handleCopy: (t: string, k: string) => void | Promise<void> }) {
  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Key facts about Kubernetes NetworkPolicy.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {networkPolicyFacts.map((fact, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fact}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Default Deny Templates</h4>
          <CopyBtn text={networkPolicyDefaults} copyKey="netpol" onCopy={handleCopy} copied={copiedMap['netpol']} />
        </div>
        <pre
          className="text-sm p-4 rounded-lg overflow-x-auto"
          style={{ backgroundColor: 'var(--surface-code)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
        >
          <code>{networkPolicyDefaults}</code>
        </pre>
      </div>
    </div>
  );
}

function CommandsTab({ copiedMap, handleCopy }: { copiedMap: Record<string, boolean>; handleCopy: (t: string, k: string) => void | Promise<void> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Essential kubectl commands for the exam.
        </p>
        <CopyBtn
          text={kubectlCommands.map((c) => `${c.command}  # ${c.purpose}`).join('\n')}
          copyKey="all-cmds"
          onCopy={handleCopy}
          copied={copiedMap['all-cmds']}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-medium)' }}>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Command</th>
              <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {kubectlCommands.map((cmd, i) => (
              <motion.tr
                key={cmd.command}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <td className="py-3 px-4">
                  <code className="font-mono text-sm" style={{ color: 'var(--accent-primary)' }}>
                    {cmd.command}
                  </code>
                </td>
                <td className="py-3 px-4" style={{ color: 'var(--text-secondary)' }}>{cmd.purpose}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* kube-bench */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>kube-bench</h4>
          <CopyBtn text={kubeBenchCommand} copyKey="kubebench" onCopy={handleCopy} copied={copiedMap['kubebench']} />
        </div>
        <pre className="text-sm p-4 rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          <code>{kubeBenchCommand}</code>
        </pre>
      </div>

      {/* Falco */}
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Falco</h4>
          <CopyBtn text={falcoCommand} copyKey="falco" onCopy={handleCopy} copied={copiedMap['falco']} />
        </div>
        <pre className="text-sm p-4 rounded-lg overflow-x-auto" style={{ backgroundColor: 'var(--surface-code)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          <code>{falcoCommand}</code>
        </pre>
      </div>
    </div>
  );
}

function ComponentsTab() {
  return (
    <div className="space-y-8">
      {/* Authentication Methods */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          Authentication Methods (most to least secure)
        </h3>
        <div className="space-y-2">
          {authMethods.map((a, i) => (
            <motion.div
              key={a.method}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{
                backgroundColor: a.secure ? 'rgba(10,123,62,0.04)' : 'rgba(232,122,93,0.04)',
                borderColor: a.secure ? 'rgba(10,123,62,0.15)' : 'rgba(232,122,93,0.15)',
              }}
            >
              <span className="text-lg font-bold w-6 text-center" style={{ color: 'var(--text-tertiary)' }}>{i + 1}</span>
              <div>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.method}</span>
                <span className="text-sm ml-2" style={{ color: 'var(--text-secondary)' }}>— {a.description}</span>
                {!a.secure && (
                  <span
                    className="ml-2 text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ color: 'var(--accent-coral)', backgroundColor: 'rgba(232,122,93,0.1)' }}
                  >
                    Must disable
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Authorization Modes */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          Authorization Modes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {authorizationModes.map((m, i) => (
            <motion.div
              key={m.mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: m.mode === 'RBAC' ? 'rgba(4,80,54,0.06)' : 'var(--surface-elevated)',
                borderColor: m.mode === 'RBAC' ? 'var(--accent-primary)' : 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-mono text-sm font-semibold px-2 py-0.5 rounded"
                  style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(4,80,54,0.08)' }}
                >
                  {m.mode}
                </span>
                {m.mode === 'RBAC' && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ color: 'var(--accent-sage)', backgroundColor: 'rgba(10,123,62,0.1)' }}
                  >
                    Primary
                  </span>
                )}
              </div>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{m.use}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Runtime Security */}
      <div>
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          Runtime Security Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {runtimeSecurity.map((r, i) => (
            <motion.div
              key={r.feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <span
                className="font-mono text-sm font-semibold px-2 py-0.5 rounded"
                style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(4,80,54,0.08)' }}
              >
                {r.feature}
              </span>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{r.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TipsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
          Top 10 High-Yield Facts
        </h3>
        <div className="space-y-3">
          {examTipsData.map((tip, i) => (
            <motion.div
              key={tip.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: 'var(--accent-primary)', color: '#fff' }}
              >
                {tip.number}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{tip.title}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{tip.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className="p-5 rounded-[20px] border-l-4"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-subtle)',
          borderLeftColor: 'var(--accent-amber)',
        }}
      >
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--accent-amber)' }}>
          Time Management
        </h3>
        <ul className="space-y-2">
          {timeManagementTips.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent-amber)' }}>&bull;</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ===== Main Cheat Sheet Page =====

export default function CheatSheet() {
  const [activeTab, setActiveTab] = useState('ports');
  const { copiedMap, handleCopy } = useCopyButton();

  const handlePrint = () => {
    window.print();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ports': return <PortsTab copiedMap={copiedMap} handleCopy={handleCopy} />;
      case 'pss': return <PSSTab copiedMap={copiedMap} handleCopy={handleCopy} />;
      case 'rbac': return <RBACTab />;
      case 'encryption': return <EncryptionTab />;
      case 'network': return <NetworkTab copiedMap={copiedMap} handleCopy={handleCopy} />;
      case 'commands': return <CommandsTab copiedMap={copiedMap} handleCopy={handleCopy} />;
      case 'components': return <ComponentsTab />;
      case 'tips': return <TipsTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] px-4 py-8 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1
                className="text-4xl md:text-5xl font-normal mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Quick Reference
              </h1>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
                Everything you need to memorize, in one place. Use this for rapid review before the exam.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] print:hidden"
              style={{
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface-base)',
              }}
            >
              <Printer size={16} /> Print Friendly
            </button>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.1 }}
          className="mb-8 overflow-x-auto print:hidden"
        >
          <div className="flex gap-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: activeTab === tab.id ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 md:p-8 rounded-[20px] border"
            style={{
              backgroundColor: 'var(--surface-base)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
