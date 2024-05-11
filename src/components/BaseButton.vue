<template>

    <button class="btn-verde" type="submit" :disabled="cargando">
        <template v-if="!cargando">
            <slot />
        </template>
        <template v-else>
            <Carga  />
        </template>
    </button>

</template>
<script>
import Carga from './Carga.vue';

export default {
    name: 'BaseButton',
    props: {
        cargando: {
            type: Boolean,
            default: false,
        }
    },
    components: { Carga }
};

</script>

<style></style>