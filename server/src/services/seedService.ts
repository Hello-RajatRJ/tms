import { TeamMember } from '../models/TeamMember';
import { Project } from '../models/Project';
import { User } from '../models/User';

export const seedDatabase = async (force: boolean = false): Promise<void> => {
  // 1. Seed Users for Auth & Role Based Access Control
  const defaultUsers = [
    {
      name: 'Alex Rivera',
      email: 'admin@tms.io',
      password: 'Admin@123',
      role: 'admin' as const,
      title: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      name: 'Alex Rivera (Admin)',
      email: 'admin@tms.local',
      password: 'Admin@123456',
      role: 'admin' as const,
      title: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      name: 'Morgan Vance',
      email: 'manager@tms.io',
      password: 'Manager@123',
      role: 'manager' as const,
      title: 'Project Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Taylor Brooks',
      email: 'member@tms.io',
      password: 'Member@123',
      role: 'member' as const,
      title: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
  ];

  for (const u of defaultUsers) {
    const exists = await User.findOne({ email: u.email.toLowerCase() });
    if (!exists) {
      await User.create(u);
    } else {
      await User.updateOne({ email: u.email.toLowerCase() }, { avatar: u.avatar, title: u.title });
    }
  }

  const memberCount = await TeamMember.countDocuments();
  if (memberCount > 0 && !force) {
    console.log('[Seed] Database already contains records. Skipping seed.');
    return;
  }

  if (force) {
    console.log('[Seed] Force reset active. Clearing old collections...');
    await Project.deleteMany({});
    await TeamMember.deleteMany({});
  }

  console.log('[Seed] Seeding reference dataset (8 team members, 12 projects)...');

  // Seed 8 Team Members matching mockup
  const members = await TeamMember.create([
    {
      name: 'Maya Chen',
      email: 'maya.chen@tms.io',
      role: 'Frontend Developer',
      department: 'Engineering',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      skills: ['Frontend Architecture', 'UI Engineering', 'Design Systems', 'Performance'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Noah Patel',
      email: 'noah.patel@tms.io',
      role: 'Backend Developer',
      department: 'Engineering',
      phone: '+1 (555) 345-6789',
      status: 'Active',
      skills: ['API Architecture', 'Database Systems', 'Cloud Services', 'Security'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Olivia Reed',
      email: 'olivia.reed@tms.io',
      role: 'UI/UX Designer',
      department: 'Product Design',
      phone: '+1 (555) 456-7890',
      status: 'Active',
      skills: ['Design Systems', 'User Research', 'Prototyping', 'Visual Polish'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      name: 'David Miller',
      email: 'david.miller@tms.io',
      role: 'DevOps Engineer',
      department: 'Infrastructure',
      phone: '+1 (555) 567-8901',
      status: 'Active',
      skills: ['Cloud Platforms', 'Containerization', 'Automation', 'DevOps'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@tms.io',
      role: 'QA Engineer',
      department: 'Quality Assurance',
      phone: '+1 (555) 678-9012',
      status: 'Active',
      skills: ['Automated Testing', 'Quality Assurance', 'End-to-End', 'Performance'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    {
      name: 'Liam Scott',
      email: 'liam.scott@tms.io',
      role: 'Full Stack Engineer',
      department: 'Engineering',
      phone: '+1 (555) 789-0123',
      status: 'Active',
      skills: ['Full Stack Development', 'Microservices', 'GraphQL', 'APIs'],
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    {
      name: 'Sophia Zhang',
      email: 'sophia.zhang@tms.io',
      role: 'Product Manager',
      department: 'Product',
      phone: '+1 (555) 890-1234',
      status: 'Active',
      skills: ['Product Strategy', 'Agile Delivery', 'Roadmapping', 'Analytics'],
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
    {
      name: 'Lucas Gray',
      email: 'lucas.gray@tms.io',
      role: 'Mobile Engineer',
      department: 'Mobile',
      phone: '+1 (555) 901-2345',
      status: 'Active',
      skills: ['iOS Architecture', 'Android', 'Mobile Performance', 'Offline Sync'],
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    },
  ]);

  // Seed 12 Projects: Exactly 4 Completed, 6 In Progress, 2 Planning (Pending)
  // Average Progress: (70+100+30+65+35+100+80+55+100+100+45+36) / 12 = 816 / 12 = 68%
  await Project.create([
    // Row 1 in Recent Projects: Website Redesign
    {
      title: 'Website Redesign',
      description: 'Redesign the company website with modern UI/UX',
      status: 'In Progress',
      priority: 'High',
      startDate: new Date('2025-01-10'),
      dueDate: new Date('2025-04-25'),
      budget: 35000,
      spent: 24500,
      progress: 70,
      category: 'Web Development',
      tags: ['Design System', 'Frontend', 'Performance'],
      teamMembers: [members[0]._id],
    },
    // Row 2 in Recent Projects: CRM Integration
    {
      title: 'CRM Integration',
      description: 'Integrate CRM with existing platform',
      status: 'Completed',
      priority: 'Urgent',
      startDate: new Date('2025-01-05'),
      dueDate: new Date('2025-04-18'),
      budget: 28000,
      spent: 27500,
      progress: 100,
      category: 'Backend Services',
      tags: ['CRM', 'APIs', 'Sync', 'Integrations'],
      teamMembers: [members[1]._id],
    },
    // Row 3 in Recent Projects: Mobile App
    {
      title: 'Mobile App',
      description: 'Build cross-platform mobile application',
      status: 'Planning',
      priority: 'Medium',
      startDate: new Date('2025-02-15'),
      dueDate: new Date('2025-05-10'),
      budget: 45000,
      spent: 13500,
      progress: 30,
      category: 'Mobile & Design',
      tags: ['Mobile', 'iOS', 'Android', 'Design'],
      teamMembers: [members[2]._id],
    },
    // Remaining Projects for telemetry metrics (12 total, 4 completed, 6 in progress, 2 planning)
    {
      title: 'Cloud Infrastructure Modernization',
      description: 'Migrate legacy microservices to Kubernetes on AWS EKS with automated CI/CD pipelines.',
      status: 'In Progress',
      priority: 'High',
      startDate: new Date('2025-01-20'),
      dueDate: new Date('2025-06-15'),
      budget: 50000,
      spent: 32500,
      progress: 65,
      category: 'Infrastructure',
      tags: ['Kubernetes', 'Cloud', 'DevOps'],
      teamMembers: [members[3]._id],
    },
    {
      title: 'SOC2 Security Compliance & Audit',
      description: 'Prepare documentation, audit logging, vulnerability scans, and access control matrices.',
      status: 'Planning',
      priority: 'Medium',
      startDate: new Date('2025-03-01'),
      dueDate: new Date('2025-07-20'),
      budget: 22000,
      spent: 7700,
      progress: 35,
      category: 'Security',
      tags: ['Compliance', 'Audit', 'Security'],
      teamMembers: [members[5]._id],
    },
    {
      title: 'Payment Gateway Integration',
      description: 'Multi-currency payments, 3D secure authentication, and fraud prevention pipeline.',
      status: 'Completed',
      priority: 'High',
      startDate: new Date('2024-12-01'),
      dueDate: new Date('2025-03-30'),
      budget: 32000,
      spent: 31000,
      progress: 100,
      category: 'Fintech',
      tags: ['Payments', 'Stripe', 'Fintech'],
      teamMembers: [members[1]._id],
    },
    {
      title: 'Customer Portal Revamp',
      description: 'Self-service billing, telemetry usage dashboards, and interactive support ticketing.',
      status: 'In Progress',
      priority: 'Medium',
      startDate: new Date('2025-02-01'),
      dueDate: new Date('2025-05-28'),
      budget: 29000,
      spent: 23200,
      progress: 80,
      category: 'Frontend',
      tags: ['Customer Experience', 'UI'],
      teamMembers: [members[0]._id],
    },
    {
      title: 'Data Analytics Pipeline',
      description: 'High-throughput event streaming, automated ETL workflows, and real-time business telemetry.',
      status: 'In Progress',
      priority: 'High',
      startDate: new Date('2025-02-10'),
      dueDate: new Date('2025-06-05'),
      budget: 40000,
      spent: 22000,
      progress: 55,
      category: 'Data Engineering',
      tags: ['Data Pipeline', 'Analytics', 'ETL'],
      teamMembers: [members[3]._id],
    },
    {
      title: 'API Gateway Federation',
      description: 'Federated microservices gateway with rate-limiting, edge caching, and token validation.',
      status: 'Completed',
      priority: 'Urgent',
      startDate: new Date('2024-11-15'),
      dueDate: new Date('2025-02-15'),
      budget: 26000,
      spent: 25800,
      progress: 100,
      category: 'Backend Services',
      tags: ['APIs', 'Gateway', 'Security'],
      teamMembers: [members[1]._id],
    },
    {
      title: 'Design System 2.0',
      description: 'Unified cross-platform component library with accessibility tokens and dark mode styling.',
      status: 'Completed',
      priority: 'Medium',
      startDate: new Date('2024-12-10'),
      dueDate: new Date('2025-03-10'),
      budget: 18000,
      spent: 17900,
      progress: 100,
      category: 'Product Design',
      tags: ['Design System', 'UI/UX', 'Tokens'],
      teamMembers: [members[2]._id],
    },
    {
      title: 'Real-Time Messaging Engine',
      description: 'Low-latency collaborative presence and live notification delivery service.',
      status: 'In Progress',
      priority: 'High',
      startDate: new Date('2025-03-05'),
      dueDate: new Date('2025-06-30'),
      budget: 34000,
      spent: 15300,
      progress: 45,
      category: 'Real-Time Engine',
      tags: ['WebSockets', 'Presence', 'Messaging'],
      teamMembers: [members[7]._id],
    },
    {
      title: 'Automated QA Pipeline',
      description: 'End-to-end regression suites, test matrix runners, and continuous performance assertions.',
      status: 'In Progress',
      priority: 'Low',
      startDate: new Date('2025-02-25'),
      dueDate: new Date('2025-05-18'),
      budget: 20000,
      spent: 7200,
      progress: 36,
      category: 'Quality Assurance',
      tags: ['Testing', 'Automation', 'CI/CD'],
      teamMembers: [members[4]._id],
    },
  ]);

  console.log('[Seed] Database successfully seeded with 12 projects and 8 team members (68% avg progress).');
};
