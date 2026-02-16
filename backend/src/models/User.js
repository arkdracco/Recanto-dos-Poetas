import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  static async create({ email, password, firstName, lastName }) {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role, created_at`,
      [id, email, passwordHash, firstName, lastName, 'reader']
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, role, bio, profile_picture, email_verified, is_active, created_at
       FROM users
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hash) {
    return bcrypt.compare(plainPassword, hash);
  }

  static async updateProfile(userId, { firstName, lastName, bio, profilePicture }) {
    const result = await pool.query(
      `UPDATE users
       SET first_name = COALESCE($2, first_name),
           last_name = COALESCE($3, last_name),
           bio = COALESCE($4, bio),
           profile_picture = COALESCE($5, profile_picture),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, first_name, last_name, bio, profile_picture`,
      [userId, firstName, lastName, bio, profilePicture]
    );
    return result.rows[0];
  }

  static async verifyEmail(userId) {
    const result = await pool.query(
      `UPDATE users
       SET email_verified = TRUE, email_verified_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, email_verified`,
      [userId]
    );
    return result.rows[0];
  }

  static async changePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    const result = await pool.query(
      `UPDATE users
       SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email`,
      [userId, passwordHash]
    );
    return result.rows[0];
  }

  static async promoteToAuthor(userId) {
    const result = await pool.query(
      `UPDATE users
       SET role = 'author'
       WHERE id = $1
       RETURNING id, role`,
      [userId]
    );
    return result.rows[0];
  }
}
