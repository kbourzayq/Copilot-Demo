namespace CopilotDemo.ApiService.Features.Products.UpdateProduct;

public static class UpdateProductEndpoint
{
    private const string Route = "/products/{id:guid}";

    public static IEndpointRouteBuilder MapUpdateProductEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPut(Route, UpdateProductHandler.Handle)
            .WithName("UpdateProduct")
            .WithTags("Products")
            .Produces<UpdateProductResponse>()
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesValidationProblem();

        return app;
    }
}
