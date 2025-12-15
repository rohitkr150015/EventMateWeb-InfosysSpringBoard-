import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../api/api';

const QueryManagement = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    try {
      setLoading(true);
      const result = await adminAPI.getAllQueries();
      setQueries(result.data);
    } catch (error) {
      toast.error('Failed to load queries');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await adminAPI.respondToQuery(selectedQuery.id, response);
      toast.success('Response sent successfully!');
      setSelectedQuery(null);
      setResponse('');
      loadQueries();
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const filteredQueries = filter === 'ALL'
    ? queries
    : filter === 'ANSWERED'
    ? queries.filter(q => q.response)
    : queries.filter(q => !q.response);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Query Management</h2>
        <div className="flex space-x-2">
          {['ALL', 'UNANSWERED', 'ANSWERED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueries.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">No queries found</p>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <div key={query.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {query.event.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        query.response 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {query.response ? 'Answered' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>User:</strong> {query.user.name} ({query.user.email})
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {new Date(query.queryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 font-medium mb-1">Question:</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded">{query.question}</p>
                </div>

                {query.response ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-sm text-green-800 font-medium mb-1">Your Response:</p>
                    <p className="text-green-900">{query.response}</p>
                    <p className="text-xs text-green-700 mt-2">
                      Responded on: {new Date(query.responseDate).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedQuery(query)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Respond to Query
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Response Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Respond to Query</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{selectedQuery.event.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>User:</strong> {selectedQuery.user.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Question:</strong> {selectedQuery.question}
              </p>
            </div>

            <form onSubmit={handleRespond}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response *
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Type your response here..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedQuery(null);
                    setResponse('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryManagement;
