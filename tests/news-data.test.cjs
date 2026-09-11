const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const source = fs.readFileSync('src/lib/data.ts', 'utf8')
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText

function loadNewsModule(env = { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-public-key' }) {
  const state = { rows: [], status: 200, requests: [] }
  const exports = {}
  vm.runInNewContext(code, {
    exports,
    process: { env },
    require: (name) => name === '@supabase/supabase-js' ? require(name) : {},
    fetch: async (input, init) => {
      state.requests.push({ url: new URL(input), init })
      return new Response(JSON.stringify(state.rows), { status: state.status, headers: { 'Content-Type': 'application/json' } })
    },
  })
  return { api: exports, state }
}

test('reads edits and deletions from the news table, with no stale example fallback', async () => {
  const { api, state } = loadNewsModule()
  state.rows = [{ id: '1', title: 'Oprindelig titel', content: 'Tekst' }]
  assert.equal((await api.getLatestNews())[0].title, 'Oprindelig titel')
  state.rows = [{ id: '1', title: 'Rettet titel', content: 'Ny tekst' }]
  assert.equal((await api.getLatestNews())[0].title, 'Rettet titel')
  state.rows = []
  assert.equal((await api.getLatestNews()).length, 0)
  assert.equal(state.requests[0].url.pathname, '/rest/v1/news')
  assert.equal(state.requests[0].url.searchParams.get('order'), 'published_at.desc')
  assert.equal(state.requests[0].url.searchParams.get('limit'), '3')
  for (const request of state.requests) assert.equal(request.init.cache, 'no-store')
})

test('supports the news-page limit and unlimited reader', async () => {
  const { api, state } = loadNewsModule()
  await api.getLatestNews(20)
  await api.getNews()
  assert.equal(state.requests[0].url.searchParams.get('limit'), '20')
  assert.equal(state.requests[1].url.searchParams.has('limit'), false)
})

test('does not resurrect sample articles when configuration is missing', async () => {
  const { api, state } = loadNewsModule({})
  assert.equal((await api.getNews()).length, 0)
  assert.equal(state.requests.length, 0)
})

test('reports database errors instead of displaying made-up news', async () => {
  const { api, state } = loadNewsModule()
  state.status = 403
  state.rows = { message: 'Access denied', code: '42501' }
  await assert.rejects(api.getLatestNews(), /Kunne ikke hente nyheder/)
})
