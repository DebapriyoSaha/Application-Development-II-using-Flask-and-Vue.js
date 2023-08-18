const login = {
    template:`
    <div class="vh-100" style="background-color: rgb(45, 122, 148)">
		<h1  style="text-align:center; padding-top: 0.7rem; color:white; background-color:#333333; height: 60px; margin-top: 0px;">Welcome to Blog Lite</h1>
		<div class="container" style="margin-top:100px">			
		  <div class="row d-flex justify-content-center align-items-center h-70">
			<div class="col col-xl-10">
			  <div class="card" style="border-radius: 1rem;">
				<div class="row g-0">
				  <div class="col-md-7 col-lg-6 d-none d-md-block">
					<img src="../static/Images/login_image2.jpg"
					  alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem; height: 600px;" />
				  </div>
				  <div class="col-md-7 col-lg-5 d-flex align-items-center">
					<div class="card-body text-black" style="padding-left:10%;" >
	  
					  <form>
						
						<h1 class="fw-bold mb-5 pb-3" style="letter-spacing: 1px;text-align: center;">Login</h1>				  
						 
            <div class="form-outline mb-5  inner-addon left-addon"> 
              <i class="glyphicon glyphicon-user"></i>            
               <input  v-model=username append-icon="mdi-magnify" class="form-control "placeholder="Username">             												
							
						</div>
	  
						<div class="form-outline mb-5 inner-addon">
						
							    <i class="glyphicon glyphicon-lock" style="left:0px;"></i>
                  <input v-model=password class="form-control "placeholder="Password" :type="passwordFieldType" style="padding-left:30px" id="password">													
							    <i class="glyphicon glyphicon-eye-close" style="right:0px; padding-right:20px" @click="switchVisibility"></i>
							
						</div>

                        <div id="show_error"></div>
  
						<div class="text-center pt-1 mb-4" style="text-align: center;" >
                  <button type="button" @click="login" class="btn btn-dark btn-lg btn-block" >Login</button>

                  
						</div>	

						<p class="mb-5 pb-lg-2" style="color: #393f81;">Don't have an account? <button   @click="registration_form"	style="color: #393f81; ">Register here</button></p>

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
    
    data: function(){
        return{
            username:"",
            password:"",
            passwordFieldType: 'password',
        }
    
    },
    mounted() {
        document.title="Blog Lite: Login" 
              },

    methods:{
        switchVisibility() {
            if (this.passwordFieldType == 'password') {
              this.passwordFieldType = 'text';
            } else {
              this.passwordFieldType = 'password';
            }
          },
          
      login(){
        const data = { username: this.username,
                       password: this.password
                      };
        fetch("/user_login" , 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
            .then((response) =>  response.json())
            .then((data1) => {
              if (data1['msg1'] == "Success"){
                localStorage.setItem('auth-token', data1['auth_token'])
                localStorage.setItem('username', data1['msg2'])
                
                this.username=localStorage.getItem('username')
                console.log(localStorage.getItem('username'))
                this.$store.dispatch("get_current_user",localStorage.getItem('username'))

                this.$router.push(`/dashboard/${data1['msg2']}`)
              
              }
              else if (data1['msg1'] == "Failed")
              {
                const errdiv = document.getElementById('show_error');
                errdiv.innerHTML = data1['msg2'];
              }

            })
            .catch((error) => {
              console.error("Error:", error);

            });
        },

        registration_form(){
          console.log("test")
          this.$router.push("register")
        }

    }

}


export default login
