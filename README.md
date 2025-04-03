# Ticket Management System

## Overview
The **Real-Time-Customer-Support-System** is designed to streamline customer support by efficiently handling support tickets, tracking their status, and ensuring timely resolutions. 

Users must **register** and authenticate using **JWT**. Role-based access control (RBAC) ensures that each user can only perform actions allowed by their role.

## User Roles & Permissions

### 1. **Customer**
- Register by providing necessary details.
- Raise new support tickets for issues.
- Track the status of submitted tickets.
- Receive real-time updates and notifications through email.

### 2. **Support Agent**
- View and assign tickets.
- Respond to customer queries and resolve issues.
- Update ticket statuses (In Progress, Resolved, Escalated, etc.).

### 3. **Manager**
- Monitor all tickets and ensure timely resolution.
- Assign or reassign tickets to agents.
- Set priorities and escalation rules for unresolved tickets.
- Generate reports on ticket resolution performance.
- Manage user roles and permissions.

## Authentication & Authorization
- **JWT Authentication**: Every user is authenticated using JSON Web Tokens (JWT) to ensure secure access.  
- **Role-Based Access Control (RBAC)**:  
  - **Customers** have limited access (only their tickets).  
  - **Support Agents** can manage tickets but have restricted administrative privileges.  
  - **Managers** have full control, including user management and ticket escalation.  
- Unauthorized users **cannot access restricted operations**.

## Features
- **User Registration & Authentication** – Secure sign-up and login with JWT.
- **Role-Based Access** – Prevents unauthorized access to restricted actions.
- **Ticket Creation & Tracking** – Customers can submit and monitor tickets.
- **Agent Assignment** – Support agents can view and manage tickets efficiently.
- **Status Updates & Notifications** – Users receive updates on ticket progress.
- **Escalation & Reporting** – Managers can reassign tickets and analyze performance.

## Installation
1. Clone the repository:  
   ```sh
   git clone <repo-url>

2. Install dependencies:
    npm install

3. Set up environment variables (.env file):

   JWT_SECRET=<your_secret_key>
   DATABASE_URL=<your_database_connection_string>
   PORT=<>
   USER_ACCESS_KEY= <Third_party_email_service_user_access_key>
   USER_PASSWORD= <Third_party_email_service_user_password>
