window.onload = (e) => {
    e.preventDefault();
    
    const apiKey = "at_RyQrSOg8Wfv6DGEf7mC5tCkBXo85l";
    const geo_loc_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;

    const ipResult    = document.querySelector('.ip');
    const locResult   = document.querySelector('.location');
    const timerResult = document.querySelector('.time-zone');
    const ispResult   = document.querySelector('.isp');

    const srchBar     = document.getElementById('search-bar');
    const formInput   = document.querySelector('#form-input');

    const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
    const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

    const markerIcon = L.icon({
        iconUrl: './assets/images/icon-location.svg',
        iconSize: [30, 40],
      });
      
     

    //initialise the map

    let marker;
    let map = L.map('map', {zoomControl: false}).setView([0, 0], 8);//set the location map
    
    //display the map on the page 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Get api data 
    const get_data = async (ip_or_domain = '') => {
        try {
            const response = await fetch(`${geo_loc_URL}&${
                //check the user values
                checkIpAddress.test(ip_or_domain) ? `ipAddress=${ip_or_domain}` : checkDomain.test(ip_or_domain)
                ? `domain=${ip_or_domain}` : "" }`);

            const data = await response.json();
            console.log(data);
            updateMap(data);
        } catch(error) {
            console.log(error);
        }

    };



    function updateMap(data) {

        const { ip, location, isp } = data; //ref the data response as object

        map.flyTo([location.lat, location.lng], 8); //change map location

        // card info
        ipResult.innerHTML = ip;
        ispResult.innerHTML = isp;
        locResult.innerHTML = `${location.region} ${location.city}` + ' ' + `${location.postalCode}`;
        timerResult.innerHTML = `UTC${location.timezone}`;

        if (!marker) { // create the marker on the map
            marker = L.marker([location.lat, location.lng], { icon: markerIcon }).addTo(map);
        } else { // move the marker on the mape
            marker.setLatLng([location.lat, location.lng]);
        }

    }

    formInput.addEventListener('submit', (e)=>{
        let data = srchBar.value;
        e.preventDefault();
        get_data(data);
        
    });

    //default Api value 
    get_data('');
   
}