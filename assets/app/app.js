window.onload = () => {
    
    const apiKey = "at_VRIs0F5PG0aWF3n5Dt7P2DIuPwWfo";
    const geo_loc_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`

    const ipResult    = document.querySelector('.ip');
    const locResult   = document.querySelector('.location');
    const timerResult = document.querySelector('.time-zone');
    const ispResult   = document.querySelector('.isp');
    const srchBtn     = document.querySelector('.search-btn');
    const srchBar     = document.querySelector('input[type=text]');
    const markerIcon = L.icon({
        iconUrl: './assets/images/icon-location.svg',
        iconSize: [30, 40],
      });
      
     

    //initialise the map

    let marker;
    var map = L.map('map').setView([0, 0], 3);//set the location map
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
    

    
    const get_ip_info = async (ipToLocate =  '') => {
        try {

        const res = await fetch(`${geo_loc_URL}&ipAdress=${ipToLocate}`);
        const ipData = await res.json();
        updateMap(ipData);
        }
        catch{
            console.log(error);
            alert('Enable to find given domain or ip');
        }

        
    };

    const get_domain_info = async (domainToLocate =  '') => {
        try {

        const res = await fetch(`${geo_loc_URL}&ipAdress=${domainToLocate}`);
        const ipData = await res.json();
        updateMap(ipData);
        }
        catch{
            console.log(error);
            alert('Enable to find given domain or ip');
        }

        
    };



    const updateMap = (ipData) => {

        map.setView([ipData.location.lat, ipData.location.lng]);

        if(!marker){
            marker = L.marker([ipData.location.lat, ipData.location.lng],{icon: markerIcon}).addTo(map)  ;
        }else {
            marker.setLatLng([ipData.location.lat, ipData.location.lng]);
        }
            
        ipResult.innerHTML    = `${ipData.ip}`;
        const ipLocation      = ipData.location;
        locResult.innerHTML   = `${ipLocation.region} <br> ${ipLocation.city}` +' '+ `${ipLocation.postalCode}`;
        timerResult.innerHTML = `UTC${ipLocation.timezone}`;
        ispResult.innerHTML   = `${ipData.isp}`;   
    };

    srchBar.addEventListener('keypress', (e)=>{
        let userVal = srchBar.value;
        if (e.keyCode === 13) {
            e.preventDefault();
            get_ip_info();
            get_domain_info();
            srchBar.value = '';
        }
    });

    get_ip_info();
}