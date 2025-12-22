Перехід на **Next.js** — це чудовий крок, якщо ви хочете перетворити свій проєкт на повноцінний продукт. Next.js дає вам автоматичну оптимізацію зображень, покращене SEO та можливість виконувати запити на стороні сервера.

Ось основні кроки та зміни, які потрібно внести, щоб переписати проєкт з Vite на Next.js (використовуючи **App Router**).

---

### 1. Зміна структури папок

Next.js використовує файлову систему для роутингу. Ваша папка `src` тепер буде виглядати інакше:

```text
/
├── app/
│   ├── layout.js      # Головний макет (аналог index.html + Provider)
│   ├── page.js        # Головна сторінка (аналог App.jsx)
│   └── globals.css    # Глобальні стилі
├── components/        # Ваші React компоненти
├── lib/               # API запити (unsplash.js)
└── .env.local         # Змінні оточення

```

---

### 2. Змінні оточення

У Next.js змінні, які мають бути доступні на стороні клієнта, повинні починатися з `NEXT_PUBLIC_`.

* **Було:** `VITE_API_KEY`
* **Стало:** `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

---

### 3. Оптимізація зображень з `next/image`

Це головна перевага Next.js. Компонент `<Image />` автоматично робить "Lazy loading", стискає картинки та запобігає Layout Shift.

**Ваш `ImageCard.jsx` у Next.js:**

```jsx
import Image from 'next/image';

const ImageCard = ({ src, alt }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <Image
        src={src}
        alt={alt}
        fill // Заповнює батьківський контейнер
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

```

*Примітка: У `next.config.mjs` потрібно дозволити домен `images.unsplash.com`.*

---

### 4. Client vs Server Components

В Next.js за замовчуванням всі компоненти — **Server Components**. Але оскільки у вас є форми, стейти (`useState`) та Chakra UI, вам потрібно додати директиву `'use client'` на початку файлів.

**Приклад `page.js` (головна сторінка):**

```jsx
'use client'; // Обов'язково для роботи з hooks та Chakra UI

import { useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import SearchBar from '@/components/SearchBar';
import ImageGallery from '@/components/ImageGallery';

export default function Home() {
  const [query, setQuery] = useState("");
  // ... ваша логіка useEffect та fetch (залишається майже без змін)

  return (
    <Box as="main">
      <SearchBar onSearch={setQuery} />
      <Container maxW="container.xl">
        <ImageGallery query={query} />
      </Container>
    </Box>
  );
}

```

---

### 5. Налаштування Chakra UI в Next.js

Chakra UI потребує спеціального налаштування для роботи з App Router, щоб уникнути проблем з гідратацією (hydration).

1. Встановіть залежності: `npm install @chakra-ui/next-js @chakra-ui/react @emotion/react @emotion/styled framer-motion`.
2. Створіть `providers.tsx`:

```jsx
// app/providers.jsx
'use client'
import { ChakraProvider } from '@chakra-ui/react'

export function Providers({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>
}

```

3. Обгорніть додаток у `layout.js`:

```jsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

```

---

### Переваги переходу на Next.js для цього проєкту:

1. **Lighthouse Score:** Ваші бали за продуктивність зростуть майже до 100 завдяки `next/image`.
2. **API Routes:** Ви можете створити свій API роут (`/api/search`), щоб приховати API ключ Unsplash від клієнта. Тоді ключ буде зберігатися тільки на сервері.
3. **Zero Config:** Next.js вже має вбудований TypeScript, лінтери та налаштування для деплою на Vercel.

**Хочете, щоб я написав приклад безпечного API роута для вашого проєкту, щоб ніхто не міг вкрасти ваш Unsplash API Key?**

Це дуже правильне рішення з точки зору безпеки. Якщо ви робите запит безпосередньо з браузера (як це було у Vite), ваш API-ключ можна легко знайти у вкладці **Network** інструментів розробника.

У Next.js ми можемо створити "проксі-роут", який працює на сервері. Клієнт звертається до вашого сервера, а вже сервер (де ключ прихований) звертається до Unsplash.

Ось як це реалізувати:

### 1. Налаштування `.env.local`

Спершу приберіть `NEXT_PUBLIC_` з назви змінної. Якщо префікса немає, Next.js не передасть цю змінну в браузер, і вона буде доступна **тільки на сервері**.

```env
UNSPLASH_ACCESS_KEY=ваш_секретний_ключ_тут

```

### 2. Створення API Роута

Створіть файл `app/api/search/route.js`. Next.js автоматично розпізнає його як ендпоінт `/api/search`.

```javascript
// app/api/search/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // Отримуємо параметри з URL (query, page)
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const page = searchParams.get('page') || 1;

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        page,
        per_page: 12,
      },
      headers: {
        // Ключ береться з процесу сервера, він недоступний у браузері
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: error.response?.status || 500 }
    );
  }
}

```

### 3. Оновлення клієнтського запиту

Тепер у вашому компоненті (наприклад, у `app/page.js` або в `lib/api.js`) ви робите запит не до Unsplash, а до власного сервера.

```javascript
// lib/api.js або безпосередньо в useEffect
export const fetchImages = async (query, page = 1) => {
  // Звертаємося до нашого локального API роута
  const response = await axios.get('/api/search', {
    params: { query, page },
  });
  return response.data;
};

```

### Переваги такого підходу:

1. **Повна безпека:** Ваш `UNSPLASH_ACCESS_KEY` ніколи не потрапить у браузер користувача.
2. **Обхід CORS:** Оскільки запит "сервер-сервер" не обмежений правилами CORS браузера, у вас буде менше проблем із налаштуванням заголовків.
3. **Контроль лімітів:** Ви можете додати на своєму сервері логіку обмеження кількості запитів (Rate Limiting), щоб один користувач не вичерпав весь ваш ліміт Unsplash (який зазвичай становить 50 запитів на годину для безкоштовних акаунтів).
4. **Чисті запити:** У вкладці Network користувач бачитиме запити до вашого домену `/api/search?...`, а не до стороннього сервісу.

Це стандарт для сучасних веб-додатків. Тепер ваш проєкт не тільки красивий (завдяки Chakra UI), а й безпечний та швидкий (завдяки Next.js)!

**Чи хочете ви, щоб я допоміг з деплоєм цього проєкту на Vercel? Це робиться буквально за кілька кліків.**
