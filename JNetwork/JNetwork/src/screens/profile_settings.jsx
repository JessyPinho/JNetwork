import React, { useState, useEffect } from "react";
import bannière from "../img/backgroundprofile.png"
import coin from "../img/seed2.png"
// React router -> Redirect
import { useNavigate } from "react-router-dom"
// To fetch the user data
import { getAuth } from "firebase/auth"
import { query, where, getDocs } from "firebase/firestore";
import { usersCollectionRef } from "./../firebase/firebase_collections";
// Text field component from MaterialUI
import { TextField } from "@material-ui/core";
// To decorate tab infos (icon/title)
import { Helmet } from "react-helmet";
// To update DB
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "./../firebase/init_firebase"
// Icons
import { IoArrowBackOutline } from "react-icons/io5";
import NavBar from "./../components/navbar";
import SidebarComponent from "../components/sidebar";
import "./styles/profile_settings.css"
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import avatarPicture from "../img/default-avatar.jpg";


function  ProfileSettings() {
  const navigate = useNavigate()

  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [userCoins, setUserCoins] = useState(0);
  const [userJob, setUserJob] = useState("");
  const [avatarURL, setAvatarURL] = useState("");

// Map to store all "key: value" infos
  const [moreInfos, setMoreInfos] = useState(new Map());



// To update user's situation & description
  const [job, setJob] = useState("");
  const [userDesc, setUserDesc] = useState("");

// Ref to the user
  const userDocRef = doc(db, "users", uid);

// Fetch user Data
  useEffect(() => {
    const fetchUserData = async () => {
      

      if (user) {
        const userDoc = query(usersCollectionRef, where("uid", "==", uid));
      
        const querySnapshot = await getDocs(userDoc);
        querySnapshot.forEach((doc) => {
          setMoreInfos(doc.data().moreinfos);
          setUsername(doc.data().username);
          setUserJob(doc.data().job);
          setUserCoins(doc.data().coins);
          setUserDesc(doc.data().userDesc);
          setAvatarURL(doc.data().avatar);
        });
      }
    }

    fetchUserData();
  }, [user, uid]);



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


  //  UPLOADING NEW AVATAR
  function changeAvatar(e) {
    const fakepath = e.target.value
    const splitBlob = fakepath.split('\\');
    const blobUrl = splitBlob[2];
// Get the avatar
    const fileInput = document.getElementById("profile-pic");
    const selectedAvatar = fileInput.files[0];

    // then upload the new avatar
    const storageRef = ref(storage, "profilepics/" + uid + "/" + blobUrl);
    uploadBytes(storageRef, selectedAvatar).then((snapshot) => {
      // Set new filename
      console.log(blobUrl);
      setAvatarURL(blobUrl);

/*
    SHOW TOAST NOTIFICATION
*/

      console.log("Avatar updated!")
    })
    console.log("updating document")
    // Upload it in the user doc
    updateDoc(userDocRef, {
      avatar: blobUrl
    });

  }


  function submitSituation() {
    updateDoc(userDocRef, {
      job
    })
    .then(() => {
      toast.success("Situation mise à jour !")
    })
  }


  function submitDescription() {
    updateDoc(userDocRef, {
      userDesc
    })
    .then(() => {
      toast.success("Description mise à jour !")
    })
  }




// Update "moreInfos" pairs
  async function addMoreInfoField(e) {
    e.preventDefault();
    console.log("coucou");
    console.log(e.target.id);
    console.log(e.target.value);
    setMoreInfos({ ...moreInfos, [e.target.id]: e.target.value });
    console.log(moreInfos);
  }


/* Upload "moreInfos" pairs */
  function submitUserMoreInfo(e) {
    e.preventDefault();

    updateDoc(userDocRef, {
      moreinfos: moreInfos
    })
    .then(() => {
      toast.success("Informations mises à jour !")
    })
  }

  return(
    <div id="settings">
      <Helmet>
        <title>JNetwork | Settings</title>
      </Helmet>

      <NavBar path={""} />
      <SidebarComponent/>
      <main>
        <div className="generic-back-header">
      {/* This mean: go to the previous page */}
          <IoArrowBackOutline onClick={() => navigate(-1)}/>
          <span onClick={() => navigate(-1)}>Retour</span>
        </div>

        <h2>Mettre à jour vos informations</h2>
        
{/* The pro from has no use now. Its only front. no back. useless

        <Link to="/proform">
          <button id="to-proform-btn">Remplir mes informations professionnelles</button>
        </Link>
*/}
        <div id="settings-form-container">
            <div id="profile-settings-card">

              <img src={bannière} alt="bannière" className="profile__card__bannière"/>

              <div id="profilesettings-pic-wrapper">
                <label id="profile-pic-container">
                  <input id="profile-pic" type="file" name="profile-pic" onChange={(e) => changeAvatar(e)}
                        accept="image/png, image/jpg, image/jpeg" />
                  <img src={avatar} className="profile-settings__avatar" alt="Avatar" />
                </label>
              </div>

              <div className="profile__settings__card__content">
                <span className="profile__name">{username}</span>
                <span className="profile__profession">{userJob}</span>
                <div className="profile__card__coins">
                  <img alt="coins" className="profile__card__coins-icon" src={coin} />
                  <p>{userCoins}</p>
                </div>
              </div>

              <div className="profile_settings__infos">
                <h2>Informations générales</h2>
                {/* Upadate job & description */}
                <div className="settings-top">
                  <div className={"settings-form-container__input settings-situation"}>
                    <label className="settings-form-container__label">Votre situation actuelle</label>
                    <TextField
                      variant="outlined"
                      label="Situation"
                      type="text"
                      margin="normal"
                      className="job__textBox"
                      value={job}
                      onChange={(event) => setJob(event.target.value) }
                      placeholder=""
                      placeholderTextColor="#71D7D7"
                    />
                    <button onClick={() => submitSituation()}>Confirmer</button>
                  </div>

                  <div className="settings-form-container__input">
                    <label className="settings-form-container__label">Votre description</label>
                    <textarea
                      className="user-profile-desc"
                      onChange={(e) => setUserDesc(e.target.value)}
                      placeholder="Ajouter une description..."
                    />
                    <button onClick={() => submitDescription()}>Confirmer</button>
                  </div>
                </div>

                {/* moreinfos cards */}
                <form id="profile__infos_form" onSubmit={submitUserMoreInfo}>
                  <div id="profile__settings-cards-container">

                    <div>
                      <label for="sector">Secteur d'activité</label>
                      <select id="sector"
                        className="add-info-input"
                        onChange={addMoreInfoField}
                        >
                        <option selected value="" disabled>Choix</option>
                        <option value="" hidden></option>
                        <option value="Informatique">Informatique</option>
                        <option value="Automobile">Automobile</option>
                        <option value="Agroalimentaire">Agroalimentaire</option>
                        <option value="Sport">Sport</option>
                        <option value="Tourisme">Tourisme</option>
                        <option value="Management">Management</option>
                      </select>
                    </div>

                    <div>
                      <label for="exppro">Expérience (en années)</label>
                      <select id="exppro"
                        className="add-info-input"
                        onChange={addMoreInfoField}
                        >
                        <option selected value="" disabled>Choix</option>
                        <option value="" hidden></option>
                        <option value="&lt; 1 an"> &lt; 1 an</option>
                        <option value="Entre 1 et 2 ans">Entre 1 et 2 ans</option>
                        <option value="Entre 2 et 5 ans">Entre 2 et 5 ans</option>
                        <option value="&gt; 5 ans"> &gt; 5 ans</option>
                      </select>
                    </div>

                    <div>
                      <label for="skills">Compétence</label>
                      <select id="skills"
                        className="add-info-input"
                        onChange={addMoreInfoField}
                        >
                        <option selected value="" disabled>Choix</option>
                        <option value="" hidden></option>
                        <option value="Business">Business</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Tech">Tech</option>
                        <option value="Droit">Droit</option>
                      </select>
                    </div>

                    <div>
                      <label for="company">Nom du projet</label>
                      <input
                        className="add-info-input"
                        id="company"
                        type="text"
                        onChange={addMoreInfoField}
                        
                      />
                    </div>

                    <div>
                      <label for="interests">Intérêts</label>
                      <select id="interests"
                        className="add-info-input"
                        onChange={addMoreInfoField}
                        >
                        <option selected value="" disabled>Choix</option>
                        <option value="" hidden></option>
                        <option value="Musique">Musique</option>
                        <option value="Sport">Sport</option>
                        <option value="Jeux vidéos">Jeux vidéos</option>
                        <option value="High-Tech">High-Tech</option>
                      </select>
                    </div>

                    <div>
                      <label for="yearexp">Age de votre projet</label>
                      <select id="yearexp"
                        className="add-info-input"
                        onChange={addMoreInfoField}
                        >
                        <option selected value="" disabled>Choix</option>
                        <option value="" hidden></option>
                        <option value="Entre 1 et 3 mois">Entre 1 et 3 mois</option>
                        <option value="Entre 3 et 6 mois">Entre 3 et 6 mois</option>
                        <option value="Entre 6 mois et 1 an">Entre 6 mois et 1 an</option>
                        <option value="&gt; 1 an"> &gt; 1 an</option>
                      </select>
                    </div>

                  </div>
                  <input id="submit-profile-info" type="submit" value="Ajouter" />
                </form>
              </div>
            </div>

        </div>


      </main>
    </div>
  );
}

export default ProfileSettings;