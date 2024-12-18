import { AxiosInstance } from "axios";
import { CORE_API_CONFIG } from "../../config";


export class InstitutionManager {
    private engine: AxiosInstance;
    private endpoint = CORE_API_CONFIG.ENDPOINTS.MODULES;

    constructor(engine: AxiosInstance) {
        this.engine = engine;
    }

    get() { }

    create() { }

    update() { }

    deactivate() { }
}