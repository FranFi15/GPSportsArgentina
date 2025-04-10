import React from 'react'     // Importa React
import ReactDOM from 'react-dom/client' // Importa ReactDOM para renderizar la aplicación en el DOM
import App from './App.jsx'    // Importa el componente principal App
        // Importa los estilos globales CSS

ReactDOM.createRoot(document.getElementById('root')).render( // Renderiza la aplicación React en el elemento con id 'root' en index.html
  <React.StrictMode> {/* Activa el modo estricto de React para detectar posibles problemas */}
    <App />        {/* Renderiza el componente principal App */}
  </React.StrictMode>,
)