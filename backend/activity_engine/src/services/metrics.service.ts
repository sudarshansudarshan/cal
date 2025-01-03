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

// OpenAPIDocs
/**
 *     "/metrics/video": {
      "get": {
        "summary": "Get video metrics for a student",
        "tags": [
          "Metrics"
        ],
        "parameters": [
          {
            "name": "studentId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "courseInstanceId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "videoId",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Video metrics retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "studentId": {
                      "type": "string"
                    },
                    "courseInstanceId": {
                      "type": "string"
                    },
                    "videoId": {
                      "type": "string"
                    },
                    "replays": {
                      "type": "integer"
                    }
                  }
                },
                "example": {
                  "studentId": "stu123",
                  "courseInstanceId": "courseABC",
                  "videoId": "video789",
                  "replays": 5
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Update video metrics for a student",
        "tags": [
          "Metrics"
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "studentId",
                  "courseInstanceId",
                  "videoId",
                  "replays"
                ],
                "properties": {
                  "studentId": {
                    "type": "string"
                  },
                  "courseInstanceId": {
                    "type": "string"
                  },
                  "videoId": {
                    "type": "string"
                  },
                  "replays": {
                    "type": "integer"
                  }
                },
                "example": {
                  "studentId": "stu123",
                  "courseInstanceId": "courseABC",
                  "videoId": "video789",
                  "replays": 6
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Metrics updated",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string"
                    },
                    "data": {
                      "type": "object"
                    }
                  }
                },
                "example": {
                  "status": "updated",
                  "data": {
                    "studentId": "stu123",
                    "courseInstanceId": "courseABC",
                    "videoId": "video789",
                    "replays": 6
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
 */