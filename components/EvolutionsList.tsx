'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Evolution } from '@/lib/types';

interface Props {
  evolutions: Evolution[];
}

export default function EvolutionsList({ evolutions }: Props) {
  const router = useRouter();

  if (!evolutions || evolutions.length === 0) {
    return null;
  }

  const handleEvolutionClick = (name: string) => {
    router.push(`/?name=${encodeURIComponent(name.toLowerCase())}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Evolutions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {evolutions.map((evolution) => (
          <button
            key={evolution.id}
            onClick={() => handleEvolutionClick(evolution.name)}
            className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Image
              src={evolution.image}
              alt={evolution.name}
              width={100}
              height={100}
              className="mx-auto"
            />
            <p className="text-center font-semibold capitalize mt-2">
              {evolution.name}
            </p>
            <div className="flex gap-1 justify-center mt-1">
              {evolution.types.map((type) => (
                <span
                  key={type}
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}