namespace CopilotDemo.ApiService.Features.Products.GetProduct;

public record GetProductResponse(Guid Id, string Name, decimal Price, DateTimeOffset CreatedAt);
