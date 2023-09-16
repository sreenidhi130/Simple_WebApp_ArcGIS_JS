/*
 ------------------------------------------------------------ 
Creation Date : 20-10-2022
Creator Name : Sreenidhi S
Version No. : 1
Major changes 
=============
 20-10-2022 Sreenidhi Code Organization
*/

require(["esri/config",
    "esri/Map",
    "esri/widgets/Sketch",
    "esri/widgets/LayerList",
    "esri/widgets/ScaleBar",
    "esri/widgets/Measurement",
    "esri/widgets/Compass",
    "esri/widgets/FeatureTable",
    "esri/widgets/Locate",
    "esri/widgets/Track",
    "esri/Graphic",
    "esri/rest/query",
    "esri/rest/support/Query",
    "esri/widgets/Editor",
    "esri/widgets/Search",
    "esri/widgets/Home",
    "esri/views/draw/Draw",
    "esri/geometry/geometryEngine",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/geometry/geometryEngineAsync",
    "esri/widgets/LayerList/ListItem",
    "esri/layers/MapImageLayer",
    "esri/widgets/Expand",
    "esri/widgets/FeatureForm",
    "esri/widgets/FeatureTemplates",
    "esri/rest/identify",
    "esri/rest/support/IdentifyParameters",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Legend",
    "esri/widgets/BasemapGallery",
    "esri/views/MapView"], (esriConfig,
        Map,
        Sketch,
        LayerList,
        ScaleBar,
        Measurement,
        Compass,
        FeatureTable,
        Locate,
        Track,
        Graphic,
        query,
        Query,
        Editor,
        Search,
        Home,
        Draw,
        geometryEngine,
        SketchViewModel,
        geometryEngineAsync,
        ListItem,
        MapImageLayer,
        Expand,
        FeatureForm,
        FeatureTemplates,
        identify,
        IdentifyParameters,
        FeatureLayer, GraphicsLayer, Legend, BasemapGallery, MapView) => {
    let editFeature, highlights = [];
    var featurelayer_Obj = []
    var queryStations;
    var SpatialQryLAYER
    let CurrentPrj_Lyr



    //Config key to access a resource or service.
    esriConfig.apiKey = data_new.apiKey


    const popupTrailCurrentProject = {
        "title": "Current Projet Info",
        "content": "<b>Project ID:</b> {project_id}<br><b>Project Name:</b> {project_na}<br><b>Project Type:</b> {project_ty}<br><b>Ward:</b> {ward}<br><b>Project Status:</b> {status} "
    }
    const popupTrailMosquito = {
        "title": "Mosquto net Info",
        "content": "<b>Name:</b> {name}<br><b>Folder Path:</b> {folderpath}<br><b>Project ID:</b> {project_id}<br><b>Ward:</b> {ward}<br><b>Category:</b> {category} "
    }
    const popupDrinkingWaterKiosk = {
        "title": "Drinking water kiosk Info",
        "content": "<b>Name:</b> {Name}<br><b>Description :</b> {descriptio}<br><b>Status:</b> {Status}<br><b>Project Status:</b> {Pro_Status}"
    }
    const popupParkingLOT = {
        "title": "PARKING LOT",
        "content": "<b>Name:</b> {name}<br><b>Description :</b> {descriptio}<br><b>Type:</b> {Type}<br><b>Count</b> {Count}"
    }
    const popuptemplate_BusShelter = {
        "title": 'Bus Shelter',
        "content": "<b>Name:</b> {name}<br><b>Description :</b> {descriptio}"
    }


    const graphicslayer = new GraphicsLayer()
    const selectFeature = $('#selectFeature');
    // const selectFeature = document.getElementById('selectFeature');
    var layer_Array = dataconfig.url;
    var layer_array_1 = data_new;
    const keys = Object.keys(data_new.url);

    Object.entries(data_new.url).forEach(([lyrName, lyrURL]) => {
        // selectFeature.innerHTML += "<option value=" + lyrURL + ">" + lyrName + "</option>";
        const featurelyr = new FeatureLayer({
            id: lyrName,
            url: lyrURL
        });
        featurelayer_Obj.push(featurelyr)
    })
    const resultsLayer = new GraphicsLayer();
    let map = new Map({
        basemap: "topo-vector",
        //basemap: "gray",
        layers: featurelayer_Obj
    });

    map.layers.push(graphicslayer)

    const view = new MapView({
        map: map,
        center: [76.937, 8.509], // Longitude, latitude
        zoom: 11, // Zoom level
        // basemap: Imagery,
        container: "viewDiv", // Div element
        popup: {
            highlightEnabled: true,
            // dockEnabled: true,
            // dockOptions: {
            //     breakpoint: false
            //     // position: "top-right"
            // }
        },
        highlightOptions: {
            // color: [0, 255, 106],
            color: [0, 255, 0],
            size: 20,
            outline: {
                color: [0, 255, 106]
            },
            fillOpacity: 0.1
        }
    });

    //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAPPLY.............EDITSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    const ParkingLot_renderer_point = {
        type: "unique-value",
        legendOptions: {
            title: "ParkingLot Categories"
        },
        field: "type",
        uniqueValueInfos: [{
            value: "Car",
            label: "Car",
            symbol: {
                type: "simple-fill",
                color: "#e6d800",
                //   width: "6px",
                style: "solid"
            }

        }, {
            value: "Bike",
            label: "Bike",
            symbol: {
                type: "simple-fill",
                color: "#e60049",
                //   width: "6px",
                style: "solid"
            }

        }, {
            value: "Car and Bike",
            label: "Car and Bike",
            symbol: {
                type: "simple-fill",
                color: "#9b19f5",
                //   width: "6px",
                style: "solid"
            }

        }],

    };

    var ParkingLot_renderer_picture = {
        type: "unique-value",
        legendOptions: {
            title: "ParkingLot Categories"
        },
        field: "type",
        uniqueValueInfos: [{
            value: "Car",
            label: "Car",
            symbol: {
                type: "picture-marker",
                url: "pics/car_parkin1.png",
                width: "20px",
                height: "20px",
                // xoffset: "5px",
                // yoffset: "5px"
            },

        }, {
            value: "Bike",
            label: "Bike",
            symbol: {
                type: "picture-marker",
                url: "pics/bike.png",
                width: "20px",
                height: "20px",
                // xoffset: "20px",
                // yoffset: "5px"
            }

        }, {
            value: "Car and Bike",
            label: "Car and Bike",
            symbol: {
                type: "picture-marker",
                url: "pics/carandbike.jpg",
                width: "20px",
                height: "20px",
                // xoffset: "5px",
                // yoffset: "5px"
            }

        }],
    }

    //Buffer 
    let bufferEnabled = false
    const polySym = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [140, 140, 222, 0.5],
        fillOpacity: 0.6,
        outline: {
            color: [0, 0, 0, 0.5],
            width: 2
        }
    };
    const pointSym = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [255, 0, 0],
        outline: {
            color: [255, 255, 255],
            width: 1
        },
        size: 7
    };
    // const bufferLayer = new GraphicsLayer();
    const pointLayer = new GraphicsLayer();
    const bufferLayer = new GraphicsLayer({
    });

    // add graphic to map
    graphicslayer.add(bufferLayer);
    graphicslayer.add(pointLayer);
    map.addMany([bufferLayer, pointLayer]);


    /** When click event is triggeredon view, then buffering is enabled.
    * @param {Object} event - The event object associated with the
    *  key-down event..
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
     */
    function bufferStatus(event) {
        if (!bufferEnabled) {
            const keyInput = event.mapPoint;
            if (keyInput) {
                bufferEnabled = true
                bufferPoint(keyInput)
            }
            else {
                bufferEnabled = false
            }
        }

    }
    /** 
    * Method buffers the given point by 5 kilometers 
     *@param {esri/geometry/Point} point - A point instance to buffer.
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */

    function bufferPoint(point) {
        if (!bufferEnabled) {
            console.log(
                "buffering not enabled. Hit the Shift key and click/drag to buffer."
            );
            return;
        }
        clearGraphics();

        point.hasZ = false;
        point.z = undefined;

        pointLayer.add(
            new Graphic({
                geometry: point,
                symbol: pointSym
            })
        );
        const buffer = geometryEngine.geodesicBuffer(
            point,
            5,
            "kilometers"
        );
        bufferLayer.add(
            new Graphic({
                geometry: buffer,
                symbol: polySym
            })
        );
    }

    function clearGraphics() {
        pointLayer.removeAll();
        bufferLayer.removeAll();
    }

    /**
     * Stops propagation on the given event and constructs a point for
     * buffering.
     * @param {Object}   event - Event object containing XY screen coordinates.
     * @param {Mapview} view - View instance from which the point was obtained.
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */

    function createBuffer(event, view) {
        event.stopPropagation();

        // convert screen coordinates to map coordinates
        const point = view.toMap({
            x: event.x,
            y: event.y
        });

        if (point) {
            bufferPoint(point);
        }
    }

    //checking promise
    view.when(function () {
        // This function will execute once the promise is resolved
        map.layers.forEach((layer) => {
            view.whenLayerView(layer)
                .then(function (layerView) {
                    // The layerview for the layer

                    if (layer.id == 'Current Project') {
                        CurrentPrj_Lyr = layer
                        // identifyURL = layer.url
                    }
                    if (layer.id == 'parkinglot') {
                        // layer.popupTemplate = popupParkingLOT
                        // identifyURL = layer.url
                        // layer.renderer = ParkingLot_renderer_point
                        layer.popupTemplate = popupParkingLOT
                        layer.renderer = ParkingLot_renderer_picture
                        console.log(layer.loadStatus)

                    } if (layer.id == 'mosqito') {
                        layer.popupTemplate = popupTrailMosquito
                    }
                    if (layer.id == 'Bus Shelter') {
                        layer.popupTemplate = popuptemplate_BusShelter
                    }
                    if (layer.id == 'Drinking Water Kios') {
                        layer.popupTemplate = popupDrinkingWaterKiosk
                    }
                    if (layer.id == 'Current Project') {
                        layer.popupTemplate = popupTrailCurrentProject,
                            layer.renderer = {
                                type: "simple",  // autocasts as new SimpleRenderer()\
                                symbol: {
                                    type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
                                    url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
                                    width: "15px",
                                    height: "18px"
                                }
                            }
                    }
                })
        });

        view.on("click", bufferStatus);

        view.on("double-click", function (event) {
            bufferEnabled = false
        });

        view.on('pointer-move', ["Shift"], function (event) {
            if (bufferEnabled) {
                createBuffer(event, view);
            }
        });
    },
        function (error) {
            // This function will execute if the promise is rejected due to an error
            console.log("Error : ", error.name);
            console.log("Error Message:s ", error.message);
            console.log("Error Details: ", error.details);
        });

    const searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "top-trailing",
        index: 2
    });



    /**
* Method handles the querying of parkinglot layer
* @param {"esri/rest/support/Query"} query_input String
* @author <Sreenidhi>, HMS
* @20-10-2022: 
*/

    function PARKINGQueryFinder(query_input) {
        // view.when(() => {

        if (!(typeof query_input === 'string')) {
            if (highlights.length > 0) {
                highlights.forEach(function (highlight) {
                    highlight.remove();
                });
                highlights = [];

            }
            return true
        }

        if (map.findLayerById('parkinglot').loadStatus == "loaded") {
            const parkinglLayer = view.map.findLayerById('parkinglot')
            // highlight is set on the layerView, so we need to detect when the layerView is ready
            view.whenLayerView(parkinglLayer).then((layerView) => {
                // creates the query that will be used to obtain the features needed for the highlight
                queryStations = parkinglLayer.createQuery();
                // features that are passed in the highlight function need to have an `objectID`
                queryStations.where = query_input;
                // queryStations.where = "Type='Bike'";
                parkinglLayer.queryFeatures(queryStations).then((result) => {
                    if (highlights.length > 0) {
                        highlights.forEach(function (highlight) {
                            highlight.remove();
                        });
                        highlights = [];
                    }
                    // the feature to be highlighted
                    if (result.features.length > 0) {
                        for (i in result.features) {
                            const feature = result.features[i];

                            highlights.push(layerView.highlight(result.features)
                            )
                            view
                                .goTo(
                                    {
                                        target: feature.geometry,
                                        // tilt: 70,
                                        zoom: 13
                                    },
                                    {
                                        duration: 2000,
                                        easing: "in-out-expo"
                                    }
                                )
                                .catch((error) => {
                                    if (error.name != "AbortError") {
                                        console.error(error);
                                    }
                                });

                        }
                    }
                });
            });
            // });
        }

        else {
            console.log('The query layer has not been loaded yet, or there was an issue in loading')

        }
    }

    const editor = new Editor({
        view: view,
        layerInfos: [{
            view: view,
            // allowedWorkflows: ["update"] ,
            layer: CurrentPrj_Lyr, // pass in the feature layer,
            formTemplate: { // autocastable to FormTemplate
                elements: [
                    { // autocastable to FieldElement
                        type: "field",
                        fieldName: "projectid ",
                        label: "Project ID"
                    }
                ]
            },
            enabled: true, // default is true, set to false to disable editing functionality
            addEnabled: true, // default is true, set to false to disable the ability to add a new feature
            updateEnabled: true, // default is true, set to false to disable the ability to edit an existing feature
            deleteEnabled: true,
            snappingOptions: { // autocasts to SnappingOptions()
                enabled: false
            }// default is true, set to false to disable the ability to delete features
        }]
    });

    // Expand widget for the editArea div.
    const editExpand = new Expand({
        expandIconClass: "esri-icon-edit",
        expandTooltip: "Expand Edit",
        expanded: false,
        view: view,
        content: editor
    });


    let compass = new Compass({
        view: view
    });
    view.ui.add(compass, "top-right");

    view.ui.add(editExpand, "top-right");


    const homeBtn = new Home({
        view: view
    });


    //Locate
    const track = new Track({
        view: view,
        graphic: new Graphic({
            symbol: {
                type: "simple-marker",
                size: "12px",
                color: "green",
                outline: {
                    color: "#efefef",
                    width: "1.5px"
                }
            }
        }),
        useHeadingEnabled: false
    });


    //........xxxxxxxxxxxxxxx................ Measure Tool.................................xxxxxxxxxxxxxxxxxxxxxxx
    let activeView = view;
    const measurement = new Measurement();
    loadView();

    // The loadView() function to define the view for the widgets and div
    function loadView() {
        activeView.set({
            container: "viewDiv"
        });
        activeView.ui.add(measurement, "bottom-right");
        // Add the legend to the bottom left

        // Set the views for the widgets
        measurement.view = activeView;
    }
    //
    const switchButton = document.getElementById("switch-btn");
    const distanceButton = document.getElementById("distance");
    const areaButton = document.getElementById("area");
    const clearButton = document.getElementById("clear");

    // switchButton.addEventListener("click", () => {
    //   switchView();
    // });
    distanceButton.addEventListener("click", () => {
        distanceMeasurement();
    });
    areaButton.addEventListener("click", () => {
        areaMeasurement();
    });
    clearButton.addEventListener("click", () => {
        clearMeasurements();
    });


    /**
    * Method calculates the distance measurement used by the measuring tool
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */
    function distanceMeasurement() {
        const type = activeView.type;

        measurement.activeTool = measurement.activeTool === "distance" ? "area" : "distance";
        distanceButton.classList.add("active");
        areaButton.classList.remove("active");
    }
    /**
    * Method calculates the area measurement used by the measuring tool
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */
    function areaMeasurement() {
        measurement.activeTool = "area";
        distanceButton.classList.remove("active");
        areaButton.classList.add("active");
    }
    /**
    * Method clears the distance/area measurements calculated by the measuring tool
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */
    function clearMeasurements() {
        distanceButton.classList.remove("active");
        areaButton.classList.remove("active");
        measurement.clear();
    }

    let legend = new Legend({
        view: view,
        container: "legend_body"
    });
    document.getElementById("legend_closebtn").addEventListener("click", () => {
        document.getElementById('legend_Container').style.display = "none"
        legend.visible = false;
    });
    const tableContainer1 = document.getElementById("tableContent")
    const featureTable = new FeatureTable({
        view: view,
        // layer: layer5,
        container: tableContainer1
    });
    const parkinglot = document.getElementById("parking");

    const layer_Sel_container = document.getElementById('layer_Sel_container')
    document.getElementById('layer_selclosebtn').addEventListener('click', () => {
        layer_Sel_container.style.display = "none";
    })
    const query_layer_container = document.getElementById('query_layer_container')
    document.getElementById('queryLayer_closebtn').addEventListener('click', () => {
        query_layer_container.style.display = "none";
    })

    selectFeature.change(function () {

        var index = $("#selectFeature option").length
        // var index = selectFeature.selectedIndex

        var $option = $(this).find('option:selected');
        var value = $option.val();//to get content of "value" attrib
        var text = $option.text();//to get <option>Text</option> content

        if ($(this).children("option:selected").index() > 0) {
            document.getElementById('tableDiv').style.display = "block"
            // if(selectFeature.options[selec])
            view.map.layers.forEach(layer => {
                if ($("#selectFeature option:selected").text() == layer.id) {
                    // if(selectFeature.options[selectFeature.selectedIndex].text==layer.id){
                    featureTable.layer = layer
                }
            })

        }
    });

    parkinglot.addEventListener("change", () => {
        var index = parkinglot.selectedIndex

        if (index == 1) {
            queryinput = "Type='Car'"
            PARKINGQueryFinder(queryinput)

        }
        if (index == 2) {

            queryinput = "Type='Bike'"
            PARKINGQueryFinder(queryinput)
        }
        if (index == 3) {

            queryinput = "Type='Car and Bike'"
            PARKINGQueryFinder(queryinput)
        }
    });

    const tableWidget = document.getElementById("btn_attributeTable");

    tableWidget.addEventListener("click", () => {
        $("#selectFeature").empty();
        selectFeature.append("<option value=" + " " + "> Select Feature </option>");
        view.map.layers.forEach(layer => {

            var id = layer.id;
            var url = layer.url
            if (typeof id === 'string' && typeof url === 'string') {
                selectFeature.append("<option value=" + url + ">" + id + "</option>");
            }
            else {
                console.log('NOT STRING ')
            }
        });

        legend.visible = false;
        layerList.visible = false;
        basemapGallery.visible = false;
        sketch.visible = false;
        if (layer_Sel_container.style.display == "block") {
            layer_Sel_container.style.display = "none"
        }

        else {

            layer_Sel_container.style.display = "block"
            // document.getElementById('tableDiv').style.display = "none"
        }
        if (document.getElementById('toolbarDiv').style.display == "block") {
            document.getElementById('toolbarDiv').style.display = "none"
            document.getElementsByClassName('esri-ui-corner esri-component esri-measurement').style.display = "none"
        }
        if (query_layer_container.style.display == "block") {
            query_layer_container.style.display = "none"
        }

        if (document.getElementById('basemap_Container').style.display == "block") {
            document.getElementById('basemap_Container').style.display = "none"
        }
    });
    const btn_Measure = document.getElementById('btn_measurement');
    const toolMeasure = document.getElementById('toolbarDiv');
    document.getElementById('toolbar_closebtn').addEventListener('click', () => {
        document.getElementById('toolbarDiv').style.display = "none"
        // document.getElementsByClassName('esri-ui-corner esri-component esri-measurement').style.display = "none"

    });
    document.getElementById('distance').addEventListener('click', () => {
        document.getElementById('clear').style.display = "block"
    });
    document.getElementById('area').addEventListener('click', () => {
        document.getElementById('clear').style.display = "block"
    });

    document.getElementById('clear').addEventListener('click', () => {
        document.getElementById('clear').style.display = "none"
    });
    let basemapGallery = new BasemapGallery({
        view: view,
        container: "basemap_body"
    });

    document.getElementById("basemap_closebtn").addEventListener("click", () => {
        basemapGallery.visible = false;
        document.getElementById('basemap_Container').style.display = "none"
    })
    const sketch = new Sketch({
        layer: graphicslayer,
        view: view,
        creationMode: "continuous",
        container: "sketch_body"
    });
    document.getElementById('sketch_closebtn').addEventListener('click', () => {
        sketch.visible = false;
        document.getElementById('sketch_Container').style.display = "none"
    })
    let layerList = new LayerList({
        view: view,
        listMode: "show",
        container: "layerlist_body",
        listItemCreatedFunction: (event) => {
            const item = event.item;
            if (item.layer.type != "group") {
                // don't show legend twice
                item.panel = {
                    content: "legend",
                    open: true
                };
            }
        },

    });

    document.getElementById('layerlist_closebtn').addEventListener('click', () => {
        layerList.visible = false;
        document.getElementById('layerlist_Container').style.display = "none"
    })
    let scaleBar = new ScaleBar({
        view: view,
        style: "ruler",
        unit: "metric"
    });

    view.ui.add(homeBtn, "top-left");
    view.ui.add(track, "top-left");
    view.ui.add("btn_Legend", { position: "top-left" });
    view.ui.add("btn_Sketch", { position: "top-left" });
    view.ui.add("btn_Layerlist", { position: "top-left" });
    view.ui.add("btn_BasemapGallery", { position: "top-left" });

    view.ui.add(legend, "manual");

    view.ui.add(basemapGallery, {
        position: "manual"
    });
    view.ui.add(sketch, "manual");
    view.ui.add(document.getElementById('sketch_Container'), "manual");

    view.ui.add(btn_Measure, {
        position: "top-left"
    });
    view.ui.add(tableWidget, "top-left");
    view.ui.add(layerList, {
        position: "manual"
    });
    view.ui.add(scaleBar, {
        position: "bottom-left"
    });

    const btnLegend = document.getElementById('btn_Legend');
    const btnSketch = document.getElementById('btn_Sketch');
    const btnLayerlist = document.getElementById('btn_Layerlist');
    const btnBasemap = document.getElementById('btn_BasemapGallery');
    const btn_query = document.getElementById('btn_Query');

    legend.visible = false;
    layerList.visible = false;
    basemapGallery.visible = false;
    sketch.visible = false;
    view.ui.add(toolMeasure, "manual")
    view.ui.add(layer_Sel_container, 'manual')
    view.ui.add(query_layer_container, "manual")
    view.ui.add(btn_query, "top-left")
    btn_Measure.addEventListener("click", () => {

        if (layer_Sel_container.style.display == "block") {
            layer_Sel_container.style.display = "none"
        }
        if (query_layer_container.style.display == "block") {
            query_layer_container.style.display = "none"
        }
        if (document.getElementById('toolbarDiv').style.display == "block") {
            document.getElementById('toolbarDiv').style.display = "none"
        }
        else {
            document.getElementById('basemap_Container').style.display = "none"

            basemapGallery.visible = false;
            sketch.visible = false;
            //    if( basemapGallery.visible==true || legend.visible==true || LayerList.visible==true || sketch.visible==true){
            document.getElementById('toolbarDiv').style.display = "block"

        }

    });
    btn_query.addEventListener("click", () => {
        if (query_layer_container.style.display == "block") {
            query_layer_container.style.display = "none";
        }
        else {
            query_layer_container.style.display = "block"
        }
        if (layer_Sel_container.style.display == "block") {
            layer_Sel_container.style.display = "none"
        }
        sketch.visible = false;
    });
    btnLegend.addEventListener("click", () => {
        if (legend.visible == true && document.getElementById('legend_Container').style.display == "block") {
            document.getElementById('legend_Container').style.display = "none"
            legend.visible = false;
        }
        else {
            document.getElementById('basemap_Container').style.display = "none"
            document.getElementById('legend_Container').style.display = "block"
            document.getElementById('layerlist_Container').style.display = "none"
            layerList.visible = false;
            basemapGallery.visible = false;
            document.getElementById('toolbarDiv').style.display = "none"
            legend.visible = true;
            sketch.visible = false;
        }
    });
    btnLayerlist.addEventListener("click", () => {

        if (layerList.visible == true && document.getElementById('layerlist_Container').style.display == "block") {
            document.getElementById('layerlist_Container').style.display = "none"
            layerList.visible = false;

        }
        else {
            document.getElementById('basemap_Container').style.display = "none"
            document.getElementById('layerlist_Container').style.display = "block"
            layerList.visible = true;
            legend.visible = false;
            document.getElementById('legend_Container').style.display = "none"
            basemapGallery.visible = false;
            sketch.visible = false;
            document.getElementById('toolbarDiv').style.display = "none"
        }
    });
    btnBasemap.addEventListener("click", () => {
        document.getElementById('layerlist_Container').style.display = "none"
        document.getElementById('legend_Container').style.display = "none"
        query_layer_container.style.display = "none"
        layer_Sel_container.style.display = "none"
        if (basemapGallery.visible == true && document.getElementById('basemap_Container').style.display == "block") {
            basemapGallery.visible = false;
            document.getElementById('basemap_Container').style.display = "none"
        }
        else {
            document.getElementById('basemap_Container').style.display = "block"
            document.getElementById('toolbarDiv').style.display = "none"
            //    if( basemapGallery.visible==true || legend.visible==true || LayerList.visible==true || sketch.visible==true){
            sketch.visible = false;
            basemapGallery.visible = true;
            legend.visible = false;
            layerList.visible = false;

        }
    });
    btnSketch.addEventListener("click", () => {

        if (sketch.visible == true) {
            sketch.visible = false;
            document.getElementById('sketch_Container').style.display = "none"
        }
        else {
            sketch.visible = true;
            document.getElementById('sketch_Container').style.display = "block"
            document.getElementById('basemap_Container').style.display = "none"
            basemapGallery.visible = false;
        }
        if (query_layer_container.style.display == "block") {
            query_layer_container.style.display = "none"
        }
        if (layer_Sel_container.style.display == "block") {
            layer_Sel_container.style.display = "none"
        }
    });
    view.ui.add('clear_graphic_button', 'top-right');
    const markerSymbol = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [255, 0, 0],
        size: 8,
        outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 2
        }
    };
    const point_Graphic = {
        type: "point"// autocasts as new Point()
    };
    let graphicPolyDraw = new Graphic({
        geometry: point_Graphic,
        symbol: markerSymbol
        // 
    });

    view.graphics.add(graphicPolyDraw);
    const graphicsLayerDraw = new GraphicsLayer({
        graphics: [graphicPolyDraw]
    });
    // graphicsLayerDraw.add(graphicPolyDraw)
    map.add(graphicsLayerDraw);
    const drawPoly = new Sketch({
        view: view,
        layer: graphicsLayerDraw,
        // updateOnGraphicClick: true,
        snappingOptions: {
            enabled: false,
            featureSources: [{
                layer: graphicsLayerDraw
            }]
        },
        creationMode: "update",
        visibleElements: {
            createTools: {
                point: false,
                polyline: false,
                circle: false,
                rectangle: false
            },
            selectionTools: {
                "lasso-selection": false,
                "rectangle-selection": true,
                "polyline": false
            },
            settingsMenu: false,
            undoRedoMenu: false
        },
        // container: "draw_tool_body"
    });
    const sketchViewModel = new SketchViewModel({
        view: view,
        layer: graphicsLayerDraw,
        updateOnGraphicClick: false,
        polygonSymbol: {
            type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
            color: "rgba(0,76,115,0.04)",

            outline: { // autocasts as new SimpleLineSymbol()
                color: "black",
                width: 1
            }
        },
        defaultUpdateOptions: {
            enableRotation: false,
            toggleToolOnClick: false
        }
    })
    sketchViewModel.on("create-complete", function (event) {
        // create a graphic with the completed geometry and add it to graphicslayer.
        console.log("completds")
    });
    sketchViewModel.on("create", async (event) => {
        //view.graphics.removeAll();
        // if(count_event==0){
        if (event.state === "complete") {
            // this polygon will be used to query features that intersect it
            const geometries = graphicsLayerDraw.graphics.map(function (graphic) {
                console.log("completds")
                // count_event+=1;
                // sketchViewModel.delete();
                return graphic.geometry;

            });
            const queryGeometry = await geometryEngineAsync.union(
                geometries.toArray()
            );
            queryFeaturelayer(queryGeometry);
        }
    });

    /**
    * Method handles the spatial query which computes a spatialrelationship of the passed
     geometry with the features intersected by it
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */
    function queryFeaturelayer(geometry) {

        const spatialQuery = {
            // queryinput = "Type='Car'"


            // the point location of the pointer
            // distance: 0.5,
            // units: "miles",
            spatialRelationship: "intersects", // Relationship operation to apply

            geometry: geometry,  // The sketch feature geometry
            outFields: ["*"],
            // objectIds:["OBJECTID"],// Attributes to return
            returnGeometry: true

        };

        SpatialQryLAYER.queryFeatures(spatialQuery)
            .then((results) => {

                console.log("Feature count: " + results.features.length)
                document.getElementById('selectedCount').innerHTML = results.features.length + " " + "feautres selected"
                displayResults(results);


            }).catch((error) => {
                console.log(error);
            });
    }
    /**
    * Method displays the spatial query results in a table
    * @param {"esri/geometry"} results spatial geometry
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */

    function displayResults(results) {
        var attributeData, table

        view.whenLayerView(SpatialQryLAYER).then((layerView) => {
            var spatial_qrylayer_fields = []
            if (results.features.length > 0) {
                $('#tableDIV').show();
                document.getElementById('tableSPATIALQRY_Div').style.display = "block"
                document.getElementById('tableSPATIALQRY_Div').style.display = "block"
                const features = results.features;

                attributeData = features.map(g =>
                    [...Object.values(g.attributes), g.geometry.toJSON()]

                );
                $(document).ready(function () {

                    // (<21-10-2022> <Sreenidhi>, HMS) : Modified. Loading datatable on index 
                    //change for the seleccted kayers such parking lot, bus shelter and drinking water kiosk

                    if (($("#selectFeature_SPATIALQRY option:selected").index() > 0)) {
                        if ($("#selectFeature_SPATIALQRY option:selected").index() == 1) {
                            if ($.fn.DataTable.isDataTable('#tableContent_SATIALQRY')) {
                                $('#tableContent_SATIALQRY').DataTable().destroy()
                            }
                            else {

                                table = $('#tableContent_SATIALQRY').DataTable({
                                    data: attributeData,
                                    columns: [
                                        { title: 'ObectID' },
                                        { title: 'Name' },
                                        { title: 'Description' },
                                        { title: 'Type' },
                                        { title: 'Count' }
                                        // { title: 'shape' }

                                    ],
                                    // retrieve: true,
                                    destroy: true,
                                    responsive: true,
                                    searching: true,
                                    ordering: true,
                                    scrollY: '120px',
                                    // scrollX: true,
                                    scrollCollapse: true,
                                    paging: false,
                                    // scrollCollapse: true,
                                    // "search": {
                                    //     "return": true
                                    // }
                                });
                            }
                        }
                        if ($("#selectFeature_SPATIALQRY option:selected").index() == 4) {
                            if ($.fn.DataTable.isDataTable('#tableContent_SATIALQRY')) {
                                $('#tableContent_SATIALQRY').DataTable().destroy()
                            }
                            else {
                                table = $('#tableContent_SATIALQRY').DataTable({
                                    data: attributeData,
                                    columns: [
                                        { title: 'ObectID' },
                                        { title: 'Name' },
                                        { title: 'Description' },
                                        { title: 'shape' }

                                    ],
                                    // retrieve: true,
                                    destroy: true,
                                    responsive: true,
                                    searching: true,
                                    ordering: true,
                                    scrollX: true,
                                    scrollY: '120px',
                                    scrollCollapse: true,
                                    paging: false,
                                    // scrollCollapse: true,
                                    // "search": {
                                    //     "return": true
                                    // }
                                });
                            }
                        }
                        if ($("#selectFeature_SPATIALQRY option:selected").index() == 5) {
                            if ($.fn.DataTable.isDataTable('#tableContent_SATIALQRY')) {
                                $('#tableContent_SATIALQRY').DataTable().destroy()
                            }
                            else {
                                table = $('#tableContent_SATIALQRY').DataTable({
                                    data: attributeData,
                                    columns: [
                                        { title: 'ObectID' },
                                        { title: 'Name' },
                                        { title: 'Description' },
                                        { title: 'Status' },
                                        { title: 'Pro_Status' }
                                        // { title: 'Type' },
                                        // { title: 'Count' }

                                    ],
                                    // retrieve: true,
                                    destroy: true,
                                    responsive: true,
                                    searching: true,
                                    // scrollX: true,
                                    ordering: true,
                                    scrollY: '120px',
                                    scrollCollapse: true,
                                    paging: false,
                                    // scrollCollapse: true,
                                    // "search": {
                                    //     "return": true
                                    // }
                                });
                            }
                        }
                    }


                });

                for (i in results.features) {

                    highlights.push(layerView.highlight(results.features[i]))

                    // Tab_data_Parking_Lot_Names.push(results.features[i].attributes['Name'])
                    // Tab_data_ObjectID.push(results.features[i].attributes['OBJECTID'])
                    // Tab_data_Type.push(results.features[i].attributes['Type'])
                    // Tab_data_Count.push(results.features[i].attributes['Count'])

                    view
                        .goTo(
                            {
                                target: results.features.geometry,
                                // tilt: 50,
                                zoom: 13
                            },
                            {
                                duration: 1500,
                                easing: "in-out-expo"
                            }
                        )
                        .catch((error) => {
                            if (error.name != "AbortError") {
                                console.error(error);
                            }
                        });
                }
            }
        });
    }
    const btnpolygonDraw = document.getElementById('polygon-button')
    clearGraphics_Spatial();
    btnpolygonDraw.addEventListener("click", () => {

        sketchViewModel.create("polygon");
    });
    document.getElementById('clear_graphic_button').addEventListener('click', () => {
        count = 0;
        view.graphics.removeAll();
        graphicsLayerDraw.removeAll();
        if (document.getElementById('Tab_result_DIV').style.display == "block") {
            document.getElementById('Tab_result_DIV').style.display = "none";
        }
        document.getElementById('Tab_result_spatialQRY_1').innerHTML = "";
        document.getElementById('Tab_result_spatialQRY_2').innerHTML = "";
        document.getElementById('Tab_result_spatialQRY_3').innerHTML = "";
        document.getElementById('Tab_result_spatialQRY_4').innerHTML = "";

        document.getElementById('Tab_result_Head_data_1').innerHTML = "";
        document.getElementById('Tab_result_Head_data_2').innerHTML = "";
        document.getElementById('Tab_result_Head_data_3').innerHTML = "";
        document.getElementById('Tab_result_Head_data_4').innerHTML = "";
        // document.getElementById('Tab_result_spatialQRY').style.display="none";

        if (highlights.length > 0) {
            highlights.forEach(function (highlight) {
                highlight.remove();
            });
            highlights = [];
        }
        clearGraphics();
    });

    /**
    * Method clears the graphic layer used for the spatial query feature
    * @author <Sreenidhi>, HMS
    * @20-10-2022: 
    */
    function clearGraphics_Spatial() {
        graphicsLayerDraw.removeAll();
    }

    view.ui.add('SpatialQRY_button', 'top-right')
    view.ui.add('SpatialQRY_Sel_CONTAINER', 'manual')

    // var select_fEATURE_SPATIALQRY = document.getElementById('select_fEATURE_SPATIALQRY')
    var select_fEATURE_SPATIALQRY = $('#selectFeature_SPATIALQRY')
    document.getElementById('SpatialQRY_button').addEventListener('click', () => {

        $("#selectFeature_SPATIALQRY").empty();
        select_fEATURE_SPATIALQRY.append("<option value=" + " " + "> Select Feature </option>");


        view.map.layers.forEach(layer => {
            var id = layer.id;
            var url = layer.url;
            if (typeof id === "string" && typeof url === "string") {
                // console.log(id + url)

                select_fEATURE_SPATIALQRY.append("<option value=" + url + ">" + id + "</option>");

                // select_fEATURE_SPATIALQRY.innerHTML = "<option value=" + url + ">" + id + "</option>";
            }
        });
        if (document.getElementById('SpatialQRY_Sel_CONTAINER').style.display == "block") {
            document.getElementById('SpatialQRY_Sel_CONTAINER').style.display = "none"
        }
        else {
            document.getElementById('SpatialQRY_Sel_CONTAINER').style.display = "block"

        }
    });

    $("#selectFeature_SPATIALQRY").change(function () {
        var index = $("#selectFeature_SPATIALQRY option").length
        // var index = selectFeature.selectedIndex
        var optValue = $(this).children("option:selected").text();
        // console.log(index)
        if ($(this).children("option:selected").index() > 0) {
            document.getElementById('polygon_button_container').style.display = "block"
            //xxxxxxxxxxxxxxxxxxxxxxxxxxxx..............NEW........................
            view.map.layers.forEach(layer => {
                if ($("#selectFeature_SPATIALQRY option:selected").text() == layer.id) {
                    // if(selectFeature.options[selectFeature.selectedIndex].text==layer.id){
                    SpatialQryLAYER = layer
                }
            })
        }
        else {
            document.getElementById('polygon_button_container').style.display = "none"
        }
    });
    document.getElementById('SpatialQRY_Selclosebtn').addEventListener('click', () => {
        document.getElementById('SpatialQRY_Sel_CONTAINER').style.display = "none"
    });
});

/**
* Method hides the attribute table on function call
* @author <Sreenidhi>, HMS
* @20-10-2022: 
*/
function close_Butt_AttributeTab() {
    document.getElementById('tableDiv').style.display = "none"
}
/**
* Method hides the table displaying the spatial query results on function call
* @author <Sreenidhi>, HMS
* @20-10-2022: 
*/
function close_Tab_Resut_DIV() {
    document.getElementById('Tab_result_DIV').style.display = "none"
}
/**
* Method hides the table displaying the spatial query results on function call
* @author <Sreenidhi>, HMS
* @20-10-2022: 
*/
function close_Tab_SPATIALQRY_DIV() {
    document.getElementById('tableSPATIALQRY_Div').style.display = "none"
}
