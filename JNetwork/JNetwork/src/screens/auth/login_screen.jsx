import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword } from "./../../firebase/auth";
import { TextField } from "@material-ui/core";
import 'react-toastify/dist/ReactToastify.css';
// Main stylesheet
import "./styles/login.css";
import { getAuth } from "firebase/auth";
import { Helmet } from "react-helmet";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user] = useAuthState(auth);
  const navigate = useNavigate();
/*
  const auth = getAuth();
  const user = auth.currentUser;
*/
// called when the user clic on "login"
const logIn = async () => {

  await logInWithEmailAndPassword(email, password);

  const auth = getAuth();
  const user = auth.currentUser;

  if (user)
    navigate("/feed");
}


// Dont use useEffect to redirect to feed
// We want to wait for the user to clic on "login" (see above)
/*
  useEffect(() => {
    if (loading) {
      <Loading />
      return;
    }
    if (user) navigate("/feed");
  }, [user, loading, navigate]);
*/
/*  La redirection lors de la deconnection ne marche pas
*   Avec ceci, dessous, la redirection fonctionne.
*   Cependant, en local, pour retourner sur l'appli sans avoir été déconnecté
*   la fonction signOut(), il faut actualiser un champs de login pour etre
*   redirigé vers le feed.
*/


  // useEffect(() => {
  //   if (user) {
  //      navigate("/feed");
  //   }
  //   if (!user) {
  //     navigate("/");
  //   }
  // }, [user, navigate]);


  return (
    <div className="body">
      <Helmet>
        <title>JNetwork | Connexion</title>
      </Helmet>
      <div className="login">
        <div className="login__container">
          <div className="login__background"/>
          <div className="login__form">
            <h1 className="headerTitle">Connexion</h1>
            <TextField
              variant="outlined"
              label="Adresse mail"
              type="text"
              margin="normal"
              className="login__textBox"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Si le format est bon ca se passera bien"
            />

            <TextField
              variant="outlined"
              label="Mot de passe"
              type="password"
              margin="normal"
              className="login__textBox"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Trou de Mémoire ? Cliquez sur 'Mot de passe oublié ?'"
            />

            <div className="forgotPassword" style={{marginLeft: "62%", marginBottom: "10px", color: "#434DE7", fontWeight: "bold"}}>
              <Link to="/reset" >Mot de passe oublié ?</Link>
            </div>

            <button
              className="login__btn"
              onClick={() => logIn()}
            >
              Connexion
            </button>

            <div style={{flexDirection: "row", color:"black", display: "flex", padding:"2px", margin:"10px"}} className="accountInput">
              Vous n'avez pas de compte ? <Link to="/register"> <p style={{paddingLeft: "5px", paddingRight: "5px", fontWeight: "bold", color: "#434DE7"}}>Inscrivez-vous</p> </Link>
            </div>

{/*   Deactivating google button as its bugged asf for now
            <GoogleButton
              style={{height: "fit-content", width: "fit-content", minWidth: "325px"}}
              label="Se connecter avec Google"
              className="login__btn login__google" onClick={signInWithGoogle}>
              Se connecter avec Google
            </GoogleButton>
    */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;