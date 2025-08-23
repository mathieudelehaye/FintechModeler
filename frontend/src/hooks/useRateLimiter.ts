import { useState, useEffect } from 'react';
import { rateLimiter } from '../services/rateLimiter';

export function useRateLimiter() {
  const [canMakeRequest, setCanMakeRequest] = useState(rateLimiter.canMakeRequest());
  const [timeUntilNext, setTimeUntilNext] = useState(rateLimiter.getTimeUntilNextRequest());

  useEffect(() => {
    const updateState = () => {
      setCanMakeRequest(rateLimiter.canMakeRequest());
      setTimeUntilNext(rateLimiter.getTimeUntilNextRequest());
    };

    const removeListener = rateLimiter.addListener(updateState);

    // Update every second to show countdown
    const interval = setInterval(updateState, 1000);

    return () => {
      removeListener();
      clearInterval(interval);
    };
  }, []);

  const makeRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
    if (!rateLimiter.canMakeRequest()) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(timeUntilNext / 1000)} seconds.`);
    }

    rateLimiter.recordRequest();
    return requestFn();
  };

  return {
    canMakeRequest,
    timeUntilNext,
    makeRequest,
    secondsUntilNext: Math.ceil(timeUntilNext / 1000)
  };
}