import { CandidateNote, InterviewJob, CreateCandidateInput } from '../types';

/**
 * Generates the standardized notes.md content from form input.
 */
export function generateCandidateMarkdown(input: CreateCandidateInput, roleTitle: string): string {
  const scoresYaml = Object.entries(input.scores)
    .map(([skill, score]) => `- **${skill}:** ${score}`)
    .join('\n');

  return `---
candidate_name: ${input.candidate_name}
interview_date: ${input.interview_date}
interviewer: Federico
role: ${roleTitle}
job_id: ${input.job_id}
status: Technical Interview Completed
---

# Candidate Profile
${input.profile_summary}

# HR Context
${input.hr_context}

# Technical Assessment

## General Notes
${input.technical_summary}

## Scoring (0-4)
${scoresYaml}
`;
}

/**
 * Generates the standardized job description Markdown content.
 */
export function generateJobMarkdown(job: { title: string, department: string, description: string }): string {
  return `---
title: ${job.title}
department: ${job.department}
status: Open
---

## About the Position
${job.description}
`;
}

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
    rawNotes: `# Candidate Profile
Passionate software developer with a focus on Java and Spring ecosystem.

# HR Context
- Current team: 2 senior backend devs. Heavy involvement in architecture.
- Product Ownership: Owns "Voice Portal" internally.
- Past Experience: UniCredit (Bank Austria/German bank), K8s environments. IoT (Kafka streaming, MongoDB).
- Certifications: Broadcom/Spring certified.
- Mentorship: 2 years teaching Spring Boot in academies.

# Technical Assessment

## General Notes
Greti responded in a nice, structured, and deep way. Technically accurate nuances. Able to explain "the actions, the what they do" (business side). High hands-on signal.

## Scoring (0-4)
- **Agile/Scrum:** 3
- **English Level:** 3
- **Daily Routine:** 3
- **Difficult Challenge:** 3
- **AI Usage:** 3
- **Production Debugging:** 3 (Sentry, GCP Logs)
- **SOLID/Clean Code:** 3
- **Mentoring:** 3
- **Cloud/Arch:** 3

## Core Skills
- **Java (JVM/Memory):** 3 (Brief/accurate, mentioned JIT)
- **Exceptions:** 3
- **Streams/Functional:** 3
- **Design Patterns:** 3 (Strategy, Spring patterns)
- **Concurrency:** 2.8 (Deadlock/Livelock difference explained; Sync/Volatile/Atomics explained well)
- **Spring/Boot:** 4 (Goal/Benefit, DI Pros/Cons, Bean Scopes/Proxy/Chain/Dispatcher)
- **JPA/Hibernate:** 3 (N+1, Join Fetch, Batch size)
- **Git/CI/CD:** 3 (Reviewing logic: ticket reqs to unchecked exceptions)
- **SQL/Database:** 3 (Joins, Indexes, Constraints)`,
    feedback: `## 1. Attitude
Greti demonstrated strong backend ownership and engineering maturity throughout the interview. He appears highly comfortable working across the full software development lifecycle, participating in architecture discussions, and taking accountability for internal products (e.g., Voice Portal). His willingness to mentor others—evidenced by his two years at the Spring academy—highlights a proactive and collaborative mindset. He reacts well to uncertainty, drawing from real-world production experience rather than just following patterns.

## 2. Communication
Communication is one of Greti's primary strengths. He provided structured, clear, and technically accurate explanations. Notably, he possesses the ability to bridge the gap between low-level technical implementation and "the actions"—the business-side purpose of the software. His technical vocabulary is precise, and he communicates comfortably with a level of fluency suitable for senior collaboration in international environments.

## 3. Leadership Skills
Greti shows significant leadership potential through technical influence. His experience owning a product internally and his long-term commitment to mentoring junior developers via Spring academies are strong signals of seniority. He is not just a coder but an architectural participant who understands how to guide a team and act as a technical reference point.

## 4. Technical Strengths
- **Spring Ecosystem:** Outstanding depth (4/4). Broadcom certified with a clear understanding of DI pros/cons, Bean scopes, and patterns like Proxy and Chain of Responsibility.
- **Production Maturity:** Solid runtime reasoning. Demonstrated practical experience with Hibernate optimizations (N+1, Join Fetch, Batch size) and distributed systems.
- **Infrastructure & K8s:** Practical experience managing applications in Kubernetes environments and using Helm, despite not being a pure DevOps engineer.
- **Observability & Debugging:** Strong production signal using Sentry and GCP logs to diagnose issues.
- **Code Quality:** Methodical approach to code reviews, looking beyond syntax to ticket requirements and exception handling.

## 5. Areas for Improvement
While his concurrency foundations are solid (Atomics, Race conditions), there was a minor gap in precision when distinguishing between deadlock and livelock nuances (scoring 2.8). However, this is a minor calibration point given his overall technical depth. Continued exposure to high-scale distributed synchronization patterns will further solidify his "Outstanding" rating.

## 6. Feedback Notes / Side Notes
One very strong signal is Greti's ability to reason from "runtime behavior." He didn't just list framework features; he explained *why* and *how* things work under the hood (e.g., JIT compilation in JVM, lazy loading in JPA). His mentorship background makes him an excellent fit for teams looking to grow their junior talent.

## 7. Recommendation
**Overall Rating: 9/10** - Strong recommendation to move forward. Greti is a calibrated Senior Backend Engineer who can immediately own production systems and contribute to architectural evolution.`
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
    rawNotes: `# Candidate Profile
Senior Java Developer with significant experience in distributed systems, event-driven architectures, and production observability.

# Technical Assessment

## General Notes
Excellent technical depth, particularly in JVM internals and production-level debugging. Strong signal on event-driven migrations and handling high-scale traffic (millions of requests). Demonstrates a "tech lead" mindset, balancing technical execution with cost awareness.

## Scoring (0-4)
- **Agile/Scrum/Process:** 3 (Team lead mindset, cost-aware)
- **English Level:** 2 (Functional, but slightly lower than technical depth)
- **Tools/Tech Reliance:** 4 (Excellent grasp of daily toolchain)
- **Difficult Challenge:** 3
- **AI Usage:** 2
- **System Walkthrough:** 2 (Room for more structured architectural overview)
- **Production Debugging:** 3 (Experience with migration to event-driven, handling duplicate records)
- **Observability:** 3 (Mentioned as part of daily routine)
- **Kafka (from scratch):** 3
- **Docker:** 3 (Good understanding)
- **Mentoring:** 2 (Limited detail on daily mentoring activities)

## Core Skills
- **Java (JVM/Memory/GC):** 4 (Excellent, mixed with JMM, threads, and GC details)
- **Exceptions & Resilience:** 4 (Complete answer, client data awareness)
- **Streams/Functional:** 3
- **Collections (Sorted/TreeMap):** 3
- **Design Patterns:** 4
- **Memory Organization:** 3
- **Concurrency (JMM/Race Conditions):** 3 (Good JMM/Volatile/Sync; Atomics was a 2)
- **Spring/Boot (Scopes):** 3
- **JPA/Hibernate:** 4 (Excellent)
- **Git/CI/CD:** 3 (Expertise in merge/rebase/cherry-pick)
- **SQL/Database:** 3 (Joins, Indexes)`,
    feedback: `## 1. Attitude
Dardo presents a mature engineering mindset, characterizing himself as a tech-focused team lead who is also conscious of operational costs. He demonstrated a strong sense of accountability during a complex migration from microservices to an event-driven architecture, specifically handling high-volume data consistency (duplicate records). He appears to be a "builder" who understands the lifecycle of production systems.

## 2. Communication
Technically, Dardo is excellent; he can dive deep into JVM internals and memory models with precision. However, there is a slight disconnect between his technical depth and his ability to structure high-level system walkthroughs (scoring 2 in that area). His English is functional (scoring 2) but may require some adjustment in highly collaborative, fast-paced international environments.

## 3. Leadership Skills
He naturally gravitates toward a lead role, showing awareness of team ceremonies and technical decision-making. While he has the technical authority to lead, he provided less evidence regarding active mentorship of junior engineers. He is more of a "Lead by Example" and "Lead by Architecture" type of senior.

## 4. Technical Strengths
- **JVM & Memory:** Outstanding (4/4). Deep knowledge of the JMM, thread behavior, and garbage collection.
- **Resilience:** Excellent understanding of exception handling and how it impacts data integrity and client experience.
- **Production Experience:** High-signal experience with event-driven systems, Kafka (built from scratch), and Docker.
- **Persistence:** Strong Hibernate and SQL knowledge, capable of optimizing data access layers effectively.

## 5. Areas for Improvement
- **Concurrency Primitives:** While he understands JMM and synchronization, he lacks practical usage of Atomic classes (scoring 2).
- **Mentorship:** Could benefit from a more structured approach to developing the engineers around him.
- **Architectural Storytelling:** Improving the way he "walks through" a system would be beneficial.

## 6. Feedback Notes / Side Notes
The strongest signal was his description of a production migration to an event-driven model. Managing millions of requests and anticipating (or solving) duplicate record issues shows a level of "battle-tested" maturity.

## 7. Recommendation
**Overall Rating: 8.5/10** - Recommendation to move forward. Dardo is a very strong Senior Java Developer who leans into Lead territory.`
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
    rawNotes: `# Candidate Profile
Senior Java Developer with significant experience in distributed systems, event-driven architectures, and production observability.

# Interviews:

## Recruitment, first contact:

### Profile:
- +15 years of experience in backend programming
- **Spring Boot:** 10 years
- **AWS:** +8 years (ECS, Lambdas, CloudWatch, EKS, DynamoDB, SQS, SNS)
- **Kubernetes/Docker:** 5 years
- **Monitoring:** Datadog, Splunk, Dynatrace
- **Databases:** Postgres, MySQL, Oracle, DynamoDB, MongoDB
- **Leadership:** 5 years leading teams of 4-5 people.

## Experience:
- Luxoft (+9 years).
- Notification platform for emails/CMS/push. 
- Migration to event-driven: reduced response times from 500ms to 50-60ms.

# Technical Assessment

## General Notes
Ruben has a clear goal: develop the best applications. Focus on event-driven development with Kafka. Outstanding theoretical knowledge.

## Technical Interview Scores:
- **Agile/Scrum:** 3
- **English Level:** 2
- **Daily Routine:** 3
- **Tools/Tech Reliance:** 4
- **Difficult Challenge:** 3
- **AI Usage:** 2
- **Production Debugging:** 3
- **JVM/Memory:** 4
- **Exceptions:** 4
- **JPA/Hibernate:** 4
- **Git/CI/CD:** 3`,
    feedback: `## 1. Attitude
Ruben demonstrates the high-level ownership typical of a veteran engineer with 16+ years of experience. He is focused on "developing the best applications" and bringing optimal solutions to the client. He showed strong accountability when describing migrations to event-driven architectures and expressed a clear passion for technical excellence and performance optimization.

## 2. Communication
While his English is calibrated at an intermediate level, Ruben compensates with technical precision and a clear focus on the "what" and "how" of engineering. He can explain both the business value and the technical implementation, though he occasionally needs a nudge to dive into the specific communication patterns between microservices. His technical explanations are structured and authoritative.

## 3. Leadership Skills
With 5 years of experience leading teams of 4–5 people, Ruben carries the weight of a Lead Engineer. He is well-versed in Agile ceremonies (Scrum/Kanban) and acts as a technical reference point. Although the interview notes were light on specific daily mentoring routines, his track record of leading zero-downtime releases and scaling systems suggests a mature leadership style rooted in technical execution.

## 4. Technical Strengths
- **JVM & Memory:** Excellent grasp of JVM internals, JMM, threads, and Garbage Collection. He reasons from a runtime perspective.
- **Event-Driven Architecture:** Very strong signal. Experience scaling notification systems to millions of events per day using Kafka and AWS.
- **AWS & Infrastructure:** 8+ years of AWS experience (ECS, EKS, Lambda, DynamoDB) and 5 years of Kubernetes/Docker.
- **Persistence:** Outstanding knowledge of JPA/Hibernate and SQL optimization.
- **Legacy Migrations:** Direct experience with Dropwizard and migrating systems for performance gains (e.g., 500ms to 50ms).

## 5. Areas for Improvement
- **English Fluency:** Currently at an intermediate level; while functional for technical work, he may require more effort in high-stakes architectural negotiations.
- **Advanced Concurrency:** Minor calibration point in regular use of Atomic classes.
- **AI Tooling:** He uses Amazon Q and Codex but has not yet used Claude. Adaptability is high.

## 6. Feedback Notes / Side Notes
Ruben is a "battle-tested" engineer. The most impressive signal was his description of migrating a notification platform to an event-driven model to achieve a 10x performance improvement. His ability to handle millions of requests and reason about data consistency issues is exactly what is needed for high-scale e-commerce/billing platforms.

## 7. Recommendation
**Overall Rating: 9/10** - Strong recommendation to move forward. Ruben is a highly calibrated Lead/Senior Engineer with deep technical depth and significant AWS/Kafka experience.`
  }
];
