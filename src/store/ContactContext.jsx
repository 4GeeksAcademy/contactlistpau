import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  contacts: [],
  loading: false,
  error: null
};

// Action types
const ACTIONS = {
  SET_CONTACTS: 'SET_CONTACTS',
  ADD_CONTACT: 'ADD_CONTACT',
  UPDATE_CONTACT: 'UPDATE_CONTACT',
  DELETE_CONTACT: 'DELETE_CONTACT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
function contactReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CONTACTS:
      return { ...state, contacts: action.payload, loading: false, error: null };
    case ACTIONS.ADD_CONTACT:
      return { ...state, contacts: [...state.contacts, action.payload] };
    case ACTIONS.UPDATE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.map(contact => 
          contact.id === action.payload.id ? action.payload : contact
        )
      };
    case ACTIONS.DELETE_CONTACT:
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Context and Provider
const ContactContext = createContext();

export function ContactProvider({ children }) {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Fetch Contacts
  const fetchContacts = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await fetch('https://playground.4geeks.com/contact/agendas/agendapau/contacts', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // Log the response text for debugging
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Set empty contacts and clear any previous error
        dispatch({ type: ACTIONS.SET_CONTACTS, payload: [] });
        return;
      }

      // Try to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        dispatch({ type: ACTIONS.SET_CONTACTS, payload: [] });
        return;
      }

      const data = await response.json();
      
      // Ensure data is an array
      const contacts = Array.isArray(data) ? data : 
                       data.contacts ? data.contacts : 
                       data.results ? data.results : [];

      dispatch({ type: ACTIONS.SET_CONTACTS, payload: contacts });
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Add Contact
  // const addContact = async (contactData) => {
  //   try {
  //     const response = await fetch('https://playground.4geeks.com/contact/contact', {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: JSON.stringify(contactData)
  //     });

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error('Add Contact Error:', errorText);
  //       throw new Error('Failed to add contact');
  //     }

  //     const newContact = await response.json();
  //     dispatch({ type: ACTIONS.ADD_CONTACT, payload: newContact });
  //   } catch (error) {
  //     console.error('Error adding contact:', error);
  //     dispatch({ 
  //       type: ACTIONS.SET_ERROR, 
  //       payload: error instanceof Error ? error.message : String(error)
  //     });
  //   }
  // };

  // Update Contact
  const updateContact = async (contactId, contactData) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/agendapau/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update Contact Error:', errorText);
        throw new Error('Failed to update contact');
      }

      const updatedContact = await response.json();
      dispatch({ type: ACTIONS.UPDATE_CONTACT, payload: updatedContact });
    } catch (error) {
      console.error('Error updating contact:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Delete Contact
  const deleteContact = async (contactId) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/contact/agendas/agendapau/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete Contact Error:', errorText);
        throw new Error('Failed to delete contact');
      }

      dispatch({ type: ACTIONS.DELETE_CONTACT, payload: contactId });
    } catch (error) {
      console.error('Error deleting contact:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error instanceof Error ? error.message : String(error)
      });
    }
  };

  // Provide context value with state and functions
  const contextValue = React.useMemo(() => ({ 
    state, 
    fetchContacts, 
    // addContact, 
    updateContact, 
    deleteContact 
  }), [state]);

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
}

// Custom hook for using contact context
export function useContactContext() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
}