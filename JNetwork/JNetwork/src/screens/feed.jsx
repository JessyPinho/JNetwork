import { useEffect, useState } from "react";
import { getAuth   } from "firebase/auth"
import { getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { questionsCollectionRef } from "../firebase/firebase_collections";
import NavBar from "./../components/navbar"
import SidebarComponent from "../components/sidebar";
import QuestionCard from "./../components/question_card";
import categories from "./../misc-data/data";
import { useAuthState } from "react-firebase-hooks/auth";
import { Helmet } from "react-helmet";


import "./styles/feed.css"

const Feed = () => {
  const auth = getAuth();
  // const loggedUser = auth.currentUser;
  // const uid = loggedUser.uid;

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [questions, setQuestions] = useState([]);




// fetch all questions
  useEffect(() => {
    // It is bad practique to buil useEffect as an async function
    // Its better to build an async func in it and call it
    const getQuestions = async () => {
//   This query is supposed to work with the "filters" array, but its not working
//    const data = query(questionsCollectionRef, where('category', 'in', filters]));
    const data = await getDocs(questionsCollectionRef)
      // Parse data to only keep what we want (key: values)
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getQuestions();
  }, [])

  // Redirect to Login page if no one is logged in
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading, navigate]);




  return (
    <div id="feed">
      <Helmet>
        <title>JNetwork | Feed</title>
      </Helmet>

      <NavBar path={""} />
      <SidebarComponent props={"feed"} />
      <main>

        <div id="feed-main-header">
          <div id="feed-main-header__text">
            <h3>Bienvenue dans cette nouvelle promo</h3>
            <p>Échanger, créer, innover</p>
          </div>
        </div>

{/*   Disable for now
      We'll put it back when they'll work correctly */}

        <div id="filters-and-button">
          
    {/* Filters for the feed (soon) */}

            <div id="feed-filters">


        {categories && categories.map((category) => {

        return  <Link to="/feed/category" state={{ category: category }}>  
                  <label className="single-filter" key={category.id}>
                    <input type="checkbox" className="single-filter__input"
                        value={category.name} />
                    <span className="single-filter__clickable">{category.name}</span>
                  </label>
                </Link>
        })}

            </div>



          {/* Link to record a video/post a question */}

{/* Disable for now
    We'll put it back when the "ask a question" feature
    is done */}


            <div id="ask-question-btn">

          {/* Ask question button */}

              <Link to="/askquestion">
                <div id="question-btn">
                  <span>Poser une question!</span>
                </div>
              </Link>
            </div>

          </div>


        <div id="all-questions">

{/* Display all questions */}

{/* Disable for now
    We'll put it back when the "ask a question" feature
    is done */}

{questions && questions.map((question) => {
// Put everything in a link to the detailed question
// The thumbnail contains:
// an img, creation date of the question, category, title, username of the poster

return    <QuestionCard question={question} />

})}




        </div>
      </main>
    </div>
  );
};

export default Feed;