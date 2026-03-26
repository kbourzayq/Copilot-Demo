---
description: "Perform OWASP Top 10 security review on multiple files across a feature area and generate a risk-prioritized findings report (Critical/High/Medium/Low)"
agent: "agent"
---

Perform a comprehensive security review of the selected feature area(s) against the **OWASP Top 10 2021** and produce a **risk-prioritized report**.

## What to analyze

If the user has selected code or specified a feature:
- Analyze all files in that feature folder (`copilot-demo.ApiService/Features/<FeatureName>/` and all use-case subfolders)
- Include related infrastructure files (`AppDbContext.cs`, entity definitions, middleware)
- Check `Program.cs` for feature registration and security middleware configuration

If no specific feature is mentioned:
- Ask the user which feature area to review (e.g., "Products", "Authentication", or "all endpoints")

## OWASP Top 10 2021 Checklist

For each category, identify violations and rate their risk level:

### A01:2021 – Broken Access Control
- [ ] Missing authorization checks on endpoints (no `RequireAuthorization()`, `AllowAnonymous()` on sensitive operations)
- [ ] Insecure Direct Object References (IDORs) — users can access others' data by changing IDs
- [ ] Elevation of privilege through API abuse
- [ ] Missing anti-CSRF protection for state-changing operations

### A02:2021 – Cryptographic Failures
- [ ] Sensitive data transmitted without encryption (missing HTTPS enforcement)
- [ ] Hardcoded secrets, connection strings, API keys in source code
- [ ] Weak or deprecated cryptographic algorithms
- [ ] Passwords or PII logged or stored insecurely
- [ ] Missing encryption at rest for sensitive database fields

### A03:2021 – Injection
- [ ] SQL injection via string concatenation or `FromSqlRaw` with unsanitized input
- [ ] Command injection in shell commands or external process calls
- [ ] LDAP, NoSQL, or ORM injection through unsafe queries
- [ ] Missing input validation on request parameters

### A04:2021 – Insecure Design
- [ ] Missing rate limiting or throttling on expensive operations
- [ ] No business logic validation (e.g., negative quantities, past dates)
- [ ] Insecure state transitions (e.g., order status changes without validation)
- [ ] Missing idempotency keys for critical operations

### A05:2021 – Security Misconfiguration
- [ ] Detailed error messages exposing stack traces in production
- [ ] Default configurations or credentials
- [ ] Unnecessary features enabled (e.g., directory browsing, unused HTTP methods)
- [ ] Missing security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`)
- [ ] Permissive CORS policies (`AllowAnyOrigin()` with credentials)

### A06:2021 – Vulnerable and Outdated Components
- [ ] Outdated NuGet packages with known vulnerabilities
- [ ] Deprecated APIs or frameworks (e.g., old EF Core versions)
- [ ] Unpatched dependencies in `*.csproj` files

### A07:2021 – Identification and Authentication Failures
- [ ] Weak password requirements or no password policy
- [ ] Missing multi-factor authentication (MFA) for privileged accounts
- [ ] Session tokens not invalidated on logout
- [ ] Credential stuffing protections missing (no account lockout)
- [ ] Insecure session management (predictable session IDs, long expiration)

### A08:2021 – Software and Data Integrity Failures
- [ ] Missing integrity checks on serialized data
- [ ] Insecure deserialization of untrusted input
- [ ] Missing code signing or package integrity verification
- [ ] CI/CD pipeline without security gates

### A09:2021 – Security Logging and Monitoring Failures
- [ ] Sensitive operations not logged (login attempts, privilege changes, data access)
- [ ] PII or credentials logged in telemetry/logs
- [ ] Missing or insufficient audit trail
- [ ] No alerting on suspicious activities
- [ ] OTEL traces exposing sensitive data

### A10:2021 – Server-Side Request Forgery (SSRF)
- [ ] User-controlled URLs in HTTP client requests without validation
- [ ] Missing allowlist for external API calls
- [ ] Internal network access via user input
- [ ] Metadata service access (cloud IMDS endpoints) not blocked

## Output format

Generate a **risk-prioritized report** in the following format:

---

# Security Review Report: `<FeatureName>`

**Review Date**: `<current date>`  
**Scope**: `<list of files/folders analyzed>`  
**OWASP Top 10 Version**: 2021

---

## Executive Summary

- **Critical**: X findings
- **High**: Y findings
- **Medium**: Z findings
- **Low**: W findings

---

## Critical Risk Findings

### 🔴 [A03:2021-Injection] SQL Injection in `GetProductEndpoint`

**Location**: [GetProductHandler.cs](copilot-demo.ApiService/Features/Products/GetProduct/GetProductHandler.cs#L15)

**Issue**:  
```csharp
var product = await db.Products
    .FromSqlRaw($"SELECT * FROM Products WHERE Id = '{id}'")
    .FirstOrDefaultAsync();
```

**Risk**: Allows arbitrary SQL execution if `id` is manipulated.

**Recommendation**:  
Use parameterized queries:
```csharp
var product = await db.Products
    .Where(p => p.Id == id)
    .FirstOrDefaultAsync(cancellationToken);
```

**CVSS Score**: 9.8 (Critical)

---

## High Risk Findings

### 🟠 [A01:2021-Access Control] Missing Authorization on Delete Endpoint

**Location**: [DeleteProductEndpoint.cs](copilot-demo.ApiService/Features/Products/DeleteProduct/DeleteProductEndpoint.cs#L12)

**Issue**:  
Endpoint allows unauthenticated users to delete products.

**Recommendation**:  
Add `.RequireAuthorization("AdminPolicy")` to the endpoint configuration.

---

## Medium Risk Findings

### 🟡 [A05:2021-Misconfiguration] Permissive CORS Policy

**Location**: [Program.cs](copilot-demo.ApiService/Program.cs#L25)

**Issue**:  
```csharp
builder.Services.AddCors(options => options.AddDefaultPolicy(
    policy => policy.AllowAnyOrigin().AllowCredentials()));
```

**Risk**: Allows any origin to make authenticated requests.

**Recommendation**:  
Specify allowed origins explicitly or remove `.AllowCredentials()`.

---

## Low Risk Findings

### ⚪ [A09:2021-Logging] Sensitive Data in Logs

**Location**: [CreateProductHandler.cs](copilot-demo.ApiService/Features/Products/CreateProduct/CreateProductHandler.cs#L22)

**Issue**:  
Request payload logged including potentially sensitive fields.

**Recommendation**:  
Use structured logging with field filtering for PII.

---

## Summary of Recommendations

1. Immediate action (Critical/High):
   - Fix SQL injection vulnerabilities  
   - Add authorization to all sensitive endpoints  
   - Review CORS configuration  

2. Short-term (Medium):
   - Implement rate limiting on expensive operations  
   - Add security headers middleware  
   - Update outdated dependencies  

3. Long-term (Low):
   - Implement centralized logging with PII filtering  
   - Add security smoke tests to CI/CD  
   - Document security architecture decisions  

---

## .NET Aspire / ASP.NET Core Specific Checks

Additionally scan for these stack-specific issues:

- **Aspire Dashboard exposure**: Ensure dashboard is not accessible in production (check `launchSettings.json`)
- **Default service configurations**: Verify `ServiceDefaults` applies security middleware to all services
- **Connection strings in telemetry**: Check OTEL exporters don't leak connection strings
- **Health check endpoints**: Ensure `/health` and Aspire endpoints don't expose sensitive info
- **Minimal API validation**: Verify input validation on all request DTOs (use `[Required]`, `[StringLength]`, etc.)
- **EF Core migrations**: Check for plaintext secrets in migration scripts

---

## Notes

- Focus on **code-level vulnerabilities** visible in the analyzed files
- For infrastructure/deployment security, recommend a separate review
- Link to specific line numbers using workspace-relative paths
- Use CVSS 3.1 scoring for critical/high findings where applicable
