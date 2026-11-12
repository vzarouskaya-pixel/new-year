// ============ МУЗЫКА ============
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.textContent = '🔇';
    } else {
        bgMusic.play().catch(e => console.log("Браузер блокирует автоплей"));
        musicBtn.textContent = '🔊';
    }
    isMusicPlaying = !isMusicPlaying;
});

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
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 0.5, speed: Math.random() * 1.2 + 0.4,
            drift: Math.random() * 0.6 - 0.3, alpha: Math.random() * 0.6 + 0.4
        });
    }
}
createSnowflakes();
window.addEventListener('resize', createSnowflakes);

function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach(f => {
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.alpha})`; ctx.fill();
        f.y += f.speed; f.x += f.drift;
        if (f.y > canvas.height) { f.y = -5; f.x = Math.random() * canvas.width; }
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
    });
    requestAnimationFrame(drawSnow);
}
drawSnow();

// ============ ТЕСТ ============
const questions = [
    { q: 'Как ты встречаешь Новый год?', a: [{ text: '🏠 Дома с семьёй у ёлки', type: 'home' }, { text: '🎉 На шумной вечеринке', type: 'party' }, { text: '🌲 В горах / на природе', type: 'nature' }] },
    { q: 'Твой главный новогодний ритуал?', a: [{ text: '📝 Загадать желание', type: 'dream' }, { text: '🍽️ Приготовить стол', type: 'food' }, { text: '🎁 Выбирать подарки', type: 'gift' }] },
    { q: 'Какое чудо ты ждёшь?', a: [{ text: '❤️ Встретить любовь', type: 'love' }, { text: '💼 Успех в делах', type: 'success' }, { text: '🌟 Исполнение мечты', type: 'wish' }] },
    { q: 'Твой любимый новогодний напиток?', a: [{ text: '🍾 Шампанское', type: 'sparkling' }, { text: '🍵 Горячий чай', type: 'tea' }, { text: '🍫 Какао с маршмеллоу', type: 'cocoa' }] },
    { q: 'Что для тебя Новый год?', a: [{ text: '🎆 Волшебство и сказка', type: 'magic' }, { text: '🤝 Время с близкими', type: 'family' }, { text: '🚀 Новые планы', type: 'future' }] }
];

let currentQuestion = 0;
let userAnswers = [];
const screens = { start: document.getElementById('screen-start'), quiz: document.getElementById('screen-quiz'), tree: document.getElementById('screen-tree'), result: document.getElementById('screen-result') };

function showScreen(name) { Object.values(screens).forEach(s => s.classList.remove('active')); screens[name].classList.add('active'); }
function startQuiz() { currentQuestion = 0; userAnswers = []; showScreen('quiz'); renderQuestion(); }

function renderQuestion() {
    const q = questions[currentQuestion];
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('progressBar').style.width = ((currentQuestion) / questions.length * 100) + '%';
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
        setTimeout(() => { showScreen('tree'); initTreeGame(); }, 300);
    }
}

// ============ ЁЛКА И УМНОЕ РАСПРЕДЕЛЕНИЕ ============
const toyEmojis = ['🎁', '🔔', '🍬', '⛄', '❤️', '🌟', '🍭', '🧸', '🎈', '🪅', '📦', '🎊', '🍏', '🍎', '🔮', '🦌'];
let placedToys = 0;
const TOTAL_TOYS = 12; // Наряжаем 12 игрушек

// Заранее подготовленные координаты для идеального распределения
// Мы делим ёлку на 3 яруса по высоте и распределяем игрушки по ширине веток
const treePositions = [
    // Верхний ярус (узкий)
    { top: '18%', left: '50%' }, 
    { top: '24%', left: '42%' }, { top: '24%', left: '58%' },
    { top: '30%', left: '50%' },
    
    // Средний ярус
    { top: '38%', left: '32%' }, { top: '38%', left: '68%' },
    { top: '46%', left: '40%' }, { top: '46%', left: '60%' },
    { top: '52%', left: '50%' },
    
    // Нижний ярус (широкий)
    { top: '62%', left: '25%' }, { top: '62%', left: '75%' },
    { top: '70%', left: '35%' }, { top: '70%', left: '65%' },
    { top: '76%', left: '50%' }
];

function initTreeGame() {
    placedToys = 0;
    document.getElementById('toyCount').textContent = '0';
    document.getElementById('finishBtn').classList.add('hidden');

    // Очищаем старые
    document.querySelectorAll('.toy.on-tree').forEach(t => t.remove());
    
    // Перемешиваем позиции, чтобы каждый раз ёлка выглядела по-новому
    const availablePositions = [...treePositions].sort(() => Math.random() - 0.5);

    const toysBox = document.getElementById('toysBox');
    toysBox.innerHTML = '';

    // Выбираем 14 случайных игрушек для лотка (чтобы был выбор)
    const shuffled = [...toyEmojis].sort(() => Math.random() - 0.5).slice(0, 14);

    shuffled.forEach(emoji => {
        const toy = document.createElement('div');
        toy.className = 'toy';
        toy.textContent = emoji;
        toy.draggable = true;
        toy.addEventListener('dragstart', handleDragStart);
        toy.addEventListener('click', () => placeToy(toy, availablePositions));
        toysBox.appendChild(toy);
    });

    const tree = document.getElementById('tree');
    tree.addEventListener('dragover', e => e.preventDefault());
    
    // Обработчик drop передает доступные позиции
    tree.addEventListener('drop', (e) => handleDrop(e, availablePositions));
}

let draggedToy = null;
function handleDragStart(e) { draggedToy = e.target; }

function handleDrop(e, availablePositions) {
    e.preventDefault();
    if (draggedToy && !draggedToy.classList.contains('used')) {
        placeToy(draggedToy, availablePositions);
        draggedToy = null;
    }
}

function placeToy(toy, availablePositions) {
    if (toy.classList.contains('used') || placedToys >= TOTAL_TOYS) return;
    
    // Берем позицию из массива по индексу
    const pos = availablePositions[placedToys];
    if (!pos) return; // На всякий случай

    toy.classList.add('used');

    const placed = document.createElement('div');
    placed.className = 'toy on-tree';
    placed.textContent = toy.textContent;
    
    // Позиционируем
    placed.style.top = pos.top;
    placed.style.left = pos.left;
    
    // Случайный легкий поворот для естественности
    placed.style.rotate = `${Math.random() * 30 - 15}deg`;

    document.getElementById('tree').appendChild(placed);

    placedToys++;
    document.getElementById('toyCount').textContent = placedToys;

    if (placedToys >= TOTAL_TOYS) {
        document.getElementById('finishBtn').classList.remove('hidden');
    }
}

// ============ ЛОГИКА РЕЗУЛЬТАТА ============
const wishes = {
    home: { t: 'Тепло домашнего очага', e: '🏠', p: 'Пусть в твоем доме всегда будет уют и тихие радости.' },
    party: { t: 'Год ярких событий', e: '🎉', p: 'Пусть жизнь будет полна встреч, смеха и неожиданных приключений!' },
    nature: { t: 'Год свежих открытий', e: '🌲', p: 'Пусть вдохновение и путешествия будут с тобой весь год.' },
    dream: { t: 'Год исполнения желаний', e: '✨', p: 'Загаданное под куранты обязательно сбудется!' },
    food: { t: 'Год вкусных моментов', e: '🍽️', p: 'Пусть жизнь будет такой же богатой и вкусной, как праздничный стол!' },
    gift: { t: 'Год щедрости и любви', e: '🎁', p: 'Пусть твоя доброта возвращается к тебе сторицей!' },
    love: { t: 'Год любви', e: '❤️', p: 'Пусть рядом окажется тот, с кем хочется встречать каждый рассвет.' },
    success: { t: 'Год побед', e: '💼', p: 'Пусть все начинания увенчаются успехом!' },
    wish: { t: 'Год мечты', e: '🌟', p: 'Самая заветная мечта уже готовится стать явью.' },
    sparkling: { t: 'Год фейерверков', e: '🍾', p: 'Пусть каждый день искрится, как бокал шампанского!' },
    tea: { t: 'Год спокойствия', e: '🍵', p: 'Пусть в душе всегда будет тепло и гармония.' },
    cocoa: { t: 'Год сладкой жизни', e: '🍫', p: 'Пусть будет больше сладких моментов и уютных вечеров.' },
    magic: { t: 'Год волшебства', e: '🎆', p: 'Пусть чудеса случаются там, где ты их совсем не ждешь.' },
    family: { t: 'Год единения', e: '🤝', p: 'Пусть близкие всегда будут рядом в нужную минуту.' },
    future: { t: 'Год великих планов', e: '🚀', p: 'Пусть цели достигаются легко, а амбиции ведут вперед!' }
};

function showResult() {
    const mainType = userAnswers[0] || 'wish';
    const subType = userAnswers[2] || 'magic';
    const vibeType = userAnswers[3] || 'cocoa';

    const main = wishes[mainType];
    const sub = wishes[subType];
    const vibe = wishes[vibeType];

    document.getElementById('resultEmoji').textContent = main.e;
    document.getElementById('resultTitle').textContent = main.t;
    document.getElementById('resultText').innerHTML = `${main.p} <br><br> А еще ${sub.p.toLowerCase()} <br><br> ${vibe.p}`;

    const finalVibe = wishes[userAnswers[4] || 'magic'];
    document.getElementById('resultBonus').textContent = `И помни: ${finalVibe.p.toLowerCase()}`;

    updateGlobalCounter();
    showScreen('result');
}

// ============ ИМИТАЦИЯ СЧЕТЧИКА ============
async function updateGlobalCounter() {
    const countElement = document.getElementById('globalCount');
    try {
        let localCount = localStorage.getItem('ny_tree_count');
        if (!localCount) localCount = Math.floor(Math.random() * 500) + 1200;
        localCount = parseInt(localCount) + 1;
        localStorage.setItem('ny_tree_count', localCount);
        countElement.textContent = localCount;
    } catch (e) {
        countElement.textContent = "1300+";
    }
}

function restart() { currentQuestion = 0; userAnswers = []; showScreen('start'); }

function shareResult() {
    const title = document.getElementById('resultTitle').innerText;
    const text = document.getElementById('resultText').innerText;
    const shareText = `🎄 Моё новогоднее пожелание: ${title}. ${text}`;

    if (navigator.share) {
        navigator.share({ title: 'Моё новогоднее пожелание', text: shareText }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText).then(() => alert('✨ Пожелание скопировано!')).catch(() => alert('Не удалось скопировать 😊'));
    }
}
