<template>
    <BaseH1 class="hidden">Mostrar todas las áreas</BaseH1>
    <div style="max-height: 100vh; overflow-y: auto;">
        <div id="mapContainer" class="h-screen relative">
            <div id="map" class="w-full h-full"></div>
            <router-link to="/home" class="absolute top-14 left-0 scale-75">
                <button class=" m-0 flex items-center justify-center bg-gray-300 px-3 rounded-md shadow-2xl">
                    <img src="/imgs/back.png" alt="back">Atras
                </button>
            </router-link>
            <div id="areaKilometros"
                class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-xl p-2 z-10 text-sm opacity-90">
            </div>
            <div id="buttonContainer" class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
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
import googleMapsLoader from "../service/google-maps-config.js";
import { findUserAreas } from "./../service/area.js";
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
            map: null,
        }
    },
    async mounted() {
        subscribeToAuth(user => this.user = { ...user });
        this.areasUnsuscribe = findUserAreas(this.user.id, (areas) => {
            this.areas = areas;
            this.initMap();
        });
        try {
            await googleMapsLoader.load();
        } catch (error) {
            console.error("Error al cargar la API de Google Maps", error);
        }

    },
    methods: {
        initMap() {
            if (this.areas && this.areas.length > 0) {
                const firstArea = this.areas[0];
                const firstCoordinate = JSON.parse(firstArea.poligons)[0];

                if (firstCoordinate && typeof firstCoordinate.lat === 'number' && typeof firstCoordinate.lng === 'number' &&
                    isFinite(firstCoordinate.lat) && isFinite(firstCoordinate.lng)) {
                    this.map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: firstCoordinate.lat, lng: firstCoordinate.lng },
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.HYBRID,
                    });
                    this.areas.forEach(area => {
                        const polygonCoords = JSON.parse(area.poligons);
                        const polygon = new google.maps.Polygon({
                            paths: polygonCoords,
                            editable: false,
                            draggable: false,
                            fillColor: area.colorArea,
                            strokeColor: area.colorArea,
                            strokeWeight: 1,
                        });
                        polygon.setMap(this.map);
                    });
                } else {
                    console.error('Las coordenadas del primer punto no son válidas.');
                }
            } else {
                console.error('No hay áreas disponibles para mostrar en el mapa.');
            }
        }
    }
}
</script>

<style >
.static-map {
    width: 100%;
    height: auto;
}
</style>
