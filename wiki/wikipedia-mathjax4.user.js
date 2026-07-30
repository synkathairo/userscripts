// ==UserScript==
// @name         Wikipedia with MathJax 4
// @namespace    github.com/synkathairo/userscripts
// @version      1.1.1
// @license      MIT
// @description  Replaces Wikipedia math images with MathJax 4 CHTML rendering.
// @author       synkathairo
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/synkathairo/userscripts/refs/heads/main/wiki/wikipedia-mathjax4.user.js
// ==/UserScript==

(function() {
    'use strict';

    const mathImages = document.querySelectorAll(
        'img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display'
    );

    if (mathImages.length === 0) {
        return;
    }

    // Adjust MathJax math sizing to better match surrounding text
    const style = document.createElement('style');
    style.textContent = `
        mjx-container[jax="CHTML"] {
            /*font-size-adjust: ex-height from-font;*/
            font-size-adjust: 0.5;
        }
    `;
    document.head.appendChild(style);

    // Configure MathJax 4
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']]
        },
        chtml: {
            matchFontHeight: true
        }
    };

    // Load MathJax 4
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js';
    script.id = 'MathJax-script';
    script.async = true;
    document.head.appendChild(script);

    // Replace Wikipedia's math images with TeX source
    mathImages.forEach(img => {
        const latex = img.alt;
        const isInline = img.classList.contains(
            'mwe-math-fallback-image-inline'
        );

        const mathElement = document.createElement(isInline ? 'span' : 'div');

        mathElement.textContent = isInline
            ? `\\(${latex}\\)`
            : `\\[${latex}\\]`;

        img.parentNode.replaceChild(mathElement, img);
    });
})();
