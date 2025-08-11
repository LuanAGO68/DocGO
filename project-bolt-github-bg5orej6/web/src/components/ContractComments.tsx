import React, { useState } from 'react';
import { MessageCircle, User, Clock, Reply, Trash2 } from 'lucide-react';
import { ContractComment } from '../types/contract';

interface ContractCommentsProps {
  comments: ContractComment[];
  onAddComment: (content: string, highlightedText?: string) => void;
  onDeleteComment: (commentId: string) => void;
  onResolveComment: (commentId: string) => void;
}

export const ContractComments: React.FC<ContractCommentsProps> = ({
  comments,
  onAddComment,
  onDeleteComment,
  onResolveComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, selectedText || undefined);
      setNewComment('');
      setSelectedText('');
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Bình luận & Trao đổi</h3>
        </div>
      </div>

      <div className="p-6">
        {/* Add Comment Form */}
        <div className="mb-6">
          {selectedText && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-600 font-medium mb-1">Đoạn được chọn:</div>
              <div className="text-sm text-gray-700 italic">"{selectedText}"</div>
              <button
                onClick={() => setSelectedText('')}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                Bỏ chọn
              </button>
            </div>
          )}
          
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onMouseUp={handleTextSelection}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Thêm bình luận... (Chọn đoạn văn bản để highlight)"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Thêm bình luận
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có bình luận nào</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`border rounded-lg p-4 ${
                  comment.isResolved ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString('vi-VN')}
                        </span>
                        {comment.isResolved && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Đã giải quyết
                          </span>
                        )}
                      </div>
                      
                      {comment.highlightedText && (
                        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <div className="text-yellow-600 font-medium mb-1">Đoạn được highlight:</div>
                          <div className="text-gray-700 italic">"{comment.highlightedText}"</div>
                        </div>
                      )}
                      
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!comment.isResolved && (
                      <button
                        onClick={() => onResolveComment(comment.id)}
                        className="p-1 text-green-600 hover:text-green-800 rounded"
                        title="Đánh dấu đã giải quyết"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded"
                      title="Xóa bình luận"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};