/*
  Warnings:

  - You are about to drop the `StudentAssessmentStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentCourseStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentModuleStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentSectionStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentViolation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseProgressMetricsEnum" AS ENUM ('enrolled', 'dropped', 'completed');

-- DropTable
DROP TABLE "StudentAssessmentStatus";

-- DropTable
DROP TABLE "StudentCourseStatus";

-- DropTable
DROP TABLE "StudentModuleStatus";

-- DropTable
DROP TABLE "StudentSectionStatus";

-- DropTable
DROP TABLE "StudentViolation";

-- DropEnum
DROP TYPE "CourseStatusEnum";

-- CreateTable
CREATE TABLE "StudentCourseProgressMetrics" (
    "student_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "ProgressMetrics" "CourseProgressMetricsEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCourseProgressMetrics_pkey" PRIMARY KEY ("student_id","course_instance_id")
);

-- CreateTable
CREATE TABLE "StudentModuleProgressMetrics" (
    "student_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "ProgressMetrics" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentModuleProgressMetrics_pkey" PRIMARY KEY ("student_id","module_id")
);

-- CreateTable
CREATE TABLE "StudentSectionProgressMetrics" (
    "student_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "ProgressMetrics" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentSectionProgressMetrics_pkey" PRIMARY KEY ("student_id","section_id","course_instance_id")
);

-- CreateTable
CREATE TABLE "StudentAssessmentProgressMetrics" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAssessmentProgressMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentViolationMetrics" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "content_type" "ContentTypeEnum" NOT NULL,
    "content_type_id" TEXT NOT NULL,
    "ViolationMetrics_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentViolationMetrics_pkey" PRIMARY KEY ("id")
);
