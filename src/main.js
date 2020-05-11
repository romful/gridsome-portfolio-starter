// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueScrollTo from 'vue-scrollto'
import VueFuse from 'vue-fuse'

//import { domain, clientId } from "../auth_config.json";
//import { Auth0Plugin } from "./auth";
import { Auth0Plugin } from "./auth";

import '~/css/style.css'
export default function (Vue, { router, head, isClient }) {

  head.link.push({
        rel: 'stylesheet',
        href: '/datepicker.css'
  })

  Vue.use(VueScrollTo, {
    duration: 500,
    easing: "ease",
  })

  Vue.use(VueFuse)

  Vue.use(Auth0Plugin)
/*  Vue.use(Auth0Plugin, {
    domain,
    clientId,
    onRedirectCallback: appState => {
      router.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    }
  });*/

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  head.meta.push({
    name: 'keywords',
    content: 'Gridsome,Vue,Tailwind,Tailwind CSS,JavaScript,HTML,CSS,Vue.js,VueJS'
  })

  head.meta.push({
    name: 'description',
    content: 'Gridsome Portfolio Starter'
  })

  head.meta.push({
    name: 'author',
    content: 'Andre Madarang'
  })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700'
  })
}


