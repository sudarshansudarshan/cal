export const CORE_API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    USER_COURSES: '/course/courses/',
    COURSE_INSTANCE: 'dff75402-9d93-4dce-b14e-3baeb018b88f', // /course-instances/{instanceId}
    MODULES: '/course/modules/',
    SECTIONS: 'adf196fa-5df4-45db-be77-311186b7df78', // /modules/{moduleId}/sections
    SECTION_ITEMS: '3676b8b6-5dea-4fbf-aaac-314bfa64a290', // sections/{sectionId}/items
    VIDEOS: '6fffe2fb-11e9-4a7b-a344-c13efa6e0b54', // /videos/{videoId}
    ARTICLES: '/articles/{articleId}', // /articles/{articleId}
    ASSESSMENTS: '/assessments/{assessmentId}', // /assessments/{assessmentId}
  },
};

export const ACTIVITY_API_CONFIG = {
  BASE_URL: 'https://mock-api.mocky.io/v3',
  ENDPOINTS: {
    // Add endpoints for the Activity Engine here when needed
  },
};
