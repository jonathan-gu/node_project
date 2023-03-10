import { Request, RequestHandler } from "express"
import { body, validationResult } from "express-validator";
import db from "../db"

interface TypedRequestParam extends Request {
    body: {
        content?: string
    }
}

export const createComment: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        validationResult(req).throw()
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
            const comment = await db.comment.findUnique({
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
        return res.status(400).json({ message: e?.toString() })
    }
}

export const deleteComment: RequestHandler = async (req: TypedRequestParam, res) => {
    try {
        let deletedcomment
        if (req.user.role !== "admin") {
            if (req.user?.id && body("id").exists().isString().notEmpty()) {
                const post = await db.comment.findUnique({
                    where: {
                        id: req.params?.uuid
                    }
                })
                if (post?.userId !== req.user.id) {
                    throw new Error("Not Authorize")

                }
            }
        }
        deletedcomment = await db.comment.delete({
            where: {
                id: req.params.uuid
            }
        })

        return res.status(200).json({ message: "Succesfully deleted " + deletedcomment?.id })
    } catch (e) {
        return res.status(400).json({ message: e?.toString() || "Error while deleting" })
    }
}