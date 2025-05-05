import React, { useState, useRef, useEffect } from "react";

// Helper function for parsing dynamic queries
const parseQuery = (msg) => {
  const lowerMsg = msg.toLowerCase();
  if (lowerMsg.includes("date") || lowerMsg.includes("time")) {
    const date = new Date();
    return `🕒 The current date and time is ${date.toLocaleString()}`;
  }
  if (lowerMsg.includes("how are you")) {
    return "I'm doing great, thank you for asking! 😊 How can I assist you today?";
  }
  return null; // No parsed dynamic match
};

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      const reply = generateBotReply(input);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const generateBotReply = (msg) => {
    const lower = msg.toLowerCase();

    // Predefined smart answers
    if (lower.includes("hello") || lower.includes("hi")) return "Hello! 👋";
    if (lower.includes("room") && lower.includes("book")) return "You can easily book a room by browsing our listings.";
    if (lower.includes("discount")) return "Yes! We offer special discounts. Check our Offers section!";
    if (lower.includes("location")) return "📍 We are located at Top Floor, Hilton, Kathmandu, Nepal.";
    if (lower.includes("hours") || lower.includes("timing")) return "We are open Monday to Friday, 9 AM to 6 PM.";
    if (lower.includes("cancel")) return "To cancel your booking, visit your Dashboard > Bookings > Cancel.";
    if (lower.includes("support")) return "Reach us via email or call (+997) 9828988214.";
    if (lower.includes("parking")) return "🅿️ Yes! Free parking is available.";
    if (lower.includes("pet")) return "🐶 Pets are allowed in selected rooms. Check details.";
    if (lower.includes("payment")) return "We accept cards, mobile wallets, and cash.";
    if (lower.includes("wifi")) return "Free high-speed Wi-Fi is available for all guests.";
    if (lower.includes("monthly")) return "We offer monthly rental plans. Contact support!";
    if (lower.includes("reservation change")) return "Modify your booking anytime from your dashboard.";
    if (lower.includes("password")) return "Forgot your password? Reset it from the login page.";
    if (lower.includes("recommend") || lower.includes("nearby")) return "🏞️ Visit Thamel, Swayambhu, or Boudhanath nearby!";
    if (lower.includes("breakfast")) return "🍳 Breakfast is included in most of our packages.";
    if (lower.includes("check in")) return "Check-in starts from 2 PM onward.";
    if (lower.includes("late checkout")) return "Late checkout is possible on request (extra charges may apply).";
    if (lower.includes("book for someone")) return "Yes, you can book for others using their details.";
    if (lower.includes("group discount")) return "We offer group discounts! Contact support for info.";
    if (lower.includes("wheelchair")) return "♿ We have wheelchair accessible rooms.";

    // Dynamic parsed responses
    const parsed = parseQuery(msg);
    if (parsed) return parsed;

    // If nothing matched => suggest topics
    return "❓ Sorry, I didn't understand that. You can ask about:\n" +
      "👉 Booking a room\n👉 Discounts\n👉 Location\n👉 Support\n👉 Parking\n👉 Pets\n👉 Payments\n👉 Wi-Fi\n👉 Breakfast\n👉 Group discounts, etc.";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white/60 backdrop-blur-md shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="text-lg font-bold text-[#333]">🤖 Chatbot</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">&times;</button>
      </div>

      {/* Chat window */}
      <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              } max-w-[80%] whitespace-pre-wrap`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t flex items-center gap-2 bg-white/80 backdrop-blur-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
