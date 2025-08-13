# Artful Expressions

![Artful Expressions Logo](https://raw.githubusercontent.com/Akaash-Walker/artful_expressions/refs/heads/main/client/public/FullLogo_Transparent_NoBuffer.png)

This is the source code for Artful Expressions Paint Studio. Website link TBA.

## Tech Stack
MERN Stack
- MongoDB
- Express
- React
- Node.js

## Additional Technologies
- Stripe API for secure payment processing
- Atlas Database for MongoDB hosting
- Leaflet for interactive maps
- Shadcn and Tailwind CSS for responsive and modern UI

## Build Instructions

### 1. Prerequisites
- Node.js (LTS) & npm
- MongoDB Atlas cluster (or local MongoDB)
- Stripe account (test keys)
- Git

### 2. Clone the repository (SSH shown)
```bash
git clone git@github.com:Akaash-Walker/artful_expressions.git
cd artful_expressions
```

### 3. Install dependencies
Root:
```bash
npm install
```
Client:
```bash
cd client
npm install
cd ..
```

Server:
```bash
cd server
npm install
cd ..
```

### 4. Environment variables
Create a server/.env file:
```
MONGODB_URI=<your_mongodb_connection_string>
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***  # (only if using webhooks)
```

Create a client/.env file:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_***
```

### 5. Development
Run server + client concurrently (script does so for you in root package.json):
```bash
npm run dev
```
Access client (Vite) at:
http://localhost:5173

Access server (Express) at:
http://localhost:4242

### 6. Stripe testing
- Use test publishable & secret keys (prefix pk_test_, sk_test_).
- Use test card numbers (e.g. 4242 4242 4242 4242, any future expiry, any CVC).
- Verify your create-payment-intent endpoint returns { clientSecret }.

### 7. Webhooks (optional)
Expose local server (e.g.):
```bash
stripe listen --forward-to localhost:4242/webhook
```
Copy the webhook signing secret (whsec_***) into STRIPE_WEBHOOK_SECRET.



## Credits
- **Development by:** [Akaash Walker](https://www.linkedin.com/in/akaash-walker-1a82821a0)
- **Design by:** [Isabella Faulkner](https://www.linkedin.com/in/isabellafaulkner)