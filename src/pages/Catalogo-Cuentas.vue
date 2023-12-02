<template>
    <div>
      <q-header class="text-white configh">
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;">
          <q-icon name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#FAC238" @click="regresar"/>
          <q-label style="font-size: 40px;color: #FAC238;text-align: left;margin-left: 5px;">Regresar</q-label>
          <q-toolbar-title class="titulo" style="font-size: 40px;margin-left: 325px;">
            Catalogo de Cuentas
          </q-toolbar-title >
          <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
      </q-header>
      <div class="Ordenar" style="margin-top: 30px;">
        <div class="tabla">
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
        <div class="b-agregar">
          <q-btn 
            class="botonagregar" 
            label="Agregar Cuenta"
            style="padding-left: 20px; padding-right: 20px"
            @click="Agregarcuenta"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from "vue-router";
  import { defineComponent } from 'vue';
  
  const router = useRouter();
  
  defineComponent({
    name: 'Catalogo-Cuentas'
  });
  
  const regresar = () => {
    router.push("/panel");
  };
  
  const columns = [
    { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
    { name: 'nombre', align: 'left', label: 'Nombre de Cuenta', field: 'nombre', sortable: true },
  ];
  
  const rows = [
    { codigo: 1, nombre: 'Cuenta 1' },
    { codigo: 2, nombre: 'Cuenta 2' },
    { codigo: 3, nombre: 'Cuenta 3' },
  ];
  
  const customRowClass = (row) => {
    return {
      'custom-row-class': true,
    };
  };
  
  const Agregarcuenta = () => {
    // Lógica para agregar una cuenta
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
  