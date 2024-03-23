import { pool } from '../config/db.js'
import fs from 'node:fs/promises'

export const index = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT id, email, nombre, fecha_nacimiento, imagen FROM users')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error interno.' })
  }
}

export const getById = async (req, res) => {
  try {
    const [result] = await pool.execute('SELECT id, email, nombre, DATE_FORMAT(fecha_nacimiento, "%Y-%c-%e") AS fecha_nacimiento, imagen FROM users WHERE id = ?', [req.params.id])
    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }
    res.json(result[0])
  } catch (error) {
    res.status(500).json({ message: 'Error interno.' })
  }
}

export const store = async (req, res) => {
  try {
    const {
      email,
      nombre,
      password,
      fecha_nacimiento: fechaNacimiento
    } = req.body
    const { filename } = req.file

    if (
      !email?.includes('@') ||
      !nombre ||
      !password ||
      !fechaNacimiento ||
      !filename
    ) {
      return res.status(400).json({ message: 'Faltan datos.' })
    }

    const [result] = await pool.execute(
      'INSERT INTO users (email, nombre, password, fecha_nacimiento, imagen) VALUES (?, ?, ?, ?, ?)',
      [email, nombre, password, fechaNacimiento, filename]
    )

    if (!result.insertId) {
      return res.status(500).json({ message: 'Error al crear el usuario.' })
    }

    const [user] = await pool.execute(
      'SELECT email, nombre, imagen FROM users WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({ message: 'Usuario creado.', user })
  } catch (error) {
    console.log(error)
    let message = 'Error interno'
    let statusCode = 500

    if (error?.errno === 1062) {
      message = 'El email ya existe'
      statusCode = 400
      await fs.unlink(`uploads/${req.file.filename}`)
    }

    res.status(statusCode).json({ message })
  }
}

export const update = async (req, res) => {
  try {
    const {
      email,
      nombre,
      password,
      fecha_nacimiento: fechaNacimiento
    } = req.body
    const { filename } = req.file
    const { id } = req.params

    if (
      !email?.includes('@') ||
      !nombre ||
      !password ||
      !fechaNacimiento ||
      !filename
    ) {
      return res.status(400).json({ message: 'Faltan datos.' })
    }

    const [result] = await pool.execute(
      'UPDATE users SET email = ?, nombre = ?, password = ?, fecha_nacimiento = ?, imagen = ? WHERE id = ?',
      [email, nombre, password, fechaNacimiento, filename, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' })
    }

    res.status(200).json({ message: 'Usuario actualizado.' })
  } catch (error) {
    console.log(error)
    let message = 'Error interno'
    let statusCode = 500

    if (error?.errno === 1062) {
      message = 'El email ya existe'
      statusCode = 400
      await fs.unlink(`uploads/${req.file.filename}`)
    }

    res.status(statusCode).json({ message })
  }
}
