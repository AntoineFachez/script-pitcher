# 🎬 Script-Pitcher

A **secure, full-stack application** built on **Next.js 14+** and **Firebase** designed for managing creative projects, scripts, characters, and team collaboration. This project utilizes a sophisticated **hybrid authentication system** combining Firebase Auth with NextAuth.js using a custom JWT synchronization strategy.

## ✨ Features

Based on the project structure, Script-Pitcher offers the following core functionalities:

- **Project & CRUD Management:** Full **Create, Read, Update, and Delete (CRUD)** operations for core entities (Projects, Characters, Episodes, Users).

- **Dynamic Script Viewer & Editor:** Transforms static PDF scripts into an **interactive webpage** via the dedicated `pdfviewer` components (e.g., `PDFEditor.js`). This provides a collaborative environment featuring **source-text linking and annotation**, allowing users to link extracted data (like character objects) directly back to their appearance in the script using spatial coordinates.

- **Secure File Handling & Processing Pipeline:** Integration with **Google Cloud Storage/Firebase Storage** for secure file uploads (`api/uploads/initiate`) and management. Script processing is a dedicated, multi-stage microservice pipeline that transforms the static PDF into structured, searchable data:

  - The **`pdf-processor`** service performs **OCR, text structuring, and extracts spatial coordinates (bounding boxes)** for every element.

- **AI/LLM Integration:** Utilizes external Python services (via Cloud Run/Functions) for advanced processing, specifically leveraging **Gemini/LLM analysis** to perform tasks like **auto-extracting characters and episodes** from the structured script data.

- **Real-time Collaboration:** Uses **Firestore listeners** for real-time synchronization of project data and user summaries, ensuring collaborators are always viewing the latest script breakdown.

- **Plugin Integration:** The application is designed to be fully embeddable via an `<iframe>` as a **full-featured plugin** (`Skript Pitcher Plugin`), allowing users to access the entire dynamic interface and collaboration tools directly within external creative platforms or documents.

- **Serverless Backend:** Uses **Firebase Cloud Functions** for critical backend tasks, such as:

  - Processing user invitations and syncing project roles (e.g., owner, editor).

  - Updating user project summaries upon changes (e.g., `onProjectWrite`).

- **Robust Authentication:** Secure session management using **NextAuth.js JWT strategy** synced with Firebase Auth for client-side SDK access.

## ⚙️ Tech Stack

| Category          | Technology                                     | Purpose                                                                                                     |
| ----------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend**      | Next.js (App Router), MUI (Material-UI)        | Full-stack framework with React, component library for fast UI development.                                 |
| **Script Viewer** | `pdfviewer` components (e.g., `PDFEditor.js`)  | Provides the interactive, dynamic script editing and source-text linking view.                              |
| **Backend/Auth**  | Firebase Auth, NextAuth.js, Firebase Admin SDK | Primary identity provider and secure session management (Hybrid JWT Strategy).                              |
| **Database**      | Google Firestore                               | Primary NoSQL database for project data and real-time collaboration.                                        |
| **Storage**       | Firebase Storage                               | Used for secure file storage (scripts, avatars, project images).                                            |
| **Serverless**    | Firebase Cloud Functions (Node.js)             | Backend event triggers and database synchronization.                                                        |
| **Microservices** | Cloud Run / Cloud Functions (Python, jose)     | **`pdf-processor`** (OCR/Structuring), **`gemini-processor`** (LLM analysis), and JWT signing/verification. |

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

### 3. Google Cloud / Firebase Structure and Configuration

The Script-Pitcher project is built for deployment on Google Cloud and Firebase, utilizing several core services:

#### a. Deployment and Hosting

- **Firebase Hosting (`firebase.json`, `.firebaserc`):** Used for deploying the Next.js frontend and setting up site configurations.

- **App Hosting (`apphosting.production.yaml`):** Implies the Next.js application leverages Google Cloud's App Hosting service (potentially via Firebase Hosting extensions or direct Google Cloud Run/App Engine setup) for server-side rendering (SSR) and API routing.

- **Serverless Backend:** **Firebase Cloud Functions** (Node.js) and isolated **Microservices** on **Cloud Run** or Google Cloud Functions (Python) handle specific, intensive tasks like PDF processing and LLM analysis.

#### b. Environment Variables and Security Keys (`.env.local` snippet)

The application requires specific environment variables for both the client (public) and server (admin) environments:

| Variable Type                       | Purpose                                                                                                                                                                            | Key Examples                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Client Firebase Config** (Public) | Used by the Next.js client for connecting to Firebase services (e.g., Firestore, Storage, Auth).                                                                                   | `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| **NextAuth Configuration** (Server) | Critical for session security and NextAuth.js JWT operations.                                                                                                                      | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`                                  |
| **Firebase Admin Config** (Server)  | Provides administrative access for the backend (Cloud Functions, Next.js APIs) to perform privileged actions (e.g., managing user tokens, inviting users, direct database access). | `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON object)                       |

#### c. Data Storage and Security

- **Google Firestore:** The primary database for project data, characters, and episodes, utilizing real-time listeners. Access is governed by **Firestore Security Rules** (`firestore.rules`).

- **Firebase Storage:** Used for secure file storage (scripts, media), governed by **Storage Security Rules** (`storage.rules`).

- **GCloud Ignore (`.gcloudignore`):** Ensures sensitive files (like `node_modules` or local credentials) are excluded when deploying the Cloud Functions and other Python microservices.

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
