document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            
            if (target.startsWith('#')) {
                const section = target.substring(1);
                document.querySelectorAll('section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(section)?.classList.add('active');
            } else {
                window.location.href = target;
            }
        });
    });

    const hash = window.location.hash.substring(1);
    if (hash) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(hash)?.classList.add('active');
    } else {
        document.getElementById('home')?.classList.add('active');
    }
});
