<template>
    <section class="h-screen">
        <div class="header-map back-wiki">
            <router-link to="/home" class="back-map">
                <button class="btn-amarillo">
                    <span class="material-symbols-sharp back-icon">arrow_back_ios</span>Atrás
                </button>
            </router-link>
            <div class="logo-map"><img src="/imgs/logo.png" alt="Logo Plantopia" class=""></div>
        </div>
        <div class="perfil">
            <BaseH1 class="text-center">Perfil de {{ getEmailPrefix(user.email) }}</BaseH1>
            <p class=""><strong>Email:</strong> {{ user.email }}</p>
        </div>
    </section>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuth } from "./../service/auth.js";

export default {
    name: 'perfil',
    components: { BaseH1 },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    mounted() {
        subscribeToAuth(user => this.user = { ...user });
    },
    methods: {
        getEmailPrefix(email) {
            return email && email.includes('@') ? email.split('@')[0] : email;
        },
    },
}
</script>