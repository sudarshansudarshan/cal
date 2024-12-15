export const CORE_API_CONFIG = {
  BASE_URL: process.env.REACT_APP_CORE_API_BASE_URL || 'https://run.mocky.io/v3/',
  ENDPOINTS: {
    USER_COURSES: '9cc16836-dcef-41f4-8419-6aef58f26753', // /users/{userId}/courses
    COURSE_INSTANCE: 'dff75402-9d93-4dce-b14e-3baeb018b88f', // /course-instances/{instanceId}
    MODULES: '36bece40-48de-4a7e-9c7a-57438f715064', // /courses/{courseId}/modules
    SECTIONS: 'adf196fa-5df4-45db-be77-311186b7df78', // /modules/{moduleId}/sections
    SECTION_ITEMS: '3676b8b6-5dea-4fbf-aaac-314bfa64a290', // sections/{sectionId}/items
    VIDEOS: '6fffe2fb-11e9-4a7b-a344-c13efa6e0b54', // /videos/{videoId}
    ARTICLES: '/articles/{articleId}', // /articles/{articleId}
    ASSESSMENTS: '/assessments/{assessmentId}', // /assessments/{assessmentId}
  },
};

export const ACTIVITY_API_CONFIG = {
  BASE_URL: process.env.REACT_APP_ACTIVITY_API_BASE_URL || 'https://mock-api.mocky.io/v3',
  ENDPOINTS: {
    // Add endpoints for the Activity Engine here when needed
  },
};
