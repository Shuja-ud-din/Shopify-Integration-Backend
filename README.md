# Shopify Integration Backend 🛍️

A NestJS-based backend service that integrates with Shopify's API to manage products, product groups, and user authentication.

## Features

- 🛍️ Shopify Products Integration
- 👥 User Authentication
- 🏷️ Product Tags Management
- 📦 Product Groups
- 🔄 Redis Caching
- 🔐 JWT Authentication
- 🗃️ MongoDB Integration

## Prerequisites 🚀

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (v4.4 or higher)
- Redis (v6 or higher)

## Directory Structure 📁

```
shopify-integration-backend/
├── 📁 src/
│   ├── 📁 common/
│   │   ├── 📁 config/
│   │   │   ├── app.config.ts
│   │   │   ├── db.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   ├── redis.config.ts
│   │   ├── 📁 enums/
│   │   │   └── product.enum.ts
│   │   ├── 📁 middlewares/
│   │   │   └── auth.middleware.ts
│   │   ├── 📁 types/
│   │   │   ├── product.types.ts
│   │   │   └── user.types.ts
│   │   └── 📁 utils/
│   │       └── token.ts
│   ├── 📁 modules/
│   │   ├── 📁 auth/
│   │   │   ├── 📁 dtos/
│   │   │   ├── 📁 interceptors/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── 📁 product/
│   │   │   ├── 📁 entities/
│   │   │   ├── 📁 interceptors/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.module.ts
│   │   │   └── product.service.ts
│   │   ├── 📁 product-group/
│   │   │   ├── 📁 dtos/
│   │   │   ├── 📁 entities/
│   │   │   ├── 📁 interceptors/
│   │   │   ├── product-group.controller.ts
│   │   │   ├── product-group.module.ts
│   │   │   └── product-group.service.ts
│   │   ├── 📁 redis/
│   │   │   └── redis.module.ts
│   │   ├── 📁 seed/
│   │   │   ├── 📁 data/
│   │   │   ├── seed.module.ts
│   │   │   └── seed.service.ts
│   │   ├── 📁 shopify/
│   │   │   ├── shopify.module.ts
│   │   │   └── shopify.service.ts
│   │   └── 📁 user/
│   │       ├── 📁 entities/
│   │       ├── user.module.ts
│   │       └── user.service.ts
│   ├── 📁 validations/
│   │   └── env.validation.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   └── seed.ts
├── 📁 test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env.development
├── .env.production
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── 📁 .husky/
│   ├── commit-msg
│   └── pre-commit
├── .prettierrc
├── LICENSE
├── README.md
├── commitlint.config.js
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Environment Setup ⚙️

Create `.env.development` for development and `.env.production` for production with the following variables:

```env
# App
PORT=3000
NODE_ENV=development
GLOBAL_PREFIX=api
CORS_ENABLED=true

# MongoDB
MONGO_URI=mongodb://localhost:27017/shopify-integration

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Redis
REDIS_URL=redis://localhost:6379
```

## Installation 🔧

```bash
# Install dependencies
$ npm install

# Install husky git hooks
$ npm run prepare
```

## Running the Application 🚀

### Development

```bash
# Start in development mode
$ npm run start:dev

# Start in debug mode
$ npm run start:debug
```

### Production

```bash
# Build the application
$ npm run build

# Start in production mode
$ npm run start:prod
```

## Database Management 🗃️

```bash
# Seed the database
$ npm run seed
```

## Testing 🧪

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Code Quality ✨

```bash
# Format code
$ npm run format

# Lint code
$ npm run lint
```

## API Endpoints 🛣️

### Authentication 🔐

- `POST /api/auth/sign-in` - User authentication

### Products 🛍️

- `GET /api/products` - Get all products
- `GET /api/products/tags` - Get all product tags
- `POST /api/products/sync` - Sync products with Shopify

### Product Groups 📦

- `GET /api/product-groups` - Get all product groups
- `POST /api/product-groups` - Create a new product group

## Production Deployment 🚀

1. Set up production environment variables in `.env.production`
2. Build the application:

```bash
$ npm run build
```

3. Start with PM2 (recommended):

```bash
# Install PM2 globally
$ npm install -g pm2

# Start the application
$ pm2 start dist/main.js --name shopify-integration

# Monitor the application
$ pm2 monit
```

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
