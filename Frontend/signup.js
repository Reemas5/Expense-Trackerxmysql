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
        const response = await axios.post("http://localhost:3500/signup", user_details);

        // Check if the response status is 200 (success)
        if (response.status === 201) {
            // Redirect to login page if signup is successful
            window.location.href = "login.html";
        } else {
            alert('Sign up failed');
        }
    } catch (error) {
        // Handle error if the request fails
        console.log(error.message);
    }
};
