Проект сделан на vite+react 

по макету 
https://www.figma.com/design/0InXcSFs6vm5c01OqQEnNs/Trello-board---auto-layout-cards-(Community)?node-id=5-1008&node-type=frame&t=PELKZ6f8NCrIyM7I-0

для store используется redux, инициализирующийся из localstorage по возможности

для стилизацииBEM + css модули

перемещение todo по спискам и между списками:
-добавлен drag and drop для десктоп версий >1000px,
-и стрелками для мобильных и планшетных версий <1000px

тесты поровидились с помощью npx vitest
для тестов используется оригинальный store с заданием начального состояния

запуск производится с помощью
npm i
npm run start

github pages обновляется и выкладывается в ветку gh-pages командами
npm run build
npm run deploy
