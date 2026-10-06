/**
 * tests/health.test.ts
 * Temel API saglik kontrol testi.
 *
 * Calistirmak icin:
 *   1. bun add -d vitest (veya npm i -D vitest)
 *   2. package.json scripts: "test": "vitest run"
 *   3. bun run dev & bun test
 */

// Not: Bu dosya Vitest ile calisacak sekilde tasarlanmistir.
// Vitest kurulumu icin: bun add -d vitest @vitest/ui

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function fetchJSON(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  return { status: res.status, body: await res.json() };
}

describe('API Health Checks', () => {
  test('GET /api/health — 200 ok donmeli', async () => {
    const { status, body } = await fetchJSON('/api/health');
    expect(status).toBe(200);
    expect(body.status).toBe('ok');
    expect(typeof body.timestamp).toBe('string');
  });

  test('GET /api/queue/stats — kuyrug istatistikleri donmeli', async () => {
    const { status, body } = await fetchJSON('/api/queue/stats');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('queueStats');
    expect(body).toHaveProperty('cacheStats');
  });

  test('GET /api/morning-briefing/status — cron durumu donmeli', async () => {
    const { status, body } = await fetchJSON('/api/morning-briefing/status');
    expect(status).toBe(200);
    expect(body).toHaveProperty('cronSchedule');
  });

  test('GET /api/tasks/history — gorev gecmisi donmeli', async () => {
    const { status, body } = await fetchJSON('/api/tasks/history');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('dataset');
  });

  test('GET /api/tasks/snapshot — snapshot donmeli', async () => {
    const { status, body } = await fetchJSON('/api/tasks/snapshot');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body).toHaveProperty('stats');
  });

  test('GET /bulunamayan-endpoint — 404 donmeli', async () => {
    const { status } = await fetchJSON('/api/bu-endpoint-yok');
    expect(status).toBe(404);
  });
});

describe('Queue API Tests', () => {
  test('POST /api/queue/webhook — 202 QUEUED donmeli', async () => {
    const res = await fetch(`${BASE_URL}/api/queue/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'test', subject: 'Test Gorevi' })
    });
    const body = await res.json();
    expect(res.status).toBe(202);
    expect(body.status).toBe('QUEUED');
    expect(typeof body.jobId).toBe('string');
  });

  test('GET /api/queue/jobs/:id — gecersiz id 404 donmeli', async () => {
    const { status } = await fetchJSON('/api/queue/jobs/GECERSIZ_ID_12345');
    expect(status).toBe(404);
  });
});