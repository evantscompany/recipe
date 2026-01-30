import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      navigate('/');
      window.location.reload();
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
        {/* 상단 섹션 */}
        <div className="nav-top-section">
          <Link to="/" className="nav-logo">RECIPE</Link>
          
          <div className="nav-menu">
            {/* NavLink를 사용하여 활성화 상태 자동 처리 */}
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} end>
              <span>🏠</span> 홈
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <span>🔍</span> 탐색
            </NavLink>
            
            {token && (
              <>
                <NavLink to="/saved" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <span>❤️</span> 저장됨
                </NavLink>
                <NavLink to="/my-recipes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  <span>📋</span> 내 레시피
                </NavLink>
                {/* 📱 모바일 하단바에서 한 자리를 차지할 로그아웃 버튼 */}
                <button className="nav-link mobile-only-logout" onClick={handleLogout}>
                  <span>🚪</span> 로그아웃
                </button>
              </>
            )}

            {!token && (
              <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <span>🔑</span> 로그인
              </NavLink>
            )}
            
            <hr className="nav-divider" />
            
            <NavLink to="/write" className={({ isActive }) => isActive ? "nav-link pink active" : "nav-link pink"}>
              <span>➕</span> 작성
            </NavLink>
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