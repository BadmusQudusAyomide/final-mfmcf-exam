# Concurrent User Handling Guide

## Current Capabilities ✅

Your Next.js application is already well-designed for concurrent users:

### Database Architecture
- **PostgreSQL**: Handles 100+ concurrent connections easily
- **Connection Pooling**: Prisma manages efficient database connections
- **ACID Transactions**: Ensures data consistency under load

### Session Management
- **Unique Sessions**: Each user gets isolated `candidateId` and `sessionId`
- **Matric Validation**: Prevents duplicate registrations
- **Stateless Design**: Serverless functions scale automatically

## Current Load Testing Estimates

### Conservative Estimates (Current Setup)
- **50-100 concurrent users**: Should work fine with default Next.js setup
- **100-300 concurrent users**: May need database connection tuning
- **300+ concurrent users**: Consider additional optimizations

## Recommended Improvements for High Concurrency

### 1. Database Optimizations
```sql
-- Add indexes for better performance
CREATE INDEX idx_candidate_matric ON candidate(matric_number);
CREATE INDEX idx_exam_session_status ON exam_session(status);
CREATE INDEX idx_exam_submission_date ON exam_submission(submitted_at);
```

### 2. Rate Limiting (Next.js Middleware)
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  // Clean old entries
  for (const [key, timestamp] of rateLimit.entries()) {
    if (timestamp < windowStart) {
      rateLimit.delete(key);
    }
  }
  
  // Check rate limit
  const requestCount = Array.from(rateLimit.values())
    .filter(timestamp => timestamp > windowStart).length;
    
  if (requestCount > 30) { // 30 requests per minute
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  rateLimit.set(ip, now);
  return NextResponse.next();
}
```

### 3. Caching Strategy
```javascript
// Cache exam data to reduce database load
import { cache } from 'react';

export const getExamData = cache(async () => {
  // Exam data doesn't change frequently
  return await getOrCreateExam();
});
```

### 4. Database Connection Tuning
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

// In your database connection
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  // Add connection pool settings
  // connection_limit = 20
  // pool_timeout = 10
}
```

### 5. Load Testing Commands
```bash
# Install artillery for load testing
npm install -g artillery

# Test with 50 concurrent users
artillery run load-test-50-users.yml

# Test with 100 concurrent users  
artillery run load-test-100-users.yml
```

## Monitoring & Scaling

### Key Metrics to Monitor
- **Response Time**: Should stay < 2 seconds
- **Error Rate**: Should stay < 1%
- **Database Connections**: Monitor pool usage
- **Memory Usage**: Serverless function memory

### Scaling Strategy
1. **Vertical Scaling**: Increase database resources
2. **Horizontal Scaling**: Next.js automatically scales serverless functions
3. **CDN**: Use Vercel's built-in CDN for static assets

## Production Recommendations

### For 100+ Concurrent Users
1. **Database**: Upgrade to managed PostgreSQL with connection pooling
2. **Caching**: Implement Redis for session data
3. **Monitoring**: Add application performance monitoring

### For 500+ Concurrent Users  
1. **Load Balancer**: Multiple database read replicas
2. **Queue System**: For background processing
3. **Advanced Caching**: Multi-layer caching strategy

## Stress Testing Your Current Setup

### Simple Load Test
```bash
# Using Apache Bench (ab)
ab -n 1000 -c 50 http://localhost:3000/api/register

# Using curl with parallel processing
seq 1 50 | xargs -P 50 -I {} curl -X POST http://localhost:3000/api/register
```

### What to Test
1. **Registration endpoint**: Multiple users registering simultaneously
2. **Exam submission**: Multiple users submitting at once
3. **Result retrieval**: Concurrent result downloads

## Conclusion

Your current Next.js + PostgreSQL setup is **excellent for concurrent users** and should handle:
- **50-100 users** without any changes
- **100-300 users** with minor optimizations
- **300+ users** with the improvements listed above

The architecture is solid and follows best practices for scalability!
