import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQ2IyIArTli1JnjBy6DZAUPUp9mK3JTEM",
  authDomain: "keynest-70052.firebaseapp.com",
  projectId: "keynest-70052",
  storageBucket: "keynest-70052.appspot.com",
  messagingSenderId: "506594151806",
  appId: "1:506594151806:web:6582f0b9d584ce614fb72f",
  measurementId: "G-X0G324PVHR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await loadLogins();
  } else {
    alert("Not signed in. Redirecting...");
    window.location.href = "/";
  }
});

const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const platform = document.getElementById("platform").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!currentUser) return alert("Please sign in first.");

  try {
    await addDoc(collection(db, "logins"), {
      uid: currentUser.uid,
      platform,
      username,
      password,
      timestamp: Date.now(),
    });

    form.reset();
    loadLogins();
  } catch (err) {
    console.error("Error saving login:", err);
  }
});

async function loadLogins() {
  const list = document.getElementById("logins-list");
  list.innerHTML = "<h2>🔐 Saved Logins</h2>";

  const q = query(
    collection(db, "logins"),
    where("uid", "==", currentUser.uid)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement("div");
    item.className = "login-item";
    item.innerHTML = `
            <h3>${data.platform}</h3>
            <p><strong>User:</strong> ${data.username}</p>
            <p><strong>Pass:</strong> ${data.password}</p>
          `;
    list.appendChild(item);
  });
}

// rules_version = '2';


// service cloud.firestore {

//   match /databases/{database}/documents {

//     match /{document=**} {

//       allow read, write: if

//           request.time < timestamp.date(2025, 6, 20);

//     }

//   }

// }

// caution:
//   // This is a sample Firestore security rule. You should customize it to fit your app's needs.
//   // The above rule allows read and write access to all documents until June 20, 2025.
//   // In a production app, you should restrict access based on user authentication and roles.
// }