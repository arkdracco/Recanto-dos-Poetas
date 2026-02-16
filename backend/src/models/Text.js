import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class TextModel {
  static async create({
    authorId,
    title,
    content,
    description,
    category,
    coverImage,
    licenseType,
  }) {
    const id = uuidv4();
    
    // Gerar slug a partir do título
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + uuidv4().substring(0, 8);

    // Contar palavras
    const wordCount = content.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 200 palavras por minuto

    const result = await pool.query(
      `INSERT INTO texts (
        id, author_id, title, content, slug, description, 
        category, cover_image, word_count, reading_time_minutes,
        license_type, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, author_id, title, slug, status, word_count, reading_time_minutes, created_at`,
      [id, authorId, title, content, slug, description, category, coverImage, wordCount, readingTimeMinutes, licenseType, 'draft']
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT t.*, 
              u.first_name, u.last_name, u.profile_picture,
              (SELECT COUNT(*) FROM favorites WHERE text_id = t.id) AS favorite_count
       FROM texts t
       JOIN users u ON t.author_id = u.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const result = await pool.query(
      `SELECT t.*, 
              u.id as author_id, u.first_name, u.last_name, u.profile_picture,
              (SELECT COUNT(*) FROM favorites WHERE text_id = t.id) AS favorite_count
       FROM texts t
       JOIN users u ON t.author_id = u.id
       WHERE t.slug = $1 AND t.status = 'published'`,
      [slug]
    );
    return result.rows[0];
  }

  static async findByAuthorId(authorId, status = 'published') {
    const query = status === 'all'
      ? `SELECT * FROM texts WHERE author_id = $1 ORDER BY created_at DESC`
      : `SELECT * FROM texts WHERE author_id = $1 AND status = $2 ORDER BY created_at DESC`;

    const params = status === 'all' ? [authorId] : [authorId, status];
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async publishText(textId) {
    const result = await pool.query(
      `UPDATE texts
       SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, status, published_at`,
      [textId]
    );
    return result.rows[0];
  }

  static async updateText(textId, { title, content, description, category, coverImage, licenseType }) {
    const wordCount = content ? content.trim().split(/\s+/).length : null;
    const readingTimeMinutes = wordCount ? Math.ceil(wordCount / 200) : null;

    const result = await pool.query(
      `UPDATE texts
       SET title = COALESCE($2, title),
           content = COALESCE($3, content),
           slug = CASE WHEN $2 IS NOT NULL THEN (
             SELECT generate_slug($2)
           ) ELSE slug END,
           description = COALESCE($4, description),
           category = COALESCE($5, category),
           cover_image = COALESCE($6, cover_image),
           license_type = COALESCE($7, license_type),
           word_count = COALESCE($8, word_count),
           reading_time_minutes = COALESCE($9, reading_time_minutes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, title, slug, updated_at`,
      [textId, title, content, description, category, coverImage, licenseType, wordCount, readingTimeMinutes]
    );
    return result.rows[0];
  }

  static async deleteText(textId) {
    const result = await pool.query(
      `UPDATE texts
       SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, status`,
      [textId]
    );
    return result.rows[0];
  }

  static async incrementViewCount(textId) {
    await pool.query(
      `UPDATE texts SET view_count = view_count + 1 WHERE id = $1`,
      [textId]
    );
  }

  static async getPublishedTexts(limit = 10, offset = 0, category = null) {
    let query = `
      SELECT t.id, t.title, t.slug, t.description, t.cover_image,
             t.word_count, t.reading_time_minutes, t.view_count, t.created_at,
             u.first_name, u.last_name, u.profile_picture
      FROM texts t
      JOIN users u ON t.author_id = u.id
      WHERE t.status = 'published'
    `;

    const params = [];

    if (category) {
      query += ` AND t.category = $${params.length + 1}`;
      params.push(category);
    }

    query += ` ORDER BY t.published_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async searchTexts(searchTerm, limit = 20, offset = 0) {
    const result = await pool.query(
      `SELECT t.id, t.title, t.slug, t.description, t.cover_image,
              t.word_count, t.view_count, t.created_at,
              u.first_name, u.last_name, u.profile_picture
       FROM texts t
       JOIN users u ON t.author_id = u.id
       WHERE t.status = 'published' AND (
         t.title ILIKE $1 OR
         t.description ILIKE $1 OR
         t.content ILIKE $1
       )
       ORDER BY t.published_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${searchTerm}%`, limit, offset]
    );
    return result.rows;
  }
}
