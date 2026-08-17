\# SkillProof



> Evidence-backed skill and opportunity matching platform



SkillProof is a full-stack platform designed to connect students with relevant opportunities using structured skills, verifiable evidence, applications, and recruiter-side candidate evaluation.



The platform provides separate workflows for students and recruiters, with authentication, protected routes, evidence management, opportunity discovery, applications, notifications, and an explainable skill-proof experience.



\---



\## 🚀 Key Features



\### 👨‍🎓 Student



\- Secure authentication

\- Student profile and skill management

\- Add and manage skills

\- Add evidence supporting skills

\- Skill Passport

\- Evidence Vault

\- Proof Graph

\- Browse opportunities

\- View opportunity details

\- Apply to opportunities

\- Track applications

\- View application details

\- Receive notifications



\### 🧑‍💼 Recruiter



\- Secure recruiter authentication

\- Recruiter dashboard

\- Create and manage opportunities

\- View published opportunities

\- Discover candidates

\- View candidate details

\- Review candidate skills and evidence

\- Evaluate applicants



\### 🔐 Security \& Reliability



\- Authentication and protected routes

\- Role-based student/recruiter access

\- JWT-based authentication flow

\- Session restoration

\- API error handling

\- Loading states

\- Empty states

\- Retry states

\- Responsive interface



\---



\## 🧠 Core Idea



Traditional opportunity platforms often rely heavily on resumes and self-reported skills.



SkillProof focuses on connecting:



```text

Student

&#x20;  ↓

Skills

&#x20;  ↓

Supporting Evidence

&#x20;  ↓

Skill Proof

&#x20;  ↓

Relevant Opportunities

&#x20;  ↓

Applications

&#x20;  ↓

Recruiter Evaluation

```



The goal is to make a student's skills easier to understand and evaluate through supporting evidence rather than relying only on claims.



\---



\## 🏗️ Architecture



SkillProof follows a client-server architecture:



```text

┌───────────────────────────────┐

│          React Frontend       │

│                               │

│  Student UI                   │

│  Recruiter UI                 │

│  Auth Context                 │

│  Protected Routes             │

│  API Services                 │

└───────────────┬───────────────┘

&#x20;               │

&#x20;               │ HTTP / REST API

&#x20;               ▼

┌───────────────────────────────┐

│          Django Backend       │

│                               │

│  Accounts                     │

│  Profiles                     │

│  Skills                       │

│  Evidence                     │

│  Opportunities                │

│  Notifications               │

└───────────────┬───────────────┘

&#x20;               │

&#x20;               ▼

┌───────────────────────────────┐

│          Database             │

│                               │

│       SQLite / Django ORM     │

└───────────────────────────────┘

```



\---



\## 🛠️ Tech Stack



\### Frontend



\- React

\- Vite

\- JavaScript / JSX

\- React Router

\- CSS



\### Backend



\- Python

\- Django

\- Django REST Framework

\- Django ORM



\### Database



\- SQLite for local development



\### Development Tools



\- Git

\- GitHub

\- VS Code

\- PowerShell



\---



\## 📁 Project Structure



```text

SkillProof/

│

├── backend/

│   ├── accounts/

│   ├── config/

│   ├── evidence/

│   ├── notifications/

│   ├── opportunities/

│   ├── profiles/

│   ├── skills/

│   └── manage.py

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── assets/

│   │   ├── components/

│   │   ├── context/

│   │   ├── pages/

│   │   └── services/

│   ├── package.json

│   └── vite.config.js

│

├── .gitignore

└── README.md

```



The backend contains separate Django applications for accounts, evidence, notifications, opportunities, profiles, and skills. :contentReference\[oaicite:2]{index=2}



The frontend separates reusable components, authentication context, pages, and API service modules. :contentReference\[oaicite:3]{index=3}



\---



\## 🎓 Student Workflow



```text

Register / Login

&#x20;      ↓

Student Dashboard

&#x20;      ↓

Build Profile

&#x20;      ↓

Add Skills

&#x20;      ↓

Add Supporting Evidence

&#x20;      ↓

View Skill Passport

&#x20;      ↓

Explore Opportunities

&#x20;      ↓

View Opportunity

&#x20;      ↓

Apply

&#x20;      ↓

Track Application

&#x20;      ↓

Receive Notifications

```



\---



\## 💼 Recruiter Workflow



```text

Recruiter Login

&#x20;      ↓

Recruiter Dashboard

&#x20;      ↓

Create Opportunity

&#x20;      ↓

Publish Opportunity

&#x20;      ↓

View Candidates

&#x20;      ↓

Open Candidate Profile

&#x20;      ↓

Review Skills \& Evidence

&#x20;      ↓

Evaluate Candidate

```



\---



\## 🔎 Skill \& Evidence Model



SkillProof separates a student's declared skill from the evidence supporting that skill.



```text

Skill

&#x20; │

&#x20; ├── Student

&#x20; │

&#x20; └── Evidence

&#x20;        │

&#x20;        ├── Verification information

&#x20;        └── Supporting details

```



This allows the platform to present a more structured representation of a student's capabilities.



\---



\## 📊 Proof Graph



The Proof Graph provides a visual representation of the relationship between a student's skills and their supporting proof.



```text

&#x20;                ┌──────────────┐

&#x20;                │    Student   │

&#x20;                └──────┬───────┘

&#x20;                       │

&#x20;             ┌─────────┴─────────┐

&#x20;             ▼                   ▼

&#x20;       ┌───────────┐       ┌───────────┐

&#x20;       │   Skill   │       │   Skill   │

&#x20;       └─────┬─────┘       └─────┬─────┘

&#x20;             │                   │

&#x20;             ▼                   ▼

&#x20;       ┌───────────┐       ┌───────────┐

&#x20;       │ Evidence  │       │ Evidence  │

&#x20;       └───────────┘       └───────────┘

```



\---



\## 🔔 Notifications



The platform includes notification functionality for communicating important application and platform events to users.



\---



\## ⚡ Reliability



The frontend includes a reusable asynchronous state component for handling API-driven UI states.



Supported states include:



```text

Loading

&#x20;  ↓

Success

&#x20;  ↓

Empty

&#x20;  ↓

Error

&#x20;  ↓

Retry

```



This prevents API failures from resulting in blank or broken pages.



\---



\## 📱 Responsive Design



The interface has been tested across:



\- Mobile

\- Tablet

\- Desktop



The major student and recruiter workflows were checked for responsive layout behavior.



\---



\## 🔐 Security



SkillProof includes:



\- Authenticated user sessions

\- Protected frontend routes

\- Role-aware access

\- Authentication context

\- JWT authentication flow

\- Logout/session handling



Authentication and authorization were tested across both student and recruiter workflows.



\---



\## 🧪 Testing \& QA



The project has been manually tested across the major application flows.



\### Functional Testing



\- Student end-to-end workflow

\- Recruiter end-to-end workflow

\- Authentication

\- Authorization

\- Opportunity creation

\- Opportunity discovery

\- Applications

\- Evidence management

\- Notifications



\### Reliability Testing



\- API failure handling

\- Loading states

\- Empty states

\- Retry behavior

\- Backend recovery



\### UI Testing



\- Mobile

\- Tablet

\- Desktop

\- Responsive layouts



\---



\## ⚙️ Local Setup



\### 1. Clone the repository



```bash

git clone https://github.com/dibyaranjansahu6819-prog/SkillProof.git

cd SkillProof

```



\---



\### 2. Backend Setup



Create and activate a virtual environment.



\#### Windows



```powershell

python -m venv venv

.\\venv\\Scripts\\Activate.ps1

```



Go to the backend:



```powershell

cd backend

```



Install dependencies according to the project's backend dependency configuration.



Run migrations:



```powershell

python manage.py migrate

```



Start Django:



```powershell

python manage.py runserver

```



The backend will normally be available at:



```text

http://127.0.0.1:8000/

```



\---



\### 3. Frontend Setup



Open another terminal.



```powershell

cd frontend

```



Install dependencies:



```powershell

npm install

```



Start the development server:



```powershell

npm run dev

```



\---



\## 🗂️ Backend Applications



| Application | Responsibility |

|---|---|

| `accounts` | Authentication and user accounts |

| `profiles` | User/student profile information |

| `skills` | Skills and student skill management |

| `evidence` | Supporting skill evidence |

| `opportunities` | Opportunities, recruiters and applications |

| `notifications` | User notifications |



The repository currently contains these Django applications and their corresponding models, serializers, views, URLs, and migrations. :contentReference\[oaicite:4]{index=4}



\---



\## 🎨 Frontend Organization



\### Components



```text

AddEvidenceForm

AddSkillForm

AsyncState

NotificationBell

ProtectedRoute

```



\### Context



```text

AuthContext

```



\### Pages



```text

Student

├── Dashboard

├── Evidence

├── Passport

├── ProofGraph

├── Opportunities

├── OpportunityDetail

├── MyApplications

└── StudentApplicationDetail



Recruiter

├── RecruiterDashboard

├── RecruiterOpportunities

├── CreateOpportunity

├── RecruiterCandidates

└── RecruiterCandidateDetail

```



\### Services



```text

apiService

authService

dashboardService

evidenceService

notificationService

opportunityService

profileService

recruiterService

skillService

```



These page, component, context, and service modules are present in the current frontend structure. :contentReference\[oaicite:5]{index=5}



\---



\## 🔮 Future Scope



Potential future improvements include:



\- Production database deployment

\- Cloud deployment

\- Advanced candidate matching

\- Automated evidence verification

\- Analytics dashboards

\- Recruiter hiring insights

\- More advanced skill recommendations

\- Email notifications

\- Additional authentication providers

\- Improved observability and monitoring



\---



\## 📌 Project Status



```text

Core Development       ✅

Student Flow            ✅

Recruiter Flow          ✅

Authentication          ✅

Authorization           ✅

API Error Handling      ✅

Responsive Testing      ✅

Production Build        ✅

GitHub Repository       ✅

```



\---



\## 👨‍💻 Author



\*\*Dibyaranjan Sahu\*\*



GitHub:



https://github.com/dibyaranjansahu6819-prog



\---



\## ⭐ Project



If you find SkillProof interesting, consider giving the repository a star.



Built as a full-stack project focused on evidence-backed skills, opportunity discovery, and transparent candidate evaluation.

