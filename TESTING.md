# Authentication Module Testing Guide

## Quick Start

### 1. Setup Test Environment

```bash
# Install dependencies
npm install

# Install test dependencies
npm install -D jest @testing-library/react @testing-library/jest-dom ts-jest @types/jest

# Setup environment
cp .env.example .env.test
```

### 2. Configure Environment

Create `.env.test` for testing:

```env
DATABASE_URL="postgresql://test_user:test_password@localhost:5432/flower_test"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-key"
```

### 3. Setup Test Database

```bash
# Create test database
createdb flower_test

# Run migrations
DATABASE_URL="postgresql://test_user:test_password@localhost:5432/flower_test" npx prisma migrate deploy

# Seed test data
DATABASE_URL="postgresql://test_user:test_password@localhost:5432/flower_test" npx prisma db seed
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Testing Strategy

### Unit Tests

**Location:** `__tests__/lib/validations/`

Test input validation independently:

```bash
npm test -- validations/auth.test.ts
```

**What to test:**
- Schema validation (valid/invalid inputs)
- Password strength requirements
- Email format validation
- Field constraints

### API Integration Tests

**Location:** `__tests__/api/`

Test API endpoints with database:

```bash
npm test -- api/auth/register.test.ts
```

**Requires:**
- Test database running
- Prisma migrations applied
- Test data seeding

**What to test:**
- Successful registration/login/logout
- Duplicate email rejection
- Password hashing
- Session creation
- Audit logging
- Error responses (400, 409, 401, 403)

### End-to-End Tests (E2E)

**Tool:** Playwright or Cypress

```bash
npm install -D @playwright/test
npx playwright install
npx playwright test
```

**E2E Test Flows:**
1. User registration → login → dashboard
2. Admin user management flow
3. Password change & session revocation
4. MFA enable/disable
5. Role-based access control

### Manual Testing Checklist

#### Registration
- [ ] Valid registration succeeds
- [ ] Duplicate email rejected
- [ ] Weak password rejected
- [ ] Password confirmation mismatch caught
- [ ] User receives verification email (if implemented)

#### Login
- [ ] Valid credentials login succeeds
- [ ] Invalid password rejected
- [ ] Non-existent email rejected
- [ ] Brute force lockout works (5 attempts)
- [ ] MFA prompt appears if enabled
- [ ] Suspended account login rejected

#### Admin Dashboard
- [ ] User list loads with pagination
- [ ] Search works
- [ ] Status filtering works
- [ ] User suspension succeeds
- [ ] Role assignment works
- [ ] Audit logs are recorded

#### Profile
- [ ] Profile information updates
- [ ] Password change succeeds
- [ ] Current password verification works
- [ ] Sessions revoked after password change
- [ ] MFA toggle works

---

## Test Data Setup

### Create Test Users

```sql
-- Super admin
INSERT INTO users (id, email, name, "hashedPassword", status, "emailVerified", "createdAt", "updatedAt")
VALUES ('test-admin-1', 'admin@test.local', 'Admin User', '$2a$12$...', 'ACTIVE', now(), now(), now());

-- Regular user
INSERT INTO users (id, email, name, "hashedPassword", status, "emailVerified", "createdAt", "updatedAt")
VALUES ('test-user-1', 'user@test.local', 'Test User', '$2a$12$...', 'ACTIVE', now(), now(), now());

-- Assign roles
INSERT INTO user_roles (id, "userId", "roleId", "createdAt")
SELECT gen_random_uuid(), 'test-admin-1', id, now() FROM roles WHERE name = 'SUPER_ADMIN';

INSERT INTO user_roles (id, "userId", "roleId", "createdAt")
SELECT gen_random_uuid(), 'test-user-1', id, now() FROM roles WHERE name = 'USER';
```

### Generate Test Hashes

```bash
# In Node.js REPL
const { hash } = require('bcryptjs');
(async () => {
  const hashed = await hash('TestPassword123!', 12);
  console.log(hashed);
})();
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: flower_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npx prisma migrate deploy
      - run: npm test -- --coverage
```

---

## Coverage Goals

- **Validations:** 100% coverage
- **API routes:** 80%+ coverage
- **Server actions:** 80%+ coverage
- **Components:** 60%+ coverage (UI is harder to test)

Check coverage:

```bash
npm test -- --coverage
```

---

## Common Issues

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U test_user -d flower_test

# Reset test database
dropdb flower_test
createdb flower_test
npx prisma migrate deploy
```

### Tests Timeout

Increase Jest timeout in `jest.config.ts`:

```ts
testTimeout: 10000, // 10 seconds
```

### Prisma Client Not Found

```bash
npx prisma generate
```

---

## Next Steps

1. **Setup test database** - PostgreSQL with test credentials
2. **Run validation tests** - `npm test -- validations`
3. **Implement API tests** - Mock Prisma or use test DB
4. **Add E2E tests** - Use Playwright for full user flows
5. **Setup CI/CD** - GitHub Actions runs tests on push
