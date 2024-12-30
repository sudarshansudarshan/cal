import { CORE_API_CONFIG } from "../../config";
import { BaseManager } from "../base";
import { InstitutionDetails } from "../types";

export class InstitutionManager extends BaseManager<InstitutionDetails> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.MODULES;

    deactivate(institutionID: number) {
        return this.delete(institutionID);
    }
}