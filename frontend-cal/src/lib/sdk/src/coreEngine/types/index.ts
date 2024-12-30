import { ArticleManager, AssessmentManager, VideoManager } from "../managers/sectionItems";

// User's Enrolled Courses
export interface CourseSummary {
  id: number;
  name: string;
  description: string;
  visibility: string;
}

export interface CourseDetails {
  id: number;
  name: string;
  description: string;
  visibility: string;
  instructors: string[];
}

// Course Instance Details
export interface CourseInstance {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface ModuleSummary {
  id: number;
  title: string;
  description: string;
  sequence: number;
}

export interface ModuleDetails {
  id: number;
  title: string;
  description: string;
  sequence: number;
  section_count: number;
}

// Section Details
export interface SectionSummary {
  id: number;
  title: string;
  description: string;
  sequence: number;
}

export interface SectionDetails {
  id: number;
  title: string;
  description: string;
  sequence: number;
  item_counts: SectionItemSummary;
}

export interface SectionItemSummary {
  videos: number;
  articles: number;
  assessments: number;
}

interface SectionItem {
  id: number;
  section: number;
  sequence: number;
}

// Video Details
export interface VideoDetails extends SectionItem {
  source: string;
  start_time: string;
  end_time: string;
  transcript: string;
  assessment: number;
}

// Article Details
export interface ArticleDetails extends SectionItem {
  content: string;
}

// Assessment Details
export interface AssessmentDetails extends SectionItem {
  title: string;
  time_limit: number;
  question_visibility_limit: number;
}

export interface SectionItemManager {
  videoManager: VideoManager;
  articleManager: ArticleManager;
  assessmentManager: AssessmentManager;
}

export interface InstitutionDetails {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  isActive: boolean;
}