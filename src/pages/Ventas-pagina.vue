<template>
    <div>
      <q-header class="text-white configh">
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;">
          <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668" @click="regresar"/>
          <q-label style="font-size: 40px;color: #0B3668 ;text-align: left;margin-left: 5px;">Regresar</q-label>
          <q-toolbar-title class="tituloV" style="font-size: 40px;margin-left: 350px;">
            Ventas
          </q-toolbar-title >
          <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
      </q-header>
      <div class="Ordenar" style="margin-top: 30px;">
        <div class="tablaC">
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
    import { defineComponent, ref} from 'vue';
    
    const router = useRouter();

    defineComponent({
        name: 'Ventas-pagina'
    });
    
    const regresar = () => {
        router.push("/panel");
    };
    
    const columns = [
        { name: 'Codigo Factura', align: 'left', label: 'Codigo Factura', field: 'factura', sortable: true },
        { name: 'Fecha', align: 'left', label: 'Fecha', field: 'fecha', sortable: true },
        { name: 'Cliente', align: 'left', label: 'Cliente', field: 'cliente', sortable: true },
        { name: 'Concepto', align: 'left', label: 'Concepto', field: 'concepto', sortable: true },
        { name: 'Cantidad', align: 'left', label: 'Cantidad', field: 'cantidad', sortable: true },
        { name: 'P/U', align: 'left', label: 'P/U', field: 'preciou', sortable: true },
        { name: 'IVA', align: 'left', label: 'IVA', field: 'iva', sortable: true },
        { name: 'Total', align: 'left', label: 'Total', field: 'total', sortable: true },
    ];
    
    const rows = ref([]);
   
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