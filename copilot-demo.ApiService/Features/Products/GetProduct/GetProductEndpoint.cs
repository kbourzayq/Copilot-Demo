namespace CopilotDemo.ApiService.Features.Products.GetProduct;

public static class GetProductEndpoint
{
    private const string Route = "/products/{id:guid}";

    public static IEndpointRouteBuilder MapGetProductEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet(Route, GetProductHandler.Handle)
            .WithName("GetProduct")
            .WithTags("Products")
            .Produces<GetProductResponse>()
            .ProducesProblem(StatusCodes.Status404NotFound);

        return app;
    }
}
