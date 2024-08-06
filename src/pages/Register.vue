<template>
    <form class="h-screen"
        style=" background-image: url('/imgs/login.jpg'); background-size: cover; background-position: center;"
        action="#" @submit.prevent="handleSubmit">
        <section class="h-screen p-4 section-form">
            <BaseH1 class="text-center titulo-login">Plantopia</BaseH1>
            <p class="slogan-login">Bienvenidos a la revolución <span>verde</span></p>
            <div class="container px-4 mx-auto div-form">
                <h2 style="color: white;">Registrate</h2>
                <div class="max-w-lg mx-auto py-4">
                    <div class="mb-2">
                        <BaseLabel class="login" for="email">E-mail</BaseLabel>
                        <BaseInput class="login" type="email" id="email" v-model="newUser.email"
                            :disabled="isLoading" />
                    </div>
                    <div class="mb-2"
                        style="display: flex; flex-direction: column; align-items: flex-end;">
                        <BaseLabel class="login" for="password" style="width: 100%;">Contraseña</BaseLabel>
                        <BaseInput class="login" :type="showPassword ? 'text' : 'password'" type="password"
                            id="password" v-model="newUser.password" :disabled="isLoading" />
                        <button class="toggle-password btn-eye" @click="togglePasswordVisibility">
                            <span
                                v-html="showPassword ? '<i class=\'bi bi-eye-slash\'></i>' : '<i class=\'bi bi-eye\'></i>'"></span>
                        </button>
                    </div>
                    <div v-if="errorMessage" class="error-login">{{ errorMessage }}</div>
                    <BaseButton class="mt-10" :cargando="isLoading">Registrarse</BaseButton>
                    <p class="registrarse">
                        ¿Ya tenés una cuenta?<router-link to="/login" class="registrarse"> ¡Iniciá Sesión!</router-link>
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

import { register, checkExistingEmail } from '../service/auth';

export default {
    name: 'Register',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1 },
    data() {
        return {
            isLoading: false,
            showPassword: false,
            errorMessage: '',
            newUser: {
                email: '',
                password: '',
                rol: 'usuario',
            }
        }
    },
    methods: {
        togglePasswordVisibility(event) {
            event.preventDefault();
            this.showPassword = !this.showPassword;
        },
        async handleSubmit() {
            this.errorMessage = '';
            this.isLoading = true;

            try {
                const validNewUser = this.registerValidations(this.newUser);
                const existeEmail = await checkExistingEmail(this.newUser.email);
                await register({ ...this.newUser });
                this.$router.push('/');
            } catch (error) {
                switch (error.code) {
                    case 'auth/missing-email':
                        this.errorMessage = 'Por favor, ingresá tu correo electrónico.';
                        break;
                    case 'auth/invalid-email':
                        this.errorMessage = 'Por favor, ingresá un correo electrónico válido.';
                        break;
                    case 'auth/missing-password':
                        this.errorMessage = 'Por favor, ingresá una contraseña.';
                        break;
                    case 'auth/weak-password':
                        this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
                        break;
                    case 'auth/email-already-in-use':
                        this.errorMessage = 'Este correo electrónico ya está registrado.';
                        break;
                    default:
                        this.errorMessage = 'Error al registrar. Por favor, intentá de nuevo.';
                }
            } finally {
                this.isLoading = false;
            }
        },
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        registerValidations(newUser) {
            if (!newUser.email) {
                const error = new Error();
                error.code = 'auth/missing-email';
                throw error;
            } else if (!this.isValidEmail(newUser.email)) {
                const error = new Error();
                error.code = 'auth/invalid-email';
                throw error;
            } else if (!newUser.password) {
                const error = new Error();
                error.code = 'auth/missing-password';
                throw error;
            } else if (newUser.password.length < 6) {
                const error = new Error();
                error.code = 'auth/weak-password';
                throw error;
            }
        }
    },
}
</script>