import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/styles.css';
import { AppRouter } from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </React.StrictMode>
);
