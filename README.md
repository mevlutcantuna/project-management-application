# Project Management Application

A modern, full-stack project management application inspired by Linear, designed to streamline team collaboration and issue tracking with powerful, intuitive features.

## Development

### Prerequisites

- **Node.js**: v24+ (recommended v24+)
- **Yarn**: Package manager
- **Docker**: For containerized development
- **PostgreSQL**: For database (or use Docker) (will be implemented)

### Quick Start

```bash
# Clone and navigate to project
git clone <repository-url>
cd project-management-application

# Start both client and server
yarn docker:up

# View logs
yarn docker:logs

# Stop services
yarn docker:down
```

### Environment Setup

**Server** (`server/.env`):

```env
PORT=8000
```

**Client** (`client/.env`):

```env

```

### Development URLs

- **Client**: http://localhost:3000
- **Server**: http://localhost:8000
- **API Health**: http://localhost:8000/

### Project Structure

```
project-management-application/
├── client/          # Frontend frontend
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── server/          # Backed backend
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── package.json
```

## Project Details

### 1. **Authorization**

- **Role-Based Authentication**: Secure user management with different permission levels
- **Access Control**: Users can only perform actions they have permissions for

### 2. **Issues**

- **Full CRUD Operations**: Users can create, read, update, and delete issues (with proper permissions)
- **Hierarchical Structure**: Support for sub-issues and nested organization
- **Comprehensive Metadata**:
  - **Tags & Labels**: Categorization and organization
  - **Priority Levels**: Critical, High, Medium, Low priority assignments
  - **Assignees**: User assignment and responsibility tracking
  - **Comments**: Team collaboration and discussion threads
  - **History**: Complete audit trail of all changes
  - **Due Dates**: Timeline management and deadline tracking
  - **Status Workflow**: Backlog → In Progress → In Review → Done
  - **Custom Statuses**: Flexible workflow (Completed, Deployed to Production, etc.)
  - **Rich Text Editor**: Comprehensive description formatting

### 3. **Teams**

- **Team Management**: Create, update, and delete teams
- **Issue Scope**: All issues are created within team contexts
- **Data Integrity**: Team deletion permanently removes all associated issues
- **Future Features**:
  - Project organization within teams
  - Sprint/cycle management

## 🛠️ Frontend Tech Stack

| Technology                | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| **Vite**                  | Fast build tool and development server                        |
| **React**                 | Modern UI library for component-based development             |
| **TypeScript**            | Type-safe JavaScript for better development experience        |
| **TanStack Query**        | Powerful data fetching and server state management            |
| **Zustand**               | Lightweight, scalable state management for React              |
| **Shadcn UI**             | Beautiful, customizable component library with custom theming |
| **TailwindCSS**           | Utility-first CSS framework for rapid styling                 |
| **TanStack Table**        | Feature-rich data table components                            |
| **Axios**                 | HTTP client with request/response interceptors                |
| **Vitest**                | Fast unit testing framework                                   |
| **Mock Service Worker**   | API mocking for development and testing                       |
| **React Testing Library** | Simple and complete testing utilities                         |
| **tweakcn**               | Multiple theme support and customization                      |
| **Docker**                | Containerization for consistent deployment                    |

## ⚙️ Backend Tech Stack

| Technology     | Purpose                                        |
| -------------- | ---------------------------------------------- |
| **Node.js**    | JavaScript runtime for server-side development |
| **TypeScript** | Type-safe server-side JavaScript               |
| **Express.js** | Fast, minimalist web framework                 |
| **PostgreSQL** | Robust relational database                     |
| **Jest**       | Comprehensive testing framework                |
| **AWS S3**     | Cloud storage for images and file uploads      |
| **Docker**     | Containerization and deployment                |
