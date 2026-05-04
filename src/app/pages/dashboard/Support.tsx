import { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Send, Clock } from 'lucide-react';
import { supportOptions, faqItems } from '../../../data/extendedMockData';

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'support',
          message:
            'Thank you for your message. A support specialist will respond to you shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const handlePhoneCall = () => {
    alert(
      'Phone Support:\n\nUS: +1 (800) 555-0123\nUK: +44 20 7123 4567\n\nAvailable Mon-Fri, 9 AM - 6 PM EST'
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
        <p className="text-gray-600">Get help from our support team anytime you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {supportOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              if (option.id === 'live-chat') setShowChat(true);
              else if (option.id === 'phone-call') handlePhoneCall();
              else if (option.id === 'email')
                alert('Email us at: support@investpro.com\nWe typically respond within 4 hours.');
            }}
            className={`bg-gradient-to-r ${option.color} text-white p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-left`}
          >
            <div className="text-4xl mb-4">{option.icon}</div>
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
                <p className="text-sm text-blue-100">Online • Avg. response time: 2 min</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:bg-white/20 rounded-lg px-3 py-1 transition"
            >
              ✕
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-6 bg-gray-50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="mb-1">{msg.message}</p>
                  <p
                    className={`text-xs ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {msg.time}
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
                onChange={(e) => setChatMessage(e.target.value)}
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
          {faqItems.map((faq, index) => (
            <details
              key={index}
              className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Support Hours</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Live Chat:</span>
              <span className="font-semibold">24/7 Available</span>
            </div>
            <div className="flex justify-between">
              <span>Phone Support:</span>
              <span className="font-semibold">Mon-Fri, 9 AM - 6 PM EST</span>
            </div>
            <div className="flex justify-between">
              <span>Email Support:</span>
              <span className="font-semibold">24/7 Available</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Email:</span> support@investpro.com
            </div>
            <div>
              <span className="font-semibold">Phone (US):</span> +1 (800) 555-0123
            </div>
            <div>
              <span className="font-semibold">Phone (UK):</span> +44 20 7123 4567
            </div>
            <div>
              <span className="font-semibold">Address:</span> 123 Financial St, New York, NY 10005
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
