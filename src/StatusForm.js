import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StatusForm.css';

const StatusForm = () => {
  const [closers, setClosers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [selectedCloser, setSelectedCloser] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Fetch the list of closers when the component mounts
    const fetchClosers = async () => {
      try {
        const response = await axios.get('https://sheets-server.onrender.com/get-closers');
        setClosers(response.data.closers);
      } catch (error) {
        console.error('Error fetching closers:', error);
        alert('Error fetching closers');
      }
    };

    fetchClosers();
  }, []);

  useEffect(() => {
    // Fetch the list of emails when a closer is selected
    const fetchEmails = async () => {
      if (selectedCloser) {
        try {
          const response = await axios.get('https://sheets-server.onrender.com/get-emails-by-closer', { params: { closer: selectedCloser } });
          setEmails(response.data.emails);
        } catch (error) {
          console.error('Error fetching emails:', error);
          alert('Error fetching emails');
        }
      }
    };

    fetchEmails();
  }, [selectedCloser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting with closer:', selectedCloser, 'email:', selectedEmail, 'status:', status); // Log submitted data
  
    try {
      const response = await axios.post('https://sheets-server.onrender.com/update-status-email-by-closer', {
        closer: selectedCloser,
        email: selectedEmail,
        status: status,
      });
      console.log('Response:', response.data);
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating status and email:', error);
      alert('Error updating status and email');
    }
  };
  

  return (
    <div className='status'>
      <h1>Actualizar Estado</h1>
      <form onSubmit={handleSubmit}>
        <label className='label'>
          Closer:
          <select
            className='input'
            value={selectedCloser}
            onChange={(e) => setSelectedCloser(e.target.value)}
            required
          >
            <option value="" disabled>Seleccione un closer</option>
            {closers.map((closer, index) => (
              <option key={index} value={closer}>{closer}</option>
            ))}
          </select>
        </label>
        <br />
        <label className='label'>
          Email:
          <select
            className='input'
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            required
            disabled={!selectedCloser}
          >
            <option value="" disabled>Seleccione un email</option>
            {emails.map((email, index) => (
              <option key={index} value={email}>{email}</option>
            ))}
          </select>
        </label>
        <br />
        <label className='label'>
          Estado:
          <select
            value={status}
            className='input'
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="" disabled>Seleccione un estado</option>
            <option value="Contactado">Contactado</option>
            <option value="Esperando respuesta">Esperando respuesta</option>
            <option value="En llamada">En llamada</option>
            <option value="Win">Win</option>
            <option value="Lose">Lose</option>
          </select>
        </label>
        <br />
        <button type="submit" className='SubmitBtn'>Actualizar</button>
      </form>
    </div>
  );
};

export default StatusForm;