import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { LocalStateProvider } from './context/CleanLocalState.jsx'
import { Providers } from './redux/provider.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <LocalStateProvider>
        <BrowserRouter basename='/'>
          <App />
        </BrowserRouter>
      </LocalStateProvider>
    </Providers>
  </StrictMode>,
)
