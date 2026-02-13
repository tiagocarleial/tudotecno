export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initSchema } = await import('./lib/schema.js');
    initSchema();

    const { seedCategories } = await import('./lib/seed.js');
    seedCategories();

    const { startScheduler } = await import('./cron/scheduler.js');
    startScheduler();
  }
}
