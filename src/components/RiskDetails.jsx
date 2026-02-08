import React, { useState } from 'react';
import { X, MessageSquare, Send, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { risksAPI, calculateRiskScore, getRiskLevel } from '../services/dataService';
import { usersAPI } from '../services/dataService';

const RiskDetails = ({ risk, onClose, onUpdate }) => {
  const [commentText, setCommentText] = useState('');
  const currentUser = usersAPI.getCurrentUser();

  const score = calculateRiskScore(risk.impact, risk.probability);
  const level = getRiskLevel(score);
  
  const netScore = risk.mitigation?.impact && risk.mitigation?.probability
    ? calculateRiskScore(risk.mitigation.impact, risk.mitigation.probability)
    : score;
  const netLevel = getRiskLevel(netScore);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    risksAPI.addComment(risk.id, {
      text: commentText,
      author: currentUser.name
    });

    setCommentText('');
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-500">{risk.code}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                risk.type === 'project' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {risk.type}
              </span>
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full text-white"
                style={{ backgroundColor: level.color }}
              >
                {level.label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{risk.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-900">{risk.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Category</div>
              <div className="font-medium text-gray-900">{risk.category}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                risk.status === 'open' ? 'bg-red-100 text-red-800' :
                risk.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Responsible</div>
              <div className="font-medium text-gray-900">{risk.responsible}</div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Impact</div>
                <div className="text-3xl font-bold text-gray-900">{risk.impact}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Probability</div>
                <div className="text-3xl font-bold text-gray-900">{risk.probability}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Risk Score</div>
                <div className="text-3xl font-bold text-gray-900">{score}</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span
                className="px-4 py-2 text-sm font-semibold rounded-full text-white"
                style={{ backgroundColor: level.color }}
              >
                Risk Level: {level.label}
              </span>
            </div>
          </div>

          {/* Mitigation */}
          {risk.mitigation?.actions && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mitigation Plan</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Actions</div>
                  <p className="text-gray-900">{risk.mitigation.actions}</p>
                </div>
                
                {(risk.mitigation.impact && risk.mitigation.probability) && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {risk.mitigation.cost && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Mitigation Cost</div>
                          <div className="font-medium text-gray-900">${risk.mitigation.cost.toLocaleString()}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Residual Impact</div>
                        <div className="font-medium text-gray-900">{risk.mitigation.impact}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Residual Probability</div>
                        <div className="font-medium text-gray-900">{risk.mitigation.probability}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-green-800">Net Risk Score</div>
                          <div className="text-2xl font-bold text-green-900">{netScore}</div>
                        </div>
                        <span
                          className="px-4 py-2 text-sm font-semibold rounded-full text-white"
                          style={{ backgroundColor: netLevel.color }}
                        >
                          {netLevel.label}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(risk.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(risk.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comments ({risk.comments?.length || 0})
              </h3>
            </div>

            {/* Comment List */}
            <div className="space-y-4 mb-4">
              {risk.comments && risk.comments.length > 0 ? (
                risk.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDetails;
