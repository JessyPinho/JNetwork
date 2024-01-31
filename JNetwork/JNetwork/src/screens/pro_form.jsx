import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useColorModeValue } from "@chakra-ui/react";
// To decorate tab infos (icon/title)
import { Helmet } from "react-helmet";
import { IoArrowBackOutline } from "react-icons/io5"
import NavBar from "./../components/navbar";
import SidebarComponent from "../components/sidebar";
import "./styles/pro_form.css"


function  ProForm() {
  const bg = useColorModeValue("#F4F7FE", "#1A202C");
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [advisors, setAdvisors] = useState("");
  const [advisorNotFound, setAdvisorNotFound] = useState("");
  const [requestSubject, setRequestSubject] = useState("");
  const [description, setDescription] = useState("");
  const [solutions, setSolutions] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [availability, setAvailability] = useState("");
  const [timezone, setTimezone] = useState("");
  


  return(
    <div id="proform" style={{backgroundColor: bg}}>
      <Helmet>
        <title>JNetwork | Formulaire Pro</title>
      </Helmet>

      <NavBar path={""} />
      <SidebarComponent/>
      <main>
        <div className="generic-back-header">
      {/* This mean: go to the previous page */}
          <IoArrowBackOutline onClick={() => navigate(-1)}/>
          <span onClick={() => navigate(-1)}>Retour</span>
        </div>
        <div>
          <h2 id="proform-head-title">Formulaire PRO</h2>
        </div>
        <div id="">



          <form id="settings-form-pro-container">

            <div className="settings-form-pro-input">
              <label>Nom de votre entreprise</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Site internet de votre entreprise</label>
              <input type="text" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Nom du demandeur</label>
              <input type="text" value={requesterName} onChange={(e) => setRequesterName(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Votre role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Votre adresse mail</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Votre profil LinkedIn</label>
              <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Conseiller(s) pouvant vous aider dans votre demande</label>
              <p>Veuillez consulter les <a href="" className="proform-link">profils des conseillers</a> et nous faire savoir qui vous aimeriez rencontrer
               et qui pourrait vous aider dans votre demande. Veuillez fournir jusqu'à 3 noms.</p>
              <input type="text" value={advisors} onChange={(e) => setAdvisors(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label></label>
              <p>Vous n'avez pas trouvé de conseiller ayant une expérience pertinente ? Faites-le nous savoir et nous essaierons de vous aider. 
              <span className="proform-note"> Veuillez noter que nous ne pouvons pas nous engager à vous mettre en relation avec un conseiller.</span></p>
              <input type="text" value={advisorNotFound} onChange={(e) => setAdvisorNotFound(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Sujet de votre requete:</label>
              <input type="text" value={requestSubject} onChange={(e) => setRequestSubject(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Description:</label>
              <p>Veuillez décrire le problème auquel vous êtes confronté</p>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Quels solutions avez-vous essayé ?</label>
              <input type="text" value={solutions} onChange={(e) => setSolutions(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Votre deadline (date limite de pour trouver une solution)</label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="" />
            </div>
            <div className="settings-form-pro-input">
              <label>Votre disponibilité</label>
              <p>Veuillez donner au minimum 5 créneaux <span className="proform-note">ou</span> un lien vers les créneaux horaires dans votre calendrier</p>
              <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Votre réponse" />
            </div>
            <div className="settings-form-pro-input">
              <label>Votre fuseau horaire</label>
              <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Votre réponse" />
            </div>
          </form>

        </div>



      </main>
    </div>
  );
}

export default ProForm;