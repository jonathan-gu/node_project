import { Request, RequestHandler } from "express"
import { validationResult } from "express-validator";
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
        validationResult(req).throw()
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
    } catch (e) {
        return res.status(400).json({ message: e?.toString() })
    }
}

export const deletePost: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        let deletedPost
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
        return res.status(200).json({ message: "Succesfully deleted " + deletedPost.title })
    } catch (e) {
        return res.status(400).json({ message: e?.toString() })
    }
}