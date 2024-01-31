import { useState, useEffect } from "react"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom"
import { IoPlayCircleOutline, IoMic } from "react-icons/io5"
import { FaCoins } from "react-icons/fa";
import "./styles/question_card.css"


function  QuestionCard({question}) {
  const [thumbnailPic, setThumbnailPic] = useState("");
  const [username, setUsername] = useState("");


// Get the THUMBNAIL from storage
  useEffect(() => {
    const storage = getStorage()


  // Link to the video in firestore
  getDownloadURL(ref(storage, "thumbnails/" + question.thumbnailURL))
    .then((url) => {
      setThumbnailPic(url)
    })
    .catch((err) => {
      console.log(err.message)
    })
  }, []);


  return (
    <div className="question-card">
      <Link to={"/video/" + question.id} alt="question detail">
        <div className="inner-question-card" key={question.id}>
          <div className='thumbnail-image-container'>
            <img src={thumbnailPic} alt="Question image"
                  className='thumbnail-image' />
{question.audiourl && <IoMic className="thumbnail-audio-icon" /> }
{question.videourl && <IoPlayCircleOutline className="thumbnail-play-icon" /> }
          </div>

  {/* All the infos, except title, wich is above */}
          <div className="thumbnail-info">
            <div className="thumbnail-head">
              <h4  className="thumbnail-title">{question.title}</h4>
              <h4 className="thumbnail-category">{question.category}</h4>
            </div>

            <h4 className="thumbnail-poster-deco">Par: {question.username}</h4>

            <div className="thumbnail-bottom">
              <span className="thumbnail-coins"><span className="thumbnail-coins__icon"><FaCoins></FaCoins></span>50</span>
              <Link to={"/video/" + question.id} alt="question detail">
                <span className="thumbnail-see-more">Voir plus</span>
              </Link>
{/*              <span className="thumbnail-creation-date">{question.creationDate}</span> */}
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}

export default QuestionCard;