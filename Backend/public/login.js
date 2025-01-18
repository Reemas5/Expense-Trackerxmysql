

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
     const response = await axios.post("http://3.88.47.203/login",user_details)
     if (response.status === 201) {
        console.log(response.data)

         localStorage.setItem('token', response.data.token);
        localStorage.setItem('Ispremium',response.data.premium_user)
        
        // const response_2 = await axios.get("http://3.88.47.203/expense_auth",{
        //     headers:{
        //         'Authorization':token,
        //     }
        // });
    
        window.location.href = "http://3.88.47.203/expense"
        
      
    // } else if (response.status===404){
    //     alert('You do not have an account');
    // }
    // else if (response.status===400){
    //     alert('Either of the fiels is incorrect')
    // }
       
    }
} catch (error) {
    if (error.response.status===404){
        alert('You do not have an account');
        }
        else if (error.response.status ===400){
            alert('Either of the fields is incorrect')
        }
        else{
            alert('internal server error')
        }
    
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
        const result =await axios.post('http://3.88.47.203/forgot_password',{email})
        console.log(result)
        forgot_password_form.classList.add('hidden')
    }
    catch(error){
         console.log(error.message)
         alert('User does not exist')
    }

}