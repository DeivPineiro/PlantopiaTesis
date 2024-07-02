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
                <BaseH1 class="text-center">TU CULTIVO</BaseH1>
            </div>
            <div v-if="lastArea">
                <p class="slogan-form">Área seleccionada <span> {{
                    lastArea.areaKilometros.toFixed(3) }}
                        km²</span></p>
                <p class="mb-4 w-full text-white hidden">Coordenadas: {{ lastArea.poligons }}</p>
            </div>
            <form action="#" @submit.prevent="CrearArea">
                <div class="max-w-lg mx-auto py-4">
                    <div class="mb-6">
                        <BaseLabel for="nombreCosecha">Identifica a tu cultivo</BaseLabel>
                        <BaseInput type="text" id="nombreCosecha" v-model="nombreCosecha" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="pesoPorCosecha">Peso proyectado (kg/km²)</BaseLabel>
                        <BaseInput type="number" id="pesoPorCosecha" v-model="pesoPorCosecha" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="valorPorTonelada">Valor por Tonelada (USD$)</BaseLabel>
                        <BaseInput type="number" id="valorPorTonelada" v-model="valorPorTonelada" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="diaPlantacion">Dia de plantacion</BaseLabel>
                        <BaseInput type="date" id="diaPlantacion" v-model="diaPlantacion" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="diaCosecha">Dia de cosecha estimada</BaseLabel>
                        <BaseInput type="date" id="diaCosecha" v-model="diaCosecha" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="colorArea">Color del área</BaseLabel>
                        <select class="input-base" id="colorArea" v-model="colorArea">
                            <option value="red">Rojo </option>
                            <option value="blue">Azul</option>
                            <option value="green">Verde</option>
                            <option value="yellow">Amarillo</option>
                            <option value="orange">Naranja</option>
                            <option value="purple">Purpura</option>
                            <option value="pink">Rosa</option>
                            <option value="black">Negro</option>
                            <option value="white">Blanco</option>
                            <option value="gray">Gris</option>
                            <option value="brown">Marron</option>
                            <option value="cyan">Cyan</option>
                            <option value="magenta">Magenta</option>
                        </select>
                    </div>
                    <button @click="preCalcular" class="btn-amarillo mb-6">Pre-Calcular</button>
                    <div>
                        <Notificacion v-if="showNotification" :type="notificationType" :message="notificationMessage" />
                    </div>
                    <BaseButton @click="guardar" class="mt-10">Guardar</BaseButton>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseLabel from '../components/BaseLabel.vue';
import { subscribeToAuth } from "./../service/auth.js";
import { lastAreaById, addNewDataArea } from "./../service/area.js";
import router from '../router/router.js';
import Notificacion from '../components/Notificacion.vue';
import BaseButton from '../components/BaseButton.vue';

export default {
    name: 'areas',
    components: { BaseLabel, BaseInput, BaseH1, Notificacion, BaseButton },

    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            lastArea: null,
            nombreCosecha: null,
            pesoPorCosecha: null,
            valorPorTonelada: null,
            colorArea: 'yellow',
            diaPlantacion: null,
            diaCosecha: null,
            showNotification: false,
            notificationType: '',
            notificationMessage: '',
        }
    },
    mounted() {
        subscribeToAuth(user => this.user = { ...user });
        this.loadLastArea();
    },
    methods: {
        async guardar() {
            const data = {
                nombreCosecha: this.nombreCosecha,
                pesoPorCosecha: parseFloat(this.pesoPorCosecha),
                valorPorTonelada: parseFloat(this.valorPorTonelada),
                colorArea: this.colorArea,
                diaPlantacion: this.diaPlantacion,
                diaCosecha: this.diaCosecha
            };
            await addNewDataArea(this.user.id, this.lastArea.id, data);
            router.push('/user/areas');
        },

        async loadLastArea() {
            if (this.user.id) {
                const areaData = await lastAreaById(this.user.id);
                if (areaData) {
                    this.lastArea = areaData;
                }
            }
        },
        preCalcular() {
            const area = parseFloat(this.lastArea.areaKilometros);
            const peso = parseFloat(this.pesoPorCosecha);
            const valor = parseFloat(this.valorPorTonelada);

            if (isNaN(area) || isNaN(peso) || isNaN(valor) || !area || !peso || !valor) {
                this.showNotificationMessage('error', 'Asegúrate de ingresar valores válidos y no vacíos para área, peso y valor.');
            } else {
                this.resultado = ((area * peso) / 1000) * valor;
                this.showNotificationMessage('success', `Ganarías un aproximado de ${this.resultado.toFixed(2)} USD$`);
            }
        },
        showNotificationMessage(type, message) {
            this.showNotification = true;
            this.notificationType = type;
            this.notificationMessage = message;

            setTimeout(() => {
                this.hideNotification();
            }, 5000);
        },
        hideNotification() {
            this.showNotification = false;
            this.notificationType = '';
            this.notificationMessage = '';
        },
    },
}
</script>
