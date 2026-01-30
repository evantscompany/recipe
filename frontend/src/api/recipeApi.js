import api from './axios';

export const recipeApi = {
  // 1. 레시피 등록하기
  createRecipe: (formData) => api.post('/api/v1/recipes/', formData),
  
  // 2. 게시글 전체 목록 가져오기
  getRecipes: (search, category) => api.get('/api/v1/recipes/', {
    params: {
      search: search,
      category: category
    }
  }),
  
  // 3. 내 레시피 목록 가져오기
  getMyRecipes: () => api.get('/api/v1/recipes/my/all'),

  // 4. 게시글 상세 조회
  getRecipeDetail: (id) => api.get(`/api/v1/recipes/${id}`),
  
  // 5. 리액션(좋아요/별로예요) 토글
  postReaction: (postId, reactionData) => 
    api.post(`/api/v1/reactions/${postId}/reaction`, reactionData),


  // 6. 레시피 삭제하기
  deleteRecipe: (id) => api.delete(`/api/v1/recipes/${id}`),

  // 7. 레시피 수정하기 (이미지 포함 시 FormData 사용)
  updateRecipe: (id, formData) => api.put(`/api/v1/recipes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
};