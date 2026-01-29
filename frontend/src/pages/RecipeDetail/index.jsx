import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeApi } from '../../api/recipeApi';
import { commentApi } from '../../api/comment';
import CommentItem from './CommentItem'; 
import * as S from './RecipeDetail.style'; 

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // --- [추가] 리액션 상태 관리 ---
  const [reactionStats, setReactionStats] = useState({
    likes: 0,
    dislikes: 0,
    myReaction: null // 'like', 'dislike' 또는 null
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [recipeRes, commentRes] = await Promise.all([
          recipeApi.getRecipeDetail(id),
          commentApi.getComments(id)
        ]);
        
        const recipeData = recipeRes.data;
        setRecipe(recipeData);
        setComments(commentRes.data);

        // --- [추가] 초기 로딩 시 리액션 정보 세팅 ---
        setReactionStats({
          likes: recipeData.like_count || 0,
          dislikes: recipeData.dislike_count || 0,
          myReaction: recipeData.my_reaction || null
        });

      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        if (error.response?.status === 404) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, navigate]);

  // --- [추가] 리액션 토글 핸들러 ---
  const handleReaction = async (type) => {
    try {
      // 백엔드 엔드포인트에 맞춰 호출 (예: /recipes/{id}/reaction)
      const res = await recipeApi.postReaction(id, {reaction_type:type});
      
      // 백엔드에서 리액션 처리 후 반환하는 최신 데이터를 적용
      setReactionStats({
        likes: res.data.like_count,
        dislikes: res.data.dislike_count,
        myReaction: res.data.my_reaction
      });
    } catch (error) {
      if (error.response?.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("처리에 실패했습니다.");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await commentApi.createComment(id, newComment);
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      await commentApi.updateComment(commentId, content, id);
      setComments(comments.map(c => c.id === commentId ? { ...c, content } : c));
    } catch (error) {
      alert(error.response?.data?.detail || "수정 권한이 없습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await commentApi.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      alert(error.response?.data?.detail || "삭제 권한이 없습니다.");
    }
  };

  if (loading) return <S.Container style={{textAlign: 'center'}}>로딩 중...</S.Container>;
  if (!recipe) return <S.Container style={{textAlign: 'center'}}>레시피를 찾을 수 없습니다.</S.Container>;

  return (
    <S.Container>
      <S.ActionButton onClick={() => navigate(-1)} style={{fontSize: '1rem', marginBottom: '20px'}}>
        ← 뒤로가기
      </S.ActionButton>

      <S.RecipeCard>
        <S.RecipeImage 
          src={recipe.image_url?.startsWith('http') ? recipe.image_url : `http://localhost:8000${recipe.image_url}`} 
          alt={recipe.title} 
        />

        <S.ContentArea>
          <S.CategoryTag>{recipe.category || '일반'}</S.CategoryTag>
          <h1 style={{ marginTop: '15px', fontSize: '2.5rem' }}>{recipe.title}</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', margin: '20px 0', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <span>작성자 ID: {recipe.user_id}</span>
            <span>작성일: {new Date(recipe.created_at).toLocaleDateString()}</span>
          </div>

          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
            {recipe.content}
          </div>

          {/* --- [추가] 리액션 버튼 영역 --- */}
          <S.ReactionSection>
            <S.ReactionButton 
              $active={reactionStats.myReaction === 'like'} 
              $color="#4ecdc4" 
              onClick={() => handleReaction('like')}
            >
              👍 좋아요 {reactionStats.likes}
            </S.ReactionButton>

            <S.ReactionButton 
              $active={reactionStats.myReaction === 'dislike'} 
              $color="#ff6b6b" 
              onClick={() => handleReaction('dislike')}
            >
              👎 별로예요 {reactionStats.dislikes}
            </S.ReactionButton>
          </S.ReactionSection>

          <S.CommentSection>
            <h3>💬 댓글 {comments.length}개</h3>
            
            <form onSubmit={handleCommentSubmit} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
              <S.StyledInput 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 남겨보세요..."
              />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4ecdc4', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                등록
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onUpdate={handleCommentUpdate}
                  onDelete={handleCommentDelete}
                />
              ))}
            </div>
          </S.CommentSection>
        </S.ContentArea>
      </S.RecipeCard>
    </S.Container>
  );
};

export default RecipeDetail;