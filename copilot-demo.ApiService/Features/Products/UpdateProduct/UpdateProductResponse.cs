namespace CopilotDemo.ApiService.Features.Products.UpdateProduct;

public record UpdateProductResponse(Guid Id, string Name, decimal Price, DateTimeOffset CreatedAt);
