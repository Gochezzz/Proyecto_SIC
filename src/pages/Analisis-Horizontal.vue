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
          Analisis Horizontal
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
            label="Seleccione el Año1"
            class="AnioPicker"
            outlined
            dense
          />
          <q-select
            v-model="selectedYear"
            :options="years"
            label="Seleccione el Año2"
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
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import { ref, onMounted, watch } from "vue";
  import { jsPDF } from "jspdf";
  import { cuentasBG, catalogoBG } from "../boot/Pouchdb";
  
  const router = useRouter();
  
  const regresar = () => {
    router.push("/reportes");
  };
  
  // Variables reactivas
  const selectedYear = ref(2024);
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  
  const activosCorrientes = ref([]);
  const activosNCorrientes = ref([]);
  const pasivosCorrientes = ref([]);
  const pasivosNCorrientes = ref([]);
  const patrimonios = ref([]);
  
  // Columnas de la tabla
  const columnsAC = [
    { name: "nombre", label: "Activo Corriente", align: "left", field: "nombre" },
    {
      name: "valor",
      label: "Año",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "Año",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "Variacion Absoluta",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "Variacion Relativa",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
  ];
  const columnsANC = [
    {
      name: "nombre",
      label: "Activo No Corriente",
      align: "left",
      field: "nombre",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "                  ",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "                  ",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
  ];
  const columnsPC = [
    {
      name: "nombre",
      label: "Pasivo Corriente",
      align: "left",
      field: "nombre",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
  ];
  const columnsPNC = [
    {
      name: "nombre",
      label: "Pasivo No Corriente",
      align: "left",
      field: "nombre",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
  ];
  const columnsP = [
    {
      name: "nombre",
      label: "Capital Contable",
      align: "left",
      field: "nombre",
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
    {
      name: "valor",
      label: "",
      align: "right",
      field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
    },
  ];
  //cargar datos
  // Cargar los datos desde la base de datos y agrupar por subtipo
  // Método para cargar los datos desde la base de datos
  const cargarDatosDesdeDB = async () => {
    try {
      const cuentas = await cuentasBG.allDocs({ include_docs: true });
      console.log(cuentas);
  
      // Inicializar objetos intermedios para acumular montos
      let activosCorrientesMap = {};
      let activosNCorrientesMap = {};
      let pasivosCorrientesMap = {};
      let pasivosNCorrientesMap = {};
      let patrimoniosMap = {};
  
      cuentas.rows.forEach((row) => {
        const cuenta = row.doc;
  
        if (cuenta.tipo === "Activo") {
          if (cuenta.subtipo === "Corriente") {
            if (!activosCorrientesMap[cuenta.nombrec]) {
              activosCorrientesMap[cuenta.nombrec] = 0;
            }
            activosCorrientesMap[cuenta.nombrec] += parseFloat(cuenta.monto) || 0;
          } else if (cuenta.subtipo === "No Corriente") {
            if (!activosNCorrientesMap[cuenta.nombrec]) {
              activosNCorrientesMap[cuenta.nombrec] = 0;
            }
            activosNCorrientesMap[cuenta.nombrec] +=
              parseFloat(cuenta.monto) || 0;
          }
        } else if (cuenta.tipo === "Pasivo") {
          if (cuenta.subtipo === "Corriente") {
            if (!pasivosCorrientesMap[cuenta.nombrec]) {
              pasivosCorrientesMap[cuenta.nombrec] = 0;
            }
            pasivosCorrientesMap[cuenta.nombrec] += parseFloat(cuenta.monto) || 0;
          } else if (cuenta.subtipo === "No Corriente") {
            if (!pasivosNCorrientesMap[cuenta.nombrec]) {
              pasivosNCorrientesMap[cuenta.nombrec] = 0;
            }
            pasivosNCorrientesMap[cuenta.nombrec] +=
              parseFloat(cuenta.monto) || 0;
          }
        } else if (cuenta.tipo === "Patrimonio") {
          if (!patrimoniosMap[cuenta.nombrec]) {
            patrimoniosMap[cuenta.nombrec] = 0;
          }
          patrimoniosMap[cuenta.nombrec] += parseFloat(cuenta.monto) || 0;
        }
      });
  
      // Convertir los objetos en arrays para las tablas
      activosCorrientes.value = Object.entries(activosCorrientesMap).map(
        ([nombre, valor]) => ({
          nombre,
          valor,
        })
      );
      activosNCorrientes.value = Object.entries(activosNCorrientesMap).map(
        ([nombre, valor]) => ({
          nombre,
          valor,
        })
      );
      pasivosCorrientes.value = Object.entries(pasivosCorrientesMap).map(
        ([nombre, valor]) => ({
          nombre,
          valor,
        })
      );
      pasivosNCorrientes.value = Object.entries(pasivosNCorrientesMap).map(
        ([nombre, valor]) => ({
          nombre,
          valor,
        })
      );
      patrimonios.value = Object.entries(patrimoniosMap).map(
        ([nombre, valor]) => ({
          nombre,
          valor,
        })
      );
  
      // Calcular y añadir los totales
      const sumarValores = (map) =>
        Object.values(map).reduce((acc, valor) => acc + valor, 0);
  
      activosCorrientes.value.push({
        nombre: "Total Activos Corrientes",
        valor: sumarValores(activosCorrientesMap),
      });
      activosNCorrientes.value.push({
        nombre: "Total Activos No Corrientes",
        valor: sumarValores(activosNCorrientesMap),
      });
      activosNCorrientes.value.push({
        nombre: "Total Activos",
        valor:
          sumarValores(activosNCorrientesMap) +
          sumarValores(activosCorrientesMap),
      });
      pasivosCorrientes.value.push({
        nombre: "Total Pasivos Corrientes",
        valor: sumarValores(pasivosCorrientesMap),
      });
      pasivosNCorrientes.value.push({
        nombre: "Total Pasivos No Corrientes",
        valor: sumarValores(pasivosNCorrientesMap),
      });
      pasivosNCorrientes.value.push({
        nombre: "Total Pasivos",
        valor:
          sumarValores(pasivosNCorrientesMap) +
          sumarValores(pasivosCorrientesMap),
      });
      patrimonios.value.push({
        nombre: "Total Capital Contable",
        valor: sumarValores(patrimoniosMap),
      });
      patrimonios.value.push({
        nombre: "Total Pasivo y Capital Contable",
        valor:
          sumarValores(pasivosCorrientesMap) +
          sumarValores(pasivosNCorrientesMap) +
          sumarValores(patrimoniosMap),
      });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };
  
  // Método para generar PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Balance General - Año ${selectedYear.value}`, 10, 10);
  
    // Variables para controlar la posición vertical en el PDF
    let yPosition = 20;
  
    // Activos
    doc.text("Activos:", 10, yPosition);
    yPosition += 10;
    activos.value.forEach((activo) => {
      doc.text(
        `${activo.nombre}: ${formatCurrency(activo.valor)}`,
        10,
        yPosition
      );
      yPosition += 10;
    });
  
    // Espacio entre secciones
    yPosition += 10;
  
    // Pasivos
    doc.text("Pasivos:", 10, yPosition);
    yPosition += 10;
    pasivos.value.forEach((pasivo) => {
      doc.text(
        `${pasivo.nombre}: ${formatCurrency(pasivo.valor)}`,
        10,
        yPosition
      );
      yPosition += 10;
    });
  
    // Espacio entre secciones
    yPosition += 10;
  
    // Patrimonio
    doc.text("Patrimonio:", 10, yPosition);
    yPosition += 10;
    patrimonios.value.forEach((patrimonio) => {
      doc.text(
        `${patrimonio.nombre}: ${formatCurrency(patrimonio.valor)}`,
        10,
        yPosition
      );
      yPosition += 10;
    });
  
    // Guardar PDF
    doc.save(`Balance_General_${selectedYear.value}.pdf`);
  };
  
  // Formato de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };
  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatosDesdeDB();
  });
  watch(selectedYear, () => {
    cargarDatosDesdeDB();
  });
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
  