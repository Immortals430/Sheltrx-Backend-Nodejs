import redisClient from "@/lib/redis.js";


export default class AuthCacheRepository {
  // otp
  async getCacheLoginOtp(identifier: string) {
    return await redisClient.get(`auth:otp:${identifier}`);
  }

  async createCacheLoginOtp(userData: { identifier: string; otp: string }) {
    await redisClient.set(`auth:otp:${userData.identifier}`, userData.otp, {
      expiration: {
        type: "EX",
        value: 60 * 15,
      },
    });
  }

  async deleteCacheLoginOtp(identifier: string) {
    return await redisClient.del(`auth:otp:${identifier}`);
  }

  // auth user session
  async getCacheAuthUser(userId: string) {
    return await redisClient.get(`auth:user:${userId}`);
  }

  async createCacheAuthUser(userId: string, sessionId: string) {
    await redisClient.set(`auth:user:${userId}`, sessionId, {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 7,
      },
    });
  }

  async deleteCacheAuthUser(userId: string) {
    return await redisClient.del(`auth:user:${userId}`);
  }

  // session
  async deleteCacheCookie(sessionID: string) {
    return await redisClient.del(`sess:${sessionID}`);
  }
}
