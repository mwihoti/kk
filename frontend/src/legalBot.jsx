import React,{ useState, useRef, useEffect} from "react";
import {backend as legalbot } from 'declarations/backend';


const Legalbot = () => {
    const [chat, setChat ] = useState ([
        {
            system: { content: "Welcome to Kenyan Legal Aid. I specialize exclusively in Kenyan law. Ask about land rights, women's rights, ID/Passport issues, or legal disputes within Kenya."}
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    const formatDate = (date) => {
        const h = '0' + date.getHours();
        const m = '0' + date.getMinutes();
        return `${h.slice(-2)}:${m.slice(-2)}`;
    };

    const sendMessage = async (messages) => {
        try {
            const response = await legalbot.chat(messages);
            setChat((prev) => {
                const updated = [...prev];
                updated.pop();
                updated.push({system: {content: response}});
                return updated;
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const userMessage = {user: {content: inputValue}};
        const loading = {system: { content: "Analyzing your legal question..."}};
        setChat([...chat, userMessage, loading]);
        setInputValue('');
        setIsLoading(true);
        sendMessage(chat.slice(1).concat(userMessage));
    };

    useEffect(() => {
        if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }, [chat]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2"> Legai Aid Chatbot</h2>

            <div className="h-[60vh] overflow-y-auto bg-blue-100 p-2 rounded" ref={chatBoxRef}>
                {chat.map((m, i) => {
                    const isUser = 'user' in m;
                    const text = isUser ? m.user.content : m.system.content;
                    return (
                        <div key={i} className={`mb-2 text-sm ${isUser ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-2 rounded ${isUser ? 'bg-blue-600 text-white' : 'bg-white shadow'}`}>
                                {text}
                                </div>

                            </div>
                    );
                })}
                </div> 

                <form className="flex mt-2" onSubmit={handleSubmit}>
                    <input type="text"
                    className="flex-1 border p-2 rounded-l"
                    placeholder="Ask your legal question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    />

                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-r" disabled={isLoading}>
                        Send
                    </button>
                </form>
        </div>
    );
};
export default Legalbot;