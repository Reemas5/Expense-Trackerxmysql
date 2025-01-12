const forgot_password = document.getElementById('forgot_password')
const forgot_password_form = document.getElementById('forgot-password-form')
const handleformsubmit = async(event)=>{
    event.preventDefault();
  
    const email = event.target.email.value;
    const password= event.target.password.value;


    const user_details= {
      
        email,
        password,
    }
  try{
     const response = await axios.post("http://localhost:3500/login",user_details)
     if (response.status === 201) {
        console.log(response.data)

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('Ispremium',response.data.premium_user)
      
        window.location.href = "expense.html";
      
    } else {
        alert('Login failed');
    }
} catch (error) {
    
    console.log(error.message);
}

};
forgot_password.addEventListener('click',()=>{
    forgot_password_form.classList.remove('hidden')

})
const forgotformsubmit= async(event)=>{
    event.preventDefault()
    const email = event.target.useremail.value
    try{
        const result =await axios.post('http://localhost:3500/forgot_password',{email})
        console.log(result)
        forgot_password_form.classList.add('hidden')
    }
    catch(error){
         console.log(error.message)
         alert('User does not exist')
    }

}