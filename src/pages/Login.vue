<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title>
        
      </q-toolbar-title>
  </q-toolbar>
  </q-header>
  <q-page class="Ordenar">
    <div class="login">
      <p>Iniciar Sesion</p>
        <div class="form">
          <q-input type="text" v-model="Login.user" placeholder="nombre" label="Usuario"/>
          <q-input type="password" v-model="Login.password" placeholder="**********" label="Contraseña"/>
          <q-btn 
            class="botoniniciar efect" 
            color="secondary"
            label="Iniciar Sesion"
            style="padding-left: 20px; padding-right: 20px"
            @click="IniciarSesion"
          />
        </div>
    </div>
    <div class="ImgP">
      <q-img src="https://tocmexico.s3.amazonaws.com/full/cdn/2023/01/perfil.png" style="height: 300px;width: 300px;margin-left: 170px;"/>
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref} from 'vue'
import { useRouter } from "vue-router";

const router = useRouter();

const Login = ref({
  user: "",
  password: "",
});
const IniciarSesion = () =>{
  router.push("/panel");
}
defineComponent({
  name: 'IndexPage'
})
</script>
