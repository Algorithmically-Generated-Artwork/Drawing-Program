// Open Source Embedded Code Editor (OSCE)
// By Nicholas Baldev and Michael Wehar
// URL: https://github.com/MichaelWehar/Open-Source-Embedded-Code-Editor

// Editors dictionary
var editors = {};

// Global constants
const background_color_offset = 20;
const text_color_offset = -40;
const tool_bar_color_offset = 40; // Not currently used
const defaultDropdownHeadIdleColor = "#000000";
const defaultDropdownHeadActiveColor = "#696969";
const defaultDropdownSettings = [
  {"id": "menu1", "label": "File", "options": [{"label": "Save", "onclick": "saveToTextFileWrapper(this)"}]},
  {"id": "menu2", "label": "Edit", "options": [{"label": "Editor Settings", "onclick": "showOverlayWrapper(this, 'tabOverlay')"}, {"label": "Find & Replace", "onclick": "showOverlayWrapper(this, 'findOverlay')"}]},
  {"id": "menu3", "label": "View", "options": [{"label": "Font & Colors", "onclick": "showOverlayWrapper(this, 'colorsOverlay')"}, {"label": "Select Template", "onclick": "showOverlayWrapper(this, 'templatesOverlay')"}]},
  {"id": "menu4", "label": "Stats", "options": [{"label": "View Statistics", "onclick": "showOverlayWrapper(this, 'statisticsOverlay')"}]},
  {"id": "menu5", "label": "About", "options": [{"label": "Credits & License", "onclick": "showOverlayWrapper(this, 'creditsOverlay')"}, {"label": "Git Repository", "onclick": "goToGitRepo()"}]}
];
const defaultActionButtonSettings = [
  {"id": "action1", "label": "Compile", "onclick": "alert('Not implemented!')"},
  {"id": "action2", "label": "Run", "onclick": "alert('Also, not implemented!')"},
];
const defaultEditorSettings = {
  "width": 800,
  "height": 500,
  "color": "#ccaaee",
  "backgroundColor": "#442266",
  "fontFamily": "Monospace",
  "fontSize": 15,
  "toolBarBackgroundColor": "#000000",
  "toolBarTextColor": "#ffffff",
  "toolBarButtonColor": "#070707",
  "tabLoad": 1,
  "textWrapLoad": 1,
  "parensLoad": 1,
  "hideToolbar": false,
  "dropdownMode": "default",
  "actionButtonMode": "none"
};

// Helper function: Add quotes around string
function quotes(str)
{
  return '"' + str + '"';
}

// Helper function: Add single quotes around string
function singleQuotes(str)
{
  return "'" + str + "'";
}

// Helper function: Finds which close char matches the open char
function get_close_symbol(symbol)
{
  if (symbol == '{') {return '}';}
  else if (symbol == '"') {return '"';}
  else if (symbol == "'") {return "'";}
  else if (symbol == '(') {return ')';}
  else if (symbol == '[') {return ']';}
}

function generateStatisticsOverlay(eName)
{
  let divId = eName + "-statisticsOverlay";
  let htmlString =
      "<div id=" + quotes(divId) + " class=" + quotes("overlay") + ">" +
        "<button class=" + quotes("X-button") + " onclick=" + quotes("hideOverlay(" + singleQuotes(divId) + ")") + ">&#9932;</button><br><br>" +
        "<p><u>Statistics</u><br><br></p>" +
        "<p>Char Count: <span id=" + quotes(eName + "-charCount") + ">?</span></p>" +
        "<p>Word Count: <span id=" + quotes(eName + "-wordCount") + ">?</span></p>" +
        "<p>Edits Count: <span id=" + quotes(eName + "-editsCount") + ">?</span></p>" +
      "</div>";
  const wrapperId = eName + "-wrapper";
  document.getElementById(wrapperId).innerHTML += htmlString;

  // Add to overlays list
  editors[eName]["overlays"].push(divId);
}

function generateTemplatesOverlay(eName)
{
  let divId = eName + "-templatesOverlay";
  let htmlString =
      "<div id=" + quotes(divId) + " class=" + quotes("overlay") + ">" +
        "<button class=" + quotes("X-button") + " onclick=" + quotes("hideOverlay(" + singleQuotes(divId) + ")") + ">&#9932;</button><br><br>" +
        "<p><u>Select Template</u><br><br></p>" +
        "<button class=" + quotes("overlay-button") + " onclick=" + quotes("setTemplate(" + singleQuotes(eName) + "," + singleQuotes("#000000") + "," + singleQuotes("#F0F0F0") + "," + singleQuotes("Monospace") + "," + singleQuotes("14") + ")") + ">Light Mode</button><br><br>" +
        "<button class=" + quotes("overlay-button") + " onclick=" + quotes("setTemplate(" + singleQuotes(eName) + "," + singleQuotes("#FFFFFF") + "," + singleQuotes("#000000") + "," + singleQuotes("Monospace") + "," + singleQuotes("18") + ")") + ">Dark Mode</button><br><br>" +
        "<button class=" + quotes("overlay-button") + " onclick=" + quotes("setTemplate(" + singleQuotes(eName) + "," + singleQuotes("#00FBFF") + "," + singleQuotes("#FF00AE") + "," + singleQuotes("Monospace") + "," + singleQuotes("20") + ")") + ">Pink & Blue</button><br><br>" +
        "<button class=" + quotes("overlay-button") + " onclick=" + quotes("setTemplate(" + singleQuotes(eName) + "," + singleQuotes("#FF7D00") + "," + singleQuotes("#000FD7") + "," + singleQuotes("Monospace") + "," + singleQuotes("24") + ")") + ">Orange & Blue</button><br><br>" +
      "</div>";
  const wrapperId = eName + "-wrapper";
  document.getElementById(wrapperId).innerHTML += htmlString;

  // Add to overlays list
  editors[eName]["overlays"].push(divId);
}

function generateFindOverlay(eName)
{
  let divId = eName + "-findOverlay";
  let htmlString =
      "<div id=" + quotes(divId) + " class=" + quotes("overlay") + ">" +
        "<button class=" + quotes("X-button") + " onclick=" + quotes("hideOverlay(" + singleQuotes(divId) + ")") + ">&#9932;</button><br><br><br><br>" +
        "<label for=" + quotes(eName + "-find") + " style=" + quotes("margin-left: 21%") + ">Find:</label>" +
        "<input type=" + quotes("text") + " id=" + quotes(eName + "-find") + " size=" + quotes("10px") + " style=" + quotes("margin-left: 5%") + "><br><br>" +
        "<label for=" + quotes(eName + "-replace") + ">Replace:</label>" +
        "<input type=" + quotes("text") + " id=" + quotes(eName + "-replace") + " size=" + quotes("10px") + "><br><br><br>" +
        "<button class=" + quotes("overlay-button") + " onclick=" + quotes("findAndReplace(" + singleQuotes(eName) + ")") + ">Submit</button>" +
      "</div>";
  const wrapperId = eName + "-wrapper";
  document.getElementById(wrapperId).innerHTML += htmlString;

  // Add to overlays list
  editors[eName]["overlays"].push(divId);
}

function generateTabOverlay(eName)
{
  let divId = eName + "-tabOverlay";
  let htmlString =
      "<div id=" + quotes(divId) + " class=" + quotes("overlay") + ">" +
        "<button class=" + quotes("X-button") + " onclick=" + quotes("hideOverlay(" + singleQuotes(divId) + ")") + ">&#9932;</button><br>" +
        "<p><u>Tabs & Spaces</u></p>" +
        "<select id=" + quotes(eName + "-tabSelect") + " onchange=" + quotes("updateTabsAndSpaces(" + singleQuotes(eName) + ")") + " style=" + quotes("margin: 0 auto; display: block;") + "><br>" +
          "<option value=" + quotes("0") + ">None</option>" +
          "<option value=" + quotes("1") + ">tab -> 2 spaces</option>" +
          "<option value=" + quotes("2") + ">tab -> 4 spaces</option>" +
          "<option value=" + quotes("3") + ">2 spaces -> tab</option>" +
          "<option value=" + quotes("4") + ">4 spaces -> tab</option>" +
        "</select>" +
        "<p><u>Text Wrap (WIP)</u></p>" +
        "<select id=" + quotes(eName + "-wordWrapSelect") + " onchange=" + quotes("updateWordWrap(" + singleQuotes(eName) + ")") + " style=" + quotes("margin: 0 auto; display: block;") + "><br>" +
          "<option value=" + quotes("0") + ">Enable</option>" +
          "<option value=" + quotes("1") + ">Disable</option>" +
        "</select>" +
        "<p><u>Parentheses</u></p>" +
        "<select id=" + quotes(eName + "-parenthesesSelect") + " style=" + quotes("margin: 0 auto; display: block;") + "><br>" +
          "<option value=" + quotes("0") + ">Auto Close</option>" +
          "<option value=" + quotes("1") + ">Manual Close</option>" +
        "</select>" +
      "</div>";
  const wrapperId = eName + "-wrapper";
  document.getElementById(wrapperId).innerHTML += htmlString;

  // Add to overlays list
  editors[eName]["overlays"].push(divId);
}

function generateCreditsOverlay(eName)
{
  let divId = eName + "-creditsOverlay";
  let htmlString =
      "<div id=" + quotes(divId) + " class=" + quotes("overlay") + ">" +
        "<button class=" + quotes("X-button") + " onclick=" + quotes("hideOverlay(" + singleQuotes(divId) + ")") + ">&#9932;</button><br><br>" +
        "<p><u>Created By</u></p>" +
        "<p>* Nick Baldev</p>" +
        "<p>* Mike Wehar</p>" +
        "<p><u>Released Under</u></p>" +
        "<p>* MIT License</p>" +
      "</div>";
  const wrapperId = eName + "-wrapper";
  document.getElementById(wrapperId).innerHTML += htmlString;

  // Add to overlays list
  editors[eName]["overlays"].push(divId);
}

function generateColorsOverlay(eName)
{
  let divId = eName + "-colorsOverlay";
  let htmlString =
      "<div id=" + quotes(divId) + " class=" + quotes("overlay") + ">" +
        "<button class=" + quotes("X-button") + " onclick=" + quotes("hideOverlay(" + singleQuotes(divId) + ")") + ">&#9932;</button><br><br><br>" +
        "<label for=" + quotes(eName + "-textColor") + ">Text Color:</label>" +
        "<input type=" + quotes("color") + " id=" + quotes(eName + "-textColor") + " value=" + quotes("#FFFFFF") + ">" +
        "<br><br>" +
        "<label for=" + quotes(eName + "-backgroundColor") + ">Background Color:</label>" +
        "<input type=" + quotes("color") + " id=" + quotes(eName + "-backgroundColor") + " value=" + quotes("#000000") + ">" +
        "<br><br>" +
        "<label for=" + quotes(eName + "-fontSize") + ">Font Size:</label>" +
        "<input type=" + quotes("number") + " id=" + quotes(eName + "-fontSize") + " min=" + quotes("12") + " max=" + quotes("24") + " value=" + quotes("14") + ">" +
        "<br><br>" +
        "<label for=" + quotes(eName + "-font") + ">Font:</label>" +
        "<select name=" + quotes("font") + " id=" + quotes(eName + "-font") + "><br>" +
          "<option value=" + quotes("Monospace") + ">Monospace</option>" +
          "<option value=" + quotes("Courier New") + ">Courier New</option>" +
          "<option value=" + quotes("Lucida Console") + ">Lucida Console</option>" +
          "<option value=" + quotes("Monaco") + ">Monaco</option>" +
        "</select>" +
      "</div>";
  const wrapperId = eName + "-wrapper";
  document.getElementById(wrapperId).innerHTML += htmlString;

  // Add to overlays list
  editors[eName]["overlays"].push(divId);
  editors[eName].colorsOverlayFound = true;
}

function generate_overlays(eName)
{
  generateStatisticsOverlay(eName);
  generateTemplatesOverlay(eName);
  generateFindOverlay(eName);
  generateTabOverlay(eName);
  generateCreditsOverlay(eName);
  generateColorsOverlay(eName);
}

function generate_editor(containerId, eName)
{
  editors[eName] = {"dropdowns": [], "overlays": []};
  generate_toolbar(containerId, eName);
  generate_wrapper(containerId, eName);
  add_editor_listeners(eName);
  set_default_values(eName);
  calculateStatistics(eName);
  updateWordWrap(eName);
}

function generate_toolbar(containerId, eName)
{
  let htmlString =
      "<div id=" + quotes(eName + "-toolbar") + "class=" + quotes("toolbar") + ">" +
        "<div id=" + quotes(eName + "-leftSide") + "style=" + quotes("width: 65%; height: 100%; background-color: red; display: flex; align-items: center;") + "></div>" +
        "<div id=" + quotes(eName + "-rightSide") + "style=" + quotes("width: 35%; height: 100%; background-color: blue; display: flex; align-items: center; justify-content: right;") + "></div>" +
      "</div>";
  document.getElementById(containerId).innerHTML += htmlString;
}

function generate_wrapper(containerId, eName)
{
  let htmlString =
      "<div id=" + quotes(eName + "-wrapper") + "class=" + quotes("editor-wrapper") + ">" +
        "<textarea id=" + quotes(eName + "-linenumbers") + "class=" + quotes("line-numbers") + " disabled></textarea>" +
        "<textarea id=" + quotes(eName + "-codeeditor") + "class=" + quotes("code-editor") + "></textarea>" +
      "</div>";
  document.getElementById(containerId).innerHTML += htmlString;
  generate_overlays(eName);
}

function add_editor_listeners(eName)
{
  // Get HTML elements
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  const text_color_input = document.getElementById(eName + '-textColor');
  const background_color_input = document.getElementById(eName + '-backgroundColor');
  const font_input = document.getElementById(eName + '-font');
  const font_size_input = document.getElementById(eName + '-fontSize');

  // Add listeners
  code_textarea.addEventListener('input', () => {calculateStatistics(eName);});
  code_textarea.addEventListener('input', () => {updateLineNumbers(eName);});
  code_textarea.addEventListener('input', () => {updateTabsAndSpaces(eName);});
  code_textarea.addEventListener('scroll', () => {line_numbers_textarea.scrollTop = code_textarea.scrollTop;});
  code_textarea.addEventListener("keydown", function(event) {
    if (event.key === "Tab")
    {
      event.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;
      this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 1;
      let eName = this.id.split("-codeeditor")[0];
      updateTabsAndSpaces(eName);
    }

    let closing_symbols = ['}', '"', "'", ')', ']'];
    if (closing_symbols.includes(event.key))
    {
      let start = this.selectionStart;
      if (this.value[start] === event.key)
      {
        event.preventDefault();
        this.selectionStart = this.selectionEnd = start + 1;
      }
    }

    let setting = document.getElementById(eName + '-parenthesesSelect').value;
    if (setting == '0')
    {
      let open_symbols = ['{', '"', "'", '(', '['];
      if (open_symbols.includes(event.key))
      {
        event.preventDefault();
        let start = this.selectionStart;
        let end = this.selectionEnd;
        let closing_symbol = get_close_symbol(event.key);

        this.value = this.value.substring(0, start) + event.key + closing_symbol + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;

        let eName = this.id.split("-codeeditor")[0];
        updateTabsAndSpaces(eName);
        refresh(eName);
      }
    }
  });
  text_color_input.addEventListener('input', () => {changeTextColor(eName);});
  background_color_input.addEventListener('input', () => {changeBackgroundColor(eName);});
  font_input.addEventListener('input', () => {changeFont(eName);});
  font_size_input.addEventListener('input', () => {changeFontSize(eName);});

  // Close dropdowns and overlays
  const wrapper = document.getElementById(eName + "-wrapper");
  wrapper.onclick = function(event)
  {
    if (event.target.matches('.code-editor'))
    {
      hideAllOverlays(eName);
      hideAllDropdowns(eName);
    } else if (event.target.matches('.overlay') || event.target.matches('.X-button')) {
      hideAllDropdowns(eName);
    }
  }
  const toolbar = document.getElementById(eName + "-toolbar");
  toolbar.onclick = function(event)
  {
    if (!event.target.matches('.dropdown-head'))
    {
      hideAllDropdowns(eName);
    }
  }
}

function set_default_values(eName)
{
  // Dictionary values
  editors[eName].dropdownHeadIdleColor = defaultDropdownHeadIdleColor;
  editors[eName].dropdownHeadActiveColor = defaultDropdownHeadActiveColor;
  editors[eName].editsCount = -1;
  // HTML values
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  line_numbers_textarea.value = "1\n";
  code_textarea.value = "";
}

function generateDropdowns(eName, dropdownSettings)
{
  for (dropdownIndex in dropdownSettings)
  {
    let dropdown = dropdownSettings[dropdownIndex];
    generateDropdown(eName, dropdown);
  }
}

function generateActionButtons(eName, actionButtonSettings)
{
  const rightSide = document.getElementById(eName + "-rightSide");
  for (actionButtonIndex in actionButtonSettings)
  {
    let actionButton = actionButtonSettings[actionButtonIndex];
    rightSide.innerHTML += "<button id=" + quotes(eName + "-actionButton-" + actionButton.id) + " class=" + quotes("action-button") + " onclick=" + quotes(actionButton.onclick) + ">" + actionButton.label + "</button>";
  }
}

function generateDropdown(eName, dropdownObj)
{
  // Create constant
  const leftSideId = eName + "-leftSide";

  // Create outer div
  let divId = eName + "-dropdown-" + dropdownObj.id;
  let divOpen = "<div id=" + quotes(divId) + " class=" + quotes("dropdown") + ">";
  let divClose = "</div>";

  // Create button in toolbar
  let headId = divId + "-head";
  let headClass = "dropdown-head";
  let headOnClick = "dropdownAction(" + singleQuotes(eName) + "," + singleQuotes(divId) + ")";
  let headLabel = dropdownObj.label + " &#9662;";
  let headFull = "<button id=" + quotes(headId) + " class=" + quotes(headClass) + " onclick=" + quotes(headOnClick) + ">" + headLabel + "</button>";

  // Create dropdown options
  let bodyId = divId + "-body";
  let bodyClass = "dropdown-body";
  let bodyFull = "<div id=" + quotes(bodyId) + " class=" + quotes(bodyClass) + ">";
  for(option in dropdownObj.options)
  {
    let optionClass = "dropdown-option";
    let optionLabel = dropdownObj.options[option].label;
    let optionOnClick = dropdownObj.options[option].onclick;
    let optionString = "<button id=" + quotes(bodyId + "-" + option) + " class=" + quotes(optionClass) + " onclick=" + quotes(optionOnClick) + ">" + optionLabel + "</button>";
    bodyFull += optionString;
  }
  bodyFull += "</div>";

  // Generate html code
  let htmlString = divOpen + headFull + bodyFull + divClose;
  document.getElementById(leftSideId).innerHTML += htmlString;

  // Added to dropdowns list
  editors[eName]["dropdowns"].push(divId);
}

function updateWidthAndHeight(eName, width, height)
{
  // Editor
  let eToolbar = document.getElementById(eName + "-toolbar");
  let eWrapper = document.getElementById(eName + "-wrapper");
  let eLinenumbers = document.getElementById(eName + "-linenumbers");
  let eCodeeditor = document.getElementById(eName + "-codeeditor");
  // Variables
  let tenPercent = Math.floor(width / 10);
  let fontSize = eCodeeditor.style.fontSize.split("px")[0];
  let fontWidth = getFontWidth(fontSize);
  let sidebarPadding = getSidebarPadding(eName);
  let numberWidth = 2 * sidebarPadding + fontWidth * ("" + getLineCount(eName)).length;
  let sidebarWidth = Math.max(tenPercent, numberWidth);
  // Width
  eToolbar.style.width = width + "px";
  eWrapper.style.width = width + "px";
  eLinenumbers.style.width = sidebarWidth + "px";
  eCodeeditor.style.width = (width - sidebarWidth) + "px";
  // Height
  eWrapper.style.height = height + "px";
  eLinenumbers.style.height = height + "px";
  eCodeeditor.style.height = height + "px";
  // Update everything
  updateWordWrap(eName);
  updateLineNumbers(eName);
  hideAllDropdowns(eName);
}

function customizeEditor(eName, eSettings = defaultEditorSettings)
{
  let eToolbar = document.getElementById(eName + "-toolbar");
  let left = document.getElementById(eName + "-leftSide");
  let right = document.getElementById(eName + "-rightSide");
  let eButtons = document.getElementsByClassName("dropdown-head");
  let actionButtons = document.getElementsByClassName("action-button");
  let eWrapper = document.getElementById(eName + "-wrapper");
  let eLinenumbers = document.getElementById(eName + "-linenumbers");
  let eCodeeditor = document.getElementById(eName + "-codeeditor");

  if("width" in eSettings)
  {
    let width = eSettings.width;
    let tenPercent = Math.floor(width / 10);
    let fontWidth = getFontWidth(eSettings.fontSize);
    let sidebarPadding = getSidebarPadding(eName);
    let numberWidth = 2 * sidebarPadding + fontWidth * ("" + getLineCount(eName)).length;
    let sidebarWidth = Math.max(tenPercent, numberWidth);
    console.log(tenPercent, numberWidth);
    if("sidebarWidth" in eSettings)
    {
      sidebarWidth = eSettings.sidebarWidth;
    }
    eToolbar.style.width = width + "px";
    eWrapper.style.width = width + "px";
    eLinenumbers.style.width = sidebarWidth + "px";
    eCodeeditor.style.width = (width - sidebarWidth) + "px";
  }
  if("height" in eSettings)
  {
    let height = eSettings.height;
    eWrapper.style.height = height + "px";
    eLinenumbers.style.height = height + "px";
    eCodeeditor.style.height = height + "px";
  }
  if("color" in eSettings)
  {
    let color = eSettings.color;
    eToolbar.style.color = color;
    eLinenumbers.style.color = calculateColorOffset(hexToRgb(color), text_color_offset);
    eCodeeditor.style.color = color;
    if("colorsOverlayFound" in editors[eName]) {
      const text_color_input = document.getElementById(eName + '-textColor');
      text_color_input.value = color;
    }
  }
  if("backgroundColor" in eSettings)
  {
    let color = eSettings.backgroundColor;
    eLinenumbers.style.backgroundColor = calculateColorOffset(hexToRgb(color), background_color_offset);
    eCodeeditor.style.backgroundColor = color;
    if("colorsOverlayFound" in editors[eName]) {
      const background_color_input = document.getElementById(eName + '-backgroundColor');
      background_color_input.value = color;
    }
  }
  if("fontFamily" in eSettings)
  {
    let font = eSettings.fontFamily;
    eLinenumbers.style.fontFamily = font;
    eCodeeditor.style.fontFamily = font;
    if("colorsOverlayFound" in editors[eName]) {
      const font_input = document.getElementById(eName + '-font');
      font_input.value = font;
      console.log(font);
    }
  }
  if("fontSize" in eSettings)
  {
    let size = eSettings.fontSize;
    eLinenumbers.style.fontSize = size + "px";
    eCodeeditor.style.fontSize = size + "px";
    if("colorsOverlayFound" in editors[eName]) {
      const font_size_input = document.getElementById(eName + '-fontSize');
      font_size_input.value = size;
    }
  }
  if("toolBarBackgroundColor" in eSettings)
  {
    let color = eSettings.toolBarBackgroundColor;
    eToolbar.style.backgroundColor = color;
    left.style.backgroundColor = color;
    right.style.backgroundColor = color;
  }
  if ("tabLoad" in eSettings)
  {
    let ts = eSettings.tabLoad;
    let select = document.getElementById(eName + "-tabSelect");
    select.value = ts;
  }
  if ("parensLoad" in eSettings)
  {
    let ps = eSettings.parensLoad;
    let select = document.getElementById(eName + "-parenthesesSelect");
    select.value = ps;
  }
  if ("textWrapLoad" in eSettings)
  {
    let tws = eSettings.textWrapLoad;
    let select = document.getElementById(eName + "-wordWrapSelect");
    select.value = tws;
  }
  if("spacing" in eSettings)
  {

  }

  // Generate dropdowns and action buttons
  if ("hideToolbar" in eSettings && eSettings["hideToolbar"])
  {
    eToolbar.style.height = 20 + "px";
  }
  else {
    if ("dropdownMode" in eSettings)
    {
      let mode = eSettings["dropdownMode"];
      if (mode == "default")
      {
        generateDropdowns(eName, defaultDropdownSettings);
      }
      else if (mode == "custom")
      {
        generateDropdowns(eName, eSettings["dropdownSettings"]);
      }
    }
    if ("actionButtonMode" in eSettings)
    {
      let mode = eSettings["actionButtonMode"];
      if (mode == "default")
      {
        generateActionButtons(eName, defaultActionButtonSettings);
      }
      else if (mode == "custom")
      {
        generateActionButtons(eName, eSettings["actionButtonSettings"]);
      }
    }
  }

  // Toolbar buttons
  if("toolBarTextColor" in eSettings)
  {
    let color = eSettings.toolBarTextColor;
    for (let i = 0; i < eButtons.length; i++)
    {
      eButtons[i].style.color = color;
    }
    for (let i = 0; i < actionButtons.length; i++)
    {
      actionButtons[i].style.color = color;
    }
  }
  if("toolBarButtonColor" in eSettings)
  {
    let color = eSettings.toolBarButtonColor;
    for (let i = 0; i < eButtons.length; i++)
    {
      eButtons[i].style.backgroundColor = color;
    }
    editors[eName].dropdownHeadIdleColor = color;
    editors[eName].dropdownHeadActiveColor = calculateColorOffset(hexToRgb(color), 100);
    for (let i = 0; i < actionButtons.length; i++)
    {
      actionButtons[i].style.backgroundColor = color;
    }
  }

  // Update everything
  updateWordWrap(eName);
  updateLineNumbers(eName);
  hideAllDropdowns(eName);
}

function getFontWidth(fontSize, bufferBetweenChars = 5)
{
  const monospaceRatio = 0.6;
  return Math.ceil(fontSize * monospaceRatio) + bufferBetweenChars;
}

function getSidebarPadding(eName)
{
  return 10;
  // Possible future improvement:
  // let eLinenumbers = document.getElementById(eName + "-linenumbers");
  // return window.getComputedStyle(eLinenumbers).padding;
}

function resize(eName)
{
  let eWrapper = document.getElementById(eName + "-wrapper");
  let eLinenumbers = document.getElementById(eName + "-linenumbers");
  let eCodeeditor = document.getElementById(eName + "-codeeditor");

  let width = eWrapper.style.width.split("px")[0];
  let tenPercent = Math.floor(width / 10);
  let fontSize = eLinenumbers.style.fontSize.split("px")[0];
  let fontWidth = getFontWidth(fontSize);
  let sidebarPadding = getSidebarPadding(eName);
  let numberWidth = 2 * sidebarPadding + fontWidth * ("" + getLineCount(eName)).length;
  let sidebarWidth = Math.max(tenPercent, numberWidth);
  console.log(tenPercent, numberWidth);

  eLinenumbers.style.width = sidebarWidth + "px";
  eCodeeditor.style.width = (width - sidebarWidth) + "px";
}

function setTemplate(eName, text_color, bkgd_color, font, size)
{
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  const text_color_input = document.getElementById(eName + '-textColor');
  const background_color_input = document.getElementById(eName + '-backgroundColor');
  const font_input = document.getElementById(eName + '-font');
  const font_size_input = document.getElementById(eName + '-fontSize');

  text_color_input.value = text_color;
  background_color_input.value = bkgd_color;
  font_input.value = font;
  font_size_input.value = size;

  line_numbers_textarea.style.color = calculateColorOffset(hexToRgb(text_color), text_color_offset);
  code_textarea.style.color = text_color;
  line_numbers_textarea.style.backgroundColor = calculateColorOffset(hexToRgb(bkgd_color), background_color_offset);
  code_textarea.style.backgroundColor = bkgd_color;
  line_numbers_textarea.style.fontFamily = font;
  code_textarea.style.fontFamily = font;
  line_numbers_textarea.style.fontSize = size + "px";
  code_textarea.style.fontSize = size + "px";
}

function dropdownAction(eName, id)
{
  if(!isDropdownShown(id))
  {
    hideAllDropdowns(eName);
    showDropdown(id);
  }
  else
  {
    hideAllDropdowns(eName);
  }
}

function isDropdownShown(id)
{
  let bodyId = id + "-body";
  return document.getElementById(bodyId).classList.contains("show");
}

function showDropdown(id)
{
  let headId = id + "-head";
  let bodyId = id + "-body";
  document.getElementById(bodyId).classList.add("show");
  document.getElementById(headId).style.backgroundColor = editors[eName].dropdownHeadActiveColor;
}

function hideDropdown(id)
{
  let headId = id + "-head";
  let bodyId = id + "-body";
  document.getElementById(bodyId).classList.remove("show");
  document.getElementById(headId).style.backgroundColor = editors[eName].dropdownHeadIdleColor;
}

function hideAllDropdowns(eName)
{
  let dropdowns = editors[eName].dropdowns;
  for (let i = 0; i < dropdowns.length; i++)
  {
    hideDropdown(dropdowns[i]);
  }
}

function changeTextColor(eName)
{
  const text_color_input = document.getElementById(eName + '-textColor');
  let color = text_color_input.value;
  setTextColor(eName, color);
}

function changeBackgroundColor(eName)
{
  const background_color_input = document.getElementById(eName + '-backgroundColor');
  let color = background_color_input.value;
  setBackgroundColor(eName, color);
}

function changeFontSize(eName)
{
  const font_size_input = document.getElementById(eName + '-fontSize');
  let size = font_size_input.value;
  setFontSize(eName, size);
}

function changeFont(eName)
{
  const font_input = document.getElementById(eName + '-font');
  let font = font_input.value;
  setFont(eName, font);
}

function setTextColor(eName, color)
{
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  line_numbers_textarea.style.color = calculateColorOffset(hexToRgb(color), text_color_offset);
  code_textarea.style.color = color;
}

function setBackgroundColor(eName, color)
{
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  line_numbers_textarea.style.backgroundColor = calculateColorOffset(hexToRgb(color), background_color_offset);
  code_textarea.style.backgroundColor = color;
}

function setFontSize(eName, size)
{
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  line_numbers_textarea.style.fontSize = size + "px";
  code_textarea.style.fontSize = size + "px";
  resize(eName);
}

function setFont(eName, font)
{
  const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
  const code_textarea = document.getElementById(eName + '-codeeditor');
  line_numbers_textarea.style.fontFamily = font;
  code_textarea.style.fontFamily = font;
  resize(eName);
}

function calculateColorOffset(color, offset)
{
  let r = color[0] + offset;
  let g = color[1] + offset;
  let b = color[2] + offset;

  if (r > 255) {
    r = 255;
  }
  if (g > 255) {
    g = 255;
  }
  if (b > 255) {
    b = 255;
  }
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

// Helper function
function hexToRgb(hex)
{
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

function showOverlayWrapper(obj, partialId) {
  let eName = obj.id.split("-dropdown")[0];
  let id = eName + "-" + partialId;
  showOverlay(eName, id);
}

function evaluateActionButtonWrapper(obj, func) {
  let eName = obj.id.split("-actionButton")[0];
  func(eName);
}

function showOverlay(eName, id)
{
  hideAllOverlays(eName);
  const overlay = document.getElementById(id);
  overlay.style.display = "block";
}

function hideOverlay(id)
{
  const overlay = document.getElementById(id);
  overlay.style.display = "none";
}

// Needs to be fixed
function hideAllOverlays(eName)
{
  let overlays = editors[eName].overlays;
  for (let i = 0; i < overlays.length; i++)
  {
    hideOverlay(overlays[i]);
  }
}

function customSaveToTextFileWrapper(obj, filename) {
  let eName = obj.id.split("-dropdown")[0];
  saveToTextFile(eName, filename);
}

function saveToTextFileWrapper(obj) {
  let eName = obj.id.split("-dropdown")[0];
  let defaultFilename = eName + ".txt";
  saveToTextFile(eName, defaultFilename);
}

function saveToTextFile(eName, filename)
{
  const code_textarea = document.getElementById(eName + '-codeeditor');
  const text = code_textarea.value;
  const blob = new Blob([text], { type: 'text/plain' });

  const link = document.createElement("a");
  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.onclick = removeLink;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
}

function removeLink(event)
{
  document.body.removeChild(event.target);
}

function updateWordWrap(eName) {
  let setting = document.getElementById(eName + '-wordWrapSelect').value;
  const code_textarea = document.getElementById(eName + '-codeeditor');
  if (setting == '0')
  {
    // break-spaces only supported since 2019
    code_textarea.style.whiteSpace = "break-spaces";
    code_textarea.style.wordBreak = "break-all";
  }
  else
  {
    code_textarea.style.whiteSpace = "pre";
    code_textarea.style.overflowX = "auto";
  }
  updateLineNumbers(eName);
}

function updateLineNumbers(eName)
{
  let setting = document.getElementById(eName + '-wordWrapSelect').value;
  if (setting == '0')
  {
    const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
    let str = "";
    const lines_count = getLineCount(eName);
    // Extra variables
    const code_textarea = document.getElementById(eName + '-codeeditor');
    const lines = code_textarea.value.split("\n");
    let width = code_textarea.style.width.split("px")[0];
    let padding = getSidebarPadding(eName);
    let fontSize = line_numbers_textarea.style.fontSize.split("px")[0];
    let fontWidth = getFontWidth(fontSize, 0);
    let maxNumOfChars = Math.floor((width - 2 * padding) / fontWidth);
    console.log(width, padding, fontSize, fontWidth, maxNumOfChars);
    for (let i = 1; i <= lines_count; i++)
    {
        str = str + i + "\n";
        let diff = lines[i - 1].length - maxNumOfChars;
        if(diff > 0) {
          let extra = Math.ceil(diff / maxNumOfChars);
          for(let j = 0; j < extra; j++) {
            str += "\n";
          }
        }
    }
    line_numbers_textarea.value = str;
    resize(eName);
  }
  else
  {
    const line_numbers_textarea = document.getElementById(eName + '-linenumbers');
    let str = "";
    const lines_count = getLineCount(eName);

    for (let i = 1; i <= lines_count; i++)
    {
        str = str + i + "\n";
    }
    line_numbers_textarea.value = str;
    resize(eName);
  }
}

function getLineCount(eName)
{
  const code_textarea = document.getElementById(eName + '-codeeditor');
  return code_textarea.value.split("\n").length;
}

function updateTabsAndSpaces(eName)
{
  let setting = document.getElementById(eName + '-tabSelect').value;
  let editor = document.getElementById(eName + '-codeeditor');
  let editorText = editor.value;
  let selectionStart = editor.selectionStart;
  let preTabCount = editorText.substring(0, selectionStart).split("\t").length - 1;
  let fullTabCount = editorText.split("\t").length - 1;
  let preTwoSpaceCount = editorText.substring(0, selectionStart).split("  ").length - 1;
  let fullTwoSpaceCount = editorText.split("  ").length - 1;
  let preFourSpaceCount = editorText.substring(0, selectionStart).split("    ").length - 1;
  let fullFourSpaceCount = editorText.split("    ").length - 1;
  if(setting != '0') {
    if (setting == '1') {
      if (fullTabCount > 0) {
        if (preTabCount > 0) {
          selectionStart += preTabCount;
        } else {
          selectionStart = 0;
        }
        editor.value = editorText.replaceAll("\t", "  ");
      }
    } else if (setting == '2') {
      if (fullTabCount > 0) {
        if (preTabCount > 0) {
          selectionStart += 3 * preTabCount;
        } else {
          selectionStart = 0;
        }
        editor.value = editorText.replaceAll("\t", "    ");
      }
    } else if (setting == '3') {
      if (fullTwoSpaceCount > 0) {
        if (preTwoSpaceCount > 0) {
          selectionStart -= preTwoSpaceCount;
        } else {
          selectionStart = 0;
        }
        editor.value = editorText.replaceAll("  ", "\t");
      }
    } else if (setting == '4') {
      if (fullFourSpaceCount > 0) {
        if (preFourSpaceCount > 0) {
          selectionStart -= 3 * preFourSpaceCount;
        } else {
          selectionStart = 0;
        }
        editor.value = editorText.replaceAll("    ", "\t");
      }
    }
    if (editorText != editor.value) {
      editor.selectionStart = selectionStart;
      editor.selectionEnd = selectionStart;
    }
  }
}

function calculateStatistics(eName)
{
  const code_textarea = document.getElementById(eName + '-codeeditor');
  const text = code_textarea.value;
  const charCount = text.length;
  const wordCount = text.split(/\b[a-zA-Z]+\b/gi).length - 1;
  editors[eName].editsCount++;

  document.getElementById(eName + "-charCount").innerHTML = charCount;
  document.getElementById(eName + "-wordCount").innerHTML = wordCount;
  document.getElementById(eName + "-editsCount").innerHTML = editors[eName].editsCount;
}

function refresh(eName)
{
  calculateStatistics(eName);
  updateLineNumbers(eName);
}

function findAndReplace(eName)
{
  const code_textarea = document.getElementById(eName + '-codeeditor');
  const find_input = document.getElementById(eName + '-find');
  const replace_input = document.getElementById(eName + '-replace');
  let text = code_textarea.value;
  let result = text.replaceAll(find_input.value, replace_input.value);
  code_textarea.value = result;
}

function goToGitRepo()
{
  window.open('https://github.com/MichaelWehar/Open-Source-Embedded-Code-Editor', '_blank');
}

function type(eName, str)
{
  let editor = document.getElementById(eName + '-codeeditor');
  let position = editor.selectionStart;
  let value = editor.value;
  editor.value = value.substring(0, position) + str + value.substring(position);
  editor.selectionStart = position + str.length;
  editor.selectionEnd = editor.selectionStart;
  editor.focus();
  refresh(eName);
}

function replaceEditorText(eName, str) {
  let editor = document.getElementById(eName + '-codeeditor');
  editor.value = str;
  refresh(eName);
}

function getEditorText(eName) {
  return document.getElementById(eName + "-codeeditor").value;
}

function backspace(eName, amount)
{
  let editor = document.getElementById(eName + '-codeeditor');
  let position = editor.selectionStart;
  let value = editor.value;
  console.log(value.substring(0, position - amount));
  editor.value = value.substring(0, position - amount) + value.substring(position);
  editor.selectionStart = position - amount;
  editor.selectionEnd = editor.selectionStart;
  editor.focus();
  refresh(eName);
}

function moveCursor(eName, offset)
{
  let editor = document.getElementById(eName + '-codeeditor');
  editor.selectionStart += offset;
  editor.selectionEnd = editor.selectionStart;
  editor.focus();
  refresh(eName);
}

function evaluateActionList(list, delay)
{
  let i = 0;
  let loop = setInterval(
    function()
    {
      if (i < list.length)
      {
        list[i]();
        i++;
      } else
      {
        clearInterval(loop);
        console.log("LOOP STOPPED");
      }
    }, delay);
}

// Automation Sequences
function getTypeSequence(eName, str)
{
  let list = [];
  for(let i = 0; i < str.length; i++)
  {
    list.push(
      function() { type(eName, str[i]); }
    );
  }
  return list;
}

function getBackspaceSequence(eName, amount)
{
  let list = [];
  for(let i = 0; i < amount; i++)
  {
    list.push(
      function() { backspace(eName, 1); }
    );
  }
  return list;
}

function getPauseSequence(amount)
{
  let list = [];
  for(let i = 0; i < amount; i++)
  {
    list.push(
      function() {}
    );
  }
  return list;
}

// Example Animation
function exampleAnimation(eName) {
  let list = [];
  let str1 = "This is a code editor.";
  let str2 = "It is web-based!";
  let str3 = "It is open-source!";
  list.push(...getTypeSequence(eName, str1));
  list.push(...getPauseSequence(5));
  list.push(...getBackspaceSequence(eName, str1.length));
  list.push(...getTypeSequence(eName, str2));
  list.push(...getPauseSequence(5));
  list.push(...getBackspaceSequence(eName, str2.length));
  list.push(...getTypeSequence(eName, str3));
  list.push(...getPauseSequence(5));
  list.push(...getBackspaceSequence(eName, str3.length));
  evaluateActionList(list, 100);
}
