 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
      import {
        getAuth,
        GoogleAuthProvider,
        signInWithPopup,
      } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

      const firebaseConfig = {
        apiKey: "AIzaSyDQ2IyIArTli1JnjBy6DZAUPUp9mK3JTEM",
        authDomain: "keynest-70052.firebaseapp.com",
        projectId: "keynest-70052",
        storageBucket: "keynest-70052.firebasestorage.app",
        messagingSenderId: "506594151806",
        appId: "1:506594151806:web:6582f0b9d584ce614fb72f",
        measurementId: "G-X0G324PVHR",
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      auth.languageCode = `it`;
      const provider = new GoogleAuthProvider();

      // Google Sign-in Logic
      const googleLogin = document.getElementById("google-signin");
      googleLogin.addEventListener("click", () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const user = result.user;
            console.log(user);
            window.location.href = `public/keynest.html`;
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("omo Sign-in failed:", JSON.stringify(error, null, 2));

            console.log(error)

          });
      });