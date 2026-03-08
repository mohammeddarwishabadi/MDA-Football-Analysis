const DEFAULT_TTL_MS = 60 * 1000;

let redisClient = null;
let redisEnabled = false;

// Optional Redis support. Falls back to in-memory cache automatically.
try {
  if (process.env.REDIS_URL) {
    // eslint-disable-next-line global-require
    const { createClient } = require('redis');
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', (err) => console.error('Redis error:', err.message));
    redisClient.connect().then(() => {
      redisEnabled = true;
      console.log('Redis cache enabled');
    }).catch((err) => {
      console.error('Redis connection failed, using in-memory cache:', err.message);
      redisEnabled = false;
    });
  }
} catch (err) {
  console.warn('Redis package unavailable, using in-memory cache');
}

const memoryStore = new Map();

const setMemory = (key, value, ttlMs) => {
  memoryStore.set(key, {
    value,
    expiresAt: Date.now() + ttlMs
  });
};

const getMemory = (key) => {
  const record = memoryStore.get(key);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    memoryStore.delete(key);
    return null;
  }
  return record.value;
};

const delMemoryByPrefix = (prefix) => {
  for (const key of memoryStore.keys()) {
    if (key.startsWith(prefix)) memoryStore.delete(key);
  }
};

exports.withCache = (prefix, ttlMs = DEFAULT_TTL_MS) => async (req, res, next) => {
  const key = `${prefix}:${req.originalUrl}`;

  try {
    if (redisEnabled && redisClient) {
      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } else {
      const cached = getMemory(key);
      if (cached) {
        return res.json(cached);
      }
    }

    const originalJson = res.json.bind(res);
    res.json = async (payload) => {
      if (redisEnabled && redisClient) {
        await redisClient.setEx(key, Math.floor(ttlMs / 1000), JSON.stringify(payload));
      } else {
        setMemory(key, payload, ttlMs);
      }
      return originalJson(payload);
    };

    return next();
  } catch (err) {
    return next(err);
  }
};

exports.clearCacheByPrefix = async (prefix) => {
  if (redisEnabled && redisClient) {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redisClient.scan(cursor, { MATCH: `${prefix}:*`, COUNT: 100 });
      cursor = nextCursor;
      if (keys.length) await redisClient.del(keys);
    } while (cursor !== '0');
    return;
  }

  delMemoryByPrefix(prefix);
};
