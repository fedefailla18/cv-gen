export interface Basics {
  name: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: { city?: string; region?: string; countryCode?: string };
  profiles?: { network: string; username?: string; url?: string }[];
}

export interface WorkItem {
  name: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface EducationItem {
  institution: string;
  area?: string;
  studyType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

export interface Resume {
  basics: Basics;
  work?: WorkItem[];
  education?: EducationItem[];
  skills?: { name: string; level?: string; keywords?: string[] }[];
  languages?: { language: string; fluency?: string }[];
}

export interface InterviewJob {
  id: string;
  title: string;
  department?: string;
  client?: string;
  status?: string;
  description?: string;
}

export interface CandidateNote {
  candidate_name: string;
  interview_date: string;
  interviewer: string;
  role: string;
  job_id: string;
  status: string;
  profile_summary?: string;
  scores?: Record<string, number | string>;
}

export interface CandidateFeedback {
  candidate_name: string;
  content: string; // Markdown content
}

