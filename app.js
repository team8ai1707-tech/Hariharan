/**
 * Vedha Resort Booking & Management System - Main State Engine
 */

const app = {
    // STATE DATA
    rooms: [],
    parkingSlots: [],
    serviceRequests: [],
    reviews: [],
    cart: [],
    currentMenuCategory: 'north-indian',
    activeView: 'home',
    selectedParkingSlot: null,
    selectedReviewRating: 5,
    cleaningTimerInterval: null,

    // CONSTANTS
    CLEANING_DURATION_MS: 20 * 60 * 1000, // 20 minutes in milliseconds

    // INITIALIZATION
    init() {
        console.log("Initializing Vedha Resort App...");
        
        // Load initial states from LocalStorage or seed defaults
        this.loadState();
        
        // Bind UI Events
        this.bindEvents();
        
        // Render Initial Views
        this.renderRooms();
        this.renderFoodMenu();
        this.renderParkingGrid();
        this.renderServiceFeed();
        this.renderReviews();
        this.updateServiceRoomsDropdown();
        this.updateModalRoomsDropdown();

        // Start Cleaning Timer Engine
        this.startCleaningEngine();
        
        // Initialize Map
        this.initMap();
        
        // Handle initial hash routing
        this.handleRouting();
    },

    // PERSISTENCE & SEEDING
    loadState() {
        // Rooms Seeding
        const defaultRooms = [
            { id: '101', name: 'Deluxe Garden Suite', type: 'deluxe', price: 8000, maxGuests: 2, view: 'Garden View', status: 'available', cleaningEnd: null },
            { id: '102', name: 'Deluxe Garden Suite', type: 'deluxe', price: 8000, maxGuests: 2, view: 'Garden View', status: 'available', cleaningEnd: null },
            { id: '201', name: 'Luxury Canopy Suite', type: 'suite', price: 14000, maxGuests: 3, view: 'Valley View', status: 'available', cleaningEnd: null },
            { id: '202', name: 'Luxury Canopy Suite', type: 'suite', price: 14000, maxGuests: 3, view: 'Valley View', status: 'available', cleaningEnd: null },
            { id: '301', name: 'Grand Family Villa', type: 'villa', price: 22000, maxGuests: 5, view: 'Private Pool View', status: 'available', cleaningEnd: null },
            { id: '401', name: 'Presidential Sanctuary', type: 'presidential', price: 45000, maxGuests: 6, view: '360° Panoramic Hills', status: 'available', cleaningEnd: null }
        ];
        
        this.rooms = JSON.parse(localStorage.getItem('vedha_rooms')) || defaultRooms;

        // Check if any rooms were in a cleaning state when closed, and update timestamps
        const now = Date.now();
        this.rooms.forEach(room => {
            if (room.status === 'cleaning' && room.cleaningEnd) {
                // If the cleaning time already expired while the app was closed
                if (now >= room.cleaningEnd) {
                    room.status = 'available';
                    room.cleaningEnd = null;
                }
            }
        });
        this.saveRoomsState();

        // Parking Slots Seeding (P1 to P12)
        const defaultParking = Array.from({ length: 12 }, (_, i) => ({
            id: `P${i + 1}`,
            status: i === 2 || i === 5 || i === 9 ? 'occupied' : 'free', // Seed some occupied
            carNo: i === 2 || i === 5 || i === 9 ? 'KA-04-AB-9876' : ''
        }));
        this.parkingSlots = JSON.parse(localStorage.getItem('vedha_parking')) || defaultParking;

        // Service Requests Seeding
        const defaultRequests = [
            { id: 1, room: '101', category: 'Housekeeping', desc: 'Extra towels and pillows', status: 'completed', time: '2 hours ago' },
            { id: 2, room: '201', category: 'In-Room Dining', desc: 'Coffee and snacks delivery', status: 'in-progress', time: '10 mins ago' }
        ];
        this.serviceRequests = JSON.parse(localStorage.getItem('vedha_services')) || defaultRequests;

        // Reviews Seeding
        const defaultReviews = [
            { author: 'Vikram Malhotra', rating: 5, comment: 'Vedha Resort is a true gem. The Presidential sanctuary was stunning and the service center responded to requests in minutes. Loved the Chinese dishes at dinner!', date: 'July 14, 2026' },
            { author: 'Priya Sharma', rating: 5, comment: 'Amazing family stay. The kids playground kept the children engaged, and my husband and I enjoyed the infinity pool. Clean, luxurious, and peaceful.', date: 'July 10, 2026' },
            { author: 'Rahul Deshmukh', rating: 4, comment: 'Beautiful scenery and extremely clean rooms. I monitored the 20-minute post-checkout cleaning process myself and it was highly professional. Food was excellent.', date: 'June 28, 2026' }
        ];
        this.reviews = JSON.parse(localStorage.getItem('vedha_reviews')) || defaultReviews;
    },

    saveRoomsState() {
        localStorage.setItem('vedha_rooms', JSON.stringify(this.rooms));
    },

    saveParkingState() {
        localStorage.setItem('vedha_parking', JSON.stringify(this.parkingSlots));
    },

    saveServicesState() {
        localStorage.setItem('vedha_services', JSON.stringify(this.serviceRequests));
    },

    saveReviewsState() {
        localStorage.setItem('vedha_reviews', JSON.stringify(this.reviews));
    },

    // EVENT BINDINGS
    bindEvents() {
        // Sticky Header scroll
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Navigation links routing
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.target.getAttribute('data-target');
                this.navigateTo(target);
            });
        });

        // Review Form Star Selector
        const stars = document.querySelectorAll('#form-star-select span');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const val = parseInt(e.target.getAttribute('data-val'));
                this.selectedReviewRating = val;
                
                // Update styling
                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-val'));
                    if (sVal <= val) {
                        s.classList.add('selected');
                    } else {
                        s.classList.remove('selected');
                    }
                });
            });
        });
    },

    // ROUTING ENGINE
    handleRouting() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.navigateTo(hash);
        } else {
            this.navigateTo('home');
        }
    },

    navigateTo(targetView) {
        // Hide all views, display target
        const views = document.querySelectorAll('.section-view');
        let viewFound = false;
        
        views.forEach(view => {
            if (view.id === targetView) {
                view.classList.add('active');
                viewFound = true;
            } else {
                view.classList.remove('active');
            }
        });

        if (!viewFound) return; // invalid view

        this.activeView = targetView;
        window.location.hash = targetView;

        // Update Nav Menu links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetView) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Specific section hooks
        if (targetView === 'map') {
            // Force Leaflet map layout recalculation after animation
            setTimeout(() => {
                if (this.leafletMap) {
                    this.leafletMap.invalidateSize();
                }
            }, 300);
        }

        // Scroll to top of section
        window.scrollTo(0, 0);
    },

    // ROOM BOOKING PROTOCOL
    renderRooms(filter = 'all') {
        const grid = document.getElementById('rooms-list-grid');
        grid.innerHTML = '';

        const filtered = this.rooms.filter(room => {
            if (filter === 'all') return true;
            return room.status === filter;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="glass-card" style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No rooms found in this category.</div>`;
            return;
        }

        filtered.forEach(room => {
            let imgFile = 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';
            if (room.type === 'suite') imgFile = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
            if (room.type === 'villa') imgFile = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';
            if (room.type === 'presidential') imgFile = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

            const card = document.createElement('div');
            card.className = `glass-card room-card`;
            
            // Build Status Tag
            let statusPill = '';
            let actionBtn = '';
            let cleaningTimerBox = '';

            if (room.status === 'available') {
                statusPill = `<span class="status-pill available">Available</span>`;
                actionBtn = `<button class="btn-primary" style="width: 100%; justify-content: center;" onclick="app.showBookingModal('${room.id}')">Book Room</button>`;
            } else if (room.status === 'booked') {
                statusPill = `<span class="status-pill booked">Occupied</span>`;
                actionBtn = `<button class="btn-secondary" style="width: 100%; justify-content: center; border-color: var(--status-booked);" onclick="app.checkOutRoom('${room.id}')">Check Out</button>`;
            } else if (room.status === 'cleaning') {
                statusPill = `<span class="status-pill cleaning">Cleaning Cycle</span>`;
                actionBtn = `<button class="btn-secondary" style="width: 100%; justify-content: center;" disabled>Cleaning in progress</button>`;
                
                // Add countdown widget
                cleaningTimerBox = `
                    <div class="cleaning-countdown-container" id="clean-box-${room.id}">
                        <div class="cleaning-countdown-header">
                            <span>Sanitization Cycle</span>
                            <span id="clean-timer-${room.id}">20:00</span>
                        </div>
                        <div class="cleaning-progress-bar">
                            <div class="cleaning-progress-fill" id="clean-fill-${room.id}" style="width: 0%;"></div>
                        </div>
                        <button class="fast-forward-btn" onclick="app.fastForwardCleaning('${room.id}')">Fast Forward (Simulate Complete)</button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="room-image-wrapper">
                    <img src="${imgFile}" alt="${room.name}">
                    <span class="room-tag">${room.view}</span>
                </div>
                <div class="room-details">
                    <div class="room-header">
                        <div>
                            <h3 class="room-title">${room.name}</h3>
                            <p style="color: var(--text-muted); font-size: 0.85rem;">Room ${room.id}</p>
                        </div>
                        <div class="room-price">₹${room.price.toLocaleString('en-IN')}<span>/night</span></div>
                    </div>
                    <div class="room-specs">
                        <span>👥 Max ${room.maxGuests} Guests</span>
                        <span>📏 Room Type: ${room.type.toUpperCase()}</span>
                    </div>
                    
                    <div class="room-status-wrapper">
                        ${statusPill}
                        ${cleaningTimerBox}
                        ${actionBtn}
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });
    },

    filterRooms(status, buttonElement) {
        // Toggle active button styling
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        buttonElement.classList.add('active');

        this.renderRooms(status);
    },

    showBookingModal(roomId = '') {
        const overlay = document.getElementById('booking-modal-overlay');
        overlay.classList.add('active');

        // Preset dropdown
        if (roomId) {
            document.getElementById('modal-room-select').value = roomId;
        }
    },

    closeBookingModal() {
        const overlay = document.getElementById('booking-modal-overlay');
        overlay.classList.remove('active');
        // Clear inputs
        document.getElementById('modal-guest-name').value = '';
    },

    confirmBooking() {
        const guestName = document.getElementById('modal-guest-name').value.trim();
        const roomId = document.getElementById('modal-room-select').value;
        const duration = document.getElementById('modal-duration').value;

        if (!guestName) {
            alert("Please enter the guest name.");
            return;
        }

        const roomIndex = this.rooms.findIndex(r => r.id === roomId);
        if (roomIndex !== -1) {
            const room = this.rooms[roomIndex];
            if (room.status !== 'available') {
                alert("This room is currently occupied or cleaning.");
                return;
            }

            // Book it
            room.status = 'booked';
            room.guestName = guestName;
            room.bookingDuration = duration;
            this.saveRoomsState();
            
            // Add service request notification log
            this.addServiceRequest(roomId, 'Front Desk', `Checked In guest: ${guestName} for ${duration} nights`, 'completed');

            // Refresh UI
            this.closeBookingModal();
            this.renderRooms();
            this.updateServiceRoomsDropdown();
            this.updateModalRoomsDropdown();
            
            alert(`Successfully booked Room ${roomId} for ${guestName}!`);
        }
    },

    checkOutRoom(roomId) {
        const roomIndex = this.rooms.findIndex(r => r.id === roomId);
        if (roomIndex !== -1) {
            const room = this.rooms[roomIndex];
            
            // Transition to Cleaning state
            room.status = 'cleaning';
            const cleaningStart = Date.now();
            room.cleaningEnd = cleaningStart + this.CLEANING_DURATION_MS;
            
            this.saveRoomsState();

            // Add housekeeping ticket automatically
            this.addServiceRequest(roomId, 'Housekeeping', `Room checkout sanitation required (20-min cycle)`, 'in-progress');

            // Refresh
            this.renderRooms();
            this.updateServiceRoomsDropdown();
            this.updateModalRoomsDropdown();

            alert(`Checkout completed for Room ${roomId}. Room has entered the 20-minute cleaning and sanitization cycle.`);
        }
    },

    fastForwardCleaning(roomId) {
        const roomIndex = this.rooms.findIndex(r => r.id === roomId);
        if (roomIndex !== -1) {
            const room = this.rooms[roomIndex];
            room.status = 'available';
            room.cleaningEnd = null;
            this.saveRoomsState();

            // Find matching cleaning service ticket and mark completed
            const req = this.serviceRequests.find(r => r.room === roomId && r.category === 'Housekeeping' && r.status === 'in-progress');
            if (req) {
                req.status = 'completed';
                this.saveServicesState();
                this.renderServiceFeed();
            }

            this.renderRooms();
            this.updateServiceRoomsDropdown();
            this.updateModalRoomsDropdown();
        }
    },

    // CLEANING ENGINE TIMER
    startCleaningEngine() {
        this.cleaningTimerInterval = setInterval(() => {
            const now = Date.now();
            let stateChanged = false;

            this.rooms.forEach(room => {
                if (room.status === 'cleaning' && room.cleaningEnd) {
                    const remaining = room.cleaningEnd - now;

                    if (remaining <= 0) {
                        // Cleaning complete
                        room.status = 'available';
                        room.cleaningEnd = null;
                        stateChanged = true;

                        // Mark active housekeeping tickets complete
                        const req = this.serviceRequests.find(r => r.room === room.id && r.category === 'Housekeeping' && r.status === 'in-progress');
                        if (req) {
                            req.status = 'completed';
                        }
                    } else {
                        // Update UI elements in active list
                        const timerSpan = document.getElementById(`clean-timer-${room.id}`);
                        const progressFill = document.getElementById(`clean-fill-${room.id}`);

                        if (timerSpan && progressFill) {
                            const diffSecs = Math.max(0, Math.floor(remaining / 1000));
                            const mins = Math.floor(diffSecs / 60);
                            const secs = diffSecs % 60;
                            timerSpan.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

                            // Calculate progress bar fill
                            const totalDuration = this.CLEANING_DURATION_MS;
                            const progress = ((totalDuration - remaining) / totalDuration) * 100;
                            progressFill.style.width = `${progress}%`;
                        }
                    }
                }
            });

            if (stateChanged) {
                this.saveRoomsState();
                this.saveServicesState();
                this.renderRooms();
                this.renderServiceFeed();
                this.updateServiceRoomsDropdown();
                this.updateModalRoomsDropdown();
            }
        }, 1000);
    },

    // FOOD ORDERING / DINING
    foodItems: {
        'north-indian': [
            { id: 'n1', name: 'Paneer Butter Masala', price: 320, veg: true, desc: 'Cottage cheese cubes cooked in rich tomato and cashew butter gravy.' },
            { id: 'n2', name: 'Amritsari Kulcha Combo', price: 280, veg: true, desc: 'Crisp layered stuffed flatbread served with spicy chickpea curry and pickle.' },
            { id: 'n3', name: 'Murg Makhani (Butter Chicken)', price: 420, veg: false, desc: 'Classic roasted chicken strips simmered in silk cream tomato gravy.' },
            { id: 'n4', name: 'Dal Makhani & Butter Naan', price: 290, veg: true, desc: 'Slow cooked black lentils with traditional spices, served with fresh tandoor flatbread.' }
        ],
        'south-indian': [
            { id: 's1', name: 'Vedha Signature Masala Dosa', price: 180, veg: true, desc: 'Thin rice-lentil crepe filled with spiced potato mash, served with coconut chutney and piping hot sambar.' },
            { id: 's2', name: 'Filter Coffee & Idli-Vada Platter', price: 210, veg: true, desc: 'Steam rice cakes and crispy lentil fritters, complemented by standard foam-filtered chicory brew.' },
            { id: 's3', name: 'Chettinad Spicy Mutton Curry', price: 480, veg: false, desc: 'Tender lamb chunks prepared in strong, roasted black pepper and coconut masala.' },
            { id: 's4', name: 'Malabar Parotta with Veg Kurma', price: 240, veg: true, desc: 'Flaky ribbon layered flatbread served alongside fresh stewed seasonal garden vegetables.' }
        ],
        'chinese': [
            { id: 'c1', name: 'Sichuan Veg Hakka Noodles', price: 260, veg: true, desc: 'Wok tossed noodles loaded with julienned vegetables and spicy red chili pepper oils.' },
            { id: 'c2', name: 'Gobi Manchurian Dry', price: 220, veg: true, desc: 'Crispy cauliflower florets tossed in garlic, green chillies, spring onions, and soya sauces.' },
            { id: 'c3', name: 'Ginger Chicken Claypot', price: 380, veg: false, desc: 'Sliced chicken breasts braised in authentic ginger, wood ear mushrooms, and wine reductions.' },
            { id: 'c4', name: 'Chili Garlic Fried Rice', price: 240, veg: true, desc: 'Fragrant jasmine rice sautéed with fine chopped garlic, hot chilis, and scallions.' }
        ]
    },

    changeMenuCategory(category) {
        this.currentMenuCategory = category;
        
        // Update Tabs styling
        const buttons = document.querySelectorAll('.menu-tab-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        
        if (category === 'north-indian') document.getElementById('menu-north').classList.add('active');
        if (category === 'south-indian') document.getElementById('menu-south').classList.add('active');
        if (category === 'chinese') document.getElementById('menu-chinese').classList.add('active');

        this.renderFoodMenu();
    },

    renderFoodMenu() {
        const container = document.getElementById('food-menu-container');
        container.innerHTML = '';

        const items = this.foodItems[this.currentMenuCategory] || [];
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            card.innerHTML = `
                <div class="menu-item-header">
                    <span class="menu-item-title">${item.name}</span>
                    <span class="menu-item-price">₹${item.price}</span>
                </div>
                <p class="menu-item-desc">${item.desc}</p>
                <div class="menu-item-bottom">
                    <span class="diet-indicator ${item.veg ? 'veg' : 'non-veg'}">${item.veg ? 'Veg' : 'Non-Veg'}</span>
                    <button class="add-to-cart-btn" onclick="app.addToCart('${item.id}', '${item.name}', ${item.price})">Add to Order</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    addToCart(id, name, price) {
        const cartItemIndex = this.cart.findIndex(i => i.id === id);
        if (cartItemIndex !== -1) {
            this.cart[cartItemIndex].qty += 1;
        } else {
            this.cart.push({ id, name, price, qty: 1 });
        }
        this.renderCart();
    },

    removeFromCart(id) {
        const cartItemIndex = this.cart.findIndex(i => i.id === id);
        if (cartItemIndex !== -1) {
            this.cart[cartItemIndex].qty -= 1;
            if (this.cart[cartItemIndex].qty <= 0) {
                this.cart.splice(cartItemIndex, 1);
            }
        }
        this.renderCart();
    },

    renderCart() {
        const wrapper = document.getElementById('cart-items-wrapper');
        wrapper.innerHTML = '';

        if (this.cart.length === 0) {
            wrapper.innerHTML = `<p class="cart-empty-message">Your order basket is empty.</p>`;
            document.getElementById('cart-total-cost').innerText = '₹0';
            return;
        }

        let total = 0;
        this.cart.forEach(item => {
            const cost = item.price * item.qty;
            total += cost;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <span>₹${item.price} x ${item.qty}</span>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-qty-btn" onclick="app.removeFromCart('${item.id}')">−</span>
                    <span style="font-weight:600;">${item.qty}</span>
                    <span class="cart-qty-btn" onclick="app.addToCart('${item.id}', '${item.name}', ${item.price})">+</span>
                </div>
            `;
            wrapper.appendChild(div);
        });

        document.getElementById('cart-total-cost').innerText = `₹${total}`;
    },

    checkoutFoodOrder() {
        if (this.cart.length === 0) {
            alert("Your basket is empty. Add menu items first.");
            return;
        }

        // Check if there's any active booking to charge the food order to
        const activeRooms = this.rooms.filter(r => r.status === 'booked');
        if (activeRooms.length === 0) {
            alert("To place a room service dining order, there must be at least one active booked room. Please check in a room first.");
            return;
        }

        const selectedRoom = activeRooms[0].id;
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        // Dispatch service request
        this.addServiceRequest(
            selectedRoom, 
            'In-Room Dining', 
            `Delivering: ${this.cart.map(i => `${i.name} (x${i.qty})`).join(', ')}. Bill: ₹${total}`, 
            'in-progress'
        );

        // Clear cart
        this.cart = [];
        this.renderCart();
        this.navigateTo('service');
        
        alert(`Dining order dispatched to Room ${selectedRoom}! You can track delivery status on the Service Desk feed.`);
    },

    // CAR PARKING AVAILABILITY
    renderParkingGrid() {
        const grid = document.getElementById('parking-grid-box');
        grid.innerHTML = '';

        this.parkingSlots.forEach(slot => {
            const div = document.createElement('div');
            
            let statusClass = 'free';
            if (slot.status === 'occupied') statusClass = 'occupied';
            else if (this.selectedParkingSlot === slot.id) statusClass = 'selected';
            
            div.className = `parking-slot ${statusClass}`;
            div.innerHTML = `
                <div class="slot-name">${slot.id}</div>
                <div class="slot-status-txt">${slot.status === 'occupied' ? 'Occupied' : (this.selectedParkingSlot === slot.id ? 'Selected' : 'Vacant')}</div>
            `;
            
            if (slot.status === 'free') {
                div.onclick = () => this.selectParkingSlot(slot.id);
            }
            
            grid.appendChild(div);
        });
    },

    selectParkingSlot(slotId) {
        if (this.selectedParkingSlot === slotId) {
            this.selectedParkingSlot = null; // Toggle off
        } else {
            this.selectedParkingSlot = slotId;
        }
        
        document.getElementById('selected-parking-slot').innerText = this.selectedParkingSlot || 'None Selected';
        this.renderParkingGrid();
    },

    reserveSelectedParking() {
        if (!this.selectedParkingSlot) {
            alert("Please click on a vacant parking slot in the grid first.");
            return;
        }

        const carNo = document.getElementById('parking-car-no').value.trim();
        if (!carNo) {
            alert("Please enter your vehicle plate number.");
            return;
        }

        const slot = this.parkingSlots.find(p => p.id === this.selectedParkingSlot);
        if (slot) {
            slot.status = 'occupied';
            slot.carNo = carNo;
            
            // Add service request
            const activeRooms = this.rooms.filter(r => r.status === 'booked');
            const roomNo = activeRooms.length > 0 ? activeRooms[0].id : 'Front Desk';
            this.addServiceRequest(roomNo, 'Valet Call', `Reserved Valet Parking Slot ${this.selectedParkingSlot} for vehicle ${carNo}`, 'completed');

            // Save and clean selections
            this.saveParkingState();
            this.selectedParkingSlot = null;
            document.getElementById('selected-parking-slot').innerText = 'None Selected';
            document.getElementById('parking-car-no').value = '';
            
            this.renderParkingGrid();
            alert(`Valet parking slot successfully reserved!`);
        }
    },

    // FRONT DESK & RECEPTION
    generateReceptionTicket() {
        const guestName = document.getElementById('ticket-name').value.trim();
        const reason = document.getElementById('ticket-reason').value;

        if (!guestName) {
            alert("Please enter your name.");
            return;
        }

        const ticketId = 'VDH-' + Math.floor(1000 + Math.random() * 9000);
        
        // Show ticket output
        const ticketBox = document.getElementById('reception-ticket-box');
        document.getElementById('ticket-id-out').innerText = ticketId;
        document.getElementById('ticket-guest-out').innerText = guestName;
        
        let reasonLabel = 'Express Check-in';
        if (reason === 'luggage') reasonLabel = 'Luggage Claim / Storage';
        if (reason === 'valet') reasonLabel = 'Valet Retrieval';
        if (reason === 'customs') reasonLabel = 'Concierge Desk';
        document.getElementById('ticket-service-out').innerText = reasonLabel;

        ticketBox.classList.add('active');

        // Add service request tracking log
        this.addServiceRequest('Front Desk', 'Reception Desk', `Ticket ${ticketId} generated by ${guestName} (${reasonLabel})`, 'pending');

        alert(`Queue ticket ${ticketId} generated. Proceed to Front Desk when your number is called.`);
    },

    updateHallViz(guests) {
        const maxGuests = 800;
        const val = Math.min(maxGuests, Math.max(0, parseInt(guests) || 0));
        
        const pct = Math.round((val / maxGuests) * 100);
        document.getElementById('hall-guests-pct').innerText = `${pct}% Capacity (${val} Guests)`;
        document.getElementById('hall-viz-fill').style.width = `${pct}%`;
    },

    submitHallInquiry() {
        const date = document.getElementById('hall-date').value;
        const guests = document.getElementById('hall-guests').value;
        const arrangement = document.getElementById('hall-layout').value;

        if (!date) {
            alert("Please select a date for the event.");
            return;
        }

        alert(`Thank you! Banquet inquiry submitted for ${guests} guests on ${date}. Our events team will contact you in 1 hour.`);
        
        // Reset fields
        document.getElementById('hall-date').value = '';
    },

    // SERVICE CENTER DISPATCH
    renderServiceFeed() {
        const container = document.getElementById('service-requests-feed');
        container.innerHTML = '';

        if (this.serviceRequests.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding: 2rem;">No active requests logged.</p>`;
            return;
        }

        this.serviceRequests.forEach(req => {
            const div = document.createElement('div');
            div.className = 'request-item';
            
            let statusText = 'Pending';
            let statusClass = 'pending';
            if (req.status === 'in-progress') {
                statusText = 'In Progress';
                statusClass = 'in-progress';
            } else if (req.status === 'completed') {
                statusText = 'Completed';
                statusClass = 'completed';
            }

            div.innerHTML = `
                <div class="req-main">
                    <h5>[Room ${req.room}] ${req.category}</h5>
                    <p style="font-size:0.9rem; color:var(--text-secondary); margin: 0.2rem 0;">${req.desc}</p>
                    <span class="req-meta">${req.time}</span>
                </div>
                <span class="req-status ${statusClass}">${statusText}</span>
            `;
            container.appendChild(div);
        });
    },

    addServiceRequest(room, category, desc, status = 'pending') {
        const newReq = {
            id: Date.now(),
            room,
            category,
            desc,
            status,
            time: 'Just now'
        };
        this.serviceRequests.unshift(newReq); // Add to beginning
        this.saveServicesState();
        this.renderServiceFeed();
        
        // If it's in progress, schedule completion for realism
        if (status === 'in-progress') {
            setTimeout(() => {
                const item = this.serviceRequests.find(r => r.id === newReq.id);
                if (item && item.status === 'in-progress') {
                    item.status = 'completed';
                    item.time = '1 min ago';
                    this.saveServicesState();
                    this.renderServiceFeed();
                }
            }, 60000); // Complete after 60s
        }
    },

    submitServiceRequest() {
        const room = document.getElementById('service-room-id').value;
        const category = document.getElementById('service-category').value;
        const desc = document.getElementById('service-desc').value.trim();

        if (!room) {
            alert("No booked rooms available to order service. Please check in a room first.");
            return;
        }
        if (!desc) {
            alert("Please include instructions or notes.");
            return;
        }

        this.addServiceRequest(room, category, desc, 'in-progress');
        
        // Reset desc input
        document.getElementById('service-desc').value = '';
        alert("Service ticket successfully dispatched to personnel!");
    },

    updateServiceRoomsDropdown() {
        const select = document.getElementById('service-room-id');
        if (!select) return;
        select.innerHTML = '';

        const activeRooms = this.rooms.filter(r => r.status === 'booked');
        if (activeRooms.length === 0) {
            const opt = document.createElement('option');
            opt.innerText = 'No Active Bookings';
            opt.value = '';
            select.appendChild(opt);
            return;
        }

        activeRooms.forEach(room => {
            const opt = document.createElement('option');
            opt.value = room.id;
            opt.innerText = `Room ${room.id} (${room.guestName})`;
            select.appendChild(opt);
        });
    },

    updateModalRoomsDropdown() {
        const select = document.getElementById('modal-room-select');
        if (!select) return;
        select.innerHTML = '';

        const availableRooms = this.rooms.filter(r => r.status === 'available');
        if (availableRooms.length === 0) {
            const opt = document.createElement('option');
            opt.innerText = 'No Suites Available (All cleaning/occupied)';
            opt.value = '';
            select.appendChild(opt);
            return;
        }

        availableRooms.forEach(room => {
            const opt = document.createElement('option');
            opt.value = room.id;
            opt.innerText = `${room.name} - Room ${room.id} (₹${room.price.toLocaleString('en-IN')})`;
            select.appendChild(opt);
        });
    },

    // REVIEWS & COMMENTS
    renderReviews() {
        const container = document.getElementById('reviews-feed-box');
        container.innerHTML = '';

        this.reviews.forEach(rev => {
            const starsText = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
            const card = document.createElement('div');
            card.className = 'review-item';
            card.innerHTML = `
                <div class="review-item-header">
                    <span class="reviewer-name">${rev.author}</span>
                    <span style="color:#f59e0b;">${starsText}</span>
                    <span class="review-date">${rev.date}</span>
                </div>
                <p class="review-comment">"${rev.comment}"</p>
            `;
            container.appendChild(card);
        });
    },

    submitReview() {
        const name = document.getElementById('review-author').value.trim();
        const comment = document.getElementById('review-comment').value.trim();

        if (!name || !comment) {
            alert("Please provide both name and review comment.");
            return;
        }

        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        const newRev = {
            author: name,
            rating: this.selectedReviewRating,
            comment: comment,
            date: date
        };

        this.reviews.unshift(newRev); // add to top
        this.saveReviewsState();
        this.renderReviews();

        // Reset fields
        document.getElementById('review-author').value = '';
        document.getElementById('review-comment').value = '';
        
        alert("Thank you for your feedback! Review posted successfully.");
    },

    // LEAFLET MAP INITIALIZATION
    leafletMap: null,
    initMap() {
        try {
            const resortCoordinates = [12.4244, 75.7382]; // Madikeri Hills Coorg coordinates
            this.leafletMap = L.map('map-element', {
                center: resortCoordinates,
                zoom: 13,
                zoomControl: true
            });

            // Dark-matter layer coordinates with our luxury black/gold look
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 20
            }).addTo(this.leafletMap);

            // Custom gold leaf marker icon
            const customIcon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="background-color: var(--accent-gold); width: 14px; height: 14px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            L.marker(resortCoordinates, { icon: customIcon }).addTo(this.leafletMap)
                .bindPopup(`<div style="color: #000; font-family: var(--font-body);"><b>Vedha Resort</b><br>Madikeri Forest Hills, Coorg</div>`)
                .openPopup();
        } catch (err) {
            console.error("Map initialization failed. Internet might be offline.", err);
            document.getElementById('map-element').innerHTML = `<div style="padding:4rem; color:var(--text-muted); text-align:center;">Interactive Map Unavailable Offline</div>`;
        }
    }
};

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
