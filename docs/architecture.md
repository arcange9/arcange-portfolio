# Architecture

This document will describe the public web app, admin app, API, authentication, database, media storage, and deployment architecture.

## Applications

- Web: React + Vite
- Admin: React dashboard
- API: Node.js + Express

## Data

MongoDB will store CMS content and admin identity records.

## Authentication

Google OAuth with server-side authorization and an authorized-admin-email allowlist.
