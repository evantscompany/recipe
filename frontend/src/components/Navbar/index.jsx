import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss'

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
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
        {/* 상단 로고 및 메인 메뉴 */}
        <div className="nav-top-section">
          <Link to="/" className="nav-logo">RECIPE</Link>
          <div className="nav-menu">
            <Link to="/" className="nav-link active"><span>🏠</span> 홈</Link>
            <Link to="/explore" className="nav-link"><span>🔍</span> 탐색</Link>
            
            {/* 로그인했을 때만 보이는 개인화 메뉴 */}
            {token && (
              <>
                <Link to="/saved" className="nav-link"><span>❤️</span> 저장됨</Link>
                <Link to="/my-recipes" className="nav-link"><span>📋</span> 내 레시피</Link>
              </>
            )}
            
            <hr className="nav-divider" />
            
            {/* 중요 액션 버튼 */}
            <Link to="/write" className="nav-link pink"><span>➕</span> 레시피 만들기</Link>
          </div>
        </div>

        {/* 하단 유저/상태 영역 */}
        <div className="nav-bottom-section">
          {token ? (
            <div className="nav-user-card">
              <div className="nav-timer">
                <span className="label">남은 세션</span>
                <span className="time">{timeLeft}</span>
              </div>
              <div className="user-info">
                <span className="username">👤 {username}님</span>
                <button onClick={handleLogout} className="logout-btn">로그아웃</button>
              </div>
            </div>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login" className="nav-link auth">로그인</Link>
              <Link to="/signup" className="nav-link auth border">회원가입</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;