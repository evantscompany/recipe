import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Main from './pages/Main';
import RecipeDetail from './pages/RecipeDetail';
import Write from './pages/Write';
import LoginPage from './pages/Login';
import Signup from './pages/Signup';

function App() {
  // ✅ 타이머 상태 추가
  const [timeLeft, setTimeLeft] = useState("");

  // ✅ 로컬 스토리지에서 로그인 정보 확인
  const token = localStorage.getItem('access_token');
  const username = localStorage.getItem('username');

  // ✅ 로그아웃 핸들러
  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      window.location.href = "/"; // 메인으로 보내면서 새로고침
    }
  };

  // ✅ 토큰 만료 시간 계산 및 실시간 타이머 로직
  useEffect(() => {
    if (!token) return;

    const timer = setInterval(() => {
      try {
        // JWT의 Payload 부분(두 번째 구간) 디코딩
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        
        const exp = payload.exp; // 만료 시각 (초 단위)
        const now = Math.floor(Date.now() / 1000); // 현재 시각 (초 단위)
        const diff = exp - now;

        if (diff <= 0) {
          clearInterval(timer);
          alert("세션이 만료되어 자동으로 로그아웃되었습니다.");
          localStorage.removeItem('access_token');
          localStorage.removeItem('username');
          window.location.href = "/";
        } else {
          const minutes = Math.floor(diff / 60);
          const seconds = diff % 60;
          // 00:00 형식으로 포맷팅
          setTimeLeft(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
        }
      } catch (e) {
        console.error("토큰 디코딩 에러:", e);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer); // 언마운트 시 타이머 정리
  }, [token]);

  return (
    <Router>
      <div className="App">
        {/* 상단 네비게이션 바 */}
        <nav style={{ 
          padding: '1rem', 
          background: '#fff', 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between', // 양 끝 배치
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>홈</Link>
            <Link to="/write" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>글쓰기</Link>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {token ? (
              // ✅ 로그인 상태: 남은 시간, 이름과 로그아웃 버튼 표시
              <>
                {/* 타이머 디자인 영역 */}
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#ff6b6b', 
                  background: '#fff5f5', 
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  border: '1px solid #ffe3e3'
                }}>
                  ⏱ {timeLeft}
                </div>
                
                <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 'bold' }}>
                  👤 {username}님
                </span>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    color: '#ff6b6b', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              // ✅ 로그아웃 상태: 로그인과 회원가입 링크 표시
              <>
                <Link to="/login" style={{ textDecoration: 'none', color: '#ff6b6b', fontWeight: 'bold' }}>로그인</Link>
                <Link to="/signup" style={{ textDecoration: 'none', color: '#ff6b6b', fontWeight: 'bold' }}>회원가입</Link>
              </>
            )}
          </div>
        </nav>

        {/* 메인 콘텐츠 영역 */}
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/write" element={<Write />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/signup' element={<Signup/>}/>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;