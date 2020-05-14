// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueScrollTo from 'vue-scrollto'
import VueFuse from 'vue-fuse'
import AuthPlugin from './plugins/auth'

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
  Vue.use(AuthPlugin)

  router.beforeEach((to, from, next) => {
    if(to.path != '/blog') {
      next()
    } 
    else if (router.app.$auth.isAuthenticated()) { // if authenticated allow access
      if (from.name !== null) {
        if (from.query._storyblok) {
          return next(false)
        }
      }
      next()
    } 
    else { // trigger auth0's login
      router.app.$auth.login()
    }
  })

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


