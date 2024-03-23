import path from 'node:path'
import fs from 'node:fs'
import { pool } from '../config/db.js'

export const getImageNames = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT imagen FROM users')
    const imageNames = result.map(row => row.imagen)
    const response = { imageNames }
    res.json(response)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getImageByFilename = (req, res) => {
  try {
    const { filename } = req.params
    const absolutePath = path.resolve(`./uploads/${filename}`)

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).json({ message: 'Imagen no encontrada' })
      } else {
        res.sendFile(absolutePath)
      }
    })
  } catch (error) {
    res.json({ message: error.message })
  }
}

export const uploadImageFn = async (req, res, fileName) => {
  try {
    const { filename } = req.file

    const [result] = await pool.execute('INSERT INTO users (imagen) VALUES (?)', [filename])

    if (result) {
      res.json({ message: 'Archivo subido correctamente' })
    } else {
      res.status(500).json({ message: 'Error al subir el archivo' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
