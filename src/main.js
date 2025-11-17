import { createApp } from 'vue';
import './style.css';
import './buffer';
import 'crypto';
import axios from 'axios';
import App from './SIgnTip712.vue'
window.axios = axios;
createApp(App).mount('#app');
