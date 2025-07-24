// Inisialisasi peta
const map = L.map("map").setView([-6.87, 109.675], 13);

// Tambahkan layer OSM
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

// Ambil elemen panel info
const infoPanel = document.getElementById("info-panel");
let markers = {}; // Objek untuk menyimpan marker

// Data dari dokumen Excel (di-hardcode berdasarkan analisis)
const pjuData = [
  {
    id: 7301,
    coords: [-6.8661666667, 109.6764833333],
    desa: "Panjang Baru",
    kecamatan: "Pekalongan Utara",
    tanggal: "2025-06-18",
    surveyor: "qgis.wrd",
    jenis_pju: "Abonemen",
    sumber: "Saluran Rumah / Dak Standar",
    jenis_beban: "Pijar",
    daya_watt: 50,
    foto: "image/panjangbaru.jpg",
    e_tikor: "S6 51.970 E109 40.589",
    e_jenis_beban: "SL",
    e_daya_watt: 30,
    e_jenis_pju: "Abonemen",
    e_idpel: 777980,
    e_daya_plg_va: 2200
  },
  {
    id: 7309,
    coords: [-6.8767833333, 109.6763833333],
    desa: "Panjang Wetan",
    kecamatan: "Pekalongan Utara",
    tanggal: "2025-06-17",
    surveyor: "qgis.btg",
    jenis_pju: "Abonemen",
    sumber: "Tiang Listrik",
    jenis_beban: "Pijar",
    daya_watt: 200,
    foto: "image/panjangwetan.jpg",
    e_tikor: "S6 52.607 E109 40.583",
    e_jenis_beban: "SON T",
    e_daya_watt: 150,
    e_jenis_pju: "Abonemen",
    e_idpel: 5245170802750,
    e_daya_plg_va: 7700
  },
  {
    id: 7314,
    coords: [-6.8752333333, 109.6777],
    desa: "Krapyak",
    kecamatan: "Pekalongan Utara",
    tanggal: "2025-07-03",
    surveyor: "qgis.wrd",
    jenis_pju: "Abonemen",
    sumber: "Tiang Listrik",
    jenis_beban: "Fitting tanpa Lampu",
    daya_watt: 50,
    foto: "image/krapyak.jpg",
    e_tikor: "S6 52.514 E109 40.662",
    e_jenis_beban: "SL",
    e_daya_watt: 30,
    e_jenis_pju: "Abonemen",
    e_idpel: 524511025541,
    e_daya_plg_va: 7700
  },
  {
    id: 7337,
    coords: [-6.8689666667, 109.6732333333],
    desa: "Kandang Panjang",
    kecamatan: "Pekalongan Utara",
    tanggal: "2025-06-25",
    surveyor: "qgis.kdw",
    jenis_pju: "Abonemen",
    sumber: "Tiang Listrik",
    jenis_beban: "LED",
    daya_watt: 100,
    foto: "image/kandangpanjang.jpg",
    e_tikor: "S6 52.138 E109 40.394",
    e_jenis_beban: "SL",
    e_daya_watt: 30,
    e_jenis_pju: "Abonemen",
    e_idpel: 524510779656,
    e_daya_plg_va: 4400
  },
  {
    id: 7341,
    coords: [-6.8733166667, 109.6772333333],
    desa: "Panjang Wetan",
    kecamatan: "Pekalongan Utara",
    tanggal: "2025-06-16",
    surveyor: "qgis.btg",
    jenis_pju: "Abonemen",
    sumber: "Saluran Rumah / Dak Standar",
    jenis_beban: "LED",
    daya_watt: 50,
    foto: "image/panjangwetan2.jpg",
    e_tikor: "S6 52.399 E109 40.634",
    e_jenis_beban: "-",
    e_daya_watt: 150,
    e_jenis_pju: "Abonemen",
    e_idpel: 524510779578,
    e_daya_plg_va: 3500
  }
];

// Fungsi untuk menampilkan detail di panel
function showPjuDetails(data) {
  // Show panel immediately with loading state for address
  infoPanel.innerHTML = `
    <h2>Detail PJU</h2>
    <img src="${data.foto}" alt="Foto PJU" class="pju-photo">
    <div class="detail-item"><span><strong>ID</strong></span><span>: ${data.id}</span></div>
    <div class="detail-item"><span><strong>Alamat</strong></span><span id="address-value">: Memuat alamat...</span></div>
    <div class="detail-item"><span><strong>Desa</strong></span><span>: ${data.desa}</span></div>
    <div class="detail-item"><span><strong>Kecamatan</strong></span><span>: ${data.kecamatan}</span></div>
    <div class="detail-item"><span><strong>Koordinat</strong></span><span>: ${data.coords[0]}, ${data.coords[1]}</span></div>
    <div class="detail-item"><span><strong>Tanggal</strong></span><span>: ${data.tanggal}</span></div>
    <div class="detail-item"><span><strong>Surveyor</strong></span><span>: ${data.surveyor}</span></div>
    <div class="detail-item"><span><strong>Jenis PJU</strong></span><span>: ${data.jenis_pju}</span></div>
    <div class="detail-item"><span><strong>Sumber</strong></span><span>: ${data.sumber}</span></div>
    <div class="detail-item"><span><strong>Jenis Beban</strong></span><span>: ${data.jenis_beban}</span></div>
    <div class="detail-item"><span><strong>Daya</strong></span><span>: ${data.daya_watt} Watt</span></div>
    <div class="detail-item"><span><strong>Koordinat (E)</strong></span><span>: ${data.e_tikor}</span></div>
    <div class="detail-item"><span><strong>Jenis Beban (E)</strong></span><span>: ${data.e_jenis_beban}</span></div>
    <div class="detail-item"><span><strong>Daya (E)</strong></span><span>: ${data.e_daya_watt} Watt</span></div>
    <div class="detail-item"><span><strong>Jenis PJU (E)</strong></span><span>: ${data.e_jenis_pju}</span></div>
    <div class="detail-item"><span><strong>IDPEL</strong></span><span>: ${data.e_idpel}</span></div>
    <div class="detail-item"><span><strong>Daya PLG (VA)</strong></span><span>: ${data.e_daya_plg_va}</span></div>
  `;
  
  // Show panel immediately
  infoPanel.classList.remove("hidden");
  
  // Fetch address asynchronously and update when available
  getAddress(data.coords[0], data.coords[1]).then(address => {
    const addressElement = document.getElementById('address-value');
    if (addressElement) {
      addressElement.textContent = ': ' + address;
    }
  });
}

// Fungsi untuk mendapatkan alamat dari koordinat
async function getAddress(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        return data.display_name || 'Alamat tidak ditemukan';
    } catch (error) {
        console.error('Error fetching address:', error);
        return 'Gagal memuat alamat';
    }
}


// Tambahkan marker ke peta
pjuData.forEach((item) => {
  // Create marker
  const marker = L.marker(item.coords).addTo(map);
  markers[item.id] = marker; // Simpan marker dengan ID sebagai key

  // Create tooltip instead of popup for hover
  marker.bindTooltip(`
    <div style="text-align:center; max-width:120px;">
      <img src="${item.foto}" alt="Foto PJU" style="width:80px; height:auto; margin-bottom:5px; display:block; margin:0 auto;">
      <div style="font-weight:bold;">${item.desa}</div>
      <div style="font-size:10px; color:#666;">${item.coords[0].toFixed(6)}, ${item.coords[1].toFixed(6)}</div>
    </div>
  `, {
    direction: 'top',
    offset: [0, -10],
    opacity: 0.9
  });

  // Show detailed info on click
  marker.on("click", (e) => {
    showPjuDetails(item);
    // Hentikan event click agar tidak menyebar ke map dan menyembunyikan panel
    L.DomEvent.stopPropagation(e);
  });
});

// Sembunyikan panel saat peta diklik di luar marker
map.on("click", () => {
  infoPanel.classList.add("hidden");
});

// Sembunyikan panel saat pertama kali dimuat
infoPanel.classList.add("hidden");

// Fungsi untuk melakukan pencarian
function searchLocation() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const results = pjuData.filter(item =>
    item.id.toString().includes(query) ||
    item.desa.toLowerCase().includes(query) ||
    item.kecamatan.toLowerCase().includes(query)
  );

  if (results.length > 0) {
    const firstResult = results[0];
    map.setView(firstResult.coords, 18); // Zoom ke lokasi hasil pertama
    markers[firstResult.id].openPopup(); // Buka popup
    showPjuDetails(firstResult); // Tampilkan detail di panel
  } else {
    alert('Lokasi tidak ditemukan.');
  }
}

// Tambahkan event listener ke tombol cari
document.getElementById('search-button').addEventListener('click', searchLocation);

// Tambahkan event listener untuk tombol Enter di input pencarian
document.getElementById('search-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchLocation();
  }
});


// Function to calculate distance between two coordinates in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Function to format distance
function formatDistance(distance) {
  if (distance >= 1000) {
    return (distance / 1000).toFixed(2) + ' km';
  } else {
    return Math.round(distance) + ' m';
  }
}

// Connect all markers with lines and add distance labels
const polylines = [];
const bounds = L.latLngBounds();

// Create lines between all pairs of points
for (let i = 0; i < pjuData.length; i++) {
  bounds.extend(pjuData[i].coords);
  
  for (let j = i + 1; j < pjuData.length; j++) {
    const point1 = pjuData[i].coords;
    const point2 = pjuData[j].coords;
    
    // Calculate distance
    const distance = calculateDistance(point1[0], point1[1], point2[0], point2[1]);
    const formattedDistance = formatDistance(distance);
    
    // Create polyline
    const polyline = L.polyline([point1, point2], {color: 'red', weight: 2}).addTo(map);
    polylines.push(polyline);
    
    // Add distance label
    const midPoint = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
    const distanceLabel = L.marker(midPoint, {
      icon: L.divIcon({
        className: 'distance-label',
        html: `<div class="distance-text">${formattedDistance}</div>`,
        iconSize: [80, 20],
        iconAnchor: [40, 10]
      })
    }).addTo(map);
  }
}

// Zoom the map to fit all markers
map.fitBounds(bounds);
