import { Router } from "express";
import { userDao } from "../dao/user.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    const checkUser = await userDao.getOne({ email });
    if (checkUser)
      return res.status(400).json({ status: "error", msg: "User exist" });

    const newUser = {
      name,
      lastName,
      email,
      password: createHash(password),
    };

    const user = await userDao.create(newUser);

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
