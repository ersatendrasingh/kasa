const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercise real pricing code with isolated database/auth/cache boundaries.
function load(relative, mocks) {
  const filename = path.resolve(__dirname, '..', relative);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`, mocks);
    return require(id);
  };
  new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
  return module.exports;
}

function fixture() {
  const paths = [];
  let saved;
  const prisma = {
    product: { findUnique: async () => ({ id: 'product' }) },
    productPrice: {
      findUnique: async () => ({ id: 'price' }),
      findFirst: async () => null,
      update: async (value) => { saved = value.data; },
      upsert: async (value) => { saved = value.update; },
      findMany: async () => [],
    },
  };
  const mocks = {
    '@/lib/admin/prisma': { prisma },
    '@/lib/admin/auth': { requireAdmin: async () => ({ id: 'admin' }) },
    'next/cache': { revalidatePath: (value) => paths.push(value) },
    'next/server': { connection: async () => {} },
  };
  return { prisma, mocks, paths, saved: () => saved, actions: load('actions/admin/products.ts', mocks) };
}

function form(overrides = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    productId: 'product', productPriceId: 'price', edition: 'STARTER',
    plan: 'LIFETIME', currency: 'INR', amount: '999', maxActivations: '1',
    certificateRule: 'lecture_completion', userLimit: '', courseLimit: '', facultyLimit: '',
    ...overrides,
  })) data.set(key, value);
  data.append('features', 'courses');
  data.append('allowedCourseModes', 'self_learning');
  return data;
}

test('save persists the price and refreshes admin, homepage, and pricing page', async () => {
  const f = fixture();
  assert.equal((await f.actions.updateProductPriceAction(form())).success, true);
  assert.equal(f.saved().amount, 999);
  assert.equal(f.saved().userLimit, null);
  for (const route of ['/', '/pricing', '/admin/licenses/products']) assert.ok(f.paths.includes(route));
});

test('create saves Plus pricing and refreshes the website', async () => {
  const f = fixture();
  assert.equal((await f.actions.createProductPriceAction(form({ edition: 'PLUS', amount: '1999' }))).success, true);
  assert.equal(f.saved().amount, 1999);
  assert.ok(f.paths.includes('/pricing'));
});

test('invalid values return visible feedback without writing', async () => {
  const f = fixture();
  const result = await f.actions.updateProductPriceAction(form({ maxActivations: '51' }));
  assert.equal(result.success, false);
  assert.match(result.message, /maxActivations/);
  assert.equal(f.saved(), undefined);
});

test('duplicate pricing returns feedback instead of silently succeeding', async () => {
  const f = fixture();
  f.prisma.productPrice.findFirst = async () => ({ id: 'duplicate' });
  const result = await f.actions.updateProductPriceAction(form());
  assert.equal(result.success, false);
  assert.match(result.message, /already has pricing/);
  assert.equal(f.saved(), undefined);
});

test('deleted pricing returns actionable feedback', async () => {
  const f = fixture();
  f.prisma.productPrice.findUnique = async () => null;
  const result = await f.actions.updateProductPriceAction(form());
  assert.equal(result.success, false);
  assert.match(result.message, /not found/);
});

test('no database rows gives the requested three default prices', async () => {
  const f = fixture();
  const plans = await load('lib/website-pricing.ts', f.mocks).getWebsitePricingPlans();
  assert.deepEqual(plans.map(p => p.price), ['₹999', '₹1,999', 'Custom pricing']);
});

test('website prefers INR lifetime rows and never exposes an Enterprise amount', async () => {
  const f = fixture();
  const row = (edition, amount, plan = 'LIFETIME', currency = 'INR') => ({
    edition, amount, plan, currency, product: {}, maxActivations: 1,
    userLimit: null, courseLimit: null, facultyLimit: null,
  });
  f.prisma.productPrice.findMany = async () => [
    row('STARTER', 999), row('STARTER', 49, 'LIFETIME', 'USD'),
    row('STARTER', 99, 'SIX_MONTHS'), row('PLUS', 1999), row('ENTERPRISE', 90000),
  ];
  const plans = await load('lib/website-pricing.ts', f.mocks).getWebsitePricingPlans();
  assert.deepEqual(plans.map(p => p.price), ['₹999 lifetime', '₹1,999 lifetime', 'Custom pricing']);
});

test('zero amount displays Custom pricing without a billing suffix', async () => {
  const f = fixture();
  f.prisma.productPrice.findMany = async () => [{
    edition: 'STARTER', amount: 0, plan: 'CUSTOM', currency: 'INR', product: {}, maxActivations: 1,
    userLimit: null, courseLimit: null, facultyLimit: null,
  }];
  const plans = await load('lib/website-pricing.ts', f.mocks).getWebsitePricingPlans();
  assert.equal(plans[0].price, 'Custom pricing');
});
