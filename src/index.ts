import type { FastifyCookieOptions } from '@fastify/cookie'
import Fastify, { FastifyInstance } from "fastify";
import cookie from '@fastify/cookie'
import { getRouter, getPrefix } from './router/router'
import { Prisma } from '@prisma/client'
import * as fs from 'fs'
import path from 'path'
import multipart from "@fastify/multipart";
import { publicDir } from './helpers/utils';

const server: FastifyInstance = Fastify({});

function constructPublicPath() {
  const publicPath = path.join(__dirname, '../public');
  return publicPath;
}

server.register(multipart, {
  limits: {
    files: 1
  }
});

server.register(require('@fastify/static'), {
  root: constructPublicPath(),
  prefix: '/public/'
})

// server.register(cookie, {
//   secret: "dms-backend",
//   hook: 'onRequest',
//   parseOptions: {}
// } as FastifyCookieOptions)

server.options("*", function (request, reply) {
  reply.send();
});

server.addHook("onSend", function (request, reply, payload, next) {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  reply.header("Access-Control-Allow-Headers", "*");
  reply.header("Access-Control-Allow-Credentials", true);
  next();
});

server.get("/", async (request, reply) => {
  // reply.redirect('https://dimension-studio.net')
  return { credit: "This make by @Dimension Studio" };
});

getRouter().forEach(async (file) => {
  const prefix = getPrefix(file)
  console.log('Loaded: ' + prefix)
  server.register(await import(file), { prefix: prefix })
})

server.setNotFoundHandler(function (request, reply) {
  reply.code(404).send({"code": 404,  message: 'Cannot GET ' + request.url, data: null,})
})

server.setErrorHandler(function (error, request, reply) {
  reply.code(403).send({"code": 403,  message: error, data: null,})
})

declare module 'fastify' {
  export interface FastifyRequest {
    user?: Prisma.UserGetPayload<{
      include: { posts: true, comments: true, notifications: true }
    }>;
  }
}

const start = async () => {
  try {
    await server.listen({ port: 3232, host: '0.0.0.0' });
    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Start @ http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  } 
  // const p = path.join(publicDir, "toggleEdit.json");
  // if (!fs.existsSync(p)) {
  //   fs.writeFileSync(p, JSON.stringify({ toggleEdit: true}))
  // }
};

start();
