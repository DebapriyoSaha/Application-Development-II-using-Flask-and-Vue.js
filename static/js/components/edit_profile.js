import navbar from './navbar.js'
const edit_profile = {
    template: `
    <div>
    <navbar></navbar>
    <div id="snipperContent">         
     
        <div class="container-fluid " style="padding: 0% 7%;">

        <div class="row">
            <div class="col-xs-12 col-md-4 col-lg-3">
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
            
    
            <div class="col-xs-12 col-md-8 col-lg-6">
            <div class="box">
                <div class="card mb-4">
                    <div class="card-header"><strong>Edit Profile</strong></div>
                    <div class="card-body">                           

                        <form method="POST" id="form" enctype="multipart/form-data">
                                    
                            <div class="form-outline mb-4 inner-addon left-addon">
                                <i class="glyphicon glyphicon-user"></i>
                                <input v-model=firstname class="form-control "placeholder="Firstname" required="required">	
                                                
                            </div>
        
                            <div class="form-outline mb-4 inner-addon left-addon">
                                <i class="glyphicon glyphicon-user"></i>
                                <input v-model=lastname class="form-control "placeholder="Lastname" required="required">						
                            </div>
                            
        
                            <div class="form-outline row mb-4 inner-addon left-addon">
                                <div class="col-md-8">
                                    <i class="glyphicon glyphicon-envelope" style="padding-left:25px"></i>
                                    <input type='email' v-model=email class="form-control "placeholder="Email" required="required">                            	
        
                                </div>	
                                <div class="col-md-4">
                                    <i class="glyphicon glyphicon-calendar" style="padding-left:25px"></i>
                                    <input v-model=dob type="date" class="form-control" required="required">	
                                        
                                </div>							
                            </div>
        
                            <div class="form-outline row mb-4 inner-addon left-addon">
                                <div class="col-md-6">
                                    <i class="glyphicon glyphicon-education" style="padding-left:25px"></i>
                                    <input v-model=profession class="form-control" placeholder="Profession" required="required">	
                                </div>	
                                <div class="col-md-6">
                                    <i class="glyphicon glyphicon-map-marker" style="padding-left:25px"></i>
                                    <input v-model=location class="form-control" placeholder="Location" required="required">	
                                </div>							
                            </div>
    
        
                          
                            <div class="form-outline mb-4">	
                            <p>Change Profile Picture Below</p>
                            <input type="file" class="form-control" ref="fileInput" @change="handleFileUpload">
                                            
                                
                            </div>							
                            
                            <p v-if="errors.length">
                            <b>Please correct the following error(s):</b>
                            <ul>
                                <li v-for="error in errors">{{ error }}</li>
                            </ul>
                            </p>
        
                            <div id="show_error"></div>
                            
                            <div class="pt-1 mb-4 col-md-5" style="text-align: center; margin-left:30%" >
                                <input style="width: 200px; height: 40px;" type="submit" value="Update" @click.prevent="update_profile" class="btn btn-dark btn-lg btn-block" >
                                <button style="width: 200px; height: 40px;" value="Delete" @click.prevent="delete_profile" class="btn btn-dark btn-lg btn-block" >Delete</button>
                            </div>	
                        </form>
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
        return {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            dob: '',
            profession: '',
            location: '',
            image: '',
            errors: [],
            current_user:"",
        }
      },
    components: {
        navbar
    },
    
      mounted: async function() { 

        if (localStorage.getItem('auth-token')!=null){
        document.title="Blog Lite: Edit Profile"  
        await this.$store.dispatch("get_current_user",localStorage.getItem('username'))
        this.username=window.location.href.split('/')[5]

        await fetch("/api/current_user/"+localStorage.getItem('username'), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                this.firstname = data.user_data.fname
                this.lastname = data.user_data.lname
                this.email = data.user_data.email
                this.dob = data.user_data.dob
                this.profession = data.user_data.profession
                this.location = data.user_data.location
                this.current_user = data.user_data
               
               
        });  
        }         
        
    },
 
    methods: {  

      

      handleFileUpload() {
        this.image = this.$refs.fileInput.files[0];
      },
        
            
         update_profile:async function(){           

            let formData = new FormData();
            formData.append('firstname', this.firstname);
            formData.append('lastname', this.lastname);
            formData.append('email', this.email);
            formData.append('dob', this.dob);
            formData.append('profession', this.profession);
            formData.append('location', this.location);
            formData.append('image', this.image);
            
            try {
               const response = await fetch("/edit_profile/"+this.username, {
                method: "POST",
                body: formData,
              })
              .then(response => response.json())
              .then(data => {
                console.log('Success:', data);
                if(data['msg1']=='Success'){
                  const errdiv = document.getElementById('show_error');
                  errdiv.innerHTML = data['msg2'];
                  errdiv.style.fontWeight = 'bold';
                  errdiv.style.color = "green";
                  setTimeout( () => this.$router.push({ path: '/user_profile/'+this.username}), 3000);
                  
                }
                else{
                    // alert("Registration Failed")
                    const errdiv = document.getElementById('show_error');
                    errdiv.style.fontWeight = 'bold';
                    errdiv.style.color = "red";                    
                    errdiv.innerHTML = data['msg2'];
                }
              })
              
            
            } 
            catch (error) {
                console.error("Error:", error);
              }
        },
        delete_profile:async function(){

            if (confirm("Are you sure you want to delete your profile?")) {
                await fetch("/delete_profile/"+this.username, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    if(data['msg1']=='Success'){
                      const errdiv = document.getElementById('show_error');
                      errdiv.innerHTML = data['msg2'];
                      errdiv.style.fontWeight = 'bold';
                      errdiv.style.color = "green";
                      setTimeout( () => this.$router.push({ path: '/'}), 3000);
                      
                    }
                    else{
                        const errdiv = document.getElementById('show_error');
                        errdiv.style.fontWeight = 'bold';
                        errdiv.style.color = "red";                    
                        errdiv.innerHTML = data['msg2'];
                    }
            }); 
        }
        },
   
    }
}   



export default edit_profile