'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = createCoreController('api::order.order', ({ strapi }) =>  ({

    async create(ctx) {
      // const { address, amount, dishes, token, city, state } = JSON.parse(
      //   ctx.request.body
      // );
      const { address, amount, dishes, token, city, state } = ctx.request.body;

      const stripeAmount = Math.floor(amount * 100);
      // charge on stripe
      const charge = await stripe.charges.create({
        // Transform cents to dollars.
        amount: stripeAmount,
        currency: "usd",
        description: `Order ${new Date()} by ${ctx.state.user.username}`,
        source: token,
      });
  
      // Register the order in the database
      const entity = await strapi.service('api::order.order').create({
        data: {
          user: ctx.state.user.username,
          charge_id: charge.id,
          amount: stripeAmount,
          address,
          dishes,
          city,
          state,
          token
        }
      });
  
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
  
      return this.transformResponse(sanitizedEntity);
    },
  
  }));
