using CopilotDemo.ApiService.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CopilotDemo.ApiService.Features.Products.UpdateProduct;

public static class UpdateProductHandler
{
    internal static async Task<Results<Ok<UpdateProductResponse>, NotFound>> Handle(
        Guid id,
        UpdateProductRequest request,
        AppDbContext db,
        CancellationToken cancellationToken = default)
    {
        var product = await db.Products
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (product is null)
        {
            return TypedResults.NotFound();
        }

        product.Name = request.Name;
        product.Price = request.Price;

        await db.SaveChangesAsync(cancellationToken);

        var response = new UpdateProductResponse(product.Id, product.Name, product.Price, product.CreatedAt);
        return TypedResults.Ok(response);
    }
}
