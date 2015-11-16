var map, featureList, hospitalSearch = [], spechospitalSearch = [],psycentreSearch = [],psyotherSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(province.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});



$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  psyhospital.eachLayer(function (layer) {
    if (map.hasLayer(psyhospitalLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #f42112;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through spechospital layer and add only features which are in the map bounds */
  spechospital.eachLayer(function (layer) {
    if (map.hasLayer(spechospitalLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #30ed01;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  //CSM
   psycentre.eachLayer(function (layer) {
    if (map.hasLayer(psycentreLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #0038ed;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  //ALTRI
  psyother.eachLayer(function (layer) {
    if (map.hasLayer(psyotherLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #ff9501;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var mapquestOSM = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});


/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var province = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#0000FF",
      fill: false,
	  weight: 1,
     "opacity":0.8,
        dashArray: '3',
      clickable: false
    };
  },
});
//var province_topo = omnivore.topojson('data/reg2011.topojson',null, province);
var province_topo = omnivore.topojson('data/prov2011.json',null, province);




/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  maxClusterRadius: 50,
  //disableClusteringAtZoom: 16
});

var psy_icon = L.MakiMarkers.icon({icon: "hospital", color: "#f42112", size: "m"});
var psyspec_icon = L.MakiMarkers.icon({icon: "hospital", color: "#30ed01", size: "m"});
var psycentre_icon = L.MakiMarkers.icon({icon: "hospital", color: "#0038ed", size: "m"});
var psyother_icon = L.MakiMarkers.icon({icon: "hospital", color: "#ff9501", size: "m"});



/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var psyhospitalLayer = L.geoJson(null);
var psyhospital = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
	return L.marker(latlng, {
	  icon:psy_icon,
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Psychiatric beds</th><td>" + (+feature.properties.acute_subacute + +feature.properties.reha_beds + +feature.properties.chronic_long_beds + +feature.properties.spec_beds) + "</td></tr>" + "<tr><th>Province</th><td>" + feature.properties.province + "</td></tr>" + 
	  "<tr><th>Type</th><td>"+ feature.properties.type_h +" </td></tr></table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #f42112;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      hospitalSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADDRESS1,
        source: "Pychiatric_hospital_department",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/cephos_d_hospital.geojson", function (data) {
  psyhospital.addData(data);
  map.addLayer(psyhospitalLayer);
});

/* Empty layer placeholder to add to layer control for listening when to add/remove spechospital to markerClusters layer */
var spechospitalLayer = L.geoJson(null);
var spechospital = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: psyspec_icon,
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
     var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Psychiatric beds</th><td>" + (+feature.properties.acute_subacute + +feature.properties.reha_beds + +feature.properties.chronic_long_beds + +feature.properties.spec_beds) + "</td></tr>" + "<tr><th>Province</th><td>" + feature.properties.province + "</td></tr>" + 
	  "<tr><th>Type</th><td>"+ feature.properties.type_h +" </td></tr></table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #30ed01;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      spechospitalSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.address,
        source: "Specialist_psychiatric_hospital",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/cephos_spec_hospital.geojson", function (data) {
  spechospital.addData(data);
});
////CSM
var psycentreLayer = L.geoJson(null);
var psycentre = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: psycentre_icon,
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
     var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Psychiatric beds</th><td>" + (+feature.properties.acute_subacute + +feature.properties.reha_beds + +feature.properties.chronic_long_beds + +feature.properties.spec_beds) + "</td></tr>" + "<tr><th>Province</th><td>" + feature.properties.province + "</td></tr>" + 
	  "<tr><th>Type</th><td>"+ feature.properties.type_h +" </td></tr></table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: #0038ed;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      psycentreSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.address,
        source: "Psychiatric_centre_CSM",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/cephos_psycentre.geojson", function (data) {
  psycentre.addData(data);
});


////OTHER
var psyotherLayer = L.geoJson(null);
var psyother = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: psyother_icon,
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
     var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Name</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>Address</th><td>" + feature.properties.address + "</td></tr>" + "<tr><th>Psychiatric beds</th><td>" + (+feature.properties.acute_subacute + +feature.properties.reha_beds + +feature.properties.chronic_long_beds + +feature.properties.spec_beds) + "</td></tr>" + "<tr><th>Province</th><td>" + feature.properties.province + "</td></tr>" + 
	  "<tr><th>Type</th><td>"+ feature.properties.type_h +" </td></tr></table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><i class="fa fa-plus-square fa-2x" style="color: ##ff9501;"></i></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      psyotherSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.address,
        source: "Psychiatric_other",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/cephos_other.geojson", function (data) {
  psyother.addData(data);
});



map = L.map("map", {
  zoom: 5,
  center: [45.2549211423,10.5983881491],
  layers: [mapquestOSM, province_topo, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === psyhospitalLayer) {
    markerClusters.addLayer(psyhospital);
    syncSidebar();
  }
  if (e.layer === spechospitalLayer) {
    markerClusters.addLayer(spechospital);
    syncSidebar();
  }
   if (e.layer === psycentreLayer) {
    markerClusters.addLayer(psycentre);
    syncSidebar();
  }
  if (e.layer === psyotherLayer) {
    markerClusters.addLayer(psyother);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === psyhospitalLayer) {
    markerClusters.removeLayer(psyhospital);
    syncSidebar();
  }
  if (e.layer === spechospitalLayer) {
    markerClusters.removeLayer(spechospital);
    syncSidebar();
  }
  if (e.layer === psycentreLayer) {
    markerClusters.removeLayer(psycentre);
    syncSidebar();
  }
   if (e.layer === psyotherLayer) {
    markerClusters.removeLayer(psyother);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'></span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);



/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": mapquestOSM
};

var groupedOverlays = {
  "Pychiatric services with beds": {
    "<i class='fa fa-plus-square fa-2x' style='color: #f42112;'></i>&nbsp;Pychiatric hospital department": psyhospitalLayer,
	"<i class='fa fa-plus-square fa-2x' style='color: #30ed01;'></i>&nbsp;Specialist psychiatric hospital": spechospitalLayer,
	"<i class='fa fa-plus-square fa-2x' style='color: #0038ed;'></i>&nbsp;Psychiatric centre/community mental health centre": psycentreLayer,
	"<i class='fa fa-plus-square fa-2x' style='color: #ff9501;'></i>&nbsp;Other specialised hospitals/departments for psychiatric patients": psyotherLayer
  },
  "Reference": {
    "Province": province_topo
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  map.fitBounds(province_topo.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});



  var psyhospitalBH = new Bloodhound({
    name: "Pychiatric_hospital_department",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: hospitalSearch,
    limit: 10
  });

  var spechospitalBH = new Bloodhound({
    name: "Specialist_psychiatric_hospital",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: spechospitalSearch,
    limit: 10
  });

   var psycentreBH = new Bloodhound({
    name: "Psychiatric_centre_CSM",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: psycentreSearch,
    limit: 10
  });
  
   var psyotherBH = new Bloodhound({
    name: "Psychiatric_other",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: psyotherSearch,
    limit: 10
  });
  
  
  psyhospitalBH.initialize();
  spechospitalBH.initialize();
  psycentreBH.initialize();
  psyotherBH.initialize();



  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Pychiatric_hospital_department",
    displayKey: "name",
    source: psyhospitalBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-plus-square' style='color: #f42112;'></i>&nbsp;Pychiatric hospital department</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "Specialist_psychiatric_hospital",
    displayKey: "name",
    source: spechospitalBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-plus-square' style='color: #30ed01;'></i>&nbsp;Specialist psychiatric hospital</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },{
    name: "Psychiatric_centre_CSM",
    displayKey: "name",
    source: psycentreBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-plus-square' style='color: #0038ed;'></i>&nbsp;Psychiatric centre/community mental health centre</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },
  {
    name: "Psychiatric_other",
    displayKey: "name",
    source: psyotherBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><i class='fa fa-plus-square' style='color: #ff9501;'></i>&nbsp;Other specialised hospitals/departments for psychiatric patients</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Province") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Pychiatric_hospital_department") {
      if (!map.hasLayer(psyhospitalLayer)) {
        map.addLayer(psyhospitalLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Specialist_psychiatric_hospital") {
      if (!map.hasLayer(spechospitalLayer)) {
        map.addLayer(spechospitalLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	if (datum.source === "Psychiatric_centre_CSM") {
      if (!map.hasLayer(psycentreLayer)) {
        map.addLayer(psycentreLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	if (datum.source === "Psychiatric_other") {
      if (!map.hasLayer(psyotherLayer)) {
        map.addLayer(psyotherLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
	
	
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
