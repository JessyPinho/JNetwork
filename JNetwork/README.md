Welcome ! In this README I will show you how to run our platform step-by-step.
Without further ado, let's start !

# Install Git
If you haven't installed Git yet, I can link you to their documentation which is very simple and will help you install it : https://github.com/git-guides/install-git
# Install NPM

If you already have NPM, you can go to the next step.

To install NPM, you first have to download nodeJS and it will install NPM automatically via the link https://nodejs.org/en/.
# Install all the packages

`` npm install ``

     or

`` yarn install ``
(if you want to install yarn, you can install it with the command ``npm install --global yarn``)

# Firebase
If you already have created a Firebase Database you can skip this part and see the part where you configure you .env file because you only need to configure that for Firebase to work

So for this part I will explain to you how to create your firebase database and where to get the settings necessary for the next step

So first of all, the only first you will need for the platform to work that's from Firebase is your configuration and I will explain where you get it right now : 

So to get that, you will first have to create a firebase project, so you can go to https://firebase.google.com/ and click on the "Get Started" button that will lead you to a page where you can create a project and that's what you have to do.

So you click on the button to create a project and you will have to give a name to your project, after that you will have a section that will ask if you want google analytics for your project and it's up to you to decide if yes or not you want it but I personnaly didn't use it.

After that your project is in creation, if it's done and you click to continue you will end up in your database and at the center of your screen you will get to choose if you want to add an app or not and you will add a WEB app.

If you clicked on the option to create a web app you will find yourself in a page where you decide on how to name you web application, so you name it, you can also add firebase hosting right now if you and to deploy you site in the future.

The second page is what we will need for the platform, you will have a section that says "add your Firebase SDK" and what we need for our .env is what is in the Firebase Config const (apiKey, authDomain, etc..). You can take this configuration and copy it to paste it in the next step.

What you can also do to not lose time is to activate your "Authentication", "Firebase Database", "Storage" and "Hosting" in the "Create" section on the
sidebar in the overview of your firebase database.

If you've done all of that, you can go into the next step.

# Configure init_firebase file
To configure this file, I will just show you the template and you can fill it with the information from Firebase that I showed you earlier.
Here's the template :

`` apiKey: "your-key", ``
`` authDomain: "your-domain", ``
`` projectId: "your-project-id", ``
`` storageBucket: "your-storage-bucket", ``
`` messagingSenderId: "your-id", ``
`` appId: "your-app-id", `` 

With this, we're done with the firebase_init or, to be more secure you can also create a .env file and put your variable inside the init_firebase file.
Your .env file will look like this : 

`` REACT_APP_FIREBASE_API_KEY = "Your-API-Key" ``

`` REACT_APP_FIREBASE_AUTH_DOMAIN = "Your-Auth-Domain" ``

`` REACT_APP_FIREBASE_PROJECT_ID = "Your-Project-Id" ``

`` REACT_APP_FIREBASE_STORAGE_BUCKET = "Your-Storage-Bucket" ``

`` REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "Your-Messaging-Sender-Id" ``

`` REACT_APP_FIREBASE_APP_ID = "Your-App-Id" ``

And with this, we're done with the .env file and you can run the platform
# Run platform
For this final step, you just have to run your platform, if you see an error message, you're either not in the right directory or you npm start is not configured in you "package.json" file on the "scripts" section.
So to run the platform you just have to write this in you terminal : 
`` npm run start ``

And there we go, if you're reading I hope that means that the app is running well and there's no problem with it.

Thank you for Reading this README.
