import { useState } from 'react';
import { Brain, Network, Server, Database, Cpu, Globe, Lock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import MemorizeCard from './MemorizeCard';

/* ────────────────────── Port Data ────────────────────── */
interface PortItem {
  port: string;
  component: string;
  protocol: string;
  mnemonic: string;
  story: string;
  group: string;
  pattern: string;
}

const portGroups: PortItem[][] = [
  // Group 1 — Control Plane Core
  [
    {
      port: '6443',
      component: 'API Server (HTTPS)',
      protocol: 'HTTPS',
      mnemonic: '64GB server answers (43) API calls',
      story: 'Think of a 64GB server (64) that answers (43) to API requests. 43 is the answer to life, the universe, and everything — and the API Server is the answer to every cluster request.',
      group: 'Group 1',
      pattern: 'Control Plane Core',
    },
    {
      port: '2379',
      component: 'etcd client',
      protocol: 'gRPC/HTTPS',
      mnemonic: '23 is Michael Jordan, 79 is the last year of the 70s',
      story: 'etcd talks to clients on 2379. 79 was the year before the 80s — clients come first, then peers. MJ (23) stores all the cluster state in the 70s vault (79).',
      group: 'Group 1',
      pattern: 'Control Plane Core',
    },
    {
      port: '2380',
      component: 'etcd peer',
      protocol: 'Raft/HTTPS',
      mnemonic: '80 is the standard HTTP port, peers talk on 2380',
      story: 'etcd peers gossip on 2380. 80 is the classic HTTP port — peers are like the "HTTP friends" of etcd, syncing cluster state behind the scenes.',
      group: 'Group 1',
      pattern: 'Control Plane Core',
    },
    {
      port: '10257',
      component: 'Controller Manager',
      protocol: 'HTTPS',
      mnemonic: '1025x = managers, 7 = lucky number',
      story: 'Control plane managers start with 1025x. 7 is lucky — the Controller Manager magically keeps your cluster in the desired state, like a lucky charm.',
      group: 'Group 1',
      pattern: 'Control Plane Core',
    },
    {
      port: '10259',
      component: 'Scheduler',
      protocol: 'HTTPS',
      mnemonic: '1025x = managers, 9 = almost perfect 10',
      story: 'Control plane managers start with 1025x. 9 is almost a perfect 10 — the Scheduler almost perfectly places every pod on the ideal node.',
      group: 'Group 1',
      pattern: 'Control Plane Core',
    },
  ],
  // Group 2 — Worker Nodes
  [
    {
      port: '10250',
      component: 'Kubelet',
      protocol: 'HTTPS',
      mnemonic: '1025x = workers, 0 = start of work',
      story: 'All worker node services start with 1024x. 10250 is the main Kubelet (0=base) — the starting point of all pod life on the node.',
      group: 'Group 2',
      pattern: 'Worker Node',
    },
    {
      port: '10248',
      component: 'Kubelet healthz',
      protocol: 'HTTP',
      mnemonic: '1024x = health, 8 = infinity/health',
      story: 'All worker node services start with 1024x. 10248 is health (8=infinity=healthy). An infinity symbol (∞) looks like an 8 lying down — health that never ends.',
      group: 'Group 2',
      pattern: 'Worker Node',
    },
    {
      port: '10249',
      component: 'Kube-proxy',
      protocol: 'HTTP',
      mnemonic: '1024x = proxies, 9 = almost there / forwarding',
      story: 'All worker node services start with 1024x. 10249 is proxy (9=forwarding). The proxy forwards (9→onward) traffic to pods behind the scenes.',
      group: 'Group 2',
      pattern: 'Worker Node',
    },
  ],
  // Group 3 — Cloud Native Standards
  [
    {
      port: '443',
      component: 'HTTPS standard',
      protocol: 'HTTPS',
      mnemonic: 'Standard HTTPS, know this already',
      story: 'If you know the web, you know 443. It is THE secure port. No mnemonic needed — just burn it into your brain.',
      group: 'Group 3',
      pattern: 'Standard',
    },
    {
      port: '80',
      component: 'HTTP standard',
      protocol: 'HTTP',
      mnemonic: 'Standard HTTP, know this already',
      story: 'The original web port. 80 = "ATE NOTHING" (it has zero security). Always redirect to 443 in production.',
      group: 'Group 3',
      pattern: 'Standard',
    },
  ],
];

const groupMeta = [
  {
    title: 'Control Plane Core',
    subtitle: 'The brain of the cluster — memorize these first',
    icon: Server,
    color: 'var(--accent-lavender)',
    bg: 'rgba(155,135,245,0.06)',
  },
  {
    title: 'Worker Nodes',
    subtitle: 'The muscle — services that run on every node',
    icon: Cpu,
    color: 'var(--accent-amber)',
    bg: 'rgba(242,196,77,0.06)',
  },
  {
    title: 'Cloud Native Standards',
    subtitle: 'Universal ports you should already know',
    icon: Globe,
    color: 'var(--accent-primary)',
    bg: 'rgba(9,105,218,0.04)',
  },
];

/* ────────────────────── Pattern Table ────────────────────── */
function PatternTable() {
  const patterns = [
    { prefix: '1024x', type: 'Worker / Proxy', examples: '10250 (Kubelet), 10248 (healthz), 10249 (proxy)' },
    { prefix: '1025x', type: 'Manager / Control', examples: '10257 (Controller), 10259 (Scheduler)' },
    { prefix: '237x', type: 'etcd', examples: '2379 (client), 2380 (peer)' },
    { prefix: '6443', type: 'API Server', examples: '6443 (HTTPS) — standalone, just remember it' },
  ];

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            {['Prefix', 'Component Type', 'Examples'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left"
                style={{
                  backgroundColor: 'rgba(4,80,54,0.08)',
                  color: 'var(--accent-primary)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patterns.map((p, i) => (
            <tr
              key={p.prefix}
              style={{
                backgroundColor: i % 2 === 0 ? 'var(--surface-base)' : 'var(--surface-elevated)',
              }}
            >
              <td
                className="px-4 py-3 font-mono font-bold"
                style={{ color: 'var(--accent-primary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {p.prefix}
              </td>
              <td
                className="px-4 py-3 font-medium"
                style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {p.type}
              </td>
              <td
                className="px-4 py-3 text-xs"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
              >
                {p.examples}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────── Master Mnemonics Section ────────────────────── */
function MasterMnemonics({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const mnemonics = [
    {
      title: '6443 — API Server',
      text: 'Think of a 64GB server (64) that answers (43) to API requests. 43 is the answer to life, the universe, and everything — and the API Server is the answer to every cluster request.',
      icon: Lock,
      color: 'var(--accent-lavender)',
    },
    {
      title: '2379 / 2380 — etcd',
      text: 'etcd talks to clients on 2379 and peers on 2380. 79 was the year before the 80s — clients come first, then peers. MJ (23) stores cluster state in the 70s vault (79), then peers catch up in the 80s (80).',
      icon: Database,
      color: 'var(--accent-primary)',
    },
    {
      title: '10250 / 10248 / 10249 — Workers',
      text: 'All worker node services start with 1024x. 10250 is the main Kubelet (0=base/start), 10248 is health (8=infinity=healthy), 10249 is proxy (9=forwarding/onward).',
      icon: Cpu,
      color: 'var(--accent-amber)',
    },
    {
      title: '10257 / 10259 — Managers',
      text: 'Control plane managers start with 1025x. 7 is lucky (controller manages luck), 9 is scheduler (scheduling to 9, almost perfect).',
      icon: Server,
      color: 'var(--accent-coral)',
    },
  ];

  return (
    <div className="my-6">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm font-semibold mb-4 transition-opacity hover:opacity-80"
        style={{ color: 'var(--accent-primary)' }}
      >
        <Brain size={16} />
        Master Mnemonic Stories
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mnemonics.map((m) => (
            <div
              key={m.title}
              className="rounded-lg p-4"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <m.icon size={14} style={{ color: m.color }} />
                <span className="text-sm font-semibold" style={{ color: m.color }}>
                  {m.title}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {m.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────── Test Mode Bar ────────────────────── */
function TestModeBar({ allPorts, hiddenMap, onToggle }: {
  allPorts: PortItem[];
  hiddenMap: Record<string, boolean>;
  onToggle: (port: string) => void;
}) {
  const hiddenCount = Object.values(hiddenMap).filter(Boolean).length;
  const allHidden = hiddenCount === allPorts.length;

  return (
    <div
      className="flex flex-wrap items-center gap-3 p-4 rounded-xl mb-8"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        <Eye size={14} className="inline mr-1" style={{ color: 'var(--accent-primary)' }} />
        Test Mode:
      </span>
      <button
        onClick={() => {
          allPorts.forEach((p) => onToggle(p.port));
        }}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90"
        style={{
          backgroundColor: allHidden ? 'rgba(9,105,218,0.1)' : 'var(--surface-code)',
          color: 'var(--accent-primary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {allHidden ? 'Show All' : 'Hide All Numbers'}
      </button>
      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
        {hiddenCount} of {allPorts.length} hidden
      </span>
    </div>
  );
}

/* ══════════════════════════ PORT MEMORY SYSTEM ══════════════════════════ */
export default function PortMemorySystem() {
  const [mnemonicsExpanded, setMnemonicsExpanded] = useState(true);
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({});

  const allPorts = portGroups.flat();

  const toggleHidden = (port: string) => {
    setHiddenMap((prev) => ({ ...prev, [port]: !prev[port] }));
  };

  return (
    <div className="my-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'rgba(130,87,229,0.12)' }}
        >
          <Brain size={22} style={{ color: 'var(--accent-lavender)' }} />
        </div>
        <div>
          <h2
            className="text-2xl font-normal"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          >
            Port Memorization System
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Proven memory techniques for KCSA port numbers
          </p>
        </div>
      </div>

      <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
        Port numbers are <strong>heavily tested</strong> on the KCSA exam. Use these mnemonic stories
        and pattern recognition to burn them into long-term memory. The absurdity of the stories is
        intentional — bizarre memories stick better.
      </p>

      {/* Pattern Recognition Table */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Network size={16} style={{ color: 'var(--accent-primary)' }} />
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Pattern Recognition
          </h3>
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Spot the prefixes — they are the key to unlocking every port number:
        </p>
        <PatternTable />
        <div
          className="flex items-start gap-2 p-3 rounded-lg text-sm"
          style={{
            backgroundColor: 'rgba(242,196,77,0.08)',
            borderLeft: '3px solid var(--accent-amber)',
          }}
        >
          <Brain size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-amber)' }} />
          <span style={{ color: 'var(--text-primary)' }}>
            <strong>Memory hack:</strong> 1024 = workers (they do the heavy lifting), 1025 = managers
            (one step above workers). 237x = etcd (the 23-prefix club). 6443 = API Server (stands alone
            like the singleton it is).
          </span>
        </div>
      </div>

      {/* Master Mnemonics */}
      <MasterMnemonics
        expanded={mnemonicsExpanded}
        onToggle={() => setMnemonicsExpanded((prev) => !prev)}
      />

      {/* Test Mode Bar */}
      <TestModeBar allPorts={allPorts} hiddenMap={hiddenMap} onToggle={toggleHidden} />

      {/* Port Groups */}
      <div className="space-y-10">
        {portGroups.map((group, gi) => {
          const meta = groupMeta[gi];
          const Icon = meta.icon;

          return (
            <div key={meta.title}>
              {/* Group header */}
              <div
                className="flex items-center gap-3 mb-4 pb-3"
                style={{ borderBottom: `1.5px solid ${meta.color}` }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Icon size={18} style={{ color: meta.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {meta.title}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {meta.subtitle}
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-mono font-bold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: meta.bg,
                    color: meta.color,
                  }}
                >
                  {group.length} ports
                </span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.map((p) => (
                  <MemorizeCard
                    key={p.port}
                    fact={hiddenMap[p.port] ? '????' : p.port}
                    label={p.component}
                    mnemonic={p.story}
                    pattern={p.pattern}
                    group={p.group}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer call-to-action */}
      <div
        className="mt-10 p-5 rounded-xl"
        style={{
          backgroundColor: 'rgba(130,87,229,0.06)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-start gap-3">
          <Brain size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-lavender)' }} />
          <div>
            <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              Daily Drill
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Cover the port numbers and try to recall each one from the mnemonic alone. If you get
              stuck, read the story again — the absurd images (MJ in the 70s vault, 64GB server answering
              to 43) are designed to create strong memory anchors. Test yourself again in 1 hour, then
              tomorrow, then in 3 days — spaced repetition cements recall.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
