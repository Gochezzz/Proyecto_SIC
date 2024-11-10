<template>
    <div>
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;background-color: #CEE5EF;margin-bottom:20px;">
            <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668" @click="regresar"/>
            <q-label style="font-size: 40px;color: #0B3668 ;text-align: left;margin-left: 5px;">Regresar</q-label>
            <q-toolbar-title class="tituloT" style="font-size: 40px;margin-left: 325px;">
               Analisis Dupont
            </q-toolbar-title >
            <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
        <q-select
            outlined
            v-model="Estados.name"
            :options="estados"
            label="Modelo"
            class="col-5 col-md-3 q-mx-sm margenvariable"
            dense
            clearable
            style="color:#0B3668;margin-top: 20px;margin-left: 175px;width: 240px;margin-bottom: 20px;"
        />
        <div class="Ordenar">
            <div class="RSA">
                <label style="font-size: 20px;color:#0B3668;margin-left: 48.5%;font-weight: bold;">RSA</label>
                <div class="cuadroDE">
                    <q-card flat bordered style="border-radius: 10px;">
                        <q-card-section style="display: flex;justify-content: center;">
                            <div style="min-width: 140px;margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px">Ganancias disponibles para los accionistas comunes</label>
                                <q-input
                                    v-model="datosRSA.tipo"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div style="min-width: 140px;margin-left: 12px;"  v-if="Estados.name === 'No Simplificado'">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px">Ventas</label>
                                <q-input
                                    v-model="datosRSA.subtipo"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div  style="min-width: 365px;margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px">Activos totales</label>
                                <q-input
                                    v-model="datosRSA.nombrec"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">RSA</label>
                                <q-input
                                    v-model="datosRSA.monto"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                        </q-card-section>
                        <q-card-section style="text-align: center;">
                            <q-btn
                                class="botoncerrar efect"
                                label="Calcular"
                                style="padding-left: 20px; padding-right: 20px"
                                @click="agregar"
                            />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
        <div class="Ordenar" style="margin-top: 40px;margin-bottom: 40px;">
            <div class="RSA">
                <label style="font-size: 20px;color:#0B3668;margin-left: 48.5%;font-weight: bold;">RSE</label>
                <div class="cuadroDE">
                    <q-card flat bordered style="border-radius: 10px;">
                        <q-card-section style="display: flex;justify-content: center;">
                            <div style="min-width: 140px;margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px">Ganancias disponibles para los accionistas comunes</label>
                                <q-input
                                    v-model="datosRSE.tipo"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div style="min-width: 140px;margin-left: 12px;"  v-if="Estados.name === 'No Simplificado'">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px">Activos totales</label>
                                <q-input
                                    v-model="datosRSE.subtipo"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div  style="min-width: 365px;margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px">Capital en Acciones Comunes</label>
                                <q-input
                                    v-model="datosRSE.nombrec"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">RSE</label>
                                <q-input
                                    v-model="datosRSE.monto"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                        </q-card-section>
                        <q-card-section style="text-align: center;">
                            <q-btn
                                class="botoncerrar efect"
                                label="Calcular"
                                style="padding-left: 20px; padding-right: 20px"
                                @click="agregar"
                            />
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from 'vue';
import swal from "sweetalert";

//cambiar
const Estados = ref({name: ""});
const estados =  ['Simplificado','No Simplificado']
const router = useRouter();
const datosRSA = ref({
    tipo: "",
    subtipo: "",
    nombrec: "",
    monto: "",
    fecha: ""
});
const datosRSE = ref({
    tipo: "",
    subtipo: "",
    nombrec: "",
    monto: "",
    fecha: ""
});
watch(() => Estados.value.name, () => {
     
});

// Navegar a la pantalla de panel
const regresar = () => {
    router.push("/panel");
};


</script>

