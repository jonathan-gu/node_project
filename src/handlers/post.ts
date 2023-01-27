import { Request, RequestHandler } from "express"
import { body, query, validationResult } from "express-validator";
import db from "../db"

interface TypedRequestParam extends Request {
    body: {
        title?: string
        description?: string
        created_at?: string
    }
}

export const createPost: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        if (!(body("title").exists().isString().notEmpty() && body("description").exists().isString().notEmpty())) {
            throw new Error("Invalid body provided")
        }
        const post = await db.post.create({
            data: {
                title: req.body.title as string,
                description: req.body.description as string,
                userId: req.user.id
            }
        })

        return res.status(201).json({ post })
    } catch (e) {
        res.status(400).json({ error: e?.toString() })
    }
}

export const getPost: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        const post = await db.post.findFirstOrThrow({
            where: {
                id: req.params.uuid
            },
            include: {
                comments: true
            }
        })
        return res.status(200).json(post)
    } catch (e) {
        return res.status(400).json({ message: 'Not found' })
    }
}

export const getPosts: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        if (req.query.from !== undefined) {
            const timestamps = Number(req.query.from) * 1000
            const from = new Date(timestamps)
            const posts = await db.post.findMany({
                where: {
                    created_at: {
                        gte: from
                    }
                },
            });
            return res.status(200).json(posts)
        }
        else {
            console.log(2)
            const posts = await db.post.findMany({
            })
            return res.status(200).json(posts)
        }
    } catch (err) {
        return res.status(400).json({ message: 'Not found' })
    }
}

export const updatePost: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        validationResult(req).throw()
        let updatedPost
        if ((body("title").exists().isString().notEmpty() || body("description").exists().isString().notEmpty())) {
            const post = await db.post.findUnique({
                where: {
                    id: req.params?.uuid
                }
            })
            if (post?.userId === req.user.id) {
                updatedPost = await db.post.update({
                    where: {
                        id: req.params?.uuid,
                    },
                    data: {
                        title: req.body?.title,
                        description: req.body?.description
                    }
                })
            }
            else {
                throw new Error("Not Authorize")
            }
            return res.status(200).json(updatedPost)
        }
        else {
            throw new Error("No data to modify")
        }
    } catch (e) {
        return res.status(400).json({ message: e + "" })
    }
}

export const deletePost: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        let deletedPost
        if (body("id").exists().isString().notEmpty()) {
            if (req.user.role !== "admin") {
                const post = await db.post.findUnique({
                    where: {
                        id: req.params?.uuid
                    }
                })
                if (post?.userId !== req.user.id) {
                    throw new Error("Not Authorize")
                }
            }
            deletedPost = await db.post.delete({
                where: {
                    id: req.params.uuid
                }
            })
        }
        else {
            throw new Error("This post doesn't exists")
        }
        return res.status(200).json({ message: "Succesfully deleted " + deletedPost.title })
    } catch (e) {
        return res.status(400).json({ message: e + "" })
    }
}