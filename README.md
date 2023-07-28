<h1>XRP Account Balance Fetching</h1>

<h2>Backend Setup (Django and DRF)</h2>

<ol>
  <li>Create a virtual environment:</li>
  <code>python -m venv myenv</code>
  <li>Activate the environment:</li>
  <code>source myenv\scripts\activate</code>
  <li>Install Django and DRF:</li>
  <code>pip install django djangorestframework</code>
</ol>

<h2>Project and App Setup</h2>

<ol>
  <li>Create a new Django Project and App:</li>
  <pre>
    <code>django-admin startproject xrp_balance_project
    cd xrp_balance_project
    python manage.py startapp xrp_balance_app</code>
  </pre>
  <li>Configure the Django Project and App in <code>xrp_balance_project/settings.py</code> file, add 'rest_framework' and 'xrp_balance_app' to INSTALLED_APPS.</li>
  <pre>
    <code>INSTALLED_APPS = [
      'rest_framework',
      'xrp_balance_app', # ...
    ]</code>
  </pre>
</ol>

<h2>Create the API View</h2>

<p>Create a new file <code>views.py</code> inside the <code>xrp_balance_app</code> folder and define the view for fetching the XRP account balance.</p>
<pre>
  <code>
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
  </code>
</pre>

<h2>Define the URL Configuration</h2>

<p>Create a new file <code>urls.py</code> inside the <code>xrp_balance_app</code> folder and define the URL configuration.</p>
<pre>
  <code>
    # xrp_balance_app/urls.py
    from django.urls import path
    from xrp_balance_app.views import XrpBalanceView

    urlpatterns = [
        path('get_balance/', XrpBalanceView.as_view(), name='get_balance'),
    ]
  </code>
</pre>

<h2>Configure the Main URL Configuration</h2>

<p>In the <code>xrp_balance_project/urls.py</code> file, include the URLs from the <code>xrp_balance_app</code>.</p>
<pre>
  <code>
    # xrp_balance_project/urls.py
    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('xrp_balance_app.urls')),
    ]
  </code>
</pre>

<h2>Run the Development Server</h2>

<p>Now you can run the development server and test the API.</p>
<code>python manage.py runserver</code>

<h2>Frontend Integration (React)</h2>

<p>To integrate the backend with a React frontend, you can use the Axios library in your React components to make API requests to the Django backend and display the XRP balance.</p>
<p>Here's the code of the React component for fetching and displaying the XRP balance:</p>

<pre>
  <code>
    import React, { useState } from 'react';
    import axios from 'axios';

    const XrpBalanceComponent = () => {
        // ... (The rest of the React component code provided above)
    };

    export default XrpBalanceComponent;
  </code>
</pre>

<p>Note: Don't forget to install React and Axios in your frontend project.</p>
<pre>
  <code>
    npx create-react-app xrp_balance_frontend
    cd xrp_balance_frontend
    npm install axios
  </code>
</pre>

<p>Now, when you run your React frontend with <code>npm start</code> and visit <code>http://localhost:3000</code>, you'll see the input field for the XRP account address, a button to fetch the balance, and the displayed XRP balance or error message.</p>

<h2>Test the API</h2>

<p>You can use tools like Postman or cURL to test the API.</p>
<p>Send a GET request to:</p>
<code>http://127.0.0.1:8000/api/get_balance/?account_address=&lt;your_xrp_address&gt;</code>
<p>Replace <code>&lt;your_xrp_address&gt;</code> with the actual XRP account address.</p>
<p>If everything is set up correctly, you should get a response containing the account address and the XRP balance.</p>

<h2>Frontend Integration (React)</h2> 

To integrate the backend with a React frontend, you can use the Axios library in your React components to make API requests to the Django backend and display the XRP balance.

Here's the code of the React component for fetching and displaying the XRP balance:

<pre>
 <code>
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
          {balance && !loading && <p style={styles.balance}>XRP Balance: <span style={styles.balanceAmount}>{balance}</span></p>}
          {error && !loading && <p style={styles.error}>Error: {error}</p>}
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
        borderRadius: '20px', // Rounded input field
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
      balanceAmount: {
        color: '#228B22', // Good color for balance (Green)
      },
      error: {
        marginTop: '10px',
        color: '#FF0000', // Red color for error messages
      },
    };

 </code>   
</pre>

<h4>Note → Remember to install React and Axios in your frontend project</h4>
<pre>
  <code>
    npx create-react-app xrp_balance_frontend 
    cd xrp_balance_frontend  
    npm install axios
  </code>  
</pre>


Now, when you run your React frontend with npm start and visit http://localhost:3000, you'll see the input field for the XRP account address, a button to fetch the balance, and the displayed XRP balance or error message.

<h2>Get account address → https://data.ripple.com/v2/accounts/ </h2>

<h2>DRF Outcomes→ </h2>

![image](https://github.com/varunpracticegit/varunpracticegit-XRP-Account-Balance-fetching-using-Django-Rest-Framework-and-React/assets/130556802/792d337f-56c2-408c-a050-4275c381fae8)


<h2>Frontend (React) outcomes → </h2>

<h5>Sample input → r4mscDrVMQz2on2px31aV5e5ouHeRPn8oy</h5>

![image](https://github.com/varunpracticegit/varunpracticegit-XRP-Account-Balance-fetching-using-Django-Rest-Framework-and-React/assets/130556802/c736d9f6-57d9-4b6d-aebc-d760c1867b75)
