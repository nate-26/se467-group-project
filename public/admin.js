document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            
            if (target.startsWith('#')) {
                document.querySelectorAll('section').forEach(section => {
                    section.classList.remove('active');
                });
                
                const section = document.querySelector(target);
                section.classList.add('active');
                
                if (target === '#orders') {
                    fetchOrdersData();
                } 
            } else {
                window.location.href = target;
            }
        });
    });

    function fetchOrdersData() {
        fetch('http://localhost:3000/api/legacy/parts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayData('orders-data', data))
            .catch(error => {
                console.error('Error fetching orders:', error);
                document.getElementById('orders-data').innerHTML = '<p>Error loading data.</p>';
            });
    }

    function displayData(containerId, data) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; 

        if (data.length === 0) {
            container.innerHTML = '<p>No data available.</p>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('min-w-full', 'bg-white', 'border', 'border-gray-300');

        const headers = Object.keys(data[0]);
        table.innerHTML = `<thead><tr>${headers.map(header => `<th class="px-4 py-2 border">${header}</th>`).join('')}</tr></thead>`;
        
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const rowHTML = document.createElement('tr');
            rowHTML.innerHTML = headers.map(header => `<td class="px-4 py-2 border">${row[header]}</td>`).join('');
            tbody.appendChild(rowHTML);
        });
        table.appendChild(tbody);
        
        container.appendChild(table);
    }

    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(hash)?.classList.add('active');
        if (hash === 'orders') fetchOrdersData();
    } else {
        document.getElementById('orders').classList.add('active');
        fetchOrdersData();
    }
});