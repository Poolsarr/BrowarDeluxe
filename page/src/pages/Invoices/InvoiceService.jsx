// src/components/Invoices/InvoiceService.jsx
const API_URL = 'http://localhost:5000/invoices';
const getToken = () => localStorage.getItem('token');

export const fetchInvoices = async () => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Fetch failed');
  return res.json();
};

export const uploadInvoice = async (file, name) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('invoicename', name);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  });

  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

export const downloadInvoice = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  if (!res.ok) throw new Error('Download failed');

  const contentDisposition = res.headers.get('content-disposition');
  const filename = contentDisposition
    ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
    : 'downloaded-file';

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const deleteInvoice = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error('Delete failed');
};
