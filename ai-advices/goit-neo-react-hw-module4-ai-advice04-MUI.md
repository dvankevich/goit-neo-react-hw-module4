Перехід на професійну бібліотеку компонентів, таку як **Material UI (MUI)**, значно спростить роботу зі стилями, забезпечить доступність (A11y) та дасть вашому проєкту сучасний «Google-style» вигляд.

Ось покроковий план, як переписати цей проєкт на MUI.

---

### 1. Встановлення залежностей

Перш за все, потрібно встановити основні пакети MUI та іконки:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

```

---

### 2. Заміна компонентів: Від аналогів до коду

Ось таблиця відповідностей ваших компонентів до компонентів MUI:

| Ваш компонент | Компонент MUI |
| --- | --- |
| `SearchBar` | `AppBar` + `TextField` + `SearchIcon` |
| `ImageGallery` | `ImageList` |
| `ImageCard` | `ImageListItem` + `ImageListItemBar` |
| `ImageModal` | `Dialog` або `Backdrop` |
| `Loader` | `CircularProgress` або `Skeleton` |
| `LoadMoreBtn` | `Button (variant="contained")` |

---

### 3. Приклад реалізації ключових вузлів

#### SearchBar (новий вигляд)

Замість кастомних стилів використовуємо `AppBar` для закріплення шапки та `Container` для вирівнювання.

```jsx
import { AppBar, Toolbar, TextField, Button, Container, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    const query = evt.target.elements.searchTerm.value.trim();
    if (query.length < 3) return toast.error("Too short!");
    onSearch(query);
  };

  return (
    <AppBar position="sticky" sx={{ mb: 4, py: 1 }}>
      <Container maxWidth="md">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            name="searchTerm"
            variant="outlined"
            placeholder="Search images..."
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <Button type="submit" variant="contained" color="secondary" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>
      </Container>
    </AppBar>
  );
};

```

#### ImageGallery (використання ImageList)

MUI має спеціальний компонент для сіток із зображеннями, який автоматично обробляє відступи.

```jsx
import { ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const ImageGallery = ({ images, openModal }) => (
  <Container>
    <ImageList variant="masonry" cols={3} gap={12}>
      {images.map((item) => (
        <ImageListItem key={item.id} onClick={() => openModal(item)} sx={{ cursor: 'pointer' }}>
          <img src={item.urls.small} alt={item.alt_description} loading="lazy" />
          <ImageListItemBar
            title={item.user.name}
            subtitle={`Likes: ${item.likes}`}
            actionIcon={
              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  </Container>
);

```

#### ImageModal (заміна react-modal на Dialog)

`Dialog` в MUI набагато потужніший: він сам блокує скрол та має вбудовані анімації.

```jsx
import { Dialog, DialogContent, Box, Typography } from '@mui/material';

const ImageModal = ({ isOpen, closeModal, img }) => {
  if (!img.urls) return null;

  return (
    <Dialog open={isOpen} onClose={closeModal} maxWidth="lg" fullWidth>
      <DialogContent sx={{ textAlign: 'center', p: 0, bgcolor: '#000' }}>
        <Box
          component="img"
          src={img.urls.regular}
          alt={img.alt_description}
          sx={{ width: '100%', height: 'auto', maxHeight: '85vh', display: 'block' }}
        />
        <Box sx={{ p: 2, color: 'white' }}>
          <Typography variant="h6">{img.alt_description || "Untitled"}</Typography>
          <Typography variant="body2">By {img.user.name}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

```

---

### 4. Альтернативи: Що обрати у 2025 році?

Хоча **MUI** — це стандарт для корпоративних застосунків, існують інші круті бібліотеки:

1. **Tailwind CSS + Shadcn/ui (Рекомендація №1):**
* *Чому:* Це найпопулярніший вибір сьогодні. Ви не встановлюєте велику бібліотеку, а "копіюєте" код компонентів до себе. Це дає повний контроль над дизайном.


2. **Chakra UI:**
* *Чому:* Набагато простіша за MUI у вивченні, дуже гнучка і має чудову підтримку темної теми "з коробки".


3. **Mantime:**
* *Чому:* Величезна кількість готових хуків та компонентів (більше ніж у MUI), дуже продуктивна.



### Чому MUI кращий за кастомний CSS у цьому проєкті?

* **Responsive за 2 секунди:** Ви просто пишете `cols={{ xs: 1, sm: 2, md: 3 }}` і сітка адаптується.
* **Skeleton Screens:** Замість крутилки (Loader) можна показати сірі блоки, що імітують картинки, які завантажуються (це виглядає набагато професійніше).
* **Теми:** Ви можете змінити колір всього проєкту (наприклад, зробити його темним), змінивши лише один параметр у `ThemeProvider`.

**Хочете, щоб я показав, як додати Skeleton Loader (ефект очікування) замість вашої іконки з лупою?**
