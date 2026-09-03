let cards = JSON.parse(localStorage.getItem("flashcards")) || [
    {
        question: "What does HTML stand for?",
        answer: "HyperText Markup Language",
        category: "HTML",
        favorite: false,
        difficult: false
    },
    {
        question: "What is CSS used for?",
        answer: "CSS is used to style web pages.",
        category: "CSS",
        favorite: false,
        difficult: false
    },
    {
        question: "What is JavaScript?",
        answer: "JavaScript makes websites interactive.",
        category: "JavaScript",
        favorite: false,
        difficult: false
    },
    {
        question: "What is the capital of India?",
        answer: "New Delhi",
        category: "General",
        favorite: false,
        difficult: false
    }
];

let index = 0;
let filtered = cards;

let quizIndex = 0;
let quizScore = 0;
let timerValue = 15;
let timerInterval;


/* ELEMENTS */

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const answerBox = document.getElementById("answerBox");
const badge = document.getElementById("categoryBadge");

const showBtn = document.getElementById("showAnswer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const search = document.getElementById("search");
const category = document.getElementById("category");

const favoriteBtn = document.getElementById("favoriteBtn");
const difficultBtn = document.getElementById("difficultBtn");
const speakBtn = document.getElementById("speakBtn");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const cardCount = document.getElementById("cardCount");

const toast = document.getElementById("toast");


/* SAVE */

function save() {
    localStorage.setItem("flashcards", JSON.stringify(cards));
}


/* SHOW CARD */

function showCard() {

    if (filtered.length === 0) {

        question.textContent = "No cards found";
        answer.textContent = "";
        badge.textContent = "";
        progressText.textContent = "No cards";
        cardCount.textContent = "0 Cards";
        progressBar.style.width = "0%";

        return;
    }

    if (index >= filtered.length) {
        index = filtered.length - 1;
    }

    if (index < 0) {
        index = 0;
    }

    const card = filtered[index];

    question.textContent = card.question;
    answer.textContent = card.answer;
    badge.textContent = card.category;

    answerBox.classList.add("hidden");

    showBtn.innerHTML =
        '<i class="fa-solid fa-eye"></i> Show Answer';

    favoriteBtn.textContent =
        card.favorite ? "❤️" : "♡";

    difficultBtn.textContent =
        card.difficult ? "⭐" : "☆";

    progressText.textContent =
        `Card ${index + 1} of ${filtered.length}`;

    cardCount.textContent =
        `${filtered.length} Cards`;

    progressBar.style.width =
        `${((index + 1) / filtered.length) * 100}%`;

    updateDashboard();
}


/* SHOW / HIDE ANSWER */

showBtn.onclick = () => {

    answerBox.classList.toggle("hidden");

    if (answerBox.classList.contains("hidden")) {

        showBtn.innerHTML =
            '<i class="fa-solid fa-eye"></i> Show Answer';

    } else {

        showBtn.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i> Hide Answer';
    }
};


/* NEXT */

nextBtn.onclick = () => {

    if (filtered.length === 0) return;

    if (index < filtered.length - 1) {

        index++;
        showCard();

    } else {

        message("🎉 Last card reached!");
    }
};


/* PREVIOUS */

prevBtn.onclick = () => {

    if (filtered.length === 0) return;

    if (index > 0) {

        index--;
        showCard();

    } else {

        message("First card reached");
    }
};


/* SEARCH */

search.oninput = filterCards;
category.onchange = filterCards;

function filterCards() {

    const text = search.value.toLowerCase();

    filtered = cards.filter(card => {

        const questionMatch =
            card.question.toLowerCase().includes(text);

        const categoryMatch =
            category.value === "All" ||
            card.category === category.value;

        return questionMatch && categoryMatch;
    });

    index = 0;

    showCard();
}


/* SHUFFLE */

document.getElementById("shuffleBtn").onclick = () => {

    if (filtered.length === 0) {
        message("No cards to shuffle");
        return;
    }

    filtered.sort(() => Math.random() - 0.5);

    index = 0;

    showCard();

    message("🔀 Cards shuffled!");
};


/* FAVORITE */

favoriteBtn.onclick = () => {

    if (filtered.length === 0) return;

    const card = filtered[index];

    card.favorite = !card.favorite;

    save();
    showCard();

    if (card.favorite) {
        message("❤️ Added to favorites");
    } else {
        message("Removed from favorites");
    }
};


/* DIFFICULT */

difficultBtn.onclick = () => {

    if (filtered.length === 0) return;

    const card = filtered[index];

    card.difficult = !card.difficult;

    save();
    showCard();

    if (card.difficult) {
        message("⭐ Marked as difficult");
    } else {
        message("Difficulty removed");
    }
};


/* FAVORITE FILTER */

document.getElementById("favoriteFilter").onclick = () => {

    filtered = cards.filter(card => card.favorite);

    index = 0;

    showCard();

    if (filtered.length === 0) {
        message("No favorite cards yet ❤️");
    } else {
        message("❤️ Showing favorite cards");
    }
};


/* DIFFICULT FILTER */

document.getElementById("difficultFilter").onclick = () => {

    filtered = cards.filter(card => card.difficult);

    index = 0;

    showCard();

    if (filtered.length === 0) {
        message("No difficult cards yet ⭐");
    } else {
        message("⭐ Showing difficult cards");
    }
};


/* TEXT TO SPEECH */

speakBtn.onclick = () => {

    if (filtered.length === 0) return;

    speechSynthesis.cancel();

    const text =
        question.textContent + ". " +
        answer.textContent;

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;

    speechSynthesis.speak(speech);
};


/* ADD CARD */

document.getElementById("addBtn").onclick = () => {

    const q =
        document.getElementById("questionInput")
        .value.trim();

    const a =
        document.getElementById("answerInput")
        .value.trim();

    const c =
        document.getElementById("categoryInput")
        .value;

    if (!q || !a) {

        message("Enter question and answer");

        return;
    }

    cards.push({
        question: q,
        answer: a,
        category: c,
        favorite: false,
        difficult: false
    });

    save();

    document.getElementById("questionInput").value = "";
    document.getElementById("answerInput").value = "";

    filtered = cards;
    index = cards.length - 1;

    showCard();

    message("➕ Flashcard added!");
};


/* EDIT CARD */

document.getElementById("editBtn").onclick = () => {

    if (filtered.length === 0) {
        message("No card selected");
        return;
    }

    const q =
        document.getElementById("questionInput")
        .value.trim();

    const a =
        document.getElementById("answerInput")
        .value.trim();

    const c =
        document.getElementById("categoryInput")
        .value;

    if (!q || !a) {

        message("Enter question and answer");

        return;
    }

    const card = filtered[index];

    card.question = q;
    card.answer = a;
    card.category = c;

    save();

    showCard();

    message("✏️ Flashcard updated!");
};


/* DELETE CARD */

document.getElementById("deleteBtn").onclick = () => {

    if (filtered.length === 0) {
        message("No card selected");
        return;
    }

    const card = filtered[index];

    cards = cards.filter(c => c !== card);

    save();

    filtered = cards;

    if (index >= filtered.length) {
        index = filtered.length - 1;
    }

    if (index < 0) {
        index = 0;
    }

    showCard();

    message("🗑️ Flashcard deleted!");
};


/* DASHBOARD */

function updateDashboard() {

    document.getElementById("totalCards").textContent =
        cards.length;

    document.getElementById("favoriteCount").textContent =
        cards.filter(card => card.favorite).length;

    document.getElementById("difficultCount").textContent =
        cards.filter(card => card.difficult).length;

    document.getElementById("score").textContent =
        quizScore;
}


/* QUIZ MODE */

document.getElementById("quizBtn").onclick = () => {

    if (cards.length === 0) {

        message("No cards available");

        return;
    }

    document.getElementById("quizBox")
        .classList.remove("hidden");

    quizIndex = 0;
    quizScore = 0;

    updateDashboard();

    startQuiz();
};


/* START QUIZ */

function startQuiz() {

    clearInterval(timerInterval);

    if (quizIndex >= cards.length) {

        finishQuiz();

        return;
    }

    const card = cards[quizIndex];

    document.getElementById("quizQuestion")
        .textContent = card.question;

    document.getElementById("quizAnswer")
        .value = "";

    document.getElementById("quizResult")
        .textContent = "";

    startTimer();
}


/* TIMER */

function startTimer() {

    clearInterval(timerInterval);

    timerValue = 15;

    document.getElementById("timer")
        .textContent = timerValue;

    timerInterval = setInterval(() => {

        timerValue--;

        document.getElementById("timer")
            .textContent = timerValue;

        if (timerValue <= 0) {

            clearInterval(timerInterval);

            message("⏰ Time's up!");

            quizIndex++;

            if (quizIndex < cards.length) {

                startQuiz();

            } else {

                finishQuiz();
            }
        }

    }, 1000);
}


/* SUBMIT QUIZ */

document.getElementById("submitQuiz").onclick = () => {

    if (quizIndex >= cards.length) {

        finishQuiz();

        return;
    }

    clearInterval(timerInterval);

    const userAnswer =
        document.getElementById("quizAnswer")
        .value.trim()
        .toLowerCase();

    const correctAnswer =
        cards[quizIndex].answer
        .trim()
        .toLowerCase();

    if (userAnswer === correctAnswer) {

        quizScore++;

        document.getElementById("quizResult")
            .textContent = "✅ Correct!";

    } else {

        document.getElementById("quizResult")
            .textContent =
            `❌ Correct answer: ${cards[quizIndex].answer}`;
    }

    quizIndex++;

    updateDashboard();

    setTimeout(() => {

        if (quizIndex < cards.length) {

            startQuiz();

        } else {

            finishQuiz();
        }

    }, 1200);
};


/* FINISH QUIZ */

function finishQuiz() {

    clearInterval(timerInterval);

    document.getElementById("quizQuestion")
        .textContent = "🎉 Quiz Completed!";

    document.getElementById("quizAnswer")
        .value = "";

    document.getElementById("quizResult")
        .textContent =
        `🏆 Your Score: ${quizScore}/${cards.length}`;

    updateDashboard();

    message(`🏆 Score: ${quizScore}/${cards.length}`);
}


/* DARK MODE */

document.getElementById("themeBtn").onclick = () => {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    document.getElementById("themeBtn").innerHTML =
        dark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
};


/* KEYBOARD CONTROLS */

document.addEventListener("keydown", event => {

    if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "SELECT"
    ) {
        return;
    }

    if (event.key === "ArrowRight") {

        nextBtn.click();
    }

    if (event.key === "ArrowLeft") {

        prevBtn.click();
    }

    if (event.code === "Space") {

        event.preventDefault();

        showBtn.click();
    }
});


/* TOAST */

function message(text) {

    toast.textContent = text;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);
}


/* START APP */

showCard();
