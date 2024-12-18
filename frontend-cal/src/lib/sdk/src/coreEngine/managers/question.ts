import { AxiosInstance } from "axios";

export class QuestionManager {
    private engine: AxiosInstance;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
    }

    async *streamQuestions() {
        yield 'question1';
        yield 'question2';
        yield 'question3';
    }

    get() {

    }

    create() {
        return 'this.questions;';
    }

    update() {
        console.log("Questions updated");
    }

    delete() {
        console.log("Questions deleted");
    }
}