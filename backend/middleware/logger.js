// Middleware personalizado para logging de peticiones
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  // Si hay body en la petición, mostrarlo (útil para POST/PUT)
  if (req.body && Object.keys(req.body).length > 0) {
    // No mostrar contraseñas en los logs
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '***';
    }
    console.log('Body:', sanitizedBody);
  }
  
  next();
};

module.exports = requestLogger;