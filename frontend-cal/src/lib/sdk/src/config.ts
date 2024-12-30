export const CORE_API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1/',
  ENDPOINTS: {
    USER_COURSES: 'course/courses/',
    COURSE_INSTANCE: 'course-instances/',
    MODULES: '/course/modules/',
    SECTIONS: 'course/sections/',
    VIDEOS: 'course/items/videos/',
    ARTICLES: 'course/items/articles/',
    ASSESSMENTS: 'course/items/assessments/',

    AUTH: 'auth/',
  },
};

export const ACTIVITY_API_CONFIG = {
  BASE_URL: 'https://mock-api.mocky.io/v3',
  ENDPOINTS: {
    // Add endpoints for the Activity Engine here when needed
  },
};
