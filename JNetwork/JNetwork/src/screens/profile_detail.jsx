import React, { useState, useEffect } from "react"
import { useColorModeValue } from "@chakra-ui/react";
// For redirections
import { useParams, useNavigate } from "react-router-dom";
// To fetch the user data
import { query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
// Change tab name
import { Helmet } from "react-helmet";
import { usersCollectionRef } from "./../firebase/firebase_collections";
// Icons
import { IoArrowBackOutline } from "react-icons/io5"
import NavBar from "./../components/navbar"
import SidebarComponent from "../components/sidebar";
import coin from "../img/seed2.png"
import bannière from "../img/backgroundprofile.png"
import "./styles/profile.css";


function  ProfileDetail() {
  // Get the uid of the profile we're on
  const {id} = useParams()

  const navigate = useNavigate();


  const [username, setUsername] = useState("");
//  const [email, setEmail] = useState("");
  const [userCoins, setUserCoins] = useState(0);
  const [userJob, setUserJob] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [moreInfos, setMoreInfos] = useState(new Map());

  // path to avatar file
  const [avatarURL, setAvatarURL] = useState("");
  // File displayed
  const [avatar, setAvatar] = useState("");


  const bg = useColorModeValue("#F4F7FE", "#1A202C");


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

      const userDoc = query(usersCollectionRef, where("uid", "==", id));
    
      const querySnapshot = await getDocs(userDoc);
      querySnapshot.forEach((doc) => {
//        setEmail(doc.data().email);
        setUsername(doc.data().username);
        setUserJob(doc.data().job);
        setUserCoins(doc.data().coins);
        setUserDesc(doc.data().userDesc);
        setMoreInfos(doc.data().moreinfos);
        setAvatarURL(doc.data().avatar);
      });
    }

    fetchUserData();
  }, [id]);



// Get the Avatar from storage
  useEffect(() => {
    if (avatarURL === "default-avatar.jpg") {
  // Link to the video in firestore
      getDownloadURL(ref(storage, "profilepics/" + avatarURL))
        .then((url) => {
          setAvatar(url)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    else if (avatarURL !== "") {
      getDownloadURL(ref(storage, "profilepics/" + id + "/" + avatarURL))
        .then((url) => {
          setAvatar(url)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }, [avatarURL, storage, id]);


  // Apply style on level card depending on coin amount
  useEffect(() => {

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



  return(
    <div className="profile__container" style={{backgroundColor: bg}}>
{/* tab title */}
      <Helmet>
        <title>JNetwork | User</title>
      </Helmet>
      
{/* Navbar & Sidebar */}
      <NavBar path={""} />
      <SidebarComponent props={"profile-detail"} />

{/* Profile main content */}
      <div className="profile__container__content">

        {/* Style in response.css */}
        <div className="generic-back-header">
    {/* This mean: go to the previous page */}
          <IoArrowBackOutline onClick={() => navigate(-1)}/>
          <span onClick={() => navigate(-1)}>Retour</span>
        </div>

{/* User Informations */}
        <div className="profile__card">

          <img src={bannière} alt="bannière" className="profile__card__bannière"/>

          <div id="profile-pic-wrapper" className="profile-detail-pic-wrapper">
              <img src={avatar} className="profile-detail__avatar" alt="Avatar" />
          </div>


          <div className="profile__card__content profile-detail__card__content">
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

            <div id="profile__infos-cards-container">

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

export default ProfileDetail;