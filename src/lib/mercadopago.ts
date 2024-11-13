// lib/mercadopago.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import axios from 'axios';

export const MP_CONFIG = {
  CLIENT_ID: process.env.MP_CLIENT_ID!,
  CLIENT_SECRET: process.env.MP_CLIENT_SECRET!,
  ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN!,
  REDIRECT_URI: `${process.env.BASE_URL}/api/auth/mercadopago/callback`,
};

const client = new MercadoPagoConfig({
  accessToken: MP_CONFIG.ACCESS_TOKEN,
});

const payment = new Payment(client);

// Funciones de OAuth personalizadas
export const mpOauth = {
  async create(code: string) {
    const response = await axios.post('https://api.mercadopago.com/oauth/token', {
      client_secret: MP_CONFIG.CLIENT_SECRET,
      client_id: MP_CONFIG.CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: MP_CONFIG.REDIRECT_URI
    });
    return response.data;
  },

  async refresh(refreshToken: string) {
    const response = await axios.post('https://api.mercadopago.com/oauth/token', {
      client_secret: MP_CONFIG.CLIENT_SECRET,
      client_id: MP_CONFIG.CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });
    return response.data;
  }
};

export { client, payment };