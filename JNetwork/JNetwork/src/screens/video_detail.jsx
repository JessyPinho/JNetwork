import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { responsesCollectionRef } from "./../firebase/firebase_collections"
import { db } from "./../firebase/init_firebase"
import AudioElement from "./../components/audio_element";
import ResponseCard from "./../components/response_card";
import NavBar from "./../components/navbar";
import SidebarComponent from "../components/sidebar";


import "./styles/video_detail.css"


function VideoDetail() {

// Video "metadata"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
//  const [category, setCategory] = useState("");
//  const [creationDate, setCreationDate] = useState("");
  const [questionUser, setQuestionUser] = useState("");

  const [fileName, setFileName] = useState("");

// The part of the url we have in our DB
// We'll use it wit a static path to fetch the right video
  const [dbUrl, setDbUrl] = useState("");
  const [vidUrl, setVidUrl] = useState("");

// Same but for audios
  const [audioDbUrl, setAudioDbUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

// Same but for screen captures
  const [screenDbURL, setScreenDbURL] = useState("");
  const [screenURL, setScreenURL] = useState("");


//
  const [questionExpanded, setQuestionExpanded] = useState(false);


  // All the answers
  const [responses, setResponses] = useState([]);

  const {id} = useParams();

  // to refresh data when accessing the page
  const location = useLocation();


// Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])




// Get Database data on the video
  useEffect(() => {

    // Async function in useEffect()
    const getQuestion = async () => {
      // Create a ref to the data we want
      const docRef = doc(db, "questions", id);
      // Make a request to get the data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setDescription(docSnap.data().description);
//        setCategory(docSnap.data().category);

        setDbUrl(docSnap.data().videourl);
        setAudioDbUrl(docSnap.data().audiourl);
        setScreenDbURL(docSnap.data().screenurl);

        setFileName(docSnap.data().optionalFile);

//        setCreationDate(docSnap.data().creationDate);
        setQuestionUser(docSnap.data().username);


      } else {
        console.log("No such document");
      }
    }

    getQuestion();
  }, [location, id]);


// Get the AUDIO from cloud storage
  useEffect(() => {
    setAudioUrl("");
    // Prepare to link to DB
    const storage = getStorage();

    const questionDataBox = document.getElementById("question-detail__infos");

    // Link to DB, and find the correct key: value where the 2nd argument is the key
    getDownloadURL(ref(storage, 'questionsMedia/' + audioDbUrl))
      .then((url) => {
        questionDataBox.style.width = "50%";
        // set the src of the video player below to the fetched 'url'.
        setAudioUrl(url)
      })
      .catch((error) =>  {
        questionDataBox.style.width = "100%";
        console.log(error.message)
      })
  }, [audioDbUrl]);


// Get the SCREEN from cloud storage
  useEffect(() => {
    setScreenURL("");
    // Prepare to link to DB
    const storage = getStorage();

    const questionDataBox = document.getElementById("question-detail__infos");

    // Link to DB, and find the correct key: value where the 2nd argument is the key
    getDownloadURL(ref(storage, 'questionsMedia/' + screenDbURL))
      .then((url) => {
        questionDataBox.style.width = "50%";
        // set the src of the video player below to the fetched 'url'.
        setScreenURL(url)
      })
      .catch((error) =>  {
        questionDataBox.style.width = "100%";
        console.log(error.message)
      })
  }, [screenDbURL]);


// Get the VIDEO from cloud storage
  useEffect(() => {
    setVidUrl("")
    // Prepare to link to DB
    const storage = getStorage();

    const questionDataBox = document.getElementById("question-detail__infos");

    // Link to DB, and find the correct key: value where the 2nd argument is the key
    getDownloadURL(ref(storage, 'questionsMedia/' + dbUrl))
      .then((url) => {
        questionDataBox.style.width = "50%";
        // set the src of the video player below to the fetched 'url'.
        setVidUrl(url)
      })
      .catch((error) =>  {
        questionDataBox.style.width = "100%";
        console.log(error.message)
      })
  }, [dbUrl]);    


// Fetch the optional file if it exists
// And append it to the page
  useEffect(() => {

    const getOptionalFile = async () => {

      const storage = getStorage();

      await getDownloadURL(ref(storage, 'questionFiles/' + fileName))
        .then((url) => {
        // Get parent node & next node to use "insertBefore"
          const tooltip = document.getElementById("opt-file-tooltip");
          const optFile = document.getElementById("optionnal-file");

          // Put in <a> tag to have access to ressource
          const downloadLink = document.createElement('a');
          const downloadLinkText = document.createTextNode("Fichier optionnel");
          downloadLink.appendChild(downloadLinkText);
          downloadLink.href = url;
          // Here we'll just be redirected to an online page 'hosting' the file
          downloadLink.setAttribute("target", "_blank");
          optFile.insertBefore(downloadLink, tooltip);
        })
        .catch((error) => {
          console.log(error.message);
        })
    }
    getOptionalFile();

  }, [fileName]);


  // "Voir plus" & "Voir moins" buttons
  useEffect(() => {
    if (questionExpanded) {
      document.getElementById("question-detail__title-content").style.whiteSpace = "normal";
      document.getElementById("question-detail").classList.remove("question-detail-class");
      document.getElementById("question-detail__description-content").style.maxHeight = "none";
    }
    else {
      document.getElementById("question-detail__title-content").style.whiteSpace = "nowrap";
      document.getElementById("question-detail__description-content").style.maxHeight = "6em";

    }
  }, [questionExpanded]);


  const expandQuestion = () => {
    console.log("expland");
    setQuestionExpanded(!questionExpanded)
  }



// Retrieve all existing responses (of our question)
  useEffect(() => {
    const getResponses = async () => {
      const q = query(responsesCollectionRef, where("questionID", "==", id));
      const querySnapshot = await getDocs(q);

      setResponses(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    getResponses();
  }, [location, id]);




  return (
    <div id="video-detail">

      <NavBar path={location} />
      <SidebarComponent props={"video_detail"} />

      <main>

{/* The Question */}
        <section id="question-detail" className='question-detail-class'>

        {/* Media container + Uploader infos */}
          <div className="question-detail-video">
            {/* /!\ The 'key' and 'src' attributes are both needed */}
            {vidUrl &&  <video key={vidUrl} controls id="video-detail-videoEl">
                          <source src={vidUrl} />
                        </video>
            }

            {/* /!\ The 'key' and 'src' attributes are both needed */}
            {audioUrl &&  <AudioElement source={audioUrl} />
            }

            {/* /!\ The 'key' and 'src' attributes are both needed */}
            {screenURL && <video key={screenURL} controls id="video-detail-screenEl">
                            <source src={screenURL} />
                          </video>
            }

            <h3 id="question-detail__user">{questionUser}</h3>
          </div>

          {/* Infos about the question */}
          <div id="question-detail__content">
{/* Question's Title */}
            <div id="question-detail__title">
              <h5>Question: </h5>
              <span id="question-detail__title-content">{title}</span>
            </div>
          
            <div id="question-detail__infos">
              {/* Question's User */}

              {/* Question's Category */}
  {/*            <h3 id="question-detail__category">{category.toUpperCase()}</h3>
  /*}
              <div id="question-detail__user-and-date">

                {/* Question's Description */}
              <p id="question-detail__description">
                <h2>Description :</h2>
                <span id="question-detail__description-content">{description}</span>
              </p>

{/* Optional file spot  */}
{fileName &&  <div id="optionnal-file">
                <span id="opt-file-tooltip"><span id="opt-file-tooltip-name">{fileName}</span><span id="opt-file-tooltip-help">Le fichier va s'ouvrir dans un nouvel onglet</span></span>
              </div>
}
                
            </div>

            <input id="video-detail-see-more-btn"
              onClick={expandQuestion}
              type="button"
              value={`${questionExpanded ? 'Voir moins' : 'Voir plus'}`}
            />

          </div>

        </section>

        <div id="question-detail__infos-more">

{/* Btn to respond */}
          <Link to={"/response/" + id} id="answer-link">
            <span id="respond-to-question-btn">Répondre</span>
          </Link>

        </div>

{/* The Answers */}

        <div id="responses">
{responses && responses.map((response) => {

return  <ResponseCard response={response} key={response.id} />
})}

        </div>
      </main>
    </div>
  );
}

export default VideoDetail;