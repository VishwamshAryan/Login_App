import React from 'react';

const InstagramLogin = () => {
  const clientId = 541956595240583; 
  const redirectUrl= "https://login-app.vercel.app/auth/redirect";
  const scope = "user_profile,user_media";
  const loginUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&response_type=code`;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login with Instagram</h2>
      <a href={loginUrl}>
        <button style={{ padding: "10px 20px", fontSize: "16px" }}>
          Login with Instagram
        </button>
      </a>
    </div>
  );
};

export default InstagramLogin;
