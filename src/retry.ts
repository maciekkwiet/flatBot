export type RetryOptions = {
  maxAttempts?: number;
  shouldRetry?: boolean | ((error?: Error, attempt?: number) => boolean);
  sleepMs?: number | ((attempt: number, error?: Error) => number);
};

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  callback: (attempt: number) => Promise<T>,
  { maxAttempts = 5, shouldRetry = true, sleepMs }: RetryOptions = {},
): ReturnType<typeof callback> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await callback(attempt);
    } catch (error) {
      const e = error as any;
      if (attempt >= maxAttempts) {
        throw e;
      }

      if (typeof shouldRetry === 'function' ? shouldRetry(e, attempt) : shouldRetry) {
        const resolvedSleepMs = typeof sleepMs === 'function' ? sleepMs(attempt, e) : sleepMs;
        if (resolvedSleepMs) {
          await sleep(resolvedSleepMs);
        }
        continue;
      }

      throw e;
    }
  }
};

