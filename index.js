// Algorithms set up
var algShortName = ["algGP", "algVines", "algCS", "algVD", "algCL", "algDots"];
var algNames = ["Geometric Patterns", "Vines", "Constellations", "Voronoi", "Collisions", "Dots (Simple Example)"];
var algCredits = ["Geometric Patterns by Michael Wehar", "Vines by Alyssa Zhang", "Constellations by Jhovani Gallardo Moreno", "Voronoi by Jhovani Gallardo Moreno", "Collisions by Omar Khan", "Modify This Algorithm!"];
var algorithms = [algGP, algVines, algCS, algVD, algCL, algDots];
var algorithmsPaused = [];
for (let i = 0; i < algorithms.length; i++) {
    algorithms[i].initialize();
    algorithmsPaused.push(true);
}

// Algorithm selection set up
var currentSelection = 1;

// parameter set up
let all_params = param_initialize();
let params_store = create_params_store();
param_display(all_params[currentSelection - 1]);

function selectAlgorithm(id) {
    $('#' + id).css({"border-color": "#86b7fe", "box-shadow": "0 0 0 .25rem rgba(13, 110, 253, .25)"});
}

function deselectAlgorithm(id) {
    $('#' + id).css({
        "border-color": "none",
        "box-shadow": "none"
    }).attr("style", "rgba(0, 0, 0, 0.16) 0 1px 4px;");
}

// Functions for user interaction
function changeSelectionModified(id) {
    // reset the prev algo
    param_not_display(all_params[currentSelection - 1]);
    deselectAlgorithm(currentSelection);

    // assign the new algo
    currentSelection = id;
    selectAlgorithm(currentSelection);
    param_display(all_params[currentSelection - 1]);
    algoNameUpdate(currentSelection);

    // button display
    if (algorithmsPaused[currentSelection - 1]) {
        document.getElementById("startButton").style.display = "initial";
        document.getElementById("pauseButton").style.display = "none";
        const tooltip = bootstrap.Tooltip.getInstance("#start_pause_button");
        tooltip.setContent({'.tooltip-inner': 'Start'});
    } else {
        document.getElementById("startButton").style.display = "none";
        document.getElementById("pauseButton").style.display = "initial";
        const tooltip = bootstrap.Tooltip.getInstance("#start_pause_button");
        tooltip.setContent({'.tooltip-inner': 'Pause'});
    }

    // Optional buttons
    enableOptionalButtons();
}

function enableOptionalButtons() {
  // Randomize button
  if("randomize" in algorithms[currentSelection - 1]) {
    // document.getElementById("randomize").disabled = false;
  } else {
    // document.getElementById("randomize").disabled = true;
    document.getElementById("randomize").style.display = "none";
  }
}

// Create cards function
function createCard(algId) {
    let code = '<div class="card" title="' + algCredits[algId - 1] + '" onclick="changeSelectionModified(' + algId + ')" id="' + algId + '">\
                    <div class="card-background" style="background-image: url(\'thumbnails/' + algShortName[algId - 1] + '.png\');"></div>\
                    <div class="card-body">\
                        <h5 class="card-text">' + algNames[algId - 1] + '</h5>\
                    </div>\
                </div>';
    document.getElementById("alg-cards").innerHTML += code;
}

// Initialize cards
for (let i = 1; i <= algNames.length; i++) {
    createCard(i);
}
// Fill in alg name
algoNameUpdate(currentSelection);
selectAlgorithm(currentSelection);

// start or pause selected algorithm
function start() {
    if (algorithmsPaused[currentSelection - 1]) {
        algorithms[currentSelection - 1].start();
        document.getElementById("startButton").style.display = "none";
        document.getElementById("pauseButton").style.display = "initial";
        const tooltip = bootstrap.Tooltip.getInstance("#start_pause_button");
        tooltip.setContent({'.tooltip-inner': 'Pause'});
        console.log("Started " + currentSelection);
    } else {
        algorithms[currentSelection - 1].pause();
        document.getElementById("startButton").style.display = "initial";
        document.getElementById("pauseButton").style.display = "none";
        const tooltip = bootstrap.Tooltip.getInstance("#start_pause_button");
        tooltip.setContent({'.tooltip-inner': 'Start'});
        console.log("Paused " + currentSelection);
    }
    algorithmsPaused[currentSelection - 1] = !algorithmsPaused[currentSelection - 1];
}

// reset selected algorithm
function reset() {
    algorithms[currentSelection - 1].reset();
    document.getElementById("startButton").style.display = "initial";
    document.getElementById("pauseButton").style.display = "none";
    const tooltip = bootstrap.Tooltip.getInstance("#start_pause_button");
    tooltip.setContent({'.tooltip-inner': 'Start'});
    algorithmsPaused[currentSelection - 1] = true;
    console.log("Reset " + currentSelection);
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

// Save canvas as png
function saveCanvas() {
    var link = document.getElementById('link');
    link.setAttribute('download', 'artwork.png');
    link.setAttribute('href', c.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

/******** Updating functionalities of the Website ********/

// ready to change panels
let offcanvas_start = window.matchMedia("(max-width: 1310px)");
var lastPanel = "#v-pills-algo-tab";
transformPanel(offcanvas_start);
// listen to browser width change
offcanvas_start.addEventListener('change', function () {
    transformPanel(offcanvas_start);
});

// parameter set up
function create_params_store() {
    let store = [];
    for (let id in algorithms) {
        let algo = algorithms[id];
        let algo_copy = {};
        for (let param in algo) {
            if (typeof algo[param] === "boolean" || typeof algo[param] === "number" || typeof algo[param] === "string") {
                algo_copy[param] = algo[param];
            } else if (Array.isArray(algo[param]) && (typeof algo[param][0] === "number" || typeof algo[param][0] === "string")) {
                let temp_array = [];
                for (let i = 0; i < algo[param].length; i++) {
                    temp_array.push(algo[param][i]);
                }
                algo_copy[param] = temp_array;
            }
        }
        store[id] = algo_copy;
    }
    return store;
}

/**
 * This function is used to load the parameters of the drawing algorithms to the
 * parameter panel in the Creator Studio. There are 7 types of allowed parameters:
 * 1) Color-related params, 2) List of numbers, 3) List of strings, 4) List of booleans,
 * 5) Numbers, 6) Booleans, 7) Strings.
 * @return {*[]}
 */
function param_initialize() {
    let all_params = [];
    for (let id in algorithms) {
        let algo = algorithms[id];
        let curr_params = [];
        let keys = Object.keys(algo).sort();
        for (let index in keys) {
            let param = keys[index];
            let param_id = id + "__" + param;
            if (param.toLowerCase().includes("color") && Array.isArray(algo[param]) && algo[param].length === 3 && typeof algo[param][0] === "number") {
                colorParamInitialize(param_id, param, algo[param]);
            } else if (param.toLowerCase().includes("color") && typeof algo[param] === "string") {
                colorParamInitialize(param_id, param, algo[param]);
            } else if (Array.isArray(algo[param]) && typeof algo[param][0] === "number") {
                addToPage(param, listInitialization(param_id, param, algo[param]));
            } else if (typeof algo[param] === "number") {
                addToPage(param, numberInitialization(param_id, param, algo[param]));
            } else if (typeof algo[param] === "boolean") {
                addBooleanToPage(booleanInitialization(param_id, param, algo[param]));
            } else if (typeof algo[param] === "string") {
                addToPage(param, stringInitialization(param_id, param, algo[param]));
            } else {
                continue;
            }
            curr_params.push(param);
        }
        all_params.push(curr_params);
    }
    return all_params;
}

function booleanInitialization(id, name, value) {
    let bool_elem =
        "<div class='" + id + "_wrapper' style='display: none'>" +
        "<div class='input-group'>" +
        "<div class='input-group-text'>" +
        "<input class='form-check-input mt-0' type='checkbox' aria-label='" + name + "' id='" + id + "'";
    // preload checked if true
    if (value) {
        bool_elem += " checked";
    }
    bool_elem += ">" +
        "</div>" +
        "<span title='" + name + "' class='input-group-text'>" + name + "</span>" +
        "</div></div>";
    return bool_elem;
}

function stringInitialization(id, name, value) {
    return "<div class='" + id + "_wrapper' style='display: none'>" +
        "<div class='input-group'>" +
        "<span title='" + name + "' class='input-group-text'>" + name + "</span>" +
        "<input type='text' class='form-control' aria-label='" + name + "' title='" + value + "' placeholder='" + value + "' id='" + id + "'>" +
        "</div></div>";
}

function numberInitialization(id, name, value) {
    return stringInitialization(id, name, value);
}

function colorInitialization(id, name, value) {
    return "<div class='" + id + "_wrapper' style='display: none'>" +
        "<div class='input-group'>" +
        "<span title='" + name + "' class='input-group-text'>" + name + "</span>" +
        "<input type='color' class='form-control form-control-color' aria-label='" + name + "' value='" + value + "' id='" + id + "' style='height: auto'>" +
        "</div></div>";
}

function listInitialization(id, name, value) {
    let list_elem =
        "<div class='" + id + "_wrapper' style='display: none'>" +
        "<div class='input-group'>" +
        "<span title='" + name + "' class='input-group-text' style='border-right: none'>" + name + "</span>" +
        "<button class='btn btn-outline-light dropdown-toggle' id='param-dropdown' type='button' " +
        "data-bs-toggle='dropdown' aria-expanded='false'></button>" +
        "<ul class='dropdown-menu' id='" + id + "__listOptions'>";

    list_elem = list_elem + generateListOptions(id, name, value) + "</ul></div></div>";

    return list_elem;
}

/**
 * Generate options in the dropdown.
 * @param id
 * @param name
 * @param value
 * @return {string}
 */
function generateListOptions(id, name, value) {
    let list_elem = "";
    for (let i = 0; i < value.length; i++) {
        list_elem += "<li><input type='text' class='form-control' aria-label='" + name + "' " +
            "title='" + value[i] + "' placeholder='" + value[i] + "' id='" + i + "__" + id + "'></li>";
    }

    let plus_sign = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" " +
        "fill=\"currentColor\" class=\"bi bi-plus-lg\" viewBox=\"0 0 16 16\">\n" +
        "  <path fill-rule=\"evenodd\" d=\"M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 " +
        "0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z\"/>\n" +
        "</svg>";

    let minus_sign = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" " +
        "fill=\"currentColor\" class=\"bi bi-dash-lg\" viewBox=\"0 0 16 16\">\n" +
        "  <path fill-rule=\"evenodd\" d=\"M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z\"/>\n" +
        "</svg>";

    list_elem += "<li id='" + id + "__listDivider'><hr class='dropdown-divider'></li>" +
        "<li>" +
        "<div class='input-group-wrapper' style='display: flex; justify-content: center'>" +
        "<div class='input-group'>" +
        "<button class='btn btn-outline-secondary' id='" + id + "__plus' style='border-right: none'>" + plus_sign + "</button>" +
        "<button class='btn btn-outline-secondary' id='" + id + "__minus'>" + minus_sign + "</button>" +
        "</div></div></li>";

    return list_elem;
}

/**
 * Handle different kinds of color parameters.
 * They can either be an array of numbers, a string in the format of
 * "rgb(0, 0, 0)", or a string that is a color name.
 * @param id the parameter id that will be used to identify the variable.
 * @param name the parameter's name.
 * @param value the parameter's value.
 */
function colorParamInitialize(id, name, value) {
    let hex_val = "";
    if (Array.isArray(value) && value.length === 3 && typeof value[0] === "number") {
        hex_val = rgbToHex(value[0], value[1], value[2]);
    } else if (typeof value === "string") {
        hex_val = stringColorToHex(value);
    } else if (typeof value === "number") {
        addToPage(name, numberInitialization(id, name, value));
    } else if (typeof value === "boolean") {
        addBooleanToPage(booleanInitialization(id, name, value));
    }

    if (hex_val !== "") {
        addToPage(name, colorInitialization(id, name, hex_val));
    }
}

/**
 * Add parameters to parameter panel; Specifically for
 * non-boolean parameters. Shorter parameter will be put into
 * shorter_param div, and longer one will be in longer_param div.
 * @param name name of the parameter.
 * @param elem the element to be inserted.
 */
function addToPage(name, elem) {
    if (name.length < 15) {
        $('.shorter_param').append(elem);
    } else {
        $('.longer_param').append(elem);
    }
}

/**
 * Add parameters to parameter panel; Specifically for
 * boolean parameters. Boolean parameters will be put into
 * checkbox_param div.
 * @param elem the element to be inserted.
 */
function addBooleanToPage(elem) {
    $('.checkbox_param').append(elem);
}

/**
 * Add another input field for list-type of parameters.
 * @param id
 * @param name
 * @param value inserted value.
 * @param index the position to insert, which in this situation is
 * always the last index of the array.
 */
function addListOption(id, name, value, index) {
    // console.log(id, param, value, index);
    let btn_elem = "<li><input type='text' class='form-control' aria-label='" + name + "' " +
        "title='" + value + "' placeholder='" + value + "' id='" + index + "__" + id + "'></li>";
    $(btn_elem).insertBefore('#' + id + '__listDivider');
}

/**
 * Delete the last input field for list-type of parameters.
 * @param id
 */
function deleteListOption(id) {
    $('#' + id + '__listDivider').prev().remove();
}

/**
 * Reset the changed list options to default.
 * @param id
 * @param name
 * @param value
 */
function setListOptionToDefault(id, name, value) {
    $("#" + id + "__listOptions").empty();
    let list_elem = generateListOptions(id, name, value);
    $("#" + id + "__listOptions").append(list_elem);
    console.log("after", value);
}

/**
 * Check if the two inputs are equal or not. The input
 * can either be arrays or non-arrays.
 * @param first
 * @param second
 * @return {boolean}
 */
function checkEqual(first, second) {
    // Non-array parameters
    if (typeof first.length === "undefined" && typeof second.length === "undefined" && first !== second) return false;
    // Array parameters
    if (first.length !== second.length) return false;
    for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) return false;
    }
    return true;
}

/**
 * Compare the parameters stored in params_store and
 * current parameters, and set every param that is different
 * in these two lists as the saved parameter (the one in the
 * params_store).
 */
function updateParamValue(id, param, value) {
  let param_id = id + "__" + param;
  if (param.toLowerCase().includes("color") && Array.isArray(value) && value.length === 3 && typeof value[0] === "number") {
      let hex_val = rgbToHex(value[0], value[1], value[2]);
      $("#" + param_id).val(hex_val);
      $("#" + param_id).trigger("change");
  } else if(param.toLowerCase().includes("color") && typeof value === "string") {
      let hex_val = stringColorToHex(value);
      $("#" + param_id).val(hex_val);
      $("#" + param_id).trigger("change");
  } else if (Array.isArray(value)) {
      setListOptionToDefault(param_id, param, value);
  } else {
      if (typeof value === "boolean") {
          $("#" + param_id).prop('checked', value);
      }
      $("#" + param_id).val(value);
      $("#" + param_id).trigger("change");
  }
}

function set_to_default() {
    let id = currentSelection - 1;
    let algo = params_store[id];
    for (let param in algo) {
        if (!checkEqual(algo[param], algorithms[id][param])) {
            console.log("*** Changed ***");
            updateParamValue(id, param, algo[param]);
            algorithms[id][param] = algo[param];
        }
    }
}

function refresh_params() {
  let id = currentSelection - 1;
  let algo = params_store[id];
  for(let param in algo) {
      updateParamValue(id, param, algorithms[id][param]);
  }
}

function randomize_params() {
  let id = currentSelection - 1;
  if("randomize" in algorithms[id]) {
    algorithms[id].randomize();
  }
  refresh_params();
}

function save_params() {
    let curParams = create_params_store();
    let textData = JSON.stringify(curParams[currentSelection - 1]);
    var link = document.getElementById('linkParams');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textData));
    link.setAttribute('download', 'params.js');
    link.click();
}

// display params of the current algo
function param_display(curr_params) {
    for (let i in curr_params) {
        // console.log((curr_params[i]));
        let temp = currentSelection - 1;
        $('.' + temp + '__' + curr_params[i] + '_wrapper').css("display", "flex");
    }
}

// hide the params of the previous algo
function param_not_display(curr_params) {
    for (let i in curr_params) {
        // console.log((curr_params[i]));
        let temp = currentSelection - 1;
        $('.' + temp + '__' + curr_params[i] + '_wrapper').css("display", "none");
    }
}

// parameter panel subtitle update
function algoNameUpdate(currentSelection) {
    $('.current_algo').text(algNames[currentSelection - 1]);
}

// update offcanvas content
function transformPanel(curr) {
    if (curr.matches) { // If media query matches
        console.log("match");
        // change tab properties
        $('#v-pills-algo-tab').attr("data-bs-toggle", "offcanvas")
            .attr("aria-controls", "offcanvasRight").attr("data-bs-target", "#offcanvasRight");
        $('#v-pills-params-tab').attr("data-bs-toggle", "offcanvas")
            .attr("aria-controls", "offcanvasRight").attr("data-bs-target", "#offcanvasRight");
        $('#v-pills-action-tab').attr("data-bs-toggle", "offcanvas")
            .attr("aria-controls", "offcanvasRight").attr("data-bs-target", "#offcanvasRight");
        $('#v-pills-about-tab').attr("data-bs-toggle", "offcanvas")
            .attr("aria-controls", "offcanvasRight").attr("data-bs-target", "#offcanvasRight")
            .attr("class", "nav-link");

        // check last opened panel
        if ($('#v-pills-algo-tab').attr("class") === "nav-link active") {
            $('#v-pills-algo-tab').attr("class", "nav-link");
            lastPanel = "#v-pills-algo-tab";
        } else if ($('#v-pills-params-tab').attr("class") === "nav-link active") {
            $('#v-pills-params-tab').attr("class", "nav-link");
            lastPanel = "#v-pills-params-tab";
        } else if ($('#v-pills-action-tab').attr("class") === "nav-link active") {
            $('#v-pills-action-tab').attr("class", "nav-link");
            lastPanel = "#v-pills-action-tab";
        } else {
            $('#v-pills-about-tab').attr("class", "nav-link");
            lastPanel = "#v-pills-about-tab";
        }

        // initialize offcanvas
        $('#offcanvasRight').append($('.algo_panel').hide());
        $('#offcanvasRight').append($('.param_panel').hide());
        $('#offcanvasRight').append($('.history_panel').hide());
        $('#offcanvasRight').append($('.about_panel').hide());
        let prev_panel = "";

        // update offcanvas
        $('.sideSelection .nav button').click(function () {
            if (prev_panel !== "") {
                if (prev_panel === "v-pills-algo-tab") {
                    $('.algo_panel').hide();
                } else if (prev_panel === "v-pills-params-tab") {
                    $('.param_panel').hide();
                } else if (prev_panel === "v-pills-action-tab") {
                    $('.history_panel').hide();
                } else {
                    $('.about_panel').hide();
                }
            }

            if (this.id === "v-pills-algo-tab") {
                $('.algo_panel').show();
            } else if (this.id === "v-pills-params-tab") {
                $('.param_panel').show();
            } else if (this.id === "v-pills-action-tab") {
                $('.history_panel').show();
            } else {
                $('.about_panel').show();
            }
            prev_panel = this.id;
        });

    } else {
        console.log("not match");
        // change back tab properties
        $('#v-pills-algo-tab').attr("data-bs-toggle", "pill")
            .attr("aria-controls", "v-pills-algo").attr("data-bs-target", "#v-pills-algo");
        $('#v-pills-params-tab').attr("data-bs-toggle", "pill")
            .attr("aria-controls", "v-pills-params").attr("data-bs-target", "#v-pills-params");
        $('#v-pills-action-tab').attr("data-bs-toggle", "pill")
            .attr("aria-controls", "v-pills-action").attr("data-bs-target", "#v-pills-action");
        $('#v-pills-about-tab').attr("data-bs-toggle", "pill")
            .attr("aria-controls", "v-pills-about").attr("data-bs-target", "#v-pills-about");
        $(lastPanel).attr("class", "nav-link active");

        // reshow panels
        $('#v-pills-algo').append($('.algo_panel').show());
        $('#v-pills-params').append($('.param_panel').show());
        $('#v-pills-action').append($('.history_panel').show());
        $('#v-pills-about').append($('.about_panel').show());

        // hide offcanvas
        $('#offcanvas_close').click();
    }
}

// activate all tooltips
$(document).ready(function () {
    $('[data-bs-toggle=tooltip]').tooltip(
        {trigger: 'hover'}
    );
});

/**
 * Listen for text input changes in the parameter panel
 * and update the corresponding variables. Not include
 * list type input changes.
 */
$('.inner_param .form-control:not(ul .form-control)').change(function () {
    let id = currentSelection - 1;
    let param = $(this).attr("id").split("__")[1];
    console.log(typeof algorithms[id][param] + ", " + param);
    console.log("before", algorithms[id][param]);
    let value = algorithms[id][param];
    if (param.toLowerCase().includes("color") && Array.isArray(value) && value.length === 3 && typeof value[0] === "number") {
        let hex_val = $(this).val();
        algorithms[id][param] = hexToArray(hex_val);
    } else if (typeof algorithms[id][param] === "number") {
        algorithms[id][param] = JSON.parse($(this).val());
    } else {
        algorithms[id][param] = $(this).val();
    }
    if ($(this).attr("type") !== "color") {
        $(this).attr("title", $(this).val());
        $(this).attr("placeholder", $(this).val());
        $(this).val("");
    } else {
        $(this).attr("value", $(this).val());
    }
    console.log("after", algorithms[id][param]);
});

/**
 * Listen for boolean input changes in the parameter panel
 * and update the corresponding variables.
 */
$('.inner_param .form-check-input').change(function () {
    let id = currentSelection - 1;
    let param = $(this).attr("id").split("__")[1];
    console.log(typeof algorithms[id][param] + ", " + param);
    console.log("before", algorithms[id][param]);
    if (!$(this).is(':checked')) {
        algorithms[id][param] = false;
        $(this).removeClass('checked');
        $(this).val("false");
    } else {
        algorithms[id][param] = true;
        $(this).addClass('checked');
        $(this).val("true");
    }
    console.log("after", algorithms[id][param]);
});

/**
 * Listen for list type input changes.
 */
$('body').on('change', '.inner_param ul .form-control', function() {
    let id = currentSelection - 1;
    let total = $(this).attr("id").split("__");
    let param = total[total.length - 1];
    console.log(typeof algorithms[id][param] + ", " + param);
    console.log("before", algorithms[id][param]);
    let key = JSON.parse(total[0]);
    if (typeof algorithms[id][param][key] === "number") {
        algorithms[id][param][key] = JSON.parse($(this).val());
    } else {
        algorithms[id][param][key] = $(this).val();
    }
    if ($(this).attr("type") !== "color") {
        $(this).attr("title", $(this).val());
        $(this).attr("placeholder", $(this).val());
        $(this).val("");
    } else {
        $(this).attr("value", $(this).val());
    }
    console.log("after", algorithms[id][param]);
})

/**
 * Listen for list type plus/minus buttons
 */
$('.inner_param ul button').click(function () {
    let id = currentSelection - 1;
    let total = $(this).attr("id").split("__");
    let param = total[total.length - 2];
    let btn_type = total[total.length - 1];
    console.log(typeof algorithms[id][param] + ", " + btn_type);
    console.log("before", algorithms[id][param]);
    if (btn_type === "plus") {
        algorithms[id][param].push(0);
        addListOption(total.slice(0, 2).join("__"), param, 0, algorithms[id][param].length - 1);
    } else if (btn_type === "minus") {
        algorithms[id][param].pop();
        deleteListOption(total.slice(0, 2).join("__"));
    } else {
        alert("wrong list action type");
    }

    console.log("after", algorithms[id][param]);
})

$('.inner_param .dropdown-menu, .modal .dropdown-menu').on('click', function(e) {
    e.stopPropagation();
});

// Initial scripts
enableOptionalButtons();

// Functions for supporting color params
function valueToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + valueToHex(r) + valueToHex(g) + valueToHex(b);
}

function stringColorToHex(s) {
    if (s.search(/rgb/) === -1) {
        $('#link').css("background", s);
        s = $('#link').css("background-color");
    }
    let regexNum = RegExp('[0-9]+');
    let regexR = RegExp('\\([0-9]+ ?\,');
    let regexG = RegExp('\, ?[0-9]+ ?\,');
    let regexB = RegExp('\, ?[0-9]+ ?\\)');
    let r = regexNum.exec(regexR.exec(s)[0].toString())[0];
    let g = regexNum.exec(regexG.exec(s)[0].toString())[0];
    let b = regexNum.exec(regexB.exec(s)[0].toString())[0];
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    return rgbToHex(r, g, b);
}

function hexToArray(hex) {
  let r = hex.substring(1, 3);
  let g = hex.substring(3, 5);
  let b = hex.substring(5, 7);
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}
