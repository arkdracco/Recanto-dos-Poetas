// ./frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import React from 'react';
import '../../src/styles/globals.css';

export const metadata: Metadata = {
  title: 'Recanto dos Poetas - Plataforma Literária Digital',
  description: 'Publique, leia e venda seus textos literários com proteção de direitos autorais',
  keywords: 'literatura, poesia, textos, publicação, creative commons, direitos autorais',
  authors: [{ name: 'Recanto dos Poetas' }],
  openGraph: {
    title: 'Recanto dos Poetas',
    description: 'Plataforma para publicação e venda de textos literários',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#007bff" />
      </head>
      <body className="font-body bg-gray-50">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>

        {/* Scripts de proteção anti-scraping */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detectar ferramentas do desenvolvedor
              let devtools = { open: false };
              const threshold = 160;
              setInterval(() => {
                if (window.outerHeight - window.innerHeight > threshold ||
                    window.outerWidth - window.innerWidth > threshold) {
                  if (!devtools.open) {
                    devtools.open = true;
                    console.warn('Ferramentas do desenvolvedor detectadas. Acesso a conteúdo protegido pode ser restringido.');
                  }
                } else {
                  devtools.open = false;
                }
              }, 500);

              // Desabilitar copy em textos protegidos
              document.addEventListener('copy', function(e) {
                const selection = window.getSelection().toString();
                if (selection.length > 0) {
                  const activeElement = document.activeElement;
                  if (activeElement?.classList.contains('protected-text')) {
                    e.preventDefault();
                    console.warn('Cópia de conteúdo protegido não é permitida');
                  }
                }
              });

              // Desabilitar menu de contexto em textos protegidos
              document.addEventListener('contextmenu', function(e) {
                if (e.target?.closest('.protected-text')) {
                  e.preventDefault();
                }
              });

              // Desabilitar seleção de texto em elementos protegidos
              document.addEventListener('selectstart', function(e) {
                if (e.target?.closest('.protected-text')) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
