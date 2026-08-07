import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  start: process.env.STRIPE_PRICE_START,
  pro: process.env.STRIPE_PRICE_PRO,
  studio: process.env.STRIPE_PRICE_STUDIO,
};

// POST /api/checkout
// body: { plan: 'start' | 'pro' | 'studio', region: 'us' | 'es', email? }
// Crea una sesión de Stripe Checkout. Para clientes en la UE, Stripe pide
// consentimiento explícito de Términos y Condiciones antes de pagar — el
// texto de ese checkbox deja constancia de la renuncia al derecho de
// desistimiento de 14 días a cambio de acceso inmediato al servicio.
export async function POST(req: NextRequest) {
  const { plan, region, email } = await req.json();

  const priceId = PRICE_BY_PLAN[plan];
  if (!priceId) {
    return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
  }

  const origin = req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#planes`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      consent_collection: { terms_of_service: 'required' },
      custom_text: {
        terms_of_service_acceptance: {
          message:
            region === 'es'
              ? 'Acepto los Términos y Condiciones y la Política de Privacidad de Artist Launch OS. Solicito acceso inmediato al servicio y entiendo que, como consumidor en la Unión Europea, esto implica renunciar a mi derecho de desistimiento de 14 días una vez el servicio comience a prestarse.'
              : 'Acepto los Términos y Condiciones y la Política de Privacidad de Artist Launch OS.',
        },
      },
      metadata: { plan, region: region ?? 'us' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creando sesión de Stripe Checkout:', err.message);
    return NextResponse.json({ error: 'No se pudo iniciar el pago. Intenta de nuevo en unos minutos.' }, { status: 502 });
  }
}
