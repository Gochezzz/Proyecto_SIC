<template>
  <div>
    <!-- Barra de herramientas -->
    <q-toolbar
      style="display: inline-flex; align-items: center; justify-content: center; background-color: #cee5ef;"
    >
      <q-icon
        class="change-color"
        name="arrow_circle_left"
        style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0b3668;"
        @click="regresar"
      />
      <q-label
        style="font-size: 40px; color: #0b3668; text-align: left; margin-left: 5px;"
      >
        Regresar
      </q-label>
      <q-toolbar-title class="tituloBG" style="font-size: 40px">
        Balance General
      </q-toolbar-title>
      <q-icon
        name="account_circle"
        style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0b3668;"
      />
    </q-toolbar>

    <!-- Selector de Año y Botón PDF en la misma fila -->
    <q-card class="principalCard">
      <q-card-section>
        <div style="display: flex; align-items: center; justify-content: center;">
          <q-select
            v-model="selectedYear"
            :options="years"
            label="Seleccione el Año"
            class="AnioPicker"
            outlined
            dense
            style="flex-grow: 1; margin-right: 10px;"
          />
          <q-btn
            color="primary"
            label="Generar PDF"
            @click="generatePDF"
            icon="picture_as_pdf"
            style="flex-shrink: 0;"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Contenido de Sigma Alimentos (incluye tablas y datos) -->
    <q-card class="principalCard print-section" style="margin-bottom: 30px;">
      <h5 style="margin-left: 5%; margin-bottom: 0%">
        Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa,
        S.A.B. de C.V.)
      </h5>
      <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
        Estados Consolidados de Situacion Financiera
      </h3>
      <h6 style="margin-left: 5%; margin-top: 2%">
        Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos mexicanos
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
    </q-card>
  </div>
</template>

<script setup>

import { useRouter } from "vue-router";
import { ref, onMounted, watch, computed } from "vue";
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
const columnsAC = computed(() => [
  { name: "nombre", label: "Activo Corriente", align: "left", field: "nombre" },
  {
    name: "valor",
    label: "Año " + (selectedYear.value != null ? selectedYear.value : ""),
    align: "right",
    field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
  },
]);
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

      // Verifica si la propiedad 'fecha' existe en el objeto 'cuenta'
      if (!cuenta.fecha) {
        console.warn("No se encuentra la fecha para la cuenta:", cuenta);
        return; // Si no tiene fecha, se salta esta cuenta
      }

      const fecha = cuenta.fecha; // Deberías estar extrayendo la fecha de 'cuenta'
      console.log("Fecha de la cuenta:", fecha); // Para verificar la fecha

      const anio = new Date(fecha).getFullYear();
      console.log("Año de la cuenta:", anio); // Verificar el año extraído

      // Filtrar por el año seleccionado
      if (anio === selectedYear.value) {
        if (cuenta.tipo === "Activo") {
          if (cuenta.subtipo === "Corriente") {
            if (!activosCorrientesMap[cuenta.nombre]) {
              activosCorrientesMap[cuenta.nombre] = 0;
            }
            activosCorrientesMap[cuenta.nombre] +=
              parseFloat(cuenta.monto) || 0;
          } else if (cuenta.subtipo === "No Corriente") {
            if (!activosNCorrientesMap[cuenta.nombre]) {
              activosNCorrientesMap[cuenta.nombre] = 0;
            }
            activosNCorrientesMap[cuenta.nombre] +=
              parseFloat(cuenta.monto) || 0;
          }
        } else if (cuenta.tipo === "Pasivo") {
          if (cuenta.subtipo === "Corriente") {
            if (!pasivosCorrientesMap[cuenta.nombre]) {
              pasivosCorrientesMap[cuenta.nombre] = 0;
            }
            pasivosCorrientesMap[cuenta.nombre] +=
              parseFloat(cuenta.monto) || 0;
          } else if (cuenta.subtipo === "No Corriente") {
            if (!pasivosNCorrientesMap[cuenta.nombre]) {
              pasivosNCorrientesMap[cuenta.nombre] = 0;
            }
            pasivosNCorrientesMap[cuenta.nombre] +=
              parseFloat(cuenta.monto) || 0;
          }
        } else if (cuenta.tipo === "Capital") {
          if (!patrimoniosMap[cuenta.nombre]) {
            patrimoniosMap[cuenta.nombre] = 0;
          }
          patrimoniosMap[cuenta.nombre] += parseFloat(cuenta.monto) || 0;
        }
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

// Función para generar el PDF
const generatePDF = () => {
  window.print();
};
</script>

<style scoped>
/* Mantén los estilos existentes o ajusta según sea necesario */
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
