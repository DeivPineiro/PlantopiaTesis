<template>
    <BaseH1 class="hidden">Mapa</BaseH1>
    <div class="h-screen">
        <div class="header-map">
            <router-link to="/home" class="back-map">
                <button class="btn-amarillo">
                    <span class="material-symbols-sharp back-icon">arrow_back_ios</span>Atrás
                </button>
            </router-link>
            <div class="logo-map"><img src="/imgs/logo.png" alt="Logo Plantopia" class=""></div>
            <div id="areaKilometers" class="info-map">
                <p>{{ areaText }}</p>
            </div>
        </div>
        <div id="mapContainer" class="vista-map">
            <div id="map" class="w-full h-full"></div>
            <div id="buttonContainer" class="finish-map">
                <BaseButton @click="handleSubmit()" :cargando="isLoading" class="mt-10">Finalizar</BaseButton>
            </div>
        </div>
    </div>
</template>
<script>
import BaseH1 from "../components/BaseH1.vue";
import BaseButton from '../components/BaseButton.vue';

import { createArea } from "../service/area.js";
import { subscribeToAuth } from "./../service/auth.js";
import googleMapsLoader from "../service/google-maps-config.js";

export default {
    name: 'mapa',
    components: { BaseH1, BaseButton },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
            isLoading: false,
            map: null,
            polygonCoords: [],
            areaKilometers: 0,
            unsuscribe: () => { },
        };
    },
    async mounted() {
        try {
            await googleMapsLoader.load();
            this.initMap();
        } catch (error) {
            console.error("Error al cargar la API de Google Maps", error);
        }
    },
    computed: {
        areaText() {
            if (this.areaKilometers >= 0.99) {
                return `Área: ${this.areaKilometers.toFixed(2)} km²`;
            } else {
                const areaSquareMeters = this.areaKilometers * 1000000;
                return `Área: ${areaSquareMeters.toFixed(2)} m²`;
            }
        },
    },
    methods: {
        calculateArea(coords) {
            const area = google.maps.geometry.spherical.computeArea(coords);
            return Math.abs(area);
        },
        initMap() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    const map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: userLat, lng: userLng },
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.HYBRID,
                    });
                    this.polygonCoords = [
                        { lat: userLat - 0.005, lng: userLng - 0.005 },
                        { lat: userLat - 0.005, lng: userLng + 0.005 },
                        { lat: userLat + 0.005, lng: userLng + 0.005 },
                        { lat: userLat + 0.005, lng: userLng - 0.005 },
                    ];
                    this.polygon = new google.maps.Polygon({
                        paths: [
                            { lat: userLat - 0.005, lng: userLng - 0.005 },
                            { lat: userLat - 0.005, lng: userLng + 0.005 },
                            { lat: userLat + 0.005, lng: userLng + 0.005 },
                            { lat: userLat + 0.005, lng: userLng - 0.005 },
                        ],
                        editable: true,
                        draggable: true,
                        fillColor: 'yellow',
                        strokeColor: 'darkorange',
                        strokeWeight: 1,
                    });

                    this.polygon.setMap(map);
                    const area = this.calculateArea(this.polygonCoords);
                    this.areaKilometers = area / 1000000;
                    google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
                        google.maps.event.addListener(this.polygon.getPath(), 'set_at', this.updateArea);
                        google.maps.event.addListener(this.polygon.getPath(), 'insert_at', this.updateArea);
                    });
                });
            } else {
            }
        },
        updateArea() {
            const polygon = this.polygon.getPath().getArray();
            const area = this.calculateArea(polygon);
            const areaKilometers = area / 1000000;
            this.polygonCoords = polygon;
            this.areaKilometers = areaKilometers;
        },
        async handleSubmit() {
            try {
                this.isLoading = true;
                this.unsuscribe = subscribeToAuth(newUser => this.user = { ...newUser });
                await createArea(this.user.id, { poligons: JSON.stringify(this.polygonCoords), areaKilometros: this.areaKilometers, idUser: this.user.id });
                this.$router.push('/area');
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>

<style>
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}
</style>