Використання `AbortController` — це професійний підхід, який дозволяє уникнути **race conditions** (стану гонитви). Це ситуація, коли перший запит (який ми вже "скасували") повертається пізніше за другий і перетирає актуальні дані.

Ось як це впровадити у ваш проєкт.

### Крок 1: Оновлення API-функції

Спочатку навчимо вашу функцію `fetchImages` приймати та обробляти сигнал скасування.

```javascript
// src/api/unsplash.js
import axios from "axios";

const apiUrl = "https://api.unsplash.com/search/photos";
const apiKey = import.meta.env.VITE_API_KEY;

// Додаємо параметр signal
export const fetchImages = async (query, page = 1, perPage = 12, signal) => {
  const response = await axios.get(apiUrl, {
    params: {
      query,
      page,
      per_page: perPage,
    },
    headers: {
      Authorization: `Client-ID ${apiKey}`,
    },
    signal, // Передаємо сигнал axios
  });
  return response.data;
};

```

---

### Крок 2: Оновлення `App.jsx`

Тепер налаштуємо створення та очищення контролера всередині `useEffect`. Коли `query` або `page` змінюються, старий запит буде автоматично скасовано.

```javascript
// src/components/App.jsx
useEffect(() => {
  if (query === "") {
    setResults([]);
    return;
  }

  // 1. Створюємо новий екземпляр контролера
  const controller = new AbortController();

  async function getImages() {
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      // 2. Передаємо signal у функцію запиту
      const apiResponse = await fetchImages(query, page, 12, controller.signal);

      setResults((prevResults) => {
        const newImages = apiResponse.results;
        const uniqueImages = newImages.filter(
          (newImg) => !prevResults.some((oldImg) => oldImg.id === newImg.id)
        );
        return [...prevResults, ...uniqueImages];
      });

      setTotalPages(apiResponse.total_pages);
    } catch (error) {
      // 3. Ігноруємо помилку, якщо запит було скасовано нами
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
        return;
      }
      
      setError(true);
      setErrorMessage(`Error occurred: ${error.message}`);
    } finally {
      // Якщо запит скасовано, setLoading(false) може не спрацювати 
      // через return вище, що в даному випадку правильно
      setLoading(false);
    }
  }

  getImages();

  // 4. Cleanup функція: спрацьовує перед наступним викликом useEffect або при розмонтуванні
  return () => {
    controller.abort();
  };
}, [query, page]);

```

> **Важливо:** Не забудьте імпортувати `axios` у файл `App.jsx`, щоб працювала перевірка `axios.isCancel(error)`.

---

### Що ми отримали в результаті?

1. **Економія трафіку та ресурсів:** Якщо користувач швидко друкує або декілька разів натискає "Load More", браузер миттєво припиняє обробку попередніх (вже непотрібних) запитів.
2. **Відсутність багів зі станом:** Ви гарантовано не отримаєте дані від "старого" пошукового запиту, які могли б змішатися з новими.
3. **Чистота коду:** Cleanup-функція в `useEffect` — це найкраще місце для таких операцій, оскільки вона гарантує відсутність витоків пам'яті.

### Маленька порада по CSS

Оскільки ми додали плавний скрол, переконайтеся, що ваш `Loader` або `LoadMoreBtn` не "стрибають". Можна додати мінімальну висоту для контейнера галереї:

```css
/* ImageGallery.module.css */
.imagesList {
  min-height: 50vh; /* Щоб сторінка не стискалася до нуля при новому пошуку */
}

```

Чи хочете ви розглянути можливість реалізації **Infinite Scroll** (нескінченного скролу), щоб фото завантажувалися самі, коли користувач доходить до низу сторінки?
