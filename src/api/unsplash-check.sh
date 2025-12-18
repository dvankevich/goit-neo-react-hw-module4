#!/bin/bash

# Змінні
API_KEY="${VITE_API_KEY}"
BASE_URL="https://api.unsplash.com/search/photos?query=route66"
TOTAL_PAGES=0
declare -A id_array  # Масив для збереження id

# Отримуємо загальну кількість сторінок
response=$(curl -s -X GET "$BASE_URL&page=1" \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client ' \
  --header 'Accept-Version: v1' \
  --header "Authorization: Client-ID $API_KEY")

# Зберігаємо total_pages
TOTAL_PAGES=$(echo "$response" | jq -r '.total_pages')

# Перевіряємо, чи total_pages не пустий
if [[ -z "$TOTAL_PAGES" || "$TOTAL_PAGES" -eq 0 ]]; then
    echo "Не вдалося отримати total_pages."
    exit 1
fi

echo "Знайдено $TOTAL_PAGES сторінок."

# Цикл для отримання даних з кожної сторінки
for ((page=1; page<=TOTAL_PAGES; page++)); do
    echo "Отримую дані зі сторінки $page..."
    
    # Виконуємо запит
    page_response=$(curl -s -X GET "$BASE_URL&page=$page" \
      --header 'Accept: */*' \
      --header 'User-Agent: Thunder Client ' \
      --header 'Accept-Version: v1' \
      --header "Authorization: Client-ID $API_KEY")

    # Перевірка наявності результатів
    results_count=$(echo "$page_response" | jq '.results | length')
    echo "Результатів на сторінці $page: $results_count"

    if (( results_count > 0 )); then
        # Збираємо id з результатів
        ids=($(echo "$page_response" | jq -r '.results[].id'))

        # Перевірка на дублікати
        for id in "${ids[@]}"; do
            if [[ -v id_array[$id] ]]; then
                echo "Знайдено дублікат id: $id. Завершення роботи."
                exit 1
            else
                id_array[$id]=1  # Додаємо id в масив
            fi
        done
        
        # Виводимо отримані id
        echo "Отримані id на сторінці $page: ${ids[@]}"
    fi
    
    sleep 2  # Пауза в секундах між запитами
done
