/**
 * Home.jsx
 * ----------------------------------------------
 * This is the root/main view that determines what to show:
 * - If a user is logged in → show Timer app
 * - If not → show Login/Register form
 * Author: Dario Santiago Lopez and ChatGPT 
 * Course: CSC 332 - Mobile & Pervasive Computing
 * Partner: Anthony Roca 
 * Date: April 11, 2025 
 * ----------------------------------------------
 */

import React, { useState } from 'react';
import LoginRegister from './LoginRegister'; // Auth component
import Timer from './Timer'; // Workout timer component

const Home = () => {
  // If username is set, user is logged in
  const [username, setUsername] = useState(null);

  return (
    <div>
      {/* If logged in, show workout app */}
      {username ? (
        <Timer username={username} />
      ) : (
        // If not logged in, show login/register form
        <LoginRegister onLoginSuccess={setUsername} />
      )}
    </div>
  );
};

export default Home;
