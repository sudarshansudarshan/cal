import { CORE_API_CONFIG } from "../../config";
import { CourseDetails, CourseSummary } from "../types";
import { BaseManagerWithSummary } from "../base";

export class CourseManager extends BaseManagerWithSummary<CourseDetails, CourseSummary> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.USER_COURSES;
}
