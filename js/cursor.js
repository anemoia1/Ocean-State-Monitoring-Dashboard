const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    // Updates position based on mouse move
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

const interactables = document.querySelectorAll('a, button, .clickable');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});