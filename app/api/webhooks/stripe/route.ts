import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Firma de webhook inválida:', err.message);
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
  }

  switch (event.type) {
    // Se activó una nueva suscripción o cambió de estado
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id;
      const plan =
        priceId === process.env.STRIPE_PRICE_STUDIO ? 'studio' :
        priceId === process.env.STRIPE_PRICE_PRO ? 'pro' : 'start';

      await supabaseAdmin.from('subscriptions').upsert({
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer as string,
        plan,
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      }, { onConflict: 'stripe_subscription_id' });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
      break;
    }

    // Cobro de suscripción o de un servicio puntual (ej. registro por canción)
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      await supabaseAdmin.from('payments').insert({
        stripe_payment_intent_id: pi.id,
        amount_cents: pi.amount,
        currency: pi.currency,
        status: 'succeeded',
        description: pi.description ?? 'Pago',
      });
      break;
    }

    default:
      // Evento no manejado explícitamente — se ignora sin error
      break;
  }

  return NextResponse.json({ received: true });
}
