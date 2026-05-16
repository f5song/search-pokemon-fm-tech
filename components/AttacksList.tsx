import { Attack } from '@/lib/types';

interface Props {
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
}

export default function AttacksList({ attacks }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">Attacks</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Fast Attacks</h3>
        <div className="grid gap-2">
          {attacks.fast.map((attack, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium">{attack.name}</span>
                <span className="text-gray-600">{attack.damage} damage</span>
              </div>
              <span className="text-sm text-gray-500">{attack.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Special Attacks</h3>
        <div className="grid gap-2">
          {attacks.special.map((attack, idx) => (
            <div key={idx} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="font-medium">{attack.name}</span>
                <span className="text-gray-600">{attack.damage} damage</span>
              </div>
              <span className="text-sm text-gray-500">{attack.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}