import { useEffect, useState } from "react"
import { query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { usersCollectionRef } from "./../firebase/firebase_collections"
import { db } from "./../firebase/init_firebase"
import "./styles/slim_response_card.css"
import { Link } from "react-router-dom";


function ResponseCard({response}) {

  const [userResponse, setUserResponse] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [user, setUser] = useState([])
  const [username, setUsername] = useState("");
  const uid = response.user

// Fetch question ref
  useEffect(() => {
    const getQuestions = async () => {
      // Create a ref to the data we want
      const docRef = doc(db, "questions", response.questionID);
      // Make a request to get the data
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setTitle(docSnap.data().title)
        setCategory(docSnap.data().category)
      }
    }
    getQuestions();
  }, [response.questionID])

// Fetch the username of the user who answered
  useEffect(() => {
    if (!username)
    {
      const getUser = async () => {
        const q = query(usersCollectionRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        setUser(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setUsername(user[0].name)
      }
      getUser();
    }
  }) 


  return (
    <div className="slim-response-card">
      {/* <div className="slim-question-card_thumbnail">
        <video key={vidUrl} controls>
          <source src={vidUrl} />
        </video>
      </div> */}
  {/* All the infos, except title, wich is above */}
      <Link to={"/video/" + response.questionID} alt="question detail">
      <div className="slim-question-card_content" key={response.id}>
        <div className="slim-response-card_infos">
          <div className="slim-response-card-div">
            <h4  className="slim-response-card_infos-title">Réponse a :</h4>
            <h4  className="slim-response-card_infos-title2">{title}</h4>
            <span>{response.textResponse}</span>
            <h4 className="slim-response-card_infos-category">{category}</h4>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}

export default ResponseCard;