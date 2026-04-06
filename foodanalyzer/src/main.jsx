import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from '../Store/Store.jsx'
import axios from 'axios';

// Automatically handle switching between localhost and Render URL
const rawBase = import.meta.env.VITE_API_URL || "";
const apiBase = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
axios.defaults.baseURL = apiBase;

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
     <App />

  </Provider>
  
   
  
)
