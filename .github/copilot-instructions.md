# Copilot Instructions

## Stack

- **.NET 10** — target framework for all projects (`net10.0`)
- **ASP.NET Core 10 Minimal API** — HTTP layer in `copilot-demo.ApiService`
- **.NET Aspire** — orchestration, distributed app host, OTEL, health checks
- **Entity Framework Core** — ORM for data access via `AppDbContext`
- **Azure SQL / SQL Server** — database provisioned by Aspire at runtime via `Aspire.Hosting.SqlServer` (container: `mcr.microsoft.com/mssql/server`)
- **Scalar** — interactive OpenAPI UI at `/scalar/v1` via `Scalar.AspNetCore`
- **C# 13** — language version implied by .NET 10; use records, primary constructors, and collection expressions where appropriate

### Key NuGet packages

| Project | Package |
|---|---|
| `copilot-demo.AppHost` | `Aspire.Hosting.SqlServer` |
| `copilot-demo.ApiService` | `Aspire.Microsoft.EntityFrameworkCore.SqlServer` |
| `copilot-demo.ApiService` | `Microsoft.EntityFrameworkCore.Design` (dev/migrations only) |
| `copilot-demo.ApiService` | `Scalar.AspNetCore` |
| `copilot-demo.ApiService` | `Microsoft.AspNetCore.OpenApi` (already present) |

---

## Code Conventions

- **Implicit usings** and **nullable reference types** are enabled — do not add redundant `using` directives for `System`, `System.Collections.Generic`, etc.
- **Records** for all request/response DTOs — prefer immutable positional records unless mutation is required.
- **Primary constructors** for handlers and light classes where the dependency list is small.
- **`var`** for local variables when the type is obvious from the right-hand side.
- **Async all the way** — every I/O method must be `async Task<T>` and use `CancellationToken ct = default` as the last parameter.
- **No abbreviations** in identifiers — `productId` not `pid`, `cancellationToken` not `ct` in public signatures.
- **`Results<T1, T2>`** typed return for Minimal API handlers — never return `IResult` untyped.
- **`TypedResults`** static factory (not `Results`) — e.g. `TypedResults.Ok(...)`, `TypedResults.NotFound()`, `TypedResults.Created(...)`.
- **No magic strings** — route templates are `const string` defined in the endpoint class.
- **Migrations** live in `copilot-demo.ApiService/Infrastructure/Migrations/` and are generated with `dotnet ef migrations add <Name> --project copilot-demo.ApiService`.
- Do **not** add XML doc comments to internal or private members — only on public API surface when the intent is non-obvious.

---

## Architecture — Vertical Slice

Every feature is a **self-contained slice** under `copilot-demo.ApiService/Features/<FeatureName>/`.

### Slice structure

Each feature folder is divided into **use-case subfolders**. Every use case (`Create<Entity>`, `Get<Entity>`, …) lives in its own subfolder containing only the files it needs.

```
Features/
└── <FeatureName>/
    ├── Create<FeatureName>/
    │   ├── Create<FeatureName>Endpoint.cs    ← IEndpointRouteBuilder extension method
    │   ├── Create<FeatureName>Handler.cs     ← static Handle() method injected into MapXxx()
    │   ├── Create<FeatureName>Request.cs     ← input record
    │   └── Create<FeatureName>Response.cs   ← output record
    ├── Get<FeatureName>/
    │   ├── Get<FeatureName>Endpoint.cs
    │   ├── Get<FeatureName>Handler.cs
    │   └── Get<FeatureName>Response.cs
    ├── List<FeatureName>s/
    │   ├── List<FeatureName>sEndpoint.cs
    │   ├── List<FeatureName>sHandler.cs
    │   └── List<FeatureName>sResponse.cs
    ├── Update<FeatureName>/
    │   ├── Update<FeatureName>Endpoint.cs
    │   ├── Update<FeatureName>Handler.cs
    │   └── Update<FeatureName>Request.cs
    └── Delete<FeatureName>/
        ├── Delete<FeatureName>Endpoint.cs
        └── Delete<FeatureName>Handler.cs
```

> Omit `Request.cs` when there is no request body or route parameters beyond the entity ID.  
> Omit `Response.cs` for operations that return `204 No Content`.

### Rules

1. **No cross-slice imports** — a use-case subfolder must never reference a type from another use-case or feature folder.
2. **No shared service or repository layer** — handlers call `AppDbContext` directly.
3. **Shared infrastructure** (`AppDbContext`, middleware, extensions) lives in `Infrastructure/` only.
4. **Endpoint registration** — every endpoint file exposes a single `IEndpointRouteBuilder` extension method named `Map<UseCase>Endpoint(this IEndpointRouteBuilder app)` and returns `IEndpointRouteBuilder` for fluent chaining.
5. **`Program.cs` wires everything** via one fluent chain:
   ```csharp
   app.MapCreateProductEndpoint()
      .MapGetProductEndpoint()
      .MapListProductsEndpoint()
      .MapUpdateProductEndpoint()
      .MapDeleteProductEndpoint();
   ```
6. **Handler methods** are `internal static` and receive dependencies as parameters resolved by the DI-backed delegate mechanism of Minimal APIs — do not use constructor injection in handlers.
7. **Namespace** mirrors the folder path — e.g. `CopilotDemo.ApiService.Features.Products.CreateProduct`.

### CRUD slice → HTTP mapping

| Slice | Method | Route | Success | Failure |
|---|---|---|---|---|
| `CreateProduct` | `POST` | `/products` | `201 Created` + `Location` header | `400` validation |
| `GetProduct` | `GET` | `/products/{id:guid}` | `200 OK` | `404 Not Found` |
| `ListProducts` | `GET` | `/products` | `200 OK` | — |
| `UpdateProduct` | `PUT` | `/products/{id:guid}` | `200 OK` | `404 Not Found` |
| `DeleteProduct` | `DELETE` | `/products/{id:guid}` | `204 No Content` | `404 Not Found` |

### Shared infrastructure

```
Infrastructure/
├── AppDbContext.cs               ← single DbContext; one DbSet<T> per entity
└── InfrastructureExtensions.cs  ← AddInfrastructure() calls builder.AddSqlServerDbContext<AppDbContext>("sqldb")
```

The connection name `"sqldb"` must match the database resource name in `AppHost.cs`.

### AppHost wiring

```csharp
var sql = builder.AddSqlServer("sql");
var sqldb = sql.AddDatabase("sqldb");

builder.AddProject<Projects.copilot_demo_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WaitFor(sqldb)
    .WithReference(sqldb);
```

---

## API Documentation

- **OpenAPI** is registered with `builder.Services.AddOpenApi()` — already present.
- **Scalar UI** is mapped with `app.MapScalarApiReference()` from the `Scalar.AspNetCore` package.
- Scalar is available at `/scalar/v1` in development.
- Every endpoint **must** declare `.WithName(...)`, `.WithTags(...)`, `.Produces<T>(...)`, and `.ProducesValidationProblem()` / `.ProducesProblem(...)` so the OpenAPI document is complete.
- Do **not** use Swagger UI (`UseSwaggerUI`) — Scalar is the only interactive docs UI.

```csharp
// Program.cs — OpenAPI + Scalar setup
builder.Services.AddOpenApi();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); // → /scalar/v1
}
```

---

## Documentation Rule — Always verify with Context7

**Before writing or modifying any ASP.NET Core 10 code**, use Context7 to confirm the current API signatures, method names, and package versions.

Use the Context7 MCP tool:
```
mcp_context7_resolve-library-id  →  /websites/learn_microsoft_en-us_aspnet_core
mcp_context7_query-docs           →  query for the specific API or feature
```

Examples of things that **must** be verified before use:
- `MapScalarApiReference()` options and route pattern
- `AddSqlServerDbContext<T>()` signature and connection name parameter
- `TypedResults` factory methods and their generic constraints
- Any new .NET 10 / ASP.NET Core 10 API that may differ from .NET 8/9

Do **not** assume API signatures from training data — ASP.NET Core evolves between minor versions and Aspire integration packages change independently.
