# Revvio - Sistema de Gestión para Talleres Mecánicos

Revvio es un sistema de gestión en la nube diseñado específicamente para talleres mecánicos en Latinoamérica. Su objetivo principal es ayudar a los dueños de talleres, recepcionistas y mecánicos a abandonar el papel y Excel, automatizando y organizando sus operaciones diarias de manera eficiente y sin fricciones.

## Características Principales

1. **Gestión de Órdenes de Trabajo (OT)**:
   - Registro detallado de vehículos, clientes, diagnósticos y estados (Pendiente, En Proceso, Finalizado, Entregado).
   - Actualización de estados en tiempo real.

2. **Control de Inventario**:
   - Gestión de repuestos y servicios.
   - Control de stock y alertas de stock mínimo.

3. **Historial y Trazabilidad**:
   - Búsqueda rápida de clientes y vehículos.
   - Historial completo de servicios y mantenimientos.

4. **Comunicación con el Cliente (Próximamente)**:
   - Notificaciones automáticas por WhatsApp (vía Twilio) sobre el estado de las reparaciones.

5. **Asistente de IA - RevvioBot (Próximamente)**:
   - Asistente inteligente para automatizar tareas, actualizar órdenes y gestionar inventario mediante lenguaje natural.

## Stack Tecnológico

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Autenticación**: Supabase Auth
- **Estilos y UI**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) + [Lucide Icons](https://lucide.dev/)
- **Validación**: [Zod](https://zod.dev/)
- **Notificaciones**: [Twilio](https://www.twilio.com/) (WhatsApp)

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta en Supabase
- Cuenta en Twilio (para notificaciones de WhatsApp)

## Configuración del Entorno

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd TallerMecanico
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
   ```env
   # Prisma / Base de datos
   DATABASE_URL="tu_url_de_conexion_de_supabase_con_pgbouncer"
   DIRECT_URL="tu_url_de_conexion_directa_de_supabase"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="tu_url_de_supabase"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key_de_supabase"

   # Twilio (Opcional para desarrollo inicial)
   TWILIO_ACCOUNT_SID="tu_account_sid"
   TWILIO_AUTH_TOKEN="tu_auth_token"
   TWILIO_WHATSAPP_NUMBER="tu_numero_de_whatsapp_de_twilio"
   ```

4. Configura la base de datos con Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Ejecución en Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

- `/src/app`: Rutas y páginas de la aplicación (Next.js App Router).
- `/src/components`: Componentes de UI reutilizables (Shadcn UI y personalizados).
- `/src/lib`: Utilidades y configuraciones (Prisma, Supabase).
- `/src/app/actions`: Server Actions para la lógica de negocio y mutaciones de datos.
- `/prisma`: Esquema de la base de datos y migraciones.

## Licencia

Este proyecto es propietario y confidencial.
