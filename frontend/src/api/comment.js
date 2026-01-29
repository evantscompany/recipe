import api from './axios';

export const commentApi = {
    // 1. 조회: 잘 작동하던 기존 경로 형식을 유지합니다.
    // 단, 주소에 ':'이 들어가지 않도록 주의하세요!
    getComments: (postId) => api.get(`/api/v1/comments/post/${postId}`),
    
    // 2. 작성: 여기는 지금처럼 유지
    createComment: (postId, content) => {
        return api.post('/api/v1/comments/', 
        {   
            content: content,
            post_id: parseInt(postId)
        })
    
    },

    //댓글 수정
    updateComment: (commentId, content,postId)=>{
        return api.put(`/api/v1/comments/${commentId}`,{
            content:content,
            post_id:parseInt(postId)
        })
    },

    //댓글 삭제
    deleteComment:(commentId)=>{
        return api.delete(`/api/v1/comments/${commentId}`)
    } 
}


export default commentApi