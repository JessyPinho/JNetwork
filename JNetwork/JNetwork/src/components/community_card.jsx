import { useState, useEffect } from "react";
import { usersCollectionRef } from "./../firebase/firebase_collections";
import { query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import coin from "../img/seed2.png";
import "./styles/community_card.css";


function  CommunityCard({post}) {

  const [coins, setCoins] = useState(0);
  const [thumbnailPic, setThumbnailPic] = useState("");


// Fetch User data (here coin amount)
  useEffect(() => {

    const fetchUserData = async () => {
      const userDoc = query(usersCollectionRef, where("uid", "==", post.uid));
    
      const querySnapshot = await getDocs(userDoc);
      querySnapshot.forEach((doc) => {
          setCoins(doc.data().coins)
      });
    }

    fetchUserData();
  }, [])

  // Get the video from storage
  useEffect(() => {
    const storage = getStorage()


  //  Link to the video in firestore
  getDownloadURL(ref(storage, "CommunityThumbnails/" + post.communityThumbnail))
    .then((url) => {
      setThumbnailPic(url)
    })
    .catch((err) => {
      console.log(err.message)
    })
  }, []);


  return (
          <div className="community-card">
            <div className='community__thumbnail-image-container'>
              <img src={thumbnailPic} alt="Photo utilisateur"
                className='community__thumbnail-image' />
            </div>

    {/* All the infos */}

            <div className="community__thumbnail-info">

              <div className="community__thumbnail-user-info">
                <h4>{post.username}</h4>
                <h4>{post.company}</h4>
                <h5 className="community__thumbnail-poster-skills">{post.skills}</h5>
                <span className="community__thumbnail-coins"><img alt="coins" className="community__thumbnail-coins-icon" src={coin} /><span>{coins}</span></span>
              </div>

              <div className="community__thumbnail-company-info">
                <h5>{post.companySector}</h5>
                {/* add associates eventually */}
                <Link to={"/community/" + post.id}>
                  <button className="community__thumbnail-btn">Voir plus</button>
                </Link>
              </div>
            </div>

          </div>
  );
}

export default CommunityCard;