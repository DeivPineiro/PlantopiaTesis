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
                <BaseH1 class="text-center">WIKI PLANTAS</BaseH1>
                <div class="my-6">
                    <BaseLabel>Buscar planta por nombre:</BaseLabel>
                    <BaseInput v-model="searchTerm" placeholder="Ingresá el nombre de la planta" />
                </div>
            </div>
            <div v-if="filteredPlants.length" class="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                <div v-for="plant in filteredPlants" :key="plant.id" class="bg-white p-4 rounded shadow-md">
                    <BaseH2>{{ plant.nombre }}</BaseH2>
                    <img :src="'/imgs/plantas/' + plant.imagen" :alt="'Imagen de la planta ' + plant.nombre"
                        class="m-2 mx-auto w-1/4">
                    <p class="text-wiki"><strong class="slogan-form">Nombre Científico:</strong> {{
                        plant.nombre_cientifico }}</p>
                    <p class="text-wiki"><strong class="slogan-form">Estación:</strong> {{ plant.estacion }}</p>
                    <p class="text-wiki"><strong class="slogan-form">Cosecha aprox:</strong> {{ plant.kg_cosecha_km2 }}
                        kg/km²</p>
                    <p class="text-wiki"><strong class="slogan-form">Tipo de luz:</strong> {{ plant.luz }}</p>
                    <p class="text-wiki"><strong class="slogan-form">Ph:</strong> {{ plant.ph }}</p>
                    <p class="text-wiki"><strong class="slogan-form">Tipo de planta:</strong> {{ plant.tipo }}</p>
                    <p class="text-wiki"><strong class="slogan-form">Tipo de terreno:</strong> {{ plant.tipo_terreno }}
                    </p>
                    <p class="text-wiki leading-8">
                        <strong class="slogan-form">Plagas: </strong>
                        <span v-for="plagueId in plant.plagas" :key="plagueId">
                            <router-link :to="{ name: 'plagueDetails', params: { idPlague: plagueId } }"
                                class="text-green-600 hover:underline" style="text-decoration: underline;">
                                {{ getPlagueName(plagueId) }}
                            </router-link>
                            <span v-if="plant.plagas.indexOf(plagueId) !== plant.plagas.length - 1">, </span>
                        </span>
                    </p>
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
    name: 'wiki_plants',
    components: { BaseLabel, BaseInput, BaseH1, BaseH2 },

    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            plants: [],
            plagues: [],
            searchTerm: '', // Nuevo dato para almacenar el término de búsqueda
        };
    },

    async mounted() {
        await subscribeToAuth(async (user) => {
            this.user = { ...user };
            await this.fetchPlants();
            await this.fetchPlagues();
        });
    },

    computed: {
        filteredPlants() {
            const normalizedSearchTerm = this.searchTerm.toLowerCase().trim();
            return this.plants.filter(plant =>
                plant.nombre.toLowerCase().includes(normalizedSearchTerm)
            );
        },
    },

    methods: {
        async fetchPlants() {
            try {
                const response = await axios.get('https://api-chota-green.vercel.app/plants');
                this.plants = response.data;
            } catch (error) {
                console.error('Error al cargar las plantas:', error);
            }
        },

        async fetchPlagues() {
            try {
                const response = await axios.get('https://api-chota-green.vercel.app/plagues');
                this.plagues = response.data;
            } catch (error) {
                console.error('Error al cargar las plagas:', error);
            }
        },

        getPlagueName(plagueId) {
            const foundPlague = this.plagues.find(plague => String(plague.id) === String(plagueId));
            return foundPlague ? foundPlague.nombre : 'Plaga no encontrada';
        },
    },
};
</script>

<style scoped>
.fondo-blanco {
    padding-top: 60px;
}
</style>