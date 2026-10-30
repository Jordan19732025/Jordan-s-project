/* Features + FAQ behaviour for Jordan Business Car */
document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el, i) {
            el.style.transitionDelay = (i % 4) * 80 + 'ms';
            revealObs.observe(el);
        });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll('[data-count]');
    function runCounter(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
        var duration = 1600;
        var start = null;
        function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    if (counters.length) {
        if ('IntersectionObserver' in window) {
            var cObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounter(entry.target);
                        cObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(function (c) { cObs.observe(c); });
        } else {
            counters.forEach(function (c) {
                c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || '');
            });
        }
    }

    /* ---------- FAQ accordion ---------- */
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    var searchInput = document.getElementById('faq-search');
    var filterBtns = document.querySelectorAll('.filter-btn');
    var emptyMsg = document.querySelector('.faq-empty');
    var toggleAll = document.getElementById('toggle-all');
    var activeCategory = 'all';

    function setOpen(item, open) {
        var btn = item.querySelector('.faq-question');
        var panel = item.querySelector('.faq-answer');
        item.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    }

    items.forEach(function (item, i) {
        var btn = item.querySelector('.faq-question');
        var panel = item.querySelector('.faq-answer');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'faq-panel-' + i);
        panel.id = 'faq-panel-' + i;
        btn.addEventListener('click', function () {
            setOpen(item, !item.classList.contains('open'));
            updateToggleLabel();
        });
    });

    function visibleItems() {
        return Array.prototype.filter.call(items, function (i) {
            return !i.classList.contains('hidden');
        });
    }

    function updateToggleLabel() {
        var vis = visibleItems();
        var allOpen = vis.length > 0 && vis.every(function (i) { return i.classList.contains('open'); });
        toggleAll.textContent = allOpen ? 'Collapse all' : 'Expand all';
    }

    function applyFilters() {
        var q = searchInput.value.trim().toLowerCase();
        var shown = 0;
        items.forEach(function (item) {
            var matchCat = activeCategory === 'all' || item.getAttribute('data-category') === activeCategory;
            var matchText = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
            var show = matchCat && matchText;
            item.classList.toggle('hidden', !show);
            if (show) shown++;
        });
        emptyMsg.classList.toggle('show', shown === 0);
        updateToggleLabel();
    }

    searchInput.addEventListener('input', applyFilters);

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    toggleAll.addEventListener('click', function () {
        var vis = visibleItems();
        var allOpen = vis.every(function (i) { return i.classList.contains('open'); });
        vis.forEach(function (i) { setOpen(i, !allOpen); });
        updateToggleLabel();
    });

    window.addEventListener('resize', function () {
        items.forEach(function (item) {
            if (item.classList.contains('open')) {
                var p = item.querySelector('.faq-answer');
                p.style.maxHeight = p.scrollHeight + 'px';
            }
        });
    });

    // Open first question by default
    setOpen(items[0], true);
    updateToggleLabel();
});
