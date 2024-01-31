import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { query, getDocs, where, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./init_firebase"
import { getAuth } from "firebase/auth"
import { usersCollectionRef } from "./firebase_collections"
import { toast } from 'react-toastify';



const registerWithEmailAndPassword = async (name, username, email, password, cPassword) => {
  if (!name && !username && !email && !password && !cPassword) {
    toast.error("Veuillez les champs")
  }
  else if (!name) {
    toast.error("Veuillez entrer votre nom")
  }
  else if (!username) {
    toast.error("Veuillez entrer un nom d'utilisateur")
  }
  else if (!email) {
    toast.error("Veuillez entrer une adresse mail")
  }
  else if (!password) {
    toast.error("Veuillez entrer un mot de passe")
  }
  else if (!cPassword) {
    toast.error("Veuillez confirmer votre mot de passe")
  }
  else if (password != cPassword) {
    toast.error("Mots de passes différents")
  }
  else if (name && username && email && password && cPassword) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password, cPassword);
      toast.success("Compte créé avec succès")
      const user = res.user;
      const uid = user.uid;
      // Create Reference in user collection
      await setDoc(doc(db, "users", uid), {
        uid: user.uid,
        username,
        name,
        authProvider: "local",
        email,
        coins: 50,
        avatar: "default-avatar.jpg",
      });;

    } catch (err) {
      switch(err.code)
      {
        case "auth/invalid-email":
          toast.error("Email invalide");
          break;
        case "auth/email-already-in-use":
          toast.error("Email déjà utilisé");
          break;
        case "auth/weak-password":
          toast.error("Mot de passe trop faible");
          break;
        default:
          toast.error("L'inscription a échoué");
      }
    }
  }
};


const logInWithEmailAndPassword = async (email, password) => {
  if (!password && email) {
    toast.error("Veuillez entrer un mot de passe")
  }
  else if (!email && password) {
    toast.error("Veuillez entrer une adresse email")
  }
  else if (!email && !password) {
    toast.error("Veuillez entrer votre adresse email et votre mot de passe")
  }
  else if (password && email) {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(() => {
      toast.success("Connexion réussie")
      });
    } catch (err) {
      switch(err.code)
      {
        case "auth/invalid-email":
          toast.error("Email invalide");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          toast.error("Email ou Mot de Passe érroné");
          break;
        default:
          toast.error("La connexion a échoué");
      }
      
    }
  }
};



const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(usersCollectionRef, where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(usersCollectionRef, {
        uid: user.uid,
        name: user.displayName,
        username: user.displayName,
        authProvider: "google",
        email: user.email,
        coins: 50,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};



const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Un mail de réinitialisation de mot de passe vous a été envoyé")
  } catch (err) {
    console.error(err);
    toast.error("Adresse mail invalide")
  }
};



const logout = () => {
  const auth = getAuth();
  console.log("logging out")
  signOut(auth);
  console.log("logged out")
};

export { signInWithGoogle, logInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, logout,};