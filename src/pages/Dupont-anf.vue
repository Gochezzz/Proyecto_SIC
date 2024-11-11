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
        Analisis Dupont
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
    <q-select
      outlined
      v-model="Estados.name"
      :options="estados"
      label="Modelo"
      class="col-5 col-md-3 q-mx-sm margenvariable"
      dense
      clearable
      style="
        color: #0b3668;
        margin-top: 20px;
        margin-left: 175px;
        width: 240px;
        margin-bottom: 20px;
      "
    />
    <q-select
      outlined
      v-model="anioSeleccionado"
      id="anioSeleccionado"
      :options="anosDisponibles"
      label="Año"
      class="col-5 col-md-3 q-mx-sm margenvariable"
      @update:model-value="buscarYCalcular"
      dense
      clearable
      :class="{ hidden: !showAnio, visible: showAnio }"
      style="
        color: #0b3668;
        margin-top: 20px;
        margin-left: 175px;
        width: 240px;
        margin-bottom: 20px;
      "
    />

    <q-btn
      color="primary"
      label="Cargar Datos de Sigma"
      id="boton-cargar-datos"
      @click="cargarDatos"
      style="margin-left: 175px; margin-bottom: 20px"
    />

    <div class="Ordenar">
      <div class="RSA">
        <label
          style="
            font-size: 20px;
            color: #0b3668;
            margin-left: 48.5%;
            font-weight: bold;
          "
          >RSA</label
        >
        <div class="cuadroDE">
          <q-card flat bordered style="border-radius: 10px">
            <q-card-section style="display: flex; justify-content: center">
              <div style="min-width: 140px; margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Ganancias disponibles para los accionistas comunes</label
                >
                <q-input
                  v-model="datosRSA.tipo"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div
                style="min-width: 140px; margin-left: 12px"
                v-if="Estados.name === 'No Simplificado'"
              >
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Ventas</label
                >
                <q-input
                  v-model="datosRSA.subtipo"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div style="min-width: 365px; margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Activos totales</label
                >
                <q-input
                  v-model="datosRSA.nombrec"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div style="margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >RSA</label
                >
                <q-input
                  v-model="datosRSA.monto"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
            </q-card-section>
            <q-card-section style="text-align: center">
              <q-btn
                class="botoncerrar efect"
                label="Calcular"
                style="padding-left: 20px; padding-right: 20px"
                @click="agregar"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <!-- RSE Section -->
    <div class="Ordenar" style="margin-top: 40px; margin-bottom: 40px">
      <div class="RSA">
        <label
          style="
            font-size: 20px;
            color: #0b3668;
            margin-left: 48.5%;
            font-weight: bold;
          "
          >RSE</label
        >
        <div class="cuadroDE">
          <q-card flat bordered style="border-radius: 10px">
            <q-card-section style="display: flex; justify-content: center">
              <div style="min-width: 140px; margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Ganancias disponibles para los accionistas comunes</label
                >
                <q-input
                  v-model="datosRSE.tipo"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div
                style="min-width: 140px; margin-left: 12px"
                v-if="Estados.name === 'No Simplificado'"
              >
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Activos totales</label
                >
                <q-input
                  v-model="datosRSE.subtipo"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div style="min-width: 365px; margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >Capital en Acciones Comunes</label
                >
                <q-input
                  v-model="datosRSE.nombrec"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
              <div style="margin-left: 12px">
                <label style="font-size: 16px; color: #0b3668; margin-top: 8px"
                  >RSE</label
                >
                <q-input
                  v-model="datosRSE.monto"
                  autogrow
                  dense
                  style="margin-top: 10px"
                />
              </div>
            </q-card-section>
            <q-card-section style="text-align: center">
              <q-btn
                class="botoncerrar efect"
                label="Calcular"
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
import { ref } from "vue";
import swal from "sweetalert";
import jsonData from "src/assets/dupontSIGMA.json"; // Asegúrate de que esta ruta sea correcta
import { dupontDB } from "src/boot/Pouchdb";

const router = useRouter();
const regresar = () => {
  router.push("/reportes");
};

const Estados = ref({ name: "" });
const anioSeleccionado = ref("");
const datosRSA = ref({ tipo: "", subtipo: "", nombrec: "", monto: "" });
const datosRSE = ref({ tipo: "", subtipo: "", nombrec: "", monto: "" });

const estados = ["Simplificado", "No Simplificado"];
const showAnio = ref(false);
const anosDisponibles = ["2019", "2020", "2021", "2022"];

const cargarDatos = () => {
  const botonCargarDatos = document.getElementById("boton-cargar-datos");
  botonCargarDatos.disabled = true;
  showAnio.value = true;
  jsonData.forEach((selectedData) => {
    const dataToSave = {
      _id: `dupont_${selectedData.anio}`,
      gpac: selectedData.gpac,
      activoTotal: selectedData.activoTotal,
      anio: selectedData.anio,
    };

    dupontDB
      .put(dataToSave)
      .then(() => {
        console.log(
          `Datos del año ${selectedData.anio} guardados correctamente`
        );
      })
      .catch((error) => {
        if (error.name === "conflict") {
          dupontDB
            .get(`dupont_${selectedData.anio}`)
            .then((existingDoc) => {
              return dupontDB.put({
                ...existingDoc,
                ...dataToSave,
              });
            })
            .then(() => {
              console.log(
                `Datos del año ${selectedData.anio} actualizados correctamente`
              );
            })
            .catch(() => {
              swal("Error", "Hubo un error al actualizar los datos", "error");
            });
        } else {
          swal("Error", "Hubo un error al guardar los datos", "error");
        }
      });
  });
};

const buscarYCalcular = async () => {
  if (anioSeleccionado.value && Estados.value.name === "Simplificado") {
    try {
      // Obtener todos los documentos
      const resultado = await dupontDB.allDocs({ include_docs: true });

      // Filtrar el documento por el año seleccionado
      const docEncontrado = resultado.rows.find(
        (row) => row.doc.anio === anioSeleccionado.value // Usar .value para acceder al valor real
      );

      if (docEncontrado) {
        const doc = docEncontrado.doc;
        datosRSA.value.tipo = doc.gpac || 0;
        datosRSA.value.subtipo = doc.ventas || 0;
        datosRSA.value.nombrec = doc.activoTotal || "";
        const total = doc.gpac / doc.activoTotal;
        datosRSA.value.monto = total;
      } else {
        console.log(
          "No se encontró ningún documento para el año seleccionado."
        );
      }
    } catch (error) {
      console.error("Error al buscar el documento:", error);
    }
  }
};
</script>
