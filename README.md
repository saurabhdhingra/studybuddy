# StudyBuddy - Chat with Your PDFs

## Overview

StudyBuddy is a powerful and intelligent "Chat with PDF" application designed to revolutionize the way you interact with your documents. Simply upload a PDF, and start asking questions! Leveraging the latest in AI and web development, StudyBuddy provides instant, accurate, and context-aware answers extracted directly from your study materials, textbooks, or reports.


## Key Features

**Intelligent Q&A**: Get answers and summaries from your PDFs using the power of OpenAI's language models.

**Secure Authentication**: User management and security handled seamlessly by Clerk.

**Vector Search**: Utilizes Pinecone for efficient and relevant document indexing and retrieval.

**Modern UI**: A clean, responsive, and visually appealing interface built with Next.js and Tailwind CSS.

**Scalable Architecture**: Serverless database powered by Neon and secure file storage with AWS S3.

**Subscription Model**: Integrated with Stripe for handling premium features and payment processing.


## Tech Stack

StudyBuddy is built with a cutting-edge and robust set of technologies, providing a high-performance, full-stack solution:

```
Category        Technology              Purpose

Frontend        Next.js, React,         The foundation for the highly performant 
                TypeScript              and scalable web application.
                
Styling         Tailwind CSS, clsx,     Utility-first CSS framework for rapid 
                tailwind-merge          and consistent styling.

Authentication  Clerk                   Secure, full-featured user authentication 
                                        and management.

Database        PostgreSQL, Neon        Reliable, scalable, and serverless relational 
                Database Serverless     database.

ORM             Drizzle ORM             TypeScript-first, lightweight ORM for elegant 
                                        and type-safe database interactions.

API/AI          OpenAI API              Core logic for natural language processing, 
                                        vector embeddings, and semantic search.

File Storage    AWS SDK (S3)            Secure and scalable object storage for PDF files.

Payments        Stripe                  Robust platform for handling subscriptions and payments.

Data Fetching   @tanstack/react-query,  Powerful tools for managing, caching, and 
                Axios                   synchronizing server-state in the frontend.
```

## Folder Structure

The repository follows a standard Next.js structure, organized to promote clarity and maintainability:

```
studybuddy/
├── .drizzle/          # Drizzle migration files
├── .next/             # Next.js build output
├── public/            # Static assets (images, favicon)
├── src/
│   ├── app/           # Main application routes and pages
│   │   ├── (auth)/    # Authentication routes (e.g., sign-in, sign-up)
│   │   ├── api/       # Next.js API Routes (serverless functions)
│   │   ├── components/  # Reusable UI components
│   │   ├── middleware.ts # Clerk middleware for route protection
│   │   └── layout.tsx # Root layout
│   ├── config/        # Configuration files (e.g., Stripe, Clerk settings)
│   ├── db/            # Drizzle ORM setup and schema definition
│   ├── lib/           # Utility functions, helpers, and third-party service connections
│   │   ├── aws.ts     # AWS S3 upload/download logic
│   │   ├── pinecone.ts# Pinecone vector indexing logic
│   │   └── utils.ts   # General utility functions
│   └── styles/        # Global styles and Tailwind configuration
├── .env.local.example # Example environment variables file
├── package.json
├── next.config.js
└── README.md          # This file
```

## Getting Started

Prerequisites

You will need the following accounts and keys:

- Node.js (v18+) and npm/yarn

- OpenAI API Key

- Pinecone API Key and Environment

- Clerk Integration Keys

- Stripe Publishable/Secret Keys

- AWS S3 Bucket and Access Keys

- Neon Database Connection URL

1. Installation

```
# Clone the repository
git clone [https://github.com/saurabhdhingra/studybuddy.git](https://github.com/saurabhdhingra/studybuddy.git)
cd studybuddy

# Install dependencies
npm install 
```


2. Environment Variables

Create a file named .env.local in the root directory and populate it with your keys (copying from .env.local.example):

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

# Database (Neon/PostgreSQL)
DATABASE_URL=your_neon_connection_string

# OpenAI
OPENAI_API_KEY=your_key

# Pinecone
PINECONE_API_KEY=your_key
PINECONE_ENVIRONMENT=your_env

# AWS S3
S3_ACCESS_KEY_ID=your_key
S3_SECRET_ACCESS_KEY=your_key
S3_BUCKET_NAME=your_bucket_name

# Stripe
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Database Setup

Run the following commands to push your Drizzle schema to your Neon database and generate migration files:

```
# Push schema to the database
npx drizzle-kit push:pg

# (Optional) Generate a migration
npx drizzle-kit generate:pg
```

4. Running the Application

```
# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

## Contribution

Contributions are always welcome! Feel free to open an issue or submit a pull request if you find a bug or have an idea for an improvement.

