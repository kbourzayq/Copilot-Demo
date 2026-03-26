namespace CopilotDemo.ApiService.Features.Products.ListProducts;

public record ListProductsResponse(Guid Id, string Name, decimal Price, DateTimeOffset CreatedAt);
