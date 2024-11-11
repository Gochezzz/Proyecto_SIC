<template>
  <div>
    <!-- Barra de herramientas -->
    <q-toolbar style="display: inline-flex; align-items: center; justify-content: center; background-color: #cee5ef;">
      <q-icon
        class="change-color"
        name="arrow_circle_left"
        style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0b3668;"
        @click="regresar"
      />
      <q-label style="font-size: 40px; color: #0b3668; text-align: left; margin-left: 5px;">Regresar</q-label>
      <q-toolbar-title class="tituloBG" style="font-size: 40px">Análisis Vertical</q-toolbar-title>
      <q-icon
        name="account_circle"
        style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0b3668;"
      />
    </q-toolbar>
    <!-- Botones para elegir el análisis -->
    <q-card-section class="botonesAnalisis">
      <q-btn color="primary" label="Análisis Vertical Balance General" @click="mostrarBalanceGeneral" />
      <q-btn color="primary" label="Análisis Vertical Estado de Resultados" @click="mostrarEstadoResultados" />
      <q-btn color="secondary" label="Generar PDF" @click="generarPDF" />
    </q-card-section>
    <VerticalER v-if="mostrarEstado"/>
    <VerticalBG v-if="mostrarBalance"/>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import VerticalBG from "src/componentes/VerticalBG.vue";
import VerticalER from "src/componentes/VerticalER.vue";

const router = useRouter();
const regresar = () => router.push("/reportes");

// Variables de control
const mostrarBalance = ref();
const mostrarEstado = ref();

// Funciones para mostrar el análisis correspondiente
const mostrarBalanceGeneral = () => {
  mostrarBalance.value = true;
  mostrarEstado.value = false;
};

const mostrarEstadoResultados = () => {
  mostrarBalance.value = false;
  mostrarEstado.value = true;
};

// Función para generar PDF usando el diálogo de impresión
const generarPDF = () => {
  window.print();
};
</script>

<style scoped>
.principalCard {
  width: 90%;
  margin: auto;
}
.anioSelector {
  display: flex;
  justify-content: center; /* Centra el selector de año horizontalmente */
  margin-top: 20px;
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
/* Ocultar todo excepto el contenido relevante al imprimir */
@media print {
  body * {
    visibility: hidden;
  }
  .print-section, .print-section * {
    visibility: visible;
  }
  .print-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
