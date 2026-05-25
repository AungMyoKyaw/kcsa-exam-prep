// Explain Like I'm 5 data for difficult KCSA concepts

export interface Eli5Entry {
  concept: string;
  analogy: string;
  short: string;
}

export const eli5Data: Record<string, Eli5Entry> = {
  rbac: {
    concept: 'RBAC (Role-Based Access Control)',
    analogy: 'Like a building with key cards — who you are (your ID badge) determines what rooms you can enter (permissions). In Kubernetes, Roles define which rooms (resources) you can access, and RoleBindings attach those permissions to specific people (users or ServiceAccounts).',
    short: 'Key cards for your Kubernetes cluster.',
  },
  networkpolicy: {
    concept: 'NetworkPolicy',
    analogy: 'Like an apartment building with locked hallways between units. By default, all apartment doors are open and anyone can walk in. A NetworkPolicy is like the building manager deciding which tenants can visit which apartments — some doors stay locked, some are open only between specific units.',
    short: 'Apartment building door locks between units.',
  },
  etcd: {
    concept: 'etcd',
    analogy: 'Like the building\'s master ledger that records who lives where, who has keys, and what the rules are. If someone steals or changes the ledger, they control the entire building. That\'s why etcd must be encrypted and only the building manager (API Server) can write to it.',
    short: 'The master ledger of the building.',
  },
  apiserver: {
    concept: 'API Server',
    analogy: 'Like the front desk receptionist of the building. Every request — whether someone wants a new key, wants to enter a room, or wants to know who lives where — must go through the front desk. The receptionist checks IDs (authentication) and permissions (authorization) before allowing anything.',
    short: 'The front desk receptionist.',
  },
  kubelet: {
    concept: 'Kubelet',
    analogy: 'Like the building superintendent on each floor. The superintendent makes sure every apartment (pod) has running water and electricity, checks if residents are healthy, and reports back to management. If a resident stops breathing (a container crashes), the superintendent replaces them.',
    short: 'The floor superintendent keeping apartments running.',
  },
  stride: {
    concept: 'STRIDE Threat Model',
    analogy: 'Like a security guard doing a systematic walkthrough of the building, checking for 6 specific problems: Spoofing (fake IDs), Tampering (broken locks), Repudiation (no security cameras), Information Disclosure (windows without curtains), Denial of Service (blocking all doors), and Elevation of Privilege (someone sneaking into the manager\'s office).',
    short: 'A security guard\'s 6-point checklist.',
  },
  podsecurity: {
    concept: 'Pod Security Standards',
    analogy: 'Like apartment safety rules. "Privileged" means no rules — you can do anything (dangerous). "Baseline" means basic safety — no open flames, no dangerous chemicals. "Restricted" means maximum safety — fireproof everything, no risky behavior at all.',
    short: 'Apartment safety rules: no-rules, basic, or maximum safety.',
  },
  secrets: {
    concept: 'Secrets Management',
    analogy: 'Like storing spare keys in a safe instead of under the doormat. Kubernetes Secrets are a safer way to store passwords and keys than putting them directly in your apartment lease (YAML files). But they\'re not perfectly safe by default — you should also encrypt the safe (encryption at rest) and limit who has the combination.',
    short: 'A safe for spare keys, not under the doormat.',
  },
  admission: {
    concept: 'Admission Controllers',
    analogy: 'Like a strict building inspector who checks every new lease before anyone moves in. The inspector makes sure the apartment meets safety standards (Policy as Code). If the lease violates rules — like requesting a penthouse without fire exits — the inspector rejects it before anyone moves in.',
    short: 'The strict building inspector before move-in.',
  },
  cni: {
    concept: 'CNI (Container Network Interface)',
    analogy: 'Like the building\'s plumbing system that connects all apartments to water. CNI is the plumbing that connects all pods to the network. Different CNI providers are like different plumbing companies — Calico, Cilium, Flannel — each with different features (some add firewalls, some are faster).',
    short: 'The plumbing connecting all apartments to water.',
  },
  serviceaccount: {
    concept: 'ServiceAccount',
    analogy: 'Like a robot butler that lives in your apartment and has its own key card. Instead of using your personal key for automated tasks (like fetching mail), the robot butler has its own key with limited permissions — so if the robot is compromised, the thief only gets robot-level access, not your master key.',
    short: 'A robot butler with its own limited key card.',
  },
  tls: {
    concept: 'TLS / mTLS',
    analogy: 'Like sending letters in locked envelopes that only the recipient can open. Regular TLS is like a locked envelope from you to the building. mTLS is like BOTH you AND the building manager using locked envelopes — you verify each other\'s identities before exchanging anything.',
    short: 'Locked envelopes for all mail.',
  },
  image: {
    concept: 'Container Images',
    analogy: 'Like a pre-furnished apartment in a box. The image contains everything needed to set up the apartment — furniture (libraries), appliances (dependencies), and blueprints (code). A distroless image is like an apartment with only the essentials — no toolbox, no extra closets, nothing an intruder could use.',
    short: 'A furnished apartment in a box.',
  },
  falco: {
    concept: 'Falco',
    analogy: 'Like a security camera with AI that watches for suspicious behavior. It notices when someone tries to pick a lock, climb through a window, or carry something unusual. Instead of just recording, it screams an alert so security can respond immediately.',
    short: 'AI security camera that screams alerts.',
  },
  kyverno: {
    concept: 'Kyverno',
    analogy: 'Like an automatic rule-enforcement robot. You write rules like "all new apartments must have smoke detectors" and Kyverno automatically rejects any new apartment that doesn\'t comply. No coding required — just plain English rules.',
    short: 'An automatic rule-enforcement robot.',
  },
  cosign: {
    concept: 'Cosign / Image Signing',
    analogy: 'Like a notary public stamp on an apartment lease. Before anyone moves in, you check the stamp to verify the lease is genuine and hasn\'t been tampered with. Cosign adds a digital stamp to container images so you know they\'re authentic.',
    short: 'A notary stamp proving the lease is genuine.',
  },
  supplychain: {
    concept: 'Supply Chain Security',
    analogy: 'Like tracing every ingredient in a restaurant meal back to the farm. You want to know: Who grew the tomatoes? Were they inspected? Was the truck clean? In software, supply chain security traces every library and dependency to make sure nothing malicious was added along the way.',
    short: 'Tracing every meal ingredient back to the farm.',
  },
  cis: {
    concept: 'CIS Benchmarks',
    analogy: 'Like a detailed home inspection checklist written by security experts. It tells you exactly which locks to use, how high the fences should be, and where to place cameras. kube-bench is like hiring an inspector who automatically checks every item on the list for you.',
    short: 'A detailed home inspection checklist.',
  },
  namespaces: {
    concept: 'Namespaces',
    analogy: 'Like colored floor labels in a building. The red floor is production, the blue floor is staging, the green floor is development. The labels help organize things, but without actual locked doors (NetworkPolicies), anyone can still walk between floors freely.',
    short: 'Colored floor labels — organization, not security.',
  },
};

export function getEli5(conceptKey: string): Eli5Entry | undefined {
  return eli5Data[conceptKey.toLowerCase()];
}
