<template>
    <div class="h-screen bg-slate-400">
        <BaseH1 class="text-center text-3xl hidden">Menú Principal</BaseH1>
        <!-- NAVBAR -->

        <nav class="container px-6 py-2 mx-auto md:flex md:justify-between md:items-center relative">
            <div class="flex items-center justify-between">
                <router-link to="/home" class="text-xl font-bold text-gray-800 md:text-2xl hover:text-blue-400">
                    <img src="/imgs/mock60.png" alt="">
                </router-link>
                <div @click="showMenu = !showMenu" class="flex md:hidden">
                    <button type="button"
                        class="text-gray-800 hover:text-gray-400 focus:outline-none focus:text-gray-400">
                        <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
                            <path fill-rule="evenodd"
                                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
            <ul :class="showMenu ? 'flex' : 'hidden'"
                class="absolute top-full pl-4 left-0 w-full bg-slate-200 z-10 flex-col mt-0 md:relative md:flex md:flex-row md:items-center md:space-x-10 md:mt-0">

                <div class="flex items-center">
                    <router-link to="/perfil"></router-link>
                    <button @click="toggleMenu" class="md:px-4 py-1 text-green-600">Usuario</button>
                </div>
            </ul>

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
        <!-- USER -->
        <div v-if="showUser && showMenu" class="absolute right-2 top-56 w-52 mt-0 border border-gray-950 shadow-xl">
            <ul class="list-none bg-slate-200">
                <li class="text-center px-0 mb-2 ">
                    <router-link to="/perfil" class="font-bold text-xs text-green-600 p-1">
                        {{ user.email }}
                    </router-link>
                </li>
                <li class="text-center px-0 ">
                    <form action="#" @submit.prevent="logOuting">
                        <button class="text-center font-bold text-xs text-red-600 p-1 " type="submit">Cerrar
                            sesión</button>
                    </form>
                </li>
            </ul>
        </div>
        <!-- GRAFICO -->
        <div class="pt-5 flex items-center justify-center">
            <div v-if="!areas || areas.length === 0" class="text-center font-bold text-gray-600 mt-4">
                <p>No tienes áreas cargadas.</p>
            </div>
            <div class="text-center chart-container" ref="chartContainer">
                <h2 class="mb-4 text-2xl font-bold text-green-800">Tus Estadisticas</h2>
                <svg ref="svgChart"></svg>
            </div>
        </div>
        <div class="max-w-md mx-auto text-left mt-0 bg-slate-300 p-2 rounded-md shadow-2xl">
            <p>Cobertura total: {{ coberturaTotal }} km²</p>
            <p>Valor cosechas: {{ totalValorAreas.toFixed(2) }} USD$</p>
        </div>
    </div>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import { subscribeToAuth, logOut } from '../service/auth.js';
import { findUserAreas } from "./../service/area.js";
import * as d3 from 'd3';
export default {
    name: 'home',
    components: { BaseH1 },

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

    methods: {
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