export interface Attack {
  name: string;
  type: string;
  damage: number;
}

export interface Evolution {
  id: string;
  name: string;
  image: string;
  types: string[];
}

export interface Pokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  classification?: string;
  attacks: {
    fast: Attack[];
    special: Attack[];
  };
  evolutions: Evolution[];
}