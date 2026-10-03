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