### 1. Seguridad por Diseño como Estándar (Security by Design Default)
- **Asume que todo input es malicioso:** Nunca confíes en los datos del cliente.
- Valida y sanea TODA entrada de datos en el backend (tipos, longitudes, formatos).
- **Principio de Menor Privilegio (Least Privilege):** Otorga solo los permisos estrictamente necesarios a bases de datos, APIs y usuarios.
- Si hay dudas sobre la seguridad de una implementación -> DETENTE y solicita revisión humana.

### 2. Protección de Datos y Privacidad (Data Protection)
- **Cifrado en tránsito y en reposo:** Usa siempre HTTPS/TLS. Cifra contraseñas (usa Argon2 o bcrypt, NUNCA texto plano ni MD5).
- Protege los datos sensibles y transaccionales con el máximo rigor.
- Enmascara o trunca información confidencial en las interfaces de usuario.
- **Cero fugas en los logs:** NUNCA registres contraseñas, tokens de sesión, ni datos personales identificables (PII) en los archivos de registro (logs).

### 3. Autenticación y Autorización (Auth & Authz)
- Implementa controles de acceso basados en roles (RBAC) de forma estricta.
- Verifica la autorización en CADA endpoint privado, no solo en la interfaz de usuario.
- Usa tokens seguros (ej. JWT) con tiempos de expiración cortos y mecanismos de rotación/revocación.
- Invalida las sesiones correctamente al cerrar sesión o tras periodos de inactividad.

### 4. Prevención de Vulnerabilidades Web (OWASP Top 10)
- **Inyección SQL/NoSQL:** Usa SIEMPRE consultas parametrizadas o un ORM seguro. Prohibida la concatenación de cadenas para consultas.
- **Cross-Site Scripting (XSS):** Escapa todo el contenido generado por el usuario antes de renderizarlo en el frontend.
- **Cross-Site Request Forgery (CSRF):** Implementa tokens Anti-CSRF para todas las mutaciones de estado (POST, PUT, DELETE).
- Configura correctamente las políticas de CORS; nunca uses `Access-Control-Allow-Origin: *` en entornos de producción con credenciales.

### 5. Configuración y Despliegue Seguro (Secure Configuration)
- Mantén las dependencias y librerías actualizadas. Audita paquetes de terceros regularmente.
- Oculta los mensajes de error detallados y stack traces en producción (devuelven información útil para atacantes).
- Maneja las variables de entorno (`.env`) con estricta confidencialidad. NUNCA las subas al control de versiones.

### 6. Sinergia entre Seguridad y SEO (Security & SEO Synergy)
- Asegura que las cabeceras de seguridad (HSTS, X-Content-Type-Options) estén configuradas correctamente sin bloquear a los rastreadores legítimos.
- Redirige siempre el tráfico HTTP a HTTPS (código 301) para preservar el "link juice" y evitar penalizaciones.
- Monitoriza los tiempos de respuesta: los firewalls de aplicaciones web (WAF) y los controles de seguridad no deben degradar drásticamente el rendimiento de carga.

### 7. Defensa Activa y Limitación de Tasa (Active Defense)
- Implementa *Rate Limiting* (limitación de tasa) en APIs críticas (especialmente en login y recuperación de contraseñas) para evitar ataques de fuerza bruta.
- Bloquea temporalmente direcciones IP con comportamientos anómalos o múltiples intentos fallidos.

---

## Protocolo de Respuesta (Incident Protocol)
1. **Detectar:** Registra intentos de acceso no autorizado y errores de validación sospechosos.
2. **Aislar:** Si detectas un vector de ataque activo, bloquea el origen inmediatamente.
3. **Notificar:** Genera una alerta crítica detallando el vector, la hora y el endpoint afectado.
4. **Parchear:** Prioriza la resolución de vulnerabilidades críticas por encima de nuevas funcionalidades.