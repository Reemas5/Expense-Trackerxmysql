const { default: axios } = require("axios");

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
     const response = await axios.post("http://54.144.231.227:3600/login",user_details)
     if (response.status === 201) {
        console.log(response.data)

         localStorage.setItem('token', response.data.token);
        localStorage.setItem('Ispremium',response.data.premium_user)
        const token = localStorage.getItem('token')
        const response_2 = await axios.get("http://54.144.231.227:3600/expense_auth",{
            headers:{
                'Authorization':token,
            }
        });
        if (response_2.status === 200){
            window.location.href = "http://54.144.231.227:3600/expense"
        }
      
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
        const result =await axios.post('http://54.144.231.227:3600/forgot_password',{email})
        console.log(result)
        forgot_password_form.classList.add('hidden')
    }
    catch(error){
         console.log(error.message)
         alert('User does not exist')
    }

}