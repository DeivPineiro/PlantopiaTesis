<template>
    <BaseH1 class="hidden">Mostrar todas las áreas</BaseH1>
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
        </div>
    </div>
</template>

<script>
import BaseH1 from '../components/BaseH1.vue';
import BaseLabel from '../components/BaseLabel.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

import { subscribeToAuth } from "./../service/auth.js";
import { findUserAreas } from "./../service/area.js";
import googleMapsLoader from "../service/google-maps-config.js";

export default {
    name: 'userAreas',
    components: { BaseH1, BaseLabel, BaseInput, BaseButton, },
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
                            fillColor: area.areaColor,
                            strokeColor: area.areaColor,
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