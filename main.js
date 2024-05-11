import { createApp} from "vue";
import App from "./src/App.vue";
import './src/css.css';
import router from './src/router/router.js';
import { Geolocation } from '@capacitor/geolocation';

const app = createApp(App);
app.config.globalProperties.$Geolocation = Geolocation;
app.use(router);

app.mount('#app');




