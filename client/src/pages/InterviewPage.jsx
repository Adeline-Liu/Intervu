import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header";
import Footer from "../Footer";
import CameraView from "../components/CameraView";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const InterviewWindow = ({ paragraphs, dynamicContent }) => {
  const scrollRef = useRef();

  useEffect(() => {
    const scrollElement = scrollRef.current;
    scrollElement.style.scrollBehavior = 'smooth';
    scrollElement.scrollTop = scrollElement.scrollHeight;
  }, [paragraphs, dynamicContent]);

  return (
    <div>
      <div ref={scrollRef} className="interviewBox bg-[#080808] w-full container_screen_height rounded-[15px] p-[50px] overflow-auto">
        {paragraphs.map((para, index) => (
          <p key={index} style={{ color: para.color }} className="text-2xl leading-10 py-[5px] text-wrap break-words">{para.text}</p>
        ))}
        {dynamicContent && <p className="text-beige text-2xl leading-10 py-[5px] text-wrap break-words">{dynamicContent}</p>}
      </div>
    </div>
  );
};

const InterviewPage = () => {
  const navigate = useNavigate();
  const [interviewState, setInterviewState] = useState('start');
  const [paragraphs, setParagraphs] = useState([
    {text: "Welcome to Intervu! Click start to start the mock interview.", color: "white"}
    // { text: "This is how a really long text may appear. The actual functionality of text appearing here in real time has to be implemented when the backend is fully implemented for the AI to produce a response and for the user to give feedback through the microphone", color: "beige" },
    // { text: "This might be text which is interpreted when you speak into the program, very cool just make sure you don't goof up", color: "beige" },
    // { text: "I'm just writing more dummy text because I don't know what else to write about :,). Why do you want to work at Botato, did you bring your botato? Botatos are always a neceseciety (I can't spell) when interviewing with Botato Inc.", color: "beige" },
    // { text: "AAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAAA", color: "beige" },
    // { text: "I just want to have enough text to exceed the container please let me do that T^T", color: "beige" }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [dynamicContent, setDynamicContent] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const recognitionRef = useRef(null);
  const feedbackRef = useRef(null);
  const mockInterviewRef = useRef(null);

  // for testing purposes only, remove later
  const questions = [
    "Why do you want to work at this company?",
    "What are your strengths and weaknesses?",
  ];

  const [answers, setAnswers] = useState(new Array(questions.length).fill(""));

  // const [questions, setQuestions] = useState([]);
  // const [answers, setAnswers] = useState([]);

  // useEffect(() => {
  //   // Fetch questions from the backend
  //   fetch('your-backend-endpoint')
  //     .then(response => response.json())
  //     .then(data => {
  //       setQuestions(data.questions);
  //       setAnswers(new Array(data.questions.length).fill(""));
  //     })
  //     .catch(error => {
  //       console.error('Error fetching questions:', error);
  //     });
  // }, []);

  const handleDashboardClick = () => {
    navigate("/dashboard");
    mockInterviewRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const addParagraph = (text, color = "white") => {
    setParagraphs(prev => [...prev, { text, color }]);
  };

  const startInterview = () => {
    startAsking();
    mockInterviewRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const startAsking = () => {
    setInterviewState('asking');
    const question = questions[questionIndex];
    addParagraph(question, "lightblue");
    setTimeout(() => {
      setCurrentQuestion(question);
      setInterviewState('doneAsking');
    }, 3000);
  };

  const startResponding = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      setInterviewState('responding');

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            finalTranscript += transcript;
          }
        }
        setUserResponse(finalTranscript); // Save the final response in userResponse
        setDynamicContent(finalTranscript); // Update dynamic content with interim results
        setInterviewState('responding');
      };

      recognitionRef.current.onerror = (event) => {
        addParagraph("Microphone isn't enabled or an error occurred during speech recognition", "red");
        setInterviewState('responding');
      };
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      // addParagraph("Microphone isn't enabled or an error occurred during speech recognition");
      // setInterviewState('asking');
      setInterviewState('responding');
    }
  };

    const stopResponding = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      const finalDynamicContent = dynamicContent; // Store the value of dynamicContent
      addParagraph(finalDynamicContent, "green"); // Add dynamic content to paragraphs
      addParagraph("Stopping response...", "yellow");
      setDynamicContent(""); // Clear dynamic content

      // add answers
      const updatedAnswers = [...answers];
      updatedAnswers[questionIndex] = userResponse;
      setAnswers(updatedAnswers);

      setTimeout(() => {
        setInterviewState('stopped');
        if (questionIndex + 1 < questions.length) {
          setQuestionIndex(prev => prev + 1);
          setInterviewState('stopped');
        } else {
          setInterviewState('start');
          handleSave();
          feedbackRef.current.scrollIntoView({ behavior: "smooth" });
          setQuestionIndex(0); // Reset questionIndex after all questions
        }
        addParagraph("Stopped", "yellow");
      }, 1000);
    }
  };

  const handleButtonClick = () => {
    console.log(questionIndex);
    switch (interviewState) {
      case 'start':
        startInterview();
        break;
      case 'asking':
        break;
      case 'doneAsking':
        startResponding();
        break;
      case 'responding':
        stopResponding();
        break;
      case 'stopping':
        break;
      case 'stopped':
        setTimeout(() => {
          startAsking();
        }, 1000);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    const response = {};
  
    questions.forEach((question, index) => {
      response[index + 1] = {
        [`question${index + 1}`]: question,
        [`answer${index + 1}`]: answers[index],
      };
    });
  
    const jsonData = JSON.stringify({ response });
  
    fetch('your-backend-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonData,
    })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };  

  return (
    <div>
      <Header />
      <div role="main">
        <section className="px-[100px] py-[50px] items-center bg-navyBlue" role="region" aria-labelledby="MockInterview" style={{minHeight:"100vh"}}>
          <div className="flex justify-between">
            <div className="w-2/5">
              <h1 id="MockInterview" ref={mockInterviewRef} className="text-6xl font-bold text-beige max-w-5xl leading-20"> Mock Interview </h1>
              <div className="w-35 border-b-5 border-lightPurple mb-[20px]"></div>
              <h1 className="text-2xl font-semibold text-beige leading-10"><u>Job Title</u>: JOB TITLE</h1>
              <h1 className="text-2xl font-semibold text-beige leading-15"><u>Company</u>: COMPANY</h1>
              <button className="font-semibold text-center text-3xl bg-slateBlue text-white my-[50px] px-[50px] py-[20px] rounded-md hover:bg-[#28416B] transition-colors" role="button" aria-label="Start mock interview" onClick={handleButtonClick}>
                {interviewState === 'start' ? 'Start' : 
                interviewState === 'asking' ? 'Asking question' : 
                interviewState === 'doneAsking' ? 'Start responding' :
                interviewState === 'responding' ? 'Stop responding' : 
                interviewState === 'stopping' ? 'Stopping response' : 
                interviewState === 'stopped' ? 'Start asking' : "Error"}
              </button>
              <CameraView />
            </div>
            <div className="w-3/5 py-[50px]">
              <InterviewWindow paragraphs={paragraphs} dynamicContent={dynamicContent} />
            </div>
          </div>
        </section>
        <section role="region" aria-labelledby="Feedback">
          <div className="px-[100px] py-[50px] items-center bg-navyBlue">
            <h2 id="Feedback" ref={feedbackRef} className="text-4xl text-white py-[20px] font-bold"> Feedback </h2>
            <div className="bg-darkBlue px-[50px] py-[30px] rounded-[15px]">
              <p className="text-2xl font-semibold text-white w-full">Yaya</p>
              <div className="flex justify-center my-[30px]">
                <button className="font-bold text-center text-3xl bg-slateBlue text-white px-[32px] py-[20px] rounded-md hover:bg-[#28416B] transition-colors" role="button"> Save to local directory </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center bg-navyBlue">
            <button className="font-bold text-center text-3xl bg-[#4F567D] text-white my-[30px] px-[32px] py-[20px] rounded-md hover:bg-[#3E4361] transition-colors" onClick={handleDashboardClick} role="button"> Return to Dashboard </button>
          </div>
        </section>
      </div>
      <Footer borderingColor="var(--color-navyBlue)" />
    </div>
  );
};

export default InterviewPage;
