<template>
    <section class="h-screen">
        <div class="header-map back-wiki">
            <router-link to="/wiki_home" class="back-map">
                <button class="btn-amarillo">
                    <span class="material-symbols-sharp back-icon">arrow_back_ios</span>Atrás
                </button>
            </router-link>
            <div class="logo-map"><img src="/imgs/logo.png" alt="Logo Plantopia" class=""></div>
        </div>
        <div class="container px-4 mx-auto div-form fondo-blanco">
            <div class="header-form">
                <BaseH1 class="text-center">WIKI PLAGAS</BaseH1>
                <div class="my-6">
                    <BaseLabel>Buscar plaga por nombre:</BaseLabel>
                    <BaseInput class="mb-4" v-model="searchTerm" placeholder="Ingresá el nombre de la plaga" />
                </div>
            </div>
            <div v-if="filteredPlagues.length" class="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                <div v-for="plague in filteredPlagues" :key="plague.id" class="bg-white p-4 rounded shadow-md">
                    <BaseH2>{{ plague.nombre }}</BaseH2>
                    <img :src="'/imgs/plagas/' + plague.imagen" alt="icono de plaga" class="m-2 mx-auto w-1/4">
                    <p class="text-wiki"><strong class="slogan-form">Nombre Científico:</strong> {{
                        plague.nombre_cientifico }}</p>
                    <p class="text-wiki"><strong class="slogan-form">Solución:</strong> {{ plague.solucion }}</p>
                </div>
            </div>
            <div v-else>
                <p>Cargando datos...</p>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

import BaseH1 from '../components/BaseH1.vue';
import BaseH2 from '../components/BaseH2.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';

import { subscribeToAuth } from './../service/auth.js';

export default {
    name: 'wiki_plagues',
    components: { BaseH1, BaseInput, BaseLabel, BaseH2 },

    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            plagues: [],
            searchTerm: '',
        };
    },

    mounted() {
        subscribeToAuth((user) => {
            this.user = { ...user };
            this.fetchPlagues();
        });
    },

    computed: {
        filteredPlagues() {
            return this.plagues.filter((plague) =>
                plague.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        },
    },

    methods: {
        fetchPlagues() {
            axios
                .get('https://api-chota-green.vercel.app/plagues')
                .then((response) => {
                    this.plagues = response.data;
                })
                .catch((error) => {
                    console.error('Error al cargar las plagas:', error);
                });
        },
    },
};
</script>

<style scoped>
.fondo-blanco {
    padding-top: 60px;
}
</style>