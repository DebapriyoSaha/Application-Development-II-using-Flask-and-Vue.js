import login from './components/login.js'
import store from '../js/global_store.js'
import register from './components/forms.js'
import dashboard from './components/dashboard.js'
import add_post from './components/add_post.js'
import user_profile from './components/users_profile.js'
import edit_profile from './components/edit_profile.js'
import search from './components/search.js'
import edit_post from './components/edit_post.js'
import blog_statistics from './components/blog_statistics.js'
import error_page from './components/error_page.js'

const routes = [{ path: '/', component: login },
                { path: '/register', component: register ,name: 'register'},
                { path: '/dashboard/:username', component: dashboard, name: 'dashboard' },
                { path: '/add_post/:username', component: add_post, name: 'add_post' },
                { path: '/edit_profile/:username', component: edit_profile, name: 'edit_profile' },
                { path: '/edit_post/:id', component: edit_post, name: 'edit_post' },
                { path: '/user_profile/:username', component: user_profile, name: 'user_profile' },
                { path: '/blog_statistics/:username', component: blog_statistics, name: 'blog_statistics' },
                { path: '/search_results/:username/:value', component: search, name: 'search' },
                { path: '*', component: error_page, name: 'error_page' },
                
    ]

const router = new VueRouter({
    routes,
    base: '/',
  })
  
const app = new Vue({
    el: '#app',
    router,
    store,
    data: {
      current_user: null,
    },
    // mounted: function() {
    //   this.current_user = this.$store.state.current_user
    //   console.log(this.current_user)
    // },
    methods: {
      async logout() {
        const res = await fetch('/logout')
        if (res.ok) {
          localStorage.clear()
          this.$router.push('/')
        } else {
          console.log('could not logout the user')
        }
      },
      
    },
  })