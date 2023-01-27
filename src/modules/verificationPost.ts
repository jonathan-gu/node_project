import { body } from "express-validator"

export const verifyDataBodyCreatePost = () => {
    if (!(body("title").exists().isString().notEmpty() && body("description").exists().isString().notEmpty())) {
        throw new Error("Invalid body provided")
    }
}

export const verifyDataBodyUpdatePost = () => {
    if (!(body("title").exists().isString().notEmpty() || body("description").exists().isString().notEmpty())) {
        throw new Error("Invalid body provided")
    }
}