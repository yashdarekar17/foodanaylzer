// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// const ChatBox = () => {
//   const [file, setFile] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const image = e.target.files[0];
//     setFile(image);
//     const reader = new FileReader();
//     reader.onload = () => {
//       setMessages((prev) => [...prev, { type: 'user', content: reader.result }]);
//     };
//     reader.readAsDataURL(image);
//   };

//   const handleAnalyze = async () => {
//   if (!file) return;
//   setLoading(true);

//   const formData = new FormData();
//   formData.append('image', file);

//   try {
//     const res = await axios.post('http://localhost:7000/foods/analyze', formData);
//     const { food, nutrients, warnings } = res.data;

//     const message = `
// 🍔 Food: ${food}

// 📊 Nutrients:
// • Calories: ${nutrients.calories.value} ${nutrients.calories.unit}
// • Carbs: ${nutrients.carbs.value} ${nutrients.carbs.unit}
// • Fat: ${nutrients.fat.value} ${nutrients.fat.unit}
// • Protein: ${nutrients.protein.value} ${nutrients.protein.unit}

// ${warnings.length > 0 ? "⚠️ Health Warnings:\n- " + warnings.join("\n- ") : "✅ No major health warnings."}
// `;

//     setMessages((prev) => [...prev, { type: 'bot', content: message }]);
//   } catch (err) {
//     console.error("Frontend Analyze Error:", err.message);
//     setMessages((prev) => [...prev, { type: 'bot', content: "❌ Error analyzing image." }]);
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="chatbox-container">
//       <h2 className="chatbox-title">🍽️ AI Food Image Chat Analyzer</h2>

//       <div className="chat-messages">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`chat-bubble ${msg.type === 'user' ? 'user' : 'bot'}`}
//           >
//             {msg.type === 'user' && msg.content.startsWith('data:image') ? (
//               <img src={msg.content} alt="Uploaded" className="chat-image" />
//             ) : (
//               <pre className="chat-text">{msg.content}</pre>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="chat-controls">
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         <button onClick={handleAnalyze} disabled={!file || loading}>
//           {loading ? 'Analyzing...' : 'Send'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;
