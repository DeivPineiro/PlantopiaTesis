<template>
    <div class="max-w-lg mx-auto py-2 px-1 relative">
        <BaseH1 class="text-center mb-0 text-3xl pb-8">TUS CULTIVOS</BaseH1>
        <router-link to="/home" class="absolute top-10 left-0 scale-75">
            <button class=" m-0 flex items-center justify-center bg-gray-300 px-3 rounded-md shadow-2xl">
                <img src="/imgs/back.png" alt="back">Atras
            </button>
        </router-link>
        <!-- <img class="p-0 absolute top-1 right-2" src="/imgs/mock60.png" alt="back"> -->

        <div class="grid grid-cols-1 gap-1">
            <div v-if="!areas || areas.length === 0" class="text-center font-bold text-gray-600 mt-4">
                <p>No tienes áreas cargadas.</p>
            </div>
            <div v-else>
                <div class="bg-white py-4 px-2 rounded shadow-md mb-4 flex items-start justify-between" v-for="area in areas"
                    :key="area.id">
                    <div class="w-3/4">
                        <p class="font-bold">Nombre: <span class="font-normal">{{ area.nombreCosecha }}</span></p>
                        <p class="font-bold">Peso: <span class="font-normal">{{ area.pesoPorCosecha }} kg/km²</span></p>
                        <p class="font-bold">Precio t/km²: <span class="font-normal">{{ area.valorPorTonelada }} USD$ x
                                t/km²</span></p>
                        <p class="font-bold">Área: <span class="font-normal">{{ area.areaKilometros.toFixed(3) }} km²</span>
                        </p>
                        <div class="flex items-center">
                            <p class="font-bold mr-2">Color área:</p>
                            <div class="w-6 h-6 mr-2"
                                :style="{ backgroundColor: area.colorArea, border: '1px solid #000' }"></div>
                            <p class="font-normal">{{ traducirColor(area.colorArea) }}</p>
                        </div>
                        <p class="font-bold text-green-700 mt-2">Valor total: <span class="font-normal text-black">{{
                            (((area.areaKilometros * area.pesoPorCosecha) / 1000) * area.valorPorTonelada).toFixed(2) }}
                                USD$</span></p>
                    </div>
                    <div class="w-1/4 flex flex-col justify-between items-end">
                        <div class="dropdown">
                            <button class="dropbtn rounded-full p-1"><img src="../../public/imgs/more16.png" alt=""></button>
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
</template>

<script>
import BaseButton from '../components/BaseButton.vue';
import BaseH1 from '../components/BaseH1.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseLabel from '../components/BaseLabel.vue';
import { subscribeToAuth } from "./../service/auth.js";
import { findUserAreas, deleteArea } from "./../service/area.js";
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
                console.log("idUser: ", idUser, "idArea: ", idArea)
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
    background-color: #ffef2e;
}
</style>
