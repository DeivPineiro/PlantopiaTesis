<template >
    <div class="max-w-lg mx-auto py-8 px-4">
        <BaseH1 class="text-center mb-8">TU CULTIVO</BaseH1>
        <router-link to="/home" class="absolute top-7 left-1 scale-75">
            <button class=" m-0 flex items-center justify-center bg-gray-300 px-3 rounded-md shadow-2xl">
                <img src="/imgs/back.png" alt="back">Atras
            </button>
        </router-link>
        <div v-if="lastArea">
            <div class="text-center overflow-x-hidden">
                <p class="mb-4 w-full inline-block font-bold text-green-800">Área seleccionada: {{
                    lastArea.areaKilometros.toFixed(3) }}
                    km²</p>
                <p class="mb-4 w-full text-white hidden">Coordenadas: {{ lastArea.poligons }}</p>
            </div>
        </div>
        <form action="#" @submit.prevent="CrearArea">
            <div class="mb-2">
                <BaseLabel for="nombreCosecha">Identifica a tu cultivo</BaseLabel>
                <BaseInput type="text" id="nombreCosecha" v-model="nombreCosecha" />
            </div>
            <div class="mb-2">
                <BaseLabel for="pesoPorCosecha">Peso proyectado (kg/km²)</BaseLabel>
                <BaseInput type="number" id="pesoPorCosecha" v-model="pesoPorCosecha" />
            </div>
            <div class="mb-2">
                <BaseLabel for="valorPorTonelada">Valor por Tonelada (USD$)</BaseLabel>
                <BaseInput type="number" id="valorPorTonelada" v-model="valorPorTonelada" />
            </div>
            <div class="mb-2">
                <BaseLabel for="colorArea">Color del área</BaseLabel>
                <select
                    class="px-2 rounded-md disabled:bg-slate-300 w-full p-4 leading-6 text-lg placeholder-gray-400 bg-white shadow-none border border-gray-300"
                    id="colorArea" v-model="colorArea">
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

            <button @click="preCalcular" class="bg-blue-500 text-white py-2 px-4 rounded">Pre-Calcular</button>

            <BaseButton @click="guardar" class="mt-10">Guardar</BaseButton>
        </form>
    </div>
    <div>
        <Notificacion v-if="showNotification" :type="notificationType" :message="notificationMessage" />
    </div>
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
<style ></style>