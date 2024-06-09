<template>
  <div v-if="show" class="notification" :class="typeClass">
    <p>{{ message }}</p>
  </div>
</template>
  
<script>
export default {
  props: {
    type: String,
    message: String,
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    typeClass() {
      return this.type ? `notification-${this.type}` : '';
    },
  },
};
</script>
  
<style scoped>
.notification {
  padding: 1em;
  margin: 1em 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: small;
  text-align: left;
  margin: 0 0 10px 0;
  padding: 0;
  font-style: italic;
  background: none;
  border: none;
  display: flex;
  align-items: center;
}

.notification-success {
  color: var(--verdeOscuro);
}
.notification-success::before {
  content: "\e815";
  font-family: 'Material Symbols Sharp';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  padding-right: 5px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.notification-error {
  color: red;
}

.notification-error::before {
  content: "\e160";
  font-family: 'Material Symbols Sharp';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  padding-right: 5px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

.notification-error:focus-visible {
  outline: none;
}

</style>
  