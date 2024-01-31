import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom"
import { questionsCollectionRef } from "../firebase/firebase_collections";
import { getDocs } from "firebase/firestore"
//icons
import { IoArrowBackOutline } from "react-icons/io5"
// Other components
import NavBar from "./../components/navbar"
import SidebarComponent from "../components/sidebar";
import QuestionCard from "./../components/question_card";
import "./styles/feed_detail.css"


function FeedDetail() {

  // Use location to retrieve params from Link (here its category name)
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state.category.name;

  const [ questions, setQuestions ] = useState([]);

  useEffect(() => {
    // It is bad practique to buil useEffect as an async function
    // Its better to build an async func in it and call it
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);

      // Parse data to only keep what we want (key: values)
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }


    getQuestions();
  }, [])


  return (
    <div id="feed-detail">
      <NavBar path={""} />
      <SidebarComponent />

      <main>
      {/* "generic-back-header" styles can be found in response.css */}
        <header className="generic-back-header">
    {/* This mean: go to the previous page */}
          <IoArrowBackOutline onClick={() => navigate(-1)}/>
          <span onClick={() => navigate(-1)}>Retour</span>
        </header>
  
        <h3>{category}</h3>

        <div className="videofeed-category">
      {questions && questions.map((question) => {
      if (question.category === (category).toLowerCase()) {

  return  <QuestionCard question={question} />
          }
      })}
        </div>

      </main>

    </div>
  );
}

export default FeedDetail;