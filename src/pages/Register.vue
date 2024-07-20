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
                            :disabled="registerCarga" />
                    </div>
                    <div class="mb-2"
                        style="padding-top: 1rem; display: flex; flex-direction: column; align-items: flex-end;">
                        <BaseLabel class="login" for="password" style="width: 100%;">Contraseña</BaseLabel>
                        <BaseInput class="login" :type="showPassword ? 'text' : 'password'" type="password"
                            id="password" v-model="newUser.password" :disabled="registerCarga" />
                        <button class="toggle-password btn-eye" @click="togglePasswordVisibility">
                            <span
                                v-html="showPassword ? '<i class=\'bi bi-eye-slash\'></i>' : '<i class=\'bi bi-eye\'></i>'"></span>
                        </button>
                    </div>
                    <div v-if="errorMensaje" class="error-login">{{ errorMensaje }}</div>
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
import BaseH1 from '../components/BaseH1.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

import { registrar, verificarEmailExistente } from '../service/auth';

export default {
    name: 'Register',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1 },
    data() {
        return {
            registerCarga: false,
            showPassword: false,
            errorMensaje: '',
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
            this.errorMensaje = '';
            this.registerCarga = true;

            try {
                const validNewUser = this.validacionesRegister(this.newUser);
                const existeEmail = await verificarEmailExistente(this.newUser.email);
                await registrar({ ...this.newUser });
                this.$router.push('/');
            } catch (error) {
                switch (error.code) {
                    case 'auth/missing-email':
                        this.errorMensaje = 'Por favor, ingresá tu correo electrónico.';
                        break;
                    case 'auth/invalid-email':
                        this.errorMensaje = 'Por favor, ingresá un correo electrónico válido.';
                        break;
                    case 'auth/missing-password':
                        this.errorMensaje = 'Por favor, ingresá una contraseña.';
                        break;
                    case 'auth/weak-password':
                        this.errorMensaje = 'La contraseña debe tener al menos 6 caracteres.';
                        break;
                    case 'auth/email-already-in-use':
                        this.errorMensaje = 'Este correo electrónico ya está registrado.';
                        break;
                    default:
                        this.errorMensaje = 'Error al registrar. Por favor, intentá de nuevo.';
                }
            } finally {
                this.registerCarga = false;
            }
        },
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        validacionesRegister(newUser) {
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