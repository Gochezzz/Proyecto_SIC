<template>
  <div>
    <q-page class="Ordenar" style="background-image: url('https://boeke-partner.de/wp-content/uploads/2019/01/kontakt-slider.jpg') ">
      <div class="login" style="margin-top: 170px;">
        <p style="color: white;font-size: 60px;">Iniciar Sesion</p>
        <div class="form">
          <q-btn
            class="botoniniciar efect"
            style="padding-left: 20px; padding-right: 20px;"
            @click="IniciarSesion"
          >
            <label color="white" style="font-size: 20px;">Iniciar Sesion con Google</label>
            <q-avatar style="margin-left: 40px;">
              <img src="https://res.cloudinary.com/amenitiz/image/upload/w_500,dpr_auto,f_auto,q_auto:good/v1670596120/jd8epqybnwi12n8m2znp.png">
            </q-avatar>
          </q-btn>
        </div>
      </div>
      <div class="ImgP" style="margin-top: 115px;margin-left: 60px;">
        <q-avatar style="margin-left: 40px; font-size: 350px;">
          <img :src="photo">
        </q-avatar>
        <div style="color: white; font-size: 26px; margin-top: 10px;margin-left: 50px;">
          {{ name || '' }}
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { catalogodb, cuentasdb } from "src/boot/Pouchdb";

const router = useRouter();

const IniciarSesion = async () => {
  try {
    await limpiarBasesDeDatos();
    router.push("/panel");
  } catch (error) {
    console.error("Error al cargar el catálogo inicial:", error);
  }
};
async function limpiarBasesDeDatos() {
  try {
    // Limpia catalogodb
    const catalogoDocs = await catalogodb.allDocs();
    for (const doc of catalogoDocs.rows) {
      await catalogodb.remove(doc.id, doc.value.rev);
    }
    console.log("Catalogodb limpiada correctamente.");

    // Limpia cuentasdb
    const cuentasDocs = await cuentasdb.allDocs();
    for (const doc of cuentasDocs.rows) {
      await cuentasdb.remove(doc.id, doc.value.rev);
    }
    console.log("Cuentasdb limpiada correctamente.");
    
    alert("Bases de datos limpiadas correctamente.");
  } catch (error) {
    console.error("Error al limpiar las bases de datos:", error);
  }
}
</script>