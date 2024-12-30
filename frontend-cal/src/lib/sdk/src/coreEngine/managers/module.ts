import { CORE_API_CONFIG } from "../../config";
import { BaseManagerWithSummary } from "../base";
import { ModuleDetails, ModuleSummary } from "../types";

export class ModuleManager extends BaseManagerWithSummary<ModuleDetails, ModuleSummary> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.MODULES;
}
