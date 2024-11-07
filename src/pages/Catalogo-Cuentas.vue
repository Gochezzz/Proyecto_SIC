<template>
    <div>
        <q-toolbar style="display: inline-flex;align-items: center;justify-content: center;background-color: #CEE5EF;">
            <q-icon class="change-color" name="arrow_circle_left" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668" @click="regresar"/>
            <q-label style="font-size: 40px;color: #0B3668 ;text-align: left;margin-left: 5px;">Regresar</q-label>
            <q-toolbar-title class="titulo" style="font-size: 40px;margin-left: 325px;">
            Catalogo de Cuentas
            </q-toolbar-title >
            <q-icon name="account_circle" style="font-size: 50px; margin-left: 15px;margin-top: 6px;color:#0B3668"/>
        </q-toolbar>
        <div class="Ordenar" style="margin-top: 30px;">
            <div class="tabla">
            <q-table
                    :rows="data"
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
                    :disable="botonDeshabilitado"
                    :class="{ 'boton-deshabilitado': botonDeshabilitado }"
                    class="botonagregar efect" 
                    label="Cargar Catalogo"
                    style="padding-left: 20px; padding-right: 20px;"
                    @click="cargarcatalogo"
                />
                <q-btn 
                    class="botonagregar efect" 
                    label="Agregar Cuenta"
                    style="padding-left: 20px; padding-right: 20px;"
                    @click="mostrarDrawer"
                />
                <q-drawer class="Drawg" side="right" bordered v-if="MostrarDrawer" show-if-above>
                <div class="dT">
                        <q-label style="font-size: 20px;color:white;text-align: center;">Ingresar Cuentas</q-label>
                        <q-icon class="change-color" name="cancel" style="font-size: 30px; margin-left: 15px;margin-top: 4px;color:red" @click="cerrarDrawer"/>
                </div>
                <div class="datosF" style="margin-top: 10px;">
                        <div class="separar">
                            <label style="font-size: 16px;color:#0B3668;">Tipo</label>
                            <q-select
                                outlined
                                v-model="datos.tipo"
                                :options="Tipos"
                                label="Tipo"
                                class="col-5 col-md-3 q-mx-sm"
                                dense
                                style="color:#0B3668;margin-top: 10px;"
                            />
                        </div>
                        <div class="separar">
                            <label style="font-size: 16px;color:#0B3668;">Codigo</label>
                            <q-input
                                class="codigo"
                                v-model="datos.codigo"
                                dense
                                
                            />
                        </div>
                        <div class="separar">
                            <label style="font-size: 16px;color:#0B3668;">Nombre</label>
                            <q-input
                                class="nombre"
                                v-model="datos.nombre"
                                dense
                            />
                        </div>
                </div>
                <q-btn 
                        class="botonagregar efect" 
                        label="Crear"
                        style="padding-left: 20px; padding-right: 20px"
                        @click="Subirdata"
                    />
                </q-drawer>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { useRouter } from "vue-router";
    import { ref, onMounted} from 'vue';
    import { catalogodb } from "src/boot/Pouchdb";
    import swal from "sweetalert";
    import catalogoData from "src/assets/catalogo.json";
    const botonDeshabilitado = ref(false);

    const cerrarDrawer = () => {
        MostrarDrawer.value = false;
    };
    const cargarcatalogo = async () => {
        try {
            await cargarCatalogoInicial();

        } catch (error) {
            console.error("Error al cargar el catálogo inicial:", error);
        }
    };
    async function cargarCatalogoInicial() {
        try {
            // Itera sobre los datos del archivo JSON y guárdalos en catalogodb
            for (const cuenta of catalogoData) {
            await catalogodb.put({
                _id: new Date().toISOString(),
                tipo: cuenta.tipo,
                codigo: cuenta.codigo,
                nombre: cuenta.nombre,
            });
            }
            botonDeshabilitado.value = true;
            localStorage.setItem("botonDeshabilitado", "true");
            await cargarDatos();
            console.log("Catálogo inicial cargado en catalogodb.");
        } catch (error) {
            console.error("Error al cargar el catálogo en PouchDB:", error);
        }
    }

    const router = useRouter();

    const MostrarDrawer = ref(false);

    const data = ref([]); // Hacemos que 'data' sea reactivo

    // Función para cargar los datos de PouchDB
    async function cargarDatos() {
        try {
            const result = await catalogodb.allDocs({ include_docs: true });
            data.value = result.rows.map(row => row.doc); // Asigna los documentos a 'data'
        } catch (error) {
            console.error("Error loading documents from PouchDB:", error);
        }
    }

    // Llama a cargarDatos cuando el componente se monte
    onMounted(() => {
        cargarDatos();
        botonDeshabilitado.value = localStorage.getItem("botonDeshabilitado") === "true";
    });
    const datos = ref({
        tipo: "",
        codigo: "",
        nombre: "",
    });
    const Tipos =  ['Activo', 'Pasivo', 'Patrimonio', 'Gasto', 'Ingreso', 'Cuenta de Cierre']
    
    const regresar = () => {
        router.push("/panel");
    };
    
    const columns = [
        { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
        { name: 'tipo', align: 'left', label: 'Tipo de Cuenta', field: 'tipo', sortable: true },
        { name: 'nombre', align: 'left', label: 'Nombre de Cuenta', field: 'nombre', sortable: true },
    ];
    
    const customRowClass = (row) => {
        return {
        'custom-row-class': true,
        };
    };
    
    const mostrarDrawer = () => {
        if(MostrarDrawer.value==false){
            MostrarDrawer.value = true;
        }else{
            MostrarDrawer.value = false;
        }
        
    };
    async function Subirdata() {
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
            // Guardar en PouchDB
            const pouchDoc = {
                _id: new Date().toISOString(), // Usamos el mismo ID generado en Firebase para mantener la coherencia
                ...datos.value
            };
            await catalogodb.put(pouchDoc);

            swal({
                title: "Muy Bien",
                text: "La cuenta se creo correctamente",
                icon: "success",
                buttons: false,
                timer: 3000,
            });

            // Reiniciar los valores y cerrar el drawer
            MostrarDrawer.value = false;
            datos.value.tipo = "";
            datos.value.codigo = "";
            datos.value.nombre = "";

            // Recargar los datos de PouchDB para reflejar la nueva cuenta en la tabla
            await cargarDatos();
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
    .boton-deshabilitado {
    background-color: grey !important;
    color: white !important;
    }
</style>
  