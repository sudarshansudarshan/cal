import { ProgressEnum } from "@prisma/client";
import prisma from "../config/prisma";

export class CourseMetricsRepository {
    async createCourseProgress(courseInstanceId: string, studentId: string) {
        return prisma.studentCourseProgress.create({
            data: {
                studentId,
                courseInstanceId,
                progress: ProgressEnum.INCOMPLETE
            }
        });
    }
    async createModuleProgress(courseInstanceId: string, studentId: string, moduleId: string) {
        return prisma.studentModuleProgress.create({
            data: {
                studentId,
                courseInstanceId,
                moduleId,
                progress: ProgressEnum.INCOMPLETE
            }
        });
    }
    async createSectionProgress(courseInstanceId: string, studentId: string, sectionId: string) {
        return prisma.studentSectionProgress.create({
            data: {
                studentId,
                courseInstanceId,
                sectionId,
                progress: ProgressEnum.INCOMPLETE
            }
        });
    }
    async createSectionItemProgress(courseInstanceId: string, studentId: string, sectionItemId: string) {
        return prisma.studentSectionItemProgress.create({
            data: {
                studentId,
                courseInstanceId,
                sectionItemId,
                progress: ProgressEnum.INCOMPLETE
            }
        });
    }

    async getCourseProgress(courseInstanceId: string, studentId: string) {
        return prisma.studentCourseProgress.findUnique({
            where: {
                studentId_courseInstanceId: {
                    studentId,
                    courseInstanceId
                }
            }
        });
    }
    async getModuleProgress(courseInstanceId: string, studentId: string, moduleId: string) {
        return prisma.studentModuleProgress.findUnique({
            where: {
                studentId_moduleId_courseInstanceId: {
                    studentId,
                    moduleId,
                    courseInstanceId
                }
            }
        });
    }
    async getSectionProgress(courseInstanceId: string, studentId: string, sectionId: string) {
        return prisma.studentSectionProgress.findUnique({
            where: {
                studentId_sectionId_courseInstanceId: {
                    studentId,
                    sectionId,
                    courseInstanceId
                }
            }
        });
    }
    async getSectionItemProgress(courseInstanceId: string, studentId: string, sectionItemId: string) {
        return prisma.studentSectionItemProgress.findUnique({
            where: {
                studentId_sectionItemId_courseInstanceId: {
                    studentId,
                    sectionItemId,
                    courseInstanceId
                }
            }
        });
    }


    async updateCourseProgress(courseInstanceId: string, studentId: string) {
        const existingProgress = await prisma.studentCourseProgress.findUnique(
            {
                where: {
                    studentId_courseInstanceId: {
                        studentId,
                        courseInstanceId
                    }
                }
            }
        );
        if (!existingProgress) {
            return this.createCourseProgress(courseInstanceId, studentId);
        }
        const newProgress = existingProgress.progress === ProgressEnum.INCOMPLETE
            ? ProgressEnum.IN_PROGRESS
            : ProgressEnum.COMPLETE;

        return prisma.studentCourseProgress.update({
            where: {
                studentId_courseInstanceId: {
                    studentId,
                    courseInstanceId,
                },
            },
            data: {
                progress: newProgress,
            },
        });
    }
    async updateModuleProgress(courseInstanceId: string, studentId: string, moduleId: string, progress: ProgressEnum) {
        const existingProgress = await prisma.studentModuleProgress.findUnique(
            {
                where: {
                    studentId_moduleId_courseInstanceId: {
                        studentId,
                        moduleId,
                        courseInstanceId
                    }
                }
            }
        );
        if (!existingProgress) {
            return this.createModuleProgress(courseInstanceId, studentId, moduleId);
        }
        const newProgress = progress === ProgressEnum.INCOMPLETE
            ? ProgressEnum.IN_PROGRESS
            : ProgressEnum.COMPLETE;

        return prisma.studentModuleProgress.update({
            where: {
                studentId_moduleId_courseInstanceId: {
                    studentId,
                    moduleId,
                    courseInstanceId
                }
            },
            data: {
                progress: newProgress
            }
        });
    }
    async updateSectionProgress(courseInstanceId: string, studentId: string, sectionId: string, progress: ProgressEnum) {
        const existingProgress = await prisma.studentSectionProgress.findUnique(
            {
                where: {
                    studentId_sectionId_courseInstanceId: {
                        studentId,
                        sectionId,
                        courseInstanceId
                    }
                }
            }
        );
        if (!existingProgress) {
            return this.createSectionProgress(courseInstanceId, studentId, sectionId);
        }
        const newProgress = progress === ProgressEnum.INCOMPLETE
            ? ProgressEnum.IN_PROGRESS
            : ProgressEnum.COMPLETE;

        return prisma.studentSectionProgress.update({
            where: {
                studentId_sectionId_courseInstanceId: {
                    studentId,
                    sectionId,
                    courseInstanceId
                }
            },
            data: {
                progress: newProgress
            }
        });
    }
    async updateSectionItemProgress(courseInstanceId: string, studentId: string, sectionItemId: string) {
        const existingProgress = await prisma.studentSectionItemProgress.findUnique(
            {
                where: {
                    studentId_sectionItemId_courseInstanceId: {
                        studentId,
                        sectionItemId,
                        courseInstanceId
                    }
                }
            }
        );
        if (!existingProgress) {
            return this.createSectionItemProgress(courseInstanceId, studentId, sectionItemId);
        }
        const newProgress = existingProgress.progress === ProgressEnum.INCOMPLETE
            ? ProgressEnum.IN_PROGRESS
            : ProgressEnum.COMPLETE;
        
        

        return prisma.studentSectionItemProgress.update({
            where: {
                studentId_sectionItemId_courseInstanceId: {
                    studentId,
                    sectionItemId,
                    courseInstanceId
                }
            },
            data: {
                progress: newProgress
            }
        });
    }

}