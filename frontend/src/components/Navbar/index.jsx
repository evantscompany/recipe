import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss'

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      window.location.href = "/";
    }
  };

  useEffect(() => {
    if (!token) return;

    const timer = setInterval(() => {
      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        const diff = payload.exp - Math.floor(Date.now() / 1000);

        if (diff <= 0) {
          clearInterval(timer);
          alert("세션이 만료되었습니다.");
          handleLogout();
        } else {
          const m = Math.floor(diff / 60);
          const s = diff % 60;
          setTimeLeft(`${m}:${s < 10 ? `0${s}` : s}`);
        }
      } catch (e) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [token]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">홈</Link>
          <Link to="/write" className="nav-link">글쓰기</Link>
        </div>

        <div className="nav-right">
          {token ? (
            <>
              <div className="nav-timer">⏱ {timeLeft}</div>
              <span className="nav-user">👤 {username}님</span>
              <button onClick={handleLogout} className="logout-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link pink">로그인</Link>
              <Link to="/signup" className="nav-link pink">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;