import React, { useEffect, useState } from 'react'
// Used to get the user, and their data
import { getAuth } from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';
// Firebase library. Here used to get our user's data
import { query, where, getDocs } from "firebase/firestore"
import { getDownloadURL, ref, getStorage } from "firebase/storage";
// Firebase collection of our users
import { usersCollectionRef } from "./../firebase/firebase_collections"
// logout function from auth.jsx
import { logout } from "./../firebase/auth"
// Meilisearch - search feature
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-hooks-web';
// icons
import { IoLogOut } from "react-icons/io5"
// React router. To redirect and link to endpoints
import { Link, useNavigate } from 'react-router-dom';
// Chakra UI
import { Image, useColorModeValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import avatarPicture from "../img/default-avatar.jpg";
import "./styles/navbar.css"



/* Box that'll display the search results */
const Hit = ({ hit }) => {



  return (
    <Link to={"/video/" + hit._firestore_id}>
      <article className="searchbar-response">
        <p className="searchbar-response-title">
          <Highlight attribute="title" hit={hit} />
        </p>
        <p className="searchbar-response-description">
          <Highlight attribute="description" hit={hit} />
        </p>
      </article>
    </Link>
  );
}



const NavBar = (props) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  const storage = getStorage();

  const [user, loading] = useAuthState(auth);
  const bg2 = useColorModeValue("#fff", "#1A202C");
  const navigate = useNavigate();

//  const [userCoins, setUserCoins] = useState(0);


  const searchInput = document.getElementsByClassName("ais-SearchBox-form");


  // Algolia reference
//  const searchClient = algoliasearch('28QG5I2SCC', 'e6477f70f6f4ae002ac0f031a2050b00');
  // Meilisearch reference
  const searchClient = instantMeiliSearch(
    "https://ms-744681916f92-1141.fra.meilisearch.io",
    "9120ab90cb2aeac7c7dc66be3403244b079c6da4fb6a3b5a7ceea84d41aa30e7",
    {
      // To prevent empty query return all docs
      placeholderSearch: false,
      // To search for all key words in a field
      matchingStrategy: "all",
      primaryKey : 'id',
    }
  );

  // path to avatar file
  const [avatarURL, setAvatarURL] = useState("");
  // File displayed
  const [avatar, setAvatar] = useState("");




  // Fetch User data
  useEffect(() => {

    const fetchUserData = async () => {
      

      if (user) {
        const userDoc = query(usersCollectionRef, where("uid", "==", uid));
      
        const querySnapshot = await getDocs(userDoc);
        querySnapshot.forEach((doc) => {
//         setUserCoins(doc.data().coins);
          setAvatarURL(doc.data().avatar);
        });
      }
    }

    fetchUserData();
  }, [user, uid])


  useEffect(() => {
    console.log(avatarURL);
    if (!avatarURL) {

      const defaultAvatarURL = avatarPicture;
      setAvatar(defaultAvatarURL);
    } else {

      getDownloadURL(ref(storage, "profilepics/" + uid + "/" + avatarURL))
        .then((url) => {
          setAvatar(url);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [avatarURL, uid, storage]);





  const logoutFunction = () => {
    logout();
    navigate("/");
  }



  const emptySearchInput = () => {
    searchInput[0].reset();
  }


// If no user is logged in, redirect to login page
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/");
    }
  }, [user, loading, navigate]);


  return (
    <div id="navbar">
{/*      <h3>Dashboard</h3> */}
        
      <div id="navbar-content" style={{backgroundColor: bg2}}>
        
{/*Search Bar still not fully working */}
      {/* Unsing Meilisearch extension for Firebase */}
      <InstantSearch searchClient={searchClient} indexName="questions" id="navbar-searchbar">
        <SearchBox id="navbar-search-input"
            placeholder="Chercher une question"
        />
        <Hits hitComponent={Hit} id="searchbar-results" onClick={() => emptySearchInput()} />
      </InstantSearch>

{/* Possibility to add "contact", "about"... links here */}


        <div id="top-right-options">
{/*
Coin amount displayed in NavBar. Reactivate it when the "questions" & "answers"
features (the only way for now to win coins) are done.
          <div className="coinCount" id="coinCount">
            <FaCoins style={{ width: "40px", height: "25px"}}></FaCoins>
            <p style={{ marginRight: "10px"}}>{userCoins}</p>
          </div>
*/}

{/* Toogle dark mode button */}
          {/* <div  id="toggle-dark-mode"
              onClick={toggleColorMode}>
            {colorMode === "light" ? ( <IoMoon fontSize={25}/> ) : ( <IoSunny fontSize={25} /> )}
          </div> */}

{/* Dropdown menu */}
          <Menu>
{/* Icon/button of the menu */}
            <MenuButton>
              <Image id="navbar-profile-pic" src={avatar} />
            </MenuButton>

{/* Dropdown content */}
            <MenuList>

      {/* Link to Profile */}


              <Link to={"/profile"}>
                <MenuItem>Mon compte</MenuItem>
              </Link>

      {/* Logout */}
              <MenuItem onClick={logoutFunction} flexDirection={"row"} alignItems="center" gap={4}>
                Se déconnecter <IoLogOut fontSize={20}/>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>



  );
}

export default NavBar