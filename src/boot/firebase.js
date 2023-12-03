import { boot } from "quasar/wrappers";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { VueFire } from "vuefire";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDSRJ9sOX6UeBp1ptIv7SqtZrgoyUD2dE",
  authDomain: "proyectsic.firebaseapp.com",
  projectId: "proyectsic",
  storageBucket: "proyectsic.appspot.com",
  messagingSenderId: "597123659234",
  appId: "1:597123659234:web:aa694c5f746b735088b5bb",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
auth.languageCode = "es";

export default boot(({ app, router }) => {
  // something to do
  app.use(VueFire, {
    app,
    modules: [],
  });
  router.beforeEach((to, from, next) => {
    const rutaProtegida = to.matched.some((record) => record.meta.requireAuth);
    const user = auth.currentUser;
    if (rutaProtegida === true && user === null) {
      next("/");
    } else {
      next();
    }
  });
});

// Initialize Firebase

export { db, auth, provider };
