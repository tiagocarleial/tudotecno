import { createClient } from '@libsql/client';

let client;
let isInitialized = false;

// Configurações otimizadas para SQLite local e Turso remoto
const DB_CONFIG = {
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,

  // Otimizações de performance
  intMode: 'number', // Números ao invés de BigInt (mais rápido)

  // Para Turso remoto: configurações de rede
  ...(process.env.TURSO_DATABASE_URL?.startsWith('libsql://') ||
      process.env.TURSO_DATABASE_URL?.startsWith('https://') ? {
    // Sync interval para cache local (apenas Turso remoto)
    syncInterval: 60, // 60 segundos
  } : {}),
};

// Timeout para queries
// Em produção: tempo suficiente para Turso responder
// Em build: evita travamento
const QUERY_TIMEOUT = process.env.NODE_ENV === 'production' ? 45000 : 15000;

// Inicializa otimizações de SQLite local
async function initializeSqliteOptimizations(db) {
  if (isInitialized) return;

  try {
    // Apenas para SQLite local (file:)
    if (process.env.TURSO_DATABASE_URL?.startsWith('file:')) {
      // WAL mode: permite leituras concorrentes enquanto escreve
      await db.execute('PRAGMA journal_mode = WAL;').catch(() => {});

      // Aumenta cache para 64MB (melhora performance de queries)
      await db.execute('PRAGMA cache_size = -64000;').catch(() => {});

      // Busy timeout: aguarda 5 segundos ao invés de falhar imediatamente
      await db.execute('PRAGMA busy_timeout = 5000;').catch(() => {});

      // Synchronous = NORMAL: mais rápido e ainda seguro com WAL
      await db.execute('PRAGMA synchronous = NORMAL;').catch(() => {});

      // Temp store em memória: queries temporárias mais rápidas
      await db.execute('PRAGMA temp_store = MEMORY;').catch(() => {});

      // Aumenta page size para 4KB (padrão moderno)
      await db.execute('PRAGMA page_size = 4096;').catch(() => {});

      console.log('[db] SQLite optimizations applied');
    } else {
      console.log('[db] Using Turso remote database');
    }

    isInitialized = true;
  } catch (error) {
    console.error('[db] Warning: Could not apply all optimizations:', error.message);
  }
}

// Wrapper de timeout para queries
async function withTimeout(promise, timeoutMs = QUERY_TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Retry logic com exponential backoff
async function executeWithRetry(fn, maxRetries = 3, baseDelay = 100) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await withTimeout(fn());
    } catch (error) {
      lastError = error;

      // Retry apenas em erros temporários
      const isRetryable =
        error.code === 'SQLITE_BUSY' ||
        error.code === 'SQLITE_LOCKED' ||
        error.message?.includes('database is locked') ||
        error.message?.includes('BUSY') ||
        error.message?.includes('timeout');

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff: 100ms, 200ms, 400ms, etc.
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));

      console.log(`[db] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
    }
  }

  throw lastError;
}

// Cliente otimizado com retry
class OptimizedDbClient {
  constructor(client) {
    this.client = client;
  }

  async execute(query) {
    return executeWithRetry(() => this.client.execute(query));
  }

  async batch(queries, mode) {
    return executeWithRetry(() => this.client.batch(queries, mode));
  }

  // Passa outros métodos diretamente
  async transaction(fn) {
    return this.client.transaction(fn);
  }

  close() {
    return this.client.close();
  }
}

export function getDb() {
  if (!client) {
    const rawClient = createClient(DB_CONFIG);
    client = new OptimizedDbClient(rawClient);

    // Inicializa otimizações em background
    initializeSqliteOptimizations(rawClient).catch(err => {
      console.error('[db] Failed to initialize optimizations:', err);
    });
  }
  return client;
}

export default getDb;
