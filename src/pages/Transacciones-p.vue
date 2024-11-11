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
                                    v-model="datos.nombre"
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
                            <q-btn 
                                :disable="botonDeshabilitadoERC && Estados.name === 'Estado de Resultados'"
                                :class="{ 'boton-deshabilitado': botonDeshabilitadoERC && Estados.name === 'Estado de Resultados' }"
                                class="botonagregar efect" 
                                label="Cargar Cuentas de SIGMA"
                                v-if="Estados.name === 'Estado de Resultados'"
                                style="padding-left: 20px; padding-right: 20px;"
                                @click="cargarinfoER"
                            />
                            <q-btn 
                                :disable="botonDeshabilitadoBGC && Estados.name === 'Balance General'"
                                :class="{ 'boton-deshabilitado': botonDeshabilitadoBGC && Estados.name === 'Balance General' }"
                                class="botonagregar efect" 
                                label="Cargar Cuentas de SIGMA"
                                v-if="Estados.name === 'Balance General'"
                                style="padding-left: 20px; padding-right: 20px;"
                                @click="cargarinfoBG"
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
import SIGMABG from "src/assets/BGSIGMA.json"
import SIGMAER from "src/assets/ERSIGMA.json"

const botonDeshabilitadoERC = ref(localStorage.getItem("botonDeshabilitadoERC") === "true");
const botonDeshabilitadoBGC = ref(localStorage.getItem("botonDeshabilitadoBGC") === "true");

async function cargarinfoBG() {
    try {
        // Verifica que SIGMABG sea un arreglo válido
        if (!Array.isArray(SIGMABG)) {
            throw new Error("SIGMABG no es un arreglo válido.");
        }

        // Verifica que cuentasBG esté correctamente inicializado
        if (!cuentasBG || typeof cuentasBG.put !== 'function') {
            throw new Error("cuentasBG no está correctamente inicializado.");
        }

        // Itera sobre los datos del archivo JSON y guárdalos en catalogodb
        for (const cuenta of SIGMABG) {
            // Verifica que los campos necesarios existan en cada cuenta,
            // permitiendo que monto sea 0.
            if (!cuenta.tipo || !cuenta.subtipo || !cuenta.nombre || !cuenta.fecha || (cuenta.monto === undefined)) {
                throw new Error(`Datos incompletos en la cuenta: ${JSON.stringify(cuenta)}`);
            }

            // Genera un ID único
            const uniqueId = `${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`;

            await cuentasBG.put({
                _id: uniqueId,  // ID único
                tipo: cuenta.tipo,
                subtipo: cuenta.subtipo,
                nombre: cuenta.nombre,
                monto: cuenta.monto,
                fecha: cuenta.fecha,
            });
        }

        // Deshabilita el botón y guarda el estado en localStorage
        botonDeshabilitadoBGC.value = true;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("botonDeshabilitadoBGC", "true");
        } else {
            console.error("localStorage no está disponible.");
        }

        // Llama a la función cargarDatos y maneja posibles errores
        if (typeof cargarDatos === 'function') {
            await cargarDatos();
        } else {
            console.error("cargarDatos no está definida.");
        }

        console.log("Catálogo BG cargado en PouchDB.");
    } catch (error) {
        console.error("Error al cargar el catálogo en PouchDB:", error);
    }
}
async function cargarinfoER() {
    try {
        // Verifica que SIGMABG sea un arreglo válido
        if (!Array.isArray(SIGMAER)) {
            throw new Error("SIGMABG no es un arreglo válido.");
        }

        // Verifica que cuentasBG esté correctamente inicializado
        if (!cuentasER || typeof cuentasER.put !== 'function') {
            throw new Error("cuentasBG no está correctamente inicializado.");
        }

        // Itera sobre los datos del archivo JSON y guárdalos en catalogodb
        for (const cuenta of SIGMAER) {
            // Verifica que los campos necesarios existan en cada cuenta,
            // permitiendo que monto sea 0.
            if (!cuenta.tipo || !cuenta.nombre || !cuenta.fecha || (cuenta.monto === undefined)) {
                throw new Error(`Datos incompletos en la cuenta: ${JSON.stringify(cuenta)}`);
            }

            // Genera un ID único
            const uniqueId = `${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`;

            await cuentasER.put({
                _id: uniqueId,  // ID único
                tipo: cuenta.tipo,
                subtipo: "",
                nombre: cuenta.nombre,
                monto: cuenta.monto,
                fecha: cuenta.fecha,
            });
        }

        // Deshabilita el botón y guarda el estado en localStorage
        botonDeshabilitadoERC.value = true;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem("botonDeshabilitadoERC", "true");
        } else {
            console.error("localStorage no está disponible.");
        }

        // Llama a la función cargarDatos y maneja posibles errores
        if (typeof cargarDatos === 'function') {
            await cargarDatos();
        } else {
            console.error("cargarDatos no está definida.");
        }

        console.log("Catálogo ER cargado en PouchDB.");
    } catch (error) {
        console.error("Error al cargar el catálogo en PouchDB:", error);
    }
}

const Estados = ref({ name: "" });
const estados =  ['Estado de Resultados', 'Balance General'];
const router = useRouter();
const datos = ref({
    tipo: "",
    subtipo: "",
    nombre: "",
    monto: "",
    fecha: ""
});
const Tipos = ['Activo', 'Pasivo', 'Capital'];
const TiposER =  ['Ingreso', 'Costo', 'Gasto', 'Impuesto']
const subtipos = ['Corriente', 'No Corriente', 'Capital Contable'];
const mostrarSelecCuenta = ref([]);
const tipoOptions = ref(Tipos);

// Cambia las opciones de tipo según el estado seleccionado
watch(() => Estados.value.name, (newVal) => {
    tipoOptions.value = newVal === 'Estado de Resultados' ? TiposER : Tipos;
    datos.value.tipo = "";
    datos.value.subtipo = "";
    datos.value.nombre = "";
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
            if (!datos.value.tipo || !datos.value.nombre || !datos.value.monto || !datos.value.fecha) {
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
        const uniqueId = `${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`;
        const doc = {
            _id: uniqueId,
            tipo: datos.value.tipo,
            subtipo: datos.value.subtipo,
            nombre: datos.value.nombre,
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
        datos.value.nombre = "";
        datos.value.monto = "";
        datos.value.fecha = "";

    } catch (error) {
        console.error("Error agregando el documento:", error);
    }
}

onMounted(() => {
    cargarDatos();
    botonDeshabilitadoERC.value = localStorage.getItem("botonDeshabilitadoERC") === "true";
    botonDeshabilitadoBGC.value = localStorage.getItem("botonDeshabilitadoBGC") === "false";
});
</script>
