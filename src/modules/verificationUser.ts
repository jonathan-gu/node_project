import { body } from "express-validator"

export const verifyDataBodyCreateUser = () => {
    if (!(body("username").exists().isString().notEmpty() && body("password").exists().isString().notEmpty() && body("role").exists().isString().notEmpty())) {
        throw new Error("Invalid body provided")
    }
}

export const verifyDataBodySignIn = () => {
    if (!(body("username").exists().isString().notEmpty() && body("password").exists().isString().notEmpty())) {
        throw new Error("Invalid body provided")
    }
}

export const verifyDataBodyUpdateUser = () => {
    if (!(body("username").exists().isString().notEmpty() && body("password").exists().isString().notEmpty())) {
        throw new Error("Invalid body provided")
    }
}