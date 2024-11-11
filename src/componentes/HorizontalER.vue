<template>
  <div>
    <!-- Card principal -->
    <q-card class="principalCard">
      <!-- Selector de Año -->
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
      <h5 style="margin-left: 5%; margin-bottom: 0%">
        Sigma Alimentos S.A. de C.V y Subsidiarias<br />(Subsidiaria de Alfa,
        S.A.B. de C.V.)
      </h5>
      <h3 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
        Estado de Resultados Consolidados
      </h3>
      <h6 style="margin-left: 5%; margin-top: 2%; margin-bottom: 0%">
        Al 31 de diciembre de {{ selectedYear }}<br />En miles de pesos
        mexicanos
      </h6>
      <q-card-section class="tablasBG">
        <q-table
          :rows="ER"
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
import { cuentasER } from "../boot/Pouchdb"; // Importa tu base de datos

// Variables reactivas
const selectedYear = ref();
const selectedYear2 = ref();
const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - i
);
const ERData = ref([]);

// Columnas de la tabla
const columns = [
  {
    name: "nombre",
    label: "Descripción",
    align: "left",
    field: "nombre",
    style: "width:300px",
  },
  {
    name: "valor",
    label:
      "Año " + (selectedYear.value != null ? selectedYear.value : "Actual"),
    align: "right",
    field: "valor",
    style: "width:125px",
  },
  {
    name: "valor2",
    label:
      "Año " + (selectedYear.value != null ? selectedYear.value : "Actual"),
    align: "right",
    field: "valor2",
    style: "width:125px",
  },
];

// Función para obtener datos de la base de datos
async function fetchData() {
  if (selectedYear.value && selectedYear2.value) {
    try {
      // Obtener datos de ambos años de la base de datos
      const dataYear1 = await cuentasER.get(selectedYear.value);
      const dataYear2 = await cuentasER.get(selectedYear2.value);

      // Combinar datos en un formato adecuado
      ERData.value = dataYear1.map((item, index) => ({
        nombre: item.nombre,
        valor: item.valor,
        valor2: dataYear2[index] ? dataYear2[index].valor : null,
      }));

      // Reordena los datos si es necesario para que sigan el orden específico de ingresos, costos, etc.
      ERData.value.sort((a, b) => {
        // Define tu orden específico aquí, por ejemplo:
        const order = [
          "Ingresos",
          "Costo de lo Vendido",
          "Utilidad Bruta" /* más categorías */,
        ];
        return order.indexOf(a.nombre) - order.indexOf(b.nombre);
      });
    } catch (error) {
      console.error("Error al cargar datos de la base de datos:", error);
    }
  }
}

// Cargar datos al montar el componente si los años están seleccionados
onMounted(() => {
  if (selectedYear.value && selectedYear2.value) {
    fetchData();
  }
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
