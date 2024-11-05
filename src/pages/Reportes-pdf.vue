<template>
  <div class="row">
    <q-toolbar
      style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #cee5ef;
      "
    >
      <q-icon
        class="change-color"
        name="arrow_circle_left"
        style="
          font-size: 50px;
          margin-left: 15px;
          margin-top: 6px;
          color: #0b3668;
        "
        @click="regresar"
      />
      <q-label
        style="
          font-size: 40px;
          color: #0b3668;
          text-align: left;
          margin-left: 5px;
        "
        >Regresar</q-label
      >
      <q-toolbar-title
        class="tituloC"
        style="font-size: 40px; margin-left: 325px"
      >
        Reportes
      </q-toolbar-title>
      <q-icon
        name="account_circle"
        style="
          font-size: 50px;
          margin-left: 15px;
          margin-top: 6px;
          color: #0b3668;
        "
      />
    </q-toolbar>
    <div class="row" style="margin-top: 30px">
      <div
        v-for="(data, index) in opciones"
        :key="index"
        style="max-width: 300px"
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
import { ref } from "vue";
const router = useRouter();

const regresar = () => {
  router.push("/panel");
};

const opciones = ref([
  {
    id: 1,
    url: "assignment",
    titulo: "Estado de resultados",
    link: "EstadoR",
  },
  {
    id: 3,
    url: "balance",
    titulo: "Balance General",
    link: "Balance",
  },
]);

const funcionParaRedirigir = (link) => {
  router.push("/" + link);
};
</script>
