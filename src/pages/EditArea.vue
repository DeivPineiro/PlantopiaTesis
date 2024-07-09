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
                <BaseH1 class="text-center">Editá tu cosecha</BaseH1>
            </div>
            <form action="#" @submit.prevent="CrearArea">
                <div class="max-w-lg mx-auto py-4">
                    <div class="mb-6">
                        <BaseLabel for="nombreCosecha">Identificá a tu cultivo</BaseLabel>
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
                        <BaseLabel for="diaPlantacion">Día de plantación</BaseLabel>
                        <BaseInput type="date" id="diaPlantacion" v-model="diaPlantacion" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="diaCosecha">Día de cosecha estimada</BaseLabel>
                        <BaseInput type="date" id="diaCosecha" v-model="diaCosecha" />
                    </div>
                    <div class="mb-6">
                        <BaseLabel for="colorArea">Color del área</BaseLabel>
                        <select class="input-base" id="colorArea" v-model="colorArea">
                            <option value="red">Rojo</option>
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
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import Notificacion from '../components/Notificacion.vue';

import { subscribeToAuth } from "./../service/auth.js";
import { findAreaById, addNewDataArea } from "./../service/area.js";

import router from '../router/router.js';

export default {
    name: 'areas',
    components: { BaseButton, BaseLabel, BaseInput, BaseH1, Notificacion },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            idArea: null,
            nombreCosecha: null,
            pesoPorCosecha: null,
            valorPorTonelada: null,
            colorArea: 'yellow',
            diaPlantacion: null,
            diaCosecha: null,
            areaKilometros: 0,
            showNotification: false,
            notificationType: '',
            notificationMessage: '',
        }
    },
    mounted() {
        const areaId = this.$route.query.idArea;
        const akm = this.$route.query.areaKilometros;
        this.idArea = areaId;
        this.areaKilometros = akm;
        subscribeToAuth(user => this.user = { ...user });
        findAreaById(this.user.id, this.idArea, (area) => {
            if (area) {
                this.nombreCosecha = area.nombreCosecha;
                this.pesoPorCosecha = area.pesoPorCosecha;
                this.valorPorTonelada = area.valorPorTonelada;
                this.colorArea = area.colorArea;
                this.diaPlantacion = area.diaPlantacion,
                    this.diaCosecha = area.diaCosecha
            }
        });
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
            await addNewDataArea(this.user.id, this.idArea, data);
            router.push('/user/areas');
        },
        preCalcular() {
            const area = parseFloat(this.areaKilometros);
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