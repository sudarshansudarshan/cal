import { AxiosInstance } from "axios";

export class AuthManager {
  private token: string | null = null;
  private engine: AxiosInstance;

  constructor(engine: AxiosInstance) {
    this.engine = engine;

    if (this.token)
      this.useToken(this.token);

  }

  private useToken(authToken: string) {
    this.engine.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${authToken}`;
      return config;
    });
  }

  login(username: string, password: string): void {
    // Simulate authentication logic
    this.token = `${username}_authtoken`;
    console.log("Logged in successfully!");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
