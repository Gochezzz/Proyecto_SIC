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
        <div class="Ordenar">
            <div class="fLibro">
                <div class="cuadroDE">
                    <q-card flat bordered style="border-radius: 10px;">
                        <q-card-section style="display: flex;justify-content: center;">
                            <div style="min-width: 140px">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Tipo Cuenta</label>
                                <q-select
                                    v-model="datos.tipo"
                                    :options="Tipos"
                                    label="Tipo"
                                    class="col-5 col-md-3 q-mx-sm"
                                    dense
                                    style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                                />
                            </div>
                            <div  style="min-width: 365px">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Nombre Cuenta</label>
                                <q-select
                                    v-model="datos.nombrec"
                                    :options="mostrarSelecCuenta"
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
                                    v-model="date"
                                    filled
                                    dense
                                    mask="date"
                                    :rules="['date']"
                                    style="max-width: 200px;margin-top: 10px !important;margin-left: 0px !important;padding-left: 0px !important;padding-top: 0px !important;"
                                >
                                    <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="date" class="q-pa-md" />
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
    import {ref, onMounted} from 'vue';
    import {db} from "boot/firebase";
    import { collection, addDoc, getDocs} from "firebase/firestore";
    import swal from "sweetalert";

    const date = ref('2024/11/04')
    const router = useRouter();
    const regresar = () => {
        router.push("/panel");
    };
    
    //Jalando DATA para los select cuenta y codigo cta
    const datos = ref({
        tipo: "",
        nombrec: "",
        monto: ""
    });
    const Tipos =  ['Activo', 'Pasivo', 'Patrimonio', 'Gasto', 'Ingreso', 'Cuenta de Cierre']
    const mostrarCuenta = [];
    const mostrarSelecCuenta = ref();
    const cargarDatos = async function () {
        // cargar las marcas
        const querySnapshot2 = await getDocs(collection(db, "Catalogo"));
        querySnapshot2.forEach((doc) => {
            mostrarCuenta.push(doc.data().nombre);
        });
        mostrarSelecCuenta.value = mostrarCuenta;
    };
    onMounted(() => {
        cargarDatos();
    });
    async function agregar() {
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
            if(cliente.value){

                const docRef = await addDoc(collection(db, "Cliente"), datos.value);
                const docRefL = await addDoc(collection(db, "Libro_Diario"), datos.value);
                console.log("Document written with ID: ", docRef.id);
                console.log("Document written with ID: ", docRefL.id);
                swal({
                title: "Muy Bien",
                text: "La cuenta se creo correctamente",
                icon: "success",
                buttons: false,
                timer: 3000,
                });
                datos.value.tipod = "";
                datos.value.codigoc = "";
                datos.value.nombrec = "";
                datos.value.debe = "";
                datos.value.haber = "";
                datos.value.fecha = "";
                datos.value.nombret = "";
                datos.value.codigot = "";
                datos.value.codigos = "";
                datos.value.concepto = "";
                datos.value.cantidad = "";
                datos.value.cu = "";
                datos.value.total = "";
                datos.value.iva = "";
                datos.value.nombrep = "";
                datos.value.codigop = "";
                datos.value.pv = "";
                datos.value.factura = "";
                cliente.value = false;

            }else{
                if(proveedor.value){
                    const docRef = await addDoc(collection(db, "Proveedor"), datos.value);
                    const docRefL = await addDoc(collection(db, "Libro_Diario"), datos.value);
                    console.log("Document written with ID: ", docRef.id);
                    console.log("Document written with ID: ", docRefL.id);
                    swal({
                    title: "Muy Bien",
                    text: "La cuenta se creo correctamente",
                    icon: "success",
                    buttons: false,
                    timer: 3000,
                    });
                    datos.value.tipod = "";
                    datos.value.codigoc = "";
                    datos.value.nombrec = "";
                    datos.value.debe = "";
                    datos.value.haber = "";
                    datos.value.fecha = "";
                    datos.value.nombret = "";
                    datos.value.codigot = "";
                    datos.value.codigos = "";
                    datos.value.concepto = "";
                    datos.value.cantidad = "";
                    datos.value.cu = "";
                    datos.value.total = "";
                    datos.value.iva = "";
                    datos.value.nombrep = "";
                    datos.value.codigop = "";
                    datos.value.pv = "";
                    datos.value.factura = "";
                    proveedor.value = false;
                }
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
</script>

