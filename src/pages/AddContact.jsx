import React, { useState, useEffect } from 'react';
import { useContactContext } from '../store/ContactContext';
import { useNavigate, useParams } from 'react-router-dom';

export const AddContact = () => {
  const { state, addContact, updateContact } = useContactContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const createContact = async (contactData) => {
    try {
      const response = await fetch('https://playground.4geeks.com/contact/agendas/agendapau/contacts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add Contact Error:', errorText);
        throw new Error('Failed to add contact');
      }

      const newContact = await response.json();
      dispatch({ type: ACTIONS.ADD_CONTACT, payload: newContact });
    } catch (error) {
      console.error('Error adding contact:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error instanceof Error ? error.message : String(error)
      });
    }
  };

  useEffect(() => {
    if (id) {
      const contactToEdit = state.contacts.find(contact => contact.id === parseInt(id));
      if (contactToEdit) {
        setContactData(contactToEdit);
      }
    }
  }, [id, state.contacts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateContact(parseInt(id), contactData);
      } else {
        await createContact(contactData);
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    } navigate('/contacts');
  };

  return (
    <div className="container mt-5">
      <h1>{id ? 'Edit Contact' : 'Add New Contact'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={contactData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={contactData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={contactData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={contactData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>
    </div>
  );
};