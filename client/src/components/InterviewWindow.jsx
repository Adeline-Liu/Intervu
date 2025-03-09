import React, { useRef, useEffect } from "react";

const InterviewWindow = () => {
  const scrollRef = useRef();

  useEffect(() => {
    // Scrolls to the bottom when the component mounts
    const scrollElement = scrollRef.current;
    scrollElement.scrollTop = scrollElement.scrollHeight;
  }, []);
  return (
    <div
      ref={scrollRef}
      className="interviewBox bg-[#080808] w-full container_screen_height rounded-[15px] p-[50px] overflow-auto"
    >
      <p className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">
        This is how a really long text may appear. The actual functionality of
        text appearing here in real time has to be implemented when the backend
        is fully implemented for the AI to produce a response and for the user
        to give feedback through the microphone
      </p>
      <p className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">
        This might be text which is interpreted when you speak into the program,
        very cool just make sure you don't goof up
      </p>
      <p className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">
        I'm just writing more dummy text because I don't know what else to write
        about :,). Why do you want to work at Botato, did you bring your botato?
        Botatos are always a neceseciety (I can't spell) when interviewing with
        Botato Inc.
      </p>
      <p className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">
        AAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        AAAAAAAAAAAAAAAAAAAAAAAAAAA
      </p>
      <p className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">
        I just want to have enough text to exceed the container please let me do
        that T^T
      </p>
    </div>
  );
};

export default InterviewWindow;
