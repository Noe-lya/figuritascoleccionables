# Figuritas Coleccionables 🃏

Aplicación web de "pack opening" al estilo álbum de figuritas: los usuarios se registran, abren sobres virtuales y arman su colección de cartas con distintos niveles de rareza (común, rara, épica y legendaria). Construida con **Next.js (App Router)** y **Supabase** como backend de autenticación y base de datos.

## Cómo funciona

1. El usuario se registra o inicia sesión con email y contraseña (Supabase Auth).
2. Desde `/pack` puede abrir un sobre, que dispara una API route en el servidor.
3. La API elige 5 cartas al azar respetando la probabilidad definida para cada una, las guarda asociadas al usuario y las devuelve para mostrarlas en pantalla.
4. En `/profile` el usuario ve toda su colección acumulada, con la cantidad total de cartas obtenidas.

## Estructura del proyecto

```
my-app/
├── app/
│   ├── page.tsx              # Redirige a /login
│   ├── layout.tsx            # Layout raíz de la app
│   ├── globals.css           # Estilos globales
│   ├── login/
│   │   └── page.tsx          # Inicio de sesión y registro
│   ├── reset-password/
│   │   └── page.tsx          # Recuperación de contraseña
│   ├── auth/callback/
│   │   └── route.ts          # Callback de confirmación de cuenta (Supabase)
│   ├── pack/
│   │   └── page.tsx          # Pantalla para abrir sobres
│   ├── profile/
│   │   └── page.tsx          # Colección de cartas del usuario
│   └── api/
│       └── open-pack/
│           └── route.ts      # Endpoint que sortea y asigna las cartas
├── lib/
│   └── supabase.ts           # Cliente de Supabase (browser)
├── public/                   # Assets estáticos (SVGs)
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Tecnologías

- [Next.js 16](https://nextjs.org/) (App Router, React 19)
- [Supabase](https://supabase.com/) — autenticación y base de datos (`cards`, `user_cards`)
- TypeScript
- Tailwind CSS (config incluida vía PostCSS)

## Getting Started

1. Instalar dependencias:

```bash
npm install
```

2. Configurar las variables de entorno en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

3. Levantar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) para ver la app.

## Base de datos (Supabase)

El proyecto espera dos tablas principales:

- **cards**: catálogo de cartas (`name`, `rarity`, `description`, `probability`).
- **user_cards**: relación entre usuarios y las cartas que obtuvieron (`user_id`, `card_id`, `obtained_at`).
