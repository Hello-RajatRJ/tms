// Comprehensive API & RBAC Test Suite
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting TMS API & RBAC Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (name, condition, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert('Health Check (200 OK)', healthRes.status === 200 && healthData.status === 'healthy');

    // 2. Auth: Login with invalid password (401)
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tms.io', password: 'WrongPassword' }),
    });
    assert('Auth: Invalid credentials returns 401', badLoginRes.status === 401);

    // 3. Auth: Login as Admin (200 OK + JWT)
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tms.io', password: 'Admin@123' }),
    });
    const adminAuth = await adminLoginRes.json();
    assert('Auth: Admin login success (200 OK + token)', adminLoginRes.status === 200 && adminAuth.token && adminAuth.user.role === 'admin');
    const adminToken = adminAuth.token;

    // 4. Auth: Login as Member (200 OK + role member)
    const memberLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'member@tms.io', password: 'Member@123' }),
    });
    const memberAuth = await memberLoginRes.json();
    assert('Auth: Member login success (200 OK)', memberLoginRes.status === 200 && memberAuth.user.role === 'member');
    const memberToken = memberAuth.token;

    // 5. Auth: GET /api/auth/me (Protected profile)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = await meRes.json();
    assert('Auth: GET /api/auth/me returns profile (200 OK)', meRes.status === 200 && meData.user.email === 'admin@tms.io');

    // 6. Security: Unauthenticated request to projects rejected (401 Unauthorized)
    const noTokenRes = await fetch(`${BASE_URL}/projects`);
    assert('RBAC: Unauthenticated access blocked (401 Unauthorized)', noTokenRes.status === 401);

    // 7. GET /api/team-members (with auth)
    const membersRes = await fetch(`${BASE_URL}/team-members`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const membersData = await membersRes.json();
    assert('GET /api/team-members returns list (200 OK)', membersRes.status === 200 && membersData.data.length > 0);

    // 8. POST /api/team-members (Admin success)
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
    assert('POST /api/team-members success (201 Created)', createMemberRes.status === 201 && createdMemberData.data._id);
    const createdMemberId = createdMemberData.data?._id;

    // 9. RBAC: Member role forbidden from creating team members (403 Forbidden)
    const memberCreateMemberRes = await fetch(`${BASE_URL}/team-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
      body: JSON.stringify({ name: 'Hacker', email: 'hacker@test.com', role: 'Dev' }),
    });
    assert('RBAC: Member role cannot create team member (403 Forbidden)', memberCreateMemberRes.status === 403);

    // 10. GET /api/projects (Authenticated)
    const projectsRes = await fetch(`${BASE_URL}/projects`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const projectsData = await projectsRes.json();
    assert('GET /api/projects returns projects (200 OK)', projectsRes.status === 200 && projectsData.data.length > 0);
    const existingProject = projectsData.data[0];

    // 11. GET /api/projects/stats
    const statsRes = await fetch(`${BASE_URL}/projects/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('GET /api/projects/stats returns analytics (200 OK)', statsRes.status === 200);

    // 12. GET /api/projects/:id (Success)
    const getProjectRes = await fetch(`${BASE_URL}/projects/${existingProject._id}`, {
      headers: { Authorization: `Bearer ${memberToken}` }, // Member can read
    });
    assert('GET /api/projects/:id readable by member (200 OK)', getProjectRes.status === 200);

    // 13. POST /api/projects (Admin create project 201)
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
    assert('POST /api/projects success (201 Created)', createProjectRes.status === 201 && createdProjectData.data._id);
    const createdProjectId = createdProjectData.data?._id;

    // 14. RBAC: Member cannot delete project (403 Forbidden)
    const memberDeleteRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert('RBAC: Member cannot delete project (403 Forbidden)', memberDeleteRes.status === 403);

    // 15. DELETE /api/projects/:id (Admin delete success 200)
    const adminDeleteRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('DELETE /api/projects/:id allowed for Admin (200 OK)', adminDeleteRes.status === 200);

    // 16. DELETE /api/team-members/:id (Admin delete success 200)
    const adminDeleteMemberRes = await fetch(`${BASE_URL}/team-members/${createdMemberId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('DELETE /api/team-members/:id allowed for Admin (200 OK)', adminDeleteMemberRes.status === 200);

    console.log(`\n=========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`=========================================`);
  } catch (err) {
    console.error('Fatal test error:', err);
  }
};

runTests();
