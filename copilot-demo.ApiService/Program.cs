using CopilotDemo.ApiService.Features.Products.CreateProduct;
using CopilotDemo.ApiService.Features.Products.DeleteProduct;
using CopilotDemo.ApiService.Features.Products.GetProduct;
using CopilotDemo.ApiService.Features.Products.ListProducts;
using CopilotDemo.ApiService.Features.Products.UpdateProduct;
using CopilotDemo.ApiService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();
builder.AddInfrastructure();

// Add services to the container.
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

var app = builder.Build();

// Apply migrations at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapCreateProductEndpoint()
   .MapGetProductEndpoint()
   .MapListProductsEndpoint()
   .MapUpdateProductEndpoint()
   .MapDeleteProductEndpoint();

app.MapDefaultEndpoints();

app.Run();
