import navbar from './navbar.js'
const search = {
    template: `
    <div>
    <navbar></navbar>
    <div id="snipperContent">         
         
        <div class="container-fluid" style="padding: 0% 7%;">
            <div class="row">
                <div class="col-xs-12 col-md-2 col-lg-3">
                <div class="userProfileInfo">                        
                    <div class="box">
                        <div class="image text-center">
                            <img :src="this.$store.state.current_user.image" alt="../static/default_dp.png" class="img-responsive">
                            
                        </div>                   
                        <div class="name">
                            <div style="font-weight:bold;font-size: 20px;text-align: center;">%{current_user['fname']} %{current_user['lname']}
                            </div>
                        </div>
                        <div class="info">
                            <span><i class="fa-solid fa-user-graduate"></i>&nbsp;%{current_user['profession']}</span>                            
                            <span><i class="fa-sharp fa-solid fa-location-dot"></i>&nbsp; %{current_user['location']}</span>
                            <span><i class="fa-solid fa-envelope"></i> <a :href="current_user['email']" title="e-mail">&nbsp;%{current_user['email']}</a></span>
                        </div>
                        <div class="stats" style="padding:10px 0px 5px; border-bottom: 2px solid #e6e7ed;">
                            <div class="row" style="padding-left: 25px;" >
                                <div class="col-md-4 mb20">
                                    <h4>%{current_user['total_blogs']}</h4>
                                    <h5 class="text-small"><strong>Posts</strong></h5>
                                </div> 
                                <div class="col-md-4 mb20">
                                    <h4>%{current_user['total_followers']}</h4>
                                    <h5 class="text-small"><strong>Followers</strong></h5>
                                </div>
                                <div class="col-md-4 mb20">
                                    <h4>%{current_user['total_following']}</h4>
                                    <h5 class="text-small"><strong>Following</strong></h5>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
                <div class="col-xs-12 col-md-8 col-lg-9">
                        <div class="box">
                            <h2 class="boxTitle">%{current_user['fname']}'s Profile</h2>
                            <br>
                            <h3>Search Results:</h3> <br>   
                                <div v-for="i in search_result">    
                                    <img :title="i.fname + ' ' + i.lname" :src="i.image" width="44" height="44"> &emsp; <a href="#" @click.prevent="user_profile(i.username)">%{i.fname} %{i.lname} </a>
                                    <br><br>
                                </div>    
                            
                        </div>
                    </div>
                </div>
        
        </div> 
    </div>
    </div>
    `,

    delimiters : ['%{','}'],
    components: {
        navbar
    },
    data() {
        return {
            value: "",
            search_result:"",
            current_user: "",
            username: "",
        }
    },

    mounted: async function() { 
        
            document.title="Blog Lite: Search" 
            this.username=window.location.href.split('/')[5]
            this.value=window.location.href.split('/')[6]
            
            await fetch("/api/current_user/"+localStorage.getItem('username'), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
            .then((data) => {
                this.current_user = data.user_data
            }); 
        

            await fetch("/search/"+this.username+"/"+this.value, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                }).then((res) => res.json())
                .then((data1) => {
                    console.log(data1)
                    this.search_result = data1
                });
 
        
    }, 
    
    methods: {
    user_profile(username){
        this.$router.push('/user_profile/'+username)
    }
},


}

export default search