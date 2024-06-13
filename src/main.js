import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import "./font/fontawesome-free-6.5.2-web/css/all.min.css";
import "./assets/style/tailwind.css";
import "./assets/style/global.css";
import { registerGlobalComponents } from "./utils/import";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAgoAVJ9we-TM9kVI7ypoNuZ4Up5g9vZkU",
    authDomain: "imoneytask.firebaseapp.com",
    projectId: "imoneytask",
    storageBucket: "imoneytask.appspot.com",
    messagingSenderId: "615334957757",
    appId: "1:615334957757:web:ad919c4aa582d017375dd4",
    measurementId: "G-4HWLY30833",
};

// Khởi tạo Firebase ở đây trước khi tạo ứng dụng Vue
initializeApp(firebaseConfig);

let app;

const auth = getAuth();
    auth.onAuthStateChanged(() =>{
        if (!app){
            app = createApp(App);

            app.use(router);
            
            registerGlobalComponents(app);
            
            app.mount('#app');
        }
    })
