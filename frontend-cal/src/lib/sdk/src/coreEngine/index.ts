
import axios, { AxiosInstance } from 'axios';
import { CORE_API_CONFIG } from '../config';
import { provideParams } from '../utils/provideParams';
import {
  CourseInstance,
  SectionItemManager,
} from './types';

import * as managers from './managers';

/**
 * CoreEngine: A class to handle all API requests to the Core Engine.
 */
export class CoreEngine {
  private engine: AxiosInstance;
  public authManager: managers.AuthManager;
  private _courseManager: managers.CourseManager | null = null;
  private _moduleManager: managers.ModuleManager | null = null;
  private _sectionManager: managers.SectionManager | null = null;
  private _sectionItemManager: SectionItemManager | null = null;
  private _institutionManager: managers.InstitutionManager | null = null;
  private _questionManager: managers.QuestionManager | null = null;
  private _userManager: managers.UserManager | null = null;

  constructor() {
    this.engine = axios.create({
      baseURL: CORE_API_CONFIG.BASE_URL,
      timeout: 5000, // 5-second timeout for all requests
    });
    this.authManager = new managers.AuthManager(this.engine);
  }

  private ensureAuthInitialized(): void {
    if (!this.authManager.isAuthenticated()) {
      throw new Error("Auth is not initialized. Please log in or use a token first.");
    }
  }

  get courseManager(): managers.CourseManager {
    this.ensureAuthInitialized();
    if (!this._courseManager) {
      this._courseManager = new managers.CourseManager(this.engine);
    }
    return this._courseManager;
  }

  get moduleManager(): managers.ModuleManager {
    this.ensureAuthInitialized();
    if (!this._moduleManager) {
      this._moduleManager = new managers.ModuleManager(this.engine);
    }
    return this._moduleManager;
  }

  get sectionManager(): managers.SectionManager {
    this.ensureAuthInitialized();
    if (!this._sectionManager) {
      this._sectionManager = new managers.SectionManager(this.engine);
    }
    return this._sectionManager;
  }

  get itemManager(): SectionItemManager {
    this.ensureAuthInitialized();
    if (!this._sectionItemManager) {
      this._sectionItemManager = {
        videoManager: new managers.VideoManager(this.engine),
        articleManager: new managers.ArticleManager(this.engine),
        assessmentManager: new managers.AssessmentManager(this.engine),
      }
    }
    return this._sectionItemManager;
  }

  get institutionManager(): managers.InstitutionManager {
    this.ensureAuthInitialized();
    if (!this._institutionManager) {
      this._institutionManager = new managers.InstitutionManager(this.engine);
    }
    return this._institutionManager;
  }

  get questionManager(): managers.QuestionManager {
    this.ensureAuthInitialized();
    if (!this._questionManager) {
      this._questionManager = new managers.QuestionManager(this.engine);
    }
    return this._questionManager;
  }

  get userManager(): managers.UserManager {
    this.ensureAuthInitialized();
    if (!this._userManager) {
      this._userManager = new managers.UserManager(this.engine);
    }
    return this._userManager;
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
}
