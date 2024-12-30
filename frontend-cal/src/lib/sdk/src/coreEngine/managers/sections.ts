import { CORE_API_CONFIG } from "../../config";
import { BaseManagerWithSummary } from "../base";
import { SectionDetails, SectionSummary } from "../types";

export class SectionManager extends BaseManagerWithSummary<SectionDetails, SectionSummary> {
    protected endpoint = CORE_API_CONFIG.ENDPOINTS.SECTIONS;
}
