import navbar from './navbar.js'
const blog_statistics = {
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
                        <img :src="profile_user['image']" alt="../static/default_dp.png" class="img-responsive">
                        
                    </div>
                    <div class="name">
                        <div style="font-weight:bold;font-size: 20px;text-align: center;">%{profile_user['fname']} %{profile_user['lname']}</div>
                        
                            <br>
                            <button v-if="profile_user['id']==current_user_id" class="button btn btn-primary" @click.prevent="edit_profile(current_user['username'])">Edit Profile</button>

                            <br>
                            <a href="#" v-if="profile_user['followers_id_list'].includes(current_user_id) && profile_user['id']!=current_user_id" class="button btn btn-primary" @click.prevent="unfollow(profile_user['username'])">Unfollow</a>  
                            <br>
                            <a href="#" v-if="!profile_user['followers_id_list'].includes(current_user_id) && profile_user['id']!=current_user_id" class="button btn btn-primary" @click.prevent="follow(profile_user['username'])">Follow</a>                 
                           
                    </div>
                    <div class="info">
                        <span><i class="fa-solid fa-user-graduate"></i>&nbsp;%{profile_user['profession']}</span>                            
                        <span><i class="fa-sharp fa-solid fa-location-dot"></i>&nbsp;%{profile_user['location']}</span>
                        <span><i class="fa-solid fa-envelope"></i> <a :href="profile_user['email']" title="e-mail">&nbsp;%{profile_user['email']}</a></span>
  
                    </div>
  
                    <div class="stats" style="padding:10px 0px 5px; border-bottom: 2px solid #e6e7ed;">
                      <div class="row" style="padding-left: 25px;" >
                          <div class="col-md-4 mb20">
                              <h4>%{profile_user['total_blogs']}</h4>
                              <h5 class="text-small"><strong>Posts</strong></h5>
                          </div> 
                          <div class="col-md-4 mb20">
                              <h4>%{profile_user['total_followers']}</h4>
                              <h5 class="text-small"><strong>Followers</strong></h5>
                          </div>
                          <div class="col-md-4 mb20">
                              <h4>%{profile_user['total_following']}</h4>
                              <h5 class="text-small"><strong>Following</strong></h5>
                          </div>
                      </div>
                  </div>
  
                    <div class="all_connections">
                                      
                        
                        <div class="profile-picture" style="border-top:10px">
                            <strong style="padding-left: 25px">Followers</strong>
                            <div class="profile-picture-block">
                      
                                <div v-for="i in total_followers_all" class="profile-page-block" style="float:left;margin-left: 10px;margin-bottom:10px;margin-right:5px">
                                    <div class="profile-picture bg-gradient">
                                    <img :title="i.fname+' '+i.lname" :src="i.image" width="44" style="cursor:pointer" height="44" @click="user_profile(i.username)"></a>
                                    </div>
                                </div>
                               
                            </div>    
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
  
        <div class="col-xs-12 col-md-8 col-lg-9">
            <div class="box">
                <h2 class="boxTitle">%{profile_user['fname']}'s Blog Statistics</h2>

                <div id="loading">
                    </div>
           

                <div v-if="!blogs[0].length">
                    <p>No statistics to display</p>
                </div>

                <div v-else id="blog_statistics">

                    <div>

                        <img :src="'../static/Images/blog_vs_likes'+username+'.png'" id="like" style="width:30%;height:30%;">
                    </div>

                    <div>
                        <img :src="'../static/Images/blog_vs_comments'+username+'.png'" id="comment" style="width:30%;height:30%;">
                    </div>

                    <div>
                        <img :src="'../static/Images/category_piechart'+username+'.png'" id="cat" style="width:30%;height:30%;">
                    </div> 
                </div>       
                
            </div>
        </div>
    </div>
    </div>
  </div> 
    
    </div>
        `,
        delimiters : ['%{','}'],

        data: function() {
            return{
            blogs:"",
            username: "",
            profile_user:"",
            current_user_id:"",
            current_user:"",
            comment_text:[] ,
            total_followers_all: "",
            total_following_all: "",
            }
        },
        components:{
            navbar
        },
        mounted(){

            if (localStorage.getItem('auth-token')!=null){

            document.title="Blog Lite: Blog Statistics" 

            this.username=window.location.href.split('/')[5]

            fetch("/api/profile/"+ this.username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
            .then((data) => {
                this.blogs = data.blogs
                this.profile_user = data.user_data    
                this.total_followers_all = data.total_followers_all
                this.total_following_all = data.total_following_all
                })           
                .catch(function (error) {
                    console.log(error);
                }); 
                
                fetch("/api/current_user/"+localStorage.getItem('username'), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }).then((response) => response.json())
                    .then((data) => {
                        this.current_user_id = data.user_data.id
                        this.current_user=data.user_data
                        this.current_user_follower_list=data.user_data.followers_id_list
                });



               // statistics fetch api call

            }     

        },


       methods: {



        
        edit_profile(username){
            this.$router.push('/edit_profile/'+username)
        },         

        
        user_profile(username){
            this.$router.push('/user_profile/'+username)
            location.reload()
        },
    },

}

export default blog_statistics