<template>
  <div>
    <q-page class="Ordenar" style="background-image: url('https://boeke-partner.de/wp-content/uploads/2019/01/kontakt-slider.jpg') ">
      <div class="login" style="margin-top: 170px;">
        <p style="color: white;font-size: 60px;">Iniciar Sesion</p>
        <div class="form">
          <q-btn
            class="botoniniciar efect"
            style="padding-left: 20px; padding-right: 20px;"
            @click="IniciarSesion"
          >
            <label color="white" style="font-size: 20px;">Iniciar Sesion con Google</label>
            <q-avatar style="margin-left: 40px;">
              <img src="https://res.cloudinary.com/amenitiz/image/upload/w_500,dpr_auto,f_auto,q_auto:good/v1670596120/jd8epqybnwi12n8m2znp.png">
            </q-avatar>
          </q-btn>
        </div>
      </div>
      <div class="ImgP" style="margin-top: 115px;margin-left: 60px;">
        <q-avatar style="margin-left: 40px; font-size: 350px;">
          <img :src="photo">
        </q-avatar>
        <div style="color: white; font-size: 26px; margin-top: 10px;margin-left: 50px;">
          {{ name || '' }}
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { auth, provider } from "src/boot/firebase";
import { signInWithRedirect, onAuthStateChanged } from "firebase/auth";

const usuario = ref([]);
const photo = ref("");
const name = ref("");
const router = useRouter();

const Login = ref({
  user: "",
  password: "",
});

const IniciarSesion = () => {
  signInWithRedirect(auth, provider);
};

function redirigirPanel() {
  if (auth.currentUser) {
    // Redirige a "/panel" cuando la autenticación se completa
    router.push("/panel");
  } else {
    console.log("El usuario no está autenticado");
  }
}

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user && user.photoURL) {
      usuario.value = user;
      photo.value = user.photoURL;
      name.value = user.displayName;
      console.log("URL de la foto del usuario:", photo.value);
      console.log("Nombre del usuario:", name.value);
      // Redirige después de 5 segundos
      setTimeout(() => {
        redirigirPanel();
      }, 4500);
    } else {
      console.log("El usuario no está autenticado");
    }
  });

  // Importante: Detener la suscripción al desmontar el componente
  watch(() => router.currentRoute, () => {
    unsubscribe();
  });
});
</script>