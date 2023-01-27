import { body } from "express-validator"

export const verifyDataBodyCreateComment = () => {
    if (!body("content").exists().isString().notEmpty()) {
        throw new Error("Invalid body provided")
    }
}

export const verifyDataBodyUpdateComment = () => {
    if (!(body("title").exists().isString().notEmpty() || body("description").exists().isString().notEmpty())) {
        throw new Error("Invalid body provided")
    }
}