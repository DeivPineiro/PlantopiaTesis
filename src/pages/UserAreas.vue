<template>
    <section class="h-screen">
        <div class="header-map">
            <router-link to="/home" class="back-map">
                <button class="btn-amarillo">
                    <span class="material-symbols-sharp back-icon">arrow_back_ios</span>Atrás
                </button>
            </router-link>
            <div class="logo-map"><img src="/imgs/logo.png" alt="Logo Plantopia" class=""></div>
        </div>
        <div class="container px-4 mx-auto div-form fondo-blanco">
            <div class="header-form">
                <BaseH1 class="text-center">TUS CULTIVO</BaseH1>
            </div>
            <div class="grid grid-cols-1 gap-1">
                <div v-if="!areas || areas.length === 0" class="text-center font-bold text-gray-600 mt-4">
                    <p>No tienes áreas cargadas.</p>
                </div>
                <div v-else>
                    <div class="box-cultivos" v-for="area in areas" :key="area.id">
                        <div class="">
                            <p class="font-bold">Nombre: <span class="font-normal">{{ area.nombreCosecha }}</span></p>
                            <p class="font-bold">Peso: <span class="font-normal">{{ area.pesoPorCosecha }} kg/km²</span>
                            </p>
                            <p class="font-bold">USD$ x T/km²: <span class="font-normal">${{ area.valorPorTonelada
                                    }}</span></p>
                            <p class="font-bold">Área: <span class="font-normal">{{ area.areaKilometros.toFixed(3) }}
                                    km²</span></p>
                            <p class="font-bold">Plantación: <span class="font-normal">{{
                                    formatFecha(area.diaPlantacion) }}</span></p>
                            <p class="font-bold">Cosecha: <span class="font-normal">{{ formatFecha(area.diaCosecha)
                                    }}</span></p>
                            <div class="flex items-center">
                                <p class="font-bold mr-2">Color:</p>
                                <div class="w-6 h-6 mr-2"
                                    :style="{ backgroundColor: area.colorArea, border: '1px solid #000' }"></div>
                                <p class="font-normal">{{ traducirColor(area.colorArea) }}</p>
                            </div>
                            <p class="font-bold text-green-700 mt-2">Valor total: <span
                                    class="font-normal text-black">USD ${{
                                        (((area.areaKilometros * area.pesoPorCosecha) / 1000) *
                                            area.valorPorTonelada).toFixed(2) }}
                                </span></p>
                        </div>
                        <div class="flex flex-col justify-between items-end">
                            <div class="dropdown">
                                <button class="dropbtn rounded-full p-1"><span
                                        class="material-symbols-sharp">menu</span></button>
                                <div class="dropdown-content">
                                    <a @click="goToHarvest(area.id, area.areaKilometros)">Editar</a>
                                    <a @click="goToMap(area.poligons, area.id, area.colorArea)">Ver</a>
                                    <a @click="delArea(this.user.id, area.id)">Eliminar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

import { subscribeToAuth } from "./../service/auth.js";
import { findUserAreas, deleteArea } from "./../service/area.js";
import { formatFecha } from "../helpers/fecha.js";

export default {
    name: 'userAreas',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1 },

    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            areas: null,
            areasUnsuscribe: () => { },
            totalCobertura: null
        }
    },
    mounted() {
        subscribeToAuth(user => this.user = { ...user });
        this.areasUnsuscribe = findUserAreas(this.user.id, (areas) => {
            this.areas = areas;
        });
    },
    methods: {
        formatFecha,
        goToMap(poligons, id, colorArea) {
            this.$router.push({
                path: '/user/areas/irAMapa',
                query: {
                    id: id,
                    poligons: poligons,
                    colorArea: colorArea,
                },
            });
        },

        goToHarvest(idArea, areaKilometros) {
            this.$router.push({
                path: '/user/areas/editAreas',
                query: {
                    idArea: idArea,
                    areaKilometros: areaKilometros,
                },
            });
        },

        delArea(idUser, idArea) {
            const confirmDelete = window.confirm('¿Estás seguro de eliminar esta área?');
            if (confirmDelete) {
                deleteArea(idUser, idArea);
                this.$router.push({ path: '/user/areas' });
            }
        },

        traducirColor(color) {
            switch (color) {
                case 'red':
                    return 'Rojo';
                case 'blue':
                    return 'Azul';
                case 'green':
                    return 'Verde';
                case 'yellow':
                    return 'Amarillo';
                case 'orange':
                    return 'Naranja';
                case 'purple':
                    return 'Morado';
                case 'pink':
                    return 'Rosa';
                case 'black':
                    return 'Negro';
                case 'white':
                    return 'Blanco';
                case 'gray':
                    return 'Gris';
                case 'brown':
                    return 'Marrón';
                case 'cyan':
                    return 'Cian';
                case 'magenta':
                    return 'Magenta';
                default:
                    return color;
            }
        }
    }
}
</script>
<style scoped>
.dropdown {
    position: relative;
    display: inline-block;

}

.dropbtn {
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    font-size: 16px;
    border: none;
    cursor: pointer;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    right: 0;
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown:hover .dropbtn {
    color: #939393;
}
</style>
