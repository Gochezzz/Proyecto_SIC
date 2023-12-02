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
            />
        </div>
        <div class="b-agregar">
            <q-btn 
                class="botoncerrar" 
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
    import { defineComponent} from 'vue'

    const router = useRouter();

    defineComponent({
        name: 'Catalogo-Cuentas'
    })
    const regresar = () => {
        router.push("/panel");
    };
    const rows = [
        {
            Codigo: 122,
            Nombre_de_Cuenta: "hola",
        },
    ];
</script>