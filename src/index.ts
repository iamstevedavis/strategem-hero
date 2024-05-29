import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';

const app = fastify();

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

const start = async () => {
  try {
    await app.listen({port: 3000});
    console.log(`Server listening on 3000`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
