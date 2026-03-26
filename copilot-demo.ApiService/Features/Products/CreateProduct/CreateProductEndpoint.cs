namespace CopilotDemo.ApiService.Features.Products.CreateProduct;

public static class CreateProductEndpoint
{
    private const string Route = "/products";

    public static IEndpointRouteBuilder MapCreateProductEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost(Route, CreateProductHandler.Handle)
            .WithName("CreateProduct")
            .WithTags("Products")
            .Produces<CreateProductResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem();

        return app;
    }
}
