# TRPC Starter

## Start

Example requests

```bash
npm run dev                         #Start server

# Query Procedure
curl localhost:3000/api/hello       #OpenAPI Call
curl localhost:3000/api/trpc/hello  #TRPC Call

# Mutation Procedure
curl localhost:3000/api/auth -d "" -H "x-api-key: test"      #OpenAPI Call
curl localhost:3000/api/trpc/auth -d "" -H "Content-Type: application/json" -H "x-api-key: test" #TRPC Call
```
