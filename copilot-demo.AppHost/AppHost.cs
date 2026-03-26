var builder = DistributedApplication.CreateBuilder(args);

var sql = builder.AddSqlServer("sql");
var sqldb = sql.AddDatabase("sqldb");

var apiService = builder.AddProject<Projects.copilot_demo_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WaitFor(sqldb)
    .WithReference(sqldb);

builder.AddJavaScriptApp("webfrontend", "../copilot-demo.Web.React")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithEnvironment("BROWSER", "none");

builder.Build().Run();
