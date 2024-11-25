# Proyecto Interciclo - Sistema de Gestión de Parqueaderos Públicos

## Descripción del Proyecto

Este proyecto es un sistema de gestión de parqueaderos públicos que permite a los administradores gestionar eficientemente las plazas de aparcamiento, así como a los usuarios realizar reservaciones. Está construido utilizando tecnologías modernas de desarrollo web para ofrecer una experiencia amigable e intuitiva para sus usuarios. La aplicación es ideal para la administración de parqueaderos en ciudades o instituciones que buscan optimizar el uso de los espacios de estacionamiento.

## Características Principales

1. **Autenticación de Usuarios**: 
   - Implementada con Firebase Authentication para proporcionar un acceso seguro. Los usuarios deben registrarse y luego iniciar sesión para acceder a las funcionalidades de la aplicación.
  
2. **Gestión de Parqueaderos**:
   - **Administradores**: Los administradores tienen la capacidad de gestionar el inventario de plazas disponibles, actualizar información sobre el parqueadero, y visualizar la ocupación en tiempo real.
   - **Usuarios**: Los usuarios pueden visualizar plazas de aparcamiento disponibles y hacer reservaciones.

3. **Panel de Administración**:
   - Incluye opciones para agregar, modificar y eliminar información sobre las plazas de estacionamiento.
   - Herramientas para monitorear el estado de ocupación y generar reportes.

4. **Interfaz de Usuario**:
   - Diseño moderno y amigable con el usuario, utilizando Angular para la interfaz.
   - Uso de Firebase Firestore como base de datos en tiempo real para mantener la información actualizada de los usuarios y de las plazas disponibles.
   - Implementación de formularios reactivos con validaciones para garantizar la entrada de datos correcta.

## Tecnologías Utilizadas

- **Frontend**:
  - **Angular**: Framework para el desarrollo de interfaces web dinámicas.
  - **HTML5, SCSS, TypeScript**: Para crear una interfaz de usuario interactiva y atractiva.

- **Backend y Autenticación**:
  - **Firebase Firestore**: Base de datos NoSQL utilizada para almacenar datos del parqueadero y usuarios.
  - **Firebase Authentication**: Para la autenticación de los usuarios de la aplicación.

- **Hosting**:
  - **Firebase Hosting**: El proyecto está desplegado en Firebase Hosting para proporcionar una experiencia rápida y segura a los usuarios.

## Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local:

1. **Clonar el Repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd ProyectoInterciclo
   ```

2. **Instalar Dependencias**:
   - Asegúrate de tener instalado Node.js y npm.
   - Ejecuta el siguiente comando para instalar las dependencias:
   ```bash
   npm install
   ```

3. **Configuración de Firebase**:
   - Crea un proyecto en [Firebase](https://console.firebase.google.com/).
   - Añade las credenciales de tu proyecto en el archivo `firebase.config.ts`.
   - Configura la autenticación y Firestore en Firebase.

4. **Ejecutar la Aplicación**:
   - Para ejecutar el proyecto en modo desarrollo:
   ```bash
   ng serve
   ```
   - Luego, abre tu navegador en `http://localhost:4200`.

5. **Deploy a Firebase**:
   - Puedes desplegar la aplicación usando Firebase Hosting:
   ```bash
   firebase deploy
   ```

## Uso

- **Administrador**: Después de iniciar sesión, los administradores pueden acceder al panel para gestionar las plazas del parqueadero.
- **Usuario Final**: Los usuarios pueden ver la disponibilidad y reservar plazas de estacionamiento.

## Funcionalidades Futuras

- **Pagos en Línea**: Integrar un sistema de pagos para que los usuarios puedan pagar las reservas de las plazas de estacionamiento directamente desde la aplicación.
- **Notificaciones**: Añadir notificaciones por correo electrónico o push para informar a los usuarios sobre la expiración de sus reservas o cambios en la disponibilidad.
- **Optimización de Rutas**: Implementar una funcionalidad que guíe a los usuarios al parqueadero más cercano disponible.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Haz los commits necesarios (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push de la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Autor

- **Tu Nombre** - Desarrollador del Proyecto.

## Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.