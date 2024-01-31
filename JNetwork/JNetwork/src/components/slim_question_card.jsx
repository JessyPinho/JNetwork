import { useState, useEffect } from "react"
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom"
import "./styles/slim_question_card.css"


function  SlimQuestionCard({question}) {
  const [thumbnailPic, setThumbnailPic] = useState("");


// Get the video from storage
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
    <div className="slim-question-card">
      <Link to={"/video/" + question.id} alt="question detail">
        <div className="slim-question-card_content" key={question.id}>
          <div className="slim-question-card_thumbnail">
  {/* Thumbnail image, with gradient and title inside in position absolute */}
{/*            <div className="thumbnail-gradient-filter"></div>  */}
            <img src={thumbnailPic} alt="Question textuelle"
                  className="" />

          </div>

  {/* All the infos, except title, wich is above */}
          <div className="slim-question-card_infos">
            <div className="">
              <h4  className="slim-question-card_infos-title">{question.title}</h4>
              <h4 className="slim-question-card_infos-category">{question.category}</h4>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}

export default SlimQuestionCard;