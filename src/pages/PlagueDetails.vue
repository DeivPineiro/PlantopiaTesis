<template>
    <section class="h-screen">
        <div class="header-map back-wiki">
            <router-link to="/wiki_home/wiki_plants" class="back-map">
                <button class="btn-amarillo">
                    <span class="material-symbols-sharp back-icon">arrow_back_ios</span>Atrás
                </button>
            </router-link>
            <div class="logo-map"><img src="/imgs/logo.png" alt="Logo Plantopia" class=""></div>
        </div>
        <div class="container px-4 mx-auto div-form fondo-blanco">
            <div class="header-form" style="padding-top:70px;">
                <BaseH1 class="text-center hidden">Detalle {{ plagueDetails ? plagueDetails.nombre : '' }}</BaseH1>
            </div>
            <div v-if="plagueDetails" class="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                <div  class="bg-white p-4 rounded shadow-md">
                    <BaseH2>{{ plagueDetails.nombre }}</BaseH2>
                    <img :src="'/imgs/plagas/' + plagueDetails.imagen" alt="icono de plaga" class="m-10 mx-auto w-1/2">
                    <p class="my-3"><strong>Nombre Científico:</strong> {{ plagueDetails.nombre_cientifico }}</p>
                    <p><strong>Solución:</strong> {{ plagueDetails.solucion }}</p>
                </div>
            </div>
            <div v-else>
                <p>Cargando detalles de la plaga...</p>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { subscribeToAuth } from './../service/auth.js';
import BaseH1 from '../components/BaseH1.vue';
import BaseH2 from '../components/BaseH2.vue';
export default {
    name: 'plagueDetails',
    components: { BaseH1, BaseH2 },

    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            plagueDetails: null,
        };
    },
    mounted() {
        subscribeToAuth((user) => {
            this.user = { ...user };
            this.fetchPlagueDetails();
        });
    },
    methods: {
        fetchPlagueDetails() {
            const idPlague = this.$route.params.idPlague;
            axios
                .get(`https://api-chota-green.vercel.app/plagues/${idPlague}`)
                .then((response) => {
                    this.plagueDetails = response.data;
                })
                .catch((error) => {
                    console.error('Error al cargar los detalles de la plaga:', error);
                });
        },
    },
};
</script>

<style></style>