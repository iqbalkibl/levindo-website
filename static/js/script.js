document.addEventListener("DOMContentLoaded", () => {
    // ===== Tombol hover/klik =====
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mouseenter", () => { btn.style.transform = "scale(1.08)"; btn.style.transition = "transform 0.25s ease"; });
        btn.addEventListener("mouseleave", () => { btn.style.transform = "scale(1)"; });
        btn.addEventListener("click", () => { btn.style.transform = "scale(0.95)"; setTimeout(() => btn.style.transform = "scale(1)", 150); });
    });

    // ===== Smooth scroll =====
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
    
            const target = this.getAttribute('href');
    
            if (!target || target === "#") return;
    
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // ===== Parallax header =====
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => { if(header){ header.style.backgroundPositionY = `${window.scrollY * 0.5}px`; } });

    // ===== Modal Contact =====
    const modalHTML = `<div id="contactModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.6); justify-content:center; align-items:center; z-index:9999;">
        <div style="background:#ffffff; padding:30px; border-radius:12px; max-width:400px; text-align:center; position:relative;">
        <h2 style="
        margin-bottom:15px;
        font-weight:700;
        font-size:24px;
        letter-spacing:1px;
        color:#000000;
    ">
        Contact Us
    </h2>

    <p style="
        opacity:0.8;
        margin-bottom:25px;
        font-size:15px;
        color:#000000;
    ">
        Email : levindocb@gmail.com <br>
        Telefon : (0251) 8636744 <br>
        Fax : (0251) 8639695
    </p>
            <button id="closeModal">Close</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById("contactModal");
    const closeModal = document.getElementById("closeModal");
    document.querySelectorAll('a[href*="/contact"]').forEach(link => {
        link.addEventListener("click", e => { e.preventDefault(); modal.style.display = "flex"; });
    });
    closeModal.addEventListener("click", () => modal.style.display = "none");
    modal.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });

    // ===== Ambil data JSON dulu =====
    const dataElement = document.getElementById("project-data");
    if (dataElement) {
        window.projectData = JSON.parse(dataElement.textContent);
    }
    // ===== Leaflet Map + Markers =====
    if (document.getElementById("projectMap")) {

        var map = L.map('projectMap').setView([-2.5, 118], 5);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    
        const defaultIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        const redIcon = L.icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        

        let markers = [];

        if (window.projectData) {
            window.projectData.forEach(p => {

                const popupContent = `
                   <b>${p.company_name}</b><br>
                   ${p.description}
               `;

               const marker = L.marker([p.lat, p.lng], { icon: defaultIcon })
               .addTo(map)
               .bindPopup(popupContent);

               // === Hover Effect ===
               marker.on("mouseover", function () {
               this.openPopup();
               });

               marker.on("mouseout", function () {
               this.closePopup();
               });

               marker.category = p.category.toLowerCase();
                markers.push(marker);
            });
        }

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
        
                const selectedCategory = this.dataset.category.toLowerCase();
        
                markers.forEach(marker => {
        
                    if (selectedCategory === "all") {
                        marker.setIcon(defaultIcon);
                        marker.setOpacity(1);
                    } 
                    else if (marker.category === selectedCategory) {
                        marker.setIcon(redIcon);   // aktif jadi merah
                        marker.setOpacity(1);
                        marker.setZIndexOffset(1000);
                    } 
                    else {
                        marker.setIcon(defaultIcon);
                        marker.setOpacity(0.3);
                        marker.setZIndexOffset(0);
                    }
        
                });
            });
        });

    }
    // ===== Gallery Slide =====
    
    const track = document.querySelector('.gallery-track');

if (track) {

    const slides = track.querySelectorAll('img');
    const nextBtn = document.querySelector('.gallery-btn.next');
    const prevBtn = document.querySelector('.gallery-btn.prev');

    let index = 0;

    function updateSlide() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn?.addEventListener("click", function () {
        index = (index + 1) % slides.length;
        updateSlide();
    });

    prevBtn?.addEventListener("click", function () {
        index = (index - 1 + slides.length) % slides.length;
        updateSlide();
    });

}
        

});

