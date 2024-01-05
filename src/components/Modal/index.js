import { useState } from 'react';
import ApiService from '../../services/apiService';
import './modal.css';

const Modal = ({ onSetModalIsOn, onSetContacts, userID }) => {
  const [userInput, setUserInput] = useState({ name: '', phoneNumber: '' });
  const createNewContact = (e) => {
    const { value, name } = e.target
    setUserInput((userInput) => ({ user_id: userID, id: Date.now(), ...userInput, [name]: value }));
  }

  const addNewContactToList = async () => {
    const updatedContact = await ApiService.addContact(userInput)
    
    onSetContacts(updatedContact)
    onSetModalIsOn(false);
  }

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => onSetModalIsOn(false)}>&times;</span>
        <h2 style={{ textAlign: "center" }}>Add new Contact</h2>
        <div className='userInputWrapper'>
          <input type='text' name='name' placeholder='Name' onInput={createNewContact} />
        </div>
        <div className='userInputWrapper'>
          <input type='text' name="phoneNumber" placeholder='Phone number' onInput={createNewContact} />
        </div>
        <div className='userInputWrapper'><button onClick={addNewContactToList}>Add</button></div>
      </div>
    </div>
  )
}

export default Modal;