import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY || "paodepadaria";

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "24h" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const existingUser = rows[0];

    if (existingUser) {
      return res.status(409).send({ message: "Este e-mail já está em uso." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, hashedPassword]);

    const token = generateToken(newUser.rows[0].id);

    res.cookie('token', token, { httpOnly: true });
    res.status(201).send({ message: "Registro realizado com sucesso!", token });
  } catch (error) {
    console.error("Erro ao registrar o usuário", error);
    res.status(500).send({ message: "Erro ao registrar o usuário" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: "E-mail ou senha incorretos!" });
    }

    const token = generateToken(user.id);

    res.cookie('token', token, { httpOnly: true });
    res.send({ message: "Login realizado com sucesso!", token });
  } catch (error) {
    console.error("Erro ao tentar fazer login", error);
    res.status(500).send({ message: "Erro ao tentar fazer login" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 1) {
      res.clearCookie('token'); // Limpa o cookie de autenticação
      res.status(200).send({ message: "Usuário excluído com sucesso!" });
    } else {
      res.status(404).send({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao excluir o usuário", error);
    res.status(500).send({ message: "Erro ao excluir o usuário." });
  }
};
