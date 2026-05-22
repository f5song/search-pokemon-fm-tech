# คู่มือเตรียมสัมภาษณ์งาน Junior Full-Stack Developer
## FM Tech - Pokemon Search Project

---

# ส่วนที่ 1: คำถามเชิงเทคนิคที่คาดว่าจะถูกถาม

---

## 1. TypeScript & React

### Q1: "ทำไมถึงเลือกใช้ TypeScript แทน JavaScript?"

**ตอบ:**
```typescript
// ตัวอย่างจากโปรเจกต์ - lib/types.ts
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
  evolutions?: Evolution[] | null;
}
```

**ข้อดีที่ได้รับจริงในโปรเจกต์นี้:**
1. **Catch errors at compile time** - เช่น ถ้าเขียน `pokemon.typ` แทน `pokemon.types` จะเจอ error ทันที
2. **Better IDE support** - Autocomplete แม่นยำ, refactor ง่าย
3. **Self-documenting code** - Interface บอก shape ของ data ชัดเจน
4. **Safer refactoring** - เปลี่ยน type แล้ว TypeScript บอกทุกที่ที่ต้องแก้

**ปัญหาที่เจอ:**
```typescript
// Circular type inference error
while (current?.evolutions && current.evolutions.length > 0) {
  const nextEvolution = current.evolutions[0]; // Error: implicit any
}

// แก้โดยเพิ่ม explicit type annotation
const nextEvolution: PokemonBasic = current.evolutions[0]; // OK
```

---

### Q2: "อธิบาย React Hooks ที่ใช้ในโปรเจกต์"

**ตอบ:**

#### useState - จัดการ local state
```typescript
// components/SearchInput.tsx
const [inputValue, setInputValue] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [highlightedIndex, setHighlightedIndex] = useState(-1);
```

#### useEffect - side effects และ sync กับ external systems
```typescript
// Debounced search - รอ 150ms หลังพิมพ์เสร็จ
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(inputValue);
  }, 150);
  return () => clearTimeout(timer); // Cleanup function
}, [inputValue]);
```

#### useCallback - memoize functions ป้องกัน unnecessary re-renders
```typescript
const handleSelect = useCallback((name: string) => {
  setInputValue(name);
  setIsOpen(false);
  router.push(`/?name=${encodeURIComponent(name)}`);
}, [router]);
```

#### useMemo - memoize expensive calculations
```typescript
const filteredResults = useMemo(() => {
  if (!debouncedQuery) return [];
  return pokemonList
    .map(p => ({ ...p, score: scoreMatch(p.name, debouncedQuery) }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}, [pokemonList, debouncedQuery]);
```

#### Custom Hook - แยก logic ที่ reusable
```typescript
// lib/useEvolutionChain.ts
export function useEvolutionChain(pokemon: Pokemon): UseEvolutionChainResult {
  const { data: allPokemonData } = useQuery(GET_ALL_POKEMON_NAMES);
  
  const chain = useMemo(() => {
    // Complex logic to build evolution chain
  }, [pokemon, allPokemonData]);
  
  return { chain, loading, error };
}
```

---

### Q3: "useCallback กับ useMemo ต่างกันอย่างไร?"

**ตอบ:**

| | useMemo | useCallback |
|---|---------|-------------|
| **Returns** | Memoized **value** | Memoized **function** |
| **Use case** | Expensive calculations | Functions passed as props |

```typescript
// useMemo - cache ผลลัพธ์ของ calculation
const expensiveResult = useMemo(() => {
  return pokemonList.filter(...).sort(...);
}, [pokemonList]);

// useCallback - cache function reference
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// useCallback เทียบเท่ากับ:
const handleClick = useMemo(() => {
  return () => doSomething(id);
}, [id]);
```

**ทำไมต้องใช้:**
- React ใช้ reference equality ในการเปรียบเทียบ
- ถ้าไม่ memoize, function ใหม่จะถูกสร้างทุก render
- Child components ที่รับ function เป็น prop จะ re-render โดยไม่จำเป็น

---

### Q4: "อธิบาย React Component Lifecycle ใน Functional Components"

**ตอบ:**

```typescript
function MyComponent({ id }) {
  // 1. MOUNTING: Component ถูกสร้างครั้งแรก
  useEffect(() => {
    console.log('Component mounted');
    
    // 3. UNMOUNTING: Component ถูกลบออก
    return () => {
      console.log('Component will unmount');
    };
  }, []); // Empty deps = run once on mount

  // 2. UPDATING: Component re-render เมื่อ props/state เปลี่ยน
  useEffect(() => {
    console.log('id changed:', id);
  }, [id]); // Run when id changes

  return <div>{id}</div>;
}
```

**ในโปรเจกต์นี้:**
```typescript
// Cleanup เมื่อ component unmount หรือ deps เปลี่ยน
useEffect(() => {
  const timer = setTimeout(...);
  return () => clearTimeout(timer); // ป้องกัน memory leak
}, [inputValue]);
```

---

## 2. Next.js

### Q5: "App Router กับ Pages Router ต่างกันอย่างไร? ทำไมเลือก App Router?"

**ตอบ:**

| Feature | Pages Router | App Router |
|---------|-------------|------------|
| File location | `/pages` | `/app` |
| Default rendering | Client | Server (RSC) |
| Layouts | `_app.js`, `_document.js` | `layout.tsx` (nested) |
| Data fetching | `getServerSideProps`, `getStaticProps` | `async` components, `fetch` |
| Loading states | Manual | Built-in `loading.tsx` |

**ทำไมเลือก App Router:**
1. **Server Components by default** - ลด JavaScript bundle size
2. **Nested Layouts** - Share UI ระหว่าง routes ได้ง่าย
3. **Built-in loading/error states** - ไม่ต้องจัดการเอง
4. **Streaming** - แสดง UI บางส่วนก่อนโหลดเสร็จ

```typescript
// app/layout.tsx - Nested layout
export default function RootLayout({ children }) {
  return (
    <html className="dark bg-background">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Q6: "Server Components กับ Client Components ต่างกันอย่างไร?"

**ตอบ:**

```typescript
// Server Component (default) - ไม่มี 'use client'
// ทำงานบน server, ไม่มี JavaScript ส่งไป browser
async function PokemonList() {
  const data = await fetchPokemon(); // fetch บน server
  return <ul>{data.map(...)}</ul>;
}

// Client Component - ต้องมี 'use client'
'use client';
function SearchInput() {
  const [value, setValue] = useState(''); // ใช้ React hooks ได้
  return <input onChange={e => setValue(e.target.value)} />;
}
```

**ในโปรเจกต์นี้:**
- `SearchInput.tsx` - Client (ใช้ useState, useEffect)
- `ThemeProvider.tsx` - Client (ใช้ Context)
- `PokemonCard.tsx` - Client (ใช้ Framer Motion)

**ข้อควรระวัง Next.js 16:**
```typescript
// ต้องครอบ useSearchParams ด้วย Suspense
<Suspense fallback={<Loading />}>
  <SearchInput /> {/* ใช้ useSearchParams ข้างใน */}
</Suspense>
```

---

### Q7: "อธิบายการทำ Dynamic Routing ใน Next.js"

**ตอบ:**

```
app/
├── page.tsx              → /
├── about/page.tsx        → /about
├── pokemon/
│   ├── page.tsx          → /pokemon
│   └── [name]/page.tsx   → /pokemon/pikachu, /pokemon/charizard
└── api/
    └── pokemon/route.ts  → /api/pokemon
```

**ในโปรเจกต์นี้ใช้ Query Parameters:**
```typescript
// อ่าน query params
const searchParams = useSearchParams();
const pokemonName = searchParams.get('name');

// Navigate พร้อม query params
router.push(`/?name=${encodeURIComponent(name)}`);
```

---

## 3. GraphQL & Apollo Client

### Q8: "GraphQL ต่างจาก REST API อย่างไร?"

**ตอบ:**

| Feature | REST | GraphQL |
|---------|------|---------|
| Endpoints | หลาย endpoints | Single endpoint |
| Data fetching | Fixed response | Query เฉพาะที่ต้องการ |
| Over-fetching | Common | ไม่มี |
| Under-fetching | ต้อง multiple requests | Single request |
| Type system | ไม่มี built-in | Strongly typed schema |

**ตัวอย่างจากโปรเจกต์:**
```graphql
# ขอเฉพาะ fields ที่ต้องการ
query GetPokemon($name: String!) {
  pokemon(name: $name) {
    name
    image
    types
    attacks {
      fast { name type damage }
      special { name type damage }
    }
    evolutions {
      name
      image
      types
      evolutions {  # Nested query!
        name
        image
      }
    }
  }
}
```

**ข้อดีที่เจอจริง:**
- ได้ข้อมูล nested (evolutions) ใน single request
- ไม่ต้องทำ multiple API calls
- Type safety จาก schema

---

### Q9: "Apollo Client ทำงานอย่างไร? Caching ทำงานอย่างไร?"

**ตอบ:**

```typescript
// lib/apollo-client.ts
const client = new ApolloClient({
  uri: 'https://graphql-pokemon2.vercel.app',
  cache: new InMemoryCache(),
});
```

**Cache Flow:**
```
1. Query ถูกส่งไป
   ↓
2. Apollo เช็ค cache ก่อน
   ↓
3a. Cache hit → return cached data (fast!)
3b. Cache miss → fetch from server → store in cache
```

**Cache Policies:**
```typescript
const { data } = useQuery(GET_POKEMON, {
  variables: { name: 'pikachu' },
  fetchPolicy: 'cache-first',      // Default: ใช้ cache ถ้ามี
  // 'network-only'  - ดึงจาก server เสมอ
  // 'cache-only'    - ใช้ cache เท่านั้น
  // 'cache-and-network' - ใช้ cache แล้วก็ fetch update
});
```

**ในโปรเจกต์นี้:**
- Pokemon data ไม่เปลี่ยนบ่อย → `cache-first` เหมาะสม
- ลด network requests เมื่อค้นหา Pokemon ซ้ำ

---

## 4. State Management

### Q10: "อธิบายวิธีจัดการ State ในโปรเจกต์นี้"

**ตอบ:**

```
┌─────────────────────────────────────────────────────────┐
│                    State Architecture                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  URL State (Single Source of Truth)                     │
│  └── ?name=pikachu                                      │
│       │                                                 │
│       ▼                                                 │
│  Server State (Apollo Cache)                            │
│  └── Pokemon data from GraphQL                          │
│       │                                                 │
│       ▼                                                 │
│  UI State (React useState)                              │
│  ├── inputValue (search input)                          │
│  ├── isOpen (dropdown visibility)                       │
│  ├── highlightedIndex (keyboard nav)                    │
│  └── theme (dark/light)                                 │
│       │                                                 │
│       ▼                                                 │
│  Persisted State (localStorage)                         │
│  ├── theme preference                                   │
│  └── recent searches                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**ทำไมไม่ใช้ Redux/Zustand:**
- โปรเจกต์ขนาดเล็ก
- Apollo จัดการ server state แล้ว
- URL เป็น source of truth สำหรับ search
- ไม่มี complex client-side state ที่ต้อง share หลาย components

---

## 5. Testing

### Q11: "อธิบาย Testing Strategy ที่ใช้"

**ตอบ:**

**Testing Pyramid:**
```
        /\
       /  \  E2E Tests (ไม่ได้ทำ)
      /----\
     /      \ Integration Tests (บางส่วน)
    /--------\
   /          \ Unit Tests (12 tests)
  /__________\ 
```

**Unit Tests ที่เขียน:**
```typescript
// __tests__/pokemon.test.ts

describe('Pokemon Type Assertions', () => {
  // Required tests
  test('Bulbasaur should be Grass/Poison type', () => {
    expect(mockBulbasaur.types).toContain('Grass');
    expect(mockBulbasaur.types).toContain('Poison');
  });
});

describe('Data Structure Validation', () => {
  test('Pokemon should have all required properties', () => {
    expect(mockBulbasaur).toHaveProperty('id');
    expect(mockBulbasaur).toHaveProperty('name');
    expect(mockBulbasaur).toHaveProperty('attacks.fast');
  });
});

describe('Evolution Chain Tests', () => {
  test('flattenEvolutions builds correct chain', () => {
    const chain = flattenEvolutions(mockBulbasaur);
    expect(chain.map(n => n.name)).toEqual([
      'Bulbasaur', 'Ivysaur', 'Venusaur'
    ]);
  });
});
```

**ทำไมเลือก Jest:**
- Industry standard สำหรับ JavaScript
- Built-in mocking
- Snapshot testing
- Good integration กับ Next.js

---

### Q12: "Unit Test vs Integration Test vs E2E Test ต่างกันอย่างไร?"

**ตอบ:**

| Type | Tests What | Speed | Example |
|------|-----------|-------|---------|
| Unit | Single function/component | Fast | `flattenEvolutions()` returns correct array |
| Integration | Components working together | Medium | SearchInput + API + Results |
| E2E | Full user flow | Slow | User searches → clicks result → sees card |

```typescript
// Unit Test
test('scoreMatch returns higher score for exact match', () => {
  expect(scoreMatch('pikachu', 'pikachu')).toBe(100);
  expect(scoreMatch('pikachu', 'pika')).toBeLessThan(100);
});

// Integration Test (ถ้าจะเขียน)
test('SearchInput shows results when typing', async () => {
  render(<SearchInput />);
  await userEvent.type(screen.getByRole('combobox'), 'pika');
  expect(screen.getByText('Pikachu')).toBeInTheDocument();
});

// E2E Test (ถ้าจะเขียนด้วย Playwright)
test('search flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('[role="combobox"]', 'pikachu');
  await page.click('text=Pikachu');
  await expect(page.locator('h1')).toHaveText('Pikachu');
});
```

---

## 6. CSS & Styling

### Q13: "ทำไมเลือก Tailwind CSS? มีข้อดีข้อเสียอย่างไร?"

**ตอบ:**

**ข้อดี:**
1. **Rapid development** - ไม่ต้องสลับไฟล์ CSS
2. **Consistent design** - ใช้ spacing/color scale เดียวกัน
3. **Small bundle size** - PurgeCSS ตัด unused styles
4. **No naming conflicts** - ไม่มี CSS class collision

**ข้อเสีย:**
1. **Long class strings** - อ่านยากถ้าไม่ format ดี
2. **Learning curve** - ต้องจำ utility classes
3. **Customization** - บางอย่างต้อง config เพิ่ม

**ตัวอย่างจากโปรเจกต์:**
```tsx
<button className={`
  flex items-center gap-3 
  w-full px-4 py-3 
  text-left rounded-xl 
  transition-colors duration-150
  ${isHighlighted 
    ? 'bg-accent text-accent-foreground' 
    : 'hover:bg-muted'
  }
`}>
```

**Design Tokens ใน Tailwind v4:**
```css
@theme inline {
  --font-sans: 'Inter', sans-serif;
  --color-primary: oklch(0.6 0.18 250);
}
```

---

### Q14: "CSS Flexbox vs Grid ใช้เมื่อไหร่?"

**ตอบ:**

| Flexbox | Grid |
|---------|------|
| 1 มิติ (row OR column) | 2 มิติ (row AND column) |
| Content-driven layout | Layout-driven design |
| Align items ใน container | Complex grid structures |

**ในโปรเจกต์นี้:**
```tsx
// Flexbox - ส่วนใหญ่ของ layout
<div className="flex items-center gap-3">
  <Image ... />
  <div className="flex flex-col">
    <span>Name</span>
    <span>Type</span>
  </div>
</div>

// Grid - Attack list (2 columns)
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  {attacks.map(attack => <AttackCard ... />)}
</div>
```

---

## 7. Git & Version Control

### Q15: "อธิบาย Git workflow ที่คุ้นเคย"

**ตอบ:**

**Feature Branch Workflow:**
```bash
# 1. สร้าง branch ใหม่จาก main
git checkout main
git pull origin main
git checkout -b feature/search-autocomplete

# 2. ทำงานและ commit เป็น chunks
git add components/SearchInput.tsx
git commit -m "feat: add autocomplete dropdown UI"

git add lib/usePokemonList.ts
git commit -m "feat: add fuzzy search scoring"

# 3. Push และสร้าง PR
git push origin feature/search-autocomplete

# 4. หลัง review แล้ว merge
git checkout main
git merge feature/search-autocomplete
```

**Commit Message Convention:**
```
feat: add new feature
fix: bug fix
docs: documentation only
style: formatting, no code change
refactor: code change that neither fixes bug nor adds feature
test: adding tests
chore: maintain
```

---

## 8. Problem Solving

### Q16: "อธิบายปัญหาที่ยากที่สุดที่เจอในโปรเจกต์นี้"

**ตอบ: Evolution Chain Problem**

**ปัญหา:**
GraphQL API คืนค่าเฉพาะ forward evolutions
- ค้นหา Bulbasaur → ได้ Ivysaur, Venusaur
- ค้นหา Venusaur → ได้ null (เพราะไม่มี evolution ต่อ)

**Requirement:** แสดง chain ครบไม่ว่าจะค้นหาตัวไหน

**Solution Process:**

```
1. วิเคราะห์ปัญหา
   - API limitation ไม่สามารถแก้ได้
   - ต้องหา workaround ฝั่ง client

2. Brainstorm solutions
   a) Hardcode evolution data → ไม่ดี, ไม่ scale
   b) ดึงข้อมูลทั้งหมด สร้าง lookup → เลือกอันนี้
   c) Multiple API calls ต่อ Pokemon → ช้าเกินไป

3. Implementation
   - ดึง Pokemon 151 ตัว (cached, ทำครั้งเดียว)
   - สร้าง reverse map: child → parent
   - Walk backward หา base form
   - Walk forward สร้าง complete chain

4. Optimization
   - Cache lookup map
   - Memoize chain calculation
   - Show loading state ระหว่างรอ
```

```typescript
// สร้าง reverse lookup
const reverseMap = new Map<string, string>();
allPokemon.forEach(pokemon => {
  pokemon.evolutions?.forEach(evo => {
    reverseMap.set(evo.name.toLowerCase(), pokemon.name.toLowerCase());
  });
});

// Walk backward
let baseName = currentPokemonName;
while (reverseMap.has(baseName)) {
  baseName = reverseMap.get(baseName)!;
}
// baseName ตอนนี้คือ base form (e.g., "bulbasaur")
```

---

## 9. Agile & Scrum

### Q17: "คุณเข้าใจ Scrum process อย่างไร?"

**ตอบ:**

```
Sprint Cycle (2 weeks)
┌────────────────────────────────────────────────────────┐
│                                                         │
│  Sprint Planning → Daily Standup → Sprint Review        │
│       ↓              ↓                  ↓               │
│  กำหนด tasks     15 นาที/วัน       Demo ให้ stakeholder│
│  ประเมิน story   - ทำอะไรเมื่อวาน                       │
│  points          - จะทำอะไรวันนี้    Sprint Retrospective│
│                  - มี blockers ไหม   - อะไรดี           │
│                                       - อะไรต้องปรับ    │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Story Points:** (Fibonacci)
- 1 point = งานง่าย, < 1 ชม.
- 3 points = งานปานกลาง, ครึ่งวัน
- 5 points = งานซับซ้อน, 1-2 วัน
- 8 points = งานใหญ่, อาจต้องแตกเป็น tasks ย่อย

**ถ้าประเมินโปรเจกต์นี้:**
| Task | Story Points |
|------|-------------|
| Setup project structure | 2 |
| Implement search UI | 3 |
| GraphQL integration | 3 |
| Evolution chain logic | 5 |
| Dark mode | 2 |
| Unit tests | 3 |
| **Total** | **18 points** |

---

## 10. Soft Skills Questions

### Q18: "ทำไมถึงสนใจตำแหน่งนี้?"

**แนวตอบ:**
- สนใจ Tech Stack (Next.js, TypeScript, GraphQL)
- ต้องการเรียนรู้ในทีมที่มี structured process (Scrum)
- เห็นว่าบริษัทให้ความสำคัญกับ code quality (testing, documentation)
- อยากพัฒนาทักษะ full-stack

### Q19: "จุดแข็งและจุดอ่อนของคุณคืออะไร?"

**แนวตอบ:**

**จุดแข็ง:**
- Problem-solving (อ้างอิงจาก evolution chain problem)
- Attention to detail (accessibility, edge cases)
- Self-learning (ศึกษา technologies ใหม่ได้เอง)

**จุดอ่อน:**
- ยังไม่มีประสบการณ์ทำงานในทีมใหญ่ (กำลังพัฒนา)
- บางครั้ง over-engineer solutions (ต้อง balance กับ deadlines)

### Q20: "มีคำถามอะไรอยากถามเราไหม?"

**คำถามที่ควรถาม:**
1. "Tech stack ที่ทีมใช้ตอนนี้มีอะไรบ้าง?"
2. "Code review process เป็นอย่างไร?"
3. "มี mentorship หรือ onboarding process สำหรับ junior อย่างไร?"
4. "ทีมมีขนาดเท่าไหร่? และแบ่งงานกันอย่างไร?"
5. "มี technical challenges อะไรที่ทีมกำลังแก้อยู่?"

---

# ส่วนที่ 2: Technical Deep-Dive

---

## การอธิบาย Code แต่ละส่วนโดยละเอียด

### 1. Apollo Client Setup

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://graphql-pokemon2.vercel.app',
  cache: new InMemoryCache(),
});

export default client;
```

**อธิบาย:**
- `ApolloClient` - ตัว client หลักสำหรับ GraphQL
- `uri` - endpoint ของ GraphQL server
- `InMemoryCache` - เก็บ responses ใน memory เพื่อ reuse

**ทำไมไม่ใช้ fetch ธรรมดา:**
- Apollo จัดการ caching อัตโนมัติ
- มี hooks พร้อมใช้ (useQuery, useMutation)
- Handle loading/error states
- Optimistic updates support

---

### 2. GraphQL Queries

```typescript
// lib/queries.ts
export const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      image
      types
      classification
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        name
        image
        types
        evolutions {
          id
          name
          image
          types
          evolutions {
            id
            name
            image
            types
          }
        }
      }
    }
  }
`;
```

**อธิบาย:**
- `$name: String!` - Variable ชื่อ name, type String, required (!)
- Nested `evolutions` 3 ระดับ - รองรับ evolution chain ยาวสุด
- Query เฉพาะ fields ที่ต้องการ - ลด data transfer

---

### 3. Custom Hook - useEvolutionChain

```typescript
// lib/useEvolutionChain.ts
export function useEvolutionChain(pokemon: Pokemon): UseEvolutionChainResult {
  // 1. ดึงข้อมูล Pokemon ทั้งหมด
  const { data: allPokemonData, loading: allLoading } = useQuery(GET_ALL_POKEMON_NAMES);
  
  // 2. ดึงข้อมูล base Pokemon (ถ้าจำเป็น)
  const [fetchBase, { data: baseData, loading: baseLoading }] = useLazyQuery(GET_POKEMON_BASIC);
  
  // 3. สร้าง chain
  const chain = useMemo(() => {
    if (!allPokemonData?.pokemons) return null;
    
    // สร้าง reverse lookup map
    const reverseMap = new Map<string, string>();
    const pokemonMap = new Map<string, PokemonBasic>();
    
    allPokemonData.pokemons.forEach((p: PokemonBasic) => {
      pokemonMap.set(p.name.toLowerCase(), p);
      p.evolutions?.forEach((evo) => {
        reverseMap.set(evo.name.toLowerCase(), p.name.toLowerCase());
      });
    });
    
    // หา base form
    let baseName = pokemon.name.toLowerCase();
    while (reverseMap.has(baseName)) {
      baseName = reverseMap.get(baseName)!;
    }
    
    // สร้าง chain จาก base
    const basePokemon = pokemonMap.get(baseName);
    if (!basePokemon) return null;
    
    return buildChainFromBase(basePokemon, pokemon.name);
  }, [pokemon, allPokemonData, baseData]);
  
  return { chain, loading: allLoading || baseLoading };
}
```

**Key Concepts:**
1. **useLazyQuery** - Query ที่ไม่รันทันที, รอเรียก function
2. **useMemo** - Cache calculation, รัน ใหม่เมื่อ deps เปลี่ยน
3. **Map** - O(1) lookup, เร็วกว่า array.find()

---

### 4. Search with Fuzzy Matching

```typescript
// lib/usePokemonList.ts
function scoreMatch(name: string, query: string): number {
  const lowerName = name.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match - highest score
  if (lowerName === lowerQuery) return 100;
  
  // Starts with - high score
  if (lowerName.startsWith(lowerQuery)) return 80;
  
  // Contains - medium score
  if (lowerName.includes(lowerQuery)) return 60;
  
  // Subsequence match - lower score
  let queryIndex = 0;
  for (const char of lowerName) {
    if (char === lowerQuery[queryIndex]) {
      queryIndex++;
      if (queryIndex === lowerQuery.length) return 40;
    }
  }
  
  return 0; // No match
}
```

**ตัวอย่าง:**
- `scoreMatch('pikachu', 'pikachu')` → 100 (exact)
- `scoreMatch('pikachu', 'pika')` → 80 (starts with)
- `scoreMatch('pikachu', 'kachu')` → 60 (contains)
- `scoreMatch('pikachu', 'pku')` → 40 (subsequence)
- `scoreMatch('pikachu', 'xyz')` → 0 (no match)

---

### 5. Theme System

```typescript
// components/ThemeProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    // อ่านจาก localStorage ตอน mount
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);
  
  useEffect(() => {
    // Update document class และ localStorage
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**Key Concepts:**
1. **Context API** - Share state โดยไม่ต้อง prop drilling
2. **localStorage** - Persist preference ข้าม sessions
3. **CSS Variables** - Theme colors ใน globals.css

---

### 6. Keyboard Navigation

```typescript
// components/SearchInput.tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (!isOpen) return;
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < filteredResults.length - 1 ? prev + 1 : 0
      );
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredResults.length - 1
      );
      break;
      
    case 'Enter':
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelect(filteredResults[highlightedIndex].name);
      }
      break;
      
    case 'Escape':
      setIsOpen(false);
      break;
  }
};
```

**ARIA Attributes:**
```tsx
<input
  role="combobox"
  aria-expanded={isOpen}
  aria-controls="search-listbox"
  aria-activedescendant={
    highlightedIndex >= 0 
      ? `option-${highlightedIndex}` 
      : undefined
  }
/>
```

---

# ส่วนที่ 3: เทคนิคการตอบคำถาม

---

## STAR Method สำหรับคำถาม Behavioral

**S**ituation - สถานการณ์
**T**ask - งานที่ต้องทำ
**A**ction - สิ่งที่ทำ
**R**esult - ผลลัพธ์

**ตัวอย่าง:**
> "เล่าเรื่องที่คุณแก้ปัญหายากๆ ให้ฟังหน่อย"

**S:** "ตอนทำโปรเจกต์ Pokemon Search พบว่า API คืนค่าเฉพาะ forward evolutions"

**T:** "ต้องแสดง evolution chain ครบทุกตัว ไม่ว่าจะค้นหาจากตัวไหน"

**A:** "วิเคราะห์ปัญหา, สร้าง reverse lookup map จากข้อมูลทั้งหมด, implement algorithm ที่ walk backward หา base form แล้ว walk forward สร้าง chain"

**R:** "สามารถแสดง chain ครบถ้วนได้ทุก Pokemon พร้อม highlight ตัวที่กำลังดู"

---

## สิ่งที่ควรทำระหว่างสัมภาษณ์

1. **Think out loud** - อธิบาย thought process
2. **Ask clarifying questions** - ถ้าไม่ชัดเจน
3. **Admit when you don't know** - แต่บอกว่าจะหาคำตอบอย่างไร
4. **Show enthusiasm** - แสดงความสนใจใน technology
5. **Give concrete examples** - อ้างอิงจากโปรเจกต์จริง

---

## Red Flags ที่ควรหลีกเลี่ยง

1. พูดแย่เรื่องที่ทำงานเก่า/อาจารย์/เพื่อนร่วมงาน
2. ตอบว่า "ไม่รู้" โดยไม่พยายามคิด
3. Over-confident หรือ Under-confident เกินไป
4. ไม่มีคำถามถามกลับ
5. ไม่รู้จักบริษัท/ไม่ได้ศึกษามาก่อน

---

ขอให้โชคดีกับการสัมภาษณ์!
