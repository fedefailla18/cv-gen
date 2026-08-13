# Understanding the Changes `CacheConfig`
## What Changed (from the diff)
The diff shows that **Redis infrastructure was added to an existing Caffeine-based cache config**. Before the change, only managed **in-memory caching** with Caffeine. After the change, it also wires up a **Redis connection**. `CacheConfig`
Here's a breakdown of every addition:
### 1. New fields — connection configuration 
`@Value`
``` java
@Value("${application.environment}")
private String environment;

@Value("${REDIS_CACHE_HOST:host.docker.internal}")
private String redisHostUrl;

private static final Integer REDIS_PORT = 6379;
```

| Field        | Purpose                                                         |
| ------------ | --------------------------------------------------------------- |
| environment  | Determines whether SSL should be used                           |
| redisHostUrl | The Redis host — defaults to host.docker.internal for local dev |
| REDIS_PORT   | Standard Redis port, hardcoded since it never changes           |

💡 host.docker.internal is a Docker-specific hostname that resolves to the host machine — great for local development without needing a real Redis URL. 
2. jedisConnectionFactory() — environment-aware SSL``` java
@Bean
public JedisConnectionFactory jedisConnectionFactory() {
    JedisClientConfiguration clientConfiguration;
    if (environment.equals("default") || environment.equals("local")) {
        clientConfiguration = JedisClientConfiguration.builder().build();
    } else {
        clientConfiguration = JedisClientConfiguration.builder().useSsl().build();
    }
    return new JedisConnectionFactory(
        new RedisStandaloneConfiguration(redisHostUrl, REDIS_PORT),
        clientConfiguration
    );
}
```

Why this matters:

Local/default environments (dev, Docker) → plain connection, no SSL overhead
All other environments (staging, production) → SSL enforced for security
This is a common pattern: you don't want SSL complexity locally, but you absolutely need it in cloud-hosted Redis (e.g., AWS ElastiCache or Azure Cache for Redis).
 
3. redisTemplate() — the main entry point for Redis operations``` java
@Bean
public RedisTemplate<String, Object> redisTemplate(JedisConnectionFactory connectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    return template;
}
```

Two serializer choices were made deliberately:
Serializer
Applied to
Why
StringRedisSerializer
Keys
Keys are human-readable strings (e.g., test-env:user.oid-123:latest) — easy to inspect in Redis CLI
GenericJackson2JsonRedisSerializer
Values
Serializes Java objects to JSON, and crucially embeds the type name so deserialization knows what class to reconstruct
⚠️ GenericJackson2JsonRedisSerializer stores the @class field in JSON. This is what allows UserSessionCache to be deserialized back from Redis correctly instead of returning a raw LinkedHashMap. 
Why It Was Added to CacheConfig (and not a new file)
The class already owned all cache-related infrastructure (Caffeine, CacheManager, CacheKeyGenerator). Adding Redis here keeps all caching concerns in one place — both in-memory (Caffeine) and distributed (Redis). The RedisTemplate bean is then injected into UserCacheServiceImpl to power session storage.
 
Interview Q&A: Redis & Redis Config
 
Q: What is Redis and why use it over in-memory caching?
Answer: Redis is an in-memory data store that runs as a separate process (or cluster). Unlike Caffeine (which is JVM-local), Redis is:
Shared across multiple service instances — essential in horizontally-scaled deployments
Persistent across restarts (optional)
Supports TTL natively on individual keys
Use Caffeine when the cache is local and disposable. Use Redis when multiple instances need to share state — like user sessions. 
Q: What is RedisTemplate and what does it do?
Answer: RedisTemplate is Spring Data Redis's main abstraction for interacting with Redis. It handles connection management and serialization. You interact with it through operation views:``` java
redisTemplate.opsForValue().set(key, value, ttl, TimeUnit.MINUTES); // strings/objects
redisTemplate.opsForHash()   // hash maps
redisTemplate.opsForList()   // lists
redisTemplate.hasKey(key)    // key existence check
redisTemplate.delete(key)    // key deletion
```

 
Q: What's the difference between StringRedisSerializer and GenericJackson2JsonRedisSerializer?
Answer:
StringRedisSerializer — encodes/decodes as plain UTF-8 strings. Used for keys so they stay human-readable.
GenericJackson2JsonRedisSerializer — serializes objects to JSON with type metadata. This is needed for values so Spring knows how to deserialize back to the correct Java class.``` json
// What GenericJackson2JsonRedisSerializer stores:
{
  "@class": "com.servus.security.domain.UserSessionCache",
  "userId": 1,
  "email": "u@test.com"
}
```

 
Q: What is JedisConnectionFactory and why configure SSL conditionally?
Answer: JedisConnectionFactory is the Spring Data Redis connection factory backed by the Jedis client library. The SSL conditional exists because:
Local environments don't have TLS-terminated Redis — plain TCP is fine
Cloud/production Redis (e.g., ElastiCache, Azure Cache) requires SSL and will reject plain connections
This is configured by reading application.environment at startup — a clean way to avoid environment-specific config files for connection behavior.
 
Q: What is a TTL in the context of Redis? Why is it important for session caching?
Answer: TTL (Time To Live) is a Redis feature where a key automatically expires after a set duration. For session caching:
Prevents stale sessions from lingering after a user logs out or a JWT expires
Acts as automatic cleanup without needing a scheduled job
In this codebase, session keys expire after isp.session.cache.ttl-minutes (default 30 minutes)
 
Q: What is a "tombstone" pattern in Redis?
Answer: A tombstone is a marker key written to signal that something has been logically deleted or disabled — without immediately removing all related data. In this codebase:``` 
{env}:user.{oid}:disabled  →  "true"  (TTL: 24h)
```

When a user is deactivated, this key is written. On the next request, the filter checks for it and rejects the token — even if a valid session cache still exists. It's a fast, cheap way to enforce account disablement across instances without invalidating every session key manually.