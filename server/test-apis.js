const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (name, condition, details = '') => {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} - ${details}`);
      failed++;
    }
  };

  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert('Health Check', healthRes.status === 200 && healthData.status === 'healthy');

    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tms.io', password: 'WrongPassword' }),
    });
    assert('Auth: Invalid credentials', badLoginRes.status === 401);

    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tms.io', password: 'Admin@123' }),
    });
    const adminAuth = await adminLoginRes.json();
    assert('Auth: Admin login', adminLoginRes.status === 200 && adminAuth.token && adminAuth.user.role === 'admin');
    const adminToken = adminAuth.token;

    const memberLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'member@tms.io', password: 'Member@123' }),
    });
    const memberAuth = await memberLoginRes.json();
    assert('Auth: Member login', memberLoginRes.status === 200 && memberAuth.user.role === 'member');
    const memberToken = memberAuth.token;

    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = await meRes.json();
    assert('Auth: GET /api/auth/me', meRes.status === 200 && meData.user.email === 'admin@tms.io');

    const noTokenRes = await fetch(`${BASE_URL}/projects`);
    assert('RBAC: Block unauthenticated access', noTokenRes.status === 401);

    const membersRes = await fetch(`${BASE_URL}/team-members`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const membersData = await membersRes.json();
    assert('GET /api/team-members', membersRes.status === 200 && membersData.data.length > 0);

    const newMemberPayload = {
      name: 'Sarah Connor',
      email: `sarah.${Date.now()}@skynet.com`,
      role: 'DevOps Engineer',
      department: 'Security',
      phone: '+1 555-0199',
      status: 'Active',
      skills: ['AWS', 'Terraform', 'Vault'],
    };
    const createMemberRes = await fetch(`${BASE_URL}/team-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newMemberPayload),
    });
    const createdMemberData = await createMemberRes.json();
    assert('POST /api/team-members', createMemberRes.status === 201 && createdMemberData.data._id);
    const createdMemberId = createdMemberData.data?._id;

    const memberCreateMemberRes = await fetch(`${BASE_URL}/team-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
      body: JSON.stringify({ name: 'User', email: 'user@test.com', role: 'Dev' }),
    });
    assert('RBAC: Member cannot create team member', memberCreateMemberRes.status === 403);

    const projectsRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const projectsData = await projectsRes.json();
    assert('GET /api/projects', projectsRes.status === 200 && projectsData.data.length > 0);
    const existingProject = projectsData.data[0];

    const statsRes = await fetch(`${BASE_URL}/projects/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('GET /api/projects/stats', statsRes.status === 200);

    const getProjectRes = await fetch(`${BASE_URL}/projects/${existingProject._id}`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert('GET /api/projects/:id', getProjectRes.status === 200);

    const newProjectPayload = {
      title: 'Automated Postman Verification System',
      description: 'End-to-end integration and API verification suite for the TMS backend.',
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      budget: 12000,
      spent: 3500,
      progress: 40,
      category: 'Quality Assurance',
      tags: ['Testing', 'Automation', 'Express'],
      teamMembers: [createdMemberId],
    };
    const createProjectRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newProjectPayload),
    });
    const createdProjectData = await createProjectRes.json();
    assert('POST /api/projects', createProjectRes.status === 201 && createdProjectData.data._id);
    const createdProjectId = createdProjectData.data?._id;

    const memberDeleteRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert('RBAC: Member cannot delete project', memberDeleteRes.status === 403);

    const adminDeleteRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('DELETE /api/projects/:id', adminDeleteRes.status === 200);

    const adminDeleteMemberRes = await fetch(`${BASE_URL}/team-members/${createdMemberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('DELETE /api/team-members/:id', adminDeleteMemberRes.status === 200);

    console.log(`Results: ${passed} passed, ${failed} failed`);
  } catch (err) {
    console.error('Test error:', err);
  }
};

runTests();
