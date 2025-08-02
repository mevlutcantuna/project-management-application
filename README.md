# Project Management Application

A modern, full-stack project management application inspired by Linear, designed to streamline team collaboration and issue tracking with powerful, intuitive features.

## Development

### Prerequisites

- **Node.js**: v22+ (recommended v22+)
- **Yarn**: Package manager
- **Docker**: For containerized development
- **PostgreSQL**: For database

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
# Database Configuration
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=

# Server Configuration
PORT=
```

### Development URLs

- **Client**: http://localhost:3000
- **Server**: http://localhost:8000

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

## Project Details

- Authentication
  - When a user logs in, they will either **create a workspace** or **request to join one**.
  - If they create one, it will be associated with them.
  - Every user must belong to **at least one workspace**.
  - **Roles**
    - **Workspace Owner**:
      Can view and manage join requests, approve or reject them, and has full permissions.
    - **User**:
      Can create, delete, and view projects, and leave teams.
      However, they **cannot delete a team** or **remove other users**.
- **Within a Workspace**
  - **Projects**
    - Title
    - Description
    - Assignees
    - Priority
    - Labels
    - Teams
    - Lead (a user responsible for the project)
    - Dates
      - Start Date
      - End Date
  - **Teams**
    - **Issues**
      - Status
      - Title
      - Description (Rich Text)
      - Priority
      - Assignee
      - Project
      - Tag
      - Due Date
      - Sub-Issues
  - **Members**
    - **User**
      - Full Name
      - Username
      - Email
      - Profile Picture
