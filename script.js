// ============ СНЕГ ============
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
let snowflakes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createSnowflakes() {
    snowflakes = [];
    const count = Math.floor(window.innerWidth / 12);
    for (let i = 0; i < count; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 1.2 + 0.4,
            drift: Math.random() * 0.6 - 0.3,
            alpha: Math.random() * 0.6 + 0.4
        });
    }
}
createSnowflakes();
window.addEventListener('resize', createSnowflakes);

function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
        ctx.fill();
        f.y += f.speed;
        f.x += f.drift;
        if (f.y > canvas.height) {
            f.y = -5;
            f.x = Math.random() * canvas.width;
        }
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
    });
    requestAnimationFrame(drawSnow);
}
drawSnow();

// ============ ТЕСТ ============
const questions = [
    {
        q: 'Как ты встречаешь Новый год?',
        a: [
            { text: '🏠 Дома с семьёй у ёлки', type: 'home' },
            { text: '🎉 На шумной вечеринке с друзьями', type: 'party' },
            { text: '🌲 В горах / на природе', type: 'nature' }
        ]
    },
    {
        q: 'Твой главный новогодний ритуал?',
        a: [
            { text: '📝 Загадать желание под бой курантов', type: 'dream' },
            { text: '🍽️ Приготовить праздничный стол', type: 'food' },
            { text: '🎁 Выбирать подарки близким', type: 'gift' }
        ]
    },
    {
        q: 'Какое чудо ты ждёшь в новом году?',
        a: [
            { text: '❤️ Встретить любовь', type: 'love' },
            { text: '💼 Успех в делах', type: 'success' },
            { text: '🌟 Исполнение заветной мечты', type: 'wish' }
        ]
    }
];

let currentQuestion = 0;
let userAnswers = [];

const screens = {
    start: document.getElementById('screen-start'),
    quiz: document.getElementById('screen-quiz'),
    tree: document.getElementById('screen-tree'),
    result: document.getElementById('screen-result')
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

function startQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    showScreen('quiz');
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('progressBar').style.width =
        ((currentQuestion) / questions.length * 100) + '%';

    const box = document.getElementById('answersBox');
    box.innerHTML = '';
    q.a.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = ans.text;
        btn.onclick = () => selectAnswer(ans.type);
        box.appendChild(btn);
    });
}

function selectAnswer(type) {
    userAnswers.push(type);
    currentQuestion++;
    if (currentQuestion < questions.length) {
        renderQuestion();
    } else {
        document.getElementById('progressBar').style.width = '100%';
        setTimeout(() => {
            showScreen('tree');
            initTreeGame();
        }, 300);
    }
}

// ============ ЁЛКА ============
const toyEmojis = ['🎁', '🔔', '🍬', '⛄', '❤️', '🌟', '🍭', '🧸'];
let placedToys = 0;
const TOTAL_TOYS = 5;
const treePositions = [
    { top: '38%', left: '50%' },
    { top: '52%', left: '32%' },
    { top: '52%', left: '68%' },
    { top: '66%', left: '40%' },
    { top: '66%', left: '60%' },
    { top: '78%', left: '50%' },
    { top: '45%', left: '42%' },
    { top: '45%', left: '58%' }
];

let availablePositions = [];

function initTreeGame() {
    placedToys = 0;
    document.getElementById('toyCount').textContent = '0';
    document.getElementById('finishBtn').classList.add('hidden');

    // Убираем старые игрушки с ёлки
    document.querySelectorAll('.toy.on-tree').forEach(t => t.remove());

    // Сброс позиций
    availablePositions = [...treePositions].sort(() => Math.random() - 0.5);

    const toysBox = document.getElementById('toysBox');
    toysBox.innerHTML = '';

    // Выбираем 6 случайных игрушек из набора
    const shuffled = [...toyEmojis].sort(() => Math.random() - 0.5).slice(0, 6);

    shuffled.forEach(emoji => {
        const toy = document.createElement('div');
        toy.className = 'toy';
        toy.textContent = emoji;
        toy.draggable = true;
        toy.addEventListener('dragstart', handleDragStart);
        toy.addEventListener('click', () => placeToy(toy));
        toysBox.appendChild(toy);
    });

    // Drag & drop на ёлку
    const tree = document.getElementById('tree');
    tree.addEventListener('dragover', e => e.preventDefault());
    tree.addEventListener('drop', handleDrop);
}

let draggedToy = null;

function handleDragStart(e) {
    draggedToy = e.target;
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedToy && !draggedToy.classList.contains('used')) {
        placeToy(draggedToy);
        draggedToy = null;
    }
}

function placeToy(toy) {
    if (toy.classList.contains('used')) return;
    if (placedToys >= TOTAL_TOYS) return;

    toy.classList.add('used');

    const pos = availablePositions[placedToys];
    const placed = document.createElement('div');
    placed.className = 'toy on-tree';
    placed.textContent = toy.textContent;
    placed.style.top = pos.top;
    placed.style.left = pos.left;
    placed.style.transform = 'translate(-50%, -50%)';

    // Лёгкий случайный поворот
    placed.style.rotate = `${Math.random() * 30 - 15}deg`;

    document.getElementById('tree').appendChild(placed);

    placedToys++;
    document.getElementById('toyCount').textContent = placedToys;

    if (placedToys >= TOTAL_TOYS) {
        document.getElementById('finishBtn').classList.remove('hidden');
        document.getElementById('star').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('star').style.animation = 'starPulse 2s ease-in-out infinite';
        }, 50);
    }
}

// ============ РЕЗУЛЬТАТ ============
const wishes = {
    home: {
        title: 'Тепло домашнего очага',
        emoji: '🏠',
        text: 'Пусть новый год принесёт в твой дом уют, тепло и тихие радости. Пусть за столом всегда собираются близкие, а в сердце живёт спокойствие.'
    },
    party: {
        title: 'Год ярких событий',
        emoji: '🎉',
        text: 'Пусть новый год будет полон встреч, смеха и неожиданных приключений! Пусть каждый день приносит повод для праздника и новых друзей.'
    },
    nature: {
        title: 'Год свежих открытий',
        emoji: '🌲',
        text: 'Пусть новый год подарит тебе вдохновение, путешествия и единение с природой. Пусть каждый рассвет будет началом чего-то прекрасного.'
    },
    dream: {
        title: 'Год исполнения желаний',
        emoji: '✨',
        text: 'Пусть загаданное под куранты обязательно сбудется! Верь в чудеса — они рядом, стоит только присмотреться.'
    },
    food: {
        title: 'Год вкусных моментов',
        emoji: '🍽️',
        text: 'Пусть жизнь будет такой же богатой и вкусной, как праздничный стол! Пусть каждый день приносит маленькие гастрономические радости и большие поводы для тостов.'
    },
    gift: {
        title: 'Год щедрости и любви',
        emoji: '🎁',
        text: 'Пусть твоя доброта возвращается к тебе сторицей! Пусть близкие радуются твоим подаркам, а ты — их улыбкам.'
    },
    love: {
        title: 'Год любви',
        emoji: '❤️',
        text: 'Пусть сердце будет открыто для чудес, а рядом окажется тот, с кем хочется встречать каждый рассвет. Любовь уже в пути!'
    },
    success: {
        title: 'Год побед',
        emoji: '💼',
        text: 'Пусть все начинания увенчаются успехом! Пусть работа приносит радость, а достижения — заслуженную гордость.'
    },
    wish: {
        title: 'Год мечты',
        emoji: '🌟',
        text: 'Самая заветная мечта уже готовится стать явью. Держи глаза открытыми — чудо может постучаться в любой момент!'
    }
};

function showResult() {
    // Комбинируем: берём основной тип (последний ответ) + добавляем нюанс
    const mainType = userAnswers[userAnswers.length - 1] || 'wish';
    const secondaryType = userAnswers[0] || 'home';

    const mainWish = wishes[mainType];
    const extraWish = wishes[secondaryType];

    document.getElementById('resultEmoji').textContent = mainWish.emoji;
    document.getElementById('resultText').innerHTML =
        `<strong>${mainWish.title}</strong><br><br>` +
        mainWish.text +
        `<br><br>А ещё — ${extraWish.text.charAt(0).toLowerCase() + extraWish.text.slice(1)}`;

    showScreen('result');
}

function restart() {
    currentQuestion = 0;
    userAnswers = [];
    showScreen('start');
}

function shareResult() {
    const text = document.getElementById('resultText').innerText;
    const shareText = `🎄 Моё новогоднее пожелание: ${text}`;

    if (navigator.share) {
        navigator.share({
            title: 'Моё новогоднее пожелание',
            text: shareText
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText)
            .then(() => alert('✨ Пожелание скопировано! Отправь его друзьям.'))
            .catch(() => alert('Не удалось скопировать. Выдели текст вручную 😊'));
    }
}
