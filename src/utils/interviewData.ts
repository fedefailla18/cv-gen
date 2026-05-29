import { CandidateFeedback, CandidateNote, InterviewJob } from '../types';

export const JOBS: InterviewJob[] = [
  {
    id: 'senior-java-developer',
    title: 'Senior Java Developer',
    department: 'Backend Engineering',
    status: 'Open',
    description: 'Design, build, and optimize core components of a modern, cloud-native platform focused on API management and integrations.'
  },
  {
    id: 'fab-sr-java-be-claude',
    title: 'Senior Java Backend Engineer (Claude)',
    department: 'Backend Engineering',
    status: 'Open',
    description: 'Design, develop, and maintain high-performance backend services using Java and AI technologies.'
  }
];

export const CANDIDATES: (CandidateNote & { feedback: string })[] = [
  {
    candidate_name: 'Greti',
    interview_date: '2026-05-21',
    interviewer: 'Federico',
    role: 'Senior Java Developer',
    job_id: 'senior-java-developer',
    status: 'Technical Interview Completed',
    scores: {
      'Agile/Scrum': 3,
      'Java (JVM/Memory)': 3,
      'Spring/Boot': 4,
      'Concurrency': 2.8,
      'SQL/Database': 3
    },
    feedback: `## 1. Attitude
Greti demonstrated strong backend ownership and engineering maturity. He appears highly comfortable working across the full software development lifecycle.

## 2. Communication
Communication is one of Greti's primary strengths. He provided structured, clear, and technically accurate explanations.

## 4. Technical Strengths
- **Spring Ecosystem:** Outstanding depth (4/4).
- **Production Maturity:** Solid runtime reasoning.

## 7. Recommendation
**Overall Rating: 9/10** - Strong recommendation to move forward.`
  },
  {
    candidate_name: 'Dardo',
    interview_date: '2026-05-29',
    interviewer: 'Federico',
    role: 'Senior Java Developer',
    job_id: 'senior-java-developer',
    status: 'Technical Interview Completed',
    scores: {
      'Agile/Scrum': 3,
      'Java (JVM/Memory)': 4,
      'Concurrency': 3,
      'Production Debugging': 3
    },
    feedback: `## 1. Attitude
Dardo presents a mature engineering mindset, characterizing himself as a tech-focused team lead.

## 4. Technical Strengths
- **JVM & Memory:** Outstanding (4/4). Deep knowledge of the JMM.
- **Production Experience:** High-signal experience with event-driven systems.

## 7. Recommendation
**Overall Rating: 8.5/10** - Recommendation to move forward.`
  },
  {
    candidate_name: 'Ruben',
    interview_date: '2026-05-29',
    interviewer: 'Federico',
    role: 'Senior Java Developer',
    job_id: 'fab-sr-java-be-claude',
    status: 'Technical Interview Completed',
    scores: {
      'Agile/Scrum': 3,
      'Java (JVM/Memory)': 4,
      'AWS & Infrastructure': 4,
      'Legacy Migrations': 4
    },
    feedback: `## 1. Attitude
Ruben demonstrates high-level ownership typical of a veteran engineer with 16+ years of experience.

## 4. Technical Strengths
- **Event-Driven Architecture:** Very strong signal. Experience scaling systems to millions of events.
- **AWS & Infrastructure:** 8+ years of AWS experience.

## 7. Recommendation
**Overall Rating: 9/10** - Strong recommendation to move forward.`
  }
];
