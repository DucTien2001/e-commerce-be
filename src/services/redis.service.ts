"use strict";

import * as redis from 'redis';
import { promisify } from "util";
import { reserveInventory } from "../repositories/inventory.repo";

const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

export const acquireLock = async (
  productId: string,
  quantity: number,
  cardId: string
) => {
  const key = `lock_v2024_${productId}`;

  const retryTimes = 10;
  const expireTime = 3000; // tam lock 3 seconds

  for (let i = 0; i < retryTimes; i++) {
    // Tạo 1 key, ai nằm giữ key này thì sẽ được vào thanh toán
    const result = await setnxAsync(key, expireTime);
    if (result === 1) {
      // Thao tac voi inventory
      const isReservation = await reserveInventory({productId, cardId, quantity})

      if(isReservation.modifiedCount) {
        await pexpire(key, expireTime)
        return key
      }

      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

export const releaseLock = async (keyLock: string) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};
