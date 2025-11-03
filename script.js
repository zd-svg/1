document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('dropArea');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');

    let score = 0;
    let timeLeft = 60;
    let gameInterval;
    let letterSpawnInterval;
    let isGameRunning = false;

    // Списки голосних та приголосних літер
    const vowels = ['А', 'Е', 'И', 'І', 'О', 'У', 'Я', 'Ю', 'Є', 'Ї'];
    const consonants = ['Б', 'В', 'Г', 'Д', 'Ж', 'З', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ'];

    function getRandomLetter() {
        const isVowel = Math.random() < 0.5; // 50% шанс на голосну або приголосну
        if (isVowel) {
            return {
                letter: vowels[Math.floor(Math.random() * vowels.length)],
                type: 'vowel'
            };
        } else {
            return {
                letter: consonants[Math.floor(Math.random() * consonants.length)],
                type: 'consonant'
            };
        }
    }

    function spawnLetter() {
        if (!isGameRunning) return;

        const { letter, type } = getRandomLetter();
        const letterElement = document.createElement('div');
        letterElement.classList.add('letter', type);
        letterElement.textContent = letter;
        
        // Випадкова початкова позиція X
        const startX = Math.random() * (dropArea.offsetWidth - 50); // 50px - ширина літери
        letterElement.style.left = `${startX}px`;
        letterElement.style.top = '0px'; // Починаємо зверху

        dropArea.appendChild(letterElement);

        let position = 0;
        const speed = Math.random() * 2 + 1; // Випадкова швидкість падіння
        const fallInterval = setInterval(() => {
            if (!isGameRunning) {
                clearInterval(fallInterval);
                letterElement.remove();
                return;
            }

            position += speed;
            letterElement.style.top = `${position}px`;

            // Якщо літера вийшла за межі dropArea
            if (position > dropArea.offsetHeight - letterElement.offsetHeight) {
                clearInterval(fallInterval);
                letterElement.remove(); // Видаляємо літеру, якщо вона впала
                // Можна додати штраф за пропущену літеру тут
            }
        }, 20); // Кожні 20 мс

        letterElement.onclick = () => {
            if (!isGameRunning) return;

            // Перевіряємо, чи клікнули на літеру
            const clickX = event.clientX;
            const dropAreaRect = dropArea.getBoundingClientRect();
            const basketWidth = document.getElementById('vowelBasket').offsetWidth;
            const basketCenterOffset = dropAreaRect.left + (dropAreaRect.width / 2);

            // Визначаємо, в який "кошик" клікнув користувач
            // Припускаємо, що лівий кошик для голосних, правий для приголосних
            // Це дуже спрощено, для реального drag-and-drop потрібна інша логіка
            const isClickInVowelBasketArea = clickX < basketCenterOffset; // Якщо клік лівіше центру dropArea
            const isClickInConsonantBasketArea = clickX >= basketCenterOffset; // Якщо клік правіше центру dropArea


            let isCorrect = false;
            if (type === 'vowel' && isClickInVowelBasketArea) {
                isCorrect = true;
            } else if (type === 'consonant' && isClickInConsonantBasketArea) {
                isCorrect = true;
            }

            if (isCorrect) {
                score++;
                letterElement.style.backgroundColor = '#28a745'; // Зелений при успіху
            } else {
                score = Math.max(0, score - 1); // Зменшити рахунок, але не менше 0
                letterElement.style.backgroundColor = '#dc3545'; // Червоний при помилці
            }
            scoreDisplay.textContent = score;

            // Швидко видаляємо літеру після кліку
            letterElement.style.transition = 'opacity 0.3s ease-out';
            letterElement.style.opacity = '0';
            setTimeout(() => letterElement.remove(), 300);
            clearInterval(fallInterval); // Зупиняємо падіння
        };
    }

    function startGame() {
        score = 0;
        timeLeft = 60;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        gameOverScreen.style.display = 'none';
        startButton.style.display = 'none';
        isGameRunning = true;

        // Очищаємо всі існуючі літери
        dropArea.innerHTML = ''; 

        gameInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);

        letterSpawnInterval = setInterval(spawnLetter, 1500); // Нова літера кожні 1.5 секунди
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
        clearInterval(letterSpawnInterval);
        
        // Видаляємо всі літери, що залишилися
        document.querySelectorAll('.letter').forEach(letter => letter.remove());

        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = 'flex';
    }

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
});