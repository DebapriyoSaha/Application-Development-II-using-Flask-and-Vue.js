import navbar from './navbar.js'
const add_post = {
    template: `
    <div>
    <navbar></navbar>
        
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div id=message></div>
                            <h3 class="card-title">Add Post</h3>
                        </div>
                        <div class="card-body">
                            <form method="POST" id="form" enctype="multipart/form-data" @submit.prevent="validateForm">
                                <div class="form-group">
                                    <label for="title">Title</label>
                                    <input type="text" class="form-control" id="title" v-model="title" placeholder="Enter Title" required="required">
                                </div>

                                <div class="form-group">
                                    <label for="category">Category</label>
                                    <select style="height:100%" id="category" class="form-control" v-model="category" placeholder="Category" required="required">
                                        <option value="Travel">Travel</option>
                                        <option value="Food">Food</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Business">Business</option>
                                        <option value="Education">Education</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Music">Music</option>
                                        <option value="Health & Fitness">Health & Fitness</option>
                                        <option value="Fashion & Beauty">Fashion & Beauty</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Movies">Movies</option>
                                        <option value="Sports">Sports</option>
                                    </select>
                                </div>
                                


                        <div class="form-group">
                            <label for="content">Content</label>
                            <textarea class="form-control" id="content" v-model="content" rows="3" required="required"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="image">Image</label>
                            <input type="file" class="form-control" id="image" ref="fileInput" @change="handleFileUpload" required="required">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
    </div>
    `,
    data() {
        return {
            title: '',
            content: '',
            image: '',
            category:'',
            username:'',
            
        }
    },
    components: {
        navbar
    },

    async mounted(){
        if (localStorage.getItem('auth-token')!=null){
            this.username=window.location.href.split('/')[5] 
            document.title="Blog Lite: Add Post" 
        }      
    },

    methods: {
        validateForm() {
            if (this.title == '' || this.content == '' || this.image == '') {
                alert('Please fill all the fields')
            } else {
                this.addPost()
            }
        },

        addPost() {
            if (localStorage.getItem('auth_token') == 'undefined'){
                this.$router.push('/')
            }


            let formData = new FormData()
            formData.append('title', this.title)
            formData.append('content', this.content)
            formData.append('category', this.category)
            formData.append('image', this.image)
            
            try {
                const response = fetch("/add_post/" + this.username, {
                 method: "POST",
                 body: formData,
               })
               .then(response => response.json())
               .then(data => {
                 console.log('Success:', data);
                 if(data['msg1']=='Success'){
                   const msgdiv = document.getElementById('message');
                   msgdiv.innerHTML = data['msg2'];
                   msgdiv.style.fontWeight = 'bold';
                   msgdiv.style.color = "green";
                   setTimeout( () => this.$router.push("/user_profile/"+this.username), 3000);
                   
                 }
                   else{
                     const msgdiv = document.getElementById('message');
                     msgdiv.style.fontWeight = 'bold';
                     msgdiv.style.color = "red";                    
                     msgdiv.innerHTML = data['msg2'];
                 }
               })
               
             
             } 
             catch (error) {
                 console.error("Error:", error);
               }

        },
        handleFileUpload() {
            this.image = this.$refs.fileInput.files[0]
            console.log(this.image)
        },
    }

}

export default add_post