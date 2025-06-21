document.addEventListener('DOMContentLoaded', () => {
    // Mouseover effect for buttons
    document.querySelectorAll('.next-btn, .prev-btn, .submit-btn').forEach(button => {
        button.addEventListener('mouseover', (e) => {
            const x = e.pageX - button.offsetLeft;
            const y = e.pageY - button.offsetTop;
            
            button.style.setProperty('--xPos', x + 'px');
            button.style.setProperty('--yPos', y + 'px');
        });
    });

    // Slider value indicator
    document.querySelectorAll('.slider').forEach(slider => {
        const valueIndicator = document.createElement('div');
        valueIndicator.className = 'rating-value';
        slider.parentElement.appendChild(valueIndicator);

        function updateValue() {
            valueIndicator.textContent = slider.value;
            valueIndicator.style.opacity = '1';
            const percent = (slider.value - slider.min) / (slider.max - slider.min);
            valueIndicator.style.left = `calc(${percent * 100}% - ${percent * 16}px)`;
        }

        slider.addEventListener('input', updateValue);
        slider.addEventListener('change', () => {
            setTimeout(() => {
                valueIndicator.style.opacity = '0';
            }, 1000);
        });
        if(slider.parentElement.querySelector('.rating-value')){
            updateValue(); 
        }
    });

    const diagnosticForm = document.getElementById('assessmentForm');
    if (diagnosticForm) {
        const slides = document.querySelectorAll('.question-slide');
        let currentSlide = 0;

        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if(slides.length > 0 && currentSlide < slides.length - 1) {
                    slides[currentSlide].classList.remove('active');
                    currentSlide++;
                    slides[currentSlide].classList.add('active');
                    updateProgress();
                }
            });
        });

        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                 if(slides.length > 0 && currentSlide > 0) {
                    slides[currentSlide].classList.remove('active');
                    currentSlide--;
                    slides[currentSlide].classList.add('active');
                    updateProgress();
                }
            });
        });

        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                showResults();
            });
        }
    
        function updateProgress() {
            const progress = document.querySelector('.progress');
            if(progress) {
                const percentage = (currentSlide / (slides.length - 1)) * 100;
                progress.style.width = `${percentage}%`;
            }

            document.querySelectorAll('.step').forEach((step, index) => {
                if (index <= currentSlide) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
        }

        function showResults() {
            const form = document.getElementById('assessmentForm');
            form.style.display = 'none';
            
            const resultsContainer = document.querySelector('.results-container');
            resultsContainer.classList.remove('hidden');
            resultsContainer.style.display = 'block';

            const ctx = document.getElementById('skillsChart');
            
            if (window.myChart) {
                window.myChart.destroy();
            }

            window.myChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Career/Future', 'Financial Literacy', 'Time Management', 'Analysis', 'Budgeting'],
                    datasets: [{
                        label: 'Your Current Level',
                        data: getFormData(),
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                        borderColor: '#7C3AED',
                        pointBackgroundColor: '#7C3AED',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#7C3AED',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#fff',
                                font: {
                                    size: 14,
                                    family: "'Poppins', sans-serif"
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            min: 0,
                            max: 5,
                            beginAtZero: true,
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#fff', font: { size: 14, family: "'Poppins', sans-serif"}},
                            ticks: { stepSize: 1, backdropColor: 'transparent', color: 'rgba(255, 255, 255, 0.7)'}
                        }
                    },
                    elements: { line: { tension: 0.4 }},
                    animation: { duration: 2000, easing: 'easeInOutQuart' }
                }
            });
            setTimeout(() => { generateRecommendations(); }, 500);
        }
    }

    function getFormData() {
        const writtenText = document.querySelector('input[name="writtenText"]').value || 3;
        const creativeWriting = document.querySelector('input[name="creativeWriting"]').value || 3;
        const unfamiliarText = document.querySelector('input[name="unfamiliarText"]').value || 3;
        
        return [
            parseInt(writtenText),
            parseInt(creativeWriting),
            parseInt(unfamiliarText),
            4, 
            3
        ];
    }

    function generateRecommendations() {
        const recommendations = [
            { title: 'Career Planning', description: 'Master the art of career planning and future goal setting with our comprehensive guide.', course: 'Career Mastery Course', icon: 'fa-briefcase', color: '#7C3AED' },
            { title: 'Financial Literacy', description: 'Develop your financial literacy skills with structured techniques and practical exercises.', course: 'Financial Success Course', icon: 'fa-chart-line', color: '#3B82F6' },
            { title: 'Time Management', description: 'Build confidence in managing your time effectively with proven strategies.', course: 'Productivity Mastery Course', icon: 'fa-clock', color: '#F59E0B' }
        ];

        const container = document.querySelector('.recommendation-cards');
        if(container) {
            container.innerHTML = '';
            
            recommendations.forEach((rec, index) => {
                const card = document.createElement('div');
                card.className = 'recommendation-card glass-effect';
                card.style.animationDelay = `${index * 0.2}s`;
                card.innerHTML = `
                    <div class="rec-icon" style="color: ${rec.color}"><i class="fas ${rec.icon}"></i></div>
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <a href="#course" class="rec-course-btn" style="background: linear-gradient(135deg, ${rec.color}, ${adjustColor(rec.color, -20)})">
                        <span>Explore ${rec.course}</span><i class="fas fa-arrow-right"></i>
                    </a>
                `;
                container.appendChild(card);
            });
        }
    }

    function adjustColor(color, amount) {
        let usePound = false;
        if (color[0] == "#") {
            color = color.slice(1);
            usePound = true;
        }
        const num = parseInt(color, 16);
        let r = (num >> 16) + amount;
        if (r > 255) r = 255; else if  (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amount;
        if (b > 255) b = 255; else if  (b < 0) b = 0;
        let g = (num & 0x0000FF) + amount;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    }
}); 