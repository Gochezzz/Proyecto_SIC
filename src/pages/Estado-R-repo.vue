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
        Estado de Resultados
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

    <!-- Card principal -->
    <q-card class="principalCard">
      <!-- Selector de Año -->
      <q-card-section>
        <q-select
          v-model="selectedYear"
          :options="years"
          label="Seleccione el Año"
          class="AnioPicker"
          outlined
          dense
        />
      </q-card-section>
      <h5 style="margin-left: 5%; margin-bottom: 0%">
        Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa,
        S.A.B. de C.V.)
      </h5>
      <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
        Estado de Resultados Consolidados
      </h3>
      <h6 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
        Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos
        mexicanos
      </h6>

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

      <!-- Botón para Generar PDF -->
      <q-card-section class="generarpdf">
        <q-btn
          color="primary"
          label="Generar PDF"
          @click="generatePDF"
          icon="picture_as_pdf"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { jsPDF } from "jspdf";

const router = useRouter();

const regresar = () => {
  router.push("/reportes");
};

// Variables reactivas
const selectedYear = ref(null);
const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);

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
  { name: "nombre", label: "", align: "left", field: "nombre" },
  {
    name: "valor",
    label: "",
    align: "right",
    field: (row) => formatCurrency(row.valor),
  },
];

// Método para generar PDF
const generatePDF = () => {
  const doc = new jsPDF();

  // Título del PDF
  doc.text(`Estado de Resultados - Año ${selectedYear.value}`, 10, 10);

  // Ingresos
  doc.text("Ingresos:", 10, 20);
  ingresos.value.forEach((ingreso, index) => {
    doc.text(
      `${ingreso.nombre}: ${formatCurrency(ingreso.valor)}`,
      10,
      30 + index * 10
    );
  });

  // Gastos
  doc.text("Gastos:", 10, 30 + ingresos.value.length * 10);
  gastos.value.forEach((gasto, index) => {
    doc.text(
      `${gasto.nombre}: ${formatCurrency(gasto.valor)}`,
      10,
      40 + (ingresos.value.length + index) * 10
    );
  });

  // Utilidad
  doc.text(
    "Utilidad:",
    10,
    40 + (ingresos.value.length + gastos.value.length) * 10
  );
  utilidades.value.forEach((utilidad, index) => {
    doc.text(
      `${utilidad.nombre}: ${formatCurrency(utilidad.valor)}`,
      10,
      50 + (ingresos.value.length + gastos.value.length + index) * 10
    );
  });

  // Guardar PDF
  doc.save(`Estado_Resultados_${selectedYear.value}.pdf`);
};

// Filtro de formato de moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(value);
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
  margin: 0 auto;
  margin-top: 2%;
}
.tablasBG {
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 0%;
  margin-bottom: 0%;
}
.generarpdf {
  margin: 0 auto;
  width: 20%;
  margin-top: 2%;
}
</style>
