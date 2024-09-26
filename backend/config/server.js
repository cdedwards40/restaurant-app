module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
//  url: 'http://localhost',
  // url: 'http://ec2-54-80-38-55.compute-1.amazonaws.com/strapi',
  //url: 'http://ec2-54-82-252-4.compute-1.amazonaws.com/strapi',
  url: 'https://chris-edwardsfullstackrestaurantapplication.click/strapi',
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
