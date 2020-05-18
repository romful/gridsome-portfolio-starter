import Vue from 'vue'

let services = new Vue({
	computed: {
	},
	data(){
		return {
			categories: [
				"Local Booking",
				"Home Services",
				"Wellness",
				"Transport"
			],
			category: ""
		}
	},
	methods: {
	}
})

export default {
  install: function(Vue) {
    Vue.prototype.$services = services;
  }
}
