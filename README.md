# Instagram OAuth App – Empathy Technologies Assessment

This is a full-stack MERN application that integrates with the **Instagram Graph API** to authenticate users, display their profile and media feed, and enable comment replies on posts.

### Live Demo
[soon to be deployed on Vercel]

### Loom Video
[soon to make a demo walkthrough]

## Features

| Feature | Description |
| Instagram Login | Secure OAuth 2.0 login via Instagram |
| Profile Info | Displays user's username, ID, and account type |
| Media Feed | Shows images/videos with captions and timestamps |
| Comments | Fetches comments from the latest post |
| Reply to Comments | Allows user to reply directly to comments via API |
| Backend Auth | Uses Node.js server to handle token exchange and Graph API requests |

## Tech Stack
- React (frontend)
- Node.js + Express (backend)
- Instagram Graph API
- Facebook Developer App (OAuth client)
- Axios for API calls
- Vercel (for deployment)
  
## 🛠️ Setup (Local)

```bash
# Backend
cd backend
npm install
touch .env   # Add your App ID & Secret
node server.js

# Frontend
cd instagram-app
npm install
npm start
