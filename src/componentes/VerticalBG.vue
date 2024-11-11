<template>
      <!-- Card principal -->
      <q-card class="principalCard" style="margin-bottom: 30px;">
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
          Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos
          mexicanos
        </h6>
  
        <!-- Tablas para Activos, Pasivos y Patrimonio -->
        <q-card-section class="tablasBG">
          <h5 style="margin-left: 1%; margin-top: 1%; margin-bottom: 1%">
            Activos
          </h5>
          <q-table
            :rows="activosCorrientes"
            :columns="columnsAC"
            flat
            dense
            :pagination="{ rowsPerPage: 0 }"
            :rows-per-page-options="[]"
            hide-bottom
          />
          <q-table
            :rows="activosNCorrientes"
            :columns="columnsANC"
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
            :rows="pasivosCorrientes"
            :columns="columnsPC"
            flat
            dense
            :pagination="{ rowsPerPage: 0 }"
            :rows-per-page-options="[]"
            hide-bottom
            class="letraT"
          />
          <q-table
            :rows="pasivosNCorrientes"
            :columns="columnsPNC"
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
            :columns="columnsP"
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
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted, watch, computed } from "vue";
  import { cuentasBG, catalogoBG } from "../boot/Pouchdb";
  
  const router = useRouter();
  
  const regresar = () => {
    router.push("/reportes");
  };
  
  const selectedYear = ref();
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  // Métodos para manejar el clic en los botones
  const analisisBalanceGeneral = () => {
    mostrarBG.value = true;
    mostrarER.value = false;
  };
  
  const analisisEstadoResultados = () => {
    mostrarER.value = true;
    mostrarBG.value = false;
  };
  const activosCorrientes = ref([]);
  const activosNCorrientes = ref([]);
  const pasivosCorrientes = ref([]);
  const pasivosNCorrientes = ref([]);
  const patrimonios = ref([]);
  
  // Computed para las columnas de activos corrientes
  const columnsAC = computed(() => [
    {
      name: "nombre",
      label: "Activo Corriente",
      align: "left",
      field: "nombre",
      style: "width:300px",
    },
    {
      name: "valor",
      label:
        "Año " + (selectedYear.value != null ? selectedYear.value : ""), // Año seleccionado dinámicamente
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
      style: "width:125px",
    },
    {
      name: "valor2",
      label: "Porcentaje", // Año 2 seleccionado dinámicamente
      align: "right",
      field: (row) =>
        row.vRelativa != null ? formatCurrency2(row.vRelativa) : "N/A",
      style: "width:125px",
    },
  ]);
  const columnsANC = [
    {
      name: "nombre",
      label: "Activo No Corriente",
      align: "left",
      field: "nombre",
      style: "width:300px",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
      style: "width:125px",
    },
    {
      name: "valor2",
      label: "", // Año 2 seleccionado dinámicamente
      align: "right",
      field: (row) =>
        row.vRelativa != null ? formatCurrency2(row.vRelativa) : "N/A",
      style: "width:125px",
    },
  ];
  const columnsPC = [
    {
      name: "nombre",
      label: "Pasivo Corriente",
      align: "left",
      field: "nombre",
      style: "width:300px",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
      style: "width:125px",
    },
    {
      name: "valor2",
      label: "", // Año 2 seleccionado dinámicamente
      align: "right",
      field: (row) =>
        row.vRelativa != null ? formatCurrency2(row.vRelativa) : "N/A",
      style: "width:125px",
    },
  ];
  const columnsPNC = [
    {
      name: "nombre",
      label: "Pasivo No Corriente",
      align: "left",
      field: "nombre",
      style: "width:300px",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
      style: "width:125px",
    },
    {
      name: "valor2",
      label: "", // Año 2 seleccionado dinámicamente
      align: "right",
      field: (row) =>
        row.vRelativa != null ? formatCurrency2(row.vRelativa) : "N/A",
      style: "width:125px",
    },
  ];
  const columnsP = [
    {
      name: "nombre",
      label: "Capital Contable",
      align: "left",
      field: "nombre",
      style: "width:300px",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
      style: "width:125px",
    },
    {
      name: "valor2",
      label: "", // Año 2 seleccionado dinámicamente
      align: "right",
      field: (row) =>
        row.vRelativa != null ? formatCurrency2(row.vRelativa) : "N/A",
      style: "width:125px",
    },
  ];
  //cargar datos
  // Cargar los datos desde la base de datos y agrupar por subtipo
  // Método para cargar los datos desde la base de datos
  const cargarDatosDesdeDB = async () => {
    try {
      const cuentas = await cuentasBG.allDocs({ include_docs: true });
      console.log(cuentas);
  
      // Inicializar objetos intermedios para acumular montos por año
      let activosCorrientesMap = {};
      let activosNCorrientesMap = {};
      let pasivosCorrientesMap = {};
      let pasivosNCorrientesMap = {};
      let patrimoniosMap = {};
      let totalActivo = 0;
      // Recorrer las cuentas y organizarlas por año
      cuentas.rows.forEach((row) => {
        const cuenta = row.doc;
  
        // Verifica si la propiedad 'fecha' existe en el objeto 'cuenta'
        if (!cuenta.fecha) {
          console.warn("No se encuentra la fecha para la cuenta:", cuenta);
          return; // Si no tiene fecha, se salta esta cuenta
        }
  
        const fecha = cuenta.fecha; // Extrae la fecha de la cuenta
        const anio = new Date(fecha).getFullYear(); // Extrae el año de la fecha
  
        // Filtrar por el año seleccionado
        if (anio === selectedYear.value) {
          if (cuenta.tipo === "Activo" && cuenta.subtipo === "Corriente") {
            if (!activosCorrientesMap[cuenta.nombre]) {
              activosCorrientesMap[cuenta.nombre] = 0;
            }
            activosCorrientesMap[cuenta.nombre] += parseFloat(cuenta.monto) || 0;
            totalActivo += parseFloat(cuenta.monto) || 0;
          }
          if (cuenta.tipo === "Activo" && cuenta.subtipo === "No Corriente") {
            if (!activosNCorrientesMap[cuenta.nombre]) {
              activosNCorrientesMap[cuenta.nombre] = 0;
            }
            activosNCorrientesMap[cuenta.nombre] += parseFloat(cuenta.monto) || 0;
            totalActivo += parseFloat(cuenta.monto) || 0;
          }
          if (cuenta.tipo === "Pasivo" && cuenta.subtipo === "Corriente") {
            if (!pasivosCorrientesMap[cuenta.nombre]) {
              pasivosCorrientesMap[cuenta.nombre] = 0;
            }
            pasivosCorrientesMap[cuenta.nombre] += parseFloat(cuenta.monto) || 0;
          }
          if (cuenta.tipo === "Pasivo" && cuenta.subtipo === "No Corriente") {
            if (!pasivosNCorrientesMap[cuenta.nombre]) {
              pasivosNCorrientesMap[cuenta.nombre] = 0;
            }
            pasivosNCorrientesMap[cuenta.nombre] += parseFloat(cuenta.monto) || 0;
          }
          if (cuenta.tipo === "Capital") {
            if (!patrimoniosMap[cuenta.nombre]) {
              patrimoniosMap[cuenta.nombre] = 0;
            }
            patrimoniosMap[cuenta.nombre] += parseFloat(cuenta.monto) || 0;
          }
        }
      });
  
      // Combina los datos de ambos años para cada cuenta
      activosCorrientes.value = Object.entries(activosCorrientesMap).map(
        ([nombre, valor]) => {
          return {
            nombre,
            valor,
            vRelativa: totalActivo !== 0 ? (valor / totalActivo) * 100 : 0 
          };
        }
      );
      activosNCorrientes.value = Object.entries(activosNCorrientesMap).map(
        ([nombre, valor]) => {
          return {
            nombre,
            valor,
            vRelativa: totalActivo !== 0 ? (valor / totalActivo) * 100 : 0 
          };
        }
      );
      pasivosCorrientes.value = Object.entries(pasivosCorrientesMap).map(
        ([nombre, valor]) => {
          return {
            nombre,
            valor,
            vRelativa: totalActivo !== 0 ? (valor / totalActivo) * 100 : 0 
          };
        }
      );
      pasivosNCorrientes.value = Object.entries(pasivosNCorrientesMap).map(
        ([nombre, valor]) => {
          return {
            nombre,
            valor,
            vRelativa: totalActivo !== 0 ? (valor / totalActivo) * 100 : 0 
          };
        }
      );
      patrimonios.value = Object.entries(patrimoniosMap).map(
        ([nombre, valor]) => {
          return {
            nombre,
            valor,
            vRelativa: totalActivo !== 0 ? (valor / totalActivo) * 100 : 0 
          };
        }
      );
      // Calcular y añadir los totales
      const sumarValores = (map) =>
        Object.values(map).reduce((acc, valor) => acc + valor, 0);
  
      activosCorrientes.value.push({
        nombre: "Total Activos Corrientes",
        valor: sumarValores(activosCorrientesMap),
        vRelativa: totalActivo !== 0 ? (sumarValores(activosCorrientesMap) / totalActivo) * 100 : 0 
      });
      activosNCorrientes.value.push({
        nombre: "Total Activos No Corrientes",
        valor: sumarValores(activosNCorrientesMap),
        vRelativa: totalActivo !== 0 ? (sumarValores(activosNCorrientesMap) / totalActivo) * 100 : 0 
      });
      activosNCorrientes.value.push({
        nombre: "Total Activos",
        valor:
          sumarValores(activosNCorrientesMap) +
          sumarValores(activosCorrientesMap),
        vRelativa: totalActivo !== 0 ? ((sumarValores(activosNCorrientesMap) +
        sumarValores(activosCorrientesMap)) / totalActivo) * 100 : 0 
      });
      pasivosCorrientes.value.push({
        nombre: "Total Pasivos Corrientes",
        valor: sumarValores(pasivosCorrientesMap),
        vRelativa: totalActivo !== 0 ? (sumarValores(pasivosCorrientesMap) / totalActivo) * 100 : 0  
      });
      pasivosNCorrientes.value.push({
        nombre: "Total Pasivos No Corrientes",
        valor: sumarValores(pasivosNCorrientesMap),
        vRelativa: totalActivo !== 0 ? (sumarValores(pasivosNCorrientesMap) / totalActivo) * 100 : 0  
      });
      pasivosNCorrientes.value.push({
        nombre: "Total Pasivos",
        valor:
          sumarValores(pasivosNCorrientesMap) +
          sumarValores(pasivosCorrientesMap),
        vRelativa: totalActivo !== 0 ? ((sumarValores(pasivosNCorrientesMap) +
        sumarValores(pasivosCorrientesMap)) / totalActivo) * 100 : 0  
      });
      patrimonios.value.push({
        nombre: "Total Capital Contable",
        valor: sumarValores(patrimoniosMap),
        vRelativa: totalActivo !== 0 ? (sumarValores(patrimoniosMap) / totalActivo) * 100 : 0  
      });
      patrimonios.value.push({
        nombre: "Total Pasivo y Capital Contable",
        valor:
          sumarValores(pasivosCorrientesMap) +
          sumarValores(pasivosNCorrientesMap) +
          sumarValores(patrimoniosMap),
          vRelativa: totalActivo !== 0 ? (( sumarValores(pasivosCorrientesMap) +
          sumarValores(pasivosNCorrientesMap) +
          sumarValores(patrimoniosMap)) / totalActivo) * 100 : 0  
      });
    } catch (error) {
      console.error("Error al cargar los datos desde la base de datos:", error);
    }
  };
  // Formato de moneda
  const formatCurrency = (value) => {
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
  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatosDesdeDB();
  });
  watch(
    [selectedYear],
    () => {
      cargarDatosDesdeDB();
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
  .center-container {
    display: flex; /* Activa Flexbox */
    justify-content: center; /* Centra los botones horizontalmente */
    gap: 10px; /* Espaciado entre los botones */
    margin-top: 3%;
  }
  </style>
  