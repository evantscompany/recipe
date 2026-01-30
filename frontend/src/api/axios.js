import axios from 'axios';

// 1. 현재 접속한 도메인에 따라 API 주소를 결정하는 함수
const getBaseURL = () => {
  // 로컬 환경(내 컴퓨터)인 경우
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000'; 
  }
  // 그 외(배포 환경)인 경우 .env 파일의 배포 주소를 사용하거나 직접 입력
  return import.meta.env.VITE_API_BASE_URL || 'https://recipe-production-39ae.up.railway.app';
};

// 2. axios 인스턴스 생성
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    // 기본 컨텐츠 타입 설정 (필요 시 주석 해제)
    // 'Content-Type': 'application/json',
  },
});

// 3. 요청 인터셉터: 모든 요청에 JWT 토큰 자동 주입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. 응답 인터셉터: 401 에러(토큰 만료 등) 시 자동 로그아웃 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 인증 정보 모두 삭제
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId'); // 추가된 userId도 삭제
      
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;