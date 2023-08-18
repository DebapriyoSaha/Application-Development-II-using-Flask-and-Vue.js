import navbar from './navbar.js'
const edit_post = {
    template: `
    <div>
    <navbar></navbar>
        
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <div id=message></div>
                            <h3 class="card-title">Edit Post</h3>
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
                            <input type="file" class="form-control" ref="fileInput" @change="handleFileUpload">
                            <img :src="blog_image" width="300" height="300" class="img-responsive" >   

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
            blogId:'',
            blog_image:'',
            username:''
            
        }
    },
    components: {
        navbar
    },

    async mounted(){
        if (localStorage.getItem('auth-token')!=null){

        document.title="Blog Lite: Edit Post" 
        await this.$store.dispatch("get_current_user")
        this.blogId =window.location.href.split('/')[5]        
        
        
        await fetch("/get_blog/" + this.blogId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                this.title = data.title
                this.content = data.content
                this.category = data.category
                this.blog_image = data.blog_file              
               
        }); 
        
        await fetch("/api/current_user/"+localStorage.getItem('username'), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                this.username = data.user_data.username
        });
    }

    },

    methods: {
        validateForm() {
            if (this.title == '' || this.content == '') {
                alert('Please fill all the fields')
            } else {
                this.editPost()
            }
        },

        editPost() {

            let formData = new FormData()
            formData.append('title', this.title)
            formData.append('content', this.content)
            formData.append('category', this.category)
            formData.append('image', this.image)
            
            try {
                const response = fetch("/edit_post/" + this.blogId, {
                 method: "POST",
                 body: formData,
               })
               .then(response => response.json())
               .then(data => {

                 if(data['msg1']=='Success'){
                   const msgdiv = document.getElementById('message');
                   msgdiv.innerHTML = data['msg2'];
                   msgdiv.style.fontWeight = 'bold';
                   msgdiv.style.color = "green";
                   setTimeout( () => this.$router.push("/user_profile/"+localStorage.getItem('username')), 2000);
                   
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
        },
    }

}

export default edit_post