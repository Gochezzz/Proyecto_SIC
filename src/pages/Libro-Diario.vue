<template>
    <div>
      <q-header class="text-white configh">
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;">
          <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668" @click="regresar"/>
          <q-label style="font-size: 40px;color: #0B3668 ;text-align: left;margin-left: 5px;">Regresar</q-label>
          <q-toolbar-title class="tituloLD" style="font-size: 40px;">
            Libro Diario
          </q-toolbar-title >
          <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
      </q-header>
      <div class="libroD" style="margin-top: 30px;">
            <div class="fLibro">
                <div class="cuadroIZ">
                    <q-input
                        style="max-width: 300px; background-color: rgb(216, 242, 242)"
                        filled
                        dense
                        v-model="date"
                        mask="date"
                        :rules="['date']"
                    >
                        <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                            >
                            <q-date v-model="date">
                                <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                            </q-date>
                            </q-popup-proxy>
                        </q-icon>
                        </template>
                    </q-input>
                    <div style="display: flex; margin-top: 30px">
                        <q-input v-model="text" label="Cliente/Proveedor" />
                        <q-input style="margin-left: 20px" v-model="text" label="Codigo C/P" />
                    </div>
                    <div style="display: flex; margin-top: 30px">
                        <q-select
                        style="width: 200px"
                        v-model="model"
                        :options="options"
                        label="Tipo de Documento"
                        />
                        <q-input
                        style="margin-left: 20px"
                        v-model="text"
                        label="Codigo soporte"
                        />
                        <q-input style="margin-left: 20px" v-model="text" label="Documento" />
                    </div>
                    <div style="margin-top: 30px">
                        <p>Concepto</p>
                        <q-input v-model="text" filled autogrow />
                    </div>
                </div>
                <div class="cuadroDE">
                    <q-card flat bordered>
                        <q-card-section>
                            <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Código Cta</label>
                            <q-select
                                v-model="datos.codigo"
                                :options="mostrarSelecCodigo"
                                label="código"
                                class="col-5 col-md-3 q-mx-sm"
                                dense
                                style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                            />
                        </q-card-section>
                        <q-card-section>
                            <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Nombre Cta</label>
                            <q-select
                                v-model="datos.nombre"
                                :options="mostrarSelecCuenta"
                                label="código"
                                class="col-5 col-md-3 q-mx-sm"
                                dense
                                style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                            />
                        </q-card-section>
                        <q-card-section style="display: flex;">
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Debe</label>
                                <q-input
                                v-model="nuevoAnuncio"
                                autogrow
                                dense
                            />
                            </div>
                            <div style="margin-left: 42px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Haber</label>
                                <q-input
                                    v-model="nuevoAnuncio"
                                    autogrow
                                    dense
                                />
                            </div>
                        </q-card-section>
                        <q-card-section style="text-align: center;">
                            <q-btn
                                class="botoncerrar efect"
                                label="Agregar"
                                style="padding-left: 20px; padding-right: 20px"
                                @click="agregar"
                            />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
            <div class="tablaLD">
                <q-table
                    :rows="rows"
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
      </div>
    </div>
</template>
<script setup>
    import { useRouter } from "vue-router";
    import { defineComponent, ref, onMounted} from 'vue';
    import { collection, getDocs} from "firebase/firestore";
    import { useCollection } from "vuefire";
    import {db} from "boot/firebase";
    const router = useRouter();

    const date = ref("2012/09/11");

    defineComponent({
        name: 'Libro-Diario'
    });
    
    const regresar = () => {
        router.push("/panel");
    };
    
    const columns = [
        { name: 'Factura', align: 'left', label: 'Factura', field: 'factura', sortable: true },
        { name: 'Fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
    ];
    
    const rows = ref([]);
   
    const customRowClass = (row) => {
        return {
        'custom-row-class': true,
        };
    };
    //Jalando DATA para los select cuenta y codigo cta
    const datos = ref({
        tipo: "",
        codigo: "",
        nombre: "",
    });
    
    const mostrarCuenta = [];
    const mostrarSelecCuenta = ref();
    const mostrarCodigo = [];
    const mostrarSelecCodigo = ref();
    const cargarDatos = async function () {
        // cargar las marcas
        const querySnapshot2 = await getDocs(collection(db, "Catalogo"));
        querySnapshot2.forEach((doc) => {
            mostrarCuenta.push(doc.data().nombre);
            mostrarCodigo.push(doc.data().codigo);
        });
        mostrarSelecCuenta.value = mostrarCuenta;
        mostrarSelecCodigo.value = mostrarCodigo;
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
</style>
  