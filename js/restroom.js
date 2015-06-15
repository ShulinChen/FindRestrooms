//gain tons of inspiration from https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
function initialize() {
  
  
  //to initialize the defalut map.
  var option = {
  	center: new google.maps.LatLng(37.6, -95.665),
  	zoom: 5,
  	mapTypeId: google.maps.MapTypeId.ROADMAP,
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), option);

  

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
	var addr = $("#pac-input").val();

    if (addr.length == 0) {
      return;
    }

    //use Google Maps Geocoding Service to do get the lat and lon of the given addr
    //for reference: https://developers.google.com/maps/documentation/javascript/geocoding
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: addr}, function(results, status){
      var lat = results[0].geometry.location.A;
      var lon = results[0].geometry.location.F;
      var location = results[0].geometry.location;
      var bounds = new google.maps.LatLngBounds();
      var infowindow = null;
      // alert(lat + ":" + lon);

      //refer to http://www.refugerestrooms.org/api/docs/#!/restrooms/GET_version_restrooms_by_location_format
 	  $.ajax({
 	  	method: "GET",
 	  	datatype: "json",
 	  	contentType: "application/json; charset=utf-8",
 	  	url: "http://www.refugerestrooms.org:80/api/v1/restrooms/by_location.json?lat=" + lat + "&lng=" + lon,
 	  	success: function(info) {
 	  		for (var i = 0; i < info.length; i++) {
 	  			var placeName = info[i].name;
 	  			var address = info[i].street + ", " + info[i].city + ", " + info[i].state;
 	  			var comment = info[i].comment;
 	  			comment = comment || "No comments yet";  
 	  			var currentLocation = new google.maps.LatLng(info[i].latitude, info[i].longitude);
 	  			// console.log(info[i].latitude + ":" + info[i].longitude);
 	  			var googlelink = "http://maps.google.com/?q=" + address;
 	  			googlelink = googlelink.replace(/\s/g, '');
 	  			console.log((googlelink));
 	  			console.log('<a href= ' + googlelink + '> Get There </a>');


 	  			var marker = new google.maps.Marker({
 	  				map: map,
 	  				title: placeName,
 	  				position: currentLocation,
 	  				content : '<div id="infowindow">' +
								'<h1>' + placeName + '</h1>' + 
								'<h3>' + address + '<a href= ' + googlelink + '>  Get There </a>' + '</h3>' +
								'<p>' + comment + '</p>' +
							'</div>'
 	  				// icon: "img/restroom.jpg",
 	  			});
 	  		

 	  			//make sure only one window opens at a time
 	  			if (infowindow) {
					infowindow.close();
				}

				

				infowindow = new google.maps.InfoWindow();
		
			
				google.maps.event.addListener(marker, 'click', function() {
   					infowindow.setContent(this.content);
   					infowindow.open(map, marker);
  				});


				// console.log(placeName);
 	  			bounds.extend(currentLocation);
 	  			map.fitBounds(bounds);
 	  		} //end of for loop	  	
 	  	}
 	  });//end of ajax
	 
    }); // end of geocode callback
  });
  
}	

google.maps.event.addDomListener(window, 'load', initialize);
