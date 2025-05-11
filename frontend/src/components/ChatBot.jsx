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

    if (lower.includes("hello") || lower.includes("hi")) return "Hello! 👋";
    if (lower.includes("property") && lower.includes("book"))
      return "You can easily book a property by browsing our listings.";
    if (lower.includes("location"))
      return "📍 You can choose location where you need from the location available in our rental system";
   if (lower.includes("agreement"))
      return "You have to agree with the property agreement for living there.";
    if (lower.includes("support"))
      return "Reach us via email or call (+997) 9828988214.";
    if (lower.includes("parking")) return "🅿️ Yes! Free parking is available.";
    if (lower.includes("pet") || lower.includes("pets"))
      return "🐶 Pets are allowed in selected rooms. Check the property details before booking.";
    if (lower.includes("payment")) return "We accept cards, mobile wallets, and cash.";
    if (lower.includes("wifi")) return "Free high-speed Wi-Fi is available for all guests.";
    if (lower.includes("monthly"))
      return "We offer monthly rental plans. Contact support!";
    if (lower.includes("renting"))
      return "You can rent anytime from your dashboard.";
    if (lower.includes("password"))
      return "Forgot your password? Reset it from the login page.";
    // if (lower.includes("recommend") || lower.includes("nearby"))
    //   return "🏞️ Visit Thamel, Swayambhu, or Boudhanath nearby!";
    if (lower.includes("book for someone"))
      return "Yes, you can book for others using their details.";

    // 
    if (lower.includes("add property") || lower.includes("list my space"))
      return "To add a property, click on the 'Add Property' button in the top navigation.";
    if (lower.includes("type of property") || lower.includes("what properties"))
      return "We offer Houses, Apartments, Rooms, Flats, and Shutters. Use the filters to browse.";

    // Dynamic parsed responses
    const parsed = parseQuery(msg);
    if (parsed) return parsed;

    return (
      "❓ Sorry, I didn't understand that. You can ask about:\n" +
      "👉 Property\n👉 Location\n👉 Price\n👉 Support\n👉 Parking\n👉 Pets\n👉 Payments\n👉 Wi-Fi etc."
    );
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
