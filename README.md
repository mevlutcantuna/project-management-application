# Project Management Application

A modern, full-stack project management application inspired by Linear, designed to streamline team collaboration and issue tracking with powerful, intuitive features.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v22+ (recommended v22+)
- **Docker**: For containerized development
- **PostgreSQL**: For database v17+

### Get Started in 30 seconds

```bash
# Clone and navigate to project
git clone https://github.com/mevlutcantuna/project-management-application
cd project-management-application

# Start both client and server with Docker
yarn docker:up

# View logs
yarn docker:logs

# Stop services
yarn docker:down
```

### Development URLs

- **Client**: http://localhost:3000
- **Server**: http://localhost:8000

## 📁 Project Structure

```
project-management-application/
├── client/              # React Frontend Application
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── server/              # Node.js Backend API
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml   # Container orchestration
└── package.json         # Root package configuration
```

## 🛠️ Tech Stack Overview

### Frontend

Modern React application with TypeScript, TanStack Query, Zustand, and Shadcn UI components.

**[📖 Detailed Client Documentation →](client/README.md)**

### Backend

Robust Node.js API with Express.js, PostgreSQL, and comprehensive authentication.

**[📖 Detailed Server Documentation →](server/README.md)**

## Project Details

### Authentication

- When a user logs in, they will either **create a workspace** or **request to join one**.
- If they create one, it will be associated with them.
- Every user must belong to **at least one workspace**.
- **Roles**
  - **Workspace Owner**:
    Can view and manage join requests, approve or reject them, and has full permissions.
  - **User**:
    Can create, delete, and view projects, and leave teams.
    However, they **cannot delete a team** or **remove other users**.

### DB Diagram

![DB Diagram](https://github.com/mevlutcantuna/project-management-application/blob/main/server/screenshots/db-diagram.png?raw=true)
