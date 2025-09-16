// Property data array - Initially empty for CEO to add their own data
let properties = [];

// Sample data for transactions (initially empty)
let transactions = [];

// Sample data for contacts (initially empty)
let contacts = [];

// Sample data for finances (initially empty)
let finances = [];

// DOM Elements
const propertyModal = document.getElementById('property-modal');
const loginModal = document.getElementById('login-modal');
const dashboardModal = document.getElementById('dashboard-modal');
const addPropertyModal = document.getElementById('add-property-modal');
const addTransactionModal = document.getElementById('add-transaction-modal');
const addContactModal = document.getElementById('add-contact-modal');
const addFinanceModal = document.getElementById('add-finance-modal');

// Close buttons
const closeButtons = document.querySelectorAll('.close, .close-login, .close-dashboard, .close-add-property, .close-add-transaction, .close-add-contact, .close-add-finance');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load properties
    loadProperties();
    
    // Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Login link event listener
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'block';
        });
    }
    
    // Modal close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            propertyModal.style.display = 'none';
            loginModal.style.display = 'none';
            dashboardModal.style.display = 'none';
            addPropertyModal.style.display = 'none';
            addTransactionModal.style.display = 'none';
            addContactModal.style.display = 'none';
            addFinanceModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === propertyModal) {
            propertyModal.style.display = 'none';
        }
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === dashboardModal) {
            dashboardModal.style.display = 'none';
        }
        if (event.target === addPropertyModal) {
            addPropertyModal.style.display = 'none';
        }
        if (event.target === addTransactionModal) {
            addTransactionModal.style.display = 'none';
        }
        if (event.target === addContactModal) {
            addContactModal.style.display = 'none';
        }
        if (event.target === addFinanceModal) {
            addFinanceModal.style.display = 'none';
        }
    });
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple validation (in a real app, this would be server-side)
            if (username === 'ceo' && password === 'password123') {
                loginModal.style.display = 'none';
                dashboardModal.style.display = 'block';
                loadDashboardData();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }
    
    // Search functionality for public properties
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchProperties(searchInput.value);
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchProperties(searchInput.value);
            }
        });
    }
    
    // Dashboard navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Property type change - show/hide house-specific fields
    const propertyType = document.getElementById('property-type');
    const houseFields = document.getElementById('house-fields');
    
    if (propertyType) {
        propertyType.addEventListener('change', function() {
            if (this.value === 'land') {
                houseFields.style.display = 'none';
            } else {
                houseFields.style.display = 'block';
            }
        });
    }
    
    // Add property form
    const addPropertyForm = document.getElementById('add-property-form');
    if (addPropertyForm) {
        addPropertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addProperty();
        });
    }
    
    // Add property button
    const addPropertyBtn = document.getElementById('add-property-btn');
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', function() {
            addPropertyModal.style.display = 'block';
        });
    }
    
    // Add transaction button
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', function() {
            addTransactionModal.style.display = 'block';
        });
    }
    
    // Add contact button
    const addContactBtn = document.getElementById('add-contact-btn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', function() {
            addContactModal.style.display = 'block';
        });
    }
    
    // Add finance button
    const addFinanceBtn = document.getElementById('add-finance-btn');
    if (addFinanceBtn) {
        addFinanceBtn.addEventListener('click', function() {
            addFinanceModal.style.display = 'block';
        });
    }
    
    // Add transaction form
    const addTransactionForm = document.getElementById('add-transaction-form');
    if (addTransactionForm) {
        addTransactionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addTransaction();
        });
    }
    
    // Add contact form
    const addContactForm = document.getElementById('add-contact-form');
    if (addContactForm) {
        addContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addContact();
        });
    }
    
    // Add finance form
    const addFinanceForm = document.getElementById('add-finance-form');
    if (addFinanceForm) {
        addFinanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addFinance();
        });
    }
    
    // Search functionality in dashboard
    setupDashboardSearch();
});

// Setup search functionality for dashboard tables
function setupDashboardSearch() {
    // Property search
    const propertySearchBtn = document.getElementById('property-search-btn');
    const propertySearchInput = document.getElementById('property-search');
    
    if (propertySearchBtn && propertySearchInput) {
        propertySearchBtn.addEventListener('click', function() {
            searchPropertiesTable(propertySearchInput.value);
        });
        
        propertySearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchPropertiesTable(propertySearchInput.value);
            }
        });
    }
    
    // Transaction search
    const transactionSearchBtn = document.getElementById('transaction-search-btn');
    const transactionSearchInput = document.getElementById('transaction-search');
    
    if (transactionSearchBtn && transactionSearchInput) {
        transactionSearchBtn.addEventListener('click', function() {
            searchTransactionsTable(transactionSearchInput.value);
        });
        
        transactionSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchTransactionsTable(transactionSearchInput.value);
            }
        });
    }
    
    // Contact search
    const contactSearchBtn = document.getElementById('contact-search-btn');
    const contactSearchInput = document.getElementById('contact-search');
    
    if (contactSearchBtn && contactSearchInput) {
        contactSearchBtn.addEventListener('click', function() {
            searchContactsTable(contactSearchInput.value);
        });
        
        contactSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchContactsTable(contactSearchInput.value);
            }
        });
    }
    
    // Finance search
    const financeSearchBtn = document.getElementById('finance-search-btn');
    const financeSearchInput = document.getElementById('finance-search');
    
    if (financeSearchBtn && financeSearchInput) {
        financeSearchBtn.addEventListener('click', function() {
            searchFinancesTable(financeSearchInput.value);
        });
        
        financeSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchFinancesTable(financeSearchInput.value);
            }
        });
    }
}

// Load properties into the grid
function loadProperties() {
    const container = document.getElementById('properties-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if there are properties
    if (properties.length === 0) {
        container.innerHTML = '<p class="no-properties">No properties available. Please add properties through the CEO dashboard.</p>';
        return;
    }
    
    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        
        // Use default image if no photos provided
        const imageUrl = property.photos && property.photos.length > 0 ? 
            property.photos[0] : 
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
        
        propertyCard.innerHTML = `
            <div class="property-image" style="background-image: url('${imageUrl}')"></div>
            <div class="property-info">
                <h3>${property.name}</h3>
                <p><strong>Location:</strong> ${property.place}</p>
                <p><strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
                ${property.type !== 'land' ? `<p><strong>Details:</strong> ${property.bedrooms || 0} Bedrooms, ${property.bathrooms || 0} Bathrooms</p>` : ''}
                <div class="property-price">$${property.price ? property.price.toLocaleString() : '0'}</div>
                <a href="#" class="view-details" data-id="${property.id}">View Details</a>
            </div>
        `;
        container.appendChild(propertyCard);
    });
    
    // Add event listeners to view details links
    document.querySelectorAll('.view-details').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            showPropertyDetails(id);
        });
    });
}

// Show property details in modal
function showPropertyDetails(id) {
    const property = properties.find(p => p.id === id);
    if (!property) {
        alert('Property not found');
        return;
    }
    
    const detailContent = document.getElementById('property-detail-content');
    if (!detailContent) return;
    
    // Use default image if no photos provided
    const mainImageUrl = property.photos && property.photos.length > 0 ? 
        property.photos[0] : 
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
    
    // Create photos gallery with better styling and functionality
    let photosHtml = '';
    if (property.photos && property.photos.length > 0) {
        photosHtml = `
            <div class="media-grid">
                ${property.photos.map((photo, index) => `
                    <div class="media-item">
                        <img src="${photo}" alt="Property photo ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;" onclick="enlargeImage('${photo}')">
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        photosHtml = '<p>No photos available for this property.</p>';
    }
    
    // Create videos gallery with better styling and functionality
    let videosHtml = '';
    if (property.videos && property.videos.length > 0) {
        videosHtml = `
            <div class="media-grid">
                ${property.videos.map((video, index) => `
                    <div class="media-item">
                        <video controls style="width: 100%; height: 100%; object-fit: cover;">
                            <source src="${video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        videosHtml = '<p>No videos available for this property.</p>';
    }
    
    detailContent.innerHTML = `
        <div class="property-detail-image" style="background-image: url('${mainImageUrl}')"></div>
        <div class="property-detail-info">
            <h2>${property.name}</h2>
            <p><strong>Location:</strong> ${property.place}</p>
            <p><strong>Contact:</strong> ${property.phoneNumber}</p>
            <p><strong>Property Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
            ${property.type !== 'land' ? `
                <p><strong>Bedrooms:</strong> ${property.bedrooms || 'N/A'}</p>
                <p><strong>Bathrooms:</strong> ${property.bathrooms || 'N/A'}</p>
                <p><strong>Floor:</strong> ${property.floor || 'N/A'}</p>
            ` : ''}
            <div class="property-detail-price">$${property.price ? property.price.toLocaleString() : '0'}</div>
            <div class="property-detail-description">
                <h3>Description</h3>
                <p>${property.description || 'No description available.'}</p>
            </div>
            <div class="property-media">
                <h3>Photos (${property.photos ? property.photos.length : 0})</h3>
                ${photosHtml}
            </div>
            <div class="property-media">
                <h3>Videos (${property.videos ? property.videos.length : 0})</h3>
                ${videosHtml}
            </div>
        </div>
    `;
    
    propertyModal.style.display = 'block';
}

// Function to enlarge image when clicked
function enlargeImage(src) {
    // Create a modal for the enlarged image
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        z-index: 3000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
    `;
    
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    modal.appendChild(closeBtn);
    modal.appendChild(img);
    document.body.appendChild(modal);
}

// Search properties on public page
function searchProperties(query) {
    if (!query.trim()) {
        loadProperties();
        return;
    }
    
    const filteredProperties = properties.filter(property => 
        (property.name && property.name.toLowerCase().includes(query.toLowerCase())) ||
        (property.place && property.place.toLowerCase().includes(query.toLowerCase()))
    );
    
    const container = document.getElementById('properties-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (filteredProperties.length === 0) {
        container.innerHTML = '<p class="no-properties">No properties found matching your search.</p>';
        return;
    }
    
    filteredProperties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        
        // Use default image if no photos provided
        const imageUrl = property.photos && property.photos.length > 0 ? 
            property.photos[0] : 
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';
        
        propertyCard.innerHTML = `
            <div class="property-image" style="background-image: url('${imageUrl}')"></div>
            <div class="property-info">
                <h3>${property.name}</h3>
                <p><strong>Location:</strong> ${property.place}</p>
                <p><strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
                ${property.type !== 'land' ? `<p><strong>Details:</strong> ${property.bedrooms || 0} Bedrooms, ${property.bathrooms || 0} Bathrooms</p>` : ''}
                <div class="property-price">$${property.price ? property.price.toLocaleString() : '0'}</div>
                <a href="#" class="view-details" data-id="${property.id}">View Details</a>
            </div>
        `;
        container.appendChild(propertyCard);
    });
    
    // Add event listeners to view details links
    document.querySelectorAll('.view-details').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            showPropertyDetails(id);
        });
    });
}

// Load dashboard data
function loadDashboardData() {
    loadPropertiesTable();
    loadTransactionsTable();
    loadContactsTable();
    loadFinancesTable();
}

// Load properties table in dashboard
function loadPropertiesTable() {
    const tbody = document.getElementById('properties-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (properties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No properties added yet</td></tr>';
        return;
    }
    
    properties.forEach(property => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${property.name || 'N/A'}</td>
            <td>${property.place || 'N/A'}</td>
            <td>$${property.price ? property.price.toLocaleString() : '0'}</td>
            <td>${property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editProperty(${property.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProperty(${property.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load transactions table in dashboard
function loadTransactionsTable() {
    const tbody = document.getElementById('transactions-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No transactions recorded yet</td></tr>';
        return;
    }
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.buyerName || 'N/A'}</td>
            <td>${transaction.sellerName || 'N/A'}</td>
            <td>${transaction.buyerPhoneNumber || 'N/A'}</td>
            <td>${transaction.sellerPhoneNumber || 'N/A'}</td>
            <td>$${transaction.price ? transaction.price.toLocaleString() : '0'}</td>
            <td>${transaction.date || 'N/A'}</td>
            <td>${transaction.landName || 'N/A'}</td>
            <td>${transaction.propertyNumberPlace || 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editTransaction(${transaction.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load contacts table in dashboard
function loadContactsTable() {
    const tbody = document.getElementById('contacts-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No contacts added yet</td></tr>';
        return;
    }
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name || 'N/A'}</td>
            <td>$${contact.price ? contact.price.toLocaleString() : '0'}</td>
            <td>${contact.bank || 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Calculate total property value
    const totalPropertyValue = contacts.reduce((sum, contact) => sum + (contact.price || 0), 0);
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td><strong>Total Property Value:</strong></td>
        <td colspan="3"><strong>$${totalPropertyValue.toLocaleString()}</strong></td>
    `;
    tbody.appendChild(totalRow);
}

// Load finances table in dashboard
function loadFinancesTable() {
    const tbody = document.getElementById('finances-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (finances.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No financial records added yet</td></tr>';
        return;
    }
    
    finances.forEach(finance => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${finance.name || 'N/A'}</td>
            <td>$${finance.price ? finance.price.toLocaleString() : '0'}</td>
            <td>${finance.date || 'N/A'}</td>
            <td>${finance.landName || 'N/A'}</td>
            <td>${finance.type ? finance.type.charAt(0).toUpperCase() + finance.type.slice(1) : 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editFinance(${finance.id})">Edit</button>
                <button class="btn-delete" onclick="deleteFinance(${finance.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add total balance row
    const totalBalance = calculateTotalBalance();
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td colspan="4"><strong>Total Balance:</strong></td>
        <td colspan="2"><strong>$${totalBalance.toLocaleString()}</strong></td>
    `;
    tbody.appendChild(totalRow);
}

// Search properties table in dashboard
function searchPropertiesTable(query) {
    if (!query.trim()) {
        loadPropertiesTable();
        return;
    }
    
    const filteredProperties = properties.filter(property => 
        (property.name && property.name.toLowerCase().includes(query.toLowerCase())) ||
        (property.place && property.place.toLowerCase().includes(query.toLowerCase()))
    );
    
    const tbody = document.getElementById('properties-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredProperties.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No properties found matching your search</td></tr>';
        return;
    }
    
    filteredProperties.forEach(property => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${property.name || 'N/A'}</td>
            <td>${property.place || 'N/A'}</td>
            <td>$${property.price ? property.price.toLocaleString() : '0'}</td>
            <td>${property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editProperty(${property.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProperty(${property.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search transactions table in dashboard
function searchTransactionsTable(query) {
    if (!query.trim()) {
        loadTransactionsTable();
        return;
    }
    
    const filteredTransactions = transactions.filter(transaction => 
        (transaction.buyerName && transaction.buyerName.toLowerCase().includes(query.toLowerCase())) ||
        (transaction.sellerName && transaction.sellerName.toLowerCase().includes(query.toLowerCase())) ||
        (transaction.landName && transaction.landName.toLowerCase().includes(query.toLowerCase())) ||
        (transaction.propertyNumberPlace && transaction.propertyNumberPlace.toLowerCase().includes(query.toLowerCase()))
    );
    
    const tbody = document.getElementById('transactions-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">No transactions found matching your search</td></tr>';
        return;
    }
    
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.buyerName || 'N/A'}</td>
            <td>${transaction.sellerName || 'N/A'}</td>
            <td>${transaction.buyerPhoneNumber || 'N/A'}</td>
            <td>${transaction.sellerPhoneNumber || 'N/A'}</td>
            <td>$${transaction.price ? transaction.price.toLocaleString() : '0'}</td>
            <td>${transaction.date || 'N/A'}</td>
            <td>${transaction.landName || 'N/A'}</td>
            <td>${transaction.propertyNumberPlace || 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editTransaction(${transaction.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search contacts table in dashboard
function searchContactsTable(query) {
    if (!query.trim()) {
        loadContactsTable();
        return;
    }
    
    const filteredContacts = contacts.filter(contact => 
        contact.name && contact.name.toLowerCase().includes(query.toLowerCase())
    );
    
    const tbody = document.getElementById('contacts-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredContacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No contacts found matching your search</td></tr>';
        return;
    }
    
    filteredContacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name || 'N/A'}</td>
            <td>$${contact.price ? contact.price.toLocaleString() : '0'}</td>
            <td>${contact.bank || 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn-delete" onclick="deleteContact(${contact.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search finances table in dashboard
function searchFinancesTable(query) {
    if (!query.trim()) {
        loadFinancesTable();
        return;
    }
    
    const filteredFinances = finances.filter(finance => 
        (finance.name && finance.name.toLowerCase().includes(query.toLowerCase())) ||
        (finance.landName && finance.landName.toLowerCase().includes(query.toLowerCase()))
    );
    
    const tbody = document.getElementById('finances-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredFinances.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No financial records found matching your search</td></tr>';
        return;
    }
    
    filteredFinances.forEach(finance => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${finance.name || 'N/A'}</td>
            <td>$${finance.price ? finance.price.toLocaleString() : '0'}</td>
            <td>${finance.date || 'N/A'}</td>
            <td>${finance.landName || 'N/A'}</td>
            <td>${finance.type ? finance.type.charAt(0).toUpperCase() + finance.type.slice(1) : 'N/A'}</td>
            <td>
                <button class="btn-edit" onclick="editFinance(${finance.id})">Edit</button>
                <button class="btn-delete" onclick="deleteFinance(${finance.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Add property
function addProperty() {
    const name = document.getElementById('property-name').value;
    const phone = document.getElementById('property-phone').value;
    const place = document.getElementById('property-place').value;
    const price = parseFloat(document.getElementById('property-price').value);
    const type = document.getElementById('property-type').value;
    const description = document.getElementById('property-description').value;
    
    // Handle file uploads
    const photoFiles = document.getElementById('property-photos').files;
    const videoFiles = document.getElementById('property-videos').files;
    
    let bedrooms = null;
    let bathrooms = null;
    let floor = null;
    
    if (type !== 'land') {
        bedrooms = document.getElementById('property-bedrooms').value ? 
            parseInt(document.getElementById('property-bedrooms').value) : null;
        bathrooms = document.getElementById('property-bathrooms').value ? 
            parseInt(document.getElementById('property-bathrooms').value) : null;
        floor = document.getElementById('property-floor').value ? 
            parseInt(document.getElementById('property-floor').value) : null;
    }
    
    // Create object URLs for preview
    const photoUrls = [];
    const videoUrls = [];
    
    for (let i = 0; i < photoFiles.length; i++) {
        photoUrls.push(URL.createObjectURL(photoFiles[i]));
    }
    
    for (let i = 0; i < videoFiles.length; i++) {
        videoUrls.push(URL.createObjectURL(videoFiles[i]));
    }
    
    const newProperty = {
        id: properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1,
        name,
        phoneNumber: phone,
        place,
        price,
        type,
        bedrooms,
        bathrooms,
        floor,
        description,
        photos: photoUrls,
        videos: videoUrls
    };
    
    properties.push(newProperty);
    loadProperties();
    loadPropertiesTable();
    
    // Reset form and close modal
    document.getElementById('add-property-form').reset();
    addPropertyModal.style.display = 'none';
    
    alert('Property added successfully!');
}

// Edit property (placeholder)
function editProperty(id) {
    alert(`Edit property with ID: ${id}\n(In a real application, this would open an edit form)`);
}

// Delete property
function deleteProperty(id) {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
        properties = properties.filter(property => property.id !== id);
        loadProperties();
        loadPropertiesTable();
        alert('Property deleted successfully!');
    }
}

// Add transaction
function addTransaction() {
    const buyerName = document.getElementById('buyer-name').value;
    const sellerName = document.getElementById('seller-name').value;
    const buyerPhone = document.getElementById('buyer-phone').value;
    const sellerPhone = document.getElementById('seller-phone').value;
    const price = parseFloat(document.getElementById('transaction-price').value);
    const date = document.getElementById('transaction-date').value;
    const propertyPlace = document.getElementById('property-name-transaction').value;
    const propertyNumberPlace = document.getElementById('property-number-place').value;
    
    const newTransaction = {
        id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
        buyerName,
        sellerName,
        buyerPhoneNumber: buyerPhone,
        sellerPhoneNumber: sellerPhone,
        price,
        date,
        landName: propertyPlace,
        propertyNumberPlace
    };
    
    transactions.push(newTransaction);
    loadTransactionsTable();
    
    // Reset form and close modal
    document.getElementById('add-transaction-form').reset();
    addTransactionModal.style.display = 'none';
    
    alert('Transaction added successfully!');
}

// Edit transaction (placeholder)
function editTransaction(id) {
    alert(`Edit transaction with ID: ${id}\n(In a real application, this would open an edit form)`);
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        loadTransactionsTable();
        alert('Transaction deleted successfully!');
    }
}

// Add contact
function addContact() {
    const name = document.getElementById('contact-name').value;
    const price = parseFloat(document.getElementById('contact-price').value);
    const contactName = document.getElementById('contact-bank').value;
    
    const newContact = {
        id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
        name,
        price,
        bank: contactName
    };
    
    contacts.push(newContact);
    loadContactsTable();
    
    // Reset form and close modal
    document.getElementById('add-contact-form').reset();
    addContactModal.style.display = 'none';
    
    alert('Contact added successfully!');
}

// Edit contact (placeholder)
function editContact(id) {
    alert(`Edit contact with ID: ${id}\n(In a real application, this would open an edit form)`);
}

// Delete contact
function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
        contacts = contacts.filter(contact => contact.id !== id);
        loadContactsTable();
        alert('Contact deleted successfully!');
    }
}

// Add finance record
function addFinance() {
    const name = document.getElementById('finance-name').value;
    const price = parseFloat(document.getElementById('finance-price').value);
    const date = document.getElementById('finance-date').value;
    const propertyPlace = document.getElementById('property-name-finance').value;
    const type = document.getElementById('finance-type').value;
    
    const newFinance = {
        id: finances.length > 0 ? Math.max(...finances.map(f => f.id)) + 1 : 1,
        name,
        price,
        date,
        landName: propertyPlace,
        type
    };
    
    finances.push(newFinance);
    loadFinancesTable();
    
    // Reset form and close modal
    document.getElementById('add-finance-form').reset();
    addFinanceModal.style.display = 'none';
    
    alert('Financial record added successfully!');
}

// Function to calculate total balance
function calculateTotalBalance() {
    let total = 0;
    finances.forEach(finance => {
        if (finance.type === 'deposit') {
            total += finance.price || 0;
        } else if (finance.type === 'withdrawal') {
            total -= finance.price || 0;
        }
    });
    return total;
}

// Edit finance (placeholder)
function editFinance(id) {
    alert(`Edit finance record with ID: ${id}\n(In a real application, this would open an edit form)`);
}

// Delete finance
function deleteFinance(id) {
    if (confirm('Are you sure you want to delete this finance record? This action cannot be undone.')) {
        finances = finances.filter(finance => finance.id !== id);
        loadFinancesTable();
        alert('Finance record deleted successfully!');
    }
}