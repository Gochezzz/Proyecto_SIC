<template>
    <div class="row">
      <q-header class="text-white configh">
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;">
          <q-toolbar-title class="titulo" style="font-size: 40px;">
            Panel de Control
          </q-toolbar-title >
          <q-btn 
            class="botoncerrar" 
            label="Cerrar Sesion"
            style="padding-left: 20px; padding-right: 20px"
            @click="CerrarSesion"
          />
          <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 3px;color:#0B3668"/>
        </q-toolbar>
      </q-header>
      <div class="row" style="margin-top: 30px;">
        <div
          class="col-6 col-sm-3"
          v-for="(data, index) in opciones"
          :key="index"
        >
          <div
            class="q-gutter-md q-mb-md text-center"
            style="width: 100%; padding: 1vh"
          >
            <q-card
              class="q-mb-md efect restarjeta"
              style="
                background-color: #CEE5EF;
                cursor: pointer;
                border: 4px solid #0B3668;
              "
              @click="funcionParaRedirigir(data.link)"
            >
              <q-icon
                :name="data.url"
                class="q-pa-md imgres"
                style="height: 30vh; object-fit: cover; font-size: 200px;color: #FAC238"
              />
              <div class="absolute-bottom text-h6" style="color: #0B3668;">
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
    import { ref, defineComponent} from "vue";
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
            url: "local_mall",
            titulo: "Compras",
            link: "",
        },
        {
            id: 3,
            url: "price_check",
            titulo: "Ventas",
            link: "",
        },
        {
            id: 4,
            url: "archive",
            titulo: "Inventario",
            link: "",
        },
        {
            id: 5,
            url: "book",
            titulo: "Libro Diario",
            link: "",
        },
        {
            id: 6,
            url: "poll",
            titulo: "Reportes",
            link: "",
        },
        // Agrega más objetos según sea necesario
    ]);
    
    defineComponent({
        name: 'Panel-Card'
    })
    const funcionParaRedirigir = (link) => {
        router.push("/"+link);
    };
    const CerrarSesion = () => {
        router.push("/");
    };


  </script>