import { useEffect, useState } from "react"

import { useNavigate, useParams } from "react-router-dom"
// Firebase/firestore imports
import { getAuth } from "firebase/auth"
import { addDoc, getDocs, doc, query, where, updateDoc } from "firebase/firestore"
import { ref, uploadBytes } from "firebase/storage"

// References to our DB (cloud, database & its collections)
import { storage } from "./../firebase/init_firebase"
import { usersCollectionRef } from "./../firebase/firebase_collections"
import { db } from "./../firebase/init_firebase"

// Imports to record ourselves
import { useReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";

import { IoArrowBackOutline } from "react-icons/io5"


import { questionsCollectionRef, responsesCollectionRef } from "./../firebase/firebase_collections"

import NavBar from "./../components/navbar"
import Loading from "./../components/loading"


import "./styles/response.css"
import SidebarComponent from "../components/sidebar"


function  Response() {
  const navigate = useNavigate();
  const {id} = useParams();

  const [textResponse, setTextResponse] = useState("");

  // Method call to react-media-recorder
  // mediaBlobUrl will be the ressource to retrieve
  const { startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, video: true });

  let blobUrl = "";

// If True, show Loading animation
  const [uploading, setUploading] = useState(false);

  // Bool to know when to show the webcam or the preview
  const [recording, setRecording] = useState(false);
  // RealTime Webcam & the preview are displayed one after the other.
  // I use "recording" to know which one to display
  // Pb: when no video is recorded, the preview is empty (it leaves a hole instead of the video player)
  // This problem is solved with "firstTime"
  const [firstTime, setFirstTime] = useState(true);

  const [questions, setQuestions] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const [userCoins, setUserCoins] = useState(0)


  // Fetch User data. Especially the coins amount
  useEffect(() => {

    const fetchUserData = async () => {
      

      if (user) {
        const userDoc = query(usersCollectionRef, where("uid", "==", uid));
      
        const querySnapshot = await getDocs(userDoc);
        querySnapshot.forEach((doc) => {
          setUserCoins(doc.data().coins);
        });
      }
    }

    fetchUserData();
  }, [user, uid]);

  // Method to Start/Stop the recording
  const record = (e) => {
    e.preventDefault();
    // Now that we have (will have) a preview, we dont need to show the Webcam when not recording
    setFirstTime(false);

    if (recording) {
      stopRecording();
      setRecording(false)
    }
    else if (!recording) {
      startRecording();
      setRecording(true)
    }
  }

  // Update the user's coin amount (+20 for a question)
  function updateCoinAmount() {
    // Create a ref to the data we want
    const docRef = doc(db, "users", uid);

    updateDoc(docRef, {
      coins: userCoins + 100,
    })
  }

// SUBMIT ALL DATA HERE
  const submitVideo = async (file) => {
    setUploading(true);

// Submit data to DB
    if (mediaBlobUrl) {
      let splitBlob = mediaBlobUrl.split('/');
      blobUrl = splitBlob[3];
    }

    if (blobUrl !== "" || textResponse !== "") {
      await addDoc(responsesCollectionRef, {questionID: id, user: uid , videoResponseUrl: blobUrl, textResponse })
    } else {
      alert("Aucune réponse enregistrée");
      return;
    }
    updateCoinAmount();

  // Store video in firestore
    let blob = await fetch(mediaBlobUrl).then(r => r.blob());

    // Path to the database & key of the data (key: data) where data is the Blob
    // Key will be mediaBlobUrl
    const storageRef = ref(storage, "responses/video/" + blobUrl);
    // Upload to firestore
    uploadBytes(storageRef, blob).then((snapshot) => {

// Should add pop-up with 2 buttons saying
// "Question upladed ! goto feed? ask another?"
      navigate("/feed");
    });

  };

// fetch all questions
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
    <div id="response-container">

      <NavBar path={""} />
      <SidebarComponent props={"response"} />

  {/* Keep header or replace with navbar */}
      <div id="response-content">
        <header className="generic-back-header">
    {/* This mean: go to the previous page */}
          <IoArrowBackOutline onClick={() => navigate(-1)}/>
          <span onClick={() => navigate(-1)}>Retour</span>
        </header>
        <h1 className="responseHeader">Répondre à:</h1>
          <h2 className="title">{questions.map((question) => {
            if (question.id === id) {
              return "Titre:   " + question.title;
            }
          })}</h2>
          <div className="responseInfo">
            <h3 className="User">{questions.map((question) => {
              if (question.id === id) {
                return "De:  " + question.username;
              }
            })}</h3>
            <p className="responseDate">{questions.map((question) => {
              if (question.id === id) {
                return "Date:  " + question.creationDate;
              }
            })}</p>
        </div>
        <div id="response-field">
          <div id="response-text">
            <p>Réponse :</p>
            <textarea
              onChange={(e) => setTextResponse(e.target.value)}
              id="response-text-area"
            />
          </div>

      {/* ----------------------- VIDEO PLAYER ----------------------- */}
  {/* RealTime feedback */}
        <div className="responseWebcam">
          {(firstTime || recording) && <Webcam audio={false} className="webcam" />}

    {/* Recorded preview */}
          {(!firstTime && !recording) && <video src={mediaBlobUrl} className="video-preview" controls autoPlay />}
          </div>
        </div>
{/* Start/Stop recording button */}
        <div className="bottom-page">
          <input className="record-btn"
            onClick={record}
            type="button"
            value={`${recording ? 'Stop' : 'Start'} recording`}
          />

          {mediaBlobUrl && <button className="submit-response" onClick={submitVideo}>submit</button>}
        </div>
      </div>

      {uploading && <Loading />}
    </div>
  );
}

export default Response;