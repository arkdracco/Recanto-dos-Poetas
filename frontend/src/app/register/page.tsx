'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Nome é obrigatório';
    if (!formData.lastName) newErrors.lastName = 'Sobrenome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    if (formData.password.length < 8) newErrors.password = 'Senha deve ter no mínimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Cadastro realizado! Verifique seu email para confirmar.');
      alert('Cadastro realizado! Verifique seu email para confirmar.');
      router.push('/verify-email');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao registrar';
      toast.error(message);
      alert('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">📚 Recanto dos Poetas</h1>
          <p className="text-gray-600 mt-2">Criar uma nova conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input"
                placeholder="João"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sobrenome
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input"
                placeholder="Silva"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Concordo com os{' '}
              <Link href="/termos" className="text-blue-600 hover:text-blue-700">
                Termos de Uso
              </Link>
              {' '}e{' '}
              <Link href="/privacidade" className="text-blue-600 hover:text-blue-700">
                Política de Privacidade
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
