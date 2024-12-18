import { AxiosInstance } from "axios";
import { EnrolledCourse } from "../types/coreEngine";
import { CORE_API_CONFIG } from "../../config";
import { createURL } from "../../utils/createURL";

export class VideoManager {
    private engine: AxiosInstance;
    private endpoint = CORE_API_CONFIG.ENDPOINTS.VIDEOS;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
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

export class ArticleManager {
    private engine: AxiosInstance;
    private endpoint = CORE_API_CONFIG.ENDPOINTS.ARTICLES;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
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

export class AssessmentManager {
    private engine: AxiosInstance;
    private endpoint = CORE_API_CONFIG.ENDPOINTS.ASSESSMENTS;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
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