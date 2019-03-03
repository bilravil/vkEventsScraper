# vkEventsScraper

Сервис для получения мероприятий(events) и информации о группе из API Vk.com

## Начало работы
1. Необходимо установить node версии 8+ https://nodejs.org/en/
2. Установить все сторонние модули командой `npm install` в склонированном репозитории
3. Заполнить файл **groups.csv** с url-ми vk групп.
4. Для работы сервиса необходим [токен авторизации Vk](https://vk.com/dev/access_token).
    *Пример получения токена*
    1) Открыть https://oauth.vk.com/authorize?client_id=6880141&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=offline&response_type=code&v=5.92
    2) Разрешить доступ и скопировать url
    3) Вставить скопированный url в ссылку и перейти по ней https://oauth.vk.com/access_token?client_id=6880141&client_secret=DMDL9FSxhNFSBKtnAbbh&redirect_uri=**url**
    4) Скопировать `access_token`. Открыть файл `index.js` в текстовом редакторе и вставить в поле `VK_TOKEN`.
5. Для запуска сервиса выполнить `node index.js`
6. По мере получения данных по группам, сервис выдает информацию в stdout, а после окончания работы записывает в файл **events.json**.

#### Обработка тротлинга
При получении бана от API vk в stdout будет появляться сообщение `TIMEOUT ERROR. Repeat request through 2 min`. После прохождения этого времени сервис продолжит работу.

