import { FastifyInstance } from "fastify";
import { checkValidRequest } from "../../../../helpers/middleware";
import { prisma, publicDir } from '../../../../helpers/utils'
import * as fs from 'fs'
import * as JWT from 'jsonwebtoken'
import { config } from '../../../../helpers/config'
import { userInfo } from "os";
import path from "path";

interface blogData {
    content: string
    title: string
    desc: string
    poster: string
    image: string
    datePicker: Date
}

async function userRoutes(server: FastifyInstance) {

    server.get('/', { preHandler: [checkValidRequest] }, async (req, res) => {
        try {
            if (!req.user) return res.status(401).send({ message: "กรุณาเข้าสู่ระบบ", code: 0, data: null });
            const user: any = req.user;
            res.send({
                code: 200,
                message: "สำเร็จ",
                data: user
            })
        } catch (err) {
            return res.status(500).send({
                code: 500,
                message: "TRY_AGAIN",
            });
        }
    })

    server.get('/viewer', async (req, res) => {
        
        try {
            const blogData = await prisma.blogData.findMany({})


            return res.send({
                message: 'อัพเดทข้อมูลสำเร็จ',
                code: 200,
                blogData,
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send({
                code: 500,
                message: "TRY_AGAIN",
            });
        }
    })

    server.post<{ Body: blogData }>('/viewer', async (req, res) => {
        const Body = req.body;
        try {
            const blogData = await prisma.blogData.findUnique({
                where: {
                    content: Body.content
                }
            })


            return res.send({
                message: 'อัพเดทข้อมูลสำเร็จ',
                code: 200,
                blogData,
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send({
                code: 500,
                message: "TRY_AGAIN",
            });
        }
    })

}

export default userRoutes;