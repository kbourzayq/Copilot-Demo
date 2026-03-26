using CopilotDemo.ApiService.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CopilotDemo.ApiService.Features.Products.CreateProduct;

public static class CreateProductHandler
{
    internal static async Task<Results<Created<CreateProductResponse>, ValidationProblem>> Handle(
        CreateProductRequest request,
        AppDbContext db,
        CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Price = request.Price,
            CreatedAt = DateTimeOffset.UtcNow
        };

        db.Products.Add(product);
        await db.SaveChangesAsync(cancellationToken);

        var response = new CreateProductResponse(product.Id, product.Name, product.Price, product.CreatedAt);
        return TypedResults.Created($"/products/{product.Id}", response);
    }
}
