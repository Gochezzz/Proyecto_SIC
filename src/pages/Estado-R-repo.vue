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

    <!-- Selector de Año y Botón PDF -->
    <div class="no-print" style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
      <q-select
        v-model="selectedYear"
        :options="years"
        label="Seleccione el Año"
        class="AnioPicker"
        outlined
        dense
        @update:model-value="filterDataByYear"
      />
      <q-btn color="primary" label="Generar PDF" @click="generatePDF" icon="picture_as_pdf" />
    </div>

    <!-- Card principal con la tabla de resultados -->
    <q-card class="principalCard print-section">
      <h5 style="margin-left: 5%; margin-bottom: 0%">Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa, S.A.B. de C.V.)</h5>
      <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">Estado de Resultados Consolidados</h3>
      <h6 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos mexicanos</h6>

      <!-- Tabla de datos -->
      <q-card-section class="tablasBG">
        <q-table
          :rows="filteredData"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const regresar = () => router.push("/reportes");

// Variables reactivas
const selectedYear = ref(new Date().getFullYear());
const years = [2023, 2022, 2021, 2020, 2019];

const data = ref([]); // Contendrá todos los datos del JSON
const filteredData = ref([]); // Contendrá los datos filtrados por año

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Descripción", align: "left", field: "nombre" },
  { name: "monto", label: "Valor", align: "right", field: row => formatCurrency(row.monto) },
];

// Formato de moneda
const formatCurrency = value => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "MXN",
  }).format(value);
};

// Cargar datos del JSON al montar el componente
const loadData = async () => {
  try {
    const response = await fetch("/src/assets/ERSIGMA.json");
    const jsonData = await response.json();
    data.value = jsonData;

    // Filtrar datos para el año seleccionado
    filterDataByYear();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

// Filtrar los datos según el año seleccionado
const filterDataByYear = () => {
  filteredData.value = data.value.filter(
    item => item.fecha.startsWith(selectedYear.value.toString())
  );
};

// Cargar datos iniciales al montar el componente
onMounted(loadData);

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
