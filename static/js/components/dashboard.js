import navbar from './navbar.js'
const dashboard = {
    
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
                    <div class="row">
                            <div class="column col-lg-9">
                                <h2 class="boxTitle">News Feed</h2>

                            </div>                        
                    </div>

                            <div role="tabpanel" class="tab-pane fade active in" id="tab-item-2">
                                <div class="userActivities">
                                    <h3 v-if="!blogs[0].length"><p>You are not following any user. Please follow to view blogs</p></h3>
                                    <div class="i" v-else v-for="blog in blogs[0]">                                    
                                        <a href="#" title="#" class="image">
                                            <img :src="blog.author_img" alt="#" width="44" height="44">
                                        </a>
                                        
                                        <div class="activityContent">
                                            
                                            <ul class="simpleListings status">
                                                <li>
                                                    
                                                    <div class="title">
                                                        <a href="#" title="#" @click.prevent="user_profile(blog.author_username)"> %{blog.author_fname} %{blog.author_lname} </a> 
                                                    
                                                            &nbsp;<label style="background-color: darkgray; font-style: italic; 
                                                            color:black; border-style:groove;font-size: 15px; font-weight: lighter;">Following
                                                            
                                                            </label>
                                                            <button class="comment btn btn-success"  style="position: absolute; right: 10px;" @click="download_blog(blog.blog_id)">Download Blog</button>
                                                        
                                                            
                                                        
                                                    </div>

                                                    <h5>Title: %{blog.blog_title} | Category: %{blog.blog_category}</h5>

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
                            </div> 
                        </div>
                     </div>      
            </div>
        </div>   

    </div>`, //last line

    delimiters : ['%{','}'], 

    data:  function() {
        return {
           blogs:"",
           username:"", 
           comment_text:[] ,
           current_user:"",         
        }
    },

    components : {
        navbar,
    },
    mounted: async function() { 
        
        if (localStorage.getItem('auth-token')) {
        
        this.username=window.location.href.split('/')[5] 
        document.title="Blog Lite: News Feed"  
         
        if (localStorage.getItem('auth_token') != 'undefined'  && localStorage.getItem('username') === this.username) {
            console.log("Inside",this.username)
            await fetch("/api/dashboard/"+ this.username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
            .then((data) => {
                this.blogs = data.blogs
                this.current_user = data.current_user
            });           
            
        }
        else{
            alert("You are not authorized to view this page")
            this.$router.push('/')
        }
    }
    },    

    methods:{

        like(blogId) {  
            
            const likeCount = document.getElementById('like-count-' + blogId);
            let icon = document.querySelector('.like-icon-'+ blogId);

    
            fetch('/like_post/'+this.username+"/" + blogId, { method: "POST" })
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

        async post_comment(blogId){
            const data = { comment_text: this.comment_text[blogId] };

            await fetch("/add_comment/"+localStorage.getItem('username')+"/"+ blogId, 
                 {
                   method: "POST",
                   headers: {
                     "Content-Type": "application/json",
                   },
                   body: JSON.stringify(data),
                 })
                 .then((res) =>  res.json())
                 .then((data) => {
                    console.log('comment added successfully')
                   this.comment_text[blogId] = "";
    
                   fetch('/api/dashboard/'+this.username, {
                     method: 'GET',
                     headers: {
                       'Content-Type': 'application/json'
                     },
                   })
                   .then((res1) =>  res1.json())
                   .then((d) => {
                    // this.username=username
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
 
            fetch('/api/dashboard/'+this.username, {
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

        
        download_blog(blogID){
            fetch(`/export_blog/${blogID}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log("Celery Task Details",data)
                    window.location.href = "/download-file"
            })
        }

    },

    
};


export default dashboard


