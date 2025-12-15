import React, { useState } from 'react';

const QueryModal = ({ isOpen, onClose, onSubmit, event }) => {
  const [question, setQuestion] = useState('');

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ask a Question</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800">{event.title}</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="Type your question here..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setQuestion('');
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QueryModal;
