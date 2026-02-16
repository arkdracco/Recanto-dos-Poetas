import { TextModel } from '../models/Text.js';
import { UserModel } from '../models/User.js';
import pool from '../config/database.js';

export const createText = async (req, res) => {
  try {
    const { title, content, description, category, coverImage, licenseType } = req.body;

    // Validação
    if (!title || !content) {
      return res.status(400).json({
        error: 'Título e conteúdo são obrigatórios',
      });
    }

    if (title.length > 500) {
      return res.status(400).json({
        error: 'Título muito longo (máximo 500 caracteres)',
      });
    }

    if (content.length < 100) {
      return res.status(400).json({
        error: 'Texto muito curto (mínimo 100 caracteres)',
      });
    }

    // Criar texto
    const text = await TextModel.create({
      authorId: req.user.id,
      title,
      content,
      description: description || '',
      category: category || 'geral',
      coverImage: coverImage || null,
      licenseType: licenseType || 'CC-BY-SA',
    });

    res.status(201).json({
      message: 'Texto criado com sucesso',
      text: {
        id: text.id,
        title: text.title,
        slug: text.slug,
        status: text.status,
        wordCount: text.word_count,
        readingTime: text.reading_time_minutes,
        createdAt: text.created_at,
      },
    });
  } catch (error) {
    console.error('Erro ao criar texto:', error);
    res.status(500).json({
      error: 'Erro ao criar texto',
    });
  }
};

export const getTextById = async (req, res) => {
  try {
    const { id } = req.params;

    const text = await TextModel.findById(id);

    if (!text) {
      return res.status(404).json({
        error: 'Texto não encontrado',
      });
    }

    // Verificar se o usuário tem acesso (dono ou publicado)
    if (text.author_id !== req.user?.id && text.status !== 'published') {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    // Incrementar contador de visualizações
    await TextModel.incrementViewCount(id);

    res.json({
      text: {
        id: text.id,
        title: text.title,
        content: text.content,
        slug: text.slug,
        description: text.description,
        category: text.category,
        coverImage: text.cover_image,
        licenseType: text.license_type,
        status: text.status,
        wordCount: text.word_count,
        readingTime: text.reading_time_minutes,
        viewCount: text.view_count + 1,
        likeCount: text.like_count,
        authorId: text.author_id,
        author: {
          firstName: text.first_name,
          lastName: text.last_name,
          profilePicture: text.profile_picture,
        },
        publishedAt: text.published_at,
        createdAt: text.created_at,
        updatedAt: text.updated_at,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar texto:', error);
    res.status(500).json({
      error: 'Erro ao buscar texto',
    });
  }
};

export const getTextBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const text = await TextModel.findBySlug(slug);

    if (!text) {
      return res.status(404).json({
        error: 'Texto não encontrado',
      });
    }

    // Incrementar contador de visualizações
    await TextModel.incrementViewCount(text.id);

    res.json({
      text: {
        id: text.id,
        title: text.title,
        content: text.content,
        slug: text.slug,
        description: text.description,
        category: text.category,
        coverImage: text.cover_image,
        licenseType: text.license_type,
        wordCount: text.word_count,
        readingTime: text.reading_time_minutes,
        viewCount: text.view_count + 1,
        likeCount: text.like_count,
        favoriteCount: text.favorite_count,
        author: {
          id: text.author_id,
          firstName: text.first_name,
          lastName: text.last_name,
          profilePicture: text.profile_picture,
        },
        publishedAt: text.published_at,
        createdAt: text.created_at,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar texto:', error);
    res.status(500).json({
      error: 'Erro ao buscar texto',
    });
  }
};

export const getAuthorTexts = async (req, res) => {
  try {
    const { authorId } = req.params;
    const status = req.query.status || 'published';

    const texts = await TextModel.findByAuthorId(authorId, status);

    res.json({
      texts: texts.map((text) => ({
        id: text.id,
        title: text.title,
        slug: text.slug,
        description: text.description,
        category: text.category,
        coverImage: text.cover_image,
        status: text.status,
        wordCount: text.word_count,
        viewCount: text.view_count,
        publishedAt: text.published_at,
        createdAt: text.created_at,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar textos:', error);
    res.status(500).json({
      error: 'Erro ao buscar textos',
    });
  }
};

export const updateText = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, description, category, coverImage, licenseType } = req.body;

    // Verificar se o usuário é o autor
    const text = await TextModel.findById(id);
    if (!text || text.author_id !== req.user.id) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    // Não permitir editar texto publicado
    if (text.status === 'published') {
      return res.status(400).json({
        error: 'Não é possível editar texto publicado. Crie uma nova versão.',
      });
    }

    const updatedText = await TextModel.updateText(id, {
      title,
      content,
      description,
      category,
      coverImage,
      licenseType,
    });

    res.json({
      message: 'Texto atualizado com sucesso',
      text: {
        id: updatedText.id,
        title: updatedText.title,
        slug: updatedText.slug,
        updatedAt: updatedText.updated_at,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar texto:', error);
    res.status(500).json({
      error: 'Erro ao atualizar texto',
    });
  }
};

export const publishText = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário é o autor
    const text = await TextModel.findById(id);
    if (!text || text.author_id !== req.user.id) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    if (text.status === 'published') {
      return res.status(400).json({
        error: 'Texto já foi publicado',
      });
    }

    const published = await TextModel.publishText(id);

    res.json({
      message: 'Texto publicado com sucesso',
      text: {
        id: published.id,
        status: published.status,
        publishedAt: published.published_at,
      },
    });
  } catch (error) {
    console.error('Erro ao publicar texto:', error);
    res.status(500).json({
      error: 'Erro ao publicar texto',
    });
  }
};

export const deleteText = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário é o autor
    const text = await TextModel.findById(id);
    if (!text || text.author_id !== req.user.id) {
      return res.status(403).json({
        error: 'Acesso negado',
      });
    }

    const deleted = await TextModel.deleteText(id);

    res.json({
      message: 'Texto deletado com sucesso',
      text: {
        id: deleted.id,
        status: deleted.status,
      },
    });
  } catch (error) {
    console.error('Erro ao deletar texto:', error);
    res.status(500).json({
      error: 'Erro ao deletar texto',
    });
  }
};

export const getPublishedTexts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category || null;

    const texts = await TextModel.getPublishedTexts(limit, offset, category);

    // Contar total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM texts WHERE status = 'published'`
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      texts: texts.map((text) => ({
        id: text.id,
        title: text.title,
        slug: text.slug,
        description: text.description,
        category: text.category,
        coverImage: text.cover_image,
        wordCount: text.word_count,
        readingTime: text.reading_time_minutes,
        viewCount: text.view_count,
        author: {
          firstName: text.first_name,
          lastName: text.last_name,
          profilePicture: text.profile_picture,
        },
        publishedAt: text.published_at,
      })),
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar textos publicados:', error);
    res.status(500).json({
      error: 'Erro ao buscar textos',
    });
  }
};

export const searchTexts = async (req, res) => {
  try {
    const { q } = req.query;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (!q || q.length < 3) {
      return res.status(400).json({
        error: 'Busca deve ter no mínimo 3 caracteres',
      });
    }

    const texts = await TextModel.searchTexts(q, limit, offset);

    res.json({
      query: q,
      texts: texts.map((text) => ({
        id: text.id,
        title: text.title,
        slug: text.slug,
        description: text.description,
        viewCount: text.view_count,
        author: {
          firstName: text.first_name,
          lastName: text.last_name,
          profilePicture: text.profile_picture,
        },
      })),
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar textos:', error);
    res.status(500).json({
      error: 'Erro ao buscar textos',
    });
  }
};
