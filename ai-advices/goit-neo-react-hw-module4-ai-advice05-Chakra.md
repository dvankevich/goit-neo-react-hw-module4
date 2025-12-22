**Chakra UI** — це одна з найприємніших бібліотек для React. Вона базується на принципах **Tailwind CSS** (використання пропсів для стилізації), але надає вже готові, доступні (accessible) компоненти.

Ось як перетворити ваш проєкт на Chakra-стиль.

---

### 1. Встановлення

Виконайте команду у терміналі:

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion

```

### 2. Налаштування `main.jsx`

Потрібно обгорнути додаток у `Provider`:

```jsx
import { Provider } from "@/components/ui/provider" // Для Chakra v3
// АБО для v2:
// import { ChakraProvider } from '@chakra-ui/react'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider> 
      <App />
    </Provider>
  </StrictMode>
);

```

---

### 3. Оновлення компонентів

#### SearchBar (використання `Input` та `Button`)

Chakra дозволяє стилізувати елементи безпосередньо через пропси (`m` — margin, `p` — padding, `bg` — background).

```jsx
import { Box, Input, Button, HStack, Container } from "@chakra-ui/react";

const SearchBar = ({ onSearch }) => {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const query = evt.target.elements.searchTerm.value.trim();
    if (query.length < 3) return; // Тут можна додати Chakra Toast
    onSearch(query);
  };

  return (
    <Box as="header" bg="blue.600" py={4} mb={8} boxShadow="md">
      <Container maxW="container.md">
        <form onSubmit={handleSubmit}>
          <HStack spacing={3}>
            <Input
              name="searchTerm"
              placeholder="Search images..."
              bg="white"
              color="black"
              _placeholder={{ color: "gray.500" }}
            />
            <Button type="submit" colorScheme="orange" px={8}>
              Search
            </Button>
          </HStack>
        </form>
      </Container>
    </Box>
  );
};

```

#### ImageGallery (використання `SimpleGrid`)

Це "кілер-фіча" Chakra. Вам не потрібні медіа-запити в CSS — ви просто вказуєте кількість колонок для різних екранів.

```jsx
import { SimpleGrid, Box, Image, Card } from "@chakra-ui/react";

const ImageGallery = ({ images, openModal }) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} p={4}>
      {images.map((image) => (
        <Card.Root 
          key={image.id} 
          overflow="hidden" 
          onClick={() => openModal(image)}
          cursor="pointer"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.03)" }}
        >
          <Image
            src={image.urls.small}
            alt={image.alt_description}
            h="200px"
            w="100%"
            objectFit="cover"
          />
        </Card.Root>
      ))}
    </SimpleGrid>
  );
};

```

#### ImageModal (використання `Modal`)

Chakra автоматично блокує скрол body та фокусується на вікні. Вам більше не потрібно писати `document.body.style.overflow = "hidden"`.

```jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  VStack
} from "@chakra-ui/react";

const ImageModal = ({ isOpen, closeModal, img }) => {
  if (!img.urls) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>{img.alt_description || "Image Preview"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Image src={img.urls.regular} borderRadius="md" />
            <Text color="gray.600">Author: {img.user.name}</Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

```

---

### Чому Chakra UI крута для цього проекту?

| Особливість | Як це працює в Chakra |
| --- | --- |
| **Адаптивність** | Через об'єкти в пропсах: `w={{ base: "100%", md: "50%" }}`. |
| **Скрол модалки** | Керується автоматично самою бібліотекою. |
| **Теми** | Легко перемкнути весь проект на **Dark Mode** одним хуком `useColorMode`. |
| **Швидкість** | Вам майже не потрібно писати `.module.css` файли. |

### Що ще можна покращити?

Замість стандартного `Loader` (лупи), Chakra має чудовий компонент **Skeleton**. Він створює ефект "сірих прямокутників", які пульсують, поки картинки завантажуються. Це виглядає набагато дорожче.

**Бажаєте, щоб я показав, як реалізувати такий Skeleton Loader для вашої галереї?**

Використання **Skeleton** замість звичайного лоадера значно покращує "сприйняття швидкості" (perceived performance), бо користувач заздалегідь бачить структуру контенту, який ось-ось з’явиться.

Ось як реалізувати систему скелетонів для вашої галереї за допомогою **Chakra UI**.

### 1. Створення компонента `GallerySkeleton`

Нам потрібно створити сітку, яка візуально повторює вашу `ImageGallery`, але замість реальних фото відображає блоки, що пульсують.

```jsx
import { SimpleGrid, Box, Skeleton, Card } from "@chakra-ui/react";

const GallerySkeleton = ({ count = 12 }) => {
  // Створюємо масив на 12 елементів (за замовчуванням perPage = 12)
  const skeletons = Array(count).fill(0);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} p={4}>
      {skeletons.map((_, index) => (
        <Card.Root key={index} overflow="hidden" borderRadius="md">
          {/* Скелетон для самого зображення */}
          <Skeleton height="200px" />

          {/* Можна додати скелетони для тексту, якщо у вас є підписи під фото */}
          <Box p={4}>
            <Skeleton height="20px" width="80%" mb={2} />
            <Skeleton height="15px" width="40%" />
          </Box>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
};

export default GallerySkeleton;

```

---

### 2. Інтеграція в `App.jsx`

Тепер у головному компоненті ми маємо вирішити, коли показувати скелетони.

* **Новий пошук:** показуємо тільки скелетони.
* **Load More:** показуємо наявні фото + скелетони внизу (або просто скелетони замість кнопки).

```jsx
// В App.jsx
return (
  <Box className="App" ref={appRef} minH="100vh">
    <SearchBar onSearch={handleSearch} />

    {/* Відображаємо галерею, якщо є результати */}
    {results.length > 0 && (
      <ImageGallery images={results} openModal={openModal} />
    )}

    {/* ВІДОБРАЖЕННЯ СКЕЛЕТОНІВ */}
    {loading && <GallerySkeleton count={12} />}

    {/* Помилка */}
    {error && <ErrorMessage errorMsg={errorMessage} />}

    {/* Кнопка завантаження (ховаємо, коли йде завантаження) */}
    {results.length > 0 && page < totalPages && !loading && (
      <Center py={8}>
        <Button onClick={handleLoadMore} colorScheme="blue" variant="outline">
          Load more
        </Button>
      </Center>
    )}

    {/* Порожній результат */}
    {isEmtpyResults && (
      <Center p={10}>
        <Text fontSize="xl">No images found for "{query}"</Text>
      </Center>
    )}

    <ImageModal
      isOpen={imageModalIsOpen}
      closeModal={closeModal}
      img={imageModal}
    />
  </Box>
);

```

---

### Чому це рішення краще?

1. **Стабільність макета:** Скелетони мають ту саму висоту (`200px`) і ту саму сітку (`SimpleGrid`), що й реальні картки. Це запобігає "стрибкам" контенту, коли зображення завантажуються.
2. **Професійний вигляд:** Ефект пульсації (`Skeleton` в Chakra має його за замовчуванням) виглядає значно сучасніше, ніж іконка, що обертається.
3. **Контекст:** Якщо користувач натискає "Load More", скелетони з'являються відразу під уже завантаженими фото, даючи зрозуміти, куди саме додасться новий контент.

### Маленька "фішка": Скелетони всередині картки

Ви також можете додати скелетон безпосередньо в компонент `ImageCard`. Тоді, навіть коли дані від API вже прийшли, але сам файл картинки ще завантажується браузером, користувач бачитиме скелетон замість білого порожнього місця:

```jsx
import { Skeleton, Image } from "@chakra-ui/react";
import { useState } from "react";

const ImageCard = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Skeleton isLoaded={isLoaded}>
      <Image
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        h="200px"
        w="100%"
        objectFit="cover"
      />
    </Skeleton>
  );
};

```

Це зробить ваш додаток максимально "плавним".

**Чи хочете ви, щоб я допоміг налаштувати темну та світлу теми для Chakra UI, щоб користувач міг перемикати їх?**

Налаштування темної та світлої теми в **Chakra UI** — це одна з найпотужніших функцій бібліотеки. Вона дозволяє автоматично адаптувати кольори під системні налаштування користувача або дати йому можливість перемикати режим вручну.

Ось як це реалізувати.

### 1. Налаштування конфігурації (для Chakra v2/v3)

Якщо ви використовуєте **Chakra UI v3** (найновіша версія), підтримка кольорових режимів часто вже вбудована у ваш `Provider`. Якщо ж ви на **v2**, переконайтеся, що у вашому об’єкті теми (якщо ви його створювали) увімкнено `initialColorMode`.

### 2. Створення кнопки перемикання теми

Створимо окремий компонент `ThemeToggleButton`, який буде змінювати іконку залежно від поточного режиму.

```jsx
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons"; // Потрібно встановити @chakra-ui/icons

const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <IconButton
      aria-label="Toggle theme"
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      color="white" // Оскільки шапка зазвичай синя
      _hover={{ bg: "blue.500" }}
    />
  );
};

```

---

### 3. Додавання кнопки в `SearchBar`

Найкраще місце для перемикача — це шапка сайту. Оновимо ваш `SearchBar`:

```jsx
import { Box, Container, HStack, Input, Button } from "@chakra-ui/react";
import ThemeToggleButton from "./ThemeToggleButton"; // наш новий компонент

const SearchBar = ({ onSearch }) => {
  // ... логіка handleSubmit

  return (
    <Box as="header" bg={useColorModeValue("blue.600", "blue.900")} py={4}>
      <Container maxW="container.md">
        <HStack spacing={4}>
          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <HStack>
              <Input name="searchTerm" bg="white" color="black" placeholder="Search..." />
              <Button type="submit" colorScheme="orange">Search</Button>
            </HStack>
          </form>
          
          {/* Кнопка перемикання теми */}
          <ThemeToggleButton />
        </HStack>
      </Container>
    </Box>
  );
};

```

---

### 4. Адаптація кольорів у всьому додатку

Тепер найважливіше: щоб компоненти змінювали вигляд, ми використовуємо хук `useColorModeValue(lightValue, darkValue)` або спеціальні пропси.

#### Приклад для картки зображення:

```jsx
import { Card, useColorModeValue } from "@chakra-ui/react";

const ImageCard = ({ image }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card.Root bg={bgColor} border="1px solid" borderColor={borderColor}>
      {/* ... контент карти */}
    </Card.Root>
  );
};

```

#### Приклад для модального вікна:

В темному режимі модалка автоматично стане темною, але ви можете це уточнити:

```jsx
<ModalContent bg={useColorModeValue("white", "gray.800")} color={useColorModeValue("black", "white")}>

```

---

### Як це працює "під капотом"?

1. **LocalStorage:** Chakra автоматично зберігає вибір користувача в локальному сховищі браузера. Якщо він обере темну тему і оновить сторінку — вона залишиться темною.
2. **CSS Змінні:** Коли ви перемикаєте режим, Chakra змінює клас на `<body>` (наприклад, з `.chakra-ui-light` на `.chakra-ui-dark`), що оновлює всі CSS-змінні кольорів.
3. **Адаптивність зображень:** Ви навіть можете змінювати картинки залежно від теми:
```jsx
const logo = useColorModeValue("/logo-light.png", "/logo-dark.png");

```



### Порада для професіоналів: `_dark` пропс

Замість хука `useColorModeValue`, у багатьох випадках можна писати коротше прямо в пропсах:

```jsx
<Box 
  bg="white" 
  _dark={{ bg: "gray.800" }} 
  color="black" 
  _dark={{ color: "white" }}
>
  Контент
</Box>

```

Ваш проєкт тепер виглядає як сучасний SPA-додаток з повноцінною підтримкою UX! **Чи є ще щось, що ви хотіли б додати (наприклад, сортування результатів або фільтри)?**

