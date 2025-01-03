import { MetricsRepository } from '../repositories/metrics.repository';
import { ContentTypeEnum } from '@prisma/client';
import { ViolationInput } from '../types/metrics.types';

const metricsRepo = new MetricsRepository();

export class MetricsService {
  async getVideoMetrics(studentId: string, courseInstanceId: string, videoId: string) {
    return metricsRepo.getVideoMetrics(studentId, courseInstanceId, videoId);
  }

  async updateVideoMetrics(studentId: string, courseInstanceId: string, videoId: string, replays: number) {
    return metricsRepo.updateVideoMetrics(studentId, courseInstanceId, videoId, replays);
  }

  async recordViolationWithImages(input: ViolationInput) {
    const { studentId, contentType, contentTypeId, violationType, images } = input;
    return metricsRepo.recordViolationWithImages(studentId, contentType, contentTypeId, violationType, images);
  }

  async getViolations(studentId: string, contentTypeId: string) {
    return metricsRepo.getViolations(studentId, contentTypeId);
  }
}
