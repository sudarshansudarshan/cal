import { CORE_API_CONFIG } from "../../config";
import { BaseManager } from "../base";
import { ArticleDetails, AssessmentDetails, VideoDetails } from "../types";

export class VideoManager extends BaseManager<VideoDetails> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.VIDEOS;
}

export class ArticleManager extends BaseManager<ArticleDetails> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.ARTICLES;
}

export class AssessmentManager extends BaseManager<AssessmentDetails> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.ASSESSMENTS;
}
