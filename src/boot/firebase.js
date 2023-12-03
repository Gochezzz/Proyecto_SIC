import { boot } from "quasar/wrappers";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { VueFire } from "vuefire";

const firebaseConfig = {
  apiKey: "AIzaSyCDSRJ9sOX6UeBp1ptIv7SqtZrgoyUD2dE",
  authDomain: "proyectsic.firebaseapp.com",
  projectId: "proyectsic",
  storageBucket: "proyectsic.appspot.com",
  messagingSenderId: "597123659234",
  appId: "1:597123659234:web:aa694c5f746b735088b5bb"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default boot(({ app }) => {
  // something to do
  app.use(VueFire, {
    app,
    modules: [],
  });
});

// Initialize Firebase

export { db };