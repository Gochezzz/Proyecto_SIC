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
    <q-card class="principalCard print-section" style="margin-bottom: 30px;">
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
import { ref, onMounted, computed } from "vue";
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
const columns = computed(() => [
  { name: "nombre", label: "Cuenta", align: "left", field: "nombre" },
  { name: "monto", label: "Año " + (selectedYear.value != null ? selectedYear.value : ""), align: "right", field: row => formatCurrency(row.monto) },
]);

// Formato de moneda
const formatCurrency = value => {
  return new Intl.NumberFormat("es-MX", {
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
