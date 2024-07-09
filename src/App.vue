<template>
  <div id="app" class="h-screen w-screen">
    <transition name="fade">
      <img v-if="showWelcomeImage" src="/imgs/inicio.jpg" alt="Imagen de bienvenida"
        class="w-screen h-screen object-cover" style="position: absolute; top: 0; left: 0;" />
    </transition>
    <div v-if="showWelcomeImage" class="h-full" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      <Carga class="app" style=" position: absolute; top: 75%; left: 50%; transform: translateX(-50%);" />
    </div>
    <div v-if="!showWelcomeImage" class="h-full fondo-app" style="">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { subscribeToAuth, logOut } from './service/auth.js';
import Carga from './components/Carga.vue';

export default {
  name: "App",
  components: { Carga },
  data() {
    return {
      showWelcomeImage: true,
      showNavigation: true,
      user: {
        id: null,
        email: null,
        rol: null,
      },
    };
  },

  methods: {
    logOuting() {
      logOut();
      this.$router.push('/login');
    },
  },
  mounted() {
    subscribeToAuth(user => {
      this.user = { ...user };

      setTimeout(() => {
        this.showWelcomeImage = false;
      }, 3000);
    });
  },
};
</script>

<style>
.app .loader {
  --_g: no-repeat radial-gradient(farthest-side, #000000 90%, #9f9c9c00); /* Cambia el color aquí */
  background: var(--_g), var(--_g), var(--_g), var(--_g);
  background-size: 15% 35%;
}
</style>
