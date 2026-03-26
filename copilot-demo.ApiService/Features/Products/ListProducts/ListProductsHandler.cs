using CopilotDemo.ApiService.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CopilotDemo.ApiService.Features.Products.ListProducts;

public static class ListProductsHandler
{
    internal static async Task<Ok<List<ListProductsResponse>>> Handle(
        AppDbContext db,
        CancellationToken cancellationToken = default)
    {
        var products = await db.Products
            .Select(p => new ListProductsResponse(p.Id, p.Name, p.Price, p.CreatedAt))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(products);
    }
}
