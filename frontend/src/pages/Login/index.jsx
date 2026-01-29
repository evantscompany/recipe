import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
// 스타일 컴포넌트를 사용 중이라면 아래 주석을 해제하세요
// import * as S from '../Signup/Signup.style'; 

const LoginPage = () => { // 1. 컴포넌트 함수 시작
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await authApi.login(email, password);
    
    if (data.access_token) {
      // ✅ 1. 토큰과 이름을 로컬 스토리지에 확실히 저장
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('username', data.username); // 백엔드에서 username을 준다고 했으니!
      
      alert(`${data.username}님, 환영합니다!`);
      navigate('/'); 
      window.location.reload(); // ✅ 2. 메인으로 가면서 상태를 새로고침 (가장 확실한 방법)
    }
  } catch (err) {
    alert('로그인 실패!');
  }
}; // 2. 로그인 핸들러 끝

  return ( // 3. UI 렌더링 시작
    <div className="login-container" style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="이메일" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4ecdc4', color: 'white', border: 'none', cursor: 'pointer' }}>
          로그인
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        처음 오셨나요? 
        <span 
          onClick={() => navigate('/signup')} 
          style={{ 
            color: '#4ecdc4', 
            cursor: 'pointer', 
            marginLeft: '8px', 
            fontWeight: 'bold',
            textDecoration: 'underline' 
          }}
        >
          회원가입
        </span>
      </div>
    </div>
  ); // 3. UI 렌더링 끝
}; // 1. 컴포넌트 함수 끝

export default LoginPage; // export 이름도 맞춰줍니다.