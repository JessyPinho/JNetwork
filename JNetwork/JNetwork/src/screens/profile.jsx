import React, { useState, useEffect } from "react"
import { useColorModeValue } from "@chakra-ui/react";

// For redirections
import { Link } from "react-router-dom";



// To fetch the user data
import { getAuth } from "firebase/auth"
import { query, where, getDocs, limit } from "firebase/firestore";
import { usersCollectionRef } from "./../firebase/firebase_collections";
import { questionsCollectionRef } from "./../firebase/firebase_collections";
import { responsesCollectionRef } from "./../firebase/firebase_collections";
import bannière from "../img/backgroundprofile.png"
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { Helmet } from "react-helmet";
import { IoPencilSharp } from "react-icons/io5";
import SlimResponsesCard from "../components/slim_responses_card";
import coin from "../img/seed2.png"
import NavBar from "./../components/navbar"
import SidebarComponent from "../components/sidebar";
import SlimQuestionCard from "./../components/slim_question_card";
import avatarPicture from "../img/default-avatar.jpg";
import "./styles/profile.css";

function  Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const [username, setUsername] = useState("");
  const [userCoins, setUserCoins] = useState(0);
  const [userJob, setUserJob] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [moreInfos, setMoreInfos] = useState(new Map());

  // path to avatar file
  const [avatarURL, setAvatarURL] = useState("");
  // File displayed
  const [avatar, setAvatar] = useState("");




//  const [email, setEmail] = useState("");

  const bg = useColorModeValue("#F4F7FE", "#1A202C");

  const [userQuestions, setUserQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState([]);

  const [showQuestions, setShowQuestions] = useState(true);
  const [showResponses, setShowResponses] = useState(false);
  
  //  Variables
  const storage = getStorage();

  // DOM References
  const levels = document.getElementsByClassName("profile__levels");


// Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

// Fetch User data
  useEffect(() => {

    const fetchUserData = async () => {
      if (user) {
        const userDoc = query(usersCollectionRef, where("uid", "==", uid));
      
        const querySnapshot = await getDocs(userDoc);
        querySnapshot.forEach((doc) => {
//          setEmail(doc.data().email);
          setUsername(doc.data().username);
          setUserJob(doc.data().job);
          setUserCoins(doc.data().coins);
          setUserDesc(doc.data().userDesc);
          setMoreInfos(doc.data().moreinfos);
          setAvatarURL(doc.data().avatar);
        });
      }
    }

    fetchUserData();
  }, [user, uid])



  useEffect(() => {
    console.log(avatarURL);
    if (!avatarURL) {

      const defaultAvatarURL = avatarPicture;
      setAvatar(defaultAvatarURL);
    } else {

      getDownloadURL(ref(storage, "profilepics/" + uid + "/" + avatarURL))
        .then((url) => {
          setAvatar(url);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [avatarURL, uid, storage]);


  // Apply style on level card depending on coin amount
  useEffect(() => {
    console.log("Montant de coins")
    console.log(userCoins)
    console.log(levels)

  // To use conditions, we need to pass switch(true)
  // The first (true) condition will be executed.
  // Writing (false) would have executed the 1st false condition
    switch (true) {
      case (1000 < userCoins && userCoins < 5000):
        console.log("petit")
        levels[0].classList.remove("selected-level");
        levels[1].classList.remove("selected-level");
        levels[2].classList.add("selected-level");
        break;
      case (5000 < userCoins && userCoins < 10000):
        console.log("moyen")
        levels[0].classList.remove("selected-level");
        levels[1].classList.add("selected-level");
        levels[2].classList.remove("selected-level");
        break;
      case (10000 < userCoins):
        console.log("grand")
        levels[0].classList.add("selected-level");
        levels[1].classList.remove("selected-level");
        levels[2].classList.remove("selected-level");
        break;
      default:
        // Do nothing
    }
  }, [userCoins, levels])



  // Retrieve all the user's questions
  useEffect(() => {
    const getQuestions = async () => {
      const q = query(questionsCollectionRef, where("uid", "==", uid), limit(3));
      const querySnapshot = await getDocs(q);

      setUserQuestions(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getQuestions();
  }, [uid]);

  // Retrieve all existing responses (of our question)
  useEffect(() => {
    const getResponses = async () => {
      const q = query(responsesCollectionRef, where("user", "==", uid), limit(3));
      const querySnapshot = await getDocs(q);

      setUserResponses(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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

  return(
    <div className="profile__container" style={{backgroundColor: bg}}>
{/* tab title */}
      <Helmet>
        <title>JNetwork | Profil</title>
      </Helmet>
      
{/* Navbar & Sidebar */}
      <NavBar path={""} />
      <SidebarComponent props={"profile"} />

{/* Profile main content */}
      <div className="profile__container__content">


{/* User Informations */}
        <div className="profile__card">

          <img src={bannière} alt="bannière" className="profile__card__bannière"/>

          <div id="profile-pic-wrapper">
              <img src={avatar} className="profile__avatar" alt="Avatar" />
          </div>

          <Link to="/settings" id="profile-settings-btn-link">
            <div id="profile-settings-btn">
              <IoPencilSharp color="#8F9BBA"/>
            </div>
          </Link>

          <div className="profile__card__content">
            <span className="profile__name">{username}</span>
            <span className="profile__profession">{userJob}</span>
            <div className="profile__card__coins">
              <img alt="coins" className="profile__card__coins-icon" src={coin} />
              <p>{userCoins}</p>
            </div>
          </div>

          <div className="profile__infos">
            <h2>Informations générales</h2>
            <p>{userDesc}</p>

            <div id="profile__infos-cards-container-value">

            {/* Faire un boucle pour afficher toutes les paires du champs "moreinfos" */}
            {moreInfos && Object.entries(moreInfos).map(([key, value]) => {
              {/* Rename the key to display the right text */}
                if (key === "company") { key = "Entreprise" }
                else if (key === "skills") { key = "Compétences" }
                else if (key === "sector") { key = "Secteur d'activité" }
                else if (key === "interests") { key = "Intérêts" }
                else if (key === "exppro") { key = "Expérience pro" }
                else if (key === "yearexp") { key = "Années d'experience" }

                if (value && value !== "") {
                  return  <div className="moreinfo-card">
                            <h4>{key}</h4>
                            <h5>{value}</h5>
                          </div>
                }
              }
            )}
            </div>

          </div>
        </div>

{/* User's Questions & Answers */}

        <div className="profile__activity">
        <div id="choose-questions-responses">
					<button className="toggle-btn" id="toggle-question-btn" onClick={(e) => toggleQuestionResponse(e)}>Mes Questions</button>
					<button className="toggle-btn" id="toggle-response-btn" onClick={(e) => toggleQuestionResponse(e)}>Mes Réponses</button>
				</div>
          {showQuestions && <div id="my-question-answers">
            {userQuestions && userQuestions.map((question) => {
            for(let a = 0; a < 3; a++) {
            return <SlimQuestionCard question={question} />
            }
            })}
            </div>
          }

          {showResponses && <div id="my-question-answers">
            {userResponses && userResponses.map((response) => {
            for(let a = 0; a < 3; a++) {
            return <SlimResponsesCard response={response} />
            }
            })}
            </div>
          }
          
          <Link to="/my-videos" className="my-question-answers_see-more">
            <span>Voir plus</span>
          </Link>
        </div>


{/* Level related to the coin amount */}

        <div className="profile__level">
          <div id="profile__level-inner">
            <h2>Niveaux</h2>
            <div className="profile__levels">
              <h3>GOLD</h3>
              <div id="colorBlock1"></div>
              <p>10000</p>
            </div>
            <div className="profile__levels">
              <h3>PREMIUM</h3>
              <div id="colorBlock2"></div>
              <p>5000</p>
            </div>
            <div className="profile__levels">
              <h3>SILVER</h3>
              <div id="colorBlock3"></div>
              <p>1000</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;