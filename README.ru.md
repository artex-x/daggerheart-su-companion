# Помощник Daggerheart.su

Бесплатный кросс-браузерный userscript для [Daggerheart.su](https://daggerheart.su/) и [русской версии сайта](https://ru.daggerheart.su/). Он добавляет рейтинги и фильтры, улучшает карточки классов и позволяет собирать выбранные карточки в локальный макет 3×3 для печати на A4.

[English README](README.md)

## Установка за пару минут

1. Установите менеджер userscript:
   - [Tampermonkey](https://www.tampermonkey.net/) для Chrome, Brave, Edge, Firefox и других поддерживаемых браузеров.
   - [Violentmonkey](https://violentmonkey.github.io/get-it/) для Chromium-браузеров и Firefox.
2. Откройте [прямую ссылку установки](https://raw.githubusercontent.com/artex-x/daggerheart-su-companion/main/daggerheart-su-companion.user.js).
3. Подтвердите установку в Tampermonkey или Violentmonkey.
4. Откройте или обновите Daggerheart.su.

Репозиторий должен оставаться публичным, чтобы прямая установка и автоматические обновления продолжали работать.

### Обновление старой установки

В metadata сохранены прежние `@name` и `@namespace`, поэтому установка версии 7.0.3 из GitHub должна заменить старую копию из Greasy Fork/Tampermonkey. После установки откройте панель userscript и убедитесь, что включена только одна копия.

## Поддерживаемые браузеры

- Chrome, Brave и Edge с Tampermonkey или Violentmonkey.
- Firefox с Tampermonkey или Violentmonkey.

Публикация в Chrome Web Store и отдельный пакет для каждого браузера не нужны.

## Возможности

- Рейтинги и поясняющие комментарии на русском и английском.
- Фильтр по рейтингу в поддерживаемых справочниках.
- Более плотные карточки классов с рабочими ссылками на правила.
- Общая локальная подборка карточек для печати.
- Предпросмотр в три колонки, перестановка и удаление карточек.
- Смешанные родословные с собственным названием и текстом особенностей.
- Печать 3×3 на A4 без рейтингов и служебных кнопок.
- Подчёркивание ограничений использования и восстановления только при печати.

## Приватность и разрешения

Userscript запускается только на `daggerheart.su` и `ru.daggerheart.su`. Три разрешения `GM_*` используются для локального хранения и синхронизации очереди печати. Аналитики, рекламы, телеметрии, удалённого исполняемого кода и сервера разработчика нет. Подробнее — в [PRIVACY.md](PRIVACY.md).

## Разработка и релиз

Устанавливаемый исходник находится в корне репозитория: `daggerheart-su-companion.user.js`.

Проверка:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
```

Подготовка текущей версии к релизу:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1
```

Одновременное повышение версии и подготовка релиза:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\prepare-release.ps1 -Version 7.0.4
```

Полная инструкция: [docs/RELEASING.md](docs/RELEASING.md).

## Лицензия

Оригинальный код распространяется по [лицензии MIT](LICENSE). Она не распространяется на правила, иллюстрации, товарные знаки, рейтинги, комментарии и содержимое сайта — подробности в [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Проект неофициальный и не связан с Darrington Press или Daggerheart.su.
