import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../Header";
import Footer from "../Footer";
import CameraView from "../components/CameraView";
import { saveAs } from 'file-saver';

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
  ]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [dynamicContent, setDynamicContent] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const recognitionRef = useRef(null);
  const feedbackRef = useRef(null);
  const mockInterviewRef = useRef(null);
  const [feedback, setFeedback] = useState([]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    // Fetch questions from the backend
    fetch('http://54.81.170.161:8000/get_questions/2/1')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched questions:', data.questions); // Print fetched questions
        const parsedQuestions = data.questions.map((question, index) => ({
          id: index + 1,
          text: question
        }));
        setQuestions(parsedQuestions);
        setAnswers(new Array(parsedQuestions.length).fill(""));
        setQuestionsLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  const handleDashboardClick = () => {
    navigate("/dashboard");
    mockInterviewRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const saveFeedbackToFile = () => {
    const blob = new Blob([feedback], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'feedback.txt');
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
    addParagraph(question.text, "lightblue");
    setTimeout(() => {
      setCurrentQuestion(question.text);
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
    console.log(questions)
    console.log(answers)
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
        [`question${index + 1}`]: question.text,
        [`answer${index + 1}`]: answers[index],
      };
    });
    
    const jsonData = JSON.stringify({ response });    
  
    const url = 'http://54.81.170.161:8000/feedback/';  // Ensure the backend endpoint is using POST
  
    fetch(url, {
      method: 'POST',  // Use POST method
      headers: {
        'Content-Type': 'application/json',  // Set content type to JSON
      },
      body: jsonData,  // Send the data as JSON in the body
    })
      .then(response => response.json())
      .then(result => {
        const feedback = result.feedback;  // Extract the feedback from the result
        setFeedback(feedback);  // Update the state with the feedback
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
              <button 
                className={`font-semibold text-center text-3xl bg-slateBlue text-white my-[50px] px-[50px] py-[20px] rounded-md hover:bg-[#28416B] transition-colors ${!questionsLoaded ? 'opacity-50 cursor-not-allowed' : ''}`} 
                role="button" 
                aria-label="Start mock interview" 
                onClick={questionsLoaded ? handleButtonClick : null}
                disabled={!questionsLoaded}
              >
                {!questionsLoaded ? 'Loading...' :
                interviewState === 'start' ? 'Start' : 
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
              {feedback.length === 0 ? (
                <p className="text-2xl font-semibold text-white w-full" style={{color: "lightcoral"}}>No feedback available yet</p>
              ) : (
                <p className="text-2xl font-semibold text-white w-full">{feedback}</p>
              )}
              <div className="flex justify-center my-[30px]">
                <button className="font-bold text-center text-3xl bg-slateBlue text-white px-[32px] py-[20px] rounded-md hover:bg-[#28416B] transition-colors"
                role="button"
                onClick={saveFeedbackToFile}>
                  Save to local directory
                </button>
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
