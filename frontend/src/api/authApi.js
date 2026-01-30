import api from './axios';

export const authApi = {
  // 회원가입
  signup: (userData) => api.post('/api/v1/auth/signup', userData),

  // 로그인 (FormData 사용)
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email); 
    formData.append('password', password);

    const response = await api.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // 💡 여기서 console.log를 찍어보세요. 
    // { access_token: "...", user_id: 1, username: "soso" } 가 나오는지 확인!
    console.log("백엔드에서 오는 실제 데이터:", response.data); 
    
    return response.data; 
  }
};