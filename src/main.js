import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd)

let instance = null;

function render(props){
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
if(window.__POWERED_BY_QIANKUN__){
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}


if (!window.__POWERED_BY_QIANKUN__) {
  render();
}



export async function bootstrap(props){

}

export async function mount(props){
  render(props);
}

export async function unmount(props){
  instance.$destroy();
  instance = null;
}