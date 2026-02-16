import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async ({
  textId,
  buyerId,
  authorId,
  authorName,
  textTitle,
  priceCents,
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Licença: ${textTitle}`,
              description: `Por ${authorName}`,
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/licenses/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/texts/${textId}?canceled=true`,
      client_reference_id: `${buyerId}-${textId}`,
      metadata: {
        textId,
        buyerId,
        authorId,
      },
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    throw error;
  }
};

export const retrieveCheckoutSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Erro ao recuperar checkout session:', error);
    throw error;
  }
};

export const createPaymentIntentForAuthor = async ({
  amount,
  currency = 'brl',
  authorId,
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        authorId,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Erro ao criar payment intent:', error);
    throw error;
  }
};

export const createPayout = async ({
  stripeAccountId,
  amount,
  currency = 'brl',
}) => {
  try {
    const payout = await stripe.payouts.create(
      {
        amount,
        currency,
        statement_descriptor: 'Recanto dos Poetas',
      },
      {
        stripeAccount: stripeAccountId,
      }
    );

    return payout;
  } catch (error) {
    console.error('Erro ao criar payout:', error);
    throw error;
  }
};

export const createConnectedAccount = async ({ email, name }) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      metadata: {
        name,
      },
    });

    return account;
  } catch (error) {
    console.error('Erro ao criar conta conectada:', error);
    throw error;
  }
};

export const getAccountLink = async (stripeAccountId, refreshUrl = null) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      type: 'account_onboarding',
      refresh_url: refreshUrl || `${process.env.FRONTEND_URL}/author/onboarding`,
      return_url: `${process.env.FRONTEND_URL}/author/onboarding/success`,
    });

    return accountLink;
  } catch (error) {
    console.error('Erro ao obter account link:', error);
    throw error;
  }
};

export const constructWebhookEvent = (body, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('Erro ao validar webhook:', error);
    throw error;
  }
};

export const handleCheckoutCompleted = async (sessionId) => {
  const session = await retrieveCheckoutSession(sessionId);
  
  return {
    paymentId: session.payment_intent,
    status: session.payment_status,
    metadata: session.metadata,
  };
};
