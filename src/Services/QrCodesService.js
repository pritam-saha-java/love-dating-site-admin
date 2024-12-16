import axios from "axios";

// Set the base URL from environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllQrCodes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/get-all-qr-codes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      throw error;
    }
  };
  
  export const createQrCode = async (qrCode) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/save-qr-code`, qrCode);
      return response.data;
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw error;
    }
  };
  
  export const deleteQrCode = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/admin/delete-qr-code/${id}`);
    } catch (error) {
      console.error('Error deleting QR code:', error);
      throw error;
    }
  };
  
  export const setActiveQrCode = async (id) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/set-active-qr-code/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error setting active QR code:', error);
      throw error;
    }
  };