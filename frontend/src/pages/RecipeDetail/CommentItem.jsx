import React, { useState } from 'react';
import * as S from './RecipeDetail.style';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = () => {
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <S.CommentWrapper $isEditing={isEditing}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold' }}>👤 {comment.username}</div>
        <div>
          {isEditing ? (
            <>
              <S.ActionButton color="#4a90e2" onClick={handleSave}>저장</S.ActionButton>
              <S.ActionButton onClick={() => { setIsEditing(false); setEditContent(comment.content); }}>취소</S.ActionButton>
            </>
          ) : (
            <>
              <S.ActionButton color="#4ecdc4" onClick={() => setIsEditing(true)}>수정</S.ActionButton>
              <S.ActionButton color="#ff6b6b" onClick={() => onDelete(comment.id)}>삭제</S.ActionButton>
            </>
          )}
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        {isEditing ? (
          <S.StyledInput 
            value={editContent} 
            onChange={(e) => setEditContent(e.target.value)} 
            autoFocus 
          />
        ) : (
          <div style={{ color: '#333', whiteSpace: 'pre-wrap' }}>{comment.content}</div>
        )}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '8px' }}>
        {new Date(comment.created_at).toLocaleString()}
      </div>
    </S.CommentWrapper>
  );
};

export default CommentItem;