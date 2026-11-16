const API_URL = 'http://localhost:4000/api';

async function peticion(endpoint, opciones = {}) {
  const token = localStorage.getItem('token'); // acá guardaremos el JWT del login

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...opciones.headers,
  };

  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    ...opciones,
    headers,
  });

  const data = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(data.error || 'ocurrió un error en la petición');
  }

  return data;
}

export const api = {
  // autenticación
  login: (credenciales) => peticion('/auth/login', { method: 'POST', body: JSON.stringify(credenciales) }),
  registro: (datos) => peticion('/auth/registro', { method: 'POST', body: JSON.stringify(datos) }),

 // vehículos
  getVehiculos: () => peticion('/vehiculos'),
  crearVehiculo: (vehiculo) => peticion('/vehiculos', { method: 'POST', body: JSON.stringify(vehiculo) }),
  eliminarVehiculo: (id) => peticion(`/vehiculos/${id}`, { method: 'DELETE' }),
  actualizarVehiculo: (id, vehiculo) => peticion(`/vehiculos/${id}`, { method: 'PUT', body: JSON.stringify(vehiculo) }),


  // conductores
  getConductores: () => peticion('/conductores'),
  crearConductor: (conductor) => peticion('/conductores', { method: 'POST', body: JSON.stringify(conductor) }),
  actualizarConductor: (id, conductor) => peticion(`/conductores/${id}`, { method: 'PUT', body: JSON.stringify(conductor) }),
  eliminarConductor: (id) => peticion(`/conductores/${id}`, { method: 'DELETE' }),

  // viajes
  getViajes: () => peticion('/viajes'),
  crearViaje: (viaje) => peticion('/viajes', { method: 'POST', body: JSON.stringify(viaje) }),
}
