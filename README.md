# TaskFlow

A Task Management application built with **Angular**, **Ionic**, and a custom **Node.js REST API**.

This project started as a learning experience and gradually evolved into a production-ready application where I continuously apply new concepts, 
improve the architecture, and experiment with modern web development practices.
---

## Live Demo

🚀 Frontend:
[(Your deployment link)](https://usuarios-kanban-demo.web.app/)

⚙️ Backend API:
usuarios-api-alberto-d8czbwdzctapcddd.mexicocentral-01.azurewebsites.net

---

## Preview

https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline1-ezgif.com-video-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81M2ZlNTlmZS1hN2RkLTRkMDQtODU2Zi02NzE0YTgwZTgyYWIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjYXB0dXJhcy9UaW1lbGluZTEtZXpnaWYuY29tLXZpZGVvLXRvLXdlYnAtY29udmVydGVyLndlYnAiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgyNjkyNjgyLCJleHAiOjE3ODUyODQ2ODJ9.TcTSgO8sd0sHMX9bIoogSW4nNZohHochR_H1F5m5UMw

Project Overview

<!-- GIF 2 -->

Authentication

<!-- GIF 3 -->

Dashboard

<!-- GIF 4 -->

Task Management

<!-- GIF 5 -->

Kanban Drag & Drop

<!-- GIF 6 -->

Responsive Design

<!-- GIF 7 -->

Dark Theme / Extra Features

---

## Features

- JWT Authentication
- Protected Routes
- Role-based Access
- Task CRUD
- Kanban Board
- Drag & Drop
- Dashboard
- User Profile
- Responsive Layout
- Dark Mode
- REST API Integration
- Loading States
- Toast Notifications
- Form Validation

---

## Tech Stack

### Frontend

- Angular 20
- Ionic 8
- TypeScript
- RxJS
- Angular CDK Drag & Drop
- Capacitor

### Backend

- Node.js
- Express
- PostgreSQL
- Supabase
- JWT Authentication
- Bcrypt

### Deployment

- Firebase Hosting
- Render (or your hosting provider)

---

## Architecture

```
src
│
├── core
│   ├── guards
│   ├── interceptors
│   ├── services
│   └── models
│
├── shared
│   ├── components
│   ├── directives
│   └── pipes
│
├── features
│   ├── auth
│   ├── dashboard
│   ├── tasks
│   ├── profile
│   └── settings
│
└── assets
```

The application follows a modular architecture to improve scalability, maintainability and code organization.

---

## Authentication

Authentication is implemented using JSON Web Tokens (JWT).

The application includes:

- Login
- Protected Routes
- Route Guards
- Token Validation
- Persistent Session
- Secure Password Hashing

---

## Kanban Board

The task board supports drag and drop between columns using Angular CDK.

Users can organize their work by moving tasks across different workflow stages.

---

## REST API

The frontend communicates with a custom REST API built with Express.

Main modules include:

- Authentication
- Users
- Tasks
- Dashboard

---

## Installation

Clone the repository

```bash
git clone https://github.com/yourusername/taskflow.git
```

Install dependencies

```bash
npm install
```

Start development server

```bash
ionic serve
```

---

## Environment Variables

Create an `.env` file (backend) and configure:

```
JWT_SECRET=

SUPABASE_URL=

SUPABASE_KEY=

DATABASE_URL=
```

Frontend environment:

```
API_URL=
```

---

## Roadmap

- Email Notifications
- Push Notifications
- File Attachments
- Calendar View
- Activity Log
- Unit Testing
- Docker Support
- PWA Support
- Internationalization

---

## What I Learned

Building this project allowed me to gain practical experience with:

- Angular Architecture
- Ionic Development
- JWT Authentication
- REST APIs
- PostgreSQL
- Supabase
- Route Guards
- State Management
- Responsive Design
- Drag & Drop Interfaces
- Firebase Deployment
- Production Builds

---

## Why I Built This

Instead of creating another basic CRUD application, I wanted to build a complete project that resembles a real-world product.

This application has become my playground for learning, experimenting, and improving as a Full Stack Developer while applying good development practices.

---

## Author

Alberto Valdez López

GitHub:
(your GitHub)

LinkedIn:
(your LinkedIn)
