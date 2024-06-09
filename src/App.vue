<template>
  <div id="app" class="h-screen w-screen">
    <transition name="fade">
      <img v-if="showWelcomeImage" src="/imgs/inicio.jpg" alt="Imagen de bienvenida"
        class="w-screen h-screen object-cover" style="position: absolute; top: 0; left: 0;" />
    </transition>
    <div v-if="showWelcomeImage" class="h-full" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      <dotlottie-player src="https://lottie.host/d41c351a-0fe2-40a7-ac81-76e9bbb77354/MhYp2kqk45.json"
        background="transparent" speed="1"
        style="width: 300px; height: 300px; position: absolute; top: 75%; left: 50%; transform: translate(-50%, -50%); width: 40%;"
        loop autoplay></dotlottie-player>
    </div>
    <div v-if="!showWelcomeImage" class="h-full fondo-app"
     >
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { subscribeToAuth, logOut } from './service/auth.js';

export default {
  name: "App",
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
