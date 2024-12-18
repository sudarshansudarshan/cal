import { AxiosInstance } from "axios";

export class AuthManager {
    private token: string | null = null;
    private engine: AxiosInstance;
  
    constructor(engine: AxiosInstance) {
      this.engine = engine;
      
      // gattempt to get token from secure storage
      this.token = null;
    }

    login(username: string, password: string): void {
      // Simulate authentication logic
      this.token = `${username}_authtoken`;
      console.log("Logged in successfully!");
    }

    usingToken(token: string): void {
      this.token = token;
      console.log("Authenticated using token!");
    }
  
    isAuthenticated(): boolean {
      return !!this.token;
    }
  
    getToken(): string {
      if (!this.token) throw new Error("Auth not initialized");
      return this.token;
    }
}
