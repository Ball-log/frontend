//CommentContext.js
import React, { createContext, useState } from 'react';

export const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [comments, setComments] = useState(() => ({}));

  const addComment = (postId, newComment) => {
    setComments(prevComments => {
      const postComments = prevComments[postId] || [];
      return {
        ...prevComments,
        [postId]: [...postComments, newComment]
      };
    });
  };

  const addReply = (postId, commentId, newReply) => {
    setComments(prevComments => {
      const postComments = prevComments[postId] || [];
      const updatedComments = postComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        return comment;
      });
      return {
        ...prevComments,
        [postId]: updatedComments
      };
    });
  };

  const getTotalCommentCount = (postId) => {
    const postComments = comments[postId] || [];
    return postComments.reduce((total, comment) => {
      return total + 1 + comment.replies.length;
    }, 0);
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment, addReply, getTotalCommentCount }}>
      {children}
    </CommentsContext.Provider>
  );
};