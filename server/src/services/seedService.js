import { TeamMember } from '../models/TeamMember.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';

export const seedDatabase = async () => {
  // 1. Seed Users for Auth & Role Based Access Control
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[Seed] Seeding default authentication users (admin, manager, member)...');
    await User.create([
      {
        name: 'Alex Rivera',
        email: 'admin@tms.io',
        password: 'Admin@123',
        role: 'admin',
        title: 'Executive Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
      {
        name: 'Morgan Vance',
        email: 'manager@tms.io',
        password: 'Manager@123',
        role: 'manager',
        title: 'Project Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      {
        name: 'Taylor Brooks',
        email: 'member@tms.io',
        password: 'Member@123',
        role: 'member',
        title: 'Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      },
    ]);
    console.log('[Seed] Default users seeded successfully.');
  }

  const memberCount = await TeamMember.countDocuments();
  if (memberCount > 0) {
    console.log('[Seed] Database already contains records. Skipping seed.');
    return;
  }

  console.log('[Seed] Database is empty. Seeding initial demo data...');

  const members = await TeamMember.create([
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@techcorp.io',
      role: 'Frontend Developer',
      department: 'Engineering',
      phone: '+1 (555) 234-5678',
      status: 'Active',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Bob Smith',
      email: 'bob.smith@techcorp.io',
      role: 'Backend Developer',
      department: 'Engineering',
      phone: '+1 (555) 345-6789',
      status: 'Active',
      skills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'GraphQL'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      name: 'Clara Zhang',
      email: 'clara.zhang@techcorp.io',
      role: 'UI/UX Designer',
      department: 'Product Design',
      phone: '+1 (555) 456-7890',
      status: 'Active',
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      name: 'David Miller',
      email: 'david.miller@techcorp.io',
      role: 'DevOps Engineer',
      department: 'Infrastructure',
      phone: '+1 (555) 567-8901',
      status: 'Active',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'GitHub Actions'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@techcorp.io',
      role: 'QA Engineer',
      department: 'Quality Assurance',
      phone: '+1 (555) 678-9012',
      status: 'Active',
      skills: ['Cypress', 'Playwright', 'Jest', 'API Testing', 'Performance'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  ]);

  const now = new Date();
  const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  await Project.create([
    {
      title: 'Cloud Infrastructure Modernization',
      description: 'Migrate legacy microservices to Kubernetes on AWS EKS with automated zero-downtime CI/CD pipelines.',
      status: 'In Progress',
      priority: 'High',
      startDate: addDays(-20),
      dueDate: addDays(40),
      budget: 45000,
      spent: 28000,
      progress: 65,
      category: 'DevOps & Cloud',
      tags: ['AWS', 'Kubernetes', 'CI/CD', 'Docker'],
      teamMembers: [members[1]._id, members[3]._id],
    },
    {
      title: 'Mobile App Redesign 2.0',
      description: 'Complete overhaul of user interface and checkout experience for the iOS and Android flagship applications.',
      status: 'Planning',
      priority: 'Medium',
      startDate: addDays(-5),
      dueDate: addDays(60),
      budget: 35000,
      spent: 4200,
      progress: 20,
      category: 'Mobile & Design',
      tags: ['Figma', 'React Native', 'UI/UX', 'Mobile'],
      teamMembers: [members[0]._id, members[2]._id],
    },
    {
      title: 'Global Payment Gateway Integration',
      description: 'Integrate Stripe and PayPal checkout flows supporting multi-currency payments, 3D Secure, and fraud detection.',
      status: 'Completed',
      priority: 'Urgent',
      startDate: addDays(-45),
      dueDate: addDays(-2),
      budget: 25000,
      spent: 23500,
      progress: 100,
      category: 'Fintech',
      tags: ['Stripe', 'Node.js', 'Security', 'Payments'],
      teamMembers: [members[1]._id, members[4]._id],
    },
    {
      title: 'Real-Time Customer Analytics Dashboard',
      description: 'Build high-performance real-time analytics dashboard with interactive charts, event streaming, and exportable reports.',
      status: 'In Progress',
      priority: 'High',
      startDate: addDays(-14),
      dueDate: addDays(25),
      budget: 30000,
      spent: 18500,
      progress: 55,
      category: 'Web Development',
      tags: ['React', 'WebSockets', 'Tailwind', 'Node.js'],
      teamMembers: [members[0]._id, members[1]._id, members[2]._id],
    },
    {
      title: 'SOC2 Security Compliance & Audit',
      description: 'Prepare documentation, audit logging, vulnerability scans, and access control matrices for annual SOC2 certification.',
      status: 'On Hold',
      priority: 'Medium',
      startDate: addDays(-30),
      dueDate: addDays(90),
      budget: 20000,
      spent: 8000,
      progress: 35,
      category: 'Security & Compliance',
      tags: ['Security', 'Audit', 'Compliance'],
      teamMembers: [members[3]._id, members[4]._id],
    },
  ]);

  console.log('[Seed] Database successfully seeded with initial projects and team members.');
};
