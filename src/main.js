// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
import '@/common/styles/index.scss';

Vue.config.productionTip = false;

Vue.use(VueResource);

// 一个常用的eslint技巧， eslint中不能new 而不赋值于某变量，用这规则便可以忽略
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

// router.to('/ratings');
