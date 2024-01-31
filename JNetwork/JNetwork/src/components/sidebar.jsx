import React, {useEffect, useState} from 'react'
import { FaUser } from "react-icons/fa";
import { IoGlobeSharp, IoHomeOutline } from "react-icons/io5";
import "./styles/sidebar.css"
import { Link } from 'react-router-dom';
import logo from "../img/logo.png";
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const SidebarComponent = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.600", "gray.300");

  const [home_bool, setHomeBool] = useState(true);
  const [video_bool, setVideoBool] = useState(false);
  const [response_bool, setResponseBool] = useState(false);

  useEffect (() => {
    if (colorMode === "light") {
      document.getElementById("sidebar").style.backgroundColor = "#fff";
    } else {
      document.getElementById("sidebar").style.borderRight = "1px solid white";
      document.getElementById("sidebar").style.backgroundColor = "#1A202C";
    }
  }, [colorMode])


  useEffect(() => {
    const feed = document.getElementsByClassName("sidebar-btn")[0];
    const profile = document.getElementsByClassName("sidebar-btn")[1];
    const community = document.getElementsByClassName("sidebar-btn")[2];
//    const video = document.getElementsByClassName("sidebar-btn")[2];

    if (props.props === "feed") {
      feed.classList.add("sidebar-nav-btn__active");
      profile.classList.remove("sidebar-nav-btn__active");
      community.classList.remove("sidebar-nav-btn__active");
//      video.style.display = "block";
    }
    else if (props.props === "profile") {
      profile.classList.add("sidebar-nav-btn__active");
      feed.classList.remove("sidebar-nav-btn__active");
      community.classList.remove("sidebar-nav-btn__active");
//      video.style.display = "block";
    }
    else if (props.props === "community") {
      community.classList.add("sidebar-nav-btn__active");
      profile.classList.remove("sidebar-nav-btn__active");
      feed.classList.remove("sidebar-nav-btn__active");
//      video.style.display = "block";
    }
    /*
    else if (props.props === "video") {
      feed.classList.remove("sidebar-nav-btn__active");
      profile.classList.remove("sidebar-nav-btn__active");
      video.style.display = "none";
    }
*/
    else {
      feed.classList.remove("sidebar-nav-btn__active");
      profile.classList.remove("sidebar-nav-btn__active");
      community.classList.remove("sidebar-nav-btn__active");
//      video.style.display = "block";
    }
  
  }, [props.data]);


  return (
    <div id="sidebar" style={{backgroundColor: bg}}>
      <Link to="/feed">
        <img src={logo} alt="logo" id="sidebar-logo" />
      </Link>

      <div id="sidebarContent">

      {/* Link to the Feed */}

        <Link to="/feed">
          <div className="sidebar__nav-feed sidebar-btn sidebar-nav-btn__active">
            <IoHomeOutline fontSize={20} className="sidebar__nav-logo"/>
            <span>Accueil</span>
          </div>
        </Link>


      {/* Link to the Profile */}

        <Link to="/profile">
          <div className="sidebar__nav-profile sidebar-btn">
          <FaUser fontSize={20} className="sidebar__nav-logo"/>
          <span>Mon Profil</span>
          </div>
        </Link>


      {/* Link to the Community tab */}

        {/* <Link to="/community">
          <div className="sidebar__nav-community sidebar-btn">
          <IoGlobeSharp fontSize={20} className="sidebar__nav-logo"/>
          <span>Communauté</span>
          </div>
        </Link> */}

      </div>

    {/* Link to record a video/post a question */}


      <div id="ask-question-btn__sidebar">
        <Link to="/askquestion">
          <div id="question-btn__sidebar" className="sidebar-btn">
            <span> Poser une question </span>
          </div>
        </Link>
      </div>

    </div>
  )
}

export default SidebarComponent