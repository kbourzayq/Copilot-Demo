var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("sql");
var sqldb = sql.AddDatabase("sqldb");

var apiService = builder.AddProject<Projects.copilot_demo_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WaitFor(sqldb)
    .WithReference(sqldb);

builder.AddProject<Projects.copilot_demo_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
