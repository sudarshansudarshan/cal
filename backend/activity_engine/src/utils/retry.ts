export async function retry(fn: () => Promise<any>, retries: number, delay: number): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
    }
  }
}
