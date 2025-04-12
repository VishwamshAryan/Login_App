import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const AuthRedirect = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Exchanging code for token...");
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState([]);
  const [comments, setComments] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      axios.post('http://localhost:5000/api/instagram/token', { code })
        .then(res => {
          const token = res.data.access_token;
          setAccessToken(token);
          setMessage("Access token received successfully!");

          axios.post('http://localhost:5000/api/instagram/profile', { access_token: token })
            .then(profileRes => {
              setProfile(profileRes.data);
              setMessage(`Welcome, ${profileRes.data.username} (${profileRes.data.account_type})`);
            });

          axios.post('http://localhost:5000/api/instagram/media', { access_token: token })
            .then(mediaRes => {
              const mediaData = mediaRes.data.data;
              setMedia(mediaData);

              // get comments for the first media item
              if (mediaData.length > 0) {
                axios.post('http://localhost:5000/api/instagram/comments', {
                  access_token: token,
                  media_id: mediaData[0].id
                }).then(commentRes => {
                  setComments(commentRes.data.data);
                });
              }
            });

        })
        .catch(err => {
          setMessage("Failed to exchange token");
          console.error(err);
        });
    } else {
      setMessage("No code found in URL");
    }
  }, [searchParams]);

  const handleReply = (commentId) => {
    axios.post('http://localhost:5000/api/instagram/reply', {
      access_token: accessToken,
      comment_id: commentId,
      message: replyText[commentId]
    }).then(() => {
      alert("Reply sent!");
      setReplyText(prev => ({ ...prev, [commentId]: "" }));
    }).catch(() => {
      alert("Failed to send reply.");
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>{message}</h2>

      {profile && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>User ID:</strong> {profile.id}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Account Type:</strong> {profile.account_type}</p>
        </div>
      )}

      {media.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>User Media Feed</h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            padding: "20px"
          }}>
            {media.map((item) => (
              <div key={item.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                {item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM" ? (
                  <img src={item.media_url} alt="insta" style={{ width: "100%" }} />
                ) : (
                  <video controls style={{ width: "100%" }}>
                    <source src={item.media_url} type="video/mp4" />
                  </video>
                )}
                <p><strong>Type:</strong> {item.media_type}</p>
                {item.caption && <p><strong>Caption:</strong> {item.caption}</p>}
                <p><strong>Date:</strong> {new Date(item.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {comments.length > 0 && (
        <div style={{ marginTop: "40px", textAlign: "left", padding: "0 20px" }}>
          <h3>Comments on Latest Post</h3>
          {comments.map((comment) => (
            <div key={comment.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p><strong>{comment.username || 'User'}:</strong> {comment.text}</p>
              <input
                type="text"
                placeholder="Reply..."
                value={replyText[comment.id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))
                }
              />
              <button onClick={() => handleReply(comment.id)}>Reply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthRedirect;
