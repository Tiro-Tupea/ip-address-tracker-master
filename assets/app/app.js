window.onload = () => {
    
    const protocol    = window.location.protocol === 'https' ? 'ws://' : 'wss=//';
    const adress      = protocol + window.location.host + window.location.pathname + '/ws';

    const ipResult    = document.querySelector('.ip');
    const locResult   = document.querySelector('.location');
    const timerResult = document.querySelector('.time-zone');
    const ispResult   = document.querySelector('.isp');
    const srchBtn     = document.querySelector('.search-btn');
    const srchBar     = document.querySelector('input[type=text]');

    srchBar.addEventListener('keypress', (e)=>{
        let userVal = srchBar.value;
        if (e.keyCode === 13) {
            e.preventDefault();
            getIpInfo();
            srchBar.value = '';
        }
    });
     

    //initialise the map
    var map = L.map('map').setView([0, 0], 3);//set the location map

    var marker = L.marker([0,0]).addTo(map);// set the marker on th map
    var popup = L.popup();//set popup by clicking on the map
    
    //display the map on the page 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);
    getIpInfo();

    
    function getIpInfo () {
        fetch('https://geo.ipify.org/api/v2/country,city?apiKey=at_VRIs0F5PG0aWF3n5Dt7P2DIuPwWfo&ipAddress=8.8.8.8').then(reponse => {
            return reponse.json();
        }).then(ipData => {

        ipResult.innerHTML    = `${ipData.ip}`;
        const ipLocation      = ipData.location;
        locResult.innerHTML   = `${ipLocation.region} <br> ${ipLocation.city}` +' '+ `${ipLocation.postalCode}`;
        timerResult.innerHTML = `UTC${ipLocation.timezone}`;
        ispResult.innerHTML   = `${ipData.isp}`;

        marker.setLatLng([ipData.location.lat, ipData.location.lng]);
        map.setView([ipData.location.lat, ipData.location.lng]);

        }).catch(error => {
            console.log(error);
        })  

        
    }

    
}