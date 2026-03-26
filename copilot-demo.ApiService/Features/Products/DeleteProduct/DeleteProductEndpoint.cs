namespace CopilotDemo.ApiService.Features.Products.DeleteProduct;

public static class DeleteProductEndpoint
{
    private const string Route = "/products/{id:guid}";

    public static IEndpointRouteBuilder MapDeleteProductEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapDelete(Route, DeleteProductHandler.Handle)
            .WithName("DeleteProduct")
            .WithTags("Products")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status404NotFound);

        return app;
    }
}
