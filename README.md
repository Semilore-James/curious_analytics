# Creamabell Analytics Dashboard — Setup Guide

## What this is
A live Instagram analytics dashboard. The backend (server.js) calls the Instagram API
securely using your token stored as an environment variable. The frontend (public/index.html)
displays your data beautifully. Nobody ever sees your token.

---

## CHECKLIST — Complete in order

### PART 1 — GitHub (stores your code)
- [ ] Go to github.com and create a free account
- [ ] Click the + icon top right → New Repository
- [ ] Name it: creamabell-dashboard
- [ ] Set it to PUBLIC (required for free Render hosting)
- [ ] Click Create Repository
- [ ] On the next screen click "uploading an existing file"
- [ ] Upload ALL files: server.js, package.json, .gitignore, .env.example, and the public/ folder
- [ ] Click Commit Changes

### PART 2 — Render (runs your server)
- [ ] Go to render.com and sign up with your GitHub account
- [ ] Click New → Web Service
- [ ] Connect your GitHub repo: creamabell-dashboard
- [ ] Fill in these settings:
        Name:            creamabell-dashboard
        Runtime:         Node
        Build Command:   npm install
        Start Command:   node server.js
        Instance Type:   Free
- [ ] Click Advanced → Add Environment Variable → add these one by one:
        Key: IG_TOKEN      Value: your_page_access_token
        Key: IG_USER_ID    Value: 17841468676932133
        Key: FB_PAGE_ID    Value: 632210116648673
- [ ] Click Create Web Service
- [ ] Wait 2-3 minutes for it to deploy
- [ ] Click the URL Render gives you — your dashboard is live

### PART 3 — Verify it works
- [ ] Open your Render URL
- [ ] Dashboard loads and shows your Instagram data
- [ ] Green dot is active in the top right
- [ ] Posts table shows your recent posts
- [ ] Heatmap is populated

### PART 4 — Token refresh (every 60 days)
- [ ] Set a calendar reminder for 55 days from today
- [ ] When it fires: go to Graph API Explorer → generate new Page token
- [ ] Go to Render → your service → Environment → update IG_TOKEN value
- [ ] Click Save — Render redeploys automatically in 1 minute

---

## File structure
creamabell-dashboard/
├── server.js          ← backend (handles API calls, keeps token safe)
├── package.json       ← dependencies
├── .gitignore         ← stops .env from being uploaded to GitHub
├── .env.example       ← template showing what env vars are needed
└── public/
    └── index.html     ← the dashboard frontend

---

## API Endpoints (what the server exposes)
GET /api/profile       → followers, username, media count
GET /api/media         → posts with likes, comments, saves, reach
GET /api/insights      → account-level reach and impressions
GET /api/page-insights → Facebook page views, engagement
GET /api/best-times    → when your audience is most active
GET /api/health        → check if server and token are working

---

## Troubleshooting
Dashboard shows error     → Check IG_TOKEN is set correctly in Render environment variables
First load is slow        → Normal — Render free tier sleeps after 15min inactivity, wakes on request
Posts show but no reach   → Your token may be missing instagram_manage_insights permission
Empty posts               → Check IG_USER_ID matches your actual Instagram account ID
