using CopilotDemo.ApiService.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CopilotDemo.ApiService.Features.Products.DeleteProduct;

public static class DeleteProductHandler
{
    internal static async Task<Results<NoContent, NotFound>> Handle(
        Guid id,
        AppDbContext db,
        CancellationToken cancellationToken = default)
    {
        var product = await db.Products
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (product is null)
        {
            return TypedResults.NotFound();
        }

        db.Products.Remove(product);
        await db.SaveChangesAsync(cancellationToken);

        return TypedResults.NoContent();
    }
}
