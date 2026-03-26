namespace CopilotDemo.ApiService.Features.Products.CreateProduct;

public record CreateProductResponse(Guid Id, string Name, decimal Price, DateTimeOffset CreatedAt);
