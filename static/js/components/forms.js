const register = {
    template: `
    <div>
    <div class="vh-100" style="background-color: rgb(45, 122, 148); position: relative; width: 100%; height: fit-content;">
    <h1  style="text-align:center; padding-top: 0.7rem; color:white; background-color:#333333; height: 60px; margin-top: 0px;">Welcome to Blog Lite</h1>
    <div class="container" style="margin-top: 80px;">			
      <div class="row d-flex justify-content-center align-items-center h-70">
        <div class="col col-xl-12">
          <div class="card" style="border-radius: 1rem;">
            <div class="row g-0">
              <div class="col-md-6 col-lg-6 d-none d-md-block">
                <img src="../static/Images/login_image2.jpg"
                  alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem; height: 700px;" />
              </div>
              <div class="col-md-7 col-lg-6" style="padding-top: 5px;">
                <div class="card-body text-black" style="padding-right: 10%;">
  
                <form method="POST" id="form" enctype="multipart/form-data" @submit.prevent="validateForm">
                    <h1 class="fw-bold mb-5 pb-4" style="letter-spacing: 1px;text-align: center; margin-top: auto;">Registration Form</h1>
  
                    <div class="form-outline mb-4 inner-addon left-addon">
                        <i class="glyphicon glyphicon-user"></i>
                        <input v-model=firstname class="form-control "placeholder="Firstname" required="required">	
                        				
                    </div>

                    <div class="form-outline mb-4 inner-addon left-addon">
                        <i class="glyphicon glyphicon-user"></i>
                        <input v-model=lastname class="form-control "placeholder="Lastname" required="required">						
                    </div>
                    
                    <div class="form-outline mb-4 inner-addon left-addon">
                        <i class="glyphicon glyphicon-user"></i>
                        <input v-model=username class="form-control "placeholder="Username" required="required">
                        							
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

         

                    <div class="form-outline mb-5 inner-addon">
                    
                          <i class="glyphicon glyphicon-lock" style="left:0px;"></i>
                          <input v-model=password class="form-control "placeholder="Password" :type="passwordFieldType1" style="padding-left:30px" id="password" required="required">													
                          <i class="glyphicon glyphicon-eye-close" style="right:0px; padding-right:20px" @click="switchVisibility1"></i>
                      
						      </div>

                  <div class="form-outline mb-5 inner-addon">
                    
                          <i class="glyphicon glyphicon-lock" style="left:0px;"></i>
                          <input v-model=retypepassword class="form-control "placeholder="Password" :type="passwordFieldType2" style="padding-left:30px" id="password" required="required">													
                          <i class="glyphicon glyphicon-eye-close" style="right:0px; padding-right:20px" @click="switchVisibility2"></i>
                      
						      </div>

                    <div class="form-outline mb-4">	
                      <input type="file" class="form-control" ref="fileInput" @change="handleFileUpload">
                                       
                        
                    </div>							
                    
                    <p v-if="errors.length">
                      <b>Please correct the following error(s):</b>
                      <ul>
                        <li v-for="error in errors">{{ error }}</li>
                      </ul>
                    </p>

                    <div id="show_error"></div>
                    
                    <div class="pt-1 mb-4 col-md-5" style="text-align: center;margin-left: 30%;" >
                    <input type="submit" value="Register" class="btn btn-dark btn-lg btn-block" >
                    </div>	
                  </form>
                  
                      
                </div>
                <br><br>
                <div class="card-body text-black" style="color: #393f81; position: fixed; padding-top: 1px; padding-left:1%;">
                    <span>Already have an account? 
                        <a href="#" style="color: #393f81;">Login here
                        </a></span>
                   </div>              
                
                
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
    data: function() {
        return {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            dob: '',
            profession: '',
            location: '',
            password: '',
            retypepassword: '',
            image: '',
            errors: [],
            passwordFieldType1: 'password',
            passwordFieldType2: 'password',

        }
      },
    
    mounted: function() {      
          document.title="Blog Lite: Registration"
    },

    methods: { 
      switchVisibility1() {
        if (this.passwordFieldType1 == 'password') {
          this.passwordFieldType1 = 'text';
        } else {
          this.passwordFieldType1 = 'password';
        }
      },
      switchVisibility2() {
        if (this.passwordFieldType2 == 'password') {
          this.passwordFieldType2 = 'text';
        } else {
          this.passwordFieldType2 = 'password';
        }
      },

      validateForm(){
        this.errors=[];        

        if (this.password!=this.retypepassword){
          this.errors.push('Password doesnt match')
        }
        if(!this.errors.length){
          this.register()
        }
      },

      handleFileUpload() {
        this.image = this.$refs.fileInput.files[0];
      },
        
            
        register:function(){           

            let formData = new FormData();
            formData.append('firstname', this.firstname);
            formData.append('lastname', this.lastname);
            formData.append('username', this.username);
            formData.append('email', this.email);
            formData.append('dob', this.dob);
            formData.append('profession', this.profession);
            formData.append('location', this.location);
            formData.append('password', this.password);
            formData.append('retypepassword', this.retypepassword);
            formData.append('image', this.image);
            
            try {
               const response = fetch("/user_register", {
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
                  setTimeout( () => this.$router.push({ path: '/'}), 3000);
                  
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
        }
   
    }
}   



export default register