import { useState } from "react";
import ApiService from '../../services/apiService';

import "./editModal.css";

const EditModal = ({ setShowModal, contactData, onSetContacts }) => {
  const [userInput, setUserInput] = useState({
    ...contactData
  });
  const [errors, setErrors] = useState([]);

  const updateContactInput = (e) => {
    const { value, name: propName } = e.target;
    setUserInput((userInput) => ({
      ...userInput,
      [propName]: value,
    }));
  };

  const updateContactToList = async () => {
    const errorsColector = [];

    if (!userInput.name) errorsColector.push("Name field is mandatory");
    if (userInput.name && userInput.name.length < 4)
      errorsColector.push("Name too short");

    if (!userInput.phoneNumber) errorsColector.push("Phone field is mandatory");
    if (/^\+?\(\d{3}\) \d{3}-\d{4}$/.test(userInput.phoneNumber))
      errorsColector.push("Phone field must be only numbers");
    else if (userInput.phoneNumber && userInput.phoneNumber.length < 7)
      errorsColector.push("Phone number too short");

    if (errorsColector.length > 0) {
      setErrors(errorsColector);
      return;
    }

    setErrors([]);

    const updatedContacts = await ApiService.editContact(contactData.id,userInput)

    onSetContacts(updatedContacts);

    setShowModal(false);
  };

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setShowModal(false)}>
          &times;
        </span>
        <h2 style={{ textAlign: "center" }}>Add new Contact</h2>
        <div className="userInputWrapper">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onInput={updateContactInput}
            value={userInput.name}
          />
        </div>
        <div className="userInputWrapper">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone number"
            onInput={updateContactInput}
            value={userInput.phoneNumber}
          />
        </div>
        {errors.length > 0 && (
          <div className="errors-div">
            {errors.map((item, id) => (
              <h4 key={id}>{item}</h4>
            ))}
          </div>
        )}
        <div className="userInputWrapper">
          <button onClick={updateContactToList}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;