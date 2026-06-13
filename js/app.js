document.addEventListener('DOMContentLoaded', () => {
    // Set year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Search suggestions
    const flowers = ["Rose", "Orchid", "Lavender", "Tulip", "Sunflower", "Lily", "Daisy", "Chamomile", "Jasmine", "Peony"];
    const input = document.getElementById('global-search');
    const suggestions = document.getElementById('suggestions');
    const trending = document.getElementById('trending-list');

    function showSuggestions(q) {
        if (!q) { suggestions.textContent = ''; return }
        const list = flowers.filter(f => f.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
        suggestions.innerHTML = list.map(it => `<button class="suggestion">${it}</button>`).join('');
    }

    let debounce;
    input.addEventListener('input', (e) => { clearTimeout(debounce); debounce = setTimeout(() => showSuggestions(e.target.value), 120); });
    suggestions.addEventListener('click', (e) => { if (e.target.matches('.suggestion')) { input.value = e.target.textContent; suggestions.textContent = ''; } });

    // Trending quick-fill
    trending.addEventListener('click', (e) => { if (e.target.tagName === 'LI') { input.value = e.target.textContent; showSuggestions(input.value); input.focus(); } });

    // Search button
    document.getElementById('search-go').addEventListener('click', () => { alert('Searching for: ' + input.value); });

    // Newsletter
    const form = document.getElementById('newsletter-form');
    form.addEventListener('submit', (e) => { e.preventDefault(); const em = form.querySelector('#email'); em.disabled = true; e.target.querySelector('button').textContent = 'Subscribed'; setTimeout(() => { em.disabled = false; e.target.querySelector('button').textContent = 'Subscribe'; em.value = ''; alert('Thanks for subscribing!'); }, 1000) });

    // Animated counters when visible
    const counters = document.querySelectorAll('.stat .count');
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                let current = 0; const step = Math.ceil(target / 120);
                const t = setInterval(() => { current += step; if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(t); } else el.textContent = current.toLocaleString(); }, 12);
                io.unobserve(el);
            }
        })
    }, { threshold: 0.35 });
    counters.forEach(c => io.observe(c));

    // Scroll reveal for elements with .fade-in
    const reveals = document.querySelectorAll('.fade-in, .glass-card, .category-card, .flower-card, .family-card, .article-card');
    const rIO = new IntersectionObserver((entries) => { entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('reveal'); }); }, { threshold: 0.12 });
    reveals.forEach(r => rIO.observe(r));

    // Navigation search toggle
    const searchToggle = document.querySelector('.search-toggle');
    searchToggle.addEventListener('click', () => { input.focus(); window.scrollTo({ top: document.getElementById('search').offsetTop - 80, behavior: 'smooth' }) });

});
