import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "./../firebase/init_firebase"
import { IoArrowBackOutline } from "react-icons/io5"
// Custom react components
import NavBar from "./../components/navbar";
import SidebarComponent from "../components/sidebar";
import "./styles/community_detail.css";
import { TextField } from "@material-ui/core";


function CommunityDetail() {

  // Get post's id
  const {id} = useParams();

  // Post data
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");
  const [companySector, setCompanySector] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [video, setVideo] = useState("");

  const navigate = useNavigate();


  // Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  // Get the data of the community post
  useEffect(() => {
    const getCommunityPost = async () => {
      // Create a ref to the doc we want
      const docRef = doc(db, "communityPosts", id);
      // Make a request to get the doc
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsername(docSnap.data().username);
        setUid(docSnap.data().uid);
        setSkills(docSnap.data().skills);
        setCompany(docSnap.data().company);
        setCompanySector(docSnap.data().companySector);
        setVideoURL(docSnap.data().communityVideo);
      }
    }

    getCommunityPost();
  });

  // Get the video
  useEffect(() => {
    const storage = getStorage();

    getDownloadURL(ref(storage, "CommunityVideos/" + videoURL))
      .then((url) => {
        setVideo(url)
      })
      .catch((err) => {
        // Make toast notification
        console.log(err.message);
      })
  }, [videoURL]);

  return (
    <div id="community-detail">

      <NavBar path={""} />
      <SidebarComponent props={"community_detail"} />

      <main>

        {/* Style in response.css */}
        <div className="generic-back-header">
    {/* This mean: go to the previous page */}
          <IoArrowBackOutline onClick={() => navigate(-1)}/>
          <span onClick={() => navigate(-1)}>Retour</span>
        </div>

{/* The Question */}
        <section id="community-detail-details">
          <div id="community-detail-text-info">
            <div id="community-detail-text-info__user">
              <TextField
                variant="outlined"
                id="outlined-read-only-input"
                label="Nom de l'intervenant"
                className="community-detail-text-info__username community-detail-text-info__ro-input"
                margin="normal"
                value={username}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                variant="outlined"
                id="outlined-read-only-input"
                label="Expérience de l'intervenant"
                className="community-detail-text-info__skills community-detail-text-info__ro-input"
                margin="normal"
                value={skills}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div id="community-detail-text-info__company">
              <TextField
                variant="outlined"
                id="outlined-read-only-input"
                label="Entreprise"
                className="community-detail-text-info__company community-detail-text-info__ro-input"
                margin="normal"
                value={company}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                variant="outlined"
                id="outlined-read-only-input"
                label="Secteur d'activité"
                margin="normal"
                className="community-detail-text-info__company-sector community-detail-text-info__ro-input"
                value={companySector}
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>

{video && <video key={video} controls>
            <source src={video} />
          </video>
}

          <Link to={"/profile/" + uid}>
            <button>Vers le profil</button>
          </Link>

        </section>
      </main>
    </div>
  );
}

export default CommunityDetail;