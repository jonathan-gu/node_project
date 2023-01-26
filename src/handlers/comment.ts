import { Request, RequestHandler } from "express"
import { body, check, validationResult } from "express-validator";
import db from "../db"

interface TypedRequestParam extends Request {
    body: {
        content?: string
    }
}

export const createPost: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        if (!body("content").exists().isString().notEmpty()) {
            throw new Error("Invalid body provided")
        }

        const comment = await db.comment.create({
            data: {
                content: req.body.content as string,
                postId: req.params.uuid,
                userId: req.user.id
            }
        })

        return res.status(201).json({ comment })
    } catch (e) {
        res.status(400).json({ error: e?.toString() })
    }
}

export const getComment: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        const comment = await db.comment.findUnique({
            where: {
                id: req.params.uuid
            }
        })
        return res.status(200).json(comment)
    } catch (e) {
        return res.status(400).json({ message: 'Not found' })
    }
}

export const getComments: RequestHandler = async (req: TypedRequestParam, res) => {
    const comments = await db.comment.findMany({
    })
    return res.status(200).json(comments)
}

export const updateComment: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        validationResult(req).throw()
        let updatedComment
        if (body("content").exists().isString().notEmpty()) {
            const comment = await db.post.findUnique({
                where: {
                    id: req.params?.uuid
                }
            })
            if (comment?.userId === req.user.id) {
                updatedComment = await db.comment.update({
                    where: {
                        id: req.params?.uuid,
                    },
                    data: {
                        content: req.body?.content,
                    }
                })
            }
            else {
                throw new Error("Not Authorize")
            }
            return res.status(200).json(updatedComment)
        }
        else {
            throw new Error("No data to modify")
        }
    } catch (e) {
        return res.status(400).json({ message: e || "Error while updating" })
    }
}

export const deleteComment: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        let deletedPost
        if (req.user?.id && body("id").exists().isString().notEmpty()) {
            const post = await db.post.findUnique({
                where: {
                    id: req.params?.uuid
                }
            })
            if (post?.userId === req.user.id) {
                deletedPost = await db.post.delete({
                    where: {
                        id: req.params.uuid
                    }
                })
            }
            else {
                throw new Error("Not Authorize")
            }
        }
        else {
            throw new Error("No data to modify")
        }
        return res.status(200).json({ message: "Succesfully deleted " + deletedPost })
    } catch (e) {
        return res.status(400).json({ message: e || "Error while deleting" })
    }
}