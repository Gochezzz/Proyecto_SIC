<template>
  <div>
    <!-- Card principal con la tabla de resultados -->
    <q-card class="principalCard print-section" style="margin-bottom: 30px;">
      <!-- Selector de Año y Botón PDF -->
      <q-card-section>
        <q-select
          v-model="selectedYear"
          :options="years"
          label="Seleccione el Año Actual"
          class="AnioPicker no-print"
          outlined
          dense
        />
        <q-select
          v-model="selectedYear2"
          :options="years"
          label="Seleccione el Año Anterior"
          class="AnioPicker no-print"
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
import { ref, onMounted, watch, computed} from "vue";
import { cuentasER } from "../boot/Pouchdb"; // Usamos la base de datos cuentasER

// Variables reactivas
const selectedYear = ref(new Date().getFullYear());
const selectedYear2 = ref(new Date().getFullYear());
const years = [2023, 2022, 2021, 2020, 2019];

const data = ref([]); // Contendrá todos los datos del estado de resultados
const tableData = ref([]); // Contendrá los datos filtrados y calculados

// Columnas de la tabla
const columns = computed(() => [
  { name: "nombre", label: "Descripción", align: "left", field: "nombre" , style:"width:150px"},
  { name: "monto", label: "Año " + (selectedYear.value != null ? selectedYear.value : "Actual"), align: "right", field: row => formatCurrency(row.monto), style:"width:50px" },
  { name: "monto", label: "Año " + (selectedYear2.value != null ? selectedYear2.value : "Anterior"), align: "right", field: row => formatCurrency(row.monto2) ,style:"width:50px"},
  { name: "monto", label: "Variacion Absoluta", align: "right", field:(row) => row.vabsoluta != null ? formatCurrency(row.vabsoluta) : "N/A", style:"width:50px"},
  { name: "monto", label: "Variacion Relativa", align: "center", field:(row) => row.vrelativa != null ? formatCurrency2(row.vrelativa) : "N/A", style:"width:50px"},
]);

// Formato de moneda
const formatCurrency = value => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
};
const formatCurrency2 = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: 2, // Puedes ajustar las fracciones si es necesario
  }).format(value / 100); // Asegúrate de dividir entre 100 si el valor es 20 para obtener el 20%
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
  const filteredData2 = data.value.filter(
    item => new Date(item.fecha).getFullYear() === selectedYear2.value
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

  let Ingresos2 = 0;
  let Costoventa2 = 0;
  let GastoVenta2 = 0;
  let GastoAdmi2 = 0;
  let Otrogasto2 = 0;
  let IngresoFin2 = 0;
  let GastoFin2 = 0;
  let PerdidaCamb2 = 0;
  let PartenResul2 = 0;
  let ImpuestosUT2 = 0;
  let PormedioAc2 = 0;

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
  filteredData2.forEach(item => {
    if (item.nombre === "Ingresos") {
      Ingresos2 += item.monto;
    } else if (item.nombre === "Costo de ventas") {
      Costoventa2+= item.monto;
    } else if (item.nombre === "Gastos de venta") {
      GastoVenta2 += item.monto;
    } else if (item.nombre === "Gastos de administración") {
      GastoAdmi2 += item.monto;
    }else if (item.nombre === "Otros gastos, neto") {
      Otrogasto2 += item.monto;
    } else if (item.nombre === "Ingresos financieros") {
      IngresoFin2 += item.monto;
    } else if (item.nombre === "Gastos financieros") {
      GastoFin2 += item.monto;
    } else if (item.nombre === "Pérdida cambiaria, neta") {
      PerdidaCamb2 += item.monto;
    } else if (item.nombre === "Participación en resultados de asociados") {
      PartenResul2 += item.monto;
    } else if (item.nombre === "Impuestos a la utilidad") {
      ImpuestosUT2 += item.monto;
    } else if (item.nombre === "Promedio ponderado de acciones en circulación") {
      PormedioAc2 += item.monto;
    }
  });

// Calcula los resultados financieros correctamente ahora que las variables están separadas

// Calcula la utilidad neta y otros totales
const utilidadBruta = Ingresos + Costoventa;
const utilidadOperativa = utilidadBruta + (GastoVenta + Otrogasto + GastoAdmi);
const resultadoFinanciero = IngresoFin + GastoFin + PerdidaCamb;
const utilidadAntesDeImpuestos = utilidadOperativa + resultadoFinanciero + PartenResul;
const utilidadNeta = utilidadAntesDeImpuestos + ImpuestosUT;

const utilidadBruta2 = Ingresos2 + Costoventa2;
const utilidadOperativa2 = utilidadBruta2 + (GastoVenta2 + Otrogasto2 + GastoAdmi2);
const resultadoFinanciero2 = IngresoFin2 + GastoFin2 + PerdidaCamb2;
const utilidadAntesDeImpuestos2 = utilidadOperativa2 + resultadoFinanciero2 + PartenResul2;
const utilidadNeta2 = utilidadAntesDeImpuestos2 + ImpuestosUT2;

// Crear los datos para la tabla
tableData.value = [
  {
    nombre: "Ingresos",
    monto: Ingresos,
    monto2: Ingresos2,
    vabsoluta: Ingresos - Ingresos2,
    vrelativa: ((Ingresos / Ingresos2) - 1) * 100
  },
  {
    nombre: "Costo de ventas",
    monto: Costoventa,
    monto2: Costoventa2,
    vabsoluta: Costoventa - Costoventa2,
    vrelativa: ((Costoventa / Costoventa2) - 1) * 100
  },
  {
    nombre: "Utilidad bruta",
    monto: utilidadBruta,
    monto2: utilidadBruta2,
    vabsoluta: utilidadBruta - utilidadBruta2,
    vrelativa: ((utilidadBruta / utilidadBruta2) - 1) * 100
  },
  {
    nombre: "Gastos de venta",
    monto: GastoVenta,
    monto2: GastoVenta2,
    vabsoluta: GastoVenta - GastoVenta2,
    vrelativa: ((GastoVenta / GastoVenta2) - 1) * 100
  },
  {
    nombre: "Gastos de administración",
    monto: GastoAdmi,
    monto2: GastoAdmi2,
    vabsoluta: GastoAdmi - GastoAdmi2,
    vrelativa: ((GastoAdmi / GastoAdmi2) - 1) * 100
  },
  {
    nombre: "Otros gastos, neto",
    monto: Otrogasto,
    monto2: Otrogasto2,
    vabsoluta: Otrogasto - Otrogasto2,
    vrelativa: ((Otrogasto / Otrogasto2) - 1) * 100
  },
  {
    nombre: "Utilidad de operación",
    monto: utilidadOperativa,
    monto2: utilidadOperativa2,
    vabsoluta: utilidadOperativa - utilidadOperativa2,
    vrelativa: ((utilidadOperativa / utilidadOperativa2) - 1) * 100
  },
  {
    nombre: "Ingresos financieros",
    monto: IngresoFin,
    monto2: IngresoFin2,
    vabsoluta: IngresoFin - IngresoFin2,
    vrelativa: ((IngresoFin / IngresoFin2) - 1) * 100
  },
  {
    nombre: "Gastos financieros",
    monto: GastoFin,
    monto2: GastoFin2,
    vabsoluta: GastoFin - GastoFin2,
    vrelativa: ((GastoFin / GastoFin2) - 1) * 100
  },
  {
    nombre: "Pérdida cambiaria, neta",
    monto: PerdidaCamb,
    monto2: PerdidaCamb2,
    vabsoluta: PerdidaCamb - PerdidaCamb2,
    vrelativa: ((PerdidaCamb / PerdidaCamb2) - 1) * 100
  },
  {
    nombre: "Resultado financiero, neto",
    monto: resultadoFinanciero,
    monto2: resultadoFinanciero2,
    vabsoluta: resultadoFinanciero - resultadoFinanciero2,
    vrelativa: ((resultadoFinanciero / resultadoFinanciero2) - 1) * 100
  },
  {
    nombre: "Participación en resultados de asociados",
    monto: PartenResul,
    monto2: PartenResul2,
    vabsoluta: PartenResul - PartenResul2,
    vrelativa: ((PartenResul / PartenResul2) - 1) * 100
  },
  {
    nombre: "Utilidad antes de impuestos",
    monto: utilidadAntesDeImpuestos,
    monto2: utilidadAntesDeImpuestos2,
    vabsoluta: utilidadAntesDeImpuestos - utilidadAntesDeImpuestos2,
    vrelativa: ((utilidadAntesDeImpuestos / utilidadAntesDeImpuestos2) - 1) * 100
  },
  {
    nombre: "Impuestos a la utilidad",
    monto: ImpuestosUT,
    monto2: ImpuestosUT2,
    vabsoluta: ImpuestosUT - ImpuestosUT2,
    vrelativa: ((ImpuestosUT / ImpuestosUT2) - 1) * 100
  },
  {
    nombre: "Utilidad neta consolidada",
    monto: utilidadNeta,
    monto2: utilidadNeta2,
    vabsoluta: utilidadNeta - utilidadNeta2,
    vrelativa: ((utilidadNeta / utilidadNeta2) - 1) * 100
  }
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
  margin: 0 auto;
  margin-top: 2%;
}
.tablasBG {
  margin-left: 1%;
  margin-right: 1%;
  margin-top: 1%;
  margin-bottom: 1%;
}
.generarpdf {
  margin: 0 auto;
  width: 30%;
  margin-top: 2%;
}
.center-container {
  display: flex; /* Activa Flexbox */
  justify-content: center; /* Centra los botones horizontalmente */
  gap: -200px; /* Espaciado entre los botones */
  margin-top: 25%;
}

/* Estilos para impresión */
@media print {
  body * {
    visibility: hidden; /* Ocultar todo por defecto */
  }

  .print-section, .print-section * {
    visibility: visible; /* Hacer visible solo el contenido dentro de .print-section */
    font-family: 'Arial', sans-serif; /* Cambiar la fuente */
    font-size: 17pt; /* Ajustar el tamaño de la fuente */
    color: black; /* Cambiar el color de la fuente */
    text-align: center;
  }

  .no-print {
    display: none; /* No mostrar los elementos con la clase .no-print */
  }

  .print-section {
    position: absolute;
    top: 0; /* Mover la sección a la mitad de la página */
    left: -6%; /* Mover la sección hacia la derecha */
    width: 114%; /* Ajustar el ancho */
    align-items: center;
  }

  /* Si necesitas mover más o menos, ajusta el margen o las propiedades de posicionamiento */
  .print-section p {
    line-height: 1; /* Espaciado entre líneas */
  }
}

.center-container {
  display: flex;
  justify-content: center; /* Centra los botones horizontalmente */
  align-items: center; /* Alinea los botones verticalmente */
  gap: -1px; /* Espacio entre los botones */
}

.button {
  margin: 7%; /* Asegura que no haya márgenes extra en los botones */
}

</style>

