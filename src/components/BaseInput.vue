<template>
    <input
      class=""
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </template>
  
  
  

<script>
export default {

    name: 'BaseInput',
    props: ['modelValue'],
    emits: ['update:modelValue'],

}
</script>
<style></style>

