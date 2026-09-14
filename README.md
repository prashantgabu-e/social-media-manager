# Dare & Rise Social Planner

A Phase 1 internal social media planning app for Dare & Rise. It helps plan Instagram and Facebook content, organize content on a calendar, track content status, connect posts to products and campaigns, and track Drive links and publishing URLs.

## Tech Stack

- React, Vite, TypeScript and Tailwind CSS
- Firebase Authentication with Google sign-in
- Firebase Firestore
- React Router with `HashRouter` for GitHub Pages compatibility
- FullCalendar, React Hook Form, Zod, date-fns and Lucide React

## Prerequisites

- Node.js 22 or newer
- npm
- A Firebase project

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with your Firebase web app configuration. Do not commit real secrets.

## Firebase Setup

1. Create a Firebase project.
2. Add a Web App in Firebase project settings.
3. Copy the public web config values into `.env.local`.
4. Enable Firestore Database.
5. Enable Google Authentication.

## Google Authentication Setup

In Firebase Console, open Authentication, enable Google as a sign-in provider, and add your local and production domains under authorized domains.

For GitHub Pages, add:

```text
YOUR_GITHUB_USERNAME.github.io
```

## Firestore Setup

The app uses these collections:

- `users`
- `contentItems`
- `products`
- `campaigns`
- `settings`

Deploy the included `firestore.rules` file or paste it into Firebase Console.

## Environment Variables

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Firebase client config is public app configuration. Never add service-account credentials to this frontend.

## Development Commands

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Production Build

```bash
npm run build
```

The production output is generated in `dist`.

## GitHub Pages Deployment

The included workflow at `.github/workflows/deploy.yml` deploys the app to GitHub Pages from the `main` branch.

In repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**. Do not use the legacy "Deploy from a branch" `/docs` option for this app.

Add these repository secrets in GitHub:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Then enable GitHub Pages with GitHub Actions as the source. The app uses hash-based routing, so refreshing nested routes works on GitHub Pages.

## Firestore Security Rules

The included Phase 1 rules allow authenticated users to access planner data and block unauthenticated access. The structure is intentionally simple so approved-user or role checks can be added later.

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    match /users/{userId} {
      allow read, write: if signedIn();
    }

    match /contentItems/{itemId} {
      allow read, write: if signedIn();
    }

    match /products/{productId} {
      allow read, write: if signedIn();
    }

    match /campaigns/{campaignId} {
      allow read, write: if signedIn();
    }

    match /settings/{settingId} {
      allow read, write: if signedIn();
    }
  }
}
```

## Demo Data

Optional demo data is available from Settings with the "Add Demo Data" button. It creates several products, two campaigns, and approximately ten content plans. Nothing is inserted automatically.

## Known Phase 1 Limitations

- No Instagram or Facebook publishing
- No Meta Graph API integration
- No social account connection
- No Firebase Storage, image uploads or video uploads
- No AI generation, notifications, analytics, payments, comments or complex roles
- Media remains externally stored; only Google Drive URLs are saved
