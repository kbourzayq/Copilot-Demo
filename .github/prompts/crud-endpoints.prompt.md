---
description: "Generate a full CRUD endpoint set (Create, Read, List, Update, Delete) for a given entity following the vertical slice architecture."
agent: "agent"
argument-hint: "Entity name (e.g. Product, Order, Customer)"
---

Generate all 5 CRUD endpoint slices for the entity **`$ARGUMENTS`** following the project's vertical slice architecture defined in .github/copilot-instructions.md.

## What to generate

Create the following files, each in its own **use-case subfolder** under `copilot-demo.ApiService/Features/$ARGUMENTS/<UseCase>/`:

| Folder | File | Purpose |
|---|---|---|
| `Create$ARGUMENTS/` | `Create$ARGUMENTSEndpoint.cs` | `POST /$arguments` → `201 Created` |
| `Create$ARGUMENTS/` | `Create$ARGUMENTSRequest.cs` | Input record for create |
| `Create$ARGUMENTS/` | `Create$ARGUMENTSResponse.cs` | Output record |
| `Get$ARGUMENTS/` | `Get$ARGUMENTSEndpoint.cs` | `GET /$arguments/{id:guid}` → `200 OK` or `404` |
| `Get$ARGUMENTS/` | `Get$ARGUMENTSResponse.cs` | Output record for single entity |
| `List$ARGUMENTSs/` | `List$ARGUMENTSsEndpoint.cs` | `GET /$arguments` → `200 OK` |
| `List$ARGUMENTSs/` | `List$ARGUMENTSsResponse.cs` | Output record for collection |
| `Update$ARGUMENTS/` | `Update$ARGUMENTSEndpoint.cs` | `PUT /$arguments/{id:guid}` → `200 OK` or `404` |
| `Update$ARGUMENTS/` | `Update$ARGUMENTSRequest.cs` | Input record for update |
| `Delete$ARGUMENTS/` | `Delete$ARGUMENTSEndpoint.cs` | `DELETE /$arguments/{id:guid}` → `204 No Content` or `404` |

Also update `Program.cs` to register all 5 endpoints using the fluent chain.

## Rules to follow strictly

1. **Vertical slice** — each file lives in its own use-case subfolder `Features/$ARGUMENTS/<UseCase>/`. No cross-slice or cross-use-case imports.
2. **No repository/service layer** — handlers call `AppDbContext` directly.
3. **Records** for all request/response DTOs (positional, immutable).
4. **`TypedResults`** factory (never `Results`): `TypedResults.Ok(...)`, `TypedResults.Created(...)`, `TypedResults.NotFound()`, `TypedResults.NoContent()`.
5. **`Results<T1, T2>`** typed return — never `IResult`.
6. **Route templates** are `const string` constants defined in the endpoint class.
7. **Handler methods** are `internal static async Task<...>` — no constructor injection.
8. Every endpoint must declare `.WithName(...)`, `.WithTags(...)`, `.Produces<T>(...)`, `.ProducesProblem(...)` / `.ProducesValidationProblem()`.
9. **`CancellationToken cancellationToken = default`** as last parameter on every async handler.
10. No abbreviations in identifiers.

## Expected shape per slice

### Endpoint file pattern
```csharp
namespace CopilotDemo.ApiService.Features.$ARGUMENTS.Create$ARGUMENTS;

public static class Create$ARGUMENTSEndpoint
{
    private const string Route = "/$arguments";

    public static IEndpointRouteBuilder MapCreate$ARGUMENTSEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost(Route, Create$ARGUMENTSHandler.Handle)
            .WithName("Create$ARGUMENTS")
            .WithTags("$ARGUMENTS")
            .Produces<Create$ARGUMENTSResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem();

        return app;
    }
}
```

### Handler file pattern
```csharp
namespace CopilotDemo.ApiService.Features.$ARGUMENTS.Create$ARGUMENTS;

public static class Create$ARGUMENTSHandler
{
    internal static async Task<Results<Created<Create$ARGUMENTSResponse>, ValidationProblem>> Handle(
        Create$ARGUMENTSRequest request,
        AppDbContext db,
        CancellationToken cancellationToken = default)
    {
        // implementation
    }
}
```

### Request/Response record pattern
```csharp
namespace CopilotDemo.ApiService.Features.$ARGUMENTS.Create$ARGUMENTS;

public record Create$ARGUMENTSRequest(string Name /*, other properties */);
public record Create$ARGUMENTSResponse(Guid Id, string Name /*, other properties */);
```

## Program.cs registration
Add to the fluent chain in `Program.cs`:
```csharp
app.MapCreate$ARGUMENTSEndpoint()
   .MapGet$ARGUMENTSEndpoint()
   .MapList$ARGUMENTSEndpoint()
   .MapUpdate$ARGUMENTSEndpoint()
   .MapDelete$ARGUMENTSEndpoint();
```

## Entity assumptions
- The entity has at minimum: `Guid Id` (primary key, auto-generated), `string Name`, and `DateTimeOffset CreatedAt`.
- Infer reasonable additional fields from the entity name if they are obvious (e.g. `decimal Price` for `Product`).
- If the entity already exists in `AppDbContext`, use its actual properties.
- If the entity does **not** exist yet in `AppDbContext`, add a `DbSet<$ARGUMENTS>` property to `AppDbContext` but do **not** create a migration — note that the user should run `dotnet ef migrations add Add$ARGUMENTS`.
