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
        Balance General
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
        Estados Consolidados de Situacion Financiera
      </h3>
      <h6 style="margin-left: 5%; margin-top: 2%">
        Al 31 de diciembre de 2019<br />En miles de pesos mexicanos
      </h6>

      <!-- Tablas para Activos, Pasivos y Patrimonio -->
      <q-card-section class="tablasBG">
        <h5 style="margin-left: 1%; margin-top: 1%; margin-bottom: 1%">
          Activos
        </h5>
        <q-table
          :rows="activos"
          :columns="columns"
          flat
          dense
          :pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[]"
          hide-bottom
        />
      </q-card-section>

      <q-card-section class="tablasBG">
        <h5 style="margin-left: 1%; margin-top: 1%; margin-bottom: 1%">
          Pasivos
        </h5>
        <q-table
          :rows="pasivos"
          :columns="columns"
          flat
          dense
          :pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[]"
          hide-bottom
          class="letraT"
        />
      </q-card-section>

      <q-card-section class="tablasBG">
        <h5 style="margin-left: 1%; margin-top: 1%; margin-bottom: 1%">
          Patrimonio
        </h5>
        <q-table
          :rows="patrimonios"
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

const activos = ref([
  { nombre: "Efectivo y equivalentes de efectivo", valor: 9730213 },
  { nombre: "Efectivo restringido", valor: 11307 },
  { nombre: "Clientes y otras cuentas por cobrar, neto", valor: 7903117 },
  { nombre: "Inventarios", valor: 16244535 },
  { nombre: "Impuestos a la utilidad por recuperar", valor: null },
  { nombre: "Instrumentos financieros derivados", valor: null },
  { nombre: "Activos mantenidos para la venta", valor: 485997 },
]);

const pasivos = ref([
  { nombre: "Cuentas por Pagar", valor: 75000 },
  { nombre: "Préstamos a Largo Plazo", valor: 100000 },
]);

const patrimonios = ref([
  { nombre: "Capital Social", valor: 275000 },
  { nombre: "Utilidades Retenidas", valor: 204000 },
]);

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
  {
    name: "valor",
    label: "Valor",
    align: "right",
    field: (row) => formatCurrency(row.valor),
  },
];

// Método para generar PDF
const generatePDF = () => {
  const doc = new jsPDF();

  // Título del PDF
  doc.text(`Balance General - Año ${selectedYear.value}`, 10, 10);

  // Activos
  doc.text("Activos:", 10, 20);
  activos.value.forEach((activo, index) => {
    doc.text(
      `${activo.nombre}: ${formatCurrency(activo.valor)}`,
      10,
      30 + index * 10
    );
  });

  // Pasivos
  doc.text("Pasivos:", 10, 30 + activos.value.length * 10);
  pasivos.value.forEach((pasivo, index) => {
    doc.text(
      `${pasivo.nombre}: ${formatCurrency(pasivo.valor)}`,
      10,
      40 + (activos.value.length + index) * 10
    );
  });

  // Patrimonio
  doc.text(
    "Patrimonio:",
    10,
    40 + (activos.value.length + pasivos.value.length) * 10
  );
  patrimonios.value.forEach((patrimonio, index) => {
    doc.text(
      `${patrimonio.nombre}: ${formatCurrency(patrimonio.valor)}`,
      10,
      50 + (activos.value.length + pasivos.value.length + index) * 10
    );
  });

  // Guardar PDF
  doc.save(`Balance_General_${selectedYear.value}.pdf`);
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
  width: 30%;
  margin-top: 2%;
}
</style>
