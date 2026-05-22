import { useState } from 'react';
import { HelpCircle, MessageCircle, Send } from 'lucide-react';

const supportOptions = [
  {
    id: 'live-chat',
    title: 'Live Chat',
    description: 'Chat with our support team in real time.',
    availability: '24/7 Available',
    responseTime: 'Avg. response: 2 min',
    color: 'from-blue-600 to-indigo-600',
    icon: 'Chat',
  },
  {
    id: 'email',
    title: 'Email Us',
    description: 'Send us a detailed request anytime.',
    availability: '24/7 Available',
    responseTime: 'Avg. response: 4 hours',
    color: 'from-emerald-600 to-green-600',
    icon: 'Mail',
  },
];

const faqItems = [
  {
    question: 'How do I activate my account?',
    answer: 'After admin approval, your account becomes active and you can log in with the password you set during signup.',
  },
  {
    question: 'Where can I see my assigned rates?',
    answer: 'Your interest and referral rates appear on your dashboard once you log in.',
  },
  {
    question: 'How do referral bonuses work?',
    answer: 'Bonuses activate once your referral purchases a plan and are based on your assigned rate.',
  },
  {
    question: 'When will payments be available?',
    answer: 'Payment integration is in progress. You can select a plan and pay once the system is live.',
  },
];

export function Support() {
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! How can I help you today?',
      time: '10:30 AM',
    },
  ]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chatMessage.trim()) {
      return;
    }

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        {
          id: current.length + 1,
          sender: 'support',
          message: 'Thank you for your message. A support specialist will respond to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
        <p className="text-gray-600">Get help from our support team anytime you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {supportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              if (option.id === 'live-chat') {
                setShowChat(true);
              } else if (option.id === 'email') {
                alert('Email us at: support@investpro.com\nWe typically respond within 4 hours.');
              }
            }}
            className={`bg-gradient-to-r ${option.color} text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-left`}
          >
            <div className="text-sm font-bold uppercase tracking-wide text-white/80 mb-4">{option.icon}</div>
            <h3 className="text-xl font-bold mb-2">{option.title}</h3>
            <p className="text-white/90 text-sm mb-3">{option.description}</p>
            <div className="text-white/80 text-xs">
              <div>{option.availability}</div>
              <div>{option.responseTime}</div>
            </div>
          </button>
        ))}
      </div>

      {showChat && (
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Live Chat Support</h3>
                <p className="text-sm text-blue-100">Online - Avg. response time: 2 min</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-white/20 rounded-lg px-3 py-1 transition"
            >
              Close
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-6 bg-gray-50">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="mb-1">{message.message}</p>
                  <p className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqItems.map((faq) => (
            <details key={faq.question} className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">v</span>
              </summary>
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
