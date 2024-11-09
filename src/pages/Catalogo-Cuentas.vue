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
        <q-select
            outlined
            v-model="Estados.name"
            :options="estados"
            label="Estados Financieros"
            class="col-5 col-md-3 q-mx-sm"
            dense
            clearable
            style="color:#0B3668;margin-top: 40px;margin-left: 40px;width: 240px;"
        />
        <div class="Ordenar">
            <div class="tabla">
            <q-table
                    :title="activetitulo"
                    :rows="data"
                    :columns="activeColumns"
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
                    :disable="botonDeshabilitadoER && Estados.name === 'Estado de Resultados'"
                    :class="{ 'boton-deshabilitado': botonDeshabilitadoER && Estados.name === 'Estado de Resultados' }"
                    class="botonagregar efect" 
                    label="Cargar Catalogo"
                    v-if="Estados.name === 'Estado de Resultados'"
                    style="padding-left: 20px; padding-right: 20px;"
                    @click="cargarinfoER"
                />
                <q-btn 
                    :disable="botonDeshabilitadoBG && Estados.name === 'Balance General'"
                    :class="{ 'boton-deshabilitado': botonDeshabilitadoBG && Estados.name === 'Balance General' }"
                    class="botonagregar efect" 
                    label="Cargar Catalogo"
                    v-if="Estados.name === 'Balance General'"
                    style="padding-left: 20px; padding-right: 20px;"
                    @click="cargarinfoBG"
                />
                <q-btn 
                    class="botonagregar efect" 
                    label="Agregar Cuenta"
                    style="padding-left: 20px; padding-right: 20px;"
                    @click="mostrarDrawer"
                    v-if="Estados.name === 'Estado de Resultados'||Estados.name === 'Balance General'"
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
                                :options="activeTipos"
                                label="Tipo"
                                class="col-5 col-md-3 q-mx-sm"
                                dense
                                style="color:#0B3668;margin-top: 10px;"
                            />
                        </div>
                        <div class="separar" v-if="Estados.name === 'Balance General'">
                            <label style="font-size: 16px;color:#0B3668;">SubTipo</label>
                            <q-select
                                outlined
                                v-model="datos.subtipo"
                                :options="Subtipos"
                                label="SubTipo"
                                class="col-5 col-md-3 q-mx-sm"
                                dense
                                style="color:#0B3668;margin-top: 10px;"
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
    import { ref, computed, onMounted, watch} from 'vue';
    import { catalogoER, catalogoBG } from "src/boot/Pouchdb";
    import swal from "sweetalert";
    import catalogoBGJ from "src/assets/catalogoBG.json"
    import catalogoERJ from "src/assets/catalogoER.json"
    const botonDeshabilitadoER = ref(localStorage.getItem("botonDeshabilitadoER") === "true");
    const botonDeshabilitadoBG = ref(localStorage.getItem("botonDeshabilitadoBG") === "true");
    //cambiar
    const Estados = ref({name: ""});
    const estados =  ['Estado de Resultados', 'Balance General']
    const cerrarDrawer = () => {
        MostrarDrawer.value = false;
        datos.value.tipo = "";
        datos.value.subtipo = "";
        datos.value.nombre = "";
    };
    async function cargarinfoBG() {
        try {
            // Itera sobre los datos del archivo JSON y guárdalos en catalogodb
            for (const cuenta of catalogoBGJ) {
            await catalogoBG.put({
                _id: new Date().toISOString(),
                tipo: cuenta.tipo,
                subtipo: cuenta.subtipo,
                nombre: cuenta.nombre,
            });
            }
            botonDeshabilitadoBG.value = true;
            localStorage.setItem("botonDeshabilitadoBG", "true");
            await cargarDatos();
            console.log("Catálogo BG cargado en PouchDB.");
        } catch (error) {
            console.error("Error al cargar el catálogo en PouchDB:", error);
        }
    }
    async function cargarinfoER() {
        try {
            // Itera sobre los datos del archivo JSON y guárdalos en catalogodb
            for (const cuenta of catalogoERJ) {
            await catalogoER.put({
                _id: new Date().toISOString(),
                tipo: cuenta.tipo,
                nombre: cuenta.nombre,
            });
            }
            botonDeshabilitadoER.value = true;
            localStorage.setItem("botonDeshabilitadoER", "true");
            await cargarDatos();
            console.log("Catálogo ER cargado en PouchDB.");
        } catch (error) {
            console.error("Error al cargar el catálogo en PouchDB:", error);
        }
    }

    const router = useRouter();

    const MostrarDrawer = ref(false);

    const data = ref([]); // Hacemos que 'data' sea reactivo

    // Función para cargar los datos de PouchDB
    // Función para cargar los datos de PouchDB según el estado seleccionado
    async function cargarDatos() {
        try {
            if (Estados.value.name === 'Estado de Resultados') {
                const result = await catalogoER.allDocs({ include_docs: true });
                data.value = result.rows.map(row => row.doc);
            } else if (Estados.value.name === 'Balance General') {
                const result = await catalogoBG.allDocs({ include_docs: true });
                data.value = result.rows.map(row => row.doc);
            }
            console.log("Datos cargados:", data.value);
        } catch (error) {
            console.error("Error al cargar documentos desde PouchDB:", error);
        }
    }
        // Watcher para cargar datos reactivamente cuando cambia `Estados.name`
    watch(() => Estados.value.name, () => {
        cargarDatos();
    });

    // Llama a cargarDatos cuando el componente se monte
    onMounted(() => {
        cargarDatos();
        botonDeshabilitadoER.value = localStorage.getItem("botonDeshabilitadoER") === "true";
        botonDeshabilitadoBG.value = localStorage.getItem("botonDeshabilitadoBG") === "true";
    });
    const datos = ref({
        tipo: "",
        subtipo: "",
        nombre: "",
    });
    const Tipos =  ['Activo', 'Pasivo', 'Capital']
    const Subtipos =  ['Corriente', 'No Corriente', 'Capital Contable']
    const TiposER =  ['Ingreso', 'Gasto']
    const activeTipos = computed(() => {
    return Estados.value.name === 'Estado de Resultados' ? TiposER : Tipos;
    });
    const regresar = () => {
        router.push("/panel");
    };
    
    const columnsER = [
        { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo', sortable: true },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
    ];
    const columns = [
        { name: 'tipo', align: 'left', label: 'Tipo', field: 'tipo', sortable: true },
        { name: 'subtipo', align: 'left', label: 'SubTipo', field: 'subtipo', sortable: true },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
    ];
    // Computed property for dynamically setting table columns
    const activeColumns = computed(() => {
    return Estados.value.name === 'Estado de Resultados' ? columnsER :  Estados.value.name === 'Balance General' ? columns: [];
    });
     // Computed property for dynamically setting table columns
     const activetitulo = computed(() => {
    return Estados.value.name === 'Estado de Resultados' ? "Estado de Resultados" : Estados.value.name === 'Balance General' ? "Balance General":'';
    });
    
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
                if (!datos.value.tipo || !datos.value.nombre) {
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
            // Guardar en PouchDB
            const pouchDoc = {
                _id: new Date().toISOString(), // Usamos el mismo ID generado en Firebase para mantener la coherencia
                ...datos.value
            };
            if (Estados.value.name === 'Estado de Resultados') {
                await catalogoER.put(pouchDoc);
            }else  if (Estados.value.name === 'Balance General') {
                await catalogoBG.put(pouchDoc);
            }
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
            datos.value.subtipo = "";
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
  