<template>
  <div>
    <!-- Card principal con la tabla de resultados -->
    <q-card class="principalCard print-section">
      <!-- Selector de Año y Botón PDF -->
      <q-card-section>
        <q-select
          v-model="selectedYear"
          :options="years"
          label="Seleccione el Año Actual"
          class="AnioPicker"
          outlined
          dense
        />
        <q-select
          v-model="selectedYear2"
          :options="years"
          label="Seleccione el Año Anterior"
          class="AnioPicker"
          outlined
          dense
        />
      </q-card-section>
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
import { ref, onMounted, watch } from "vue";
import { cuentasER } from "../boot/Pouchdb"; // Usamos la base de datos cuentasER

// Variables reactivas
const selectedYear = ref(new Date().getFullYear());
const selectedYear2 = ref(new Date().getFullYear());
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

  let Ingresos = 0;
  let Costoventa = 0;
  let GastoVenta = 0;
  let GastoAdmi = 0;
  let Otrogasto = 0;
  let IngresoFin = 0;
  let GastoFin = 0;
  let PerdidaCamb = 0;
  let PartenResul = 0;
  let ImpuestosUT = 0;
  let PormedioAc = 0;

  // Recorremos los datos filtrados
  filteredData.forEach(item => {
    if (item.nombre === "Ingresos") {
      Ingresos += item.monto;
    } else if (item.nombre === "Costo de ventas") {
      Costoventa += item.monto;
    } else if (item.nombre === "Gastos de venta") {
      GastoVenta += item.monto;
    } else if (item.nombre === "Gastos de administración") {
      GastoAdmi += item.monto;
    }else if (item.nombre === "Otros gastos, neto") {
      Otrogasto += item.monto;
    } else if (item.nombre === "Ingresos financieros") {
      IngresoFin += item.monto;
    } else if (item.nombre === "Gastos financieros") {
      GastoFin += item.monto;
    } else if (item.nombre === "Pérdida cambiaria, neta") {
      PerdidaCamb += item.monto;
    } else if (item.nombre === "Participación en resultados de asociados") {
      PartenResul += item.monto;
    } else if (item.nombre === "Impuestos a la utilidad") {
      ImpuestosUT += item.monto;
    } else if (item.nombre === "Promedio ponderado de acciones en circulación") {
      PormedioAc += item.monto;
    }
  });

// Calcula los resultados financieros correctamente ahora que las variables están separadas

// Calcula la utilidad neta y otros totales
const utilidadBruta = Ingresos + Costoventa;
const utilidadOperativa = utilidadBruta + (GastoVenta + Otrogasto + GastoAdmi);
const resultadoFinanciero = IngresoFin + GastoFin + PerdidaCamb;
const utilidadAntesDeImpuestos = utilidadOperativa + resultadoFinanciero + PartenResul;
const utilidadNeta = utilidadAntesDeImpuestos + ImpuestosUT;

// Crear los datos para la tabla
tableData.value = [
  { nombre: "Ingresos", monto: Ingresos },
  { nombre: "Costo de ventas", monto: Costoventa },
  { nombre: "Utilidad bruta", monto: utilidadBruta },
  { nombre: "Gastos de venta", monto: GastoVenta },
  { nombre: "Gastos de administración", monto: GastoAdmi },
  { nombre: "Otros gastos, neto", monto: Otrogasto },
  { nombre: "Utilidad de operación", monto: utilidadOperativa },
  { nombre: "Ingresos financieros", monto: IngresoFin },
  { nombre: "Gastos financieros", monto: GastoFin },
  { nombre: "Pérdida cambiaria, neta", monto: PerdidaCamb },
  { nombre: "Resultado financiero, neto", monto: resultadoFinanciero },
  { nombre: "Participación en resultados de asociados", monto: PartenResul },
  { nombre: "Utilidad antes de impuestos", monto: utilidadAntesDeImpuestos },
  { nombre: "Impuestos a la utilidad", monto: ImpuestosUT },
  { nombre: "Utilidad neta consolidada", monto: utilidadNeta },
];
 
};



// Cargar datos iniciales al montar el componente
onMounted(loadData);

// Función para abrir el diálogo de impresión
const generatePDF = () => {
  window.print();
};
watch(
  [selectedYear, selectedYear2],
  () => {
    loadData();
  },
  { immediate: true }
);
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
.AnioPicker {
  width: 40%;
  margin: 0 auto;
  margin-top: 2%;
}
</style>
