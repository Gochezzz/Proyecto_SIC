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
          :rows="tableData"
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
import { ref, onMounted } from "vue";
import { cuentasER } from "../boot/Pouchdb"; // Usamos la base de datos cuentasER

const router = useRouter();

const regresar = () => {
  router.push("/reportes");
};

// Variables reactivas
const selectedYear = ref(new Date().getFullYear());
const years = [2023, 2022, 2021, 2020, 2019];

const data = ref([]); // Contendrá todos los datos del estado de resultados
const tableData = ref([]); // Contendrá los datos filtrados y calculados

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

// Cargar datos desde la base de datos (cuentasER)
const loadData = async () => {
  try {
    const cuentas = await cuentasER.allDocs({ include_docs: true });
    data.value = cuentas.rows.map(row => row.doc);

    // Filtrar y procesar datos para el año seleccionado
    filterDataByYear();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};

// Filtrar y procesar los datos según el año seleccionado
const filterDataByYear = () => {
  // Filtrar los datos por el año seleccionado
  const filteredData = data.value.filter(
    item => new Date(item.fecha).getFullYear() === selectedYear.value
  );

  // Inicializar las variables
  let totalIngresos = 0;
  let totalCostos = 0;
  let totalGastosVenta = 0;
  let totalGastosAdministracion = 0;
  let totalOtrosGastos = 0;
  let totalIngresosFinancieros = 0;
  let totalGastosFinancieros = 0;
  let totalParticipacion = 0;
  let totalImpuestos = 0;
  let totalPerdidaCambiaria = 0; // Nueva variable para la pérdida cambiaria

  // Recorremos los datos filtrados
  filteredData.forEach(item => {
    // Imprimir para ver los datos y asegurarnos de que se están procesando correctamente
    console.log("Procesando item:", item.nombre, item.tipo, item.monto);

    // Solo los ingresos del tipo correcto
  // Filtra los datos por el nombre correspondiente
  if (item.tipo === "Ingreso" && item.nombre === "Ingresos") {
    totalIngresos += item.monto;
  } else if (item.tipo === "Costo") {
    totalCostos += item.monto;
  } else if (item.tipo === "Gasto") {
    if (item.nombre === "Gastos de venta") {
      totalGastosVenta += item.monto;
    } else if (item.nombre === "Gastos de administración") {
      totalGastosAdministracion += item.monto;
    } else if (item.nombre === "Otros gastos, neto") {
      totalOtrosGastos += item.monto;
    }
  } else if (item.tipo === "Impuesto") {
    totalImpuestos += item.monto;
  }

  // Ingresa los ingresos y gastos financieros por separado
  if (item.nombre === "Ingresos financieros") {
    totalIngresosFinancieros += item.monto;
  } else if (item.nombre === "Gastos financieros") {
    totalGastosFinancieros += item.monto;
  } else if (item.nombre === "Pérdida cambiaria, neta") {
    totalPerdidaCambiaria += item.monto;
  }

  if (item.nombre === "Participación en resultados de asociados") {
    totalParticipacion += item.monto;
  }
});

// Calcula los resultados financieros correctamente ahora que las variables están separadas
const resultadoFinanciero = -totalIngresosFinancieros - totalGastosFinancieros - totalPerdidaCambiaria;

// Calcula la utilidad neta y otros totales
const utilidadBruta = totalIngresos + totalCostos;
const utilidadOperativa = utilidadBruta + (totalGastosVenta + totalGastosAdministracion + totalOtrosGastos);
const utilidadAntesDeImpuestos = utilidadOperativa - resultadoFinanciero + totalParticipacion;
const utilidadNeta = utilidadAntesDeImpuestos + totalImpuestos;

// Crear los datos para la tabla
tableData.value = [
  { nombre: "Ingresos", monto: totalIngresos },
  { nombre: "Costo de ventas", monto: totalCostos },
  { nombre: "Utilidad bruta", monto: utilidadBruta },
  { nombre: "Gastos de venta", monto: totalGastosVenta },
  { nombre: "Gastos de administración", monto: totalGastosAdministracion },
  { nombre: "Otros gastos, neto", monto: totalOtrosGastos },
  { nombre: "Utilidad de operación", monto: utilidadOperativa },
  { nombre: "Ingresos financieros", monto: totalIngresosFinancieros },
  { nombre: "Gastos financieros", monto: totalGastosFinancieros },
  { nombre: "Pérdida cambiaria, neta", monto: totalPerdidaCambiaria },
  { nombre: "Resultado financiero, neto", monto: resultadoFinanciero },
  { nombre: "Participación en resultados de asociados", monto: totalParticipacion },
  { nombre: "Utilidad antes de impuestos", monto: utilidadAntesDeImpuestos },
  { nombre: "Impuestos a la utilidad", monto: totalImpuestos },
  { nombre: "Utilidad neta consolidada", monto: utilidadNeta },
];
  // Imprimir el resultado final para ver si es correcto
  console.log("Total Ingresos: ", totalIngresos);
};



// Cargar los datos al montar el componente
onMounted(loadData);

// Función para generar el PDF
const generatePDF = () => {
  window.print();
};
</script>

<style scoped>
/* Estilos para la tabla */
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
