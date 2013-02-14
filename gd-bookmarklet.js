if (typeof jQuery === "undefined") {
  alert("The grid displayer requires jQuery + TW Bootstrap or Foundation.");

} else {
  // Close grid displayer
  var removeGridDisplayer = function() {
    $("#grid-displayer-tools").remove();
    $("#grid-displayer").remove();
  },

  // Build grid displayer
  gdIsBuilt = false,
  buildGridDisplayer = function(gridFramework) {

    var $gdContainer = $("#grid-displayer .gd-container"),
    $gdRow           = $("#grid-displayer .gd-row"),
    $gdTools         = $("#grid-displayer-tools"),
    colsHtml         = "",
    gridNbcols       = parseInt($gdTools.find("#gdt-nbcols").val());

    if (gdIsBuilt) {
      $gdContainer.removeClass().addClass("gd-container");
      $gdRow.removeClass().addClass("gd-row").css("border-right", 0).empty();
      $gdTools.find(".framework-specific").hide();
    }

    for(var i = 0; i < gridNbcols; i++) {
      colsHtml += "<div class=\"gd-column\"><div class=\"gd-column-content\">&nbsp;</div></div>";
    }
    $gdRow.append(colsHtml);
    var $gdColumn = $gdRow.find(".gd-column"),
    hasBorder = false;

    switch(gridFramework) {
      case 'bo':
        $gdContainer.addClass("container");
        $gdRow.addClass("row");
        $gdColumn.addClass("span1");
        $gdTools.find(".twb").css("display", "inline-block");
      break;

      case 'bf':
        $gdContainer.addClass("container-fluid");
        $gdRow.addClass("row-fluid");
        $gdColumn.addClass("span1");
        $gdTools.find(".twb").css("display", "inline-block");
      break;

      case 'f3':
        $gdRow.addClass("row");
        $gdColumn.addClass("one columns");//.filter(":odd").addClass("dontshow"); // 0-based indexing means that, counter-intuitively, :odd selects the 2th element, 4th element, ...
        hasBorder = true;
      break;

      case 'f2':
        $gdRow.addClass("row");
        $gdColumn.addClass("one columns");
      break;
    }

    // setGridColor($gdTools.find("#gdt-color").val(), hasBorder);
    // setGridOpacity($gdTools.find("#gdt-opacity").val(), hasBorder);
    setGridColorAndOpacity($gdTools.find("#gdt-color").val(), $gdTools.find("#gdt-opacity").val(), hasBorder);

    if (!gdIsBuilt) {
      $gdTools.find("#gdt-options").css("display", "block"); // as the CSS is loaded after the JS, show() is overwritten by display: none
      $gdTools.find("#gdt-ok").css("display", "block");
      setGridZindex($gdTools.find("#gdt-zindex").val());
      $("#grid-displayer").show();
      gdIsBuilt = true;
    }
  },

  // Setters
  setGridColor = function(gridColor, hasBorder) {
    $("#grid-displayer .gd-column:not(.dontshow)").css("background-color", gridColor);
    $("#grid-displayer .gd-column:not(.dontshow) .gd-column-content").css("background-color", gridColor);
    if (hasBorder) {
      setBorderStyle();
    }
  },
  setGridOpacity = function(gridOpacity, hasBorder) {
    $("#grid-displayer .gd-column:not(.dontshow)").css("opacity", gridOpacity);
    $("#grid-displayer .gd-column:not(.dontshow) .gd-column-content").css("opacity", gridOpacity);
    if (hasBorder) {
      setBorderStyle();
    }
  },
  setGridColorAndOpacity = function(gridColor, gridOpacity, hasBorder) {
    var color = new RGBColor(gridColor);
    if (color.ok) {
        gridColor = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + gridOpacity + ')'
    }

    $("#grid-displayer .gd-column:not(.dontshow)").css("background-color", gridColor);
    $("#grid-displayer .gd-column:not(.dontshow) .gd-column-content").css("background-color", gridColor);
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

  if ($("#grid-displayer").length) { // Close grid displayer when the bookmarklet is clicked for a second time
    removeGridDisplayer();
  } else {

    // Default parameters
    var dataGridFramework = $("body").data("grid-framework"),
    dataGridNbcols        = $("body").data("grid-nbcols"),
    dataGridColor         = $("body").data("grid-color"),
    dataGridOpacity       = $("body").data("grid-opacity"),
    dataGridZindex        = $("body").data("grid-zindex"),

    gdFramework           = (typeof dataGridFramework === "undefined") ? "" : dataGridFramework,
    gdNbcols              = (typeof dataGridNbcols === "undefined") ?    "12" : dataGridNbcols,
    gdColor               = (typeof dataGridColor === "undefined") ?     "black" : dataGridColor,
    gdOpacity             = (typeof dataGridOpacity === "undefined") ?   "0.3" : dataGridOpacity,
    gdZindex              = (typeof dataGridZindex === "undefined") ?    "0" : dataGridZindex;

    // HTML
    var gridHtml = "<div id=\"grid-displayer\" style=\"display: none;\"><div class=\"gd-container\"><div class=\"gd-row\"></div></div></div>",
    frameworks = {"bo": "Bootstrap",
                  "bf": "Bootstrap (fluid)",
                  "f3": "Foundation 3",
                  "f2": "Foundation 2" },
    gridToolsHtml = "<div id=\"grid-displayer-tools\">";
    gridToolsHtml += "  <div class=\"gdt-field\"><select id=\"gdt-framework\">";
    gridToolsHtml += "    <option>&darr; Choose your framework</option>";
    $.each(frameworks, function(key, value) {
      gridToolsHtml += "<option value=\"" + key + "\"";
      gridToolsHtml += (key == gdFramework) ? " selected" : "";
      gridToolsHtml += ">" + value + "</option>";
    });
    gridToolsHtml += "    <option value=\"tired\">I'm tired of choosing my framework</option>";
    gridToolsHtml += "  </select></div>";
    gridToolsHtml += "  <div id=\"gdt-options\" class=\"gdt-field\">";
    gridToolsHtml += "    <div><label for=\"gdt-color\">Columns colour</label><input type=\"text\" id=\"gdt-color\" value=\"" + gdColor + "\" /></div>";
    gridToolsHtml +=     "<div><label for=\"gdt-opacity\">Opacity</label><input type=\"text\" id=\"gdt-opacity\" value=\"" + gdOpacity + "\" /></div>";
    gridToolsHtml +=     "<div class=\"framework-specific twb\"><label for=\"gdt-nbcols\">Nb cols</label><input type=\"text\" id=\"gdt-nbcols\" value=\"" + gdNbcols + "\" /></div>";
    gridToolsHtml +=     "<div><label for=\"gdt-zindex\">z-index</label><input type=\"text\" id=\"gdt-zindex\" value=\"" + gdZindex + "\" /></div>";
    gridToolsHtml += "  </div>";
    gridToolsHtml += "  <div class=\"gdt-button\" id=\"gdt-ok\"><a href=\"#\">OK</a></div>";
    gridToolsHtml += "  <div class=\"gdt-button\"><a href=\"#\" id=\"gdt-close\">Close</a></div>";
    gridToolsHtml += "</div>";

    $("head").append("<link rel='stylesheet' type='text/css' href='http://localhost/grid-displayer/stylesheets/gd-bookmarklet.css'>");
    $("body").prepend(gridHtml).prepend(gridToolsHtml);
    $("#grid-displayer-tools").delay(1200).fadeTo("slow",0.1);

    if (typeof dataGridFramework !== "undefined") {
      buildGridDisplayer(gdFramework);
    }

    // Actions
    $("#grid-displayer-tools #gdt-framework").change(function() {
      if ($(this).val() == "tired") {
        window.open("http://snipt.net/jiraisurfer/custom-parameters-for-foundation-grid-displayer/");
      } else {
        gdFramework = $(this).val();
        if (gdFramework == "f3" || gdFramework == "f2") {
          $("#grid-displayer-tools #gdt-nbcols").val(12);
        }
        buildGridDisplayer(gdFramework);
      }
    });
    $("#grid-displayer-tools #gdt-nbcols").change(function() {
      buildGridDisplayer(gdFramework);
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

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}
