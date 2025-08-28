# Client - Project Management Application

A modern React frontend for the project management application, built with TypeScript and featuring a beautiful, intuitive interface inspired by Linear.

## 🛠️ Tech Stack

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
| **Docker**                | Containerization for consistent deployment                    |

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v22+ (recommended v22+)
- **Yarn**: Package manager

### Development

```bash
# Navigate to client directory
cd client

# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Build for production
yarn build

# Preview production build
yarn preview
```

### Docker Development

```bash
# From project root - start both client and server
yarn docker:up

# View client logs specifically
docker-compose logs client

# Stop services
yarn docker:down
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # Shadcn UI components
│   ├── features/           # Feature-based modules
│   ├── pages/              # Page components
│   ├── shared/             # Shared utilities and components
│   │   ├── components/     # Shared components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── routes/         # Routing configuration
│   │   └── types/          # TypeScript type definitions
│   └── mocks/              # MSW mock data and handlers
├── public/                 # Static assets
├── Dockerfile             # Docker configuration
└── package.json           # Dependencies and scripts
```

## 🧪 Testing

The client uses Vitest and React Testing Library for testing:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## 🎨 UI Components

Built with Shadcn UI and TailwindCSS for a modern, consistent design system:

- Form components with validation
- Data tables with sorting and filtering
- Loading states and error boundaries
- Responsive design patterns

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the client directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Other environment-specific variables
```

### Development URLs

- **Development Server**: http://localhost:3000
- **API Server**: http://localhost:8000

## 🐳 Docker

The client includes Docker configuration for containerized development:

```dockerfile
# Multi-stage build for optimized production image
FROM node:22-alpine AS builder
# ... build steps


```

## 📦 Build & Deployment

```bash
# Production build
yarn build

# Analyze bundle size
yarn build --analyze

# Preview production build locally
yarn preview
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔗 Related

- [Server Documentation](../server/README.md)
- [Main Project README](../README.md)
