import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
    import {
      getAuth,
      onAuthStateChanged,
      signOut
    } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
    import {
      getFirestore,
      collection,
      addDoc,
      getDocs,
      deleteDoc,
      doc
    } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyDQ2IyIArTli1JnjBy6DZAUPUp9mK3JTEM",
      authDomain: "keynest-70052.firebaseapp.com",
      projectId: "keynest-70052",
      storageBucket: "keynest-70052.firebasestorage.app",
      messagingSenderId: "506594151806",
      appId: "1:506594151806:web:6582f0b9d584ce614fb72f",
      measurementId: "G-X0G324PVHR",
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const form = document.getElementById("login-form");
    const list = document.getElementById("logins-list");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        document.getElementById("user-email").textContent = user.email;
        loadLogins(user.uid);
      } else {
        window.location.href = "../index.html";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const platform = form.platform.value;
      const username = form.username.value;
      const password = form.password.value;
      const user = auth.currentUser;

      if (user) {
        await addDoc(collection(db, "logins"), {
          uid: user.uid,
          platform,
          username,
          password,
        });
        form.reset();
        loadLogins(user.uid);
      }
    });

    async function loadLogins(uid) {
      list.innerHTML = "";
      const snapshot = await getDocs(collection(db, "logins"));
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.uid === uid) {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${data.platform}</strong>
            <span>Username: ${data.username}</span>
            <span>Password: ${data.password}</span>
            <button onclick="deleteLogin('${docSnap.id}')">Delete</button>
          `;
          list.appendChild(li);
        }
      });
    }

    window.deleteLogin = async (id) => {
      await deleteDoc(doc(db, "logins", id));
      const user = auth.currentUser;
      if (user) loadLogins(user.uid);
    };

    document.getElementById("signout-btn").addEventListener("click", () => {
      signOut(auth);
    });