import { AxiosInstance } from 'axios';
import { createURL } from '../../utils/createURL';

export abstract class BaseManager<Details> {
  protected engine: AxiosInstance;
  protected endpoint: string = '';

  constructor(engine: AxiosInstance) {
    this.engine = engine;
  }

  /**
   * Fetch detailed information about a single resource
   * @param resourceId ID of the resource
   */
  async getDetails(resourceId: number): Promise<Details> {
    const endpoint = createURL(this.endpoint, resourceId);
    const response = await this.engine.get<Details>(endpoint);
    return response.data;
  }

  /**
   * Create a new resource
   * @param payload Data for creating the resource
   */
  async create(payload: Partial<Details>): Promise<Details> {
    const endpoint = createURL(this.endpoint);
    const response = await this.engine.post<Details>(endpoint, payload);
    return response.data;
  }

  /**
   * Update a resource
   * @param resourceId ID of the resource
   * @param payload Data for updating the resource
   */
  async update(resourceId: number, payload: Partial<Details>): Promise<Details> {
    const endpoint = createURL(this.endpoint, resourceId);
    const response = await this.engine.patch<Details>(endpoint, payload);
    return response.data;
  }

  /**
   * Delete a resource
   * @param resourceId ID of the resource
   */
  async delete(resourceId: number): Promise<void> {
    const endpoint = createURL(this.endpoint, resourceId);
    await this.engine.delete(endpoint);
  }
}
