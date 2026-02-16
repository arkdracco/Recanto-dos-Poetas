import { UserModel } from '../models/User.js';
import { generateTokens, generateToken } from '../utils/jwt.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import validator from 'validator';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validação
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Email, senha, nome e sobrenome são obrigatórios',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Email inválido',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Senha deve ter no mínimo 8 caracteres',
      });
    }

    // Verificar se usuário já existe
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'Email já cadastrado',
      });
    }

    // Criar usuário
    const user = await UserModel.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Gerar token de verificação
    const verificationToken = generateToken(
      { userId: user.id, purpose: 'email_verification' },
      process.env.JWT_SECRET,
      '24h'
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // Enviar email de verificação
    await sendVerificationEmail(email, firstName, verificationLink);

    // Gerar tokens de acesso
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    res.status(201).json({
      message: 'Usuário registrado com sucesso. Verifique seu email.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({
      error: 'Erro ao registrar usuário',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
    }

    // Buscar usuário
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Email ou senha inválidos',
      });
    }

    // Verificar senha
    const passwordMatch = await UserModel.verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Email ou senha inválidos',
      });
    }

    // Verificar se usuário está ativo
    if (!user.is_active) {
      return res.status(403).json({
        error: 'Conta desativada',
      });
    }

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        emailVerified: user.email_verified,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      error: 'Erro ao fazer login',
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token não fornecido',
      });
    }

    // Decodificar token
    let decoded;
    try {
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
      });
    }

    if (decoded.purpose !== 'email_verification') {
      return res.status(401).json({
        error: 'Token inválido',
      });
    }

    // Verificar email do usuário
    const user = await UserModel.verifyEmail(decoded.userId);

    res.json({
      message: 'Email verificado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_verified,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({
      error: 'Erro ao verificar email',
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email é obrigatório',
      });
    }

    // Buscar usuário
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Não revelar se o email existe ou não (segurança)
      return res.json({
        message: 'Se o email existe em nossa base, um link de reset foi enviado',
      });
    }

    // Gerar token de reset
    const resetToken = generateToken(
      { userId: user.id, purpose: 'password_reset' },
      process.env.JWT_SECRET,
      '1h'
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Enviar email
    await sendPasswordResetEmail(email, user.first_name, resetLink);

    res.json({
      message: 'Link de reset foi enviado para seu email',
    });
  } catch (error) {
    console.error('Erro ao solicitar reset:', error);
    res.status(500).json({
      error: 'Erro ao solicitar reset de senha',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: 'Token e nova senha são obrigatórios',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'Senha deve ter no mínimo 8 caracteres',
      });
    }

    // Decodificar token
    let decoded;
    try {
      const jwt = require('jsonwebtoken');
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
      });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(401).json({
        error: 'Token inválido',
      });
    }

    // Atualizar senha
    const user = await UserModel.changePassword(decoded.userId, newPassword);

    res.json({
      message: 'Senha alterada com sucesso',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({
      error: 'Erro ao resetar senha',
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profile_picture,
        emailVerified: user.email_verified,
        isActive: user.is_active,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro ao buscar usuário',
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, profilePicture } = req.body;

    const user = await UserModel.updateProfile(req.user.id, {
      firstName,
      lastName,
      bio,
      profilePicture,
    });

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        bio: user.bio,
        profilePicture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      error: 'Erro ao atualizar perfil',
    });
  }
};
