<template>
  <div>
    <q-toolbar
      style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #cee5ef;
        margin-bottom: 20px;
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
        class="tituloT"
        style="font-size: 40px; margin-left: 325px"
      >
        Ingresar Datos
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
    <div class="Ordenar">
      <div class="fLibro">
        <div class="cuadroDE">
          <q-card flat bordered style="border-radius: 10px">
            <q-card-section style="display: flex; justify-content: center">
              <div style="min-width: 140px">
                <label
                  style="
                    font-size: 16px;
                    color: #0b3668;
                    margin-top: 8px;
                    margin-left: 12px;
                  "
                  >Tipo Cuenta</label
                >
                <q-select
                  v-model="datos.tipo"
                  :options="Tipos"
                  label="Tipo"
                  class="col-5 col-md-3 q-mx-sm"
                  dense
                  style="color: #0b3668; margin-top: 10px; margin-left: 12px"
                />
              </div>
              <div style="min-width: 365px">
                <label
                  style="
                    font-size: 16px;
                    color: #0b3668;
                    margin-top: 8px;
                    margin-left: 12px;
                  "
                  >Nombre Cuenta</label
                >
                <q-select
                  v-model="datos.nombrec"
                  :options="mostrarSelecCuenta"
                  label="nombre"
                  class="col-5 col-md-3 q-mx-sm"
                  dense
                  style="color: #0b3668; margin-top: 10px; margin-left: 12px"
                />
              </div>
              <div style="margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Monto</label
                >
                <q-input
                  v-model="datos.monto"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div style="margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Fecha</label
                >
                <q-input
                  v-model="datos.fecha"
                  filled
                  dense
                  style="
                    max-width: 200px;
                    margin-top: 10px !important;
                    margin-left: 0px !important;
                    padding-left: 0px !important;
                    padding-top: 0px !important;
                  "
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="datos.fecha" class="q-pa-md" />
                        <div class="row items-center justify-end q-mt-sm">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </q-card-section>
            <q-card-section style="text-align: center">
              <q-btn
                class="botoncerrar efect"
                label="Agregar"
                style="padding-left: 20px; padding-right: 20px"
                @click="agregar"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import swal from "sweetalert";
import { cuentasdb, catalogodb } from "../boot/Pouchdb";

const router = useRouter();
const datos = ref({
  tipo: "",
  subtipo: "Corriente",
  nombrec: "",
  monto: "",
  fecha: "",
});
const Tipos = [
  "Activo",
  "Pasivo",
  "Patrimonio",
  "Gasto",
  "Ingreso",
  "Cuenta de Cierre",
];
const mostrarSelecCuenta = ref([]);
const date = ref("2024/11/04");

// Navegar a la pantalla de panel
const regresar = () => {
  router.push("/panel");
};

// Cargar las cuentas desde la base de datos local `catalogodb`
const cargarDatos = async () => {
  try {
    const result = await catalogodb.allDocs({ include_docs: true });
    mostrarSelecCuenta.value = result.rows.map((row) => row.doc.nombre); // Obtener los nombres de las cuentas
  } catch (error) {
    console.error("Error cargando datos del catálogo:", error);
  }
};

// Función para agregar datos a la base `cuentasdb`
async function agregar() {
  try {
    const valordatos = Object.values(datos.value);
    if (valordatos.some((valor) => !valor)) {
      swal({
        title: "¡Espera!",
        text: "Debes llenar todos los campos",
        icon: "warning",
        buttons: false,
        timer: 3500,
      });
      return; // Detener la ejecución si al menos un campo está vacío
    }

    // Guardar el documento en PouchDB `cuentasdb`
    const doc = {
      _id: new Date().toISOString(),
      tipo: datos.value.tipo,
      subtipo: "Corriente",
      nombrec: datos.value.nombrec,
      monto: datos.value.monto,
      fecha: datos.value.fecha,
    };
    await cuentasdb.put(doc);

    swal({
      title: "Muy Bien",
      text: "La cuenta se creó correctamente",
      icon: "success",
      buttons: false,
      timer: 3000,
    });

    // Limpiar los campos después de guardar
    datos.value.tipo = "";
    datos.value.nombrec = "";
    datos.value.monto = "";
    datos.value.fecha = "";
  } catch (error) {
    console.error("Error agregando el documento:", error);
  }
}

onMounted(() => {
  cargarDatos(); // Cargar las cuentas del catálogo al montar el componente
});
</script>
