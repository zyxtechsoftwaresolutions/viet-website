import { asStatPairs, asString, asStringArray, normalizeHero, type FacilityHero } from './helpers';

export type LaboratoryLab = {
  id: string;
  name: string;
  image: string;
  description: string;
  features: string[];
  hours: string;
};

export type LaboratoryContent = {
  hero: FacilityHero;
  about: { label: string; title: string; paragraph: string };
  labs: LaboratoryLab[];
  resources: { label: string; title: string; stats: { value: string; label: string }[] };
};

export const DEFAULT_LABORATORY_CONTENT: LaboratoryContent = {
  hero: {
    badge: 'Facilities',
    title: 'Our Laboratories',
    description: 'Where theory meets practice — advanced engineering labs.',
    heroImage: '',
    video: '',
  },
  about: {
    label: 'About our labs',
    title: 'About Our Laboratories',
    paragraph:
      'Our state-of-the-art laboratories form the backbone of practical engineering education. Established with cutting-edge technology and industry-standard equipment, we provide students with hands-on experience across 8+ specialized labs covering all major B.Tech disciplines including Computer Science, Electronics, VLSI Design, Embedded Systems, and Networking. Each lab is supervised by experienced technical staff and lab assistants who guide students through practical sessions, ensuring safety and maximum learning outcomes.',
  },
  labs: [
    {
      id: 'dbms',
      name: 'DBMS Lab',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
      description:
        'Database Management Systems laboratory equipped with SQL Server, MySQL, Oracle, and MongoDB installations. Students gain hands-on experience in database design, normalization, query optimization, and transaction management with industry-standard tools.',
      features: ['50+ Workstations', 'Multiple DBMS Platforms', 'Query Optimization Tools', 'Dedicated Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'simulation',
      name: 'Simulation Lab',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      description:
        'Advanced simulation laboratory featuring MATLAB, Simulink, NS-2/NS-3, and LabVIEW software for modeling and simulating complex systems. Students work on network simulations, signal processing, control systems, and virtual prototyping projects.',
      features: ['High-Performance PCs', 'Licensed Software', 'Virtual Instruments', 'Expert Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'vlsi',
      name: 'VLSI Design Lab',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      description:
        'Cutting-edge VLSI laboratory equipped with Cadence, Xilinx ISE, and Synopsys tools for chip design and verification. Students learn RTL design, FPGA programming, circuit simulation, and physical design using industry-standard EDA tools.',
      features: ['EDA Tool Suite', 'FPGA Development Kits', 'HDL Simulators', 'Technical Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'embedded',
      name: 'Embedded Systems Lab',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      description:
        'Comprehensive embedded systems lab with ARM Cortex, Arduino, Raspberry Pi, and 8051 microcontroller kits. Students develop real-time embedded applications, IoT projects, and firmware programming with hands-on hardware interfacing experience.',
      features: ['Development Boards', 'IoT Kits', 'Debugging Tools', 'Skilled Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'networking',
      name: 'Networking Lab',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      description:
        'Modern networking laboratory with Cisco routers, switches, and network simulation tools. Students configure LAN/WAN networks, implement routing protocols, network security, and troubleshoot real-world networking scenarios using Packet Tracer and GNS3.',
      features: ['Cisco Equipment', 'Network Simulators', 'Security Tools', 'Certified Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
    {
      id: 'it-workshop',
      name: 'IT Workshop Lab',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop',
      description:
        'Comprehensive IT workshop with software development environments, cloud platforms, and collaborative tools. Students work on full-stack development, DevOps, cloud computing, and agile methodologies with access to AWS, Azure, and Google Cloud platforms.',
      features: ['Cloud Platforms', 'Development Tools', 'Version Control', 'Expert Lab Assistant'],
      hours: 'Mon–Sat: 9AM – 4PM',
    },
  ],
  resources: {
    label: 'At a glance',
    title: 'Our Lab Resources',
    stats: [
      { value: '8+', label: 'Specialized Labs' },
      { value: '200+', label: 'Lab Equipment' },
      { value: '15+', label: 'Lab Assistants' },
      { value: '300+', label: 'Workstations' },
    ],
  },
};

function normalizeLabs(v: unknown, fallback: LaboratoryLab[]): LaboratoryLab[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((item: any, i) => ({
    id: asString(item?.id, fallback[i]?.id ?? ''),
    name: asString(item?.name, fallback[i]?.name ?? ''),
    image: asString(item?.image, fallback[i]?.image ?? ''),
    description: asString(item?.description, fallback[i]?.description ?? ''),
    features: asStringArray(item?.features, fallback[i]?.features ?? []),
    hours: asString(item?.hours, fallback[i]?.hours ?? ''),
  }));
}

export function normalizeLaboratoryContent(raw: unknown): LaboratoryContent {
  const d = DEFAULT_LABORATORY_CONTENT;
  const c = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const about = c.about && typeof c.about === 'object' ? (c.about as Record<string, unknown>) : {};
  const resources =
    c.resources && typeof c.resources === 'object' ? (c.resources as Record<string, unknown>) : {};

  return {
    hero: normalizeHero(c.hero, d.hero),
    about: {
      label: asString(about.label, d.about.label),
      title: asString(about.title, d.about.title),
      paragraph: asString(about.paragraph, d.about.paragraph),
    },
    labs: normalizeLabs(c.labs, d.labs),
    resources: {
      label: asString(resources.label, d.resources.label),
      title: asString(resources.title, d.resources.title),
      stats: asStatPairs(resources.stats, d.resources.stats),
    },
  };
}
