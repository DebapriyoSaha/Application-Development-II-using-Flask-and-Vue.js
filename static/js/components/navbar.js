const navbar={
    name: 'navbar',
    template:`
    <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid" style="padding: 0% 7%;">
      <span class="navbar-brand">Blog Lite</span>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <img :src="this.$store.state.current_user.image"  alt="#" width="44" height="44" style="border-radius:50%">
           </li>
           <li class="nav-item">
            <label class="nav-text">Welcome %{this.$store.state.current_user.fname} %{this.$store.state.current_user.lname}</label>
          </li>          
          &emsp; &emsp; &emsp;
          <li class="nav-item">
            <a class="nav-link" aria-current="page" :id="'dashboard'+ username" href="#" @click.prevent="user_dashboard" >News Feed</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :id="'user_profile'+username" href="#" @click.prevent="user_profile">My Profile</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" :id="'add_post'+username" href="#" @click.prevent="add_post">Add Post</a>
          </li>

          <li class="nav-item">
            <a class="nav-link" :id="'blog_statistics'+username" href="#" @click.prevent="profile_statistics">Statistics</a>
          </li>
          
        </ul>
        <ul class="navbar-nav mr-auto float-sm-right">
          <li class="nav-item">
            <a class="nav-link" href="" @click.prevent="user_logout">Logout</a>
          </li>
          </ul>

        <div class="form-inline float-sm-right my-2 my-lg-0"  style="padding-top: 8px;">
          <input v-model="search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click="user_search"> Search </button>

        </div>          
        
      </div>
    </div>
    </nav>
    </div>
    `,
    delimiters : ['%{','}'],
    data(){ 
        return{
            username: "",
            search: null,
            
        }
    },

    async mounted(){
        await this.$store.dispatch("get_current_user",localStorage.getItem('username'))
        // this.username = `${this.$store.state.current_user.username}`
        this.username = localStorage.getItem('username')
        const activePage = window.location.href.split('/')[4];
        const activePage2 = window.location.href.split('/')[5];
        const c = activePage + activePage2
        const navLinks = document.querySelectorAll('nav a')
                .forEach(x=> {
                      if(x.id+this.username === c){
                      x.classList.add('active');
                        }
                })

    },

    methods:{

        user_search(){
          this.$router.push(`/search_results/${localStorage.getItem('username')}/${this.search}`)
          },
       
        user_logout(){
          fetch('/user_logout/'+localStorage.getItem('username'))
          .then((res) => res.json())
          .then((data) => {
              localStorage.removeItem('auth-token')
              localStorage.removeItem('username')
              alert(data)
              
              this.$router.push('/')

          })
      },
        
        async user_dashboard(){
          await this.$store.dispatch("get_current_user",localStorage.getItem('username'))
          this.$router.push(`/dashboard/${this.$store.state.current_user.username}`)
        },
        async add_post(){
          await this.$store.dispatch("get_current_user",localStorage.getItem('username'))
          this.$router.push(`/add_post/${this.$store.state.current_user.username}`)
        },
        async user_profile(){
          await this.$store.dispatch("get_current_user",localStorage.getItem('username'))
          this.$router.push(`/user_profile/${this.$store.state.current_user.username}`)
          location.reload()
        },

      //   check_status(task_id){
      //     fetch('/check_status/'+task_id)
      //     .then((res) => res.json())
      //     .then((data) => {
      //         if (data.task_status == "SUCCESS") {
      //             console.log('success from check status')
      //             this.$router.push('/blog_statistics/'+username)
      //         }
      //         else{
      //             setTimeout(()=>{this.check_status(task_id)}, 3000)
      //         }
      //     })
      // },

        profile_statistics(){

          fetch('/blog_statistics/'+localStorage.getItem('username'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                console.log('success from profile statistics') 
                this.$router.push('/blog_statistics/'+localStorage.getItem('username'))            
               
            })
            .catch((error) => {
                console.log(error)
            })     

          
          
                      
        },

        


  
  }
}

export default navbar