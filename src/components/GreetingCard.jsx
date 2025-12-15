import React from 'react';
import html2canvas from 'html2canvas';

const GreetingCard = ({ event, booking }) => {
  // Generate greeting card content based on event details
  const generateGreetingContent = () => {
    const eventName = event?.title || 'Special Event';
    const venueName = booking?.selectedVenue || 'TBD';
    const eventDate = booking?.selectedEventDate ? new Date(booking.selectedEventDate).toLocaleDateString() : 'TBD';
    const eventTime = booking?.selectedEventTime || 'TBD';
    const hostName = booking?.hostName || 'Event Organizer';
    const eventType = event?.eventType || 'Special Occasion';

    // Warm greeting line (1-2 lines)
    const greetingLine = `You're Invited to an Amazing ${eventType}!`;

    // Short invitation message (2 lines)
    const invitationMessage = `Join us for ${eventName}, a memorable event that promises fun and excitement for everyone.`;

    // Color theme suggestion (3 colors)
    const colorTheme = ['#3B82F6', '#10B981', '#8B5CF6']; // Blue, Emerald, Violet

    // Simple layout description
    const layout = {
      topText: greetingLine,
      centerText: invitationMessage,
      bottomDetails: `Venue: ${venueName}\nDate: ${eventDate}\nTime: ${eventTime}\nHosted By: ${hostName}`
    };

    // Short event-related quote
    const eventQuote = "The best way to predict the future is to create it.";

    return {
      eventName,
      venueName,
      eventDate,
      eventTime,
      hostName,
      eventType,
      greetingLine,
      invitationMessage,
      colorTheme,
      layout,
      eventQuote
    };
  };

  const content = generateGreetingContent();

  // Function to download the card as PNG
  const downloadCard = async () => {
    const cardElement = document.getElementById('greeting-card');
    if (cardElement) {
      try {
        const canvas = await html2canvas(cardElement);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${content.eventName.replace(/\s+/g, '_')}_greeting_card.png`;
        link.click();
      } catch (error) {
        console.error('Error downloading card:', error);
        alert('Failed to download the greeting card. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
      <div 
        id="greeting-card"
        className="p-8 text-center"
        style={{ 
          background: `linear-gradient(135deg, ${content.colorTheme[0]} 0%, ${content.colorTheme[1]} 50%, ${content.colorTheme[2]} 100%)`,
          color: 'white'
        }}
      >
        {/* Top Text */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{content.layout.topText}</h1>
        </div>

        {/* Center Text */}
        <div className="my-8">
          <p className="text-xl mb-4">{content.layout.centerText}</p>
          <div className="border-t border-white/30 my-4 mx-auto w-24"></div>
          <p className="text-lg italic">"{content.eventQuote}"</p>
        </div>

        {/* Bottom Details */}
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="font-semibold">Event:</p>
              <p>{content.eventName}</p>
            </div>
            <div>
              <p className="font-semibold">Hosted By:</p>
              <p>{content.hostName}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>{content.eventDate}</p>
            </div>
            <div>
              <p className="font-semibold">Time:</p>
              <p>{content.eventTime}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-semibold">Venue:</p>
              <p>{content.venueName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="p-4 bg-gray-50 text-center">
        <button
          onClick={downloadCard}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
        >
          Download Greeting Card
        </button>
      </div>
    </div>
  );
};

export default GreetingCard;