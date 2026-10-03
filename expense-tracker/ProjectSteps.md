npm install -D prisma@7 tsx
npm install @prisma/client@7 @prisma/adapter-pg pg dotenv

npx prisma --version

npx prisma init --output ../app/generated/prisma

node --version
npm --version
npx prisma --version


npx prisma migrate dev --name init

npx prisma generate

npx prisma studio

---
$body = @{
    amount = 25.50
    description = "Lunch"
    date = "2026-10-03"
    category = "FOOD"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/expenses" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

---
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/expenses" `
  -Method GET

---
Verify in Prisma Studio : http://localhost:51212