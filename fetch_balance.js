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
