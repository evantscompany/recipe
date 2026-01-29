import api from './axios';

export const authApi = {
  // 회원가입
  signup: (userData) => api.post('/api/v1/auth/signup', userData),

  // 로그인 (FormData 사용)
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); // 백엔드 매핑 확인됨
    formData.append('password', password);

    const response = await api.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // { access_token, token_type, username }
  }
};