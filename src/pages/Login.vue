<template>
    <form class="h-screen"
        style=" background-image: url('/imgs/login.jpg'); background-size: cover; background-position: center;"
        action="#" @submit.prevent="logining">
        <section class="p-4 h-screen section-form">
            <BaseH1 class="text-center titulo-login">Plantopia</BaseH1>
            <p class="slogan-login">Bienvenidos a la revolución <span>verde</span></p>
            <div class="container px-4 mx-auto div-form">
                <h2 style="color: white;">Ingresá tus credenciales</h2>
                <div class="max-w-lg mx-auto py-4">
                    <div class="mb-2">
                        <BaseLabel class="login" for="email">E-mail</BaseLabel>
                        <BaseInput class="login" type="email" id="email" autocomplete="email" v-model="form.email" :disabled="isLoading" />
                    </div>
                    <div class="mb-2"
                        style="display: flex; flex-direction: column; align-items: flex-end;">
                        <BaseLabel class="login" for="password" style="width: 100%;">Contraseña</BaseLabel>
                        <BaseInput class="login" :type="showPassword ? 'text' : 'password'" type="password"
                            id="password" autocomplete="current-password" v-model="form.password" :disabled="isLoading" />
                        <button class="toggle-password btn-eye" @click="togglePasswordVisibility">
                            <span
                                v-html="showPassword ? '<i class=\'bi bi-eye-slash\'></i>' : '<i class=\'bi bi-eye\'></i>'"></span>
                        </button>
                    </div>
                    <div v-if="errorMessage" class="error-login">{{ errorMessage }}</div>
                    <BaseButton class="mt-10" :cargando="isLoading">Ingresar</BaseButton>
                    <p class="registrarse">
                        ¿No tenés una cuenta?<router-link class="registrarse" to="/register"> ¡Registrate!</router-link>
                    </p>
                </div>
            </div>
        </section>
    </form>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

import { login } from '../service/auth.js';

export default {
    name: 'Login',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1 },
    emits: ['logged'],
    data() {
        return {
            isLoading: false,
            form: {
                email: '',
                password: ''
            },
            errorMessage: '',
            showPassword: false
        };
    },
    methods: {
        togglePasswordVisibility(event) {
            event.preventDefault();
            this.showPassword = !this.showPassword;
        },
        logining() {
            this.isLoading = true;
            this.errorMessage = '';

            login({
                ...this.form
            }).then(response => {
                if (response.code) {
                    switch (response.code) {
                        case 'auth/invalid-email':
                            this.errorMessage = 'Por favor, ingresá tu correo electrónico.';
                            break;
                        case 'auth/missing-password':
                            this.errorMessage = 'Por favor, ingresá tu contraseña.';
                            break;
                        case 'auth/invalid-login-credentials':
                            this.errorMessage = 'Credenciales inválidas. Por favor, verificá tu correo y/o contraseña.';
                            break;
                        case 'auth/too-many-requests':
                            this.errorMessage = 'Demasiados intentos. Por favor, intentá de nuevo más tarde.';
                            break;
                        default:
                            this.errorMessage = 'Error al iniciar sesión. Por favor, verificá tu correo y/o contraseña.';
                    }
                } else {
                    this.$emit('logged', { ...response.user });
                    this.$router.push('/home');
                }
            }).finally(() => {
                this.isLoading = false;
            });
        }
    }
};
</script>