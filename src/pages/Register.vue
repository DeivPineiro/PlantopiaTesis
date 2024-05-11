<template>
    <form class="h-screen"
        style=" background-image: url('/imgs/login.jpg'); background-size: cover; background-position: center;"
        action="#" @submit.prevent="handleSubmit">
        <section class="h-screen p-4 section-form">
            <BaseH1 class="text-center titulo-login">Plantopia</BaseH1>
            <p class="slogan-login">Bienvenidos a la revolución <span class="slogan-login">verde</span></p>
            <div class="container px-4 mx-auto div-form">
                <h2 style="color: white;">Registrate</h2>
                <div class="max-w-lg mx-auto py-4">
                    <div class="mb-2">
                        <BaseLabel class="login" for="email">E-mail</BaseLabel>
                        <BaseInput class="login" type="email" id="email" v-model="newUser.email" :disabled="registerCarga" />
                    </div>
                    <div class="mb-2" style="padding-top: 1rem">
                        <BaseLabel class="login" for="password">Contraseña</BaseLabel>
                        <BaseInput class="login" :type="showPassword ? 'text' : 'password'" type="password" id="password" v-model="newUser.password" :disabled="registerCarga" />
                        <button class="toggle-password" @click="togglePasswordVisibility" style="position: absolute; color: white; left: 270px;">
                            <span
                                v-html="showPassword ? '<i class=\'bi bi-eye-slash\'></i>' : '<i class=\'bi bi-eye\'></i>'"></span>
                        </button>
                    </div>
                    <BaseButton class="mt-10" :cargando="registerCarga">Registrarse</BaseButton>
                    <p class="registrarse">
                        ¿Ya tenés una cuenta?<router-link to="/login" class="registrarse"> ¡Iniciá Sesión!</router-link>
                    </p>
                </div>
            </div>
        </section>
    </form>
</template>
<script>
import BaseButton from '../components/BaseButton.vue';
import BaseH1 from '../components/BaseH1.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseLabel from '../components/BaseLabel.vue';
import { registrar } from '../service/auth';

export default {
    name: 'Register',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1 },
    data() {

        return {

            registerCarga: false,
            showPassword: false,
            newUser: {

                email: '',
                password: '',
                rol: 'usuario',
                calle: '',
                altura: '',
                localidad: '',
                nombre: ''

            }

        }

    },
    methods: {
        togglePasswordVisibility(event) {
            event.preventDefault();
            this.showPassword = !this.showPassword;
        },
        async handleSubmit() {

            try {

                this.registerCarga = true;
                await registrar({ ...this.newUser });
                this.$router.push('/');

            } catch (error) {

            }
            this.registerCarga = false;


        }


    },
}
</script>
<style></style>