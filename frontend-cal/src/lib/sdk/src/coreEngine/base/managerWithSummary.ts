import { BaseManager } from ".";
import { createURL } from "../../utils/createURL";

export class BaseManagerWithSummary<Details, Summary> extends BaseManager<Details> {
    /**
     * Stream paginated summaries from the API
     * @param limit Number of items per page
     */
    async *streamSummaries(limit: number) {
        let hasMore = true;
        let currentOffset = 0;

        while (hasMore) {
            const queryParams = { limit, offset: currentOffset };
            const endpoint = createURL(this.endpoint, null, queryParams);
            const response = await this.engine.get<{
                results: Summary[];
                count: number;
                next: string | null;
                previous: string | null;
            }>(endpoint);

            const data = response.data.results; // Extract the actual data
            yield data;

            hasMore = response.data.next !== null; // Check if there are more pages
            currentOffset += limit; // Update offset for the next page
        }
    }

}