// Comprehensive API Test Suite
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting TMS API Verification Suite...\n');
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

    // 2. GET /api/team-members
    const membersRes = await fetch(`${BASE_URL}/team-members`);
    const membersData = await membersRes.json();
    assert('GET /api/team-members returns list', membersRes.status === 200 && membersData.data.length > 0);
    const existingMember = membersData.data[0];

    // 3. POST /api/team-members (Success)
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMemberPayload),
    });
    const createdMemberData = await createMemberRes.json();
    assert('POST /api/team-members success (201 Created)', createMemberRes.status === 201 && createdMemberData.data._id);
    const createdMemberId = createdMemberData.data?._id;

    // 4. POST /api/team-members (Duplicate Email Conflict 409)
    const dupMemberRes = await fetch(`${BASE_URL}/team-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMemberPayload),
    });
    assert('POST /api/team-members duplicate email (409 Conflict)', dupMemberRes.status === 409);

    // 5. PATCH /api/team-members/:id (Update)
    const patchMemberRes = await fetch(`${BASE_URL}/team-members/${createdMemberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'Lead DevOps Engineer' }),
    });
    const patchedMemberData = await patchMemberRes.json();
    assert('PATCH /api/team-members/:id success (200 OK)', patchMemberRes.status === 200 && patchedMemberData.data.role === 'Lead DevOps Engineer');

    // 6. GET /api/projects (List projects)
    const projectsRes = await fetch(`${BASE_URL}/projects`);
    const projectsData = await projectsRes.json();
    assert('GET /api/projects returns seeded projects', projectsRes.status === 200 && projectsData.data.length > 0);
    const existingProject = projectsData.data[0];

    // 7. GET /api/projects/stats
    const statsRes = await fetch(`${BASE_URL}/projects/stats`);
    const statsData = await statsRes.json();
    assert('GET /api/projects/stats returns analytics', statsRes.status === 200 && statsData.data.totalProjects >= 5);

    // 8. GET /api/projects/:id (Success)
    const getProjectRes = await fetch(`${BASE_URL}/projects/${existingProject._id}`);
    const getProjectData = await getProjectRes.json();
    assert('GET /api/projects/:id valid project (200 OK)', getProjectRes.status === 200 && getProjectData.data.title === existingProject.title);

    // 9. GET /api/projects/:id (Missing project 404)
    const fakeId = '507f1f77bcf86cd799439011';
    const missingProjectRes = await fetch(`${BASE_URL}/projects/${fakeId}`);
    assert('GET /api/projects/:id missing project (404 Not Found)', missingProjectRes.status === 404);

    // 10. GET /api/projects/:id (Invalid ObjectId format 400)
    const invalidIdRes = await fetch(`${BASE_URL}/projects/invalid-id-1234`);
    assert('GET /api/projects/:id invalid ObjectId (400 Bad Request)', invalidIdRes.status === 400);

    // 11. POST /api/projects (Success)
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProjectPayload),
    });
    const createdProjectData = await createProjectRes.json();
    assert('POST /api/projects success (201 Created)', createProjectRes.status === 201 && createdProjectData.data._id);
    const createdProjectId = createdProjectData.data?._id;

    // 12. POST /api/projects (Invalid Input Validation Error 400)
    const invalidProjectRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'A' }), // Title too short, missing description and dueDate
    });
    const invalidProjectData = await invalidProjectRes.json();
    assert('POST /api/projects invalid input (400 Validation Error)', invalidProjectRes.status === 400 && invalidProjectData.errors?.length > 0);

    // 13. PATCH /api/projects/:id (Update)
    const patchProjectRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: 85, status: 'Completed' }),
    });
    const patchedProjectData = await patchProjectRes.json();
    assert('PATCH /api/projects/:id update success (200 OK)', patchProjectRes.status === 200 && patchedProjectData.data.progress === 85 && patchedProjectData.data.status === 'Completed');

    // 14. DELETE /api/projects/:id (Success)
    const deleteProjectRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'DELETE',
    });
    assert('DELETE /api/projects/:id success (200 OK)', deleteProjectRes.status === 200);

    // 15. DELETE /api/projects/:id (Missing project 404)
    const deleteMissingProjectRes = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
      method: 'DELETE',
    });
    assert('DELETE /api/projects/:id already deleted (404 Not Found)', deleteMissingProjectRes.status === 404);

    // 16. DELETE /api/team-members/:id (Success)
    const deleteMemberRes = await fetch(`${BASE_URL}/team-members/${createdMemberId}`, {
      method: 'DELETE',
    });
    assert('DELETE /api/team-members/:id success (200 OK)', deleteMemberRes.status === 200);

    console.log(`\n=========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`=========================================`);
  } catch (err) {
    console.error('Fatal test error:', err);
  }
};

runTests();
