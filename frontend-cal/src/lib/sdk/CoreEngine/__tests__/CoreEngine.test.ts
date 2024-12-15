import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CoreEngine } from '../CoreEngine';
import { CORE_API_CONFIG } from '../../config';

describe('CAL SDK', () => {
    let mock: MockAdapter;
    let coreEngine: CoreEngine;

    beforeAll(() => {
        // Initialize Axios mock adapter and CoreEngine instance
        mock = new MockAdapter(axios);
        coreEngine = new CoreEngine();
    });

    afterEach(() => {
        // Reset the mock after each test
        mock.reset();
    });

    it('CoreEngine: Fetch user courses successfully', async () => {
        const mockResponse = [
            {
                id: 1,
                name: "Machine Learning",
                description: "An introduction to ML.",
                visibility: "public",
                instance_id: 101,
                start_date: "2024-01-01",
                end_date: "2024-03-01"
            },
            {
                id: 2,
                name: "Data Science Fundamentals",
                description: "Core concepts in data science.",
                visibility: "private",
                instance_id: 102,
                start_date: "2024-02-01",
                end_date: "2024-04-01"
            }
        ];

        // Mock the API response
        mock.onGet(`${CORE_API_CONFIG.BASE_URL}${CORE_API_CONFIG.ENDPOINTS.USER_COURSES}`).reply(200, mockResponse);

        // Call the SDK method
        const courses = await coreEngine.getUserCourses();

        // Assertions
        expect(courses).toEqual(mockResponse);
        expect(courses.length).toBe(2);
    });

    it('CoreEngine: Fetch course instance details successfully', async () => {
        const mockResponse = {
            id: 101,
            name: "Machine Learning - Batch 1",
            description: "First run of the Machine Learning course.",
            start_date: "2024-01-01",
            end_date: "2024-03-01"
          }

        // Mock the API response
        mock.onGet(`${CORE_API_CONFIG.BASE_URL}${CORE_API_CONFIG.ENDPOINTS.COURSE_INSTANCE}`).reply(200, mockResponse);

        // Call the SDK method
        const courseInstance = await coreEngine.getCourseInstance();

        // Assertions
        expect(courseInstance).toEqual(mockResponse);
    });
});
