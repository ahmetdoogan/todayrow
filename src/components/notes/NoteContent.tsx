"use client";
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { createEmbed } from '@/utils/embedUtils';

const WIKI_LINK_REGEX = /\[\[(.+?)\]\]/g;
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface Props {
  content: string;
  isPreview?: boolean;
}

export default function NoteContent({ content, isPreview = false }: Props) {
  const router = useRouter();

  // Sosyal medya scriptlerinin yüklenmesi
  useEffect(() => {
    if (!isPreview && content) {
      // Twitter scripti her zaman yüklensin
      if (content.includes('twitter.com') || content.includes('x.com')) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => {
          // Script yüklendikten sonra widget'ları yenile
          // Optional chaining ile TS hatasını çözüyoruz
          setTimeout(() => {
            window.twttr?.widgets?.load();
          }, 100);
        };
        document.body.appendChild(script);
      }

      // Instagram için
      if (content.includes('instagram.com')) {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
          // Optional chaining ile TS hatasını çözüyoruz
          setTimeout(() => {
            window.instgrm?.Embeds?.process();
          }, 100);
        };
        document.body.appendChild(script);
      }
    }

    // Cleanup
    return () => {
      if (!isPreview) {
        const scripts = document.querySelectorAll('script[src*="twitter"], script[src*="instagram"]');
        scripts.forEach(script => script.remove());
      }
    };
  }, [content, isPreview]);

  const processContent = () => {
    let parts: (string | { type: string, content: string })[] = [];
    let lastIndex = 0;

    const matches = Array.from(content.matchAll(URL_REGEX));

    matches.forEach((match) => {
      const url = match[0];
      const startIndex = match.index!;

      if (startIndex > lastIndex) {
        parts.push(content.substring(lastIndex, startIndex));
      }

      const embed = createEmbed(url, isPreview);
      if (embed) {
        parts.push({ type: 'embed', content: embed.html });
      } else {
        parts.push({ type: 'url', content: url });
      }

      lastIndex = startIndex + url.length;
    });

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-4">
      {processContent().map((part, index) => {
        if (typeof part === 'string') {
          const wikiParts = part.split(WIKI_LINK_REGEX);
          return (
            <span key={index}>
              {wikiParts.map((text, i) => {
                if (i % 2 === 1) {
                  return (
                    <button
                      key={i}
                      onClick={() => router.push(`/dashboard/notes/${text.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {text}
                    </button>
                  );
                }
                return <ReactMarkdown key={i}>{text}</ReactMarkdown>;
              })}
            </span>
          );
        } else if (part.type === 'embed') {
          return (
            <div
              key={index}
              className={`overflow-hidden ${isPreview ? '' : 'my-4'}`}
              dangerouslySetInnerHTML={{ __html: part.content }}
            />
          );
        } else if (part.type === 'url') {
          return (
            <a
              key={index}
              href={part.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {part.content}
            </a>
          );
        }
      })}
    </div>
  );
}
