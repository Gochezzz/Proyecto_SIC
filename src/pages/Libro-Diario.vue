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
                    <q-card flat bordered class="tarjetaI" style="border-radius: 10px;">
                        <q-card-section style="display: flex;">
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Fecha</label>
                                <q-input
                                    class="modI"
                                    style="max-width: 300px; background-color: #CEE5EF"
                                    filled
                                    dense
                                    v-model="datos.fecha"
                                    mask="date"
                                >
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer" style="color:#0B3668">
                                            <q-popup-proxy
                                            cover
                                            transition-show="scale"
                                            transition-hide="scale"
                                            >
                                            <q-date v-model="datos.fecha">
                                                <div class="row items-center justify-end">
                                                <q-btn v-close-popup label="Close" color="primary" flat />
                                                </div>
                                            </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </div>
                        </q-card-section>
                        <q-card-section style="display: flex;">
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Nombre Tercero</label>
                                <q-input
                                v-model="datos.nombret"
                                autogrow
                                />
                            </div>
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Código Tercero</label>
                                <q-input
                                v-model="datos.codigot"
                                autogrow
                                />
                            </div>
                            <div style="margin-left: 12px;">
                                <q-checkbox v-model="cliente" label="Cliente" @click="toggleTercero('cliente')" style="color:#0B3668"/>
                                <br />
                                <q-checkbox v-model="proveedor" label="Proveedor" @click="toggleTercero('proveedor')" style="color:#0B3668"/>
                            </div>
                        </q-card-section>
                        <q-card-section style="display: flex;">
                                <div style="margin-left: 12px;">
                                    <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Tipo de Documento</label>
                                    <q-select
                                    style="width: 200px"
                                    v-model="datos.tipod"
                                    :options="Tipos"
                                    label="Tipo de Documento"
                                    />
                                </div>
                                <div style="margin-left: 12px;">
                                    <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Código Soporte</label>
                                    <q-input
                                    v-model="datos.codigos"
                                    autogrow
                                    />
                                </div>
                                <div style="margin-left: 12px;">
                                    <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Documento</label>
                                    <q-input
                                    v-model="datos.documento"
                                    autogrow
                                    />
                                </div>
                        </q-card-section>
                        <q-card-section style="display: flex;">
                                <div style="margin-left: 12px;">
                                    <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Cantidad</label>
                                    <q-input
                                    v-model="datos.cantidad"
                                    autogrow
                                    />
                                </div>
                                <div style="margin-left: 12px;">
                                    <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">C/U</label>
                                    <q-input
                                    v-model="datos.cu"
                                    autogrow
                                    />
                                </div>
                                <div style="margin-left: 12px;">
                                    <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Total</label>
                                    <q-input
                                    v-model="datos.total"
                                    autogrow
                                    />
                                </div>
                        </q-card-section>
                        <q-card-section >
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Concepto</label>
                                <q-input class="modI"  v-model="datos.concepto" filled autogrow style="max-width: 99%;" />
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="cuadroDE">
                    <q-card flat bordered style="border-radius: 10px;">
                        <q-card-section>
                            <label style="font-size: 16px;color:#0B3668;margin-top: 8px;margin-left: 12px;">Código Cta</label>
                            <q-select
                                v-model="datos.codigoc"
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
                                v-model="datos.nombrec"
                                :options="mostrarSelecCuenta"
                                label="nombre"
                                class="col-5 col-md-3 q-mx-sm"
                                dense
                                style="color:#0B3668;margin-top: 10px;margin-left: 12px;"
                            />
                        </q-card-section>
                        <q-card-section style="display: flex;">
                            <div style="margin-left: 12px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Debe</label>
                                <q-input
                                v-model="datos.debe"
                                autogrow
                                dense
                            />
                            </div>
                            <div style="margin-left: 42px;">
                                <label style="font-size: 16px;color:#0B3668;margin-top: 8px;">Haber</label>
                                <q-input
                                    v-model="datos.haber"
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
                    :rows="tablal"
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
    import {db} from "boot/firebase";
    import { collection, addDoc, getDocs} from "firebase/firestore";
    import swal from "sweetalert";
    import { useCollection } from "vuefire";

    const router = useRouter();

    const Tipos =  ['Activo', 'Pasivo']

    const tablal = useCollection(collection(db,"Libro_Diario"));
    
    defineComponent({
        name: 'Libro-Diario'
    });
    
    const regresar = () => {
        router.push("/panel");
    };
    
    const columns = [
        { name: 'Código Cta', align: 'left', label: 'Código Cta', field: 'codigoc', sortable: true },
        { name: 'Nombre Cta', align: 'left', label: 'Nombre Cta', field: 'nombrec', sortable: true },
        { name: 'Debe', align: 'left', label: 'Debe', field: 'debe', sortable: true },
        { name: 'Haber', align: 'left', label: 'Haber', field: 'haber', sortable: true },
    ];
    
    const customRowClass = (row) => {
        return {
        'custom-row-class': true,
        };
    };
    //Jalando DATA para los select cuenta y codigo cta
    const datos = ref({
        tipod: "",
        codigoc: "",
        nombrec: "",
        debe: "",
        haber: "",
        fecha: "",
        nombret: "",
        codigot: "",
        codigos: "",
        documento: "",
        concepto: "",
        cantidad: "",
        cu: "",
        total: "",
    });

    let cliente = ref(false);
    let proveedor = ref(false);

    const toggleTercero = (marca) => {
        cliente.value = marca === "cliente";
        proveedor.value = marca === "proveedor";
    };
    
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
                datos.value.documento = "";
                datos.value.concepto = "";
                datos.value.cantidad = "";
                datos.value.cu = "";
                datos.value.total = "";
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
                    datos.value.documento = "";
                    datos.value.concepto = "";
                    datos.value.cantidad = "";
                    datos.value.cu = "";
                    datos.value.total = "";
                    proveedor.value = false;
                }
            }
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
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
  