<template>
    <BaseH1 class="hidden">Ir a mapa</BaseH1>
    <div style="max-height: 100vh; overflow-y: auto;">
        <div id="mapContainer" class="h-screen relative">
            <div id="map" class="w-full h-full"></div>
            <router-link to="/user/areas" class="absolute top-14 left-0 scale-75">
                <button class=" m-0 flex items-center justify-center bg-gray-300 px-3 rounded-md shadow-2xl">
                    <img src="/imgs/back.png" alt="back">Atras
                </button>
            </router-link>
            <div id="areaKilometros"
                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-xl p-2 z-10 text-sm opacity-90">
                <div>
                    <p>{{ areaText }}</p>
                </div>
            </div>
            <div id="buttonContainer" class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                <button @click="handleSubmit()"
                    class="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md border border-green-800">
                    Editar Área
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { UpdateArea } from "../service/area.js";
import { subscribeToAuth } from "./../service/auth.js";
import googleMapsLoader from "../service/google-maps-config.js";
import BaseH1 from "../components/BaseH1.vue";

export default {
    name: 'irAlMapa',
    components: { BaseH1 },
    data() {
        return {
            name: 'irAMapa',
            user: {
                id: null,
                email: null,
            },
            idArea: null,
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
                return `Área en km²: ${this.areaKilometros.toFixed(2)} km²`;
            } else {
                const areaMetrosCuadrados = this.areaKilometros * 1000000;
                return `Área en m²: ${areaMetrosCuadrados.toFixed(2)} m²`;
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
            console.log(`Datos del Polígono: ${JSON.stringify(this.polygonCoords)}`);
            console.log(`Datos del Área Km: ${JSON.stringify(this.areaKilometros)}`);
        },

        async handleSubmit() {
            try {
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
  