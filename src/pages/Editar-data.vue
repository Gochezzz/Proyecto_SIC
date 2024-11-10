<template>
  <q-toolbar style="display: inline-flex; align-items: center; justify-content: center; background-color: #CEE5EF; margin-bottom: 20px;">
    <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0B3668" @click="regresar" />
    <q-label style="font-size: 40px; color: #0B3668; text-align: left; margin-left: 5px;">Regresar</q-label>
    <q-toolbar-title class="tituloT" style="font-size: 40px; margin-left: 325px;">
      Editar Datos
    </q-toolbar-title>
    <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0B3668" />
  </q-toolbar>
  <q-select
    outlined
    v-model="Estados.name"
    :options="estados"
    label="Estados Financieros"
    class="col-5 col-md-3 q-mx-sm"
    dense
    clearable
    style="color:#0B3668;margin-top: 20px;margin-left: 15px;width: 240px;margin-bottom: 20px;"
  />
  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Cuentas"
      :rows="rows"
      :columns="activeColumns"
      row-key="_id"
      binary-state-sort
      :row-class="customRowClass"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
            <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="custom-header-class"
            >
            {{ col.label }}
            </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- Campo "Tipo de Cuenta" como q-select -->
          <q-td key="tipo" :props="props" :class="customRowClass(props.row)">
            {{ props.row.tipo }}
            <q-popup-edit v-model="props.row.tipo" title="Tipo de cuenta" buttons v-slot="scope" @input="filtrarCuentas(props.row)">
              <q-select
                v-model="scope.value"
                :options="tipoOptions"
                dense autofocus
              />
            </q-popup-edit>
          </q-td>
          <q-td key="subtipo" :props="props" v-if="Estados.name === 'Balance General'" :class="customRowClass(props.row)">
            {{ props.row.subtipo }}
            <q-popup-edit v-model="props.row.subtipo" title="Subtipo" buttons v-slot="scope" @input="filtrarCuentas(props.row)">
              <q-select
                v-model="scope.value"
                :options="subtipo"
                dense autofocus
              />
            </q-popup-edit>
          </q-td>

          <!-- Campo "Nombre" como q-select -->
          <q-td key="nombre" :props="props" :class="customRowClass(props.row)">
            {{ props.row.nombrec }}
            <q-popup-edit v-model="props.row.nombrec" title="Cuenta" buttons v-slot="scope">
              <q-select
                v-model="scope.value"
                :options="filteredCuentaOptions(props.row).map(cuenta => cuenta.nombre)"
                dense autofocus
              />
            </q-popup-edit>
          </q-td>

          <!-- Campo "Monto" como número editable -->
          <q-td key="monto" :props="props" :class="customRowClass(props.row)">
            <div class="text-pre-wrap">{{ props.row.monto }}</div>
            <q-popup-edit v-model="props.row.monto" title="Monto" buttons v-slot="scope">
              <q-input type="number" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>

          <!-- Campo "Fecha" como q-date -->
          <q-td key="fecha" :props="props" :class="customRowClass(props.row)">
            {{ props.row.fecha }}
            <q-popup-edit v-model="props.row.fecha" title="Fecha" buttons persistent v-slot="scope">
              <q-date
                v-model="scope.value"
                mask="YYYY-MM-DD"
                dense
                default-year-month="2023/01"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-btn
    class="botoncerrar efect"
    label="Actualizar"
    style="padding-left: 20px; padding-right: 20px; margin-left: 1300px;"
    @click="actualizarCuentas"
  />
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import swal from "sweetalert";
import { cuentasBG, catalogoBG, cuentasER, catalogoER } from "src/boot/Pouchdb";

const Estados = ref({ name: "" });
const estados =  ['Estado de Resultados', 'Balance General'];

const router = useRouter();
const regresar = () => {
  router.push('/panel');
};
const customRowClass = (row) => {
    return {
    'custom-row-class': true,
    };
};

// Definir columnas
const columns = [
  { name: 'tipo', required: true, label: 'Tipo de Cuenta', align: 'left', field: row => row.tipo, sortable: true },
  { name: 'subtipo', align: 'center', label: 'Subtipo', field: 'subtipo', sortable: true },
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'monto', label: 'Monto', field: 'monto', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', sortable: true }
];
const columnsER = [
  { name: 'tipo', required: true, label: 'Tipo de Cuenta', align: 'left', field: row => row.tipo, sortable: true },
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'monto', label: 'Monto', field: 'monto', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', sortable: true }
];
const activeColumns = computed(() => Estados.value.name === 'Estado de Resultados' ? columnsER : Estados.value.name === 'Balance General' ? columns : []);

// Opciones para los selects
const Tipos = ['Activo', 'Pasivo', 'Capital'];
const TiposER = ['Ingreso', 'Gasto'];
const tipoOptions = ref(Tipos);
const subtipo = ['Corriente', 'No Corriente', 'Capital Contable'];
const cuentaOptions = ref([]);
const rows = ref([]);

// Cambia las opciones de tipo según el estado seleccionado
watch(() => Estados.value.name, (newVal) => {
  tipoOptions.value = newVal === 'Estado de Resultados' ? TiposER : Tipos;
  cargarDatos();
});

// Filtrar cuentas por tipo y subtipo para cada fila específica
const filteredCuentaOptions = (row) => {
  return cuentaOptions.value.filter(cuenta => {
    return cuenta.tipo === row.tipo && (!row.subtipo || cuenta.subtipo === row.subtipo);
  });
};

// Cargar datos de la base de datos
const cargarDatos = async () => {
  try {
    const cuentasdb = Estados.value.name === 'Estado de Resultados' ? cuentasER : cuentasBG;
    const result = await cuentasdb.allDocs({ include_docs: true });
    rows.value = result.rows.map(row => row.doc);
    const catalogodb = Estados.value.name === 'Estado de Resultados' ? catalogoER : catalogoBG;
    const result2 = await catalogodb.allDocs({ include_docs: true });
    cuentaOptions.value = result2.rows.map(row => row.doc);
  } catch (error) {
    console.error("Error cargando documentos de cuentasdb:", error);
  }
};

// Actualizar cuentas en la base de datos
const actualizarCuentas = async () => {
  try {
    const cuentasdb = Estados.value.name === 'Estado de Resultados' ? cuentasER : cuentasBG;
    const actualizaciones = rows.value.map(async row => {
      const response = await cuentasdb.put(row);
      row._rev = response.rev;
    });
    await Promise.all(actualizaciones);
    swal({
      title: "Muy Bien",
      text: "La cuenta se actualizó correctamente",
      icon: "success",
      buttons: false,
      timer: 3000,
    });
  } catch (error) {
    console.error("Error actualizando cuentas en cuentasdb:", error);
    swal({
      title: "Algo Fallo",
      text: "La cuenta no pudo ser actualizada",
      icon: "error",
      buttons: false,
      timer: 3000,
    });
  }
};

onMounted(() => {
  cargarDatos();
});
</script>
<style scoped>
    .custom-header-class {
        background-color: #0B3668; /* Cambia el color de fondo según tus necesidades */
        color: #ffffff; /* Cambia el color del texto según tus necesidades */
    }
    .custom-row-class {
        background-color: #CEE5EF; /* Cambia el color de fondo según tus necesidades */
        color: #0B3668; /* Cambia el color del texto según tus necesidades */
        }
    .boton-deshabilitado {
        background-color: grey !important;
        color: white !important;
    }
</style>
