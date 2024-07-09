<template>
    <BaseH1 class="hidden">Ir a mapa</BaseH1>
    <div class="h-screen">
        <div class="header-map">
            <router-link to="/home" class="back-map">
                <button class="btn-amarillo">
                    <span class="material-symbols-sharp back-icon">arrow_back_ios</span>Atrás
                </button>
            </router-link>
            <div class="logo-map"><img src="/imgs/logo.png" alt="Logo Plantopia" class=""></div>
            <div id="areaKilometros" class="info-map">
                <p>{{ areaText }}</p>
            </div>
        </div>
        <div id="mapContainer" class="vista-map">
            <div id="map" class="w-full h-full"></div>
            <div id="buttonContainer" class="finish-map">
                <BaseButton @click="handleSubmit()" :cargando="formCarga" class="mt-10">Editar Área</BaseButton>
            </div>
        </div>
    </div>
</template>

<script>
import BaseH1 from "../components/BaseH1.vue";
import BaseButton from '../components/BaseButton.vue';

import googleMapsLoader from "../service/google-maps-config.js";
import { UpdateArea } from "../service/area.js";
import { subscribeToAuth } from "./../service/auth.js";

export default {
    name: 'irAlMapa',
    components: { BaseH1, BaseButton },
    data() {
        return {
            name: 'irAMapa',
            user: {
                id: null,
                email: null,
            },
            idArea: null,
            formCarga: false,
            map: null,
            polygonCoords: [],
            areaKilometros: 0,
            colorArea: "yellow",
            unsuscribe: () => { },
        };
    },
    async mounted() {
        subscribeToAuth(user => this.user = { ...user });
        const poligons = JSON.parse(this.$route.query.poligons);
        const idArea = this.$route.query.id;
        const colorArea = this.$route.query.colorArea;
        this.polygonCoords = poligons;
        this.idArea = idArea;
        this.colorArea = colorArea;
        try {
            await googleMapsLoader.load();
            this.initMap();
        } catch (error) {
            console.error("Error al cargar la API de Google Maps", error);
        }
        const area = this.calcularArea(this.polygonCoords);
        this.areaKilometros = area / 1000000;
    },
    computed: {
        areaText() {
            if (this.areaKilometros >= 0.99) {
                return `Área: ${this.areaKilometros.toFixed(2)} km²`;
            } else {
                const areaMetrosCuadrados = this.areaKilometros * 1000000;
                return `Área: ${areaMetrosCuadrados.toFixed(2)} m²`;
            }
        },
    },
    methods: {
        calcularArea(coords) {
            const area = google.maps.geometry.spherical.computeArea(coords);
            return Math.abs(area);
        },
        initMap() {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: this.polygonCoords[0].lat, lng: this.polygonCoords[0].lng },
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.HYBRID,
            });

            this.polygon = new google.maps.Polygon({
                paths: this.polygonCoords,
                editable: true,
                draggable: true,
                fillColor: this.colorArea,
                strokeColor: this.colorArea,
                strokeWeight: 1,
            });

            this.polygon.setMap(map);

            google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
                google.maps.event.addListener(this.polygon.getPath(), 'set_at', this.updateArea);
                google.maps.event.addListener(this.polygon.getPath(), 'insert_at', this.updateArea);
            });
        },
        updateArea() {
            const polygon = this.polygon.getPath().getArray();
            const area = this.calcularArea(polygon);
            const areaKilometros = area / 1000000;
            this.polygonCoords = polygon;
            this.areaKilometros = areaKilometros;
        },

        async handleSubmit() {
            try {
                this.formCarga = true;
                // this.unsuscribe = subscribeToAuth(newUser => this.user = { ...newUser });
                await UpdateArea(this.user.id, this.idArea, { poligons: JSON.stringify(this.polygonCoords), areaKilometros: this.areaKilometros, colorArea: this.colorArea });
                this.$router.push('/user/areas');
            } catch (error) {
                console.log(error);
            }
            this.registerCarga = false;
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
  