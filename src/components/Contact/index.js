import { useState } from 'react';
import ApiService from '../../services/apiService';
import EditModal from '../EditModal';

const Contact = ({ onSetContacts, contactData, checkedIds, onToggleContactFromList }) => {
  const [showModal,setShowModal] = useState(false)

  const handleDelete = async () => {
    const updatedContacts = await ApiService.deleteContact(contactData.id)

    onSetContacts(updatedContacts)
  }

  return (
    <>
      <tr>
        <td>
          <input type="checkbox" onChange={(e) => onToggleContactFromList(e, contactData.id)} checked={checkedIds.includes(contactData.id)} />
        </td>
        <td onClick={handleDelete}><i className="fa fa-trash-o pointer" /></td>
        <td onClick={() => setShowModal(true)}><i className="fa fa-pencil pointer"></i></td>
        <td>{contactData.name}</td>
        <td>{contactData.phoneNumber}</td>
      </tr>
      {showModal && (
        <EditModal
          setShowModal={setShowModal}
          contactData={contactData}
          onSetContacts={onSetContacts}
        />
      )}
    </>

  )
}

export default Contact