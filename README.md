# This README.md provides an overview, setup instructions, and deployment guide for your Script-Pitcher project.

# 🎬 Script-Pitcher

A **secure, full-stack application** built on **Next.js 14+** and **Firebase** designed for managing creative projects, scripts, characters, and team collaboration. This project utilizes a sophisticated **hybrid authentication system** combining Firebase Auth with NextAuth.js using a custom JWT synchronization strategy.

## ✨ Features

Based on the project structure, Script-Pitcher offers the following core functionalities:

- **Project & CRUD Management:** Full **Create, Read, Update, and Delete (CRUD)** operations for core entities (Projects, Characters, Episodes, Users).

- **Secure File Handling:** Integration with **Google Cloud Storage/Firebase Storage** for secure file uploads (`api/uploads/initiate`) and management, including PDF script processing via dedicated microservices.

- **Real-time Collaboration:** Uses **Firestore listeners** for real-time synchronization of project data and user summaries.

- **Serverless Backend:** Uses **Firebase Cloud Functions** for critical backend tasks, such as:

  - Processing user invitations and syncing project roles (e.g., owner, editor).

  - Updating user project summaries upon changes (e.g., `onProjectWrite`).

- **AI/LLM Integration:** Utilizes external Python services (via Cloud Run/Functions) for advanced processing, likely auto-extracting data like characters and episodes from uploaded scripts.

- **Robust Authentication:** Secure session management using **NextAuth.js JWT strategy** synced with Firebase Auth for client-side SDK access.

## ⚙️ Tech Stack

| Category          | Technology                                     | Purpose                                                                        |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| **Frontend**      | Next.js (App Router), MUI (Material-UI)        | Full-stack framework with React, component library for fast UI development.    |
| **Backend/Auth**  | Firebase Auth, NextAuth.js, Firebase Admin SDK | Primary identity provider and secure session management (Hybrid JWT Strategy). |
| **Database**      | Google Firestore                               | Primary NoSQL database.                                                        |
| **Storage**       | Firebase Storage                               | Used for file storage (scripts, avatars, project images).                      |
| **Serverless**    | Firebase Cloud Functions (Node.js)             | Backend event triggers and database synchronization.                           |
| **Microservices** | Cloud Run / Cloud Functions (Python, jose)     | PDF processing, Gemini/LLM analysis, and JWT signing/verification.             |

## 🚀 Setup and Installation

### Prerequisites

- **Node.js & npm:** (Node v18+ recommended)

- **Firebase CLI:** `npm install -g firebase-tools`

- **Firebase Project:** A Google Cloud/Firebase project must be set up.

### Local Environment Configuration

1. **Clone the repository:**

   ```
   git clone [YOUR_REPO_URL]
   cd script-pitcher
   ```

2. **Install dependencies:**

   ```
   npm install
   (cd functions && npm install)
   ```

   > Ensure your `package-lock.json` is always in sync with `npm install` before deploying.

3. **Create `.env.local`** in the project root and add the required variables.

   ```
   # .env.local

   # NEXTAUTH CONFIGURATION (CRITICAL for session security)
   NEXTAUTH_SECRET="YOUR_LONG_RANDOM_SECRET_KEY"
   NEXTAUTH_URL="http://localhost:3000"

   # GOOGLE/NEXTAUTH PROVIDER (Client)
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."

   # FIREBASE CLIENT CONFIG (src/lib/firebase/firebaseConfig.js)
   NEXT_PUBLIC_FIREBASE_API_KEY="..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="script-pitcher"
   # ... other client config variables

   # FIREBASE ADMIN CONFIG (For Cloud Functions/Admin SDK access)
   # This must be obtained from a Service Account JSON file.
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
   ```

### Running Locally

To start the Next.js development server:

```
npm run dev
```

## ☁️ Deployment Guide

### 1. Deploy Firebase Functions

Navigate to your `functions` directory and deploy your Cloud Functions.

```
cd functions
firebase deploy --only functions
```

### 2. Deploy Next.js Application

Use Vercel, Netlify, or another Node.js hosting service. Ensure all `NEXTAUTH` and `NEXT_PUBLIC_FIREBASE` variables from your `.env.local` are set as environment variables in your deployment settings.

**Example (Vercel):**
Connect your GitHub repository to Vercel and set the environment variables via the dashboard. Vercel automatically detects the Next.js framework and handles deployment.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.

2. Create your feature branch (`git checkout -b feature/AmazingFeature`).

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).

4. Push to the branch (`git push origin feature/AmazingFeature`).

5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

**Project Status:** Active Development
**Contact:** [Your Contact Email]
