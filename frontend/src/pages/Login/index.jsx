import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Login.scss'; // ✅ SCSS 연결

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await authApi.login(email, password);
    
    // 🔍 디버깅: 콘솔에 찍힌 데이터에 user_id가 숫자로 있는지 확인!
    console.log("로그인 응답 데이터:", data);

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('username', data.username);
      
      // ⚠️ 백엔드에서 보낸 이름이 'user_id'이므로 정확히 맞춰야 합니다.
      if (data.user_id !== undefined) {
        localStorage.setItem('userId', String(data.user_id));
        console.log("userId 저장 완료:", data.user_id);
      } else {
        console.error("서버 응답에 user_id가 없습니다. 백엔드 코드를 확인하세요.");
      }
      
      alert(`${data.username}님, 환영합니다!`);
      navigate('/'); 
      window.location.reload(); 
    }
  } catch (err) {
    alert('로그인 실패! 정보를 확인해주세요.');
  }
};

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* 로고 영역 */}
        <Link to="/" className="auth-logo">RECIPE</Link>
        
        <h2>로그인을 환영합니다</h2>
        <p className="auth-subtitle">맛있는 레시피가 당신을 기다리고 있어요!</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>이메일</label>
            <input 
              type="email" 
              placeholder="example@recipe.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input 
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            로그인
          </button>
        </form>

        <div className="auth-footer">
          처음 오셨나요? 
          <Link to="/signup" className="signup-link">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;