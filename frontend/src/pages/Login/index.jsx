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
      
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('username', data.username);
        
        alert(`${data.username}님, 환영합니다!`);
        navigate('/'); 
        window.location.reload(); 
      }
    } catch (err) {
      alert('로그인 실패! 이메일이나 비밀번호를 확인해주세요.');
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