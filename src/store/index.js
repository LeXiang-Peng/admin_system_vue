import Vue from 'vue';
import Vuex from 'vuex';
import state from './defaultState'
import mutations from './mutations'
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});
