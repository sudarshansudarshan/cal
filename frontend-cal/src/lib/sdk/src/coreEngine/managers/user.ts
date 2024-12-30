import { AxiosInstance } from "axios";

export class UserManager {
    private engine: AxiosInstance;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
    }

    async getDetails(userId: number): Promise<void> {
        console.log(`User details: ${userId}`);
    }

    async create() {
        console.log("User created");
    }

    async update(userId: number, userName: string) {
        console.log(`Updated user: ${userId} with name: ${userName}`);
    }

    async delete() {
        console.log("User deleted");
    }
}