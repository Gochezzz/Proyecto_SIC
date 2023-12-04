<template>
    <div>
      <q-header class="text-white configh">
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;">
          <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668" @click="regresar"/>
          <q-label style="font-size: 40px;color: #0B3668 ;text-align: left;margin-left: 5px;">Regresar</q-label>
          <q-toolbar-title class="tituloC" style="font-size: 40px;margin-left: 325px;">
            Compras
          </q-toolbar-title >
          <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
      </q-header>
      <div class="Ordenar" style="margin-top: 30px;">
        <div class="tablaC">
          <q-table
                :rows="tablac"
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
    import { defineComponent, ref} from 'vue';
    import { useRouter } from "vue-router";
    import {db} from "boot/firebase";
    import { collection} from "firebase/firestore";
    import { useCollection } from "vuefire";
    
    const router = useRouter();

    const tablac = useCollection(collection(db,"Proveedor"));

    defineComponent({
        name: 'Compras-pagina'
    });
    
    const regresar = () => {
        router.push("/panel");
    };
    
    const columns = [
        { name: 'Factura', align: 'left', label: 'Factura', field: 'factura', sortable: true },
        { name: 'Fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
        { name: 'Proveedor', align: 'left', label: 'Proveedor', field: 'nombret', sortable: true },
        { name: 'Concepto', align: 'left', label: 'Concepto', field: 'concepto', sortable: true },
        { name: 'P/U', align: 'left', label: 'P/U', field: 'cu', sortable: true },
        { name: 'Cantidad', align: 'left', label: 'Cantidad', field: 'cantidad', sortable: true },
        { name: 'Total', align: 'left', label: 'Total', field: 'total', sortable: true },
    ];
   
    const customRowClass = (row) => {
        return {
        'custom-row-class': true,
        };
    };
    
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
  