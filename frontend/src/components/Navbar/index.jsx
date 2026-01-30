import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // 모바일 메뉴 상태
  const [timeLeft, setTimeLeft] = useState("");
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  // 메뉴 닫기용 함수
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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
    <>
      {/* 📱 모바일 전용 플로팅 버튼 */}
      <button className={`nav-mobile-fab ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* 메뉴 열렸을 때 배경 어둡게 */}
      {isOpen && <div className="nav-mobile-overlay" onClick={closeMenu}></div>}

      <nav className={`navbar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="nav-container">
          <div className="nav-top-section">
            <Link to="/" className="nav-logo" onClick={closeMenu}>RECIPE</Link>
            
            <div className="nav-menu">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu} end>
                <span>🏠</span> 홈
              </NavLink>
              <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                <span>🔍</span> 탐색
              </NavLink>
              
              {token && (
                <>
                  <NavLink to="/saved" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                    <span>❤️</span> 저장됨
                  </NavLink>
                  <NavLink to="/my-recipes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                    <span>📋</span> 내 레시피
                  </NavLink>
                  <button className="nav-link mobile-only-logout" onClick={() => { handleLogout(); closeMenu(); }}>
                    <span>🚪</span> 로그아웃
                  </button>
                </>
              )}

              {!token && (
                <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                  <span>🔑</span> 로그인
                </NavLink>
              )}
              
              <hr className="nav-divider" />
              
              <NavLink to="/write" className={({ isActive }) => isActive ? "nav-link pink active" : "nav-link pink"} onClick={closeMenu}>
                <span>➕</span> 작성
              </NavLink>
            </div>
          </div>

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
                <Link to="/login" className="nav-link auth" onClick={closeMenu}>로그인</Link>
                <Link to="/signup" className="nav-link auth border" onClick={closeMenu}>회원가입</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;