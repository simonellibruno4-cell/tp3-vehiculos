import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [seccion, setSeccion] = useState('vehiculos'); // 'vehiculos', 'conductores', 'viajes'
  
  // estados para formularios / datos
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  // manejar login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login({ email, contraseña });
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message || 'error al iniciar sesión');
    }
  };

  // manejar logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  // si no hay token, se muestra la pantalla de login
  if (!token) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
  <h2>Iniciar sesión - TP3</h2>
  {error && <p className="error-msg">{error}</p>}
  
  <div className="form-group">
    <label>Email:</label>
    <input 
      type="email" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      required 
    />
  </div>

  <div className="form-group">
    <label>Contraseña:</label>
    <input 
      type="password" 
      value={contraseña} 
      onChange={(e) => setContraseña(e.target.value)} 
      required 
    />
  </div>

  <button type="submit" className="btn-primary">Ingresar</button>
</form>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="navbar">
        <h1>Gestión de Transporte (TP3)</h1>
        <button onClick={handleLogout} className="btn-danger">Cerrar sesión</button>
      </header>

      <nav className="nav-tabs">
        <button 
          className={seccion === 'vehiculos' ? 'tab active' : 'tab'} 
          onClick={() => setSeccion('vehiculos')}
        >
          Vehículos
        </button>
        <button 
          className={seccion === 'conductores' ? 'tab active' : 'tab'} 
          onClick={() => setSeccion('conductores')}
        >
          Conductores
        </button>
        <button 
          className={seccion === 'viajes' ? 'tab active' : 'tab'} 
          onClick={() => setSeccion('viajes')}
        >
          Viajes
        </button>
      </nav>

      <main className="content">
        {seccion === 'vehiculos' && <VistaVehiculos />}
        {seccion === 'conductores' && <VistaConductores />}
        {seccion === 'viajes' && <VistaViajes />}
      </main>
    </div>
  );
}

// componente completo para la gestión de vehículos
function VistaVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [patente, setPatente] = useState('');
  const [año, setAño] = useState('');
  const [capacidadCarga, setCapacidadCarga] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // cargar vehículos al abrir la sección
  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const data = await api.getVehiculos();
      setVehiculos(data);
    } catch (err) {
      setError('error al cargar los vehículos');
    }
  };

  const handleCrearVehiculo = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      const nuevoVehiculo = {
        marca,
        modelo,
        patente,
        año: Number(año),
        capacidad_de_carga: Number(capacidadCarga)
      };

      await api.crearVehiculo(nuevoVehiculo);
      setMensaje('¡Vehículo registrado con éxito!');
      setMarca('');
      setModelo('');
      setPatente('');
      setAño('');
      setCapacidadCarga('');
      cargarVehiculos(); // recargar la lista
    } catch (err) {
      setError(err.message || 'error al registrar el vehículo');
    }
  };

  return (
    <div className="section-container">
      <h2>Gestión de vehículos</h2>
      
      {error && <p className="error-msg">{error}</p>}
      {mensaje && <p className="success-msg">{mensaje}</p>}

      {/* formulario de alta */}
      <form onSubmit={handleCrearVehiculo} className="form-card">
        <h3>Registrar nuevo vehículo</h3>
        <div className="form-row">
          <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
          <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
          <input type="text" placeholder="Patente" value={patente} onChange={(e) => setPatente(e.target.value)} required />
          <input type="number" placeholder="Año" value={año} onChange={(e) => setAño(e.target.value)} required />
          <input type="number" placeholder="Capacidad de carga (kg)" value={capacidadCarga} onChange={(e) => setCapacidadCarga(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary">Guardar Vehículo</button>
      </form>

      {/* listado de vehículos */}
      <div className="list-card">
        <h3>Vehículos registrados</h3>
        {vehiculos.length === 0 ? (
          <p>No hay vehículos cargados todavía.</p>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Patente</th>
                <th>Año</th>
                <th>Capacidad (kg)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id}>
                  <td>{v.marca}</td>
                  <td>{v.modelo}</td>
                  <td>{v.patente}</td>
                  <td>{v.año}</td>
                  <td>{v.capacidad_de_carga}</td>
                  <td>
      <button 
        className="btn-eliminar"
        onClick={async () => {
          if (window.confirm(`¿Seguro que deseas eliminar el vehículo ${v.patente}?`)) {
            try {
              await api.eliminarVehiculo(v.id);
              cargarVehiculos();
            } catch (err) {
              alert('Error al eliminar el vehículo');
            }
          }
        }}
      >
        Eliminar
      </button>
    </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
// componente completo para la gestión de conductores
function VistaConductores() {
  const [conductores, setConductores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [numeroLicencia, setNumeroLicencia] = useState('');
  const [fechaAltaLicencia, setFechaAltaLicencia] = useState('');
  const [fechaVencimientoLicencia, setFechaVencimientoLicencia] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarConductores();
  }, []);

  const cargarConductores = async () => {
    try {
      const data = await api.getConductores();
      setConductores(data);
    } catch (err) {
      setError('error al cargar los conductores');
    }
  };

  const handleCrearConductor = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      const nuevoConductor = {
        nombre,
        apellido,
        numero_de_documento: numeroDocumento,
        numero_de_licencia: numeroLicencia,
        fecha_de_alta_de_licencia: fechaAltaLicencia,
        fecha_de_vencimiento_de_licencia: fechaVencimientoLicencia
      };

      await api.crearConductor(nuevoConductor);
      setMensaje('¡Conductor registrado con éxito!');
      setNombre('');
      setApellido('');
      setNumeroDocumento('');
      setNumeroLicencia('');
      setFechaAltaLicencia('');
      setFechaVencimientoLicencia('');
      cargarConductores();
    } catch (err) {
      setError(err.message || 'error al registrar el conductor');
    }
  };

  return (
    <div className="section-container">
      <h2>Gestión de conductores</h2>

      {error && <p className="error-msg">{error}</p>}
      {mensaje && <p className="success-msg">{mensaje}</p>}

      <form onSubmit={handleCrearConductor} className="form-card">
        <h3>Registrar nuevo conductor</h3>
        <div className="form-row">
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
          <input type="text" placeholder="Nro. Documento" value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} required />
          <input type="text" placeholder="Nro. Licencia" value={numeroLicencia} onChange={(e) => setNumeroLicencia(e.target.value)} required />
          <label>Alta licencia:</label>
          <input type="date" value={fechaAltaLicencia} onChange={(e) => setFechaAltaLicencia(e.target.value)} required />
          <label>Vencimiento licencia:</label>
          <input type="date" value={fechaVencimientoLicencia} onChange={(e) => setFechaVencimientoLicencia(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary">Guardar conductor</button>
      </form>

      <div className="list-card">
        <h3>Conductores registrados</h3>
        {conductores.length === 0 ? (
          <p>No hay conductores registrados todavía.</p>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Documento</th>
                <th>Licencia</th>
                <th>Alta licencia</th>
                <th>Vencimiento licencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {conductores.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.apellido}</td>
                  <td>{c.numero_de_documento}</td>
                  <td>{c.numero_de_licencia}</td>
      <td>{c.fecha_de_alta_de_licencia}</td>
      <td>{c.fecha_de_vencimiento_de_licencia}</td>
      <td>
        <button 
          className="btn-eliminar"
          onClick={async () => {
            if (window.confirm(`¿Seguro que deseas eliminar al conductor ${c.nombre} ${c.apellido}?`)) {
              try {
                await api.eliminarConductor(c.id);
                cargarConductores();
              } catch (err) {
                alert('error al eliminar el conductor');
              }
            }
          }}
        >
          Eliminar
        </button>
      </td>
    </tr>
  ))}
</tbody>
</table>
        )}
      </div>
    </div>
  );
}
// componente completo para la gestión de viajes
function VistaViajes() {
  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);

  // campos del formulario de viaje
  const [vehiculoId, setVehiculoId] = useState('');
  const [conductorId, setConductorId] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [kilometros, setKilometros] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // cargar datos al abrir la sección
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

 const cargarDatosIniciales = async () => {
  try {
    const dataViajes = await api.getViajes();
    setViajes(dataViajes);

    const dataVehiculos = await api.getVehiculos();
    setVehiculos(dataVehiculos);

    const dataConductores = await api.getConductores();
    setConductores(dataConductores);
  } catch (err) {
    setError('error al cargar la información para los viajes');
  }
};
  const handleCrearViaje = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      await api.crearViaje({
        vehiculo_id: vehiculoId,
        conductor_id: conductorId,
        fecha_salida: fechaSalida,
        fecha_llegada: fechaLlegada,
        origen,
        destino,
        kilometros,
        observaciones
      });
      
      setMensaje('¡Viaje registrado con éxito!');
      setVehiculoId('');
      setConductorId('');
      setFechaSalida('');
      setFechaLlegada('');
      setOrigen('');
      setDestino('');
      setKilometros('');
      setObservaciones('');
      cargarDatosIniciales(); // recargar la lista de viajes
    } catch (err) {
      setError(err.message || 'error al registrar el viaje');
    }
  };

  return (
    <div className="section-container">
      <h2>Gestión y Registro de viajes</h2>

      {error && <p className="error-msg">{error}</p>}
      {mensaje && <p className="success-msg">{mensaje}</p>}

{/* formulario de alta de viaje */}
<form onSubmit={handleCrearViaje} className="form-card">
  <h3>Registrar nuevo viaje</h3>
  
  <div className="form-row">
    <label>Vehículo:</label>
    <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required>
      <option value="">Seleccione un vehículo</option>
      {vehiculos.map((v) => (
        <option key={v.id} value={v.id}>
          {v.marca} {v.modelo} - {v.patente}
        </option>
      ))}
    </select>
  </div>

  <div className="form-row">
    <label>Conductor:</label>
    <select value={conductorId} onChange={(e) => setConductorId(e.target.value)} required>
      <option value="">Seleccione un conductor</option>
      {conductores.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombre} {c.apellido} (DNI: {c.numero_de_documento})
        </option>
      ))}
    </select>
  </div>

  <div className="form-row">
    <label>Salida:</label>
    <input type="datetime-local" value={fechaSalida} onChange={(e) => setFechaSalida(e.target.value)} required />
    
    <label>Llegada:</label>
    <input type="datetime-local" value={fechaLlegada} onChange={(e) => setFechaLlegada(e.target.value)} required />
  </div>

  <div className="form-row">
    <input type="text" placeholder="Origen" value={origen} onChange={(e) => setOrigen(e.target.value)} required />
    <input type="text" placeholder="Destino" value={destino} onChange={(e) => setDestino(e.target.value)} required />
    <input type="number" placeholder="Kilómetros" value={kilometros} onChange={(e) => setKilometros(e.target.value)} required />
  </div>

  <div className="form-row">
    <textarea placeholder="Observaciones (opcional)" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
  </div>

  <button type="submit" className="btn-submit">Registrar viaje</button>
</form>

      {/* historial de viajes */}
      <div className="list-card">
        <h3>Historial de viajes registrados</h3>
        {viajes.length === 0 ? (
          <p>No hay viajes registrados todavía.</p>
        ) : (
          <table className="content-table">
            <thead>
              <tr>
                <th>Origen - Destino</th>
                <th>Vehículo ID</th>
                <th>Conductor ID</th>
                <th>Km</th>
                <th>Salida</th>
              </tr>
            </thead>
            <tbody>
              {viajes.map((v) => (
                <tr key={v.id}>
                  <td>{v.origen} - {v.destino}</td>
                  <td>{v.vehiculo_id}</td>
                  <td>{v.conductor_id}</td>
                  <td>{v.kilometros} km</td>
                  <td>{new Date(v.fecha_salida).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;