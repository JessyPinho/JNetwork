import { useState, useEffect } from "react";
import NavBar from "./../components/navbar"
import SidebarComponent from "../components/sidebar";
import QuestionCard from "./../components/question_card"
import ResponseCard from "./../components/response_card"
import { getAuth } from "firebase/auth"
import { query, where, getDocs } from "firebase/firestore";
import { questionsCollectionRef, responsesCollectionRef } from "./../firebase/firebase_collections";



import "./styles/my_videos.css"

function MyVideos() {
	const auth = getAuth();
	const user = auth.currentUser;
	const uid = user.uid;

  const [userQuestions, setUserQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  const [showQuestions, setShowQuestions] = useState(true);
  const [showResponses, setShowResponses] = useState(false);



// Get all the questions (we'll sort them at display, in the return)
// to get all OUR questions (the user's)
  useEffect(() => {
    const fetchUserQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);

      // Parse data to only keep what we want (key: values)
      setUserQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    fetchUserQuestions();
  }, [])



// Retrieve all existing responses (of our question)
  useEffect(() => {
    const getResponses = async () => {
      const q = query(responsesCollectionRef, where("user", "==", uid));
      const querySnapshot = await getDocs(q);

      setResponses(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getResponses();
  }, [uid]);



  function toggleQuestionResponse(e) {
  	if (e.target.id === "toggle-question-btn") {
  		setShowQuestions(true);
  		setShowResponses(false);
  	}
  	else if (e.target.id === "toggle-response-btn") {
  		setShowResponses(true);
  		setShowQuestions(false);
  	}
  }

	return (
		<div id="my-videos-screen">
			<NavBar path={""} />
			<SidebarComponent />

			<main>

				<div id="choose-questions-responses">
					<h3 className="toggle-question-response-btn" id="toggle-question-btn" onClick={(e) => toggleQuestionResponse(e)}>Mes Questions</h3>
					<h3 className="toggle-question-response-btn" id="toggle-response-btn" onClick={(e) => toggleQuestionResponse(e)}>Mes Réponses</h3>
				</div>



				    {/* References to the questions asked and responses posted by the user */}
{showQuestions &&	<div id="user-references">

				  					<h3>Questions posées</h3>
				  					<div id="user-references__questions">
{userQuestions && userQuestions.map((question) => {
  if (question.uid === uid) {
return  							<QuestionCard question={question} key={question.id}  />
	} 
})}
				  					</div>

				</div>
}
{/* The Answers */}

{showResponses &&	<div id="responses-references">

										<h3>Réponses postées</h3>
										<div id="user-references__responses">
					{responses && responses.map((response) => {
	if (response.user === uid) {
					return  		<ResponseCard response={response} key={response.id} />
	}
					})}
										</div>
					        </div>
}
			</main>

		</div>

	);
}

export default MyVideos;