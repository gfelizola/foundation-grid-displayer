if (typeof jQuery === "undefined") {
  alert("The grid displayer requires jQuery + TW Bootstrap or Foundation.");
  
} else {
  // Close grid displayer
  var removeGridDisplayer = function() {  
    $("#grid-displayer-tools").remove();
    $("#grid-displayer").remove();
  },
  
  // Setters
  frameworkIsSet = false,
  setGridFramework = function(gridFramework) {
  
    var $gdContainer = $("#grid-displayer .gd-container"),
    $gdRow           = $("#grid-displayer .gd-row"),
    $gdTools         = $("#grid-displayer-tools"),
    colsHtml         = "",
    gridNbcols       = parseInt($gdTools.find("#gdt-nbcols").val());
    
    if (frameworkIsSet) {
      $gdContainer.removeClass().addClass("gd-container");
      $gdRow.removeClass().addClass("gd-row").css("border-right", 0).empty();
      $("#grid-displayer-tools .framework-specific").hide();
    }
    
    for(var i = 0; i < gridNbcols; i++) {
      colsHtml += "<div class=\"gd-column\">&nbsp;</div>";
    }
    $gdRow.append(colsHtml); 
    var $gdColumn = $gdRow.find(".gd-column"),
    hasBorder = false;
      
    switch(gridFramework) {
      case 'bo':
        $gdContainer.addClass("container");
        $gdRow.addClass("row");
        $gdColumn.addClass("span1");
        $gdTools.find(".twb").show();
      break;
      
      case 'bf':      
        $gdContainer.addClass("container-fluid");
        $gdRow.addClass("row-fluid");
        $gdColumn.addClass("span1");
        $gdTools.find(".twb").show();
      break;
      
      case 'f3':      
        $gdRow.addClass("row");
        $gdColumn.addClass("one columns").filter(":odd").addClass("dontshow"); // 0-based indexing means that, counter-intuitively, :odd selects the 2th element, 4th element, ...    
        hasBorder = true;
      break;
      
      case 'f2':
        $gdRow.addClass("row");
        $gdColumn.addClass("one columns");
      break;
    }
    
    setGridColor($gdTools.find("#gdt-color").val(), hasBorder);
    setGridOpacity($gdTools.find("#gdt-opacity").val(), hasBorder);
    
    if (!frameworkIsSet) {
      $("#grid-displayer").show();
      frameworkIsSet = true;
    }
  },
  setGridColor = function(gridColor, hasBorder) {  
    $("#grid-displayer .gd-column:not(.dontshow)").css("background-color", gridColor);
    if (hasBorder) {
      setBorderStyle();
    }
  },
  setGridOpacity = function(gridOpacity, hasBorder) {  
    $("#grid-displayer .gd-column:not(.dontshow)").css("opacity", gridOpacity);
    if (hasBorder) {
      setBorderStyle();
    }
  },
  setGridZindex = function(gridZindex) {  
    $("#grid-displayer").css("z-index", gridZindex);
  },
  setBorderStyle = function() { // for Foundation 3 only. If only border-opacity existed...
    var currentOpacity = $("#grid-displayer .gd-column:first-child").css("opacity"),
        rgbaColor = $("#grid-displayer .gd-column:first-child").css("background-color").replace('rgb', 'rgba').replace(')',', ' + currentOpacity + ')'); // I'm not proud of this. If you have a nicer solution, your pull request is very welcome.
    $("#grid-displayer .gd-row").css("border-right", "2px solid " + rgbaColor);
  };
  
  // Removes grid displayer when the bookmarklet is clicked for a second time
  if ($("#grid-displayer").length) {
    removeGridDisplayer();
    
  } else {
    // Default parameters
    var gdFramework   = "",
    gdNbcols          = 12,
    gdColor           = "black",
    gdOpacity         = "0.3",
    gdZindex          = "0",
    dataGridFramework = $("body").data("grid-framework"),
    dataGridNbcols    = $("body").data("grid-nbcols"),
    dataGridColor     = $("body").data("grid-color"),
    dataGridOpacity   = $("body").data("grid-opacity"),
    dataGridZindex    = $("body").data("grid-zindex");  
    
    if (typeof dataGridFramework !== "undefined") {
      gdFramework = dataGridFramework;
      setGridFramework(gdFramework);
    }
    if (typeof dataGridColor !== "undefined") {
      gdColor = dataGridColor;
      setGridColor(gdColor);
    }
    if (typeof dataGridOpacity !== "undefined") {
      gdOpacity = dataGridOpacity;
      setGridOpacity(gdOpacity);
    }
    if (typeof dataGridZindex !== "undefined") {
      gdZindex = dataGridZindex;
      setGridZindex(gdZindex);
    }   
    
    // Grid and toolbar HTML
    var gridHtml = "<div id=\"grid-displayer\" style=\"display: none;\"><div class=\"gd-container\"><div class=\"gd-row\"></div></div></div>",
    frameworks = {"bo": "Bootstrap",
                  "bf": "Bootstrap (fluid)",
                  "f3": "Foundation 3",
                  "f2": "Foundation 2" },
    gridToolsHtml = "<div id=\"grid-displayer-tools\">";
    gridToolsHtml += "  <div>Grid displayer</div>";
    gridToolsHtml += "  <div><select id=\"gdt-framework\">";
    gridToolsHtml += "    <option>Choose your framework</option>";
    $.each(frameworks, function(key, value) {     
      gridToolsHtml += "<option value=\"" + key + "\"";
      gridToolsHtml += (key == gdFramework) ? " selected" : "";
      gridToolsHtml += ">" + value + "</option>";
    });
    gridToolsHtml += "  </select></div>";
    gridToolsHtml += "  <div class=\"framework-specific twb\"><label for=\"gdt-nbcols\">Nb cols</label> <input type=\"text\" id=\"gdt-nbcols\" value=\"" + gdNbcols + "\" /></div>";
    gridToolsHtml += "  <div><label for=\"gdt-color\">Columns colour</label> <input type=\"text\" id=\"gdt-color\" value=\"" + gdColor + "\" /></div>";
    gridToolsHtml += "  <div><label for=\"gdt-opacity\">Opacity</label> <input type=\"text\" id=\"gdt-opacity\" value=\"" + gdOpacity + "\" /></div>";
    gridToolsHtml += "  <div><label for=\"gdt-zindex\">z-index</label> <input type=\"text\" id=\"gdt-zindex\" value=\"" + gdZindex + "\" /></div>";
    gridToolsHtml += "  <div>update on blur</div>";
    gridToolsHtml += "  <div><a href=\"#\" id=\"gdt-close\">Close</a></div>";
    gridToolsHtml += "</div>";
    
    $("head").append("<link rel='stylesheet' type='text/css' href='http://lnx3.lyon.novius.fr/gd-bookmarklet.css'>"); //http://alefeuvre.github.com/foundation-grid-displayer/stylesheets/
    $("body").prepend(gridHtml).prepend(gridToolsHtml);  
    $("#grid-displayer-tools").delay(1200).fadeTo("slow",0.1); 
    
    // Updates
    $("#grid-displayer-tools #gdt-framework").change(function() {
      gdFramework = $(this).val();
      if (gdFramework == "f3" || gdFramework == "f2") {
        $("#grid-displayer-tools #gdt-nbcols").val(12);
      }
      setGridFramework(gdFramework);
    });    
    $("#grid-displayer-tools #gdt-nbcols").change(function() {
      setGridFramework(gdFramework);
    });    
    $("#grid-displayer-tools #gdt-color").change(function() {
      setGridColor($(this).val(), gdFramework == "f3");
    });    
    $("#grid-displayer-tools #gdt-opacity").change(function() {
      setGridOpacity($(this).val(), gdFramework == "f3");
    });    
    $("#grid-displayer-tools #gdt-zindex").change(function() {
      setGridZindex($(this).val());
    });    
    
    $("#grid-displayer-tools #gdt-close").click(function() {
      removeGridDisplayer();
    });
  } 
}