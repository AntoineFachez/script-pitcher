# Project Analysis & Improvement Suggestions

## Overview

This analysis is based on the current state of the `script-pitcher` repository. The project is a sophisticated Next.js application leveraging Firebase for backend services. It is currently in a transition phase, moving towards modern Next.js patterns (Server Actions) and a modular Widget-based UI.

## 1. Architecture & Code Organization

### 🔄 Complete Migration to Server Actions

**Current State:** The project currently mixes traditional API routes (`src/app/api`) with newer Server Actions (`src/lib/actions`).
**Suggestion:** Prioritize the complete migration of all data mutations to Server Actions.

- **Action:** Convert remaining routes in `src/app/api` (e.g., `characters`, `episodes`, `users`) to functions in `src/lib/actions`.
- **Benefit:** Reduces code duplication, improves type safety (even in JS), and simplifies the mental model by co-locating data logic.
- **Cleanup:** Delete `src/app/api` once migration is complete to remove "dead" code paths.

### 🧩 Standardize Widget Patterns

**Current State:** The `src/widgets` directory and `src/lib/widgetConfigs` (JSON) suggest a config-driven UI.
**Suggestion:** Ensure strict adherence to this pattern.

- **Action:** Verify that all new feature development happens within `src/widgets`.
- **Action:** Document the schema for `*.widgetConfig.json` files to ensure consistency as the team grows.

## 2. Security & Robustness

### 🔒 Hardening Firestore Rules

**Current State:** `firestore.rules` contains `TODO` items and some permissive rules (e.g., `allow list: if request.auth != null`).
**Suggestion:** Tighten security rules to prevent data leaks.

- **Action:** Replace broad `list` permissions with resource-scoped checks or rely on "parent" document lookups (e.g., only allow listing projects listed in a user's profile).
- **Action:** Address the `TODO` regarding "viewers not seeing other members" by implementing conditional field reads or separating sensitive member data into a subcollection with stricter rules.

### 🛡️ Type Safety (TypeScript Adoption)

**Current State:** The README claims "Type Safety," but the codebase is primarily JavaScript (`.js`). JSDoc is used but offers limited compile-time guarantees.
**Suggestion:** Migrate to TypeScript.

- **Action:** Rename files to `.ts` / `.tsx` incrementally. Start with shared libraries (`src/lib`) and core components.
- **Benefit:** True type safety, better IDE autocompletion, and drastically reduced runtime errors, aligning with the "secure, full-stack" value proposition.

## 3. Testing & Quality Assurance

### 🧪 Adapt Testing Strategy

**Current State:** Existing tests (`*.test.js`) largely target API routes (`src/app/api`).
**Suggestion:** Shift testing focus to Server Actions and Widgets.

- **Action:** Write unit tests for new Server Actions in `src/lib/actions`.
- **Action:** Implement component tests for Widgets using React Testing Library, mocking the data hooks.
- **Action:** Ensure `jest` is configured to handle Server Actions (which are async functions).

## 4. Dependencies & Maintenance

### 📦 Dependency Review

**Current State:**

- `next-auth` v4 is used.
- `react` 19.1.0 is listed.
  **Suggestion:**
- **NextAuth:** Consider upgrading to NextAuth v5 (Auth.js) for better compatibility with Next.js App Router and Server Components.
- **React:** Ensure the React version is a stable release compatible with all dependencies (MUI, etc.).

## 5. Documentation

### 📚 Keep README in Sync

**Current State:** The README is detailed but claims "Type Safety" which is currently only partially true via JSDoc.
**Suggestion:** Update the README to reflect the current "Hybrid/Transition" state or the roadmap to TypeScript.

---

**Recommended Immediate Next Step:**
Start by migrating one of the remaining complex API routes (e.g., `src/app/api/characters`) to a Server Action and writing a test for it to establish the pattern for the rest of the migration.
