import { AxiosInstance } from "axios";
import { EnrolledCourse } from "../types/coreEngine";
import { CORE_API_CONFIG } from "../../config";
import { createURL } from "../../utils/createURL";

export class ModuleManager {
    private engine: AxiosInstance;
    private endpoint = CORE_API_CONFIG.ENDPOINTS.MODULES;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
    }

    async *streamSummaries(limit: number): AsyncGenerator<EnrolledCourse[], void, void> {
        let hasMore = true;
        let currentOffset = 0;

        while (hasMore) {
            const queryParams = { limit, offset: currentOffset };
            const endpoint = createURL(this.endpoint, null, queryParams);
            const response = await this.engine.get<EnrolledCourse[]>(endpoint);
            hasMore = response.data.length === limit; // Check if more data is available
            currentOffset += limit; // Update offset
            yield response.data; // Yield the data chunk
        }
    }

    async getDetails(courseId: number): Promise<EnrolledCourse> {
        const endpoint = createURL(this.endpoint, courseId);
        const response = await this.engine.get<EnrolledCourse>(endpoint);
        return response.data
    }

    async create() {
        const endpoint = createURL(this.endpoint);
        const response = await this.engine.post<EnrolledCourse>(endpoint);
        return response.data
    }

    update(courseId: number, courseName: string): void {
        console.log(`Updated course: ${courseId} with name: ${courseName}`);
    }

    delete() {

    }
}
