namespace CopilotDemo.ApiService.Infrastructure;

public static class InfrastructureExtensions
{
    public static IHostApplicationBuilder AddInfrastructure(this IHostApplicationBuilder builder)
    {
        builder.AddSqlServerDbContext<AppDbContext>("sqldb");
        return builder;
    }
}
