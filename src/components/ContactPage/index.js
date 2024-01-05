import { useEffect, useState } from "react";
import ContactList from "../ContactList";
import Modal from '../Modal';
import './contactPage.css';
import ApiService from "../../services/apiService";
import { useNavigate } from "react-router";

const ContactPage = () => {
  const navigate = useNavigate();
  const [modalIsOn, setModalIsOn] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    ApiService.userInfo().then(data => {
      setUserData(data);
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })
  }, [navigate]);

  useEffect(() => {
    ApiService.getContacts().then(data => {
      setContacts(data);
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    })
  }, [navigate, userData.id]);




  return (
    <>
      <button onClick={() => setModalIsOn(true)} id="add-new-contact">Add Contact</button>
      <ContactList contacts={contacts} onSetContacts={setContacts} userID={userData.id} />
      {modalIsOn && <Modal onSetModalIsOn={setModalIsOn} onSetContacts={setContacts} userID={userData.id} />}
    </>

  )
}

export default ContactPage;