const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const IG_TOKEN = process.env.IG_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID || '17841468676932133';
const FB_PAGE_ID = process.env.FB_PAGE_ID || '632210116648673';
const API_VERSION = 'v22.0';
const BASE = `https://graph.facebook.com/${API_VERSION}`;

async function igFetch(endpoint) {
  const url = `${BASE}/${endpoint}${endpoint.includes('?') ? '&' : '?'}access_token=${IG_TOKEN}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json;
}

// Profile — followers, username, media count
app.get('/api/profile', async (req, res) => {
  try {
    const data = await igFetch(`${IG_USER_ID}?fields=username,followers_count,media_count,profile_picture_url,name`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Posts with engagement
app.get('/api/media', async (req, res) => {
  try {
    const data = await igFetch(`${IG_USER_ID}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,insights.metric(reach,impressions,saved)&limit=20`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Account-level insights — reach and impressions
app.get('/api/insights', async (req, res) => {
  try {
    const since = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const until = Math.floor(Date.now() / 1000);
    const data = await igFetch(`${IG_USER_ID}/insights?metric=reach,impressions,follower_count&period=day&since=${since}&until=${until}`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Page-level insights — views, engagement
app.get('/api/page-insights', async (req, res) => {
  try {
    const data = await igFetch(`${FB_PAGE_ID}/insights?metric=page_views_total,page_post_engagements,page_impressions_unique,page_fan_adds_unique&period=day`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Follower count
app.get('/api/followers', async (req, res) => {
  try {
    const data = await igFetch(`${FB_PAGE_ID}?fields=fan_count,followers_count`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Best posting times
app.get('/api/best-times', async (req, res) => {
  try {
    const data = await igFetch(`${FB_PAGE_ID}/insights?metric=page_fans_online_per_day&period=week`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', token: IG_TOKEN ? 'set' : 'missing' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Creamabell Dashboard running on port ${PORT}`));
