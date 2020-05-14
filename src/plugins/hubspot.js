import Vue from 'vue'
import { hownerid, hapikey } from "../../hubspot_config.json";

let hubspot = new Vue({
	computed: {
	},
	methods: {
		getContactByEmail(email){
			console.log(email);
		}
	}
})

export default {
  install: function(Vue) {
    Vue.prototype.$hubspot = hubspot
  }
}
