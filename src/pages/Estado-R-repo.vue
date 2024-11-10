<template>
  <div>
    <!-- Barra de herramientas (oculta en PDF) -->
    <q-toolbar
      style="display: inline-flex; align-items: center; justify-content: center; background-color: #cee5ef;"
      class="no-print"
    >
      <q-icon
        class="change-color"
        name="arrow_circle_left"
        style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0b3668;"
        @click="regresar"
      />
      <q-label style="font-size: 40px; color: #0b3668; text-align: left; margin-left: 5px;">Regresar</q-label>
      <q-toolbar-title class="tituloBG" style="font-size: 40px">Estado de Resultados</q-toolbar-title>
      <q-icon
        name="account_circle"
        style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0b3668;"
      />
    </q-toolbar>

    <!-- Contenedor para Selector de Año y Botón PDF (fuera de la tarjeta y oculto en impresión) -->
    <div class="no-print" style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
      <q-select
        v-model="selectedYear"
        :options="years"
        label="Seleccione el Año"
        class="AnioPicker"
        outlined
        dense
      />
      <q-btn color="primary" label="Generar PDF" @click="generatePDF" icon="picture_as_pdf" />
    </div>

    <!-- Card principal -->
    <q-card class="principalCard print-section">
      <h5 style="margin-left: 5%; margin-bottom: 0%">Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa, S.A.B. de C.V.)</h5>
      <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">Estado de Resultados Consolidados</h3>
      <h6 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos mexicanos</h6>

      <!-- Tablas para Ingresos, Gastos y Utilidad -->
      <q-card-section class="tablasBG">
        <q-table
          :rows="ingresos"
          :columns="columns"
          flat
          dense
          :pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[]"
          hide-bottom
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const regresar = () => router.push("/reportes");

// Variables reactivas
const selectedYear = ref(new Date().getFullYear());
const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

const ingresos = ref([
  { nombre: "Ingresos", valor: 13020447 },
  { nombre: "Costo de ventas", valor: 9153452 },
  { nombre: "Utilidad bruta", valor: 3866995 },
  { nombre: "Gastos de venta", valor: 2664536 },
  { nombre: "Gastos de administración", valor: 191353 },
  { nombre: "Otros (ingresos) gastos, neto", valor: -23489 },
  { nombre: "Utilidad operativa", valor: 462406 },
  { nombre: "Costos financieros", valor: 166861 },
  { nombre: "Otros ingresos financieros", valor: 14450 },
  { nombre: "Participación en asociadas", valor: 1334 },
  { nombre: "Utilidad antes de impuestos", valor: 311329 },
  { nombre: "Impuesto sobre la renta", valor: 11218 },
  { nombre: "Utilidad neta", valor: 300111 },
]);

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Descripción", align: "left", field: "nombre" },
  {
    name: "valor",
    label: "Valor",
    align: "right",
    field: (row) => formatCurrency(row.valor),
  },
];

// Filtro de formato de moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// Función para abrir el diálogo de impresión
const generatePDF = () => {
  window.print();
};
</script>

<style scoped>
.custom-header-class {
  background-color: #0b3668;
  color: #ffffff;
}

.custom-row-class {
  background-color: #cee5ef;
  color: #0b3668;
}
.principalCard {
  width: 70%;
  margin: 0 auto;
  margin-top: 3%;
}
.AnioPicker {
  width: 40%;
}
.tablasBG {
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 0%;
  margin-bottom: 0%;
}

/* Estilos para impresión */
@media print {
  body * {
    visibility: hidden;
  }
  .print-section, .print-section * {
    visibility: visible;
  }
  .no-print {
    display: none;
  }
  .print-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
