import edit_post from './edit_post.js'
import navbar from './navbar.js'
const profile = {
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
                    <div class="name"><div style="font-weight:bold;font-size: 20px;text-align: center;">%{current_user['fname']} %{current_user['lname']}</div>
                        <br>
                            <a href="#" class="button btn btn-primary" @click.prevent="edit_profile(current_user['username'])">Edit Profile</a>
                 
                    </div>
                    <div class="info">
                        <span><i class="fa-solid fa-user-graduate"></i>&nbsp;%{current_user['profession']}</span>                            
                        <span><i class="fa-sharp fa-solid fa-location-dot"></i>&nbsp;%{current_user['location']}</span>
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
                <h2 class="boxTitle">%{current_user['fname']}'s Profile</h2>
                <!-- Tabs -->
                <ul class="nav nav-tabs userProfileTabs" role="tablist">
                    <li role="presentation" class=""><a href="#tab-item-1" aria-controls="tab-item-1" role="tab" data-toggle="tab" aria-expanded="false">About</a></li>
                    <li role="presentation" class="active"><a href="#tab-item-2" aria-controls="tab-item-2" role="tab" data-toggle="tab" aria-expanded="true">Activities</a></li>
                    
                    <li role="presentation" class=""><a href="#tab-item-3" aria-controls="tab-item-3" role="tab" data-toggle="tab" aria-expanded="false">Connections</a></li>
                </ul>
  
                <div class="tab-content">
                    <!-- About -->
                    <div role="tabpanel" class="tab-pane fade" id="tab-item-1">
                        <div class="userProfileContent">
                            <div class="i">
                                <br>
                                <h2 class="boxHeadline">
                                    <p>Name: %{current_user['fname']} %{current_user['lname']}</p>
                                    <br>
                                    <p>Profession: %{current_user['profession']}</p>
                                    <br>
                                    <p>Location: %{current_user['location']}</p>
                                    <br>
                                    <p>Email ID: <a :href="current_user['email']" title="e-mail">&nbsp;%{current_user['email']}</a> </p>
                                    <br>
                                    <p>Member Since: %{current_user['timestamp']} </p>   
                                </h2>
  
                                
                            </div>
                        </div>
                    </div>
                     
                    <!-- Activities -->
                    
                    <div role="tabpanel" class="tab-pane fade active in" id="tab-item-2">
                        <div class="userActivities">
                         
                            <p v-if="blogs[0]=='undefined'"><strong>No Blogs Found...</strong></p>
                
                            
                            <div class="i" v-else v-for="blog in blogs[0]"> 
                                                                
                                <a href="#" title="#" class="image">
                                    <img :src="blog.author_img" alt="#" width="44" height="44">
                                </a>
                                
                                <div class="activityContent">
                                    
                                    <ul class="simpleListings status">
                                        <li>
                                            
                                            <div class="title">                                            
                                              
                                                        <span> %{blog.author_fname} %{blog.author_lname}
                                                          
                                                            <i @click="delete_post(blog.blog_id)" class="fa-sharp fa-solid fa-trash float-sm-right" ></i>
                                                            
                                                            <i @click="edit_post(blog.blog_id)" class="fa-solid fa-pen-to-square float-sm-right">&emsp;</i>
                                                        </span>

                                                         <br> <h5>Title: %{blog.blog_title} | Category: %{blog.blog_category}</h5
                                            </div>

                                            <div class="info">
                                                    %{blog.blog_post_time}

                                            </div>

                                            <div class="row gx-3 mb-4">
                                                <div class = "column1">
                                                        <p v-html="blog.blog_content"></p>
                                                </div>
                                                <div class = "column2">
                                                    <img :src="blog.blog_file">
                                                </div>
                                            </div>
                                            
                                            <div class="share">                                                
                                                                                                             
                                                <i v-bind:class="'fas fa-heart like-icon-'+blog.blog_id"  v-if="blog.user_liked"  :id="'like-button-'+blog.blog_id"  @click="like(blog.blog_id)" ></i>
                                                                                                        
                                                <i  v-bind:class="'far fa-heart like-icon-'+blog.blog_id" v-else :id="'like-button-'+blog.blog_id"   @click="like(blog.blog_id)" ></i> 
  
                                                <span title="total likes"  style="margin-left: 1px;" :id="'like-count-'+blog.blog_id">%{blog['like_counts']} likes</span>   
                                           
                                                <i style="margin-left: 10px;" aria-hidden="true" class="fa fa-comments"></i>
                                                <span style="margin-left: 2px;" :id="'comment-count-'+blog.blog_id"  title="total comments"> %{blog.blog_comments.length} comments</span>
                                        
                                            </div>
                                
                                        </li>
                                    </ul>
                                    
                                    
                                    <!-- Comments -->
                                    <ul class="simpleListings comments" id="'comment-'+blog.blog_id"  >
                                                  
                                      <li class="showComments" >
                                          <a :href="'#collapse'+blog.blog_id" title="Show Comments" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample"><i class="fa fa-comments"></i> Show <strong id="'comment-count-'+blog.blog_id">%{blog.blog_comments.length} Comments</strong></a>
                                      </li>
  
                                      <div class="collapse" :id="'collapse'+blog.blog_id">
  
                                     
                                      <div v-for="comment in blog.blog_comments">
                                          
                                          <li :id="'comment-delete-'+comment.comm_id" >
                                              <a href="#" title="#" class="image">
                                                  <img :src="comment.comm_image" alt="#" width="44" height="44">
                                              </a>
                                              <div class="c" >
                                                  <div class="title"><a href="#" title="#">%{comment.comm_fname} %{comment.comm_lname}</a>
                                                      
                                                  </div>
                                                  <div class="info">
                                                      %{comment.comm_post_time}
                                                  </div >
  
                                                  <p >%{comment.comm_content}
                                                      <i :id=comment.comm_id v-if="current_user.username===comment.comm_username" title="delete comment" class="delete_comment fa-sharp fa-solid fa-trash float-sm-right" @click="delete_comment(comment.comm_id)"></i>
                                                  </p>
                                              </div>
  
                                          </li>
                                       </div>
                                      </div>
                                      <li >
                                          <a href="#" title="#" class="image">
                                              <img :src="current_user['image']"  alt="#" width="44" height="44">
                                          </a>
                                          <div class="c">                        
  
                                                  <textarea v-model='comment_text[blog.blog_id]' :id="blog.blog_id" class="js-autogrow" rows="2" placeholder="Start typing here..." style="overflow: hidden; word-wrap: break-word; height: 50px; width: 100%">
                                                          
                                                  </textarea>
                                                  <br>
                                                  <button class="comment btn btn-primary" @click="post_comment(blog.blog_id)">Post Comment
                                                  </button>                  
                                                  
                                          </div>
                                      </li>
                          
                              
                                  </ul>
                                     
                                </div>
                                
                            </div>
                      
                        </div>
                    </div>                
  
                    <!-- Connections -->
                    <div role="tabpanel" class="tab-pane fade" id="tab-item-3">
                        
                        <br><br>
                        <div class="connections row gx-3 mb-3">
                            <table class="col-md-6" style="border-right: 2px solid gray;">
                                <thead>
                                <tr>
                                    <th>Followers (%{current_user['total_followers']})</th>
                                    <th class="action">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                    
                         
                                
                                    
                                    <tr v-for="i in total_followers_all" class="candidates-list">
                                        <td class="title">
                                            <div class="col-md-4">
                                                <img class="img-fluid connections_image" :src="i.image" alt="">
                                            </div>
  
                                            <div class="col-md-8" style="text-align: left;">
                                                <h4><a href="#"> %{i.fname} %{i.lname} </a></h4>
                                            </div>
                                            <div class="col-md-8" style="text-align: left;">                                            
                                                <i class="fa-solid fa-user-graduate pr-1"></i></i>%{i.profession} &emsp;
                                                <i class="fa-sharp fa-solid fa-location-dot pr-1"></i>%{i.location}       
                                            
                                            </div>
                                       
                                        </td>
                                        
                                        <td class="col-lg-4">
                                              <div class="column" style="float:left; width: 70%;">                                     
                                                        
                                              
                                            </div>
                                                
                                        </td>
                                    </tr>
                                  
                               
                                </tbody>
                            </table>
  
                            
                            <table class="col-md-6" style="border-left: 2px solid gray; margin-left: -2px;">
                                <thead>
                                <tr>
                                    <th>Following (%{current_user['total_following']})</th>
                                    <th class="action">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                
                                <tr v-for="i in total_following_all" class="candidates-list">
                                    <td class="title">
                                        <div class="col-md-4">
                                            <img class="img-fluid connections_image" :src="i.image" alt="">
                                        </div>
  
                                    <div class="col-md-8" style="text-align: left;">
                                        <h4><a href="#"> %{i.fname} %{i.lname} </a></h4>
                                    </div>
                                        <div class="col-md-8" style="text-align: left;">
  
                                           
                                            <i class="fa-solid fa-user-graduate pr-1"></i></i>%{i.profession} &emsp;
                                            <i class="fa-sharp fa-solid fa-location-dot pr-1"></i>%{i.location}

                                        </div>
                                   
                                    </td>
                                    
                                    <td class="col-sm-2">
                                    <ul >

                                   
                                    </ul>
                                    </td>
                                </tr>
                                                           
  
                                </tbody>
                            </table>
                       
                        </div>        
                        
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
            current_user:"",
            comment_text:[] ,
            total_followers_all: "",
            total_following_all: "",

            }
        },
        components:{
            navbar
        },

        async mounted(){
            if (localStorage.getItem('auth-token')!=null){
            document.title="Blog Lite: Profile" 
            await this.$store.dispatch("get_current_user")
            this.username=window.location.href.split('/')[5]

            await fetch("/api/profile/"+ this.username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
            .then((data) => {
                this.blogs = data.blogs    
                this.current_user = data.user_data 
                this.total_followers_all = data.total_followers_all
                this.total_following_all = data.total_following_all

                })           
                .catch(function (error) {
                    console.log(error);
                }); 
            }                 
        },

        methods: {

            async delete_post(blogId) {
                await fetch("/delete_post/" + blogId,)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data)
                        if (data["msg1"] == "Success") {
                            location.reload()
                        }
                    })
            },

            like(blogId) {              
            const likeCount = document.getElementById('like-count-' + blogId);
            let icon = document.querySelector('.like-icon-'+ blogId);

    
            fetch('/like_post/' + blogId, { method: "POST" })
                .then((res) => res.json())
                .then((data) => {
                    likeCount.innerHTML = data["likes"] + " likes";
                    if (data["liked"] == true) {
                        icon.classList.remove("far");
                        icon.classList.add("fas");
        
                    } else {
                        icon.classList.remove("fas");
                        icon.classList.add("far");
        
                    }
                })
    
        },

        post_comment(blogId){
            const data = { comment_text: this.comment_text[blogId] };

            fetch("/add_comment/" + blogId, 
                 {
                   method: "POST",
                   headers: {
                     "Content-Type": "application/json",
                   },
                   body: JSON.stringify(data),
                 })
                 .then((res) =>  res.json())
                 .then((data) => {
                   this.comment_text[blogId] = "";
                   
    
                   fetch('/api/profile/'+this.username, {
                     method: 'GET',
                     headers: {
                       'Content-Type': 'application/json'
                     },
                   })
                   .then((res1) =>  res1.json())
                   .then((d) => {
                    this.blogs = d.blogs 
                   })                   
                   
                   })
                 .catch((error) => {
                   console.error("Error:", error);
   
                 });
                 
        },


        delete_comment(commentId){
            fetch("/delete_comment/"+ commentId)
           .then((res) => res.json())
           .then((data) => {
            console.log(data)

             document.getElementById("comment-delete-"+commentId).remove();

            });
 
            fetch('/api/profile/'+this.username, {
                     method: 'GET',
                     headers: {
                       'Content-Type': 'application/json'
                     },
                   })
                   .then((res) =>  res.json())
                   .then((d) => {
                    this.blogs = d.blogs 
                   }) 
         },
         user_profile(username){
            this.$router.push('/user_profile/'+username)
            },
        edit_profile(username){
            this.$router.push('/edit_profile/'+username)
        },
         edit_post(blogId){
            this.$router.push('/edit_post/'+blogId)
         },

    },

       

}

export default profile