/*
 Automated admin panel test runner
 - Authenticates via NextAuth credentials
 - Calls protected admin APIs to validate functionality
 - Performs CRUD test for itineraries
 Requirements:
 - Next.js dev server running at NEXTAUTH_URL (.env)
 - Database configured and prisma pushed
*/

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'dark1devil2025@outlook.com';
const ADMIN_PASSWORD = '1082034D1d@#';

async function fetchCsrfToken() {
  const res = await fetch(`${BASE_URL}/api/auth/csrf`, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) throw new Error(`Failed to get CSRF token (${res.status})`);
  const data = await res.json();
  if (!data.csrfToken) throw new Error('No CSRF token in response');
  return data.csrfToken;
}

async function loginAndGetCookie() {
  const csrfToken = await fetchCsrfToken();
  const url = `${BASE_URL}/api/auth/callback/credentials?json=true`;
  const body = new URLSearchParams();
  body.append('csrfToken', csrfToken);
  body.append('email', ADMIN_EMAIL);
  body.append('password', ADMIN_PASSWORD);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString(),
    redirect: 'manual'
  });

  const setCookie = res.headers.raw()['set-cookie'] || [];
  if (!setCookie.length) {
    let errDetail = '';
    try { errDetail = JSON.stringify(await res.json()); } catch {}
    throw new Error(`Login failed: no session cookie. Status: ${res.status} ${errDetail}`);
  }

  const cookie = setCookie.map(c => c.split(';')[0]).join('; ');
  return cookie;
}

async function callProtected(path, cookie, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Cookie': cookie,
      'Cache-Control': 'no-cache',
      ...(options.headers || {})
    }
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, ok: res.ok, json };
}

async function testDashboard(cookie) {
  const r = await callProtected('/api/dashboard/metrics', cookie);
  return r.ok && r.json && r.json.overview ? 'PASS' : `FAIL (${r.status})`;
}

async function testQuickStats(cookie) {
  const r = await callProtected('/api/admin/quick-stats', cookie);
  return r.ok && r.json && typeof r.json.totalUsers === 'number' ? 'PASS' : `FAIL (${r.status})`;
}

async function testDebug(cookie) {
  const r = await callProtected('/api/admin/debug', cookie);
  return r.ok && r.json && r.json.database ? 'PASS' : `FAIL (${r.status})`;
}

async function testCheckEnv(cookie) {
  const r = await callProtected('/api/admin/check-env', cookie);
  return r.ok && r.json && r.json.summary ? 'PASS' : `FAIL (${r.status})`;
}

async function testItinerariesCRUD(cookie) {
  // Create
  const createPayload = {
    name: `Test Itinerary ${Date.now()}`,
    description: 'Automated test description',
    shortDescription: 'Short desc',
    durationDays: 5,
    highlights: ['Nile cruise', 'Temples'],
    isActive: true,
    featured: false,
    days: [
      { dayNumber: 1, title: 'Day 1', description: 'Desc 1', activities: ['Boarding'], meals: ['LUNCH'] },
      { dayNumber: 2, title: 'Day 2', description: 'Desc 2', activities: ['Sailing'], meals: ['DINNER'] }
    ],
    pricingTiers: [
      { category: 'Standard', paxRange: '2-4', price: '1000' }
    ]
  };

  const createRes = await callProtected('/api/admin/itineraries', cookie, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload)
  });

  if (!createRes.ok || !createRes.json?.id) return `FAIL (create ${createRes.status})`;
  const id = createRes.json.id;

  // GET list
  const listRes = await callProtected('/api/admin/itineraries', cookie);
  if (!listRes.ok || !Array.isArray(listRes.json)) return `FAIL (list ${listRes.status})`;

  // PATCH toggle active
  const patchRes = await callProtected(`/api/admin/itineraries/${id}`, cookie, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive: false })
  });
  if (!patchRes.ok) return `FAIL (patch ${patchRes.status})`;

  // PUT update
  const putPayload = { ...createPayload, name: `${createPayload.name} Updated`, durationDays: 6 };
  const putRes = await callProtected(`/api/admin/itineraries/${id}`, cookie, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(putPayload)
  });
  if (!putRes.ok) return `FAIL (put ${putRes.status})`;

  // DELETE
  const delRes = await callProtected(`/api/admin/itineraries/${id}`, cookie, { method: 'DELETE' });
  if (!delRes.ok) return `FAIL (delete ${delRes.status})`;

  return 'PASS';
}

async function main() {
  console.log('🧪 Running Admin Panel Tests');

  // Quick DB sanity check
  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    console.log('DB: Admin user', user ? 'exists' : 'missing');
  } catch (e) {
    console.log('DB: Error', e.message);
  }

  console.log('1) Authenticating as admin...');
  let cookie;
  try {
    cookie = await loginAndGetCookie();
    console.log('   ✅ Authenticated');
  } catch (e) {
    console.error('   ❌ Authentication failed:', e.message);
    process.exit(1);
  }

  const results = {};
  results['Dashboard metrics'] = await testDashboard(cookie);
  results['Quick stats'] = await testQuickStats(cookie);
  results['Debug endpoint'] = await testDebug(cookie);
  results['Check env'] = await testCheckEnv(cookie);
  results['Itineraries CRUD'] = await testItinerariesCRUD(cookie);

  console.log('\n📋 Results:');
  for (const [name, result] of Object.entries(results)) {
    console.log(` - ${name}: ${result}`);
  }

  const failed = Object.values(results).some(r => r !== 'PASS');
  console.log(`\n${failed ? '❌ Some tests failed' : '🎉 All admin tests passed'}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Test runner error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
