import { useEffect, useState } from "react";
import AskVideoQuestion from "./../components/question_video";
import AskScreenQuestion from "./../components/question_screen";
import AskAudioQuestion from "./../components/question_audio";
import NavBar from "./../components/navbar";
import SidebarComponent from "../components/sidebar";
import "./styles/ask_question.css";
import { Helmet } from "react-helmet";


function AskQuestion() {

	const [startingDiv, setStartingDiv] = useState(true);

	const [videoQuestion, setVideoQuestion] = useState(false);
	const [audioQuestion, setAudioQuestion] = useState(false);
	const [screenQuestion, setScreenQuestion] = useState(false);


// Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])



	const askVideoQuestion = () => {
		setStartingDiv(false);
		setVideoQuestion(true);
		console.log("ask video question");
	};

	const askAudioQuestion = () => {
		setStartingDiv(false);
		setAudioQuestion(true);
	};

	const askScreenQuestion = () => {
		setStartingDiv(false);
		setScreenQuestion(true);
	};


	return (
		<div id="ask-question">
			<Helmet>
				<title>JNetwork | Question</title>
			</Helmet>

			<NavBar path={""} />
			<SidebarComponent props={"ask-question"} />
			<main>

{startingDiv &&
				<div id="ask-question-starting-div">
					<h4>Comment souhaitez vous poser votre question?</h4>
					<div id="ask-question-btns">
						<button className="ask-question-btn" onClick={askVideoQuestion}>Video</button>
						<button className="ask-question-btn" onClick={askAudioQuestion}>Audio</button>
						<button className="ask-question-btn" onClick={askScreenQuestion}>Capture d'écran</button>
					</div>
				</div>
}

{videoQuestion &&
				<AskVideoQuestion />
}

{audioQuestion &&
				<AskAudioQuestion />
}

{screenQuestion &&
				<AskScreenQuestion />
}

			</main>
		</div>
	);
}

export default AskQuestion;