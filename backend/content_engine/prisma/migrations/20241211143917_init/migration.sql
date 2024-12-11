-- CreateEnum
CREATE TYPE "CourseStatusEnum" AS ENUM ('enrolled', 'dropped', 'completed');

-- CreateEnum
CREATE TYPE "ContentTypeEnum" AS ENUM ('video', 'article', 'assessment');

-- CreateTable
CREATE TABLE "StudentCourseStatus" (
    "student_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "status" "CourseStatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCourseStatus_pkey" PRIMARY KEY ("student_id","course_instance_id")
);

-- CreateTable
CREATE TABLE "StudentModuleStatus" (
    "student_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "status" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentModuleStatus_pkey" PRIMARY KEY ("student_id","module_id")
);

-- CreateTable
CREATE TABLE "StudentSectionStatus" (
    "student_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "status" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentSectionStatus_pkey" PRIMARY KEY ("student_id","section_id","course_instance_id")
);

-- CreateTable
CREATE TABLE "StudentAssessmentStatus" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAssessmentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentVideoMetrics" (
    "course_instance_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "replays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentVideoMetrics_pkey" PRIMARY KEY ("student_id","video_id","course_instance_id")
);

-- CreateTable
CREATE TABLE "StudentViolation" (
    "id" SERIAL NOT NULL,
    "student_id" TEXT NOT NULL,
    "content_type" "ContentTypeEnum" NOT NULL,
    "content_type_id" TEXT NOT NULL,
    "violation_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentNATAnswer" (
    "id" SERIAL NOT NULL,
    "question_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentNATAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDescriptiveAnswer" (
    "id" SERIAL NOT NULL,
    "question_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDescriptiveAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentMCQAnswer" (
    "id" SERIAL NOT NULL,
    "question_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "choice_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentMCQAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentMSQAnswer" (
    "id" SERIAL NOT NULL,
    "question_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_instance_id" TEXT NOT NULL,
    "choice_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentMSQAnswer_pkey" PRIMARY KEY ("id")
);
