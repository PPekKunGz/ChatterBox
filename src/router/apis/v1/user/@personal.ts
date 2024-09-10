import { FastifyInstance } from "fastify";
import { checkValidRequest } from "../../../../helpers/middleware";
import { prisma, publicDir } from '../../../../helpers/utils'
import * as fs from 'fs'
import * as JWT from 'jsonwebtoken'
import { config } from '../../../../helpers/config'
import { userInfo } from "os";
import path from "path";

interface personalData {
    lineID: string;
    program: string;
    academicYear: string;
    degree: string;
    campus: string;
    clubRole: string;
    whyJoinClub: string;
    afterBetterClub: string;
    portfolio: string;
    interviewLocation: string;
    phoneNumber: string;
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

    server.post<{ Body: personalData }>('/create', { preHandler: [checkValidRequest] }, async (req, res) => {
        const Body = req.body
        
        try {
            if (!req.user) return res.status(401).send({ message: "กรุณาเข้าสู่ระบบ", code: 0, data: null });
            const b = JSON.parse(fs.readFileSync(path.join(publicDir, "toggleEdit.json"), 'utf-8'))
            
            if (!b.toggleEdit) return { code: 0, message: "ปิดการใช้งานการแก้ไขแล้ว!"}
            if (req.user.status == "SUCCESS") return { code: 0, message: "ไม่สามารถแก้ไขได้!"}

            const personalData = await prisma.userData.update({
                where: {
                    userId: req.user.id
                },
                data: {
                    lineID: Body.lineID,
                    program: Body.program,
                    academicYear: Body.academicYear,
                    degree: Body.degree,
                    campus: Body.campus,
                    clubRole: Body.clubRole,
                    whyJoinClub: Body.whyJoinClub,
                    afterBetterClub: Body.afterBetterClub,
                    portfolio: Body.portfolio,
                    interviewLocation: Body.interviewLocation,
                    phoneNumber: Body.phoneNumber,
                }
            })
            const userStatus = await prisma.user.update({
                where: {
                    id: req.user.id
                },
                data: {
                    status: "WAITING"
                }
            })


            return res.send({
                message: 'อัพเดทข้อมูลสำเร็จ',
                code: 200,
            })

        } catch (err) {
            console.log(err)
            return res.status(500).send({
                code: 500,
                message: "TRY_AGAIN",
            });
        }
    })

    server.post<{}>('/status', { preHandler: [checkValidRequest] }, async (req, res) => {
        const Body = req.body

        try {
            if (!req.user) return res.status(401).send({ message: "กรุณาเข้าสู่ระบบ", code: 0, data: null });
            const dataStatus = await prisma.user.findMany({
                where: {
                    OR: [
                        {
                            meetLink: req.user.meetLink
                        },
                        {
                            status: req.user.status
                        }
                    ]
                }
            })
            return res.send({
                message: 'อัพเดทข้อมูลสำเร็จ',
                code: 200,
                dataStatus
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