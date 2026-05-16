import Image from 'next/image';
import { Pokemon } from '@/lib/types';
import AttacksList from './AttacksList';
import EvolutionsList from './EvolutionsList';

interface Props {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          width={200}
          height={200}
          className="mx-auto"
        />
        <h1 className="text-3xl font-bold capitalize mt-4">{pokemon.name}</h1>
        <div className="flex gap-2 justify-center mt-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <AttacksList attacks={pokemon.attacks} />
      <EvolutionsList evolutions={pokemon.evolutions} />
    </div>
  );
}