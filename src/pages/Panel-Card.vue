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
const router = useRouter();

const opciones = ref([
  {
    id: 1,
    url: "library_books",
    titulo: "Catalogo de Cuentas",
    link: "catalogo",
  },
  {
    id: 2,
    url: "description",
    titulo: "Ingreso de Datos",
    link: "transaccion",
  },
  {
    id: 3,
    url: "edit_note",
    titulo: "Editar Datos",
    link: "editar",
  },
  {
    id: 4,
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

  router.push("/");

};
</script>
