<template >

    <h2><slot /></h2>

</template>
<script>
export default {
    
    name: 'BaseH2',

}
</script>
<style >
    h2 {
        color: var(--verdeOscuro);
        font-weight: bold;
        text-align: center;
        font-size: 16px;
    }
</style>