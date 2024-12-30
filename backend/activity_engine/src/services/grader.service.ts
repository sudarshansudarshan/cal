import { AttemptsService } from "./attempts.service";
import { CoreEngineService } from "./coreEngine.service";

export class GraderService {
    private readonly coreEngine: CoreEngineService;
    private readonly attemptsService: AttemptsService;

    constructor() {
        this.coreEngine = new CoreEngineService()
        this.attemptsService = new AttemptsService()
    }

    async gradeAttempt(attemptId, answers) {
        const attempt = await this.attemptsService.getAttempt(attemptId);
        const solution = await this.getSolution(attempt.assessmentId);

        // Compare the student's answers to the correct solution
        // and return the result
    }

    private async getSolution(assessmentId) {
        const assessment = await this.coreEngine.getAnswer(assessmentId);

        if (assessment.question_type === 'MSQ') {
            return assessment.solutions;
        } else {
            return assessment.solution;
        }
    }
}
