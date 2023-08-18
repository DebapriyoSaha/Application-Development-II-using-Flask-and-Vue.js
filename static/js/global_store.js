const store=new Vuex.Store({
    state: {

        current_user: {},
        total_followers_all:{},
        total_following_all:{},
    },
    // getters:{
    //     get_username() 
    //     { 
    //         return this.state.current_user;
    //     }
    // },

    getters: {
        get_username: state => state.current_user.fname
      },

    mutations: {
        set_current_user(state, data){
            
            state.current_user = Object.assign({},data['user_data'])
            state.total_followers_all = Object.assign({},data['total_followers_all'])
            state.total_following_all = Object.assign({},data['total_following_all'])
        }
    },
    actions:{
        get_current_user: function(context,username){
            fetch("/api/current_user/"+username)
                .then(r=>r.json())
                .then(d=>context.commit("set_current_user",d))
        }
    }
})

export default store