window.onload = (e) => {
    e.preventDefault();
    
    const apiKey = "at_RyQrSOg8Wfv6DGEf7mC5tCkBXo85l";
    const geo_loc_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`

    const ipResult    = document.querySelector('.ip');
    const locResult   = document.querySelector('.location');
    const timerResult = document.querySelector('.time-zone');
    const ispResult   = document.querySelector('.isp');
    const srchBar     = document.querySelector('input[type=text]');
    const formInput   = document.querySelector('#form-input');

    const markerIcon = L.icon({
        iconUrl: './assets/images/icon-location.svg',
        iconSize: [30, 40],
      });
      
     

    //initialise the map

    let marker;
    let map = L.map('map').setView([0, 0], 3);//set the location map
    
    //display the map on the page 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    
    const get_ip_info = async (ipToLocate =  '') => {
        try {
        const res = await fetch(`${geo_loc_URL}&ipAdress=${ipToLocate}`);
        const ipData = await res.json();
        updateMap(ipData);
        }
        catch{
            //alert('Enable to find given IP');
        }        
    };

    const get_domain_info = async (domainToLocate =  '') => {
        try {

        const res = await fetch(`${geo_loc_URL}&ipAdress=${domainToLocate}`);
        const ipData = await res.json();

        updateMap(ipData);
        }
        catch{
            //alert('Enable to find given domain or ip');
        }
    };



    const updateMap = (data) => {
        
       

        const { ip, location, isp } = data;//ref the data respnse as object

        // card info
        ipResult.innerHTML    = ip;
        ispResult.innerHTML   = isp;
        locResult.innerHTML   = `${location.region} ${location.city}` +' '+ `${location.postalCode}`;
        timerResult.innerHTML = `UTC${location.timezone}`;   

        map.setView([location.lat, location.lng]);

        if(!marker){// create the marker on the map
            marker = L.marker([location.lat, location.lng],{icon: markerIcon}).addTo(map)  ;
        }else {// move the marker on the mape
            marker.setLatLng([location.lat, location.lng]);
        }
        
        map.flyTo([location.lat, location.lng], 8);//change map location

       
            
        
    };

    formInput.addEventListener('submit', (e)=>{
        let userVal = srchBar.value;
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        const IP_OR_DOMAIN = data['search-bar'];
        const ip_regexp = new RegExp(
          /(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d{1})/g,
        );
      
        if (ip_regexp.test(IP_OR_DOMAIN)) get_ip_info(IP_OR_DOMAIN);
        else get_domain_info(IP_OR_DOMAIN);
    });

   get_ip_info();
}