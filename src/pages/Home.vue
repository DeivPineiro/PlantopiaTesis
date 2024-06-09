<template>
    <div class="h-screen">
        <BaseH1 class="text-center text-3xl hidden">Menú Principal</BaseH1>
        <!-- NAVBAR -->
        <nav class="container px-6 py-2 mx-auto md:flex md:justify-between md:items-center relative">
            <div class="flex items-center justify-between">
                <div @click="showMenu = !showMenu" class="flex">
                    <button type="button" class="btn_user">
                        <span class="material-symbols-sharp user_icon">
                            account_circle
                        </span>
                        <p class="ps-2">Hola {{ getEmailPrefix(user.email) }}</p>
                    </button>
                </div>
                <div class="box_user" :class="showMenu ? 'flex' : 'hidden'">
                    <ul class="py-2">
                        <li class="li_user">
                            <router-link to="/perfil" class="text-xs p-1">
                                Mi Perfil
                            </router-link>
                        </li>
                        <li class="li_user">
                            <form action="#" @submit.prevent="logOuting">
                                <button class="text-xs text-red-600 p-1 " type="submit">Cerrar
                                    sesión<span class="material-symbols-sharp">
                                        logout
                                    </span></button>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <nav class="nav-principal">
            <ul class="lista-nav-principal">
                <li class="li-nav-principal" @click="navigateTo('/map')"><span
                        class="material-symbols-sharp">add_location_alt</span><br>Crear área</li>
                <li class="li-nav-principal" @click="navigateTo('/user/areas')"><span
                        class="material-symbols-sharp">eco</span><br>Mis cultivos</li>
                <li class="li-nav-principal"><router-link to="/home"><img src="/imgs/logo.png" alt=""
                            class="icono-home-nav"></router-link></li>
                <li class="li-nav-principal" @click="navigateTo('/user/areas/mostrarTodo')"> <span
                        class="material-symbols-sharp">travel_explore</span><br>Mis áreas</li>
                <li class="li-nav-principal" @click="navigateTo('/wiki_home')"><span
                        class="material-symbols-sharp">book_3</span><br>PlantoWiki</li>
            </ul>
        </nav>

        <!-- GRAFICO -->
        <div class="pt-5  home">
            <template v-if="!areas || areas.length === 0">
                <div class="text-center font-bold text-gray-600 mt-4">
                    <p>No tienes áreas cargadas.</p>
                </div>
            </template>
            <template v-else>
                <div class="text-center chart-container">
                    <h2 class="mb-4 text-2xl font-bold text-green-800">Tus Estadisticas</h2>
                    <LineChart :labels="labels" :data1="data1" :data2="data2" />
                </div>
                <div class="max-w-md mx-auto text-left mt-0 bg-slate-300 p-2 rounded-md shadow-2xl">
                    <p>Cobertura total: {{ coberturaTotal }} km²</p>
                    <p>Valor cosechas: {{ totalValorAreas.toFixed(2) }} USD$</p>
                </div>
            </template>

        </div>

    </div>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuth, logOut } from '../service/auth.js';
import { findUserAreas } from "./../service/area.js";
import LineChart from '../components/LineChart.vue';
import { ref } from 'vue';

import * as d3 from 'd3';
export default {
    name: 'home',
    components: { BaseH1, LineChart },

    data() {
        return {
            showMenu: false,
            showUser: false,
            user: {
                id: null,
                email: null,
                rol: null,
            },
            areas: null,
            areasUnsuscribe: () => { },
            coberturaTotal: null,
            totalValorAreas: 0
        }
    },
    setup() {
        const labels = ref(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']);
        const data1 = ref({
            nombre: 'Plantacion',
            valores: [65, 59, 200, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55]
        });
        const data2 = ref({
            nombre: 'Cosecha',
            valores: [null, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86, 27]
        });

        return { labels, data1, data2 };
    },
    methods: {
        getEmailPrefix(email) {
            return email && email.includes('@') ? email.split('@')[0] : email;
        },
        toggleMenu() {
            this.showUser = !this.showUser;
        },
        logOuting() {
            logOut();
            this.$router.push('/login');
        },
        navigateTo(route) {
            this.$router.push(route);
        },
        generarGrafico() {
            const areasPorFecha = this.obtenerAreasPorFecha();
            const data = Object.entries(areasPorFecha).map(([fecha, count]) => ({ fecha, count }));

            const containerWidth = this.$refs.chartContainer.clientWidth;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };
            const width = containerWidth - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            const svg = d3.select(this.$refs.svgChart)
                .attr("width", containerWidth)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .domain(data.map(d => d.fecha))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count)])
                .nice()
                .range([height, 0]);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(y));

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d.fecha))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.count))
                .attr("fill", "#006633");

            this.coberturaTotal = this.calcularCoberturaTotal();
            this.totalValorAreas = this.calcularValorTotalAreas();
            svg.style("margin", "0 auto");
        },
        obtenerAreasPorFecha() {
            const areasPorFecha = {};

            if (this.areas && this.areas.length > 0) {
                this.areas.forEach(area => {
                    if (area.creado && area.creado.seconds) {
                        const fechaCreacion = new Date(area.creado.seconds * 1000);
                        const fechaKey = fechaCreacion.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
                        if (!areasPorFecha[fechaKey]) {
                            areasPorFecha[fechaKey] = 0;
                        }
                        areasPorFecha[fechaKey]++;
                    }
                });
            }
            console.log(this.areas);
            return areasPorFecha;
        },
        calcularCoberturaTotal() {
            if (this.areas && this.areas.length > 0) {
                return this.areas.reduce((total, area) => total + area.areaKilometros, 0).toFixed(3);
            } else {
                return 0;
            }
        },
        calcularValorTotalAreas() {
            if (this.areas && this.areas.length > 0) {
                console.log(this.areas);
                console.log(this.areas.reduce((total, area) => total + (((area.areaKilometros * area.pesoPorCosecha) / 1000) * area.valorPorTonelada), 0));
                return this.areas.reduce((total, area) => total + (((area.areaKilometros * area.pesoPorCosecha) / 1000) * area.valorPorTonelada), 0);
            } else {
                return 0;
            }
        }
    },

    mounted() {
        subscribeToAuth(user => {
            this.user = { ...user }
        });
        this.areasUnsuscribe = findUserAreas(this.user.id, (areas) => {
            this.areas = areas;
            this.generarGrafico();
        });
    },
}
</script>

<style scoped>
.navbar {
    background-color: #e2e8f0;
    color: #333333;
    padding: 10px;
}

.navbar ul {
    list-style-type: none;
    padding: 0;
}

.navbar ul li {
    display: inline;
    margin-right: 20px;
    cursor: pointer;
}

.chart-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
}

.statistics {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
}
</style>

<style>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}
</style>
<!-- 
    *Mover nav al App
    *Cambiar estilo a tus cultivos
    *





-->