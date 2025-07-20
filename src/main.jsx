import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'antd/dist/reset.css';  // ✅ Use reset.css or antd.css
import './index.css';          // ✅ Only if you actually have this file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
