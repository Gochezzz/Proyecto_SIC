<template>
    <div>
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;background-color: #CEE5EF;margin-bottom:20px;">
            <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668" @click="regresar"/>
            <q-label style="font-size: 40px;color: #0B3668 ;text-align: left;margin-left: 5px;">Regresar</q-label>
            <q-toolbar-title class="tituloT" style="font-size: 40px;margin-left: 325px;">
                Ingresar Datos
            </q-toolbar-title >
            <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
        <q-select
            outlined
            v-model="Estados.name"
            :options="estados"
            label="Estados Financieros"
            class="col-5 col-md-3 q-mx-sm"
            dense
            clearable
            style="color:#0B3668;margin-top: 20px;margin-left: 175px;width: 240px;margin-bottom: 20px;"
        />
        <label style="font-size: 40px;color:#0B3668;margin-top: 2px;margin-left: 25%;" v-if="Estados.name !== 'Balance General'&& Estados.name !=='Estado de Resultados'">¡¡¡SELECCIONA UN ESTADO FINANCIERO!!!</label>
        <div class="Ordenar" v-if="Estados.name === 'Balance General' || Estados.name === 'Estado de Resultados'">
            <div class="fLibro">
                <div class="cuadroDE">
                    <q-card flat bordered style="border-radius: 10px;">
                        <q-card-section style="display: flex;justify-content: center;">
                            <div style="min-width: 140px">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Tipo</label>
                                <q-select
                                    v-model="datos.tipo"
                                    :options="tipoOptions"
                                    label="Tipo"
                                    class="col-5 col-md-3 q-mx-sm"
                                    dense
                                    style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                                />
                            </div>
                            <div style="min-width: 140px" v-if="Estados.name === 'Balance General'">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Subtipo</label>
                                <q-select
                                    v-model="datos.subtipo"
                                    :options="subtipos"
                                    label="Subtipo"
                                    class="col-5 col-md-3 q-mx-sm"
                                    dense
                                    style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                                />
                            </div>
                            <div style="min-width: 365px">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Nombre Cuenta</label>
                                <q-select
                                    v-model="datos.nombrec"
                                    :options="mostrarSelecCuenta.map(cuenta => cuenta.nombre)"
                                    label="nombre"
                                    class="col-5 col-md-3 q-mx-sm"
                                    dense
                                    style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                                />
                            </div>
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Monto</label>
                                <q-input
                                    v-model="datos.monto"
                                    autogrow
                                    dense
                                    style="margin-top: 10px;"
                                />
                            </div>
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px; color: #0B3668; margin-top: 8px;">Fecha</label>
                                <q-input
                                    v-model="datos.fecha"
                                    filled
                                    dense
                                    style="max-width: 200px;margin-top: 10px !important;margin-left: 0px !important;padding-left: 0px !important;padding-top: 0px !important;"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="datos.fecha" class="q-pa-md" />
                                                <div class="row items-center justify-end q-mt-sm">
                                                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                                </div>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
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
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, watch } from 'vue';
import swal from "sweetalert";
import { cuentasBG, catalogoBG, cuentasER, catalogoER } from '../boot/Pouchdb';

const Estados = ref({ name: "" });
const estados =  ['Estado de Resultados', 'Balance General'];
const router = useRouter();
const datos = ref({
    tipo: "",
    subtipo: "",
    nombrec: "",
    monto: "",
    fecha: ""
});
const Tipos = ['Activo', 'Pasivo', 'Capital'];
const TiposER = ['Ingreso', 'Gasto'];
const subtipos = ['Corriente', 'No Corriente', 'Capital Contable'];
const mostrarSelecCuenta = ref([]);
const tipoOptions = ref(Tipos);

// Cambia las opciones de tipo según el estado seleccionado
watch(() => Estados.value.name, (newVal) => {
    tipoOptions.value = newVal === 'Estado de Resultados' ? TiposER : Tipos;
    datos.value.tipo = "";
    datos.value.subtipo = "";
    datos.value.nombrec = "";
    datos.value.monto = "";
    datos.value.fecha = "";
    cargarDatos();
});

// Navegar a la pantalla de panel
const regresar = () => {
    router.push("/panel");
};

// Cargar las cuentas desde la base de datos correspondiente
const cargarDatos = async () => {
    try {
        const db = Estados.value.name === 'Estado de Resultados' ? catalogoER : catalogoBG;
        const result = await db.allDocs({ include_docs: true });
        mostrarSelecCuenta.value = result.rows.map(row => row.doc);
    } catch (error) {
        console.error("Error cargando datos del catálogo:", error);
    }
};

// Filtrar cuentas por tipo y subtipo
const filtrarCuentas = () => {
    mostrarSelecCuenta.value = mostrarSelecCuenta.value.filter(cuenta => {
        return cuenta.tipo === datos.value.tipo &&
               (!datos.value.subtipo || cuenta.subtipo === datos.value.subtipo);
    });
};

// Observa cambios en 'tipo' y 'subtipo' y actualiza las opciones de cuenta
watch([() => datos.value.tipo, () => datos.value.subtipo], () => {
    cargarDatos().then(() => filtrarCuentas());
});

// Función para agregar datos a la base de datos correspondiente
async function agregar() {
    try {
        const valordatos = Object.values(datos.value);
        if (Estados.value.name === 'Balance General') {
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
        } else if (Estados.value.name === 'Estado de Resultados') {
            if (!datos.value.tipo || !datos.value.nombrec || !datos.value.monto || !datos.value.fecha) {
                swal({
                    title: "¡Espera!",
                    text: "Debes llenar el tipo y el nombre",
                    icon: "warning",
                    buttons: false,
                    timer: 3500,
                });
                return; // Detener la ejecución si los campos 'tipo' o 'nombre' están vacíos
            }
        }

        // Guardar el documento en la base de datos correspondiente
        const db = Estados.value.name === 'Estado de Resultados' ? cuentasER : cuentasBG;
        const doc = {
            _id: new Date().toISOString(),
            tipo: datos.value.tipo,
            subtipo: datos.value.subtipo,
            nombrec: datos.value.nombrec,
            monto: datos.value.monto,
            fecha: datos.value.fecha
        };
        await db.put(doc);

        swal({
            title: "Muy Bien",
            text: "La cuenta se creó correctamente",
            icon: "success",
            buttons: false,
            timer: 3000,
        });

        // Limpiar los campos después de guardar
        datos.value.tipo = "";
        datos.value.subtipo = "";
        datos.value.nombrec = "";
        datos.value.monto = "";
        datos.value.fecha = "";

    } catch (error) {
        console.error("Error agregando el documento:", error);
    }
}

onMounted(() => {
    cargarDatos();
});
</script>
