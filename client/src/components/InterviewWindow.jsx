import React, { useRef, useEffect, useState } from 'react';

const InterviewWindow = () => {
    const scrollRef = useRef();
    const [paragraphs, setParagraphs] = useState([
        "This is how a really long text may appear. The actual functionality of text appearing here in real time has to be implemented when the backend is fully implemented for the AI to produce a response and for the user to give feedback through the microphone",
        "This might be text which is interpreted when you speak into the program, very cool just make sure you don't goof up",
        "I'm just writing more dummy text because I don't know what else to write about :,). Why do you want to work at Botato, did you bring your botato? Botatos are always a neceseciety (I can't spell) when interviewing with Botato Inc.",
        "AAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "I just want to have enough text to exceed the container please let me do that T^T"
    ]);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (isInitialLoad) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
            setIsInitialLoad(false);
        } else {
            scrollElement.style.scrollBehavior = 'smooth';
            scrollElement.scrollTop = scrollElement.scrollHeight;
        }
    }, [paragraphs]);

    const addParagraph = () => {
        setParagraphs(prev => [...prev, "This is a new dynamically added paragraph."]);
    };

    return (
        <div>
            <div ref={scrollRef} className="interviewBox bg-[#080808] w-full container_screen_height rounded-[15px] p-[50px] overflow-auto">
                {paragraphs.map((para, index) => (
                    <p key={index} className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">{para}</p>
                ))}
            </div>
            <button onClick={addParagraph} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Add Paragraph</button>
        </div>
    );
};

export default InterviewWindow;