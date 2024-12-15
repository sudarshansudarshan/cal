// User's Enrolled Courses
export interface EnrolledCourse {
  id: number;
  name: string;
  description: string;
  visibility: string;
  instance_id: number;
  start_date: string;
  end_date: string;
}

// Course Instance Details
export interface CourseInstance {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
}

// Module Details
export interface Module {
  id: number;
  title: string;
  description: string;
  sequence: number;
}

// Section Details
export interface Section {
  id: number;
  title: string;
  sequence: number;
  section_items_count: number;
}

// Section Item Summary
export interface SectionItemSummary {
  id: number;
  type: string; // Possible values: "article", "video", "assessment"
}

// Video Details
export interface Video {
  id: number;
  source: string;
  start_time: string;
  end_time: string;
  transcript: string;
  sequence: number;
  assessmentId: number;
}

// Article Details
export interface Article {
  id: number;
  content: string;
  sequence: number;
  assessmentId: number;
}

// Assessment Details
export interface Assessment {
  id: number;
  title: string;
  time_limit: number;
  sequence: number;
}
