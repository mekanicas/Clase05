import { Router } from "express";
import { userDao } from "../dao/user.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { accountDao } from "../dao/account.dao.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    const checkUser = await userDao.getOne({ email });
    if (checkUser)
      return res.status(400).json({ status: "error", msg: "User exist" });

    // Creamos la cuenta del usuario
    const accountUser = await accountDao.createAccount({name, lastName})

    const newUser = {
      name,
      lastName,
      email,
      password: createHash(password),
      account: accountUser._id,
    };

    const user = await userDao.create(newUser);

    //Actualizar datos de la cuenta para asociar el usuario
    await accountDao.update(accountUser._id, {userId : user._id})

    res.status(201).json({ status: "ok", payload: user });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
});



router.post("/login", async (req, res) => {
  try {
    const {email, password } = req.body;

    const checkUser = await userDao.getOne({ email });
    if (!checkUser || !isValidPassword(password, checkUser.password))
      return res.status(401).json({ status: "error", msg: "Email or password not found or invalid" });
    req.session.user = checkUser;
    console.log(req.session.user)



    res.status(200).json({ status: "ok", payload: checkUser });
  } catch (error) {
    console.log(error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
});

export default router;
