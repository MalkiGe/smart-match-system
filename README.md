# SmartMatch – Full Stack Matching Platform 

Full Stack matching platform built with React, Node.js, Express and MongoDB.

---

## Overview

SmartMatch is a Full Stack web application that allows users to create profiles, define preferences, receive compatible matches, send interests, approve requests and transfer approved matches to administrator handling.

The project was developed collaboratively as part of a Full Stack development project, with a strong focus on matching workflows, frontend-backend integration, modular architecture and real-world system behavior.

The platform simulates a complete matching workflow including authentication, profile management, approval flows, file sharing and admin management.

---

## Features

- User registration & login
- JWT authentication
- Protected routes
- Personal profile management
- Preference-based matching
- Dynamic match filtering
- Interests & approval workflow
- Resume PDF upload
- Profile image upload
- Conditional profile exposure
- Admin dashboard & management
- REST API architecture

---

## Tech Stack

### Frontend
- React
- Vite
- Material UI (MUI)
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)

### File Upload
- Multer

---

## System Architecture

The application follows a modular Full Stack architecture:

```text
Client (React)
   ↓
REST API (Express)
   ↓
Business Logic Layer (Services)
   ↓
MongoDB Database
```

### Backend Structure
- Routes
- Controllers
- Services
- Models
- Middleware

### Frontend Structure
- Pages
- Components
- API Services
- Protected Routes
- Reusable UI Components

---

## Authentication & Authorization

The system uses JWT-based authentication with protected routes and role-based authorization.

### Authentication Flow
1. User logs in
2. Server validates credentials
3. JWT token is generated
4. Token is stored locally
5. Protected routes validate access permissions

The application supports:
- Regular users
- Admin users

---

## Matching Workflow

The platform includes a complete matching flow:

1. Users create profiles and preferences
2. The server generates compatible matches
3. Users send interests
4. Interests can be approved or rejected
5. After mutual approval, additional profile data becomes available
6. Approved matches can be transferred to administrator handling

---

## Installation

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
node server.js
```

---

## Environment Variables

### Client `.env`

```env
VITE_API_URL=http://localhost:3000
```

### Server `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

---

## Project Structure

```text
SmartMatch/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── api/
│   │   └── routes/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
```

---

## My Responsibilities

This project was developed collaboratively as part of a Full Stack development project.

My primary responsibilities included:

- Matching system implementation
- Interests workflow & approval logic
- Frontend development and UI flows
- API integration between client and server
- Backend business logic
- Admin workflow implementation
- System synchronization and debugging
- UI/UX improvements
- Feature integration and stabilization

I was heavily involved in the core application flow, frontend-backend integration and overall system behavior.

---

## Screenshots

_Add screenshots here_

---

## Deployment

The application architecture is deployment-ready and can be deployed using platforms such as:
- Render
- Railway
- Vercel
- MongoDB Atlas

---

## Developer

**Hani Gdalovich**  
Full Stack Developer  
React | Node.js | Express | MongoDB
