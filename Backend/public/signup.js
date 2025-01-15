const handleformsubmit = async (event) => {
    event.preventDefault();
    
    // Extracting form values
    const name = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const user_details = {
        name,
        email,
        password,
    };

    try {
        // Sending POST request to the backend for signup
        const response = await axios.post("http://54.144.231.227:3600/signup", user_details);

        // Check if the response status is 200 (success)
        if (response.status === 201) {
            
            
            window.location.href = "http://54.144.231.227:3600/login";
        } else {
            alert('Sign up failed');
        }
    } catch (error) {
        
        console.log(error.message);
    }
};
