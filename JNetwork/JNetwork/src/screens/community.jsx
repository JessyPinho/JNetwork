import { useState, useEffect } from "react";
// Firebase methods
import { query, getDocs, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// Firebase collections
import { communityPostsCollectionRef } from "./../firebase/firebase_collections";
// Custom components
import NavBar from "./../components/navbar"
import SidebarComponent from "./../components/sidebar";
import CommunityCard from "./../components/community_card"
// StyleSheet
import "./styles/community.css"
import { Helmet } from "react-helmet";

const Community = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [communityPosts, setCommunityPosts] = useState([]);


// Scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


// Fetch all community posts
  useEffect(() => {

    const fetchUser = async () => {
      if (user) {
        const userDoc = query(communityPostsCollectionRef, orderBy("username"));
      
        const data = await getDocs(userDoc);

        setCommunityPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    }

    fetchUser();
  }, [user])


  return (
    <div id="community">
      <Helmet>
        <title>JNetwork | Communauté</title>
      </Helmet>

      <NavBar path={""} />
      <SidebarComponent props={"community"} />
      <main>
      {/* Code inside main */}
        <div id="community-header">
          <h3>Bienvenue dans la promo</h3>
{/*
          <div id="community-filter-wrapper">
            <label className="community-filter">
              <input className="community-filter-input" type="checkbox" name="" />
              <span className="community-filter-display">Marketing</span>
            </label>
            <label className="community-filter">
              <input className="community-filter-input" type="checkbox" name="" />
              <span className="community-filter-display">Finance</span>
            </label>
            <label className="community-filter">
              <input className="community-filter-input" type="checkbox" name="" />
              <span className="community-filter-display">Informatique</span>
            </label>            
          </div>
*/}
        </div>

        <div id="community-video-container">

{/* Here is a whole community card */}
{communityPosts && communityPosts.map((post) => {

return    <CommunityCard post={post} />
})}

{/* End of card */}

        </div>
      </main>
    </div>
  );
};

export default Community;