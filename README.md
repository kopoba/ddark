# Dark Theme Switcher Browser Extension

A browser extension that applies custom dark themes to backorder.ru and expired.ru websites. Compatible with both Firefox and Chrome using Manifest V3.

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)

## Donate / Поддержи проект

![T-bank](icons/tbank.jpg) | ![USDT TRC20](icons/usdt.png)

## Features

- 🌙 Dark theme support for backorder.ru and expired.ru
- 🔄 Toggle themes individually for each site
- 🌐 Option to enable dark theme on all supported sites at once
- 🎨 Clean, customizable CSS-based themes
- 💾 Remembers your theme preferences
- 🔄 Full cross-browser compatibility (Firefox and Chrome)
- 🔒 Uses modern Manifest V3 architecture

## Usage

After installation, you'll see the extension icon in your browser toolbar:

1. Click the extension icon to open the popup menu
2. Use the toggles to enable/disable dark theme for specific sites
3. Use the "All Sites" toggle to enable/disable dark theme for all supported sites at once

## Installation Instructions

### Firefox
1. Download the extension files
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on..."
5. Select the `manifest.json` file from the extension directory

### Chrome
1. Download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the extension directory with the manifest.json file

## Technical Details

### Cross-Browser Manifest V3 Implementation

This extension uses a dual-background approach to ensure compatibility with both Firefox and Chrome:

- **Universal Manifest**: Combined background configurations for both browsers
- **Firefox Compatibility**: Uses both background.scripts for compatibility
- **Chrome Compatibility**: Supports service_worker for Chrome

### Background Script Architecture

To accommodate differences in how Firefox and Chrome handle Manifest V3:

- `background.js`: Used by Firefox for promise-based APIs
- `background-worker.js`: Used by Chrome for its service worker implementation
- Both scripts provide identical functionality

### CSS Implementation

The extension uses external CSS files instead of injecting inline styles:

- CSS is applied by appending to the document.head
- This ensures styles are applied after the site's own styles
- Each site has its own dedicated CSS file for better organization

### Extension Files

- `manifest.json` - Universal manifest file with configurations for both browsers
- `background.js` - Background script for Firefox
- `background-worker.js` - Service worker for Chrome
- `content.js` - Content script that applies CSS themes
- `popup.html/js` - User interface for controlling the extension
- `css/` - Directory containing site-specific dark themes
- `browser-polyfill.js` - Compatibility layer for cross-browser support

---

# Расширение Dark Theme Switcher для браузера

Расширение для браузеров Firefox и Chrome, которое применяет пользовательские темные темы к сайтам backorder.ru и expired.ru. Использует современный Manifest V3.

## Особенности

- 🌙 Поддержка темной темы для backorder.ru и expired.ru
- 🔄 Возможность включать/выключать темную тему отдельно для каждого сайта
- 🌐 Опция для включения темной темы на всех поддерживаемых сайтах одновременно
- 🎨 Чистые, настраиваемые темы на основе CSS
- 💾 Запоминает ваши настройки тем
- 🔄 Полная кросс-браузерная совместимость (Firefox и Chrome)
- 🔒 Использует современную архитектуру Manifest V3

## Инструкции по установке

### Firefox
1. Скачайте файлы расширения
2. Откройте Firefox и перейдите на `about:debugging`
3. Нажмите "Этот Firefox" в боковой панели
4. Нажмите "Загрузить временное дополнение..."
5. Выберите файл `manifest.json` из директории расширения

### Chrome
1. Скачайте файлы расширения
2. Откройте Chrome и перейдите на `chrome://extensions/`
3. Включите "Режим разработчика" (переключатель в правом верхнем углу)
4. Нажмите "Загрузить распакованное расширение"
5. Выберите директорию с файлом manifest.json

## Технические детали

### Кросс-браузерная реализация Manifest V3

Это расширение использует двойной фоновый подход для обеспечения совместимости с Firefox и Chrome:

- **Универсальный манифест**: Комбинированные конфигурации фона для обоих браузеров
- **Совместимость с Firefox**: Использует background.scripts для совместимости
- **Совместимость с Chrome**: Поддерживает service_worker для Chrome

### Архитектура фоновых скриптов

Для учета различий в обработке Manifest V3 в Firefox и Chrome:

- `background.js`: Используется Firefox для API на основе промисов
- `background-worker.js`: Используется Chrome для реализации сервис-воркера
- Оба скрипта обеспечивают идентичную функциональность

### Реализация CSS

Расширение использует внешние CSS-файлы вместо встраивания стилей:

- CSS применяется путем добавления в конец document.head
- Это гарантирует, что стили применяются после собственных стилей сайта
- Каждый сайт имеет свой собственный выделенный CSS-файл для лучшей организации