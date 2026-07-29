# Artist Launch OS — Starter técnico

Esto es el backend real: base de datos, API de split sheets, API de registros,
webhook de Stripe y un dashboard que lee datos reales de Supabase.

No está desplegado — necesita tus propias cuentas y credenciales. Yo no tengo
acceso a internet ni a tus cuentas para crear esto en vivo por ti.

## Lo que necesitas ANTES de que esto funcione

1. **Cuenta de Supabase** (gratis para empezar) → https://supabase.com
   - Crear un proyecto nuevo.
   - Ir a SQL Editor → pegar y ejecutar el contenido de `supabase/schema.sql`.
   - Ir a Project Settings → API → copiar:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (nunca la expongas en el frontend)

2. **Cuenta de Stripe** → https://stripe.com
   - Crear 3 productos recurrentes: Start ($29/mes), Pro ($79/mes), Studio ($150/mes).
   - Copiar el `Price ID` de cada uno → `STRIPE_PRICE_START` / `_PRO` / `_STUDIO`.
   - Developers → API keys → copiar `Secret key` → `STRIPE_SECRET_KEY`.
   - Developers → Webhooks → Add endpoint → URL: `https://tu-dominio.com/api/webhooks/stripe`
     eventos a escuchar: `customer.subscription.created`, `customer.subscription.updated`,
     `customer.subscription.deleted`, `payment_intent.succeeded`.
   - Copiar el `Signing secret` → `STRIPE_WEBHOOK_SECRET`.

3. **Cuenta de Vercel** → https://vercel.com
   - Conectar tu repositorio de GitHub con este código.
   - En Project Settings → Environment Variables, pegar todas las variables de `.env.example`
     con tus valores reales.
   - Deploy.

## Cómo correrlo en tu computadora primero (recomendado antes de desplegar)

```bash
npm install
cp .env.example .env.local   # y llenar con tus llaves reales
npm run dev
```

Abre http://localhost:3000/dashboard?artist_id=UUID-DE-UN-ARTISTA
(el UUID lo obtienes insertando una fila de prueba en la tabla `artists` desde Supabase).

## Qué SÍ hace este starter

- Guarda artistas, canciones, split sheets, contratos, registros y calendario.
- Split sheets validan que el % sume 100 antes de guardar.
- El webhook de Stripe actualiza automáticamente el estatus de suscripción y pagos.
- El progreso de carrera (%) se recalcula automáticamente según registros completados.
- RLS (Row Level Security) activado — cada artista solo puede leer sus propios datos.

## Qué NO hace todavía (a propósito)

- No tiene login/autenticación de usuario conectado (Supabase Auth se agrega después,
  cuando tengas más de 2-3 clientes probando el flujo manual).
- No ejecuta ningún registro automáticamente — eso lo sigues haciendo tú, a mano,
  y luego marcas el estatus vía la API o directamente en Supabase Table Editor.
- No genera PDFs de contratos automáticamente todavía — usa los Word que ya tienes.

Esto es intencional: primero valida que el flujo de datos y pagos funciona con
tus 2 clientes reales, antes de invertir en automatizar la ejecución misma.
