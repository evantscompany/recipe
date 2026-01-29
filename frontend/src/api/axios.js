import axios from 'axios';

//1. axios 인스턴스 생성
const api = axios.create({

    //Vite 에서는 process.env 대신 import.meta.env 사용함.
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{
        // 'Content-Type':'application/json',
    },
})

//2. 요청 인터셉터 : 모든 요청에 JWT 토큰 자동 주입
api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('access_token');
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>Promise.reject(error)
)

//401에러시 자동 로그아웃처리 및 자동로그인페이지로 이동
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 토큰 만료 시 로컬 스토리지 비우고 새로고침 등 처리
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
