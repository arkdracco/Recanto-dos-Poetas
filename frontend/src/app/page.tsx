'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">📚 Recanto dos Poetas</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/textos" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Explorar Textos
                </Link>
                <Link href="/autores" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Autores
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Sobre
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className="btn-secondary">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary">
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Sua Voz, Seus Textos, Sua Proteção
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Publique textos literários com proteção Creative Commons e venda licenças individuais diretamente para seus leitores
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register?role=author" className="btn-primary text-lg px-8 py-3">
              Começar como Autor
            </Link>
            <Link href="/textos" className="btn-secondary text-lg px-8 py-3">
              Explorar Textos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Principais Funcionalidades</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="text-4xl mb-4">🖊️</div>
              <h4 className="text-xl font-semibold mb-2">Publique Facilmente</h4>
              <p className="text-gray-600">
                Crie rascunhos, revise e publique seus textos literários com apenas alguns cliques
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-2">Protegido por Lei</h4>
              <p className="text-gray-600">
                Licenças Creative Commons automáticas e proteção contra cópia de conteúdo
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2">Ganhe com seus Textos</h4>
              <p className="text-gray-600">
                Venda licenças especiais e diretos autorais para seus leitores interessados
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center">
              <div className="text-4xl mb-4">📖</div>
              <h4 className="text-xl font-semibold mb-2">Leia com Conforto</h4>
              <p className="text-gray-600">
                Interface agradável para leitura com zoom, temas e preferências personalizáveis
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card text-center">
              <div className="text-4xl mb-4">👥</div>
              <h4 className="text-xl font-semibold mb-2">Comunidade Literária</h4>
              <p className="text-gray-600">
                Siga autores, comente textos e faça parte de uma comunidade de leitores
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h4 className="text-xl font-semibold mb-2">Acesso Global</h4>
              <p className="text-gray-600">
                Seus textos acessíveis de qualquer lugar do mundo, a qualquer hora
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Crie uma Conta</h4>
              <p className="text-gray-600 text-sm">Cadastre-se como autor ou leitor em poucos minutos</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Publique seu Texto</h4>
              <p className="text-gray-600 text-sm">Escolha uma licença CC e publique seu texto literário</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Ganhe Receita</h4>
              <p className="text-gray-600 text-sm">Receba quando leitores comprarem licenças especiais</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Saiba-se Autor</h4>
              <p className="text-gray-600 text-sm">Construa sua reputação como escritor independente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Pronto para Compartilhar sua Voz?</h3>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de autores que já confiam no Recanto dos Poetas
          </p>
          <Link href="/register?role=author" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Comece Agora Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">Sobre nós</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Autores</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/guia-publicacao" className="hover:text-white">Guia de Publicação</Link></li>
                <li><Link href="/precos" className="hover:text-white">Preços e Comissões</Link></li>
                <li><Link href="/suporte" className="hover:text-white">Suporte</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-white">Política de Privacidade</Link></li>
                <li><Link href="/licenças" className="hover:text-white">Licenças</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:suporte@recantodospoetas.com" className="hover:text-white">Email</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2024 Recanto dos Poetas. Todos os direitos reservados.</p>
            <p className="mt-2">Desenvolvido com ❤️ para autores independentes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
