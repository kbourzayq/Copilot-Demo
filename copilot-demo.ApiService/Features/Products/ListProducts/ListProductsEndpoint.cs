namespace CopilotDemo.ApiService.Features.Products.ListProducts;

public static class ListProductsEndpoint
{
    private const string Route = "/products";

    public static IEndpointRouteBuilder MapListProductsEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet(Route, ListProductsHandler.Handle)
            .WithName("ListProducts")
            .WithTags("Products")
            .Produces<List<ListProductsResponse>>();

        return app;
    }
}
