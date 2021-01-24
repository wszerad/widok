import { createApp } from 'vue';
import List from './List.vue';
import { widok } from './store';

const app = createApp(List);
app.use(widok);
app.mount('#app');
