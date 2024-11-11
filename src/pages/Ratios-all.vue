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
        <q-card-section>
            <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">Rázones Financieras</h3>
        </q-card-section>
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
  import { cuentasER, cuentasBG } from "../boot/Pouchdb"; // Usamos la base de datos cuentasER
  
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
    { name: "nombre", label: "Ratios", align: "left", field: "nombre" },
    { name: "monto", label: "Año " + (selectedYear.value != null ? selectedYear.value : ""), align: "right", field: row=> row.monto !== ""? formatCurrency(row.monto): "" },
  ]);
  
// Formato de moneda sin signo de dólar
const formatCurrency = value => {
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Cargar datos desde las bases de datos (cuentasER y cuentasBG)
const loadData = async () => {
  try {
    // Cargar datos de cuentasER
    const cuentasERDocs = await cuentasER.allDocs({ include_docs: true });
    const cuentasERData = cuentasERDocs.rows.map(row => row.doc);

    // Cargar datos de cuentasBG
    const cuentasBGDocs = await cuentasBG.allDocs({ include_docs: true });
    const cuentasBGData = cuentasBGDocs.rows.map(row => row.doc);

    // Combinar datos de ambas bases de datos
    data.value = [...cuentasERData, ...cuentasBGData];

    // Filtrar y procesar datos para el año seleccionado
    filterDataByYear();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
};
const annualValues = {
  2019: {
    Interes: 2142510,
    PagosArrendamiento: 596548,
    PagosdeCapital: 5932208,
    dividendosdeaccionespreferentes: 2342418
  },
  2020: {
    Interes: 2441088,
    PagosArrendamiento: 708953,
    PagosdeCapital: 13495587,
    dividendosdeaccionespreferentes: 0
  },
  2021: {
    Interes: 2146663,
    PagosArrendamiento: 746637,
    PagosdeCapital: 807675,
    dividendosdeaccionespreferentes: 3041260
  },
  2022: {
    Interes: 2220814,
    PagosArrendamiento: 732365,
    PagosdeCapital: 741059,
    dividendosdeaccionespreferentes: 3049740
  },
  2023: {
    Interes: 2269165,
    PagosArrendamiento: 719791,
    PagosdeCapital: 9165877,
    dividendosdeaccionespreferentes: 1363238
  }
};
  
  // Filtrar y procesar los datos según el año seleccionado
  const filterDataByYear = () => {
    // Filtrar los datos por el año seleccionado
    const filteredData = data.value.filter(
      item => new Date(item.fecha).getFullYear() === selectedYear.value
    );
    //liquidez
    let ActivoCorriente = 0;
    let PasivoCorriente = 0;
    let Inventarios = 0;
    //Actividad
    //-inventarios
    let CuentasPC = 0;
    let Ventas = 0;
    let CuentasPP = 0;
    let ActivoTotal = 0;
    //Deuda
    let PasivoTotal = 0;
    //-actitotal
    let CapitalenAcCo = 0;
    //-UAII
    const yearData = annualValues[selectedYear.value] || {};
    let Interes = yearData.Interes || 0;
    let PagosArrendamiento = yearData.PagosArrendamiento || 0;
    let PagosdeCapital = yearData.PagosdeCapital || 0;
    let dividendosdeaccionespreferentes = yearData.dividendosdeaccionespreferentes || 0;
    //Rendimiento
    //utilidades
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
      }else if (item.tipo === "Activo") {
        if (item.subtipo === "Corriente") {
        ActivoCorriente += item.monto;
        ActivoTotal += item.monto;
        if (item.nombre === "Inventarios"){
        Inventarios += item.monto;
        }else if (item.nombre === "Clientes y otras cuentas por cobrar, neto"){
        CuentasPC += item.monto;
        }
        } else if (item.subtipo === "No Corriente") {
        ActivoTotal += item.monto;
        }
      } else if (item.tipo === "Pasivo") {
        if (item.subtipo === "Corriente") {
        PasivoCorriente += item.monto;
        PasivoTotal += item.monto;
        if (item.nombre === "Proveedores y otras cuentas por pagar"){
        CuentasPP += item.monto;
        }
        } else if (item.subtipo === "No Corriente") {
        PasivoTotal += item.monto;
        }
      } else if (item.tipo === "Capital") {
         CapitalenAcCo += item.monto;
      }
    });

  // Calcula los resultados financieros correctamente ahora que las variables están separadas
  
  // Calcula la utilidad neta y otros totales
  const utilidadBruta = Ingresos + Costoventa;
  const utilidadOperativa = utilidadBruta + (GastoVenta + Otrogasto + GastoAdmi);
  const resultadoFinanciero = IngresoFin + GastoFin + PerdidaCamb;
  const utilidadAntesDeImpuestos = utilidadOperativa + resultadoFinanciero + PartenResul;
  const utilidadNeta = utilidadAntesDeImpuestos + ImpuestosUT;
  Ventas = Ingresos;
  // Crear los datos para la tabla
  tableData.value = [
    { nombre: "Ratios de Liquidez", monto: "" },
    { nombre: "Capital de Trabajo", monto: (ActivoCorriente - PasivoCorriente) },
    { nombre: "Razón Corriente", monto: (ActivoCorriente/PasivoCorriente) },
    { nombre: "Razón Rápida", monto: ((ActivoCorriente - Inventarios)/PasivoCorriente) },
    { nombre: "Ratios de Actividad", monto: "" },
    { nombre: "Rotacion de Inventario", monto: Math.abs(Costoventa/Inventarios) },
    { nombre: "PPC", monto: ((CuentasPC)/(Ventas/365)) },
    { nombre: "PPP", monto: (Math.abs((CuentasPP)/((0.7*(Costoventa))/365))) },
    { nombre: "Rotacion de Activos Totales", monto: (Ventas/ActivoTotal) },
    { nombre: "Ratios de Deuda", monto: "" },
    { nombre: "Razón de Endeudamiento", monto: (PasivoTotal/ActivoTotal) },
    { nombre: "Razón Deuda-Capital ", monto: (PasivoTotal/CapitalenAcCo) },
    { nombre: "Razón de Cargos de Interes Fijo", monto: (utilidadAntesDeImpuestos/Interes) },
    { nombre: "Razón de Cobertura de Pagos fijos", monto: ((utilidadAntesDeImpuestos+PagosArrendamiento)/(Interes+PagosArrendamiento+((PagosdeCapital+dividendosdeaccionespreferentes)*(1/(1-0.3))))) },
    { nombre: "Ratios de Rendimiento", monto: "" },
    { nombre: "Margen de Utilidad Bruta", monto: (utilidadBruta/Ventas)},
    { nombre: "Margen de Utilidad Operativa", monto: (utilidadOperativa/Ventas) },
    { nombre: "Margen de Utilidad Neta", monto: (utilidadNeta/Ventas) },
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
  