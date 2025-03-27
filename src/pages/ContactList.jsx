import React, { useEffect } from 'react';
import { useContactContext } from '../store/ContactContext';
import { Link } from 'react-router-dom';

export const ContactList = () => {
  const { state, fetchContacts, deleteContact } = useContactContext();
  const { contacts, loading, error } = state;

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contactId);
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error Fetching Contacts</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please try again later or check your network connection.</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Contact List</h1>
        <Link to="/add-contact" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add New Contact
        </Link>
      </div>

      {contacts.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h4>No Contacts Found</h4>
          <p>Your contact list is empty. Click "Add New Contact" to get started!</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {contacts.map(contact => (
            <div key={contact.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{contact.name}</h5>
                  <p className="card-text text-muted">
                    <i className="fas fa-envelope me-2"></i>{contact.email}
                  </p>
                  <p className="card-text">
                    <i className="fas fa-phone me-2"></i>{contact.phone}
                  </p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-between">
                  <Link 
                    to={`/edit-contact/${contact.id}`} 
                    className="btn btn-sm btn-outline-warning"
                  >
                    <i className="fas fa-edit me-1"></i>Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(contact.id)} 
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="fas fa-trash me-1"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};