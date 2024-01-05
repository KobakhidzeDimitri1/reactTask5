import axios from "axios";

class ApiService {
  static apiBase = process.env.REACT_APP_API_BASE;

  static async login(userData) {
    const res = await axios.post(`${ApiService.apiBase}/login`, userData);
    const { token } = res.data;
    localStorage.setItem("token", token);
    return true;
  }

  static async getContacts() {
    const token = localStorage.getItem("token");
    const contacts = await axios.get(`${ApiService.apiBase}/contacts`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
  
    return contacts.data;
  }
  
  static async addContact(contactInfo) {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${ApiService.apiBase}/contacts`,
      contactInfo,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )
  
    return res.data;
  }

  static async deleteContact(id) {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${ApiService.apiBase}/contacts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    return response.data;
  }

  static async editContact(id,updatedObject) {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${ApiService.apiBase}/contacts/${id}`,
      updatedObject,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    return response.data;
  }

  static async userInfo() {
    const token = localStorage.getItem("token");
    const user = await axios.get(`${ApiService.apiBase}/me`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    return user.data;
  }
}

export default ApiService;