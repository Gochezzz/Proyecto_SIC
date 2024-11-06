<template>
  <q-toolbar style="display: inline-flex; align-items: center; justify-content: center; background-color: #CEE5EF; margin-bottom: 20px;">
    <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0B3668" @click="regresar" />
    <q-label style="font-size: 40px; color: #0B3668; text-align: left; margin-left: 5px;">Regresar</q-label>
    <q-toolbar-title class="tituloT" style="font-size: 40px; margin-left: 325px;">
      Editar Datos
    </q-toolbar-title>
    <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px; margin-top: 6px; color: #0B3668" />
  </q-toolbar>

  <div class="q-pa-md">
    <q-table
      flat bordered
      title="Cuentas"
      :rows="rows"
      :columns="columns"
      row-key="_id"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- Campo "Tipo de Cuenta" como q-select -->
          <q-td key="tipo" :props="props">
            {{ props.row.tipo }}
            <q-popup-edit v-model="props.row.tipo" title="Tipo de cuenta" buttons v-slot="scope">
              <q-select
                v-model="scope.value"
                :options="tipoOptions"
                dense autofocus
              />
            </q-popup-edit>
          </q-td>

          <!-- Campo "Nombre" como q-select -->
          <q-td key="nombre" :props="props">
            {{ props.row.nombrec }}
            <q-popup-edit v-model="props.row.nombrec" title="Cuenta" buttons v-slot="scope">
              <q-select
                v-model="scope.value"
                :options="cuentaOptions"
                dense autofocus
              />
            </q-popup-edit>
          </q-td>

          <!-- Campo "Monto" como número editable -->
          <q-td key="monto" :props="props">
            <div class="text-pre-wrap">{{ props.row.monto }}</div>
            <q-popup-edit v-model="props.row.monto" title="Monto" buttons v-slot="scope">
              <q-input type="number" v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>

          <!-- Campo "Fecha" como q-date -->
          <q-td key="fecha" :props="props">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import swal from "sweetalert";
import { cuentasdb, catalogodb } from "src/boot/Pouchdb"; // Asegúrate de tener configurado el acceso a cuentasdb

const router = useRouter();

const regresar = () => {
  router.push('/panel');
};

// Definir columnas
const columns = [
  {
    name: 'tipo',
    required: true,
    label: 'Tipo de Cuenta',
    align: 'left',
    field: row => row.tipo,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
  { name: 'monto', label: 'Monto', field: 'monto', sortable: true, style: 'width: 10px' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', sortable: true }
];

// Opciones para los selects
const tipoOptions = ['Activo', 'Pasivo', 'Capital'];
const cuentaOptions = ref([]);
const rows = ref([]);

// Cargar datos de la base de datos cuentasdb al montar el componente
const cargarDatos = async () => {
  try {
    const result = await cuentasdb.allDocs({ include_docs: true });
    rows.value = result.rows.map(row => row.doc); // Carga los documentos en 'rows'
    const result2 = await catalogodb.allDocs({ include_docs: true });
    cuentaOptions.value = result2.rows.map(row => row.doc.nombre); // Obtener los nombres de las cuentas
  } catch (error) {
    console.error("Error cargando documentos de cuentasdb:", error);
  }
};

// Función para actualizar los documentos modificados en cuentasdb
const actualizarCuentas = async () => {
  try {
    const actualizaciones = rows.value.map(async row => {
      const response = await cuentasdb.put(row);
      row._rev = response.rev; // Actualizar el _rev en el objeto de la fila
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


// Cargar datos al montar el componente
onMounted(cargarDatos);
</script>

  