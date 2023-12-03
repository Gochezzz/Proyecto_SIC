<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title> </q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page class="Ordenar">
    <div class="login">
      <p>Iniciar Sesion</p>
      <div class="form">
        <q-input
          type="text"
          v-model="Login.user"
          placeholder="nombre"
          label="Usuario"
        />
        <q-input
          type="password"
          v-model="Login.password"
          placeholder="**********"
          label="Contraseña"
        />
        <q-btn
          class="botoniniciar efect"
          color="secondary"
          label="Iniciar Sesion"
          style="padding-left: 20px; padding-right: 20px"
          @click="IniciarSesion"
        />
      </div>
    </div>
    <div class="ImgP">
      <q-img
        src="https://tocmexico.s3.amazonaws.com/full/cdn/2023/01/perfil.png"
        style="height: 300px; width: 300px; margin-left: 170px"
      />
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { auth, provider } from "src/boot/firebase";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";

const router = useRouter();

const Login = ref({
  user: "",
  password: "",
});
const IniciarSesion = () => {
  signInWithRedirect(auth, provider);

  //router.push("/panel");
};

function redirigirPanel() {
  if (auth.currentUser) {
    router.push("/panel");
  } else {
    console.log(auth.currentUser);
  }
}

defineComponent({
  name: "IndexPage",
});

onMounted(() => {
  if (auth.currentUser) {
    usuario.value = auth.currentUser;
  }
  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;

      // The signed-in user info.
      redirigirPanel();
      const user = result.user;
      console.log(user);
      usuario.value = user;
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>
