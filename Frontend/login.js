const handleformsubmit = (event)=>{
    event.preventDefault();
  
    const email = event.target.email.value;
    const password= event.target.password.value;


    const user_details= {
      
        email,
        password,
    }

    axios.post("http://localhost:3500/login",user_details)
    .then((response)=>{
        console.log(response.data)
    })
    .catch((error)=>{
        console.log(error.message)
    })

}