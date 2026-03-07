const booksData = {
  "homo-sapiens": {
    title: "Homo Sapiens",
    subtitle: "A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    pages: 464,
    status: "reading",
    progress: 45,
    currentPage: 210,
    rating: 3,
    started: "January 2026",
    estimated: "2 weeks",
    synopsis: "Explores the history of humankind from the Stone Age to the modern age, examining how Homo sapiens came to dominate the world.",
    notes: [
      "Fascinating perspective on human evolution",
      "Chapter 5 particularly interesting",
      "Need to revisit cognitive revolution section"
    ]
  },
  "harry-potter": {
    title: "Harry Potter",
    subtitle: "and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasy",
    pages: 223,
    status: "completed",
    rating: 5,
    completed: "December 2025",
    synopsis: "A young wizard discovers his magical heritage and embarks on adventures at Hogwarts School of Witchcraft and Wizardry.",
    notes: [
      "Perfect introduction to the wizarding world",
      "Character development is excellent",
      "Nostalgic reread - still magical"
    ]
  },
  "lotr": {
    title: "The Lord of the Rings",
    subtitle: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    pages: 423,
    status: "to-read",
    synopsis: "Epic fantasy following Frodo Baggins' quest to destroy the One Ring and save Middle-earth from the Dark Lord Sauron.",
    notes: [
      "Added to reading queue",
      "Recommended by multiple sources",
      "Planning to read before watching films"
    ]
  },
  "monte-cristo": {
    title: "The Count of Monte Cristo",
    subtitle: "Classic Adventure",
    author: "Alexandre Dumas",
    category: "Adventure",
    pages: 1276,
    status: "completed",
    rating: 4,
    completed: "November 2025",
    synopsis: "A tale of betrayal, imprisonment, escape, and revenge set in 19th century France.",
    notes: [
      "Epic revenge story done perfectly",
      "Long but never boring",
      "The planning and execution is masterful"
    ]
  },
  "iron-king": {
    title: "The Iron King",
    subtitle: "The Accursed Kings",
    author: "Maurice Druon",
    category: "Historical Fiction",
    pages: 344,
    status: "to-read",
    synopsis: "First book in a series about the French monarchy in the 14th century, featuring political intrigue and historical drama.",
    notes: [
      "Often called 'the original Game of Thrones'",
      "Recommended for historical fiction fans",
      "Part of 7-book series"
    ]
  },
  "gaudi": {
    title: "Gaudí: A Biography",
    subtitle: "Life of a Visionary",
    author: "Gijs van Hensbergen",
    category: "Biography",
    pages: 432,
    status: "completed",
    rating: 5,
    completed: "October 2025",
    synopsis: "Comprehensive biography of Antoni Gaudí, the visionary Catalan architect behind La Sagrada Família and other masterpieces.",
    notes: [
      "Incredible insight into Gaudí's creative process",
      "Makes me want to visit Barcelona again",
      "Perfect blend of architecture and biography"
    ]
  },
  "nations-fail": {
    title: "Why Nations Fail",
    subtitle: "Origins of Power, Prosperity & Poverty",
    author: "Daron Acemoglu & James Robinson",
    category: "Economics",
    pages: 544,
    status: "to-read",
    synopsis: "Examines why some nations prosper while others fail, focusing on political and economic institutions.",
    notes: [
      "Highly recommended by economists",
      "Relevant to current global issues",
      "On reading list for Q2 2026"
    ]
  }
};

// ====================================
// FALLOUT 3 SOUND EFFECTS (Web Audio API)
// ====================================

let soundEnabled = true;
let audioContext = null;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// Typewriter sound - plays on each character
function playTypeSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.04);
  } catch (e) {
    console.log('Audio blocked:', e);
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-toggle');
  if (btn) {
    btn.innerHTML = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    btn.style.color = soundEnabled ? '#00ff00' : '#666';
  }
}

// ====================================
// TYPEWRITER EFFECT
// ====================================

function typewriterEffect(element, text, speed = 30) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '█';
    element.appendChild(cursor);
    
    const timer = setInterval(() => {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text[i]), cursor);
        
        // Sound on each character (except spaces)
        if (text[i] !== ' ') {
          playTypeSound();
        }
        
        i++;
      } else {
        cursor.remove();
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function typeAllLines(container, lines, speed = 30) {
  for (const line of lines) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'terminal-line';
    container.appendChild(lineDiv);
    
    await typewriterEffect(lineDiv, line, speed);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

// ====================================
// MODAL LOGIC
// ====================================

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('book-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('close-modal');
  const overlay = document.getElementById('modal-overlay');

  // Show book details in terminal
  async function showBookDetails(bookId) {
    const book = booksData[bookId];
    if (!book) return;

    modal.style.display = 'flex';
    overlay.style.display = 'block';
    
    modalContent.innerHTML = '';
    
    // Add sound toggle button
    const soundBtn = document.createElement('button');
    soundBtn.id = 'sound-toggle';
    soundBtn.className = 'sound-toggle-btn';
    soundBtn.innerHTML = soundEnabled ? '🔊 SOUND: ON' : '🔇 SOUND: OFF';
    soundBtn.style.color = soundEnabled ? '#00ff00' : '#666';
    soundBtn.onclick = toggleSound;
    modalContent.appendChild(soundBtn);
    
    // Terminal container
    const terminalContainer = document.createElement('div');
    terminalContainer.className = 'terminal-container';
    modalContent.appendChild(terminalContainer);
    
    // Build terminal text
    const lines = [
      '> ACCESSING LIBRARY DATABASE...',
      '> LOADING BOOK DATA...',
      '',
      `📚 ${book.title.toUpperCase()}`,
      `${book.subtitle}`,
      '',
      '>> BOOK INFORMATION',
      `Author: ${book.author}`,
      `Category: ${book.category}`,
      `Pages: ${book.pages}`,
      `Status: ${book.status.toUpperCase().replace('-', ' ')}`,
    ];
    
    // Add status-specific data
    if (book.status === 'reading') {
      lines.push('');
      lines.push('>> READING PROGRESS');
      lines.push(`Started: ${book.started}`);
      lines.push(`Current Page: ${book.currentPage}/${book.pages}`);
      lines.push(`Progress: ${book.progress}%`);
      lines.push(`Estimated Completion: ${book.estimated}`);
    }
    
    if (book.status === 'completed') {
      lines.push('');
      lines.push('>> COMPLETION INFO');
      lines.push(`Completed: ${book.completed}`);
    }
    
    // Rating
    if (book.rating) {
      lines.push('');
      lines.push('>> RATING');
      const stars = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
      lines.push(`${stars} (${book.rating}/5 stars)`);
    }
    
    // Synopsis
    lines.push('');
    lines.push('>> SYNOPSIS');
    lines.push(book.synopsis);
    
    // Personal notes
    lines.push('');
    lines.push('>> PERSONAL NOTES');
    book.notes.forEach((note, i) => {
      lines.push(`${i + 1}. ${note}`);
    });
    
    lines.push('');
    lines.push('> DATA TRANSFER COMPLETE');
    lines.push('> PRESS [ESC] OR [X] TO EXIT');
    
    // Type all lines
    await typeAllLines(terminalContainer, lines, 20);
  }

  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Add click handlers to all book cards
  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', () => {
      const bookId = card.dataset.bookId;
      showBookDetails(bookId);
    });
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});