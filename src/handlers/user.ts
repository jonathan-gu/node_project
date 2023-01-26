import { Request, RequestHandler } from "express"
import { body, validationResult } from "express-validator"
import db from "../db"
import { comparePassword, createJWT, hashPassword } from "../modules/auth"

interface TypedRequestParam extends Request {
    body: {
        username?: string
        password?: string
        role?: string
    }
}

export const createUser: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        if (!(body("username").exists().isString().notEmpty() && body("password").exists().isString().notEmpty() && body("role").exists().isString().notEmpty())) {
            throw new Error("Invalid body provided")
        }

        const hash = await hashPassword(req.body.password as string)

        const user = await db.user.create({
            data: {
                username: req.body.username as string,
                password: hash,
                role: req.body.role as string
            }
        })
        const token = createJWT(user)

        return res.status(201).json({ token })
    } catch (e) {
        res.status(400).json({ error: e?.toString() })
    }
}

export const signIn: RequestHandler = async (req: TypedRequestParam, res) => {
    try {

        if (!(req.body?.username && req.body?.password)) {
            throw new Error("Invalid body provided")
        }
        if (req.user) {
            throw new Error("Already loggin")
        }
        const user = await db.user.findUnique({
            where: {
                username: req.body.username
            }
        })

        if (user) {
            const isValid = await comparePassword(req.body.password, user.password)

            if (!isValid) {
                return res.status(401).json({ error: "Invalid password" })
            }

            const token = createJWT(user)
            return res.status(200).json({ token })
        }
        else {
            throw new Error("This user doesn't exists")
        }
    } catch (e) {
        return res.status(400).json({ error: e?.toString() })
    }
}

export const getUser: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        const users = await db.user.findUnique({
            where: {
                id: req.params.uuid
            }
        })
        return res.status(200).json(users)
    } catch (e) {
        return res.status(400).json({ error: e || 'Cannot create todoList' })
    }
}

export const getUsers: RequestHandler = async (req: TypedRequestParam, res) => {
    const users = await db.user.findMany({
    })
    return res.status(200).json(users)
}

export const updateUser: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        validationResult(req).throw()
        if (body("username").exists().isString().notEmpty() || body("password").exists().isString().notEmpty()) {
            const user = await db.user.findUnique({
                where: {
                    id: req.params?.uuid
                },
            })
            if (!user) {
                throw new Error("The user doesn't exists")
            }
            let hash = user.password
            if (body("password").exists().isString().notEmpty()) {
                hash = await hashPassword(req.body?.password as string)
            }
            const updatedUser = await db.user.update({
                where: {
                    id: req.params?.uuid,
                },
                data: {
                    username: req.body?.username,
                    password: hash
                }
            })
            return res.status(200).json(updatedUser)
        }
        else {
            throw new Error("No data to modify")
        }
    } catch (e) {
        return res.status(400).json({ message: e || "Error while updating" })
    }
}

export const deleteUser: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        const user = await db.user.delete({
            where: {
                id: req.params.uuid
            }
        })
        return res.status(200).json({ message: "Succesfully deleted " + user.username })
    } catch (e) {
        return res.status(400).json({ message: e || "Error while deleting" })
    }
}