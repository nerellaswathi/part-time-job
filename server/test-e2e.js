const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function testScenario() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING FULL END-TO-END VERIFICATION TEST SUITE');
  console.log('======================================================\n');

  // Step 1: Health check
  console.log('Step 1: Checking backend API health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  assert.strictEqual(health.status, 'healthy');
  console.log('✓ Backend API healthy and operational.\n');

  // Step 2: Browse public jobs
  console.log('Step 2: Browsing job catalog...');
  const jobsRes = await fetch(`${BASE_URL}/jobs`);
  const jobsData = await jobsRes.json();
  assert.strictEqual(jobsData.success, true);
  assert.ok(jobsData.jobs.length >= 10, 'Should have at least 10 realistic jobs');
  console.log(`✓ Retrieved ${jobsData.jobs.length} seeded jobs with skills and stipends.\n`);

  // Step 3: Register as Student
  console.log('Step 3: Registering Student: Sai Kiran (saikiran@test.edu)...');
  const testEmail = `student_${Date.now()}@university.edu`;
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sai Kiran',
      email: testEmail,
      password: 'password123',
      confirmPassword: 'password123',
      phone: '+91 98765 43210'
    })
  });
  const regData = await regRes.json();
  assert.strictEqual(regData.success, true);
  const token = regData.token;
  assert.ok(token, 'JWT token should be returned upon registration');
  console.log('✓ Student registered and JWT issued.\n');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Step 4: Complete Profile Setup
  console.log('Step 4: Setting up student profile (Python, SQL, JavaScript, Weekends, Remote)...');
  const profileRes = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      location: 'Visakhapatnam',
      education: {
        degree: 'B.Tech',
        branch: 'Computer Science',
        college: 'Andhra University',
        graduationYear: 2026
      },
      skills: ['Python', 'SQL', 'JavaScript', 'Git'],
      availability: ['Weekends', 'Flexible'],
      preferredJobTypes: ['Part-time', 'Internship', 'Remote'],
      preferredCategories: ['Technology']
    })
  });
  const profileData = await profileRes.json();
  assert.strictEqual(profileData.success, true);
  assert.ok(profileData.user.profileCompletion >= 80, 'Profile completion should reach >= 80%');
  console.log(`✓ Profile completed! Score: ${profileData.user.profileCompletion}% (${profileData.user.skills.join(', ')}).\n`);

  // Step 5: AI Recommendations
  console.log('Step 5: Querying AI Recommended Jobs...');
  const recRes = await fetch(`${BASE_URL}/ai/recommendations`, {
    headers: authHeaders
  });
  const recData = await recRes.json();
  assert.strictEqual(recData.success, true);
  assert.ok(recData.recommendations.length > 0, 'Should return AI recommendations');
  console.log(`✓ Top AI Recommendation: "${recData.recommendations[0].title}" with ${recData.recommendations[0].aiMatchScore}% match!`);
  console.log(`  Rationale: "${recData.recommendations[0].aiReasons[0]}"\n`);

  // Step 6: Detailed Match Breakdown on Python Intern
  const pythonJob = jobsData.jobs.find(j => j.title.includes('Python')) || jobsData.jobs[0];
  console.log(`Step 6: Evaluating AI Match & Skill Gap for "${pythonJob.title}"...`);
  const matchRes = await fetch(`${BASE_URL}/ai/match`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ jobId: pythonJob._id })
  });
  const matchData = await matchRes.json();
  assert.strictEqual(matchData.success, true);
  assert.ok(matchData.match.score >= 85, 'Should have high match score');
  console.log(`✓ AI Match Score: ${matchData.match.score}%`);
  console.log(`  Matched Skills (✓): ${matchData.match.matchedSkills.join(', ')}`);
  console.log(`  Missing Skills (○): ${matchData.match.missingSkills.join(', ')}\n`);

  // Step 7: Generate AI Application Cover Message
  console.log('Step 7: Generating personalized application cover letter using AI...');
  const msgRes = await fetch(`${BASE_URL}/ai/application-message`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ jobId: pythonJob._id })
  });
  const msgData = await msgRes.json();
  assert.strictEqual(msgData.success, true);
  assert.ok(msgData.message.includes('Sai Kiran') || msgData.message.includes(pythonJob.company), 'Letter should be personalized');
  console.log('✓ AI Cover Letter generated successfully:\n---');
  console.log(msgData.message.substring(0, 160) + '...\n---\n');

  // Step 8: Submit Application
  console.log(`Step 8: Submitting application for "${pythonJob.title}"...`);
  const applyRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      jobId: pythonJob._id,
      coverMessage: msgData.message
    })
  });
  const applyData = await applyRes.json();
  assert.strictEqual(applyData.success, true);
  assert.strictEqual(applyData.application.status, 'Applied');
  const appId = applyData.application._id;
  console.log(`✓ Application submitted! Status: "${applyData.application.status}"\n`);

  // Step 9: Verify Duplicate Application Prevention
  console.log('Step 9: Testing duplicate application prevention...');
  const dupRes = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      jobId: pythonJob._id,
      coverMessage: 'Attempting duplicate'
    })
  });
  const dupData = await dupRes.json();
  assert.strictEqual(dupRes.status, 400, 'Duplicate application must return status 400');
  console.log('✓ Duplicate prevented: "Already applied" error returned.\n');

  // Step 10: Track My Applications & Status Timeline
  console.log('Step 10: Fetching My Applications & timeline...');
  const myAppsRes = await fetch(`${BASE_URL}/applications`, {
    headers: authHeaders
  });
  const myAppsData = await myAppsRes.json();
  assert.strictEqual(myAppsData.success, true);
  assert.strictEqual(myAppsData.applications.length, 1);
  const myApp = myAppsData.applications[0];
  assert.strictEqual(myApp.job.title, pythonJob.title);
  console.log(`✓ Application confirmed in history. Current stage: "${myApp.status}".`);
  console.log(`  Timeline events: ${myApp.statusTimeline.length}\n`);

  // Step 11: Advance Status Timeline (Simulation)
  console.log('Step 11: Advancing status timeline to "Shortlisted"...');
  const advanceRes = await fetch(`${BASE_URL}/applications/${appId}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ status: 'Shortlisted' })
  });
  const advanceData = await advanceRes.json();
  assert.strictEqual(advanceData.success, true);
  assert.strictEqual(advanceData.application.status, 'Shortlisted');
  console.log('✓ Status advanced to "Shortlisted". Timeline updated.\n');

  // Step 12: Verify Notifications System
  console.log('Step 12: Checking notification inbox...');
  const notifRes = await fetch(`${BASE_URL}/notifications`, {
    headers: authHeaders
  });
  const notifData = await notifRes.json();
  assert.strictEqual(notifData.success, true);
  assert.ok(notifData.notifications.length >= 2, 'Should receive submission and status update notifications');
  console.log(`✓ Received ${notifData.notifications.length} notifications (${notifData.unreadCount} unread).`);
  console.log(`  Latest Notification: "${notifData.notifications[0].title}: ${notifData.notifications[0].message}"\n`);

  console.log('======================================================');
  console.log('🎉 ALL 12 END-TO-END SPECIFICATION TESTS PASSED (100%)');
  console.log('======================================================\n');
}

testScenario().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
