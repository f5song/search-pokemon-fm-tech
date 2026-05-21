# สคริปต์นำเสนอโปรเจกต์ Pokemon Search App
## สำหรับตำแหน่ง Full-Stack Developer

---

## 1. ภาพรวมโปรเจกต์ (Project Overview)

สวัสดีครับ/ค่ะ วันนี้ผม/ดิฉันจะนำเสนอโปรเจกต์ **Pokemon Search Application** ซึ่งเป็น Web Application ที่พัฒนาด้วย **Next.js 16**, **TypeScript**, **Apollo Client** และ **Tailwind CSS**

โปรเจกต์นี้เป็นแอปพลิเคชันค้นหาข้อมูล Pokemon โดยดึงข้อมูลจาก **GraphQL API** และแสดงผลข้อมูลต่างๆ เช่น ประเภท, ท่าโจมตี, และสายวิวัฒนาการ

---

## 2. Tech Stack ที่ใช้

### Frontend Framework
- **Next.js 16** (App Router) - เลือกใช้เพราะรองรับ Server Components, มี built-in routing, และ optimize performance ได้ดี

### State Management & Data Fetching
- **Apollo Client** - สำหรับจัดการ GraphQL queries และ caching
- **React Hooks** - Custom hooks สำหรับ logic ที่ reusable

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - สำหรับ animations ที่ smooth

### Testing
- **Jest** + **Testing Library** - Unit testing

### Type Safety
- **TypeScript** - Static type checking ตลอดทั้งโปรเจกต์

---

## 3. สถาปัตยกรรมโปรเจกต์ (Architecture)

```
โครงสร้างโฟลเดอร์:

app/
├── layout.tsx      → Root layout พร้อม ThemeProvider
├── page.tsx        → หน้าหลักที่รวม components ทั้งหมด
└── globals.css     → Design tokens และ theme variables

components/
├── SearchInput.tsx    → Search bar พร้อม autocomplete
├── PokemonCard.tsx    → การ์ดแสดงข้อมูล Pokemon
├── AttacksList.tsx    → แสดงท่าโจมตี
├── EvolutionChain.tsx → แสดงสายวิวัฒนาการ
├── TypeBadge.tsx      → Badge แสดงประเภท Pokemon
├── ThemeProvider.tsx  → Context สำหรับ Dark/Light mode
└── ...

lib/
├── apollo-client.ts   → Apollo Client configuration
├── queries.ts         → GraphQL queries
├── types.ts           → TypeScript interfaces
├── useEvolutionChain.ts → Custom hook สำหรับ evolution logic
├── usePokemonList.ts  → Custom hook สำหรับ search
└── pokemon-types.ts   → Color mapping สำหรับ Pokemon types
```

---

## 4. ฟีเจอร์หลัก (Key Features)

### 4.1 ระบบค้นหาขั้นสูง (Advanced Search)

```typescript
// ใช้ Fuzzy matching algorithm พร้อม weighted scoring
const scoreMatch = (name: string, query: string): number => {
  // Exact match = 100 คะแนน
  // Starts with = 80 คะแนน  
  // Contains = 60 คะแนน
  // Subsequence = 40 คะแนน
}
```

**สิ่งที่ทำเพิ่มจากที่กำหนด:**
- Autocomplete dropdown พร้อมรูป Pokemon และ type badges
- Keyboard navigation (Arrow keys, Enter, Escape)
- Recent searches บันทึกใน localStorage
- Debounced input 150ms เพื่อ performance
- ARIA attributes สำหรับ accessibility

### 4.2 ระบบแสดงสายวิวัฒนาการ (Evolution Chain)

**ปัญหาที่พบ:** GraphQL API คืนค่าเฉพาะ **forward evolutions** เท่านั้น
- Bulbasaur → แสดง Ivysaur, Venusaur ได้
- Venusaur → ไม่แสดงอะไรเลย (เพราะไม่มี evolution ต่อ)

**วิธีแก้ปัญหา:**
```typescript
// 1. ดึงข้อมูล Pokemon ทั้ง 151 ตัว
const { data: allPokemonData } = useQuery(GET_ALL_POKEMON_NAMES);

// 2. สร้าง reverse lookup map (ลูก → พ่อแม่)
const reverseMap = new Map<string, string>();
allPokemon.forEach(p => {
  p.evolutions?.forEach(evo => {
    reverseMap.set(evo.name.toLowerCase(), p.name.toLowerCase());
  });
});

// 3. เดินย้อนกลับหา base form
let baseName = currentName;
while (reverseMap.has(baseName)) {
  baseName = reverseMap.get(baseName)!;
}

// 4. ดึงข้อมูล base form แล้วเดินไปข้างหน้าสร้าง chain ทั้งหมด
```

**ผลลัพธ์:** ไม่ว่าจะค้นหา Pokemon ตัวไหนในสาย ก็จะแสดง chain ครบทั้งหมด พร้อม highlight ตัวที่กำลังดูอยู่

### 4.3 Design System

**Color System:**
- สร้าง color palette สำหรับ Pokemon types ทั้ง 18 ประเภท
- รองรับทั้ง Light และ Dark mode

```typescript
export const typeColors: Record<string, { light: string; dark: string }> = {
  fire: { light: 'bg-orange-500', dark: 'bg-orange-600' },
  water: { light: 'bg-blue-500', dark: 'bg-blue-600' },
  grass: { light: 'bg-green-500', dark: 'bg-green-600' },
  // ... ครบทั้ง 18 types
};
```

**Design Tokens ใน globals.css:**
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.6 0.18 250);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.95 0 0);
  /* ... */
}
```

---

## 5. การจัดการ State และ Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      App (page.tsx)                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    URL params    ┌─────────────────┐  │
│  │ SearchInput  │ ───────────────► │ useSearchParams │  │
│  └──────────────┘                  └────────┬────────┘  │
│                                             │           │
│                                             ▼           │
│                                    ┌─────────────────┐  │
│                                    │   useQuery()    │  │
│                                    │  (Apollo/GQL)   │  │
│                                    └────────┬────────┘  │
│                                             │           │
│                    ┌────────────────────────┼───────┐   │
│                    ▼                        ▼       ▼   │
│            ┌─────────────┐         ┌──────────────────┐ │
│            │ PokemonCard │         │ Loading/Error    │ │
│            └──────┬──────┘         └──────────────────┘ │
│                   │                                     │
│     ┌─────────────┼─────────────┐                      │
│     ▼             ▼             ▼                      │
│ ┌────────┐ ┌────────────┐ ┌───────────────┐           │
│ │TypeBadge│ │AttacksList │ │EvolutionChain│           │
│ └────────┘ └────────────┘ └───────────────┘           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 6. Testing Strategy

### Unit Tests ที่เขียน (12 tests):

```typescript
describe('Pokemon Data Tests', () => {
  // Required tests (3 tests)
  test('Bulbasaur should be Grass/Poison type')
  test('Charmander should be Fire type')
  test('Squirtle should be Water type')

  // Additional tests (9 tests)
  test('Pokemon should have required properties')
  test('Attacks should have name, type, and damage')
  test('Evolution chain should be complete')
  test('flattenEvolutions should build correct chain')
  test('Type colors should exist for all types')
  // ...
});
```

**ทำไมถึงเขียน test เพิ่ม:**
- ทดสอบ data structure integrity
- ทดสอบ helper functions
- ทดสอบ edge cases (Pokemon ไม่มี evolution)

---

## 7. Performance Optimizations

### 7.1 Apollo Client Caching
```typescript
const client = new ApolloClient({
  cache: new InMemoryCache(), // Cache responses
  // ลด network requests สำหรับข้อมูลที่เคยดึงแล้ว
});
```

### 7.2 React Suspense Boundaries
```tsx
<Suspense fallback={<PokemonSkeleton />}>
  <PokemonSearchContent />
</Suspense>
```
- แสดง skeleton loading ขณะรอข้อมูล
- ไม่ block entire UI

### 7.3 Debounced Search
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(inputValue);
  }, 150);
  return () => clearTimeout(timer);
}, [inputValue]);
```
- ลดจำนวน re-renders ขณะพิมพ์

---

## 8. Accessibility (a11y)

### ARIA Combobox Pattern:
```tsx
<input
  role="combobox"
  aria-expanded={isOpen}
  aria-controls="search-listbox"
  aria-activedescendant={activeId}
/>
<ul role="listbox" id="search-listbox">
  <li role="option" aria-selected={isSelected}>
    ...
  </li>
</ul>
```

### Keyboard Navigation:
- **Arrow Up/Down** - เลื่อนเลือก option
- **Enter** - เลือก option ที่ highlight
- **Escape** - ปิด dropdown

---

## 9. ความท้าทายและวิธีแก้ปัญหา

| ปัญหา | วิธีแก้ |
|-------|--------|
| GraphQL API ไม่มี reverse evolution | สร้าง reverse lookup map จากข้อมูลทั้งหมด |
| TypeScript circular type inference | เพิ่ม explicit type annotations |
| Next.js 16 useSearchParams ต้องมี Suspense | ครอบ component ด้วย Suspense boundary |
| ID ที่แสดงเป็น base64 ไม่ใช่ตัวเลข | ซ่อน ID จาก UI แต่เก็บไว้ใช้ internal |

---

## 10. สิ่งที่ทำเพิ่มเติมจากข้อกำหนด

1. **Dark Mode** พร้อม toggle และ persist ใน localStorage
2. **Autocomplete** พร้อมรูปภาพและ fuzzy search
3. **Keyboard navigation** ครบถ้วน
4. **Recent searches** history
5. **Complete evolution chain** แม้ API ไม่รองรับ
6. **Pokemon type colors** ครบ 18 ประเภท
7. **Skeleton loading** states
8. **Unit tests** 12 tests (มากกว่า 3 ที่กำหนด)
9. **Responsive design** ทุก breakpoint
10. **Accessibility** ตาม WCAG guidelines

---

## 11. สรุป

โปรเจกต์นี้แสดงให้เห็นความสามารถใน:

- **Frontend Development** - React, Next.js, TypeScript
- **State Management** - Apollo Client, React Hooks
- **API Integration** - GraphQL
- **Problem Solving** - แก้ปัญหา API limitation ด้วย reverse lookup
- **Testing** - Jest unit tests
- **UI/UX Design** - Design system, accessibility
- **Performance** - Caching, debouncing, lazy loading

ขอบคุณครับ/ค่ะ มีคำถามอะไรเพิ่มเติมไหมครับ/คะ?

---

## เวลานำเสนอแนะนำ: 10-15 นาที

**Tips:**
- Demo live app ควบคู่กับการอธิบาย
- เน้นจุดที่ทำเพิ่มจากข้อกำหนด
- อธิบาย problem-solving process โดยเฉพาะเรื่อง evolution chain
- แสดง code snippets สำคัญๆ
