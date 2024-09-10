import { FastifyRequest, FastifyReply } from 'fastify'
import * as JWT from 'jsonwebtoken'
import { config } from '../helpers/config'
import { prisma } from './utils'

export const checkValidRequest = async (request: FastifyRequest, reply: FastifyReply, done: Function) => {
    try {
        const token = (request.cookies.chatter_token ? (request.cookies.chatter_token) : ( request.headers.chatter_token ? (request.headers.chatter_token) : undefined));
        if (!token) {
            return reply.status(401).send({ message: "กรุณาเข้าสู่ระบบ", code: 0, data: null });
        }

        let decode;
        try {
            decode = JWT.verify(String(token), String(config.APP_JWT_SECRET));
        } catch (error) {
            return reply.status(403).send({ message: "ผู้ใช้งานผิดพลาด", code: 0, data: null });
        }
        const { email } = JSON.parse(JSON.stringify(decode));

        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                posts: true,
                comments: true,
                notifications: true
            }
        })

        if (!user) {
            return reply.status(403).send({ message: "ไม่พบผู้ใช้งาน", code: 0, data: null });
        }
        if (user.email != email) {
            return reply.status(403).send({ message: "ไม่พบผู้ใช้งาน", code: 0, data: null });
        }
        request.user = user;
    } catch (err) {
        console.log(err)
        return reply.status(500).send({
            code: 500,
            message: "TRY_AGAIN",
        });
    }
    // done()
}