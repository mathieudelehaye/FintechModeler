class RateLimiter {
  private lastRequestTime: number = 0;
  private listeners: Set<() => void> = new Set();

  canMakeRequest(): boolean {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    return timeSinceLastRequest >= 60000; // 1 minute
  }

  recordRequest(): void {
    this.lastRequestTime = Date.now();
    this.notifyListeners();
    
    // Auto-enable after 1 minute
    setTimeout(() => {
      this.notifyListeners();
    }, 60000);
  }

  getTimeUntilNextRequest(): number {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    return Math.max(0, 60000 - timeSinceLastRequest);
  }

  addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }
}

export const rateLimiter = new RateLimiter();