export class CoreEngineService {
    private readonly baseURL: string;

    constructor() {
        const URL = process.env.CORE_ENGINE_URL || 'http://localhost:8000'
        this.baseURL = `${URL}/api/v1/`;
    }

    /**
     * Fetches the answer for a given question ID and transforms the response.
     * @param questionId - The ID of the question to fetch the solution for.
     * @returns A structured object based on the question type.
     */
    async getAnswer(questionId: number): Promise<AnswerResponse> {
        const endpoint = `assessment/solutions/${questionId}/`;
        const response = await this.request('GET', endpoint) as AnswerResponse;
        return this.transformResponse(response);
    }

    /**
     * Sends an HTTP request to the specified endpoint.
     * @param method - HTTP method (GET, POST, etc.)
     * @param endpoint - API endpoint
     * @param params - Optional query parameters
     * @returns Parsed JSON response
     */
    private async request(
        method: string,
        endpoint: string,
        params?: Record<string, string>
    ) {
        const queryParams = params
            ? '?' + new URLSearchParams(params).toString()
            : '';
        const url = `${this.baseURL}${endpoint}${queryParams}`;

        const response = await fetch(url, {
            method,
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw { status: response.status, message: errorMessage };
        }

        return response.json();
    }

    /**
     * Transforms the API response into a structured object.
     * @param response - The raw response from the API
     * @returns A strongly typed object based on the question type
     */
    private transformResponse(response: AnswerResponse): AnswerResponse {
        switch (response.question_type) {
            case QuestionType.NAT:
                return { question_type: QuestionType.NAT, solution: response.solution };
            case QuestionType.DESC:
                return { question_type: QuestionType.DESC, solution: response.solution };
            case QuestionType.MCQ:
                return { question_type: QuestionType.MCQ, solution: response.solution };
            case QuestionType.MSQ:
                return { question_type: QuestionType.MSQ, solutions: response.solutions };
            default:
                throw new Error('Invalid question type');
        }
    }
}

export interface NATAnswerResponse {
    question_type: QuestionType.NAT;
    solution: {
        value: number;
        tolerance_max: number;
        tolerance_min: number;
        decimal_precision: number;
        solution_explanation: string;
    };
}

export interface DescriptiveAnswerResponse {
    question_type: QuestionType.DESC;
    solution: {
        model_solution: string;
        max_word_limit: number;
        min_word_limit: number;
        solution_explanation: string;
    };
}

export interface MCQAnswerResponse {
    question_type: QuestionType.MCQ;
    solution: {
        choice: string;
        solution_explanation: string;
    };
}

export interface MSQAnswerResponse {
    question_type: QuestionType.MSQ;
    solutions: {
        choice: string;
        solution_explanation: string;
    }[];
}

export type AnswerResponse =
    | NATAnswerResponse
    | DescriptiveAnswerResponse
    | MCQAnswerResponse
    | MSQAnswerResponse;

enum QuestionType {
    NAT = 'NAT',
    DESC = 'DESC',
    MCQ = 'MCQ',
    MSQ = 'MSQ',
}
