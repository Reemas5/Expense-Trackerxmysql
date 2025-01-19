
const desp = document.getElementById('display_item')
const header_of_expense = document.getElementById('header_of_expense')
const premium_user_f = document.getElementById('premium_user_f');
const show_leaderboard = document.getElementById('show_leaderboard')
//const leaderboard = document.getElementById('leaderboard_items')
const leader = document.getElementById('leaderboard')
const download_btn = document.getElementById('download_btn')

const buy_premium =document.getElementById('buy_premium');
const getpremiumstatus = localStorage.getItem('Ispremium')
//const lead_btn = document.getElementById('lead_btn')
let currentPage = 1;
let itemsPerPage = localStorage.getItem('itemsPerPage')
  ? parseInt(localStorage.getItem('itemsPerPage'))
  : 5;

document.addEventListener('DOMContentLoaded', function () {
  

  const itemsPerPageDropdown = document.querySelector('#itemsPerPage');
  itemsPerPageDropdown.value = itemsPerPage;

  itemsPerPageDropdown.addEventListener('change', function () {
    itemsPerPage = parseInt(this.value);
    localStorage.setItem('itemsPerPage', itemsPerPage);
    currentPage = 1;
    fetchexpenses(currentPage);
  });

  fetchexpenses(currentPage);
})

function leaderboardfunc(details) {
    // Show the leaderboard
    leader.classList.remove('hidden');
  
    // Get the <ul> element inside the leaderboard
    const leaderboardItems = document.getElementById('leaderboard_items');
  
    // Clear existing items in the leaderboard to avoid duplicates
    leaderboardItems.innerHTML = "";
  
    // Add new leaderboard items
    details.forEach((detail) => {
      const li = document.createElement('li');
      li.innerHTML = `<p>Name: ${detail.name}'s total expense is ${detail.totalExpense}</p>`;
      leaderboardItems.appendChild(li);
    });
  }
  
  // Event listener to hide leaderboard and clear its contents
  const lead_btn = document.getElementById('lead_btn');
  lead_btn.addEventListener('click', () => {
    const leaderboardItems = document.getElementById('leaderboard_items');
    leaderboardItems.innerHTML = ""; // Clear leaderboard content
    leader.classList.add('hidden'); // Hide leaderboard
  });
  
  
function checking_forpremium(){
    const token = localStorage.getItem('token');
    buy_premium.classList.add('hidden')
    premium_user_f.classList.remove('hidden')
    download_btn.classList.remove('hidden')
    download_btn.addEventListener('click',()=>{
          console.log('btn was clicked ')
           window.location.href = "report.html"
    })
    
    show_leaderboard.addEventListener('click',async()=>{
      try{
        const resp = await axios.get('http://3.88.159.72:3600/premium_content',{
            headers:{
                'Authorization':token
            }
        })
        const result= resp.data
        
         leaderboardfunc(result)
        
        
    }
    catch(error){
        console.log(error.message)
    }

    })

}
// show_leaderboard.addEventListener('click',async()=>{
//     try{
//       const resp = await axios.get('http://localhost:3500/premium/premium_content',{
//           headers:{
//               'Authorization':token
//           }
//       })
//       console.log(resp.data)
//   }
//   catch(error){
//       console.log(error.message)
//   }

//   })
// show_leaderboard.addEventListener('click',()=>{
//     console.log('btn is clicked')
// })

    buy_premium.addEventListener('click', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Token not found. Please log in again.');
        return; 
    }

    console.log(token);

    try {
        const result = await axios.get("http://3.88.159.72:3600/premium", {
            headers: {
                "Authorization": token,
            },
        });

        console.log(result.data);

        if (result.data && result.data.order && result.data.key_id) {
            let options = {
                "key": result.data.key_id,          
                "order_id": result.data.order.id,   
                "amount": result.data.order.amount, 
                "currency": 'INR',                              
                "description": "Payment for Premium Features", 
                "handler": async function(response) {
                    try {
                      
                        const updateResponse = await axios.post(
                            "http://3.88.159.72:3600/updatetransactionstatus", {
                                order_id: options.order_id,
                                paymentId: response.razorpay_payment_id,
                            }, {
                                headers: { "Authorization": token }
                            }
                        );
                        
                        // Check server response and alert user accordingly
                        if (updateResponse.status === 200) {
                            alert('You are now a premium user!');
                            buy_premium.classList.add('hidden')
                            premium_user_f.classList.remove('hidden')
                        } else {
                            alert('Transaction failed. Please try again.');
                        }
                    } catch (error) {
                        console.error('Error while updating transaction:', error.message);
                        alert('Transaction update failed. Please try again.');
                    }
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function(response) {
                console.error('Payment failed:', response.error);
                alert('Payment failed: ' + response.error.description);
            });
                   
            razorpay.open();
        } else {
            alert('Failed to create order. Please try again.');
        }

    } catch (error) {
        console.error('Error while fetching premium order:', error.message);
        alert('An error occurred. Please try again later.');
    }
});



// const fetchexpenses = async () => {
//     const token = localStorage.getItem('token');

//     try {
//         const response = await axios.get("http://localhost:3500/expense", {
//             headers: {
//                 "Authorization": token 
//             }
//         });

//         const result = response.data;
//         const checkingforpremium = result.isPremium
//         console.log(checkingforpremium)
//         if (checkingforpremium===true){
//            checking_forpremium();
//         }
//         result.expenses.forEach(element => {
//             displayitem(element); 
//         });
//     } catch (error) {
//         console.log(error.message);
//     }
function fetchexpenses(page = 1) {
    const token = localStorage.getItem('token');
    //const itemsPerPage = document.getElementById('itemsPerPage').value;
    console.log(itemsPerPage)
    axios
      .get(`http://3.88.159.72:3600/getexpense?page=${page}&items=${itemsPerPage}`, {
        headers: { 'Authorization': token },
      })
      .then((response) => {
        desp.innerHTML = ''; // Clear previous items
        const checkingforpremium = response.data.is_premium;
        console.log(checkingforpremium);
        if (checkingforpremium === true) {
          checking_forpremium();

        }
  
        response.data.expenses.forEach((expense) => {
          displayitem(expense);
        });
        updatePaginationButtons(response.data.pagination);
        console.log(response.data.pagination)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  function updatePaginationButtons(pagination) {
    const paginationDiv = document.querySelector('#paginationButtons');
    paginationDiv.innerHTML = '';

    // Create Previous button
    if (pagination.hasPrevPage) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage-- // Use correct page from server response
            fetchexpenses(currentPage);
        };
        paginationDiv.appendChild(prevButton);
    }

    // Create Next button
    if (pagination.hasNextPage) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
             currentPage++ //= pagination.nextPage; // Use correct page from server response
            fetchexpenses(currentPage);
        };
        paginationDiv.appendChild(nextButton);
    }
}

  


const displayitem = (item) => {
    
    header_of_expense.classList.remove('hidden')
    const li = document.createElement("li");
   
    li.textContent = `${item.expenseAmount} - ${item.description} - ${item.category}`;
    li.expensedata = item;
  
    
    const del_btn = document.createElement("button");
    del_btn.textContent = "Delete";
  
   
    li.appendChild(del_btn);
    desp.appendChild(li);
    
  
   
    
  
    
    del_btn.addEventListener('click', async() => {
      const token = localStorage.getItem('token')
      const _id = li.expensedata.id;
  
      await axios.delete(`http://3.88.159.72:3600/delexpense/${_id}`,{
        headers:{
            "Authorization":token
        }
      })
        .then(() => {
          console.log('Item deleted:', _id);
          li.remove(); 
        })
        .catch(error => {
          console.log('Error deleting item:', error);
        });
    });
  };

const handleformsubmit =async(event)=>{
    
    event.preventDefault();
            const expenseAmount = event.target.expenseAmount.value;
            const description = event.target.description.value;
            const category = event.target.category.value;

          const token = localStorage.getItem('token')  
          const expenses = {
                expenseAmount,
                description,
                category,
            }
            try {
                const response = await axios.post('http://3.88.159.72:3600/postexpense',expenses,
                    {
                        headers: {
                            "Authorization": token, 
                        },
                    }
                );
                const result = response.data;
                fetchexpenses(currentPage)
            } catch (error) {
                console.log(error.message);
            }
       document.getElementById('expense-form').reset()
}
