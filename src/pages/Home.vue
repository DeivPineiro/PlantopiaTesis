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
                    <BaseH2>Tus Estadisticas</BaseH2>
                    <div style="display: flex;">
                        <div class="estadisticas">
                            <p>Cobertura total</p>
                            <p>{{ coberturaTotal }} km²</p>
                        </div>
                        <div class="estadisticas">
                            <p>Valor cosechas</p>
                            <p>{{ totalValorAreas.toFixed(2) }} USD$</p>
                        </div>
                    </div>
                    <LineChart :labels="lineChart.labels" :data="lineChart.data" />
                    <PieChart :labels="pieChart.labels" :data="pieChart.data" :backgroundColors="pieChart.colors" />
                </div>
            </template>

        </div>

    </div>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import BaseH2 from '../components/BaseH2.vue';
import { subscribeToAuth, logOut } from '../service/auth.js';
import { findUserAreas } from "./../service/area.js";
import LineChart from '../components/LineChart.vue';
import PieChart from '../components/PieChart.vue';

export default {
    name: 'home',
    components: { BaseH1, BaseH2, LineChart, PieChart },

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
            totalValorAreas: 0,
            lineChart: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                data: {
                    nombre: 'Mes de Cosecha / USD',
                    valores: new Array(12).fill(null)
                },
            },
            pieChart: {
                labels: null,
                data: null,
                colors: null,
            },
            colorsPieChart: [
                'rgb(255, 99, 132)',   // red
                'rgb(255, 159, 64)',   // orange
                'rgb(255, 205, 86)',   // yellow
                'rgb(75, 192, 192)',   // green
                'rgb(54, 162, 235)',   // blue
                'rgb(153, 102, 255)',  // purple
                'rgb(201, 203, 207)'   // grey
            ],
        }
    },
    methods: {
        getEmailPrefix(email) {
            return email && email.includes('@') ? email.split('@')[0] : email;
        },
        logOuting() {
            logOut();
            this.$router.push('/login');
        },
        navigateTo(route) {
            this.$router.push(route);
        },
        obtenerAreasPorMes() {
            const areasPorMes = Array.from({ length: 12 }, () => []);
            if (this.areas && this.areas.length > 0) {
                this.areas.forEach(area => {
                    let fecha;
                    fecha = new Date(area.diaCosecha);
                    if (fecha) {
                        const mes = fecha.getMonth();
                        areasPorMes[mes].push(area);
                    }
                });
            }
            return areasPorMes;
        },
        obtenerValoresCosechaUsd() {
            const areasPorMes = this.obtenerAreasPorMes();
            const valoresPorMes = areasPorMes.map(mesAreas => {
                // Sumar el valor calculado para cada área en el mes
                const sumaValores = mesAreas.reduce((total, area) => {
                    const valorArea = (((area.areaKilometros * area.pesoPorCosecha) / 1000) * area.valorPorTonelada);
                    return total + valorArea;
                }, 0);
                // Redondear la suma a dos decimales
                return sumaValores.toFixed(0);
            });
            return valoresPorMes;
        },
        obtenerAreasByNombre() {
            let areasAgrupadas = {};
            let colorIndex = 0;

            // Recorrer todas las áreas
            this.areas.forEach(area => {
                // Verificar si ya existe una entrada para el nombre de cosecha actual
                if (areasAgrupadas.hasOwnProperty(area.nombreCosecha)) {
                    // Sumar el área actual al área acumulada
                    areasAgrupadas[area.nombreCosecha].areaKilometros += area.areaKilometros;
                } else {
                    // Si no existe, crear una nueva entrada para el nombre de cosecha
                    areasAgrupadas[area.nombreCosecha] = {
                        nombre: area.nombreCosecha,
                        areaKilometros: area.areaKilometros,
                        color: this.obtenerColor(colorIndex)  // Función para obtener un color aleatorio
                    };
                    colorIndex++;
                }
            });

            // Extraer los resultados en arreglos separados
            let nombres = Object.keys(areasAgrupadas);
            let areas = nombres.map(nombre => areasAgrupadas[nombre].areaKilometros);
            let colores = nombres.map(nombre => areasAgrupadas[nombre].color);

            this.pieChart.labels = nombres;
            this.pieChart.data = areas;
            this.pieChart.colors = colores;
        },

        obtenerColor(i) {
            const color = this.colorsPieChart[i % this.colorsPieChart.length];
            return color;
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
            this.coberturaTotal = this.calcularCoberturaTotal();
            this.totalValorAreas = this.calcularValorTotalAreas();
            this.lineChart.data.valores = this.obtenerValoresCosechaUsd();
            this.pieChart.valores = this.obtenerAreasByNombre();
        });
    },
}
</script>

<style scoped>
h2 {
    font-size: 20px;
}
</style>