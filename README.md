# 🎟️ Re-Ticket – Plataforma de Reventa de Entradas

**Re-Ticket** es una aplicación web para la compra y reventa de tickets de eventos. Está diseñada para ofrecer una experiencia moderna, segura y rápida tanto a compradores como vendedores de entradas.

## 🚀 Tecnologías utilizadas

- **Next.js** – Framework de React para aplicaciones web modernas
- **React** – Biblioteca principal para la UI
- **Tailwind CSS** – Estilizado rápido y eficiente
- **TypeScript** – Tipado estático para mayor robustez
- **ShadCN UI** – Componentes de interfaz de usuario accesibles y modernos
- **PostgreSQL** – Base de datos relacional
- **Clerk** – Autenticación de usuarios
- **Railway** – Plataforma de despliegue y hosting

## 🛠️ Funcionalidades
Registro e inicio de sesión de usuarios (con Clerk)

Publicación de entradas a la venta

Compra segura de tickets

Gestión de entradas desde un panel de usuario

## 📦 Instalación

1. Clona el repositorio:

```bash
   git clone https://github.com/tuusuario/tickethub.git
   cd tickethub
```
2. Instala las dependencias:

```bash
npm install
```
3. Configura las variables de entorno en un archivo .env.local:
```bash
DATABASE_URL=postgresql://...
CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_FRONTEND_API=...
```
4.Inicia el servidor de desarrollo:
```bash
npm run dev
```
