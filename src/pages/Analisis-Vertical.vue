<template>
  <div>
    <!-- Barra de herramientas -->
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
      <q-toolbar-title class="tituloBG" style="font-size: 40px">
        Análisis Vertical
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

    <!-- Año selector -->
    <q-card-section style="text-align: center; margin-top: 20px;">
      <q-select
        v-model="selectedYear"
        :options="years"
        label="Seleccione el Año"
        style="width: 200px;"
      />
    </q-card-section>

    <!-- Botones para elegir el análisis -->
    <q-card-section class="botonesAnalisis">
      <q-btn
        color="primary"
        label="Análisis Vertical Balance General"
        @click="mostrarBalanceGeneral"
      />
      <q-btn
        color="primary"
        label="Análisis Vertical Estado de Resultados"
        @click="mostrarEstadoResultados"
      />
    </q-card-section>

    <!-- Card principal -->
    <q-card class="principalCard">
      <!-- Mostrar Balance General o Estado de Resultados según selección -->
      <div v-if="mostrarBalance">
        <h5 style="margin-left: 5%; margin-bottom: 0%">
          Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa,
          S.A.B. de C.V.)
        </h5>
        <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
          Análisis Vertical - Balance General
        </h3>
        <h6 style="margin-left: 5%; margin-top: 2%">
          Al 31 de diciembre de {{ selectedYear }}<br />En porcentaje de activos totales
        </h6>

        <!-- Tablas para Balance General -->
        <q-card-section class="tablasBG">
          <h5 style="margin-left: 1%; margin-top: 1%; margin-bottom: 1%">
            Activos
          </h5>
          <q-table
            :rows="activosBalance"
            :columns="columnsVertical"
            flat
            dense
            hide-bottom
          />
        </q-card-section>
        <q-card-section class="tablasBG">
          <h5 style="margin-left: 1%; margin-top: 1%; margin-bottom: 1%">
            Pasivos y Patrimonio
          </h5>
          <q-table
            :rows="pasivosPatrimonioBalance"
            :columns="columnsVertical"
            flat
            dense
            hide-bottom
          />
        </q-card-section>
      </div>

      <div v-else-if="mostrarEstado">
        <h5 style="margin-left: 5%; margin-bottom: 0%">
          Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa,
          S.A.B. de C.V.)
        </h5>
        <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
          Análisis Vertical - Estado de Resultados
        </h3>
        <h6 style="margin-left: 5%; margin-top: 2%">
          Para el año terminado en {{ selectedYear }}<br />En porcentaje de ventas netas
        </h6>

        <!-- Tablas para Estado de Resultados -->
        <q-card-section class="tablasBG">
          <q-table
            :rows="estadoResultados"
            :columns="columnsVertical"
            flat
            dense
            hide-bottom
          />
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const regresar = () => router.push("/reportes");

// Variables de control
const mostrarBalance = ref(true);
const mostrarEstado = ref(false);
const selectedYear = ref(2023);

// Lista de años para seleccionar
const years = [2019,2020,2021,2022,2023];

// Columnas para análisis vertical
const columnsVertical = [
  { name: "nombre", label: "Cuenta", align: "left", field: "nombre" },
  { name: "porcentaje", label: "Porcentaje", align: "right", field: "porcentaje" },
];

// Datos de ejemplo para análisis vertical
const activosBalance = ref([
  { nombre: "Activo Circulante", porcentaje: "55.0%" },
  { nombre: "Activo No Circulante", porcentaje: "45.0%" },
]);

const pasivosPatrimonioBalance = ref([
  { nombre: "Pasivo Circulante", porcentaje: "30.0%" },
  { nombre: "Pasivo No Circulante", porcentaje: "25.0%" },
  { nombre: "Patrimonio Neto", porcentaje: "45.0%" },
]);

const estadoResultados = ref([
  { nombre: "Ventas Netas", porcentaje: "100.0%" },
  { nombre: "Costo de Ventas", porcentaje: "60.0%" },
  { nombre: "Gastos de Operación", porcentaje: "20.0%" },
  { nombre: "Utilidad Neta", porcentaje: "10.5%" },
]);

// Funciones para mostrar el análisis correspondiente
const mostrarBalanceGeneral = () => {
  mostrarBalance.value = true;
  mostrarEstado.value = false;
};

const mostrarEstadoResultados = () => {
  mostrarBalance.value = false;
  mostrarEstado.value = true;
};
</script>

<style scoped>
.principalCard {
  width: 90%;
  margin: auto;
}
.botonesAnalisis {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
.tablasBG {
  margin-top: 20px;
}
</style>
