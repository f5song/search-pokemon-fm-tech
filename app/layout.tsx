'use client';

import { ApolloProvider } from '@apollo/client/react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { client } from '@/lib/apollo-client';
import { ThemeProvider } from '@/components/ThemeProvider';

const _inter = Inter({ subsets: ['latin'] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <head>
        <title>PokeDex Search - Find Any Pokemon</title>
        <meta name="description" content="Search and explore Pokemon with detailed stats, attacks, and evolution chains. A modern Pokemon encyclopedia." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <ApolloProvider client={client}>
            {children}
          </ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
