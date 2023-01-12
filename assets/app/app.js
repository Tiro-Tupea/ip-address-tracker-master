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

    
    const get_ip_info = async (ipToLocate =  '') => {
        try {
        const res = await fetch(`${geo_loc_URL}&=${checkIpAddress.test (ipToLocate) ? `ipAddress=${ipToLocate}` : "" }`);
        const data = await res.json();
        return data;
        }
        catch(eror){
            console.log(error)
            //alert('Enable to find given domain or ip');
        }
    };

    const get_domain_info = async (domainToLocate =  '') => {
        try {

        const res = await fetch(`${geo_loc_URL}&${checkDomain.test (domainToLocate) ? `domain=${domainToLocate}` : "" }`);
        const data = await res.json();

        return updateMap(data);
        }
        catch(error){
            console.log(error)
            //alert('Enable to find given domain or ip');
        }
    };



    const updateMap = (data) => {
        
        const { ip, location, isp } = data;//ref the data response as object

        map.flyTo([location.lat, location.lng], 8);//change map location
        // card info
        ipResult.innerHTML    = ip;
        ispResult.innerHTML   = isp;
        locResult.innerHTML   = `${location.region} ${location.city}` +' '+ `${location.postalCode}`;
        timerResult.innerHTML = `UTC${location.timezone}`;   

        if(!marker){// create the marker on the map
            marker = L.marker([location.lat, location.lng],{icon: markerIcon}).addTo(map)  ;
        }else {// move the marker on the mape
            marker.setLatLng([location.lat, location.lng]);
        }
      
    };

    formInput.addEventListener('submit', (e)=>{
        e.preventDefault();
        
    });

   get_domain_info('');
}