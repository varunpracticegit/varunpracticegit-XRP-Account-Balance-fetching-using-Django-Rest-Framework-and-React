Fetching XRP Account Balance with XRPL API using Django Restframework (DRF) and React

Follow the steps below: 

Step 1→ Set up the Django Project and DRF Make sure you have Python installed on your system. 

Create a virtual environment:           python -m venv myenv 
Activate environment:                   source myenv\scripts\activate #
Install Django and DRF     :            pip install django djangorestframework


Step 2→ Create a new Django Project and App

django-admin startproject xrp_balance_project 
cd xrp_balance_project 

python manage.py startapp xrp_balance_app

Step 3→  Configure the Django Project and App in the xrp_balance_project/settings.py file, add 'rest_framework' and 'xrp_balance_app' to INSTALLED_APPS.


INSTALLED_APPS ={.

'rest_framework', 
'xrp_balance_app', 

} 

Step 4→ Create the API View Create a new file views.py inside the xrp_balance_app folder and define the view for fetching the XRP account balance.

# xrp_balance_app/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
import requests


class XrpBalanceView(APIView):
    def get(self, request, *args, **kwargs):
        account_address = request.query_params.get('account_address')
        if not account_address:
            return Response({'error': 'Please provide a valid account address'}, status=400)


        try:
            url = f'https://data.ripple.com/v2/accounts/{account_address}'
            response = requests.get(url)
            data = response.json()
            genesis_balance = data.get('account_data', {}).get('genesis_balance')
            return Response({'account_address': account_address, 'genesis_balance': genesis_balance})
        except requests.RequestException:
            return Response({'error': 'Failed to fetch data from XRPL API'}, status=500)


Step 5 → Define the URL Configuration Create a new file urls.py inside the xrp_balance_app folder and define the URL configuration.

# xrp_balance_app/urls.py
from django.urls import path
from xrp_balance_app.views import XrpBalanceView

urlpatterns = [
    path('get_balance/', XrpBalanceView.as_view(), name='get_balance'),
]


Step 6 → Configure the Main URL Configuration In the xrp_balance_project/urls.py file, include the URLs from the xrp_balance_app.

# xrp_balance_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('xrp_balance_app.urls')),
]


Step 7 → Run the Development Server Now you can run the development server and test the API.

python manage.py runserver


Step 8 → Test the API
You can use tools like Postman or cURL to test the API. 

Send a GET request to →

http://127.0.0.1:8000/api/get_balance/?account_address=<your_xrp_address>. 

→ Replace <your_xrp_address> with the actual XRP account address.

If everything is set up correctly, you should get a response containing the account address and the XRP balance.


Step 9 → Frontend Integration (React)

To integrate the backend with a React frontend, you can use the Axios library in your React components to make API requests to the Django backend and display the XRP balance.

Here's the code of the React component for fetching and displaying the XRP balance:


import React, { useState } from 'react';
import axios from 'axios';


const XrpBalanceComponent = () => {
  const [accountAddress, setAccountAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleInputChange = (e) => {
    setAccountAddress(e.target.value);
  };


  const fetchBalance = () => {
    setError('');
    setLoading(true);


    axios
      .get(`http://127.0.0.1:8000/api/get_balance/?account_address=${accountAddress}`)
      .then((response) => {
        setBalance(response.data.genesis_balance);
        setError('');
      })
      .catch((error) => {
        setError('Failed to fetch balance. Please check the XRP account address.');
        setBalance('');
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={accountAddress}
          onChange={handleInputChange}
          placeholder="Enter XRP account address"
          style={styles.input}
        />
        <button onClick={fetchBalance} disabled={loading} style={styles.button}>
          Fetch Balance
        </button>
      </div>
      {loading && <p style={styles.message}>Loading...</p>}
      {balance && !loading && <p style={styles.balance}>XRP Balance: {balance}</p>}
      {error && !loading && <p style={styles.message}>Error: {error}</p>}
    </div>
  );
};


export default XrpBalanceComponent;


const styles = {
  container: {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '5px',
    marginTop: '50px',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    marginRight: '10px',
    borderRadius: '3px',
    border: '1px solid #ccc',
    width: '250px',
  },
  button: {
    padding: '8px 15px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '3px',
    border: 'none',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    color: '#888',
  },
  balance: {
    marginTop: '10px',
    fontWeight: 'bold',
  },
};



Note → Remember to install React and Axios in your frontend project

npx create-react-app xrp_balance_frontend 

cd xrp_balance_frontend  

npm install axios


Now, when you run your React frontend with npm start and visit http://localhost:3000, you'll see the input field for the XRP account address, a button to fetch the balance, and the displayed XRP balance or error message.

Step 10 → Get account address → https://data.ripple.com/v2/accounts/ 

DRF Outcomes→ 
http://127.0.0.1:8000/api/get_balance/?account_address=rBKPS4oLSaV2KVVuHH8EpQqMGgGefGFQs7 

![image](https://github.com/varunpracticegit/varunpracticegit-XRP-Account-Balance-fetching-using-Django-Rest-Framework-and-React/assets/130556802/9f90e093-d78c-4d44-9ae4-58de884ed5ba)


Frontend (React) outcomes → 

Sample input → r4mscDrVMQz2on2px31aV5e5ouHeRPn8oy

![image](https://github.com/varunpracticegit/varunpracticegit-XRP-Account-Balance-fetching-using-Django-Rest-Framework-and-React/assets/130556802/f39f60a2-b44d-461a-aa91-984c5eb41011)









