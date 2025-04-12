// backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 1. Exchange code for access token
app.post("/api/instagram/token", async (req, res) => {
  const { code } = req.body;

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.INSTAGRAM_CLIENT_ID);
    params.append("client_secret", process.env.INSTAGRAM_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", process.env.INSTAGRAM_REDIRECT_URI);
    params.append("code", code);

    const response = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      params
    );

    res.status(200).json(response.data); // contains access_token and user_id
  } catch (error) {
    console.error("Error exchanging code:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange token" });
  }
});

// 2. Get profile info
app.post("/api/instagram/profile", async (req, res) => {
  const { access_token } = req.body;

  try {
    const profileRes = await axios.get(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${access_token}`
    );

    res.status(200).json(profileRes.data);
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 3. Get media feed
app.post("/api/instagram/media", async (req, res) => {
  const { access_token } = req.body;

  try {
    const mediaRes = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=${access_token}`
    );

    res.status(200).json(mediaRes.data);
  } catch (error) {
    console.error("Error fetching media:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// 4. Get comments for a media post
app.post("/api/instagram/comments", async (req, res) => {
  const { access_token, media_id } = req.body;

  try {
    const commentRes = await axios.get(
      `https://graph.facebook.com/v19.0/${media_id}/comments?access_token=${access_token}`
    );
    res.status(200).json(commentRes.data);
  } catch (error) {
    console.error("Error fetching comments:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// 5. Reply to a comment
app.post("/api/instagram/reply", async (req, res) => {
  const { access_token, comment_id, message } = req.body;

  try {
    const replyRes = await axios.post(
      `https://graph.facebook.com/v19.0/${comment_id}/replies`,
      { message, access_token }
    );
    res.status(200).json(replyRes.data);
  } catch (error) {
    console.error("Error posting reply:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to reply to comment" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
