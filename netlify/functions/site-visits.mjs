import { getStore } from '@netlify/blobs';

export default async (req) => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*'
  };

  try {
    const store = getStore('campaign-site-stats');
    const key = 'homepage-visits';
    const current = (await store.get(key, { type: 'json' })) || { count: 0 };
    const url = new URL(req.url);
    const shouldCount = url.searchParams.get('count') === '1';
    const next = { count: Number(current.count || 0) + (shouldCount ? 1 : 0), updatedAt: new Date().toISOString() };
    if (shouldCount) await store.setJSON(key, next);
    return new Response(JSON.stringify({ count: next.count }), { status: 200, headers });
  } catch (error) {
    console.error('site-visits counter error', error);
    return new Response(JSON.stringify({ count: null }), { status: 200, headers });
  }
};