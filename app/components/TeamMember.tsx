'use client'

import { useState } from 'react';
import Image from 'next/image';

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  imagePath: string;
  initials: string;
  href?: string;
}

export default function TeamMember({ name, role, description, imagePath, initials, href }: TeamMemberProps) {
  const [imageError, setImageError] = useState(false);

  const content = (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
      <div className="relative w-20 h-20 mx-auto mb-6">
        {!imageError ? (
          <Image
            src={imagePath}
            alt={`${name} - ${role}`}
            width={80}
            height={80}
            className="rounded-2xl object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black">
            {initials}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-purple-600 font-semibold mb-4">{role}</p>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}