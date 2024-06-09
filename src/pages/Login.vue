<template>
    <form class="h-screen"
        style=" background-image: url('/imgs/login.jpg'); background-size: cover; background-position: center;"
        action="#" @submit.prevent="Logining">
        <section class="p-4 h-screen section-form">
            <BaseH1 class="text-center titulo-login">Plantopia</BaseH1>
            <p class="slogan-login">Bienvenidos a la revolución <span class="slogan-login">verde</span></p>
            <div class="container px-4 mx-auto div-form">
                <h2 style="color: white;">Ingresá tus credenciales</h2>
                <div class="max-w-lg mx-auto py-4">
                    <div class="mb-2">
                        <BaseLabel class="login" for="email">E-mail</BaseLabel>
                        <BaseInput class="login" type="email" id="email" v-model="form.email" :disabled="logingCarga" />
                    </div>
                    <div class="mb-2" style="padding-top: 1rem">
                        <BaseLabel class="login" for="password">Contraseña</BaseLabel>
                        <BaseInput class="login" :type="showPassword ? 'text' : 'password'" type="password"
                            id="password" v-model="form.password" :disabled="logingCarga" />
                        <button class="toggle-password" @click="togglePasswordVisibility" style="position: absolute; color: white; left: 270px;">
                            <span
                                v-html="showPassword ? '<i class=\'bi bi-eye-slash\'></i>' : '<i class=\'bi bi-eye\'></i>'"></span>
                        </button>
                    </div>
                    <div v-if="errorMensaje" class="error-login">{{
                        errorMensaje }}</div>
                    <BaseButton class="mt-10" :cargando="logingCarga">Ingresar</BaseButton>
                    <p class="registrarse">
                        ¿No tenés una cuenta?<router-link class="registrarse" to="/register"> ¡Registrate!</router-link>
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
import { login } from '../service/auth.js';

export default {
    name: 'Login',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1 },
    emits: ['logged'],
    data() {
        return {
            logingCarga: false,
            form: {
                email: '',
                password: ''
            },
            errorMensaje: '',
            showPassword: false
        };
    },
    methods: {
        togglePasswordVisibility(event) {
            event.preventDefault();
            this.showPassword = !this.showPassword;
        },
        Logining() {
            this.logingCarga = true;
            this.errorMensaje = '';

            login({
                ...this.form
            })
                .then(response => {
                    console.log(response);
                    if (response.code) {
                        switch (response.code) {
                            case 'auth/invalid-email':
                                this.errorMensaje = 'Por favor, ingresa tu correo electrónico.';
                                break;
                            case 'auth/missing-password':
                                this.errorMensaje = 'Por favor, ingresa tu contraseña.';
                                break;
                            case 'auth/invalid-login-credentials':
                                this.errorMensaje = 'Credenciales inválidas. Por favor, verifica tu correo y/o contraseña.';
                                break;
                            case 'auth/too-many-requests':
                                this.errorMensaje = 'Demasiados intentos. Por favor, inténtalo de nuevo más tarde.';
                                break;
                            default:
                                this.errorMensaje = 'Error al iniciar sesión. Por favor, verifica tu correo y/o contraseña.';
                        }
                    } else {
                        this.$emit('logged', { ...response.user });
                        this.$router.push('/home');
                    }
                })
                .finally(() => {
                    this.logingCarga = false;
                });
        }
    }
};
</script>

<style></style>