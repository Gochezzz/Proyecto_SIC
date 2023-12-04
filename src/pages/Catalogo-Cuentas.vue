<template>
  <div>
    <q-header class="text-white configh">
      <q-toolbar
        style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
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
        <q-toolbar-title
          class="titulo"
          style="font-size: 40px; margin-left: 325px"
        >
          Catalogo de Cuentas
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
    </q-header>
    <div class="Ordenar" style="margin-top: 30px">
      <div class="tabla">
        <q-table
          :rows="data"
          :columns="columns"
          row-key="codigo"
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
            <q-tr :props="props" :class="customRowClass(props.row)">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="b-agregar">
        <q-btn
          class="botonagregar efect"
          label="Agregar Cuenta"
          style="padding-left: 20px; padding-right: 20px"
          @click="mostrarDrawer"
        />
        <q-btn
          class="botonagregar efect"
          color="red"
          label="eliminar"
          style="padding-left: 20px; padding-right: 20px; margin-top: 10px"
          @click="elmininarCuenta"
        />
        <q-drawer
          class="Drawg"
          side="right"
          bordered
          v-if="MostrarDrawer"
          show-if-above
        >
          <div class="dT">
            <q-label style="font-size: 20px; color: white; text-align: center"
              >Ingresar Cuentas</q-label
            >
            <q-btn
              round
              color="red"
              icon="close"
              size="10px"
              @click="cerrarDrawer"
              style="margin-left: 20px"
            />
          </div>
          <div class="datosF" style="margin-top: 10px">
            <div class="separar">
              <label style="font-size: 16px; color: #0b3668">Tipo</label>
              <q-select
                outlined
                v-model="datos.tipo"
                :options="Tipos"
                label="Tipo"
                class="col-5 col-md-3 q-mx-sm"
                dense
                style="color: #0b3668; margin-top: 10px"
              />
            </div>
            <div class="separar">
              <label style="font-size: 16px; color: #0b3668">Codigo</label>
              <q-input class="codigo" v-model="datos.codigo" dense />
            </div>
            <div class="separar">
              <label style="font-size: 16px; color: #0b3668">Nombre</label>
              <q-input class="nombre" v-model="datos.nombre" dense />
            </div>
          </div>
          <q-btn
            class="botonagregar efect"
            label="Crear"
            style="padding-left: 20px; padding-right: 20px"
            @click="Subirdata"
          />
        </q-drawer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { db } from "boot/firebase";
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { useCollection } from "vuefire";
import swal from "sweetalert";

const router = useRouter();

const MostrarDrawer = ref(false);

const registroSeleccionado = ref(false);

const data = useCollection(collection(db, "Catalogo"));
const datos = ref({
  tipo: "",
  codigo: "",
  nombre: "",
});
const Tipos = ["Activo", "Pasivo"];
defineComponent({
  name: "Catalogo-Cuentas",
});

const regresar = () => {
  router.push("/panel");
};

const columns = [
  {
    name: "codigo",
    align: "left",
    label: "Código",
    field: "codigo",
    sortable: true,
  },

  {
    name: "nombre",
    align: "left",
    label: "Nombre de Cuenta",
    field: "nombre",
    sortable: true,
  },
];

const customRowClass = (row) => {
  return {
    "custom-row-class": true,
  };
};

const cerrarDrawer = () => {
  MostrarDrawer.value = false;
};
const mostrarDrawer = () => {
  if (MostrarDrawer.value == false) {
    MostrarDrawer.value = true;
  } else {
    MostrarDrawer.value = false;
  }
};
async function Subirdata() {
  try {
    const valordatos = Object.values(datos.value);
    if (valordatos.some((valor) => !valor)) {
      swal({
        title: "Esperaa!",
        text: "Debes llenar todos los campos",
        icon: "warning",
        buttons: false,
        timer: 3500,
      });
      return; // Detener la ejecución si al menos un campo está vacío
    }
    const docRef = await addDoc(collection(db, "Catalogo"), datos.value);
    console.log("Document written with ID: ", docRef.id);
    swal({
      title: "Muy Bien",
      text: "La cuenta se creo correctamente",
      icon: "success",
      buttons: false,
      timer: 3000,
    });
    MostrarDrawer.value = false;
    datos.value.tipo = "";
    datos.value.codigo = "";
    datos.value.nombre = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
</script>

<style scoped>
.custom-header-class {
  background-color: #0b3668; /* Cambia el color de fondo según tus necesidades */
  color: #ffffff; /* Cambia el color del texto según tus necesidades */
}

.custom-row-class {
  background-color: #cee5ef; /* Cambia el color de fondo según tus necesidades */
  color: #0b3668; /* Cambia el color del texto según tus necesidades */
}
</style>
