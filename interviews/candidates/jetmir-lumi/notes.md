---
candidate_name: Jetmir Lumi
interview_date: 2026-06-25
interviewer: Federico
role: Senior Java Developer
job_id: senior-java-developer
status: Technical Interview Completed
---

# Candidate Profile
Senior Java/Kotlin Backend Engineer with 8+ years of experience  
designing, building, and maintaining scalable distributed systems.  
Demonstrated expertise in Spring Boot, microservices architecture,  
Kubernetes, and cloud-native development, with hands-on  
experience across Google Cloud Platform (recently focused on GKE)  
and AWS. Proven ability to drive system scalability, performance  
optimization, security, and cost efficiency, including successful  
monolith-to-microservices migrations, enhanced application security  
via mobile integrity verification (Apple App Attest, Android Play  
Integrity), and reliable operation of high-traffic systems serving  
50,000+ users.

# HR Context
Role shape / Leadership: Worked in small backend teams (5–8 people) and held an informal lead position — helped team members technically and was involved in setting up backend architecture for whole projects. This maps onto the role's mentorship expectation, though it's informal technical lead rather than a titled one.

Java & Stack: Core is Java + Spring Boot + Kotlin — Java 17, and Java 21 for the last six months. Architecture pattern (important context): His system was primarily a middleware/integration layer — connecting to airline PSS/GDS systems (Navitaire, etc.), processing data, and exposing APIs to mobile apps. . The caveat is it's middleware integration rather than building a core platform from the ground up.

Cloud / Kubernetes: strong fit. Production experience with GCP + Kubernetes, including autoscaling to handle traffic spikes, GitHub repos, and automated CI/CD pipelines deploying to GCP/K8s.

API & Integration:  built APIs for mobile clients and integrated with multiple external airline systems; API Gateway experience. On REST .

Messaging: He used GCP Pub/Sub for inter-service communication,  explained clearly that company policy was to use Google-native services.

Databases:  Used SQL/MySQL (primary), some MongoDB, and in-memory/Redis-style caching to hold booking-flow state before PNR generation. He was candid that the team wasn't heavily database-focused because the backend was a middleware layer. So: Postgres not named (MySQL instead), Mongo light, Redis-style yes. Query-optimization and data-modeling depth not established — and the role explicitly wants Valkey/MongoDB/Postgres with optimization.

Performance / Multithreading: Reasonable and somewhat concrete. Handled high traffic (~1,000 req/min peak), used Java multithreading plus Kubernetes autoscaling, and dealt with bot/scraping traffic. Framed more at the scaling/infra level than deep JVM concurrency, so memory-management and tuning depth needs probing.

Monitoring & Observability: Used Instana (plus IBM/Google monitoring); Grafana only on small projects a few years ago..

Testing: A positive signal. Team enforced a 90% coverage rule gated in the deploy pipeline.



# Technical Assessment

## General Notes
I don't really know what to say. He seems experienced hands-on developer with great ownership. Responded very well architectural-wise, however at the time of digging into java questions and spring, he didn't know very well how to respond. Seemed nervous and when responding he derailed from the question to talk about other topics that were related but not asked. Maybe there was a misunderstanding but still, I think he should strong some concepts before jumping to a client interview. 

## Scoring (0-4)
- **Agile/Process:** 2
- **English Level:** 3
- **AI/Workflow:** 2
- **System Walkthrough:** 3
- **familiarity with prod issues observabili:** 3
- **distributed systems with kubernetes and:** 3
- **What is checked and unckecked exceptions:** 2
- **Design patterns (describe at least one):** 3
- **Memory Organization:** 0
- **Unit and integration tests:** 3
- **What is the main goal and benefit of usi:** 3
- **What are the ways to inject dependency y:** 2
- **JPA and Hibernate:** 2
- **Security:** 3
- **workflows:** 3
- **Difference between merge and rebase:** 1
- **Experience with Pull Request / Code Revi:** 3
- **Which [data] consistency models do you k:** 0
- **What types of JOINS do you know? What is:** 2
- **What are indexes? Which kind of indexes:** 2

### Technical Comments
- **What is the role you like to play on you:** He is a little bit rusty. First interview after 8 years. He was nervous from the first question and his answers depicted unstructured responses and when he didn't know something it seems like he was googling.
- **What is checked and unckecked exceptions:** spring usage of controller advice and good explanation of
- **Can you give real examples from an autom:** he is not actively working with java so he couldn't talk about this nor memory
- **Design patterns (describe at least one):** well explain overall. Mentioned some patterns but I can tell he was nervous and the respond was a bit uncler. Although he managed to respond
- **What new/different Spring Boot brings us:** he didn't mention extrictly why he uses spring boot, instead he refered to artifacts and frameworks, how he uses.
- **JPA and Hibernate:** he didn't know n+1. Also mentioned that when a query starts to grow they do native queries.
- **workflows:** use of tags and basic git workflow branching
- **Experience with Pull Request / Code Revi:** copilot. Good awareness of code reviews
- **Explain:** he said that to see performance in db uses google
- **Agile/Scrum:** 3
- **English Level:** 3
- **Java (JVM/Memory):** 3
- **Spring/Boot:** 3
- **SQL/Database:** 3