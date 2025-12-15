import React from 'react';

const EventCard = ({ event, onBook, onQuery }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      <div className="h-48 bg-gray-200">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{event.title}</h3>
        
        {event.price && (
          <div className="flex items-center text-green-600 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-bold">₹{parseFloat(event.price).toLocaleString('en-IN')}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description || 'No description available'}
        </p>

        <div className="flex space-x-2">
          <button
            onClick={() => onBook(event)}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Book Now
          </button>
          <button
            onClick={() => onQuery(event)}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Ask Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;