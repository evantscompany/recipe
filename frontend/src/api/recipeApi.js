import api from './axios';

export const recipeApi = {
  // 레시피 등록하기
  createRecipe:(formData) =>api.post('/api/v1/recipes/',formData),
  
  // 게시글 전체 목록 가져오기
  getRecipes: () => api.get('/api/v1/recipes/'),
  
  // 내 레시피 목록 가져오기
  getMyRecipes: () => api.get('/api/v1/recipes/my/all'),

  // 게시글 상세 조회
  getRecipeDetail: (id) => api.get(`/api/v1/recipes/${id}`),
  
  // 리액션(좋아요/별로예요) 토글
  postReaction: (postId, reactionData) => 
    api.post(`/api/v1/reactions/${postId}/reaction`,reactionData),
};

