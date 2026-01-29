import React, { useState } from 'react';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const currentUser = localStorage.getItem('username')

  const handleSave = () => {
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className={`comment-item ${isEditing ? 'editing' : ''}`}>
      <div className="comment-header">
        <div className="comment-user">👤 {comment.username}</div>
        <div className="comment-actions">
          {/* 작성자 본인일 때만 액션 버튼 노출 */}
          {currentUser === comment.username && (
          isEditing ? (
            <>
              <button className="action-btn save" onClick={handleSave}>저장</button>
              <button className="action-btn cancel" onClick={() => { setIsEditing(false); setEditContent(comment.content); }}>취소</button>
            </>
          ) : (
            <>
              <button className="action-btn edit" onClick={() => setIsEditing(true)}>수정</button>
              <button className="action-btn delete" onClick={() => onDelete(comment.id)}>삭제</button>
            </>
          )
          )}
        </div>
      </div>
      <div className="comment-body">
        {isEditing ? (
          <input 
            className="edit-input"
            value={editContent} 
            onChange={(e) => setEditContent(e.target.value)} 
            autoFocus 
          />
        ) : (
          <div className="comment-text">{comment.content}</div>
        )}
      </div>
      <div className="comment-date">
        {new Date(comment.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default CommentItem;