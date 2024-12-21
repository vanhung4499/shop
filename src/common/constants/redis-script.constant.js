const RedisScriptConstant = {
  // This script is used to check the lock and release it atomically
  LOCK_ACQUIRE_SCRIPT: `
    if redis.call('get', KEYS[1]) == ARGV[1] then 
      return redis.call('del', KEYS[1]) 
    else 
      return 0 
    end
  `,
};

module.exports = RedisScriptConstant;
