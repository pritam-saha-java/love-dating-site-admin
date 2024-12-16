import React, { useState, useEffect } from 'react';
import { getAllQrCodes, createQrCode, deleteQrCode, setActiveQrCode } from '../Services/QrCodesService';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const QRCodeManagement = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState({ upiId: '', payeeName: '', isActive: false });

  useEffect(() => {
    fetchQrCodesData();
  }, []);

  const fetchQrCodesData = async () => {
    try {
      const data = await getAllQrCodes();
      setQrCodes(data);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    }
  };

  const handleShowModal = () => {
    setCurrentQrCode({ upiId: '', payeeName: '', isActive: false });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQrCode({ ...currentQrCode, [name]: value });
  };

  const handleSaveQrCode = async () => {
    try {
      await createQrCode(currentQrCode);
      fetchQrCodesData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving QR code:', error);
    }
  };

  const handleDeleteQrCode = async (id) => {
    try {
      await deleteQrCode(id);
      fetchQrCodesData();
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await setActiveQrCode(id);
      fetchQrCodesData();
    } catch (error) {
      console.error('Error setting active QR code:', error);
    }
  };

  return (
        <>
              <nav className="navbar">
  <ul>
    <li>
      <a href="/user-management" target="_blank" rel="noopener noreferrer">User Management</a>
    </li>
    <li>
      <a href="/qr-code-management" target="_blank" rel="noopener noreferrer">QR Code Management</a>
    </li>
  </ul>
</nav>
    <div className="d-flex">
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage QR Codes</h2>
          <button className="btn btn-primary" onClick={handleShowModal}>Add QR Code</button>
        </div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>UPI ID</th>
              <th>Payee Name</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {qrCodes.map(qrCode => (
              <tr key={qrCode.id}>
                <td>{qrCode.id}</td>
                <td>{qrCode.upiId}</td>
                <td>{qrCode.payeeName}</td>
                <td>{qrCode.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn btn-danger me-2" onClick={() => handleDeleteQrCode(qrCode.id)}>Delete</button>
                  <button className="btn btn-success" onClick={() => handleSetActive(qrCode.id)} disabled={qrCode.active}>Set Active</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add QR Code</h5>
                  {/* Removed close button */}
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="upiId">UPI ID</label>
                      <input type="text" className="form-control" id="upiId" name="upiId" value={currentQrCode.upiId} onChange={handleInputChange} />
                    </div>
                    <div className="form-group mt-3">
                      <label htmlFor="payeeName">Payee Name</label>
                      <input type="text" className="form-control" id="payeeName" name="payeeName" value={currentQrCode.payeeName} onChange={handleInputChange} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveQrCode}>Add QR Code</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default QRCodeManagement;
