import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"
// Imports to record ourselves
import { useReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";
// Import the link to the firebase project
import { storage } from "./../firebase/init_firebase"
import { questionsCollectionRef } from "./../firebase/firebase_collections"
import { db } from "./../firebase/init_firebase"
import coin from "../img/seed2.png";
import { getAuth } from "firebase/auth"
// Import "premade" input from material
import { TextField } from "@material-ui/core";
// Import for firestore
import { ref, uploadBytes } from "firebase/storage"
import { doc, getDoc, addDoc, updateDoc } from "firebase/firestore"
// Icons
import { IoCloseSharp, IoPencilSharp } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5"
// Toast popups
import { toast } from 'react-toastify';
import Loading from "./loading"
import "./styles/question_component.css";
import "./styles/question_video.css"; 
 

/*
* On this video screen, i used 2 packages:
*
* react-webcam          to have a real time webcam of the device of my screen
* react-media-recorder  to record the camera feed and have a preview (doesnt show real time webcam)
*/

const AskVideoQuestion = () => {
  // Method call to react-media-recorder
  // mediaBlobUrl will be the ressource to retrieve
  const { startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, video: true });
  // Bool to know when to show the webcam or the preview
  const [recording, setRecording] = useState(false);

  // RealTime Webcam & the preview are displayed one after the other.
  // I use "recording" to know which one to display
  // Pb: when no video is recorded, the preview is empty (it leaves a hole instead of the video player)
  // This problem is solved with "firstTime"
  const [firstTime, setFirstTime] = useState(true);

  // Additional infos on the question
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [optionalFile, setOptionalFile] = useState(null);

/*  There is also the username just bellow and the creation date
*   is created when uploading the question
*/
  // Thumbnail photo
  const canvasRef = useRef();
  const videoRef = useRef();

  // string to store in firebase DB
  // Its the path to the thumbnail in the cloud
  const [thumbnailURL, setThumbnailURL] = useState("");
  
  // Bool to show the loading anim or not
  const [uploading, setUploading] = useState(false);
  

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
  const [secondStepVideo, setSecondStepVideo] = useState(false);
  const [thirdStepQuestion, setThirdStepQuestion] = useState(false);

  // bool to show the popup to add an info
  const [showAddInfo, setShowAddInfo] = useState(false);
  const [showAddInfo2, setShowAddInfo2] = useState(false);
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




  // Method to Start/Stop the recording
  const record = (e) => {
    e.preventDefault();
    // Now that we have (will have) a preview, we dont need to show the Webcam when not recording
    setFirstTime(false);

    if (recording) {
      stopRecording();
      setRecording(false)
//      recordLight.classList.remove("record-light-on")
    }
    else if (!recording) {
      startRecording();
      setRecording(true)
//      recordLight.classList.add("record-light-on")
    }
  }

  // Bridge from 1st panel to 2nd page

  function askVideoQuestion() {
      // Faire apparaitre un popup comme qui il manque une info
    if (!description || !title) {
      toast.error("Veuillez rentrer un titre et une description");
      return;
    }
    setFirstStepQuestion(false);
    setSecondStepVideo(true);
  }


  function gotoRecap(e) {
    e.preventDefault();

    if (mediaBlobUrl) {
      setSecondStepVideo(false);
      setThirdStepQuestion(true);
    }
    else
      toast.error("Aucune vidéo enregistrée");
  }



  function goBackToStepOne(e) {
    e.preventDefault();

    setSecondStepVideo(false);
    setFirstStepQuestion(true);
  }


/* Once a category is selected in the dropdown,  */
  function updateCategory(e) {
    e.preventDefault();
    setCategory(e.target.value);
  }



// Take photo thumbnail and upload it to cloud
  // We gonna paste the video on a canvas and take a screenshot of that canvas
  const captureThumbnail = async () => {

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    canvasRef.current
      .getContext("2d")
      .drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );

    const captureContainer = document.getElementById("capture-canvas");

    canvasRef.current.toBlob((blob) => {
      const img = new Image();
      img.setAttribute('crossorigin', 'anonymous');


// Get only the adress (not the path)
      let splitBlob = mediaBlobUrl.split('/');
      let blobUrl = splitBlob[3];

//  Picture's address we're gonna store in the DB (and store pic in storage/cloud)
      const imgSrc = window.URL.createObjectURL(blob);
      img.src = imgSrc;
      captureContainer.appendChild(img);

      const storageRef = ref(storage, "thumbnails/" + blobUrl);
      setThumbnailURL(blobUrl);
    // Upload to firestore
      uploadBytes(storageRef, blob).then((snapshot) => {
        toast.success("Vignette capturée!")
      });
    })
    return;
  };





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


    setUploading(true);

    // Get current Date, and split it because easier
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Cause January is month: 0
    const year = date.getFullYear();
    const currentDate = `${day}-${month}-${year}`

    let blobUrl = "";

  // Split the blob to keep onl the url (not the full path)
    if (mediaBlobUrl) {
      let splitBlob = mediaBlobUrl.split('/');
      blobUrl = splitBlob[3];
    }

// Submit data to DB
// Keep the code below to handle the optionnal file
// The optionnal file has been removed for now. Coming back soon!
    if (optionalFile)
        await addDoc(questionsCollectionRef, { creationDate: currentDate, username, uid, title, description, category, videourl: blobUrl, thumbnailURL, optionalFile: optionalFile.name});
    else
        await addDoc(questionsCollectionRef, { creationDate: currentDate, username, uid, title, description, category, videourl: blobUrl, thumbnailURL, optionalFile: ""});
    updateCoinAmount();

// Submit files to cloud storage
  // Submit optional file

    if (optionalFile) {
      const storageRefFile = ref(storage, `questionFiles/${optionalFile.name}`);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRefFile, optionalFile).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
    }


  // Submit the video
    // Turn the Blob URL into something we can send to firestore
    if (mediaBlobUrl) {
      let blob = await fetch(mediaBlobUrl).then(r => r.blob());

      blobUrl = "questionsMedia/" + blobUrl;

      // Path to the database & key of the data (key: data) where data is the Blob
      // Key (and path) will be blobUrl
      // each '/' is an intersection in the path
      const storageRef = ref(storage, blobUrl);
      // Upload to firestore
      await uploadBytes(storageRef, blob).then((snapshot) => {
        /*
            This is the final step to uplaod a video question
            -> Show toast success notification
        */
        console.log("Uploaded video!");
      });
    }

// Should add pop-up with 2 buttons saying
// "Question upladed ! goto feed? ask another?"
    navigate("/feed");
  };


//    Called first when submitting question to DB
  function stageData() {
    if (!category)
      toast.error("Aucune catégorie sélectionnée");
    else
      submitData();
  }




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


  return (
    <div id="ask-question-path">

        <div id="ask-video-question-container" className="ask-question-signle-path">


{/* First Step, enter Title & Category (Both Required) */}

{firstStepQuestion &&  
            <div className="step_question_container">
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

              <p className="record-label">Vous pouvez maintenant vous enregister</p>
              <div id="step-one-btn-container" className="step-one-btn-container-class">
                {/* Add file to question */}
                <label for="opt-file" id="opt-file-label" className="opt-file-class">
                  <input type="file" name="opt-file" accept="" onChange={(e) => setOptionalFile(e.target.files[0])} />
                  <span>Joindre un fichier</span>
                </label>

                <button className="upload-question-btn" onClick={ askVideoQuestion }>Suivant</button>
              </div>
            </div>

}



{/* SECOND STEP, ask your question */}

{/* VIDEO STYLE */}

{secondStepVideo && <div className="question-more-infos__main">

            <div className="second-step-head" onClick={goBackToStepOne}>
              <IoArrowBackOutline />
              <span id="step-video-to-one">Retour</span>
            </div>
            <div className="video-content">
              <div id="video">
          {/* ----------------------- VIDEO PLAYER ----------------------- */}
      {/* RealTime feedback */}
  {(firstTime || recording) && <Webcam audio={false} className="webcam" />}

      {/* Recorded preview */}
  {(!firstTime && !recording) && <video src={mediaBlobUrl} className="video-preview" controls />}
          {/* -------------------- END OF VIDEO PLAYER -------------------- */}
              </div>

  {/* Start/Stop recording button */}
              <div id="video-btns">
              

                <input className="record-btn"
                  onClick={record}
                  type="button"
                  value={`${recording ? 'Stop' : 'Start'} recording`}
                />
                <span className="record-coins"><img alt="coins" className="record-coins-icon" src={coin} /><span>50</span></span>
  {/*              <div id="record-light"></div> */}

              </div>

              <span id="to-step-three" className="to-step-three-btn" onClick={gotoRecap}>Suivant</span>
            </div>
          </div>
}




{/* Overview and Upload */}

{thirdStepQuestion && 
  
            <div className="third-step-question">
              <div id="recap-more-info">
                <div className="recap-title">
                  <span id="recap-more-info__title">{title}</span>
                </div>

                <div id="recap-more-info__category">
{mediaBlobUrl &&  
                    <video ref={videoRef} controls>
                      <source src={mediaBlobUrl} />
                    </video>
}
                      {/* <span className="recap-more-info__label">Description: </span><textarea className="recap-question-description"
                        value={"Lorem ipsum dolor sit amet, consectetur adipiscing elit Suspendisse rutrum diam dolor, placerat laoreet mi blandit eu. Donec eget lectus nec velit eleifend elementum. Mauris condimentum nibh in mauris vulputate, nec commodo magna mattis."} /></> */}
                    <div className="recap-description-label">
                      <span>Description</span>
                      <textarea
                        className="recap-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
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
              </div>
              

              <canvas id="capture-canvas" ref={canvasRef} style={{ display: "none" }}></canvas>

              <div id="third-step-question__btns">

                <Link to="/feed" id="cancel-question-btn" className="third-step-question__btns-btn">
                  <span>Annuler</span>
                </Link>

{/* First show the button to create thumbnail then to upload video */}
  {(!thumbnailURL && mediaBlobUrl) &&  <div>
                                        <button onClick={captureThumbnail} className="third-step-question__btns-btn submit-question-btns">Suivant</button>
                                      </div> }
  {thumbnailURL && <button onClick={stageData} className="third-step-question__btns-btn submit-question-btns">Publier</button> }
              </div>
              <span id="explain-create-thumbnail">Choisissez le moment de la vidéo à utiliser comme vignette!</span>
            </div>
}
        </div>


        {/* Popup to add an info */}
{showAddInfo && <div className="question-add-info-popup" >

          <form onSubmit={hideAddInfoPopup}>
            <div className="cross">
              <IoCloseSharp onClick={hideAddInfoPopup} />
            </div>
            <div className="questionTitleClass">
              <TextField
                  variant="outlined"
                  label="Titre"
                  type="text"
                  margin="normal"
                  className="question-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la question"
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
                required
              />
            </div>

            <input className="submit-question-info" type="submit" value="Ajouter" />
          </form>
          </div>
}



      {uploading && <Loading />}
    </div>
  );
};

export default AskVideoQuestion;