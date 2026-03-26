# Copilot Demo — .NET Aspire Distributed Application

A modern full-stack distributed application demonstrating best practices for building cloud-native microservices using **.NET Aspire**, **vertical slice architecture**, **ASP.NET Core Minimal APIs**, and **React with TypeScript**.

> **Powered by [Aspire](https://aspire.dev/)** — Your stack, streamlined. Free, open-source, and agent-ready orchestration for building distributed applications with built-in observability.

## 📋 Overview

This project showcases a complete distributed application stack featuring:

- **API Service** — RESTful API with CRUD operations for product management
- **Web Frontend** — React 19 + TypeScript SPA with TanStack Query and shadcn/ui
- **SQL Server** — Containerized database provisioned via Aspire
- **Observability** — Built-in telemetry, health checks, and distributed tracing
- **Interactive API Documentation** — Scalar UI for OpenAPI exploration
- **GitHub Copilot Integration** — Custom instructions for AI-assisted development with consistent patterns

## 🚀 Tech Stack

### Backend

| Component | Technology | Version |
|---|---|---|
| **Framework** | .NET | 10.0 |
| **Orchestration** | .NET Aspire | Latest |
| **API** | ASP.NET Core Minimal API | 10.0 |
| **Database** | SQL Server | 2022 (Linux container) |
| **ORM** | Entity Framework Core | 10.0 |
| **API Docs** | Scalar | Latest |
| **Language** | C# | 13 |

### Frontend

| Component | Technology | Version |
|---|---|---|
| **Framework** | React | 19.2 |
| **Language** | TypeScript | 5.9 |
| **Build Tool** | Vite | 8.x |
| **State Management** | TanStack Query | 5.x |
| **Forms** | React Hook Form + Zod | 7.x + 4.x |
| **Routing** | React Router | 7.x |
| **Styling** | Tailwind CSS | 4.x |
| **UI Components** | shadcn/ui (Radix UI) | Latest |
| **Notifications** | Sonner | Latest |

### Key NuGet Packages

- `Aspire.Hosting.SqlServer` — SQL Server container orchestration
- `Aspire.Microsoft.EntityFrameworkCore.SqlServer` — EF Core integration
- `Scalar.AspNetCore` — OpenAPI/Swagger alternative
- `Microsoft.EntityFrameworkCore.Design` — Migration tooling

## ⚡ Why Aspire?

[.NET Aspire](https://aspire.dev/) is a **free, open-source** framework designed to make building distributed applications easier:

✅ **Code-centric orchestration** — Define your entire stack in type-safe C# code  
✅ **Local-first, production-ready** — Mirror production environments on your machine  
✅ **Observability from the start** — Built-in OpenTelemetry with zero configuration  
✅ **Agent-ready** — Optimized for AI coding agents (GitHub Copilot, Claude, etc.)  
✅ **Flexible deployments** — Deploy to Kubernetes, Azure, AWS, or on-premises  
✅ **Multi-language support** — Orchestrate C#, Python, Node.js, Go, Java apps together

**In this demo**, Aspire handles:

- 🗄️ SQL Server container provisioning and lifecycle management
- 🔗 Service-to-service communication and discovery (API ↔ React frontend)
- ⚛️ React Vite dev server orchestration with environment variable injection
- 📊 Telemetry collection and visualization via the Aspire Dashboard
- ⚕️ Health checks and graceful startup ordering (`WaitFor` dependencies)
- 🚀 One-command local development (`aspire run`)

## 🏗️ Architecture

### Vertical Slice Architecture

The API service is organized using **vertical slice architecture**, where each feature is self-contained and isolated by use case:

```
Features/
└── Products/
    ├── CreateProduct/
    │   ├── CreateProductEndpoint.cs
    │   ├── CreateProductHandler.cs
    │   ├── CreateProductRequest.cs
    │   └── CreateProductResponse.cs
    ├── GetProduct/
    ├── ListProducts/
    ├── UpdateProduct/
    └── DeleteProduct/
```

**Principles:**

- ✅ No cross-slice dependencies
- ✅ Handlers call `DbContext` directly (no repository layer)
- ✅ Each use case is independently testable and deployable
- ✅ Namespaces mirror folder structure

### Distributed Application Components

| Project | Purpose | Port |
|---|---|---|
| `copilot-demo.AppHost` | Aspire orchestrator — defines resources and dependencies | — |
| `copilot-demo.ApiService` | REST API with Products CRUD endpoints | Dynamic |
| `copilot-demo.Web.React` | React SPA frontend with Vite dev server | Dynamic |
| `copilot-demo.ServiceDefaults` | Shared Aspire configuration (telemetry, health checks) | — |

## 📦 Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) or later
- [Node.js 22+](https://nodejs.org/) and npm (for React frontend)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for SQL Server container)
- [Visual Studio 2022 17.12+](https://visualstudio.microsoft.com/downloads/) or [VS Code](https://code.visualstudio.com/) with C# Dev Kit
- [Aspire CLI](https://aspire.dev/get-started/install-cli/) (for running Aspire apps)

### Install Aspire CLI

**Windows (PowerShell):**

```powershell
irm https://aspire.dev/install.ps1 | iex
```

**macOS/Linux (Bash):**

```bash
curl -sSL https://aspire.dev/install.sh | bash
```

**Verify Installation:**

```powershell
aspire --version
```

## 🎯 Getting Started

### 1. Clone the Repository

```powershell
git clone <repository-url>
cd copilot-demo
```

### 2. Restore Dependencies

**Backend (.NET):**

```powershell
dotnet restore
```

**Frontend (React):**

```powershell
cd copilot-demo.Web.React
npm install
cd ..
```

### 3. Run the Application

**Using Aspire CLI (Recommended):**

```powershell
aspire run
```

**Using .NET CLI:**

```powershell
dotnet run --project copilot-demo.AppHost
```

**Using Visual Studio:**

1. Open `copilot-demo.slnx`
2. Set `copilot-demo.AppHost` as the startup project
3. Press <kbd>F5</kbd> to run

> Aspire automatically starts both the API service and the React dev server.

### 4. Access the Application

Once running, Aspire will launch the dashboard and display URLs for all services:

| Service | URL | Description |
|---|---|---|
| **Aspire Dashboard** | `https://localhost:17021` | Observability dashboard (telemetry, logs, traces) |
| **API Service** | Dynamic | REST API endpoints |
| **Web Frontend** | Dynamic | React SPA (Vite dev server) |
| **Scalar API Docs** | `{api-url}/scalar/v1` | Interactive API documentation |

> **Note:** Ports are dynamically assigned by Aspire. Check the dashboard or terminal output for exact URLs.

## 📂 Project Structure

```
copilot-demo/
├── copilot-demo.AppHost/              # Aspire orchestrator
│   └── AppHost.cs                     # Resource definitions (SQL, API, React app)
├── copilot-demo.ApiService/           # REST API
│   ├── Features/                      # Vertical slices (Products CRUD)
│   │   └── Products/
│   │       ├── CreateProduct/
│   │       ├── GetProduct/
│   │       ├── ListProducts/
│   │       ├── UpdateProduct/
│   │       └── DeleteProduct/
│   ├── Infrastructure/                # DbContext, entities, extensions
│   │   ├── AppDbContext.cs
│   │   ├── InfrastructureExtensions.cs
│   │   └── Product.cs
│   ├── Migrations/                    # EF Core migrations
│   └── Program.cs                     # API startup and endpoint registration
├── copilot-demo.Web.React/            # React SPA frontend
│   ├── src/
│   │   ├── api/                       # API client (products.ts, types.ts)
│   │   ├── components/                # React components
│   │   │   ├── products/              # Product-specific components
│   │   │   └── ui/                    # shadcn/ui primitives
│   │   ├── hooks/                     # Custom React hooks (useProducts.ts)
│   │   ├── layouts/                   # Layout components
│   │   ├── pages/                     # Page components
│   │   └── lib/                       # Utilities
│   ├── package.json                   # npm dependencies
│   └── vite.config.ts                 # Vite configuration
├── copilot-demo.ServiceDefaults/      # Shared Aspire config
│   └── Extensions.cs                  # Health checks, telemetry, resilience
└── copilot-demo.slnx                  # Solution file
```

## 🔌 API Endpoints

All endpoints are prefixed with `/products` and documented via OpenAPI.

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `POST` | `/products` | Create a new product | `201 Created` + Location header |
| `GET` | `/products` | List all products | `200 OK` with product array |
| `GET` | `/products/{id}` | Get product by ID | `200 OK` or `404 Not Found` |
| `PUT` | `/products/{id}` | Update existing product | `200 OK` or `404 Not Found` |
| `DELETE` | `/products/{id}` | Delete product | `204 No Content` or `404 Not Found` |

### Example: Create Product

**Request:**

```http
POST /products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999.99
}
```

**Response:**

```http
HTTP/1.1 201 Created
Location: /products/3fa85f64-5717-4562-b3fc-2c963f66afa6
Content-Type: application/json

{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "Laptop",
  "price": 999.99,
  "createdAt": "2026-03-26T15:30:00Z"
}
```

## � GitHub Copilot Support

This project is **optimized for AI-assisted development** with comprehensive GitHub Copilot integration for both backend and frontend.

### Custom Copilot Instructions

The repository includes context-aware instructions for different parts of the stack:

**Backend** — [`.github/copilot-instructions.md`](.github/copilot-instructions.md)

- **Stack-specific context** — .NET 10, Aspire, EF Core, Scalar API docs
- **Architectural patterns** — Vertical slice structure, endpoint registration conventions
- **Code conventions** — Naming rules, async patterns, typed results, documentation standards
- **Feature templates** — Guidance for creating new CRUD slices

**Frontend** — [`.github/instructions/react.instructions.md`](.github/instructions/react.instructions.md)

- **React best practices** — Component patterns, TypeScript conventions, hooks guidelines
- **TanStack Query patterns** — Custom hooks, mutations, optimistic updates
- **Form handling** — React Hook Form + Zod schema validation
- **Styling patterns** — Tailwind CSS conventions, shadcn/ui usage, responsive design
- **API integration** — Typed API client, error handling, loading states

When using **GitHub Copilot** or **GitHub Copilot Chat** in VS Code or Visual Studio, these instructions are automatically loaded, ensuring AI-generated code follows the project's established patterns and best practices.

### Benefits for Developers

✅ **Context-aware suggestions** — Copilot understands vertical slice architecture and React patterns  
✅ **Consistent code style** — Auto-generated code matches project conventions  
✅ **Faster feature development** — Ask Copilot to "create a new Category feature" or "add a product form" and get properly structured code  
✅ **Reduced onboarding time** — New developers get inline guidance through AI assistance

### Using Copilot with This Project

**Backend example prompts:**

```
"Create a new Orders feature with full CRUD operations"
"Add validation to CreateProductRequest using FluentValidation"
"Generate integration tests for the Products endpoints"
```

**Frontend example prompts:**

```
"Create a ProductCard component with edit and delete actions"
"Add a form for creating products with name and price fields"
"Create a custom hook for managing cart state with TanStack Query"
```

Copilot will automatically follow the vertical slice architecture for backend and React best practices for frontend as defined in the instructions files.

## �🧑‍💻 Development

### Running Migrations

Migrations are applied automatically at startup. To add new migrations:

```powershell
cd copilot-demo.ApiService
dotnet ef migrations add <MigrationName>
```

### Code Conventions

**Backend (C#):**

- **Implicit usings** enabled — no need for common `System.*` imports
- **Nullable reference types** enforced
- **Records** for all DTOs
- **Primary constructors** for lightweight classes
- **`TypedResults`** for all endpoint handlers (never untyped `IResult`)
- **Async all the way** — every I/O method uses `async Task<T>` with `CancellationToken`

**Frontend (React + TypeScript):**

- **Strict mode enabled** — all nullable types must be explicitly handled
- **Functional components only** with named exports
- **Custom hooks** for all TanStack Query operations
- **`@/` path alias** for absolute imports
- **React Hook Form + Zod** for all form validation
- **Tailwind CSS + shadcn/ui** for styling and components

### Adding a New Feature

**Backend (API):**

1. Create a new folder under `Features/<FeatureName>/`
2. Add use-case subfolders (`Create<Entity>`, `Get<Entity>`, etc.)
3. Define `Endpoint.cs`, `Handler.cs`, `Request.cs`, `Response.cs`
4. Register the endpoint in `Program.cs` via fluent chaining:

   ```csharp
   app.MapCreate<Entity>Endpoint()
      .MapGet<Entity>Endpoint()
      ...
   ```

**Frontend (React):**

1. Create API types and client functions in `src/api/<feature>.ts`
2. Create custom TanStack Query hooks in `src/hooks/use<Feature>.ts`
3. Build feature-specific components in `src/components/<feature>/`
4. Add page components in `src/pages/` with routing
5. Follow React + TypeScript conventions from `.github/instructions/react.instructions.md`

### Running Frontend Independently

The React frontend can be developed independently of Aspire:

```powershell
cd copilot-demo.Web.React
npm run dev
```

Configure the API base URL in your environment or Vite config as needed.

## 📖 Observability

Aspire provides **built-in observability through OpenTelemetry** with zero configuration required:

### OpenTelemetry Developer Dashboard

Monitor your distributed application in real-time with Aspire's ready-to-use dashboard:

- **Logs** — Structured logs from all services with filtering and correlation
- **Metrics** — Request rates, durations, error counts, and custom metrics
- **Traces** — Distributed tracing showing end-to-end request flow across services
- **Health Checks** — Service health status via `/health` endpoints

Access the **Aspire Dashboard** at `https://localhost:17021` to explore:

- 🔍 **Structured Logs** — Filter by service, log level, and trace ID
- 📊 **Metrics Explorer** — Visualize performance trends
- 🔗 **Trace Viewer** — Follow requests across microservices
- 💚 **Health Status** — Monitor service readiness and liveness

> **Why it matters:** Aspire delivers "observability from the start" — debug faster with zero setup, no manual instrumentation required.

## 🧪 Testing

*(To be implemented)*

Future testing strategy:

- **Backend Unit Tests** — Test handlers in isolation with in-memory DbContext
- **Backend Integration Tests** — Use WebApplicationFactory with Testcontainers
- **Frontend Component Tests** — Vitest + React Testing Library for component testing
- **E2E Tests** — Playwright for end-to-end UI testing

## 📜 License

This project is a demonstration/learning resource. Use freely for educational purposes.

## 🤝 Contributing

This is a demo repository. For questions or suggestions, please open an issue.

## 📚 Additional Resources

### Backend & Aspire

- [Aspire Official Website](https://aspire.dev/) — Get started, explore docs, and discover integrations
- [.NET Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/) — Microsoft Learn reference
- [Aspire GitHub Repository](https://github.com/microsoft/aspire) — Source code and releases
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/) — Architectural pattern explained
- [ASP.NET Core Minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis) — Minimal API fundamentals
- [Entity Framework Core](https://learn.microsoft.com/ef/core/) — ORM documentation
- [Scalar API Documentation](https://github.com/scalar/scalar) — Modern API documentation tool

### Frontend stack

- [React Documentation](https://react.dev/) — Official React docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) — TypeScript language reference
- [TanStack Query](https://tanstack.com/query/latest) — Powerful async state management
- [React Hook Form](https://react-hook-form.com/) — Performant form library
- [Zod](https://zod.dev/) — TypeScript-first schema validation
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) — Re-usable component library

---

**Built with ❤️ using .NET 10, .NET Aspire, and React**
