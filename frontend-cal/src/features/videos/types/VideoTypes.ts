export interface VideoDetails {
    id: number;
    source: string;       // Video URL
    start_time: string;   // Start time in HH:MM:SS format
    end_time: string;     // End time in HH:MM:SS format
    transcript: string;   // Transcript text
    assessmentId: number; // Related assessment ID
  }
  