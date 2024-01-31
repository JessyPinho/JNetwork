import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
// Import the link to the firebase project
import { questionsCollectionRef } from "./../firebase/firebase_collections"
import { db } from "./../firebase/init_firebase"
import { getAuth } from "firebase/auth"
// Import "premade" input from material
import { TextField } from "@material-ui/core";
// Import for firestore
import { doc, getDoc, addDoc, updateDoc } from "firebase/firestore"
// Icons
import { IoCloseSharp, IoPencilSharp } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5"
import Loading from "./loading"
import "./styles/question_component.css";
import "./styles/question_text.css";

const AskTextQuestion = () => {


  // Additional infos on the question
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [textQuestion, setTextQuestion] = useState("");
/*  There is also the username just bellow and the creation date
*   is created when uploading the question
*/

  // Bool to show the loading anim or not
  const [uploading, setUploading] = useState(false);
  

  // Progress bar for optional file upload
  const [progress, setProgress] = useState(0);

  // To redirect after publishing
  const navigate = useNavigate();

  // Fetch current user UID
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  const [username, setUsername] = useState("");
  const [userCoins, setUserCoins] = useState("");

  // Booleans to show/hide the step of the question
  const [firstStepQuestion, setFirstStepQuestion] = useState(true);
  const [secondStepText, setSecondStepText] = useState(false);
  const [thirdStepQuestion, setThirdStepQuestion] = useState(false);

  // bool to show the popup to add an info
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [showAddInfo2, setShowAddInfo2] = useState(false);
  const [recapInfo, setRecapInfo] = useState(false);
//  const recordLight = document.getElementById("record-light");


// Fetch current User
// here, we'll use it to get their username, coins
  useEffect(() => {
    const getUser = async () => {
      // Create a ref to the data we want
      const docRef = doc(db, "users", uid);
      // Make a request to get the data
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setUsername(docSnap.data().name)
        setUserCoins(docSnap.data().coins)
      }
    }
    getUser();
  }, [uid])


  // Bridge from 1st panel to 2nd page
  function askTextQuestion() {
    // Faire apparaitre un popup comme qui il manque une info
    if (!description || !title)
      return;
    setFirstStepQuestion(false);
    setSecondStepText(true);
  }


  function gotoRecap(e) {
    e.preventDefault();

    if (textQuestion !== "") {
      setSecondStepText(false);
      setThirdStepQuestion(true);
    }
  }



  function goBackToStepOne(e) {
    e.preventDefault();

    setSecondStepText(false);
    setFirstStepQuestion(true);
  }


/* Once a category is selected in the dropdown,  */
  function updateCategory(e) {
    e.preventDefault();
    setCategory(e.target.value)
  }




  // Check if the opt file exists and set the name for later
/*
  const checkFileInput = (e) => {
    e.preventDefault()
    console.log("uploading")

    // Show the loading anim
    setUploading(true);
    
    let file = "";

// Looking at target[3] because our file is the 4th input of the form
    if (e.target[3].files[0] !== "") {
      file = e.target[3].files[0];
    }
    submitData(file);
  }
*/


  // Update the user's coin amount (+20 for a question)
  function updateCoinAmount() {
    // Create a ref to the data we want
    const docRef = doc(db, "users", uid);

    updateDoc(docRef, {
      coins: userCoins + 20,
    })
  }


// THIS is what happens when you hit "publish"
// SUBMIT ALL DATA HERE (this function is called by checkFileInput())
  const submitData = async () => {

    console.log("SUBMITTING")
    setUploading(true);

    // Get current Date, and split it because easier
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Cause January is month: 0
    const year = date.getFullYear();
    const currentDate = `${day}-${month}-${year}`

// Submit data to DB
// Keep the code below to handle the optionnal file
// The optionnal file has been removed for now. Coming back soon!
    await addDoc(questionsCollectionRef, { creationDate: currentDate, username, uid, title, description, textQuestion, category, videourl: "", thumbnailURL: category + ".png", optionnalFile: ""});
    updateCoinAmount();
// Submit files to cloud storage
  // Submit optional file
/*
    if (file) {
      const storageRefFile = ref(storage, `optionnalFiles/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRefFile, file);

      uploadTask.on("stage_changed", (snapshot) => {
        const prog = (Math.round
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(url => console.log("Data has been sent to the Database"))
      });
    }
*/


// Should add pop-up with 2 buttons saying
// "Question upladed ! goto feed? ask another?"
    navigate("/feed");
  };

  // Show and hide "add info" popup
  function showAddInfoPopup() {
    setShowAddInfo(true)
  }
  function hideAddInfoPopup() {
    setShowAddInfo(false)
  }
  function showAddInfoPopup2() {
    setShowAddInfo2(true)
  }

  function hideAddInfoPopup2() {
    setShowAddInfo2(false)
  }
  function showRecapInfoPopup() {
    setRecapInfo(true)
  }
  function hideRecapInfoPopup() {
    setRecapInfo(false)
  }


  return (
    <div id="">

        <div id="ask-text-question-container">


{/* First Step, enter Title & Category (Both Required) */}

{firstStepQuestion &&  
            <div className="first-step-question-text">
              <h1>Infos</h1>
              <div id="questionTitle" className="questionTitleClass">
                <span className="first-step-question-label">
                  <span>Titre de la question</span>
                  <IoPencilSharp className="pencil" cursor="pointer" onClick={showAddInfoPopup} fontSize={25} color="#8F9BBA"/>
                </span>
                <span>{title}</span>
              </div>
              <div id="questionDescription" className="questionDescriptionClass">
                <span className="first-step-question-label">
                  <span>Description de ta question</span>
                  <IoPencilSharp className="pencil" cursor="pointer" onClick={showAddInfoPopup2} fontSize={25} color="#8F9BBA"/>
                </span>
                <p>{description}</p>
              </div>

              <p className="record-label">Vous pouvez maintenant poser votre question</p>
              <div id="step-one-btn-container" className="step-one-btn-container-class">
                <button className="upload-question-btn" onClick={ askTextQuestion }>Suivant</button>
              </div>
            </div>

}




{/* SECOND STEP, ask your question */}


{/* TEXT STYLE */}

{secondStepText && <div className="question-more-infos__main">

            <div className="second-step-head" onClick={goBackToStepOne}>
              <IoArrowBackOutline />  
              <span id="step-text-to-one">Retour</span>
            </div>

            <label className="question-more-infos__label">Posez votre question</label>
            <textarea
              className="ask-text-question-field"
              onChange={(e) => setTextQuestion(e.target.value)}
              placeholder=""
            />
            <span id="to-step-three__text" className="to-step-three-btn" onClick={gotoRecap}>Suivant</span>

          </div>
}




{/* Overview and Upload */}

{thirdStepQuestion && 

            <div className="third-step-question">
              <div id="recap-more-info">
                <div className="recap-title">
                  <span id="recap-more-info__title">{title}</span>
                </div>
  {textQuestion &&
                <div>
                  <textarea id="recap-text-question">{textQuestion}</textarea>
                </div>
  }
                  <div>
                    <div className="recap-description-label">
                      <span>Description</span>
                      <IoPencilSharp className="pencil" cursor="pointer" onClick={showRecapInfoPopup} fontSize={25} color="#8F9BBA"/>
                    </div>
                  </div>
                  <div id="questionCategory">
                    <select className="select-category"
                      onChange={updateCategory}
                      required>
                      <option selected value="" disabled>Choisissez votre catégorie</option>
                      <option value="" hidden></option>
                      <option value="feedback">Feedback</option>
                      <option value="finance">Finance</option>
                      <option value="informatique">Informatique</option>
                      <option value="marketing">Marketing</option>
                      <option value="autres">Autres</option> 
                    </select>

                  </div>
                </div>

                <div id="third-step-question__btns">

                  <Link to="/feed" id="cancel-question-btn" className="third-step-question__btns-btn">
                    <span>Annuler</span>
                  </Link>

{textQuestion && <button onClick={submitData} className="third-step-question__btns-btn submit-question-btns">Publier</button> }
                </div>
              </div>
}
        </div>


        {/* Popup to add an info */}
{showAddInfo && <div className="question-add-info-popup">

          <form onSubmit={hideAddInfoPopup}>
            <div>
              <IoCloseSharp onClick={hideAddInfoPopup} />
            </div>
            <div className="questionTitleClass">
              <TextField
                  variant="outlined"
                  label="Titre"
                  type="text"
                  className="question-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la question"
                  autofocus
                  required
                />
            </div>

            <input className="submit-question-info" type="submit" value="Ajouter" />
          </form>
          </div>
}

{showAddInfo2 && <div className="question-add-info-popup">

          <form onSubmit={hideAddInfoPopup2}>
            <div>
              <IoCloseSharp onClick={hideAddInfoPopup2} />
            </div>  
            <div id="questionDescriptionPopup">
              <textarea
                className="question-description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la question"
                value={description}
                autofocus
                required
              />
            </div>

            <input className="submit-question-info" type="submit" value="Ajouter" />
          </form>
          </div>
}

{recapInfo && <div className="recap-info-popup">

          <form onSubmit={hideRecapInfoPopup}>
            <div>
              <IoCloseSharp onClick={hideRecapInfoPopup} />
            </div>  
            <div id="recapDescriptionPopup">
              <textarea
                className="recap-description"
                value={description}
                readOnly={true}
              />
            </div>

            <input className="submit-description-button" type="submit" value="Valider" />
          </form>
          </div>
}

      {uploading && <Loading />}
    </div>
  );
};

export default AskTextQuestion;