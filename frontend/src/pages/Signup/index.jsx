import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import * as S from './Signup.style';

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

    // 1. 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    try {
      // 2. 백엔드 회원가입 API 호출
      // 백엔드 UserCreate 스키마 필드명과 일치시킴
      await authApi.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate('/login');
    } catch (error) {
      // 3. 에러 처리 (이메일 중복 등)
      const errorMsg = error.response?.data?.detail || "회원가입에 실패했습니다.";
      alert(errorMsg);
    }
  };

  return (
    <S.Container>
      <S.Title>회원가입</S.Title>
      <S.Form onSubmit={handleSubmit}>
        <S.Input 
          name="username" 
          placeholder="사용자 이름" 
          value={formData.username}
          onChange={handleChange} 
          required 
        />
        <S.Input 
          name="email" 
          type="email" 
          placeholder="이메일 (ID로 사용됨)" 
          value={formData.email}
          onChange={handleChange} 
          required 
        />
        <S.Input 
          name="password" 
          type="password" 
          placeholder="비밀번호" 
          value={formData.password}
          onChange={handleChange} 
          required 
        />
        <S.Input 
          name="confirmPassword" 
          type="password" 
          placeholder="비밀번호 확인" 
          value={formData.confirmPassword}
          onChange={handleChange} 
          required 
        />
        <S.SubmitButton type="submit">가입하기</S.SubmitButton>
      </S.Form>
      
      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        이미 계정이 있으신가요? 
        <span 
          onClick={() => navigate('/login')} 
          style={{ color: '#4ecdc4', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline' }}
        >
          로그인
        </span>
      </p>
    </S.Container>
  );
};

export default Signup;