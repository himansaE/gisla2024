type CacheObject = {
  modified: Date;
  data: any;
};

export class ClientCache {
  ttl: number = 60;

  private data = new Map<string, CacheObject>();
  constructor(ttl = 60) {
    this.ttl = ttl;
  }

  async fetch<T extends (...args: any[]) => any>(
    id: string,
    fn: T,
    args: Parameters<T>
  ): Promise<ReturnType<T>> {
    const cache = this.data.get(this.getName(id, fn)) as CacheObject;
    if (
      cache &&
      new Date().getTime() - cache.modified.getTime() <= this.ttl * 1000
    ) {
      console.log("Loading from catch", this.getName(id, fn));
      // not expired and in the cache
      return cache.data;
    }
    // run func and save cache
    const data = await Promise.resolve(fn(...args));
    this.data.set(this.getName(id, fn), {
      modified: new Date(),
      data,
    });
    return data;
  }

  getName(id: string, func: () => {}) {
    return `${func.name}-${id}`;
  }
}
