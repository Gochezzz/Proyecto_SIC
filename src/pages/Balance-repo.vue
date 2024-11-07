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
        Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos
        mexicanos
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
import { ref, onMounted, watch } from "vue";
import { jsPDF } from "jspdf";
import { cuentasdb, catalogodb } from "../boot/Pouchdb";

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

const activos = ref([]);
const pasivos = ref([]);
const patrimonios = ref([]);

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Cuentas", align: "left", field: "nombre" },
  {
    name: "valor",
    label: selectedYear.value,
    align: "right",
    field: (row) => (row.valor != null ? formatCurrency(row.valor) : "N/A"),
  },
];
//cargar datos
const cargarDatosDesdeDB = async () => {
  try {
    const result = await cuentasdb.allDocs({ include_docs: true });

    // Crear objetos para almacenar los totales de cada cuenta
    const activosData = {};
    const pasivosData = {};
    const patrimoniosData = {};

    result.rows.forEach(({ doc }) => {
      const tipo = doc.tipo; // Tipo de cuenta: Activo, Pasivo, Patrimonio
      const nombre = doc.nombrec;
      const monto = parseFloat(doc.monto); // Asegúrate de que el monto sea un número
      const fecha = doc.fecha;

      // Extraer el año de la fecha del documento
      const anio = new Date(fecha).getFullYear();

      // Filtrar por el año seleccionado
      if (anio === selectedYear.value) {
        // Agrupar y sumar los valores para Activos
        if (tipo === "Activo") {
          if (!activosData[nombre]) {
            activosData[nombre] = 0;
          }
          activosData[nombre] += monto; // Sumar el valor numérico
        }
        // Agrupar y sumar los valores para Pasivos
        else if (tipo === "Pasivo") {
          if (!pasivosData[nombre]) {
            pasivosData[nombre] = 0;
          }
          pasivosData[nombre] += monto; // Sumar el valor numérico
        }
        // Agrupar y sumar los valores para Patrimonio
        else if (tipo === "Patrimonio") {
          if (!patrimoniosData[nombre]) {
            patrimoniosData[nombre] = 0;
          }
          patrimoniosData[nombre] += monto; // Sumar el valor numérico
        }
      }
    });

    // Convertir los objetos en arrays para que sean compatibles con la tabla
    activos.value = [
      {
        nombre: "Total Activos",
        valor: Object.values(activosData).reduce((a, b) => a + b, 0),
      },
      ...Object.keys(activosData).map((nombre) => ({
        nombre,
        valor: activosData[nombre],
      })),
    ];

    pasivos.value = [
      {
        nombre: "Total Pasivos",
        valor: Object.values(pasivosData).reduce((a, b) => a + b, 0),
      },
      ...Object.keys(pasivosData).map((nombre) => ({
        nombre,
        valor: pasivosData[nombre],
      })),
    ];

    patrimonios.value = [
      {
        nombre: "Total Patrimonios",
        valor: Object.values(patrimoniosData).reduce((a, b) => a + b, 0),
      },
      ...Object.keys(patrimoniosData).map((nombre) => ({
        nombre,
        valor: patrimoniosData[nombre],
      })),
    ];
  } catch (error) {
    console.error("Error al cargar datos desde la base de datos:", error);
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
