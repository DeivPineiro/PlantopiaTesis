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
                <BaseH1 class="text-center">PlatoWiki</BaseH1>
            </div>
            <div class="container-wiki">
                <div class="box-wiki">
                    <router-link to="/wiki_home/wiki_plants" class="nav-wiki">
                        <img src="/imgs/wikiplant.png" alt="Wiki sobre plantas" class="mx-auto scale-75" />
                    </router-link>
                    <p class="slogan-form py-2">Plantas</p>
                </div>
                <div class="box-wiki">
                    <router-link to="/wiki_home/wiki_plagues" class="nav-wiki">
                        <img src="/imgs/plagues.png" alt="Wiki sobre plagas" class="mx-auto scale-75" />
                    </router-link>
                    <p class="slogan-form py-2">Plagas</p>
                </div>
            </div>
            <div class="info-wiki">
                <BaseH2>¡Bienvenido a nuestra Plantowiki!</BaseH2>
                <p>Acá podés encontrar toda la información que necesitás sobre una amplia variedad de plantas y las
                    plagas que pueden afectarlas. Nuestra base de datos está llena de detalles esenciales para ayudarte
                    a cuidar y mantener tus cultivos en óptimas condiciones.</p>
                <BaseH2>¿Qué podés encontrar en Plantowiki?</BaseH2>
                <p><strong class="slogan-form">Wiki de Plantas:</strong> Información sobre nombres científicos, épocas
                    de crecimiento, rendimientos
                    aproximados, tipos de luz y suelo, y mucho más.</p>
                <p><strong class="slogan-form"> Wiki de Plagas:</strong> Datos sobre las plagas más comunes, sus nombres
                    científicos y métodos eficaces para
                    su control y prevención.</p>
                <BaseH2>Contactanos</BaseH2>
                <p>Si no encontrás un cultivo específico, tenés dudas sobre cómo utilizar Plantowiki, o tenés
                    información valiosa que podría beneficiar a nuestra comunidad, envianos un correo electrónico a
                    plantopia@gmail.com</p>
            </div>
        </div>
    </section>
</template>
<script>
import BaseH1 from '../components/BaseH1.vue';
import BaseH2 from '../components/BaseH2.vue';

import { subscribeToAuth, logOut } from '../service/auth.js';

export default {
    name: 'wikiHome',
    components: { BaseH1, BaseH2 },
    data() {
        return {
            showMenu: false,
            user: {
                id: null,
                email: null,
                rol: null,
            }
        }
    },
    methods: {
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        logOuting() {
            logOut();
            this.$router.push('/login');
        }
    },
    mounted() {
        subscribeToAuth(user => {
            this.user = { ...user }
        });
    },
}
</script>