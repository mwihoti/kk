import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend as agribot } from 'declarations/backend';
import '/index.css';

const Agribot = () => {
    const [chat, setChat] = useState([
{        system: { content: "Hello! I'm your Kenyan Agriculture Advisor. Ask about crops and diseases, weather, or market prices."}
}    ]);
const [inputValue, setInputValue] = useState('');
const [isLoading, setIsLoading] = useState(false);
const chatBoxRef = useRef(null);

const formDate = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `$h.slice(-2)}:${m.slice(-2)}`;
};









const sendMessage = async (messages) => {
    try {
        const response = await agribot.chat(messages);
        setChat((prev) => {
            const updated = [...prev];
            updated.pop();
            updated.push({ system: { content: response}});
            return updated;
        });

    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
};

const handleSubmit =(e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { user: {content: inputValue} };
    const loading = { system: { content: 'Thinking...'}};
    setChat([...chat, userMessage, loading]);
    setInputValue('');
    setIsLoading(true);
    sendMessage(chat.slice(1).concat(userMessage));
};

useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop =  chatBoxRef.current.scrollHeight;
}, [chat]);

return (
    <div className='p-4'>
        <h2 className='text-xl font-bold mb-2'>Kenyan Agriculture Advisor</h2>
        <div className='h-[60vh] overflow-y-auto bg-green-100 p-2 rounded' ref={chatBoxRef}>
            {chat.map((m, i) => {
                const isUser = 'user' in m;
                const text = isUser ? m.user.content : m.system.content;
                return (
                    <div key={i} className={`mb-2 text-sm ${isUser ? 'text-right' : "text-left"}`}>
                            <div className={`inline-block p-2 rounded ${isUser ? 'text-white bg-green-600' : "bg-white shadow"}`}>
                                {text}
                        </div>
                        </div>

                );
            })}
        </div>

        <form className='flex mt-2' onSubmit={handleSubmit}>
            <input type="text"
            className='flex-1 border p-2 rounded-l'
            placeholder='Ask something...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className='bg-green-600 text-whitep-2 rounded-r'>
                Send
            </button>
        </form>
    </div>
)

}

export default Agribot;

