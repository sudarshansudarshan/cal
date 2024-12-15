
import axios, { AxiosInstance } from 'axios';
import { CORE_API_CONFIG } from '../config';
import { provideParams } from '../utils/provideParams';
import {
  EnrolledCourse,
  CourseInstance,
  Module,
  Section,
  SectionItemSummary,
  Video,
  Article,
  Assessment,
} from '../types/coreEngine';

/**
 * CoreEngine: A class to handle all API requests to the Core Engine.
 */
export class CoreEngine {
  private engine: AxiosInstance;

  /**
   * Initialize the CoreEngine instance.
   */
  constructor() {
    this.engine = axios.create({
      baseURL: CORE_API_CONFIG.BASE_URL,
      timeout: 5000, // 5-second timeout for all requests
    });
  }

  /**
   * Fetch all courses a user is enrolled in.
   * @param userId - ID of the user.
   * @returns A list of enrolled courses.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getUserCourses(userId?: number): Promise<EnrolledCourse[]> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.USER_COURSES);
    const response = await this.engine.get<EnrolledCourse[]>(endpoint);
    return response.data;
  }

  /**
   * Fetch details of a specific course instance.
   * @param instanceId - ID of the course instance.
   * @returns The course instance details.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getCourseInstance(instanceId?: number): Promise<CourseInstance> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.COURSE_INSTANCE);
    const response = await this.engine.get<CourseInstance>(endpoint);
    return response.data;
  }

  /**
   * Fetch all modules for a specific course.
   * @param courseId - ID of the course.
   * @returns A list of modules.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getModules(courseId?: number): Promise<Module[]> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.MODULES);
    const response = await this.engine.get<Module[]>(endpoint);
    return response.data;
  }

  /**
   * Fetch all sections for a specific module.
   * @param moduleId - ID of the module.
   * @returns A list of sections.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getSections(moduleId?: number): Promise<Section[]> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.SECTIONS);
    const response = await this.engine.get<Section[]>(endpoint);
    return response.data;
  }

  /**
   * Fetch all section items for a specific section.
   * @param sectionId - ID of the section.
   * @returns A list of section items.
   */
  public async getSectionItems(sectionId: number): Promise<SectionItemSummary[]> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.SECTION_ITEMS, { sectionId });
    const response = await this.engine.get<SectionItemSummary[]>(endpoint);
    return response.data;
  }

  /**
   * Fetch details of a specific video.
   * @param videoId - ID of the video.
   * @returns The video details.
   */
  public async getVideo(videoId: number): Promise<Video> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.VIDEOS, { videoId });
    const response = await this.engine.get<Video>(endpoint);
    return response.data;
  }

  /**
   * Fetch details of a specific article.
   * @param articleId - ID of the article.
   * @returns The article details.
   */
  public async getArticle(articleId: number): Promise<Article> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.ARTICLES, { articleId });
    const response = await this.engine.get<Article>(endpoint);
    return response.data;
  }

  /**
   * Fetch details of a specific assessment.
   * @param assessmentId - ID of the assessment.
   * @returns The assessment details.
   */
  public async getAssessment(assessmentId: number): Promise<Assessment> {
    const endpoint = provideParams(CORE_API_CONFIG.ENDPOINTS.ASSESSMENTS, { assessmentId });
    const response = await this.engine.get<Assessment>(endpoint);
    return response.data;
  }
}