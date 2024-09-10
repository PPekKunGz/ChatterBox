import { FastifyInstance } from "fastify";
import { checkValidRequest } from "../../../../helpers/middleware";
import { prisma, UtilsPassword } from '../../../../helpers/utils'
import * as JWT from 'jsonwebtoken'
import { config } from '../../../../helpers/config'

interface PostBody {
    email: string
    username: string
    password: string
}

async function userRoutes(server: FastifyInstance) {

    server.get('/', { preHandler: [ checkValidRequest ]}, async (req, res) => {
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

    server.post<{ Body: PostBody }>('/create', async (req, res) => {
        const { email, username, password } = req.body
        if (!email || !username || !password) {
            return res.status(401).send({ message: 'กรุณาส่งข้อมูลให้ครบ', code: 0, data: null });
          }
        
        try {
            const token = (req.cookies.chatter_token ? (req.cookies.chatter_token) : (req.headers.chatter_token ? (req.headers.chatter_token) : undefined));
            if (!token) {
                return res.status(401).send({ message: "กรุณาเข้าสู่ระบบ", code: 0, data: null });
            }

            let decode;
            try {
                decode = JWT.verify(String(token), String(config.APP_JWT_SECRET));
            } catch (error) {
                console.log(error)
                return res.status(403).send({ message: "ผู้ใช้งานผิดพลาด 1", code: 0, data: null });
            }
            const jwt = JSON.parse(JSON.stringify(decode));

            if (jwt.email != email) {
                return res.status(403).send({ message: "ผู้ใช้งานผิดพลาด 2", code: 0, data: null });
            }

            var user = await prisma.user.findUnique({
                where: {
                    email: email
                },
                include: {
                    posts: true,
                    comments: true,
                    notifications: true,
                }
            })

            if (user) {
                console.log(`${email} Sign in`)
                return res.send({
                    message: 'เคยมีอยู่แล้ว',
                    code: 200
                })
            } else {
                const hashPass = await UtilsPassword.genSalt(12, password);
                var userCreate = await prisma.user.create({
                    data: {
                        email: email,
                        username: username,
                        hashedPassword: String(hashPass),
                    }
                })
                const postCreate = await prisma.post.create({
                    data: {
                        userId: userCreate.id,
                        body: ""
                    }
                })
                const commentCreate = await prisma.comment.create({
                    data: {
                        userId: userCreate.id,
                        body: "",
                        postId: userCreate.id
                    }
                })
                const notificationsCreate = await prisma.notification.create({
                    data: {
                        userId: userCreate.id,
                        body: ""
                    }
                })
                console.log(`Create ${email} to database`)
                return res.send({
                    message: 'สร้างสำเร็จ',
                    code: 200
                })
            }


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