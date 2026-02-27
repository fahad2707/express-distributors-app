# Express Distributors Inc - E-commerce + POS System

Enterprise-grade e-commerce platform with integrated POS system for wholesale distribution.

## Features

- 🛍️ **E-commerce Storefront**: Modern, responsive product browsing and ordering
- 💳 **POS System**: In-store sales with barcode scanning
- 📦 **Inventory Management**: Real-time stock tracking and alerts
- 📧 **OTP Authentication**: Phone-based login system
- 📊 **Analytics Dashboard**: Comprehensive business insights
- 🧾 **Invoice Management**: PDF generation and email delivery
- 📱 **Real-time Updates**: Live order status tracking

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Payments**: Stripe
- **Auth**: OTP via Twilio/SMS service

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
cd backend && npm run migrate

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
.
├── frontend/          # Next.js application
├── backend/           # Express API server
└── package.json       # Root workspace config
```

## Environment Variables

See `.env.example` files in frontend and backend directories for required configuration.




