import bycrypt from "bcrypt"

//Funcion que hashea la contraseña
export const createHash = (password) => {
    return bycrypt.hashSync(password, bycrypt.genSaltSync(10));


}

//Función que valida la contraseña ingresada por el usuario y la contraseña encriptada

export const isValidPassword = (password, userPassword) => {
    return bycrypt.compareSync(password, userPassword) // compara las dos contraseñas y devuelve un true o false
}