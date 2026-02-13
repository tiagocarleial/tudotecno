export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initSchema } = await import('./lib/schema.js');
    await initSchema();

    const { seedCategories } = await import('./lib/seed.js');
    await seedCategories();
  }
}
