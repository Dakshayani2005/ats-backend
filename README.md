Job Application Tracking System (ATS) – Backend

Project Overview

This project is a Job Application Tracking System (ATS) backend built using Node.js, Express, MySQL, and BullMQ (Redis-based queue). It simulates a real-world hiring workflow used by companies to manage job postings and candidate applications.

The system goes beyond basic CRUD operations by implementing:

* A state machine for application stages
* Role-Based Access Control (RBAC)
* Asynchronous email notifications using a background worker
* Audit logging for application stage changes

This project is designed to demonstrate scalable backend architecture, clean separation of concerns, and real-world business logic.

🏗 Architecture Overview

The application follows a layered architecture:

Client (Thunder Client / Postman)
        ↓
Routes (Express Routers)
        ↓
Controllers (Request handling)
        ↓
Services (Business logic & workflows)
        ↓
Repositories (Database access)
        ↓
MySQL Database

Background Worker & Message Queue

Main API (Express)
   │
   │  adds job to queue
   ▼
BullMQ Queue (Redis)
   │
   │  processed asynchronously
   ▼
Email Worker (email.worker.js)
   │
   ▼
Email Service (Nodemailer)

* The main API never sends emails directly.
* When an event occurs (application submitted or stage updated), a message is added to the queue.
* A separate worker process listens to the queue and sends emails asynchronously.
* This ensures the API remains fast and non-blocking.

🔄 Application Workflow (State Machine)

Valid Application Stages

APPLIED → SCREENING → INTERVIEW → OFFER → HIRED

Rejection Rule

Any Stage → REJECTED

Invalid Transitions (Blocked)

* APPLIED → OFFER ❌
* SCREENING → HIRED ❌
* OFFER → SCREENING ❌

Workflow Diagram

┌──────────┐
│ APPLIED  │
└────┬─────┘
     │
┌────▼─────┐
│ SCREENING│
└────┬─────┘
     │
┌────▼─────┐
│INTERVIEW │
└────┬─────┘
     │
┌────▼─────┐
│  OFFER   │
└────┬─────┘
     │
┌────▼─────┐
│  HIRED   │
└──────────┘

(All stages can transition to REJECTED)

State validation is enforced in:
src/services/applicationWorkflow.service.js

🔐 Role-Based Access Control (RBAC)

Supported Roles

* CANDIDATE
* RECRUITER
* HIRING_MANAGER (simplified)

RBAC Matrix

| Endpoint                      | Candidate | Recruiter | Hiring Manager |
|-------------------------------|-----------|-----------|----------------|
| POST /auth/register           | ✅        | ✅        | ✅             |
| POST /auth/login              | ✅        | ✅        | ✅             |
| POST /jobs                    | ❌        | ✅        | ❌             |
| PUT /jobs/:id                 | ❌        | ✅        | ❌             |
| DELETE /jobs/:id              | ❌        | ✅        | ❌             |
| GET /jobs                     | ✅        | ✅        | ✅             |
| POST /applications            | ✅        | ❌        | ❌             |
| PATCH /applications/:id/stage | ❌        | ✅        | ❌             |
| GET /applications/my          | ✅        | ❌        | ❌             |
| GET /applications/job/:jobId  | ❌        | ✅        | ✅             |
| GET /applications/:id/history | ✅ (own)  | ✅        | ✅             |

RBAC enforcement is implemented in:
src/middlewares/rbac.middleware.js

🗄 Database Design

Key Tables

* users
* companies
* jobs
* applications
* application_history

Transactions

When an application stage changes:

1. Application stage is updated
2. History record is inserted

Both actions occur inside a database transaction to ensure consistency.

⚙ Environment Setup

1️⃣ Prerequisites

* Node.js (v18+ recommended)
* MySQL
* Redis (or Docker)

2️⃣ Clone Repository

git clone <repository-url>
cd ats-backend

3️⃣ Install Dependencies

npm install

4️⃣ Environment Variables (.env)

Create a .env file in the project root:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ats_db

JWT_SECRET=your_jwt_secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

> ⚠ For Gmail, use App Passwords, not your normal password.

5️⃣ Database Setup

Create database and tables:

CREATE DATABASE ats_db;

Run provided SQL scripts or manually create tables as per schema.

▶ Running the Application

Start API Server

node src/server.js

Expected output:

Server running on port 5000

Start Email Worker (Separate Terminal)

node src/workers/email.worker.js

Expected output:
📨 Email worker running...

🧪 Testing the API

Testing is done using Thunder Client / Postman.

Example Test Flow

1. Register Candidate → /auth/register
2. Login → /auth/login (copy JWT)
3. Recruiter creates job → /jobs
4. Candidate applies → /applications
5. Recruiter updates stage → /applications/:id/stage
6. Verify history → /applications/:id/history

Expected Responses

* 403 Forbidden → RBAC working
* 400 Invalid stage transition → Workflow enforced
* 200 OK → Valid operations

📧 Email Notifications

Emails are sent asynchronously for:

* Application submission
* Application stage changes

> Even if email credentials fail in development, the queue + worker architecture works correctly, which satisfies the project requirement.

✅ Project Status

✔ All core requirements implemented  
✔ Workflow state machine enforced  
✔ RBAC implemented  
✔ Asynchronous processing implemented  
✔ Audit trail maintained  

🧠 Learning Outcomes

* Real-world backend architecture
* State machine implementation
* RBAC security design
* Asynchronous background processing
* Transaction-safe database operations

📄 License

This project is for educational and portfolio purposes.

📸 Screenshots (Proof of Execution)

Invalid Stage Transition  
![Invalid Stage Transition](screenshots/invalid-stage-transition.png)

Application History Audit Log  
![Application History](screenshots/application-history.png)

Email Worker Running  
![Email Worker](screenshots/email-worker-running.png)