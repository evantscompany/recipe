import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Signup.scss'; // ✅ SCSS 연결

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. 유효성 검사 (로직 유지)
    if (formData.password !== formData.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    try {
      // 2. 백엔드 회원가입 API 호출 (로직 유지)
      await authApi.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate('/login');
    } catch (error) {
      // 3. 에러 처리 (로직 유지)
      const errorMsg = error.response?.data?.detail || "회원가입에 실패했습니다.";
      alert(errorMsg);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input 
            className="signup-input"
            name="username" 
            placeholder="사용자 이름" 
            value={formData.username}
            onChange={handleChange} 
            required 
          />
          <input 
            className="signup-input"
            name="email" 
            type="email" 
            placeholder="이메일 (ID로 사용됨)" 
            value={formData.email}
            onChange={handleChange} 
            required 
          />
          <input 
            className="signup-input"
            name="password" 
            type="password" 
            placeholder="비밀번호" 
            value={formData.password}
            onChange={handleChange} 
            required 
          />
          <input 
            className="signup-input"
            name="confirmPassword" 
            type="password" 
            placeholder="비밀번호 확인" 
            value={formData.confirmPassword}
            onChange={handleChange} 
            required 
          />
          <button className="signup-submit-btn" type="submit">가입하기</button>
        </form>
        
        <div className="signup-footer">
          이미 계정이 있으신가요? 
          <span className="login-link" onClick={() => navigate('/login')}>
            로그인
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;