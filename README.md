# Artful Expressions

![Artful Expressions Logo](https://raw.githubusercontent.com/Akaash-Walker/artful_expressions/refs/heads/main/packages/client/public/FullLogo_Transparent_NoBuffer.png)

This is the source code for Artful Expressions Paint Studio. Website link TBA.

## Tech Stack
- MongoDB
- Express
- React
- Node.js

## Additional Technologies
- Stripe API for secure payment processing
- Atlas Database for MongoDB hosting
- Leaflet for interactive maps
- Shadcn and Tailwind CSS for responsive and modern UI
- Turborepo for monorepo management

## Prerequisites
- Node.js LTS and pnpm
- MongoDB (Atlas or local)
- Stripe account (test keys)

## Install
```bash
git clone git@github.com:Akaash-Walker/artful_expressions.git
cd artful_expressions
pnpm install
```

## Environment
Create packages/server/.env
```
MONGO_URI=<your_mongodb_connection_string>
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***
```
Create packages/client/.env
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_***
```

## Develop
Run client and server concurrently (via Turborepo):
```bash
pnpm dev
```
- Client: http://localhost:5173
- Server: http://localhost:4242

**Note: Since DB insertion is based on Stripe webhooks, booking a class will not work without also implementing Stripe.**

## Stripe (test)
- Use pk_test_/sk_test_ keys.
- Start webhooks:
```bash
stripe listen --forward-to localhost:4242/webhook
```

## Notes
- This repo uses pnpm workspaces and Turborepo. If processes don’t start, ensure you ran pnpm install at the repo root and then pnpm dev.

## Credits
- Development: [Akaash Walker](https://www.linkedin.com/in/akaash-walker-1a82821a0)
- Design: [Isabella Faulkner](https://www.linkedin.com/in/isabellafaulkner)
