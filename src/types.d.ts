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
  /** Engineering scope bullets — rendered after achievements when both are present */
  responsibilities?: string[];
  /** Concrete engineering contributions — receive visual priority over responsibilities */
  achievements?: string[];
  /** Either a flat list ["Java 17", "Spring Boot"] or grouped { Backend: ["Java 17"] } for scannable per-role context */
  technologies?: string[] | Record<string, string[]>;
  /** Business/product domains the role touched, e.g. ["Online booking", "Automotive"] */
  domains?: string[];
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
  rawNotes?: string;
}

export interface CreateCandidateInput {
  candidate_name: string;
  interview_date: string;
  job_id: string;
  new_job?: {
    title: string;
    department: string;
    description: string;
  };
  profile_summary: string;
  hr_context: string;
  technical_summary: string;
  scores: Record<string, number | string>;
}

export interface CandidateFeedback {
  candidate_name: string;
  content: string; // Markdown content
}

