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

