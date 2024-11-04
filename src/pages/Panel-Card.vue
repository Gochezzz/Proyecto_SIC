<template>
  <div class="row">
    <q-toolbar
      style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #CEE5EF;
      "
    >
      <q-toolbar-title class="titulo" style="font-size: 40px">
        Panel de Control
      </q-toolbar-title>
      <q-btn
        class="botoncerrar efect"
        label="Cerrar Sesion"
        style="padding-left: 20px; padding-right: 20px"
        @click="CerrarSesion"
      />
      <q-icon
        name="account_circle"
        style="
          font-size: 50px;
          margin-left: 15px;
          margin-top: 3px;
          color: #0b3668;
        "
      />
    </q-toolbar>
    <div class="row" style="margin-top: 30px">
      <div
        v-for="(data, index) in opciones"
        :key="index"
      >
        <div
          class="q-gutter-md q-mb-md text-center"
          style="width: 100%; padding: 1vh"
        >
          <q-card
            class="q-mb-md efect restarjeta change-color"
            style="
              background-color: #cee5ef;
              cursor: pointer;
              border: 4px solid #0b3668;
            "
            @click="funcionParaRedirigir(data.link)"
          >
            <q-icon
              :name="data.url"
              class="q-pa-md imgres"
              style="
                height: 30vh;
                object-fit: cover;
                font-size: 200px;
                color: #0b3668;
              "
            />
            <div class="absolute-bottom text-h6" style="color: #0b3668">
              {{ data.titulo }}
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref} from "vue";
import { signOut } from "firebase/auth";
import { auth } from "src/boot/firebase";
const router = useRouter();

const opciones = ref([
  {
    id: 2,
    url: "library_books",
    titulo: "Catalogo de Cuentas",
    link: "catalogo",
  },
  {
    id: 7,
    url: "currency_exchange",
    titulo: "Transacciones",
    link: "transaccion",
  },
  {
    id: 6,
    url: "poll",
    titulo: "Reportes",
    link: "reportes",
  },
  // Agrega más objetos según sea necesario
]);

const funcionParaRedirigir = (link) => {
  router.push("/" + link);
};

const CerrarSesion = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      auth.currentUser = null;
      if (auth.currentUser === null) {
        router.push("/");
      } else {
        alert("No se pudo cerrar sesion");
      }
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
      usuario.value = null;
    });
  //router.push("/");
};
</script>
