jQuery.support.cors = true;
// fullscreen mode 
function activateFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();        // W3C spec
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();     // Firefox
  }
  else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();  // Safari
  }
  else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();      // IE/Edge
  }
  else{
  	console.log("Functionnality not available.");
  }
};

function deactivateFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};


var editor; // use a global for the submit and return data rendering in the examples
$(document).ready(function() {

//  enable scrolling in fullscreen mode
jQuery.event.special.touchstart = 
{
  setup: function( _, ns, handle )
  {
    if ( ns.includes("noPreventDefault") ) 
    {
      this.addEventListener("touchstart", handle, { passive: false });
    } 
    else 
    {
      this.addEventListener("touchstart", handle, { passive: true });
    }
  }
};


editor = new $.fn.dataTable.Editor( {
		ajax : {url:"php/phc_morph.php?lang=binge",type:"POST",dataType:"json"},
		table: "#example",
		lang:languageW,
		display: "envelope",
		fields: [ 
			{		
				label: "Morphème",
				name: "morphem",
				type: "text",
			}, 
			{		
				label: "Lexie",
				name: "word",
				type: "text",
			}, 
			{
				label: "Fréq. absolue (CZ)",
				name: "freq_cz",
				type: "text"
			},
			{
				label: "Fréq. relative (CZ)",
				name: "relfreq_cz",
				type: "text"
			},
			{
				label: "Fréq. absolue (FR)",
				name: "freq_fr",
				type: "text"
			},
			{
				label: "Fréq. relative (FR)",
				name: "relfreq_fr",
				type: "text"
			},
			{
				label: "Fréq. absolue (PL)",
				name: "freq_pl",
				type: "text"
			},
			{
				label: "Fréq. relative (PL)",
				name: "relfreq_pl",
				type: "text"
			},
			{
				label: "Fréquence absolue (EN)",
				name: "freq_en",
				type: "text"
			},
			{
				label: "Fréq. relative (EN)",
				name: "relfreq_en",
				type: "text"
			}
		]
,
        i18n: {
            create: {
                button: "Nouveau",
                title:  "Créer nouvelle entrée",
                submit: "Créer"
            },
            edit: {
                button: "Modifier",
                title:  "Modifier entrée",
                submit: "Actualiser"
            },
            remove: {
                button: "Supprimer",
                title:  "Supprimer",
                submit: "Supprimer",
                confirm: {
                    _: "Etes-vous sûr de vouloir supprimer %d lignes?",
                    1: "Etes-vous sûr de vouloir supprimer 1 ligne?"
                }
            },
            error: {
                system: "Une erreur s’est produite, contacter l’administrateur système"
            },
            datetime: {
                previous: 'Précédent',
                next:     'Premier',
                months:   [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
                weekdays: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ]
            }
        }		
	} );

//editor.lang=languageW;

// New record
$('a.editor_create').on('click', function (e) {
        e.preventDefault();
 
        editor.create( {
            title: 'Créer une nouvelle entrée',
            buttons: 'Ajouter'
        } );
    } );
    
// Edit record
$('#example').on('click', 'td.editor_edit', function (e) {
        e.preventDefault();
 
        editor.edit( $(this).closest('tr'), {
            title: "Edition d'une entrée",
            buttons: 'Actualiser'
        } );
    } );
 
// Delete a record
$('#example').on('click', 'td.editor_remove', function (e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        //console.log(row.data())

        editor.remove( $(this).closest('tr'), {
            title: "Suppression d'une entrée",
            message: 'Etes-vous certain de vouloir supprimer cette entrée (' + row.data().word + ")? Cette action n'est pas réversible.",
            buttons: 'Supprimer'
        } );
    } );

// change morph
// fonction pour changer de langue source pour interface neologismes
$('body').on('change',"#lang",function(){
                val = this.value;
                console.log(val);
                editor.ajax = "php/phc_morph.php?lang="+val;
                editor.s.ajax = "php/phc_morph.php?lang="+val;
                editor.lang = val;
				table.state.clear();
                table.ajax.url("php/phc_morph.php?lang="+val).load();
                /*document.getElementById("validate").lang=val;
                document.getElementById("validate2").lang=val;
                document.getElementById("validateb").lang=val;
                document.getElementById("validate2b").lang=val;*/
            });


// filtering input fields
    $('#example thead tr:eq(1) th').each( function (i) {
    	if ([0,1,2,3,4,5,6,7,8].includes(i))
    	{
        	var title = $(this).text();
        	$(this).html( '<input type="text"  class="column_search"/>' ); //  placeholder="'+title+'" 
 		}
 	});
    $( '#example thead').on( 'keyup change click', ".column_search", function () {
    			console.log(this.value);
                table
                    .column( $(this).parent().index()+':visible' )
                    .search( this.value , regex=true, smart=false)
                    .draw();
    } );



var table = $('#example').DataTable( {
		dom: 'B<"col-sm-6"l>rt<i><p>',
		fixedHeader: true,
		scrollY: '200vh',
        scrollCollapse: true,
		//serverSide:true,
		//processing:true,
		//"deferLoading": [ 57, 100 ],
//		deferRender: true,
		ajax: {url:"php/phc_morph.php?lang=binge",type:"GET",dataType:"json"},
		lengthMenu: [[10, 25, 50, 100,  -1], [10, 25, 50, 100, "Tous"]],
		lengthChange: true,
		order: [[ 0, "asc" ]],
		select:true,
		responsive: true,   
		columnDefs: [{
    		targets: [2,4,6,8],
    		render(v){
      			return Number(v).toFixed(4) 
    		}
  		}],
		columns: [
			{data: "word"}, // , className: 'editable' 
			{data: "freq_cz"},
			{data: "relfreq_cz"},
			{data: "freq_fr"},
			{data: "relfreq_fr"},
			{data: "freq_pl"},
			{data: "relfreq_pl"},
			{data: "freq_en"},
			{data: "relfreq_en"},

			// events buttons

			{
                className:      'details-control2',
                orderable:      false,
                data:           null,
                defaultContent: '',
                render: function(){return '<i title="Rechercher et analyse des contextes du JSI" class="fa fa-bar-chart fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';}

            },
			{
                className:      'editor_edit',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
			{
                className:      'editor_remove',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
		],
		buttons: [
			{ extend: "create", editor: editor },
			{ extend: "edit", editor: editor },
			{ extend: "remove",   editor: editor },
			{ extend: "colvis", editor: editor, text:"Visibilité" , columns: ':lt(9)'},
			{	extend: 'collection',
                text: 'Exporter',
                exportOptions : {
            	rows : "{search:'applied'}"},
                buttons: [
                    'copy',
                    'excel',
                    'csv',
                    'pdf',
                    'print'
                ]
            }
			
		],
		language:{url:"//cdn.datatables.net/plug-ins/1.10.13/i18n/French.json"}
		
	} );
	

// interactive visualization of retrieved contexts from jsi contexts (in mysql db) for truncated given word
// with fullscreen mode)
$('#example tbody').on('click', 'td.details-control2', function () {
		var td = $(this);
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        console.log(row);
 		if (editor.lang == undefined){editor.lang='fr';}
 		
       if ( td.children('i').hasClass('close') ) {
            // This row is already open - close it
            console.log(row.child);
        	//row.child.removeClass('stat_res');
            row.child.hide();
            td.empty().append('<i title="Rechercher et analyser les contextes du JSI" class="fa fa-bar-chart fa-lg open" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>')
        }
        else {
            $.blockUI({ message: '<div class="card-body"><img src="./images/ajax-loader.gif" width="50" />Chargement en cours...</div>' }); 
            // Open this row
            console.log(row.data())
            get_neo_info_mysqldata(editor.lang, row.data(), function(data) // from mysql
            {
	            console.log(data)
    	        row.child(  data ).show();
	            //details = row.child()
        	    //details.addClass('shown');
        	    row.child().addClass('stat_res');
            	if (data.startsWith('R')){
            		console.log("displaying results");
				    $('#neoResults'+ editor.lang).clone().appendTo('.stat_res td'); // .clone()
				    $("#neoResults" + editor.lang).show();
				}
        	$.unblockUI();
        	td.empty().append('<i title="Rechercher et analyser les contextes du JSI" class="fa fa-bar-chart fa-lg close" aria-hidden="true" style="color:red;cursor: pointer;"></i>')
            }
            );
        }
    } );


} );

//////////////   STATS FOR SPECIFIC NEOLOGISM 



/// JSI web corpus contexts - interactive visualization of data with contexts analyzed (in db)
// get info from mysql
function get_neo_info_mysqldata(lang,neo,callback) 
{
   		//word = neo.word.slice(0,-3) // "kind of" stemmatization
   		word = neo.word.replace(/[- ]/g,'.?')
    	console.log(neo);
		d3.json("./php/db_access.php?action=contextes&word="+word+"&word2="+neo.word+"&morphem="+ neo.morphem, function(error, data) {
        	//console.log(data);
        	console.log(error);
        	count = data.length;
        	console.log(count);
        	if (count == 0){
        		res = '<div class="alert alert-danger" role="alert">Les contextes des corpus TimeStamped JSI n\'ont pas encore été chargées pour cette entrée. La récupération est maintenant programmée et sera disponible sous un jour.</div>';
            	callback(res);
            }
            else{
//              res = '<div class="alert alert-info" role="alert">Résultat : ' + count.toString() + " contextes pour cette lexie dans le corpus Timestamped JSI web corpus 2014-2019. Requête étendue : " + word + '</div>';
            	res = "Résultat : " + count.toString() + " contextes pour cette lexie dans le corpus Timestamped JSI web corpus 2014-2019. Requête étendue : " + word;
	            callback(res);
	            build_neo_contexts_viz2(data,lang);
	        }
        	
        });   
}


// main function to display interactive graphs (called by get_neo_info_mysqldata())
function build_neo_contexts_viz2(jsondata, lang){

console.log(jsondata[0]);
/********************* GET THE JSON DATA AND TRANSFORM WHEN NECESSARY ***********/
  // format our data : dateS,source,link,subject,subject2, neologisms
  
  langs = {'1':'fr','2':'pl','3':'cz'};
  var dtgFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
  
  jsondata.forEach(function(d) { 
  		//console.log(d);
  		d.lang = langs[d.lang]
    	d.dtg   = dtgFormat.parse(d.date);    	
    	d.core = d.key_word + "/" + d.key_pos;    	
  });
console.log(jsondata[1]);
console.log("Data Loaded");

/*******************  GLOBAL DIMENSIONS ****************************/
  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(jsondata);
  var all = facts.groupAll();
  

/*************** TOTAL CHART *********************************/
  
totalCount = dc.dataCount('.dc-data-count'+lang);
totalCount 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> sélectionnés sur <strong>%total-count</strong> articles' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Réinitialiser</a>',
            all: 'Tous les articles sélectionnés. Cliquez sur les graphes pour effectuer des filtres.'
        });
  
totalCount2 = dc.dataCount('.dc-data-count2'+lang);
totalCount2 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> sélectionnés sur <strong>%total-count</strong> articles' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Réinitialiser</a>',
            all: 'Tous les articles sélectionnés. Cliquez sur les graphes pour effectuer des filtres.'
        });
  
  
console.log("Count chart built"); 		   
console.log(totalCount);
/***************************** NEOPOS ROW BAR CHART ***********************/
var neoChart = dc.rowChart("#dc-neo-chart"+lang);
var neoDim = facts.dimension(function(d){ return d.core;});
var neoGroup = neoDim.group().reduceCount(function(d) { return d.core; });
/// for top	
function remove_empty_bins(source_group) {
    function non_zero_pred(d) {
        return d.value != 0;
    }
    return {
        all: function () {
            return source_group.all().filter(non_zero_pred);
        },
        top: function(n) {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(0, n);
        }
    };
}
var neoGroupTop = remove_empty_bins(neoGroup);
console.log("Neo groups");
console.log(neoGroupTop.all());
// neo chart
	neoChart
			//.width($(this).parent().innerWidth())
           .height(300)
           .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(neoDim)
            .group(neoGroupTop)
            .rowsCap(15)
            .othersGrouper(false)
            .label(function(d){return d.key + ' (' + d.value + ')';})
            //.title(function(d){return d.key + ' (' + d.value + ')';})
            .renderLabel(true)
            .colors(d3.scale.category10())
            //.colors(["#64baaa", "#8c1132", "#6ce03f", "#8438ba", "#91b84b", "#f75ef0", "#056e12", "#e04f7e", "#21f0b6", "#f24219"]) // http://vrl.cs.brown.edu/color
            .gap(0.3)
            //.renderTitleLabel(true)
            .ordering(function (d) {
    			return -d.value
			})
    		.elasticX(true)
    		//.renderTitleLabel(true)
		    .turnOnControls(true)
	        .controlsUseVisibility(true)
	        .xAxis() //.tickValues([0,1,2,3,4,5,6,7,8,9,10]) // .ticks(5)
	        ;		   

console.log(d3.scale.log)
console.log("Neo chart built");
console.log(neoChart);

/***************************** SUBJECT PIE CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.rowChart("#dc-subject-chart"+lang);
var subjectDimension = facts.dimension(function (d) { return d.lang; });
var subjectGroup = subjectDimension.group();
var subjectGroupTop = remove_empty_bins(subjectGroup);
console.log("Subject groups :" + subjectGroupTop.all());
  
// subject chart
 	subjectChart
 		//.width(300)
        .height(300)
        .margins({top: 0, right: 0, bottom: 30, left: 0})
        .dimension(subjectDimension)
        .group(subjectGroupTop)
        
        .rowsCap(10)
        .colors(d3.scale.category10())
        .othersGrouper(false)
        .label(function(d){return d.key + ' (' + d.value + ')';})
        .renderLabel(true)
        .gap(0.3)
        .ordering(function (d) {
    		return -d.value
		})
    	.elasticX(true)
		.turnOnControls(true)
	    .controlsUseVisibility(true)
	    .xAxis() //.tickValues([0,1,5,10,20,30,40,50,100,1000,10000])
 	    ;
        
console.log("Lang chart built");
//console.log(subjectChart);


/***************************** COUNTRY ROW BAR CHART ***********************/

var countryChart = dc.rowChart("#dc-country-chart"+lang);
var countryDimension = facts.dimension(function (d) { return d.country; });
var countryGroup = countryDimension.group().reduceCount(function (d) { return d.country; });
var countryGroupTop = remove_empty_bins(countryGroup);
console.log("country groups :" + countryGroupTop.all());

// newspaper setup rowschart (TOP)
    countryChart
    		//.width(300)
            .height(300)
            .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(countryDimension)
            .group(countryGroupTop)
        .rowsCap(15)
        .othersGrouper(false)
        .colors(d3.scale.category10())
        .label(function(d){return d.key + ' (' + d.value + ')';})
        .renderLabel(true)
        .gap(0.3)
        .ordering(function (d) {
    		return -d.value
		})
    	.elasticX(true)
		.turnOnControls(true)
	    .controlsUseVisibility(true)
	    .xAxis() //.tickValues([0,1,5,10,20,30,40,50,100,1000,10000])
 	    ;



console.log("country chart built");


/***************************** NEWSPAPER ROW BAR CHART ***********************/

var newspaperChart = dc.rowChart("#dc-newspaper-chart"+lang);
var newspaperDimension = facts.dimension(function (d) { return d.journal; });
var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.journal; });
var newspaperGroupTop = remove_empty_bins(newspaperGroup);
console.log("newspaper groups :" + newspaperGroupTop.all());

// newspaper setup rowschart (TOP)
    newspaperChart
    		//.width(300)
            .height(300)
            .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(newspaperDimension)
            .group(newspaperGroupTop)
        .rowsCap(15)
        .othersGrouper(false)
        .colors(d3.scale.category10())
        .label(function(d){return d.key + ' (' + d.value + ')';})
        .renderLabel(true)
        .gap(0.3)
        .ordering(function (d) {
    		return -d.value
		})
    	.elasticX(true)
		.turnOnControls(true)
	    .controlsUseVisibility(true)
	    .xAxis() //.tickValues([0,1,5,10,20,30,40,50,100,1000,10000])
 	    ;



console.log("Newspapers chart built");
//console.log(newspaperChartLow);
//console.log(newspaperChart);



/***************************** TIMELINE ***********************/



// see http://dc-js.github.io/dc.js/docs/html/dc.lineChart.html
// Create the dc.js chart objects & link to div
var timeChart = dc.lineChart("#dc-time-chart"+lang);
var periodChart = dc.barChart("#range-chart"+lang);

// create timeline chart dimensions
	var volumeByDay = facts.dimension(function(d) {
    return d3.time.day(d.dtg);
  });
	var volumeByMonth = facts.dimension(function(d) {
    return d3.time.month(d.dtg);
  });

  var volumeByDayGroup = volumeByDay.group()
    .reduceCount(function(d) { return d.dtg; });
    console.log("Day groups :" + volumeByDayGroup.size());

  var volumeByMonthGroup = volumeByMonth.group()
    .reduceCount(function(d) { return d.dtg; });
	console.log("Month groups :" + volumeByMonthGroup.size());
    
    // min and max date
    var minDate = volumeByDay.bottom(1)[0].dtg;
 	var maxDate = volumeByDay.top(1)[0].dtg;
	console.log(String(minDate) + ":" + String(maxDate));

  // setup timeline graph
  timeChart
  	//.width(700)
   .height(250)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .dotRadius(5) //
    //.renderArea(true)
    .dimension(volumeByDay)
    .group(volumeByDayGroup)
    .transitionDuration(500)
    .mouseZoomable(true)    
    .brushOn(false)
    .renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    .title(function(d){
      return dtgFormat(d.key)
      + "\nTotal : " + d.value;
      })
    .elasticY(true)
    .rangeChart(periodChart)
    .xUnits(d3.time.day)
    //.curve(d3.curveBasisOpen) //d3 > 3
    .interpolate('cardinal') // 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 
    //'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and 'monotone'.
    .renderHorizontalGridLines(true)    
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxis();


  
  console.log("Time chart built");
  console.log(timeChart);
  
/******************  range chart **************/
periodChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(100)
        .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByDay)
    	.group(volumeByDayGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);

/********************* composite chart by lemme/pos ***********/
// Composite chart
var compositeChart = dc.compositeChart("#dc-comptime-chart"+lang);
var periodChart2 = dc.barChart("#range-chart2"+lang);

var volumeByDaycoreGroupTmp = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
    	//console.log("reduceAdd : p : ");
    	//console.log(p);
    	//console.log("reduceAdd : v : ");
    	//console.log(v);
        p[v.core] = (p[v.core] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.core] -= 1; // for sum v.value
        return p;
    },
    function reduceInitial() { // init
        return {};
    }); 

var volumeByDaycoreGroup = remove_empty_bins(volumeByDaycoreGroupTmp)
// build list of neo types
wordkeys= [];
reskeys = neoGroupTop.top(Infinity);
for (var i = 0; i < reskeys.length; i++){wordkeys.push(reskeys[i].key);}
//console.log("Word keys");
//console.log(wordkeys);

console.log(volumeByDaycoreGroup.all());
console.log(wordkeys);
//console.log("color domain for neochart");
//console.log(neoChart.colors());
//console.log(neoChart.colorAccessor());
//console.log(neoChart.getColor(wordkeys[1]));
rescharts = wordkeys.slice(0,10).map(function(name, index) { // .slice(0,5)
//console.log(name)
//console.log(neoChart.getColor(wordkeys[index]))
        	return dc.lineChart(compositeChart)
            	.dimension(volumeByMonth)
            	.group(volumeByDaycoreGroup,name)
            	.colors(neoChart.colors())//'#'+Math.random().toString(16).slice(-6)
            	//.interpolate('basis-open')
            	.renderDataPoints({radius: 3})
				.defined(function(d) {
            		//console.log(d);
    				if(d.y !== undefined) {
       					 return d.y;
    				}
    				else{
    					return 0;
    				}
				})            	
				.renderDataPoints({radius: 3} ) // fillOpacity: 1, strokeOpacity: 1,             	
            	.valueAccessor(function(kv) {
            		//console.log(kv);
                	return kv.value[name];
            	})
            	.xyTipsOn(true)
            	.title(function(kv) {
            		//console.log(kv);
                	return name +  ': ' + kv.value[name]  ;
            	})
            	;
    		});
console.log(rescharts);
//console.log(compositeChart);
compositeChart
    .height(300)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
    .mouseZoomable(true)
    .brushOn(false)
    //.renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    .elasticY(true)
    .elasticX(true)
    .shareTitle(false) 
    
	.compose(rescharts)
    .rangeChart(periodChart2)
    .xUnits(d3.time.month)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
 periodChart2 
        .height(100)
        .margins({top: 10, right: 10, bottom: 30, left: 40})
	    .dimension(volumeByMonth)
    	.group(volumeByDayGroup)
        .centerBar(true)
        //.elasticY(true)
        .elasticX(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);


/********************* composite chart by domain ***********/
// Composite chart
var compositeChart2 = dc.compositeChart("#dc-comptimedomain-chart"+lang);
var periodChart3 = dc.barChart("#range-chart3"+lang);

var volumeByDaycoreGroupTmp2 = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.lang] = (p[v.lang] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.lang] -= 1; // for sum v.value
        return p;
    },
    function reduceInitial() { // init
        return {};
    }); 

var volumeByDaycoreGroup2 = remove_empty_bins(volumeByDaycoreGroupTmp2)
// build list of neo types
wordkeys2= [];
reskeys2 = subjectGroupTop.top(Infinity);
for (var i = 0; i < reskeys2.length; i++){wordkeys2.push(reskeys2[i].key);}
//console.log("Word keys");
//console.log(wordkeys);

console.log(volumeByDaycoreGroup2.all());
console.log(wordkeys2);
rescharts2 = wordkeys2.slice(0,10).map(function(name) { // .slice(0,5)
        	return dc.lineChart(compositeChart2)
            	.dimension(volumeByMonth)
            	.group(volumeByDaycoreGroup2,name)
            	.colors(subjectChart.colors())
//            	.colors('#'+Math.random().toString(16).slice(-6))
            	//.interpolate('basis-open')
				.defined(function(d) {
            		//console.log(d);
    				if(d.y !== undefined) {
       					 return d.y;
    				}
    				else{
    					return 0;
    				}
				})            	
				.renderDataPoints({radius: 3} ) // fillOpacity: 1, strokeOpacity: 1,
            	.valueAccessor(function(kv) {
            		//console.log(kv);
                	return kv.value[name];
            	})
            	.xyTipsOn(true)
            	.title(function(kv) {
            		//console.log(kv);
                	return name +  ': ' + kv.value[name]  ;
            	})
            	;
    		});
console.log(rescharts2);
//console.log(compositeChart);
compositeChart2
    .height(300)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
//    .mouseZoomable(true)
    .brushOn(false)
    //.renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    .elasticY(true)
    .elasticX(true)
    .shareTitle(false) 
    
	.compose(rescharts2)
    .rangeChart(periodChart3)
    .xUnits(d3.time.day)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
periodChart3 
        .height(100)
        .margins({top: 10, right: 10, bottom: 30, left: 40})
	    .dimension(volumeByMonth)
    	.group(volumeByDayGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);


/********************* composite chart by country ***********/
// Composite chart
var compositeChart7 = dc.compositeChart("#dc-comptimecountry-chart"+lang);
var periodChart7 = dc.barChart("#range-chart7"+lang);

var volumeByDaycoreGroupTmp7 = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.country] = (p[v.country] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.country] -= 1; // for sum v.value
        return p;
    },
    function reduceInitial() { // init
        return {};
    }); 

var volumeByDaycoreGroup7 = remove_empty_bins(volumeByDaycoreGroupTmp7)
// build list of neo types
wordkeys7= [];
reskeys7 = countryGroupTop.top(Infinity);
for (var i = 0; i < reskeys7.length; i++){wordkeys7.push(reskeys7[i].key);}
console.log("Word keys");
console.log(wordkeys7);

console.log(volumeByDaycoreGroup7.all());
console.log(wordkeys7);
rescharts7 = wordkeys7.slice(0,10).map(function(name) { // .slice(0,5)
        	return dc.lineChart(compositeChart7)
            	.dimension(volumeByMonth)
            	.group(volumeByDaycoreGroup7,name)
            	.colors(countryChart.colors())
//            	.colors('#'+Math.random().toString(16).slice(-6))
            	//.interpolate('basis-open')
				.defined(function(d) {
            		//console.log(d);
    				if(d.y !== undefined) {
       					 return d.y;
    				}
    				else{
    					return 0;
    				}
				})            	
				.renderDataPoints({radius: 3} ) // fillOpacity: 1, strokeOpacity: 1,             	
            	.valueAccessor(function(kv) {
            		//console.log(kv);
                	return kv.value[name];
            	})
            	.xyTipsOn(true)
            	.title(function(kv) {
            		//console.log(kv);
                	return name +  ': ' + kv.value[name]  ;
            	})
            	;
    		});
console.log(rescharts7);
//console.log(compositeChart);
compositeChart7
    .height(300)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
//    .mouseZoomable(true)
    .brushOn(false)
    //.renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    .elasticY(true)
    .elasticX(true)
    .shareTitle(false) 
    
	.compose(rescharts7)
    .rangeChart(periodChart7)
    .xUnits(d3.time.day)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
periodChart7 
        .height(100)
        .margins({top: 10, right: 10, bottom: 30, left: 40})
	    .dimension(volumeByMonth)
    	.group(volumeByDayGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);



/********************* composite chart by newspaper ***********/
// Composite chart
var compositeChart3 = dc.compositeChart("#dc-comptimenews-chart"+lang);
var periodChart4 = dc.barChart("#range-chart4"+lang);

var volumeByDaycoreGroupTmp3 = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.journal] = (p[v.journal] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.journal] -= 1; // for sum v.value
        return p;
    },
    function reduceInitial() { // init
        return {};
    }); 

var volumeByDaycoreGroup3 = remove_empty_bins(volumeByDaycoreGroupTmp3)
// build list of neo types
wordkeys3= [];
reskeys3 = newspaperGroupTop.top(Infinity);
for (var i = 0; i < reskeys3.length; i++){wordkeys3.push(reskeys3[i].key);}
console.log("Word keys");
console.log(wordkeys3);

console.log(volumeByDaycoreGroup3.all());
console.log(wordkeys3);
rescharts3 = wordkeys3.slice(0,10).map(function(name) { // .slice(0,5)
        	return dc.lineChart(compositeChart3)
            	.dimension(volumeByMonth)
            	.group(volumeByDaycoreGroup3,name)
            	.colors(newspaperChart.colors())
//            	.colors('#'+Math.random().toString(16).slice(-6))
            	//.interpolate('basis-open')
				.defined(function(d) {
            		//console.log(d);
    				if(d.y !== undefined) {
       					 return d.y;
    				}
    				else{
    					return 0;
    				}
				})            	
				.renderDataPoints({radius: 3} ) // fillOpacity: 1, strokeOpacity: 1,             	
            	.valueAccessor(function(kv) {
            		//console.log(kv);
                	return kv.value[name];
            	})
            	.xyTipsOn(true)
            	.title(function(kv) {
            		//console.log(kv);
                	return name +  ': ' + kv.value[name]  ;
            	})
            	;
    		});
console.log(rescharts3);
//console.log(compositeChart);
compositeChart3
    .height(300)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
//    .mouseZoomable(true)
    .brushOn(false)
    //.renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    .elasticY(true)
    .elasticX(true)
    .shareTitle(false) 
    
	.compose(rescharts3)
    .rangeChart(periodChart4)
    .xUnits(d3.time.day)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
periodChart4 
        .height(100)
        .margins({top: 10, right: 10, bottom: 30, left: 40})
	    .dimension(volumeByMonth)
    	.group(volumeByDayGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);




/*****************************  CORE (lemma, forme, pos) ROW BAR CHART ***********************/
// **************************forme
var coreformeChart = dc.rowChart("#dc-coreforme-chart"+lang);

//  coreformechart dimensions (with a fake group to keep just top and bottom 15
    var coreformeDimension = facts.dimension(function (d) { return d.key_word; });
    var coreformeGroup = coreformeDimension.group().reduceCount(function (d) { return d.key_word; });


/// for top	
function remove_empty_bins_key(source_group) {
    function non_zero_pred(d) {
    	if (d.key && d.value>0){return d.key;}
    }
    return {
        all: function () {
            return source_group.all().filter(non_zero_pred);
        },
        top: function(n) {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(0, n);
        }
    };
}


var coreformeGroupTop = remove_empty_bins_key(coreformeGroup);
//var coreformeGroupLow = remove_empty_bins_low(coreformeGroup);

console.log("coreforme groups :" + coreformeGroup.size());

// coreforme setup rowschart (TOP)
    coreformeChart
    		.width(200)
          .height(300)
          .margins({top: 0, right: 0, bottom: 0, left: 0})
            .dimension(coreformeDimension)
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .group(coreformeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("coreformes chart built");
console.log(coreformeChart);

//pos
var coreposChart = dc.rowChart("#dc-corepos-chart"+lang);

//  coreposchart dimensions (with a fake group to keep just top and bottom 15
    var coreposDimension = facts.dimension(function (d) { return d.key_pos; });
    var coreposGroup = coreposDimension.group().reduceCount(function (d) { return d.key_pos; });

var coreposGroupTop = remove_empty_bins_key(coreposGroup);

console.log("corepos groups :" + coreposGroup.size());

// corepos setup rowschart (TOP)
    coreposChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(coreposDimension)
            .group(coreposGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("coreposs chart built");
console.log(coreposChart);

// lemma
var corelemmaChart = dc.rowChart("#dc-corelemma-chart"+lang);

//  corelemmachart dimensions (with a fake group to keep just top and bottom 15
    var corelemmaDimension = facts.dimension(function (d) { return d.key_lemma; });
    var corelemmaGroup = corelemmaDimension.group().reduceCount(function (d) { return d.key_lemma; });



var corelemmaGroupTop = remove_empty_bins_key(corelemmaGroup);
//var corelemmaGroupLow = remove_empty_bins_low(corelemmaGroup);

console.log("corelemma groups :" + corelemmaGroup.size());

// corelemma setup rowschart (TOP)
    corelemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(corelemmaDimension)
            .group(corelemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("corelemmas chart built");
//console.log(corelemmaChartLow);
console.log(corelemmaChart);



/*********************** contextes *********/
/// lemma

/***************************** LEFT CONTEXT 1 ROW BAR CHART ***********************/

var l1lemmaChart = dc.rowChart("#dc-l1lemma-chart"+lang);

//  l1lemmachart dimensions (with a fake group to keep just top and bottom 15
    var l1lemmaDimension = facts.dimension(function (d) { return d.l1lemma; });
    var l1lemmaGroup = l1lemmaDimension.group().reduceCount(function (d) { return d.l1lemma; });



var l1lemmaGroupTop = remove_empty_bins_key(l1lemmaGroup);
//var l1lemmaGroupLow = remove_empty_bins_low(l1lemmaGroup);

console.log("l1lemma groups :" + l1lemmaGroup.size());
console.log(l1lemmaGroup.all());

// l1lemma setup rowschart (TOP)
    l1lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l1lemmaDimension)
            .group(l1lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l1lemmas chart built");
//console.log(l1lemmaChartLow);
console.log(l1lemmaChart);



/***************************** LEFT CONTEXT 2 ROW BAR CHART ***********************/

var l2lemmaChart = dc.rowChart("#dc-l2lemma-chart"+lang);

//  l2lemmachart dimensions (with a fake group to keep just top and bottom 15
    var l2lemmaDimension = facts.dimension(function (d) { return d.l2lemma; });
    var l2lemmaGroup = l2lemmaDimension.group().reduceCount(function (d) { return d.l2lemma; });

var l2lemmaGroupTop = remove_empty_bins_key(l2lemmaGroup);
//var l2lemmaGroupLow = remove_empty_bins_low(l2lemmaGroup);

console.log("l2lemma groups :" + l2lemmaGroup.size());

// l2lemma setup rowschart (TOP)
    l2lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l2lemmaDimension)
            .group(l2lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("l2lemmas chart built");
//console.log(l2lemmaChartLow);
console.log(l2lemmaChart);



/***************************** LEFT CONTEXT 3 ROW BAR CHART ***********************/

var l3lemmaChart = dc.rowChart("#dc-l3lemma-chart"+lang);

//  l3lemmachart dimensions (with a fake group to keep just top and bottom 15
    var l3lemmaDimension = facts.dimension(function (d) { return d.l3lemma; });
    var l3lemmaGroup = l3lemmaDimension.group().reduceCount(function (d) { return d.l3lemma; });

var l3lemmaGroupTop = remove_empty_bins_key(l3lemmaGroup);
//var l3lemmaGroupLow = remove_empty_bins_low(l3lemmaGroup);

console.log("l3lemma groups :" + l3lemmaGroup.size());

// l3lemma setup rowschart (TOP)
    l3lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l3lemmaDimension)
            .group(l3lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);



console.log("l3lemmas chart built");
//console.log(l3lemmaChartLow);
console.log(l3lemmaChart);


/***************************** LEFT CONTEXT 4 ROW BAR CHART ***********************/

var l4lemmaChart = dc.rowChart("#dc-l4lemma-chart"+lang);

//  l4lemmachart dimensions (with a fake group to keep just top and bottom 15
    var l4lemmaDimension = facts.dimension(function (d) { return d.l4lemma; });
    var l4lemmaGroup = l4lemmaDimension.group().reduceCount(function (d) { return d.l4lemma; });

var l4lemmaGroupTop = remove_empty_bins_key(l4lemmaGroup);
//var l4lemmaGroupLow = remove_empty_bins_low(l4lemmaGroup);

console.log("l4lemma groups :" + l4lemmaGroup.size());

// l4lemma setup rowschart (TOP)
    l4lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l4lemmaDimension)
            .group(l4lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l4lemmas chart built");
//console.log(l4lemmaChartLow);
console.log(l4lemmaChart);


/***************************** LEFT CONTEXT 5 ROW BAR CHART ***********************/

var l5lemmaChart = dc.rowChart("#dc-l5lemma-chart"+lang);

//  l5lemmachart dimensions (with a fake group to keep just top and bottom 15
    var l5lemmaDimension = facts.dimension(function (d) { return d.l5lemma; });
    var l5lemmaGroup = l5lemmaDimension.group().reduceCount(function (d) { return d.l5lemma; });

var l5lemmaGroupTop = remove_empty_bins_key(l5lemmaGroup);
//var l5lemmaGroupLow = remove_empty_bins_low(l5lemmaGroup);

console.log("l5lemma groups :" + l5lemmaGroup.size());

// l5lemma setup rowschart (TOP)
    l5lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l5lemmaDimension)
            .group(l5lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l5lemmas chart built");
//console.log(l5lemmaChartLow);
console.log(l5lemmaChart);



//throw new Error("Something went badly wrong!");

/***************************** RIGHT CONTEXT 1 ROW BAR CHART ***********************/

var r1lemmaChart = dc.rowChart("#dc-r1lemma-chart"+lang);

//  r1lemmachart dimensions (with a fake group to keep just top and bottom 15
    var r1lemmaDimension = facts.dimension(function (d) { return d.r1lemma; });
    var r1lemmaGroup = r1lemmaDimension.group().reduceCount(function (d) { return d.r1lemma; });

var r1lemmaGroupTop = remove_empty_bins_key(r1lemmaGroup);
//var r1lemmaGroupLow = remove_empty_bins_low(r1lemmaGroup);

console.log("r1lemma groups :" + r1lemmaGroup.size());

// r1lemma setup rowschart (TOP)
    r1lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r1lemmaDimension)
            .group(r1lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("r1lemmas chart built");
console.log(r1lemmaChart);



/***************************** RIGHT CONTEXT 2 ROW BAR CHART ***********************/

var r2lemmaChart = dc.rowChart("#dc-r2lemma-chart"+lang);

//  r2lemmachart dimensions (with a fake group to keep just top and bottom 15
    var r2lemmaDimension = facts.dimension(function (d) { return d.r2lemma; });
    var r2lemmaGroup = r2lemmaDimension.group().reduceCount(function (d) { return d.r2lemma; });

var r2lemmaGroupTop = remove_empty_bins_key(r2lemmaGroup);
//var r2lemmaGroupLow = remove_empty_bins_low(r2lemmaGroup);

console.log("r2lemma groups :" + r2lemmaGroup.size());

// r2lemma setup rowschart (TOP)
    r2lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r2lemmaDimension)
            .group(r2lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r2lemmas chart built");
console.log(r2lemmaChart);



/***************************** RIGHT CONTEXT 3 ROW BAR CHART ***********************/

var r3lemmaChart = dc.rowChart("#dc-r3lemma-chart"+lang);

//  r3lemmachart dimensions (with a fake group to keep just top and bottom 15
    var r3lemmaDimension = facts.dimension(function (d) { return d.r3lemma; });
    var r3lemmaGroup = r3lemmaDimension.group().reduceCount(function (d) { return d.r3lemma; });

var r3lemmaGroupTop = remove_empty_bins_key(r3lemmaGroup);
//var r3lemmaGroupLow = remove_empty_bins_low(r3lemmaGroup);

console.log("r3lemma groups :" + r3lemmaGroup.size());

// r3lemma setup rowschart (TOP)
    r3lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r3lemmaDimension)
            .group(r3lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r3lemmas chart built");
console.log(r3lemmaChart);



/***************************** RIGHT CONTEXT 4 ROW BAR CHART ***********************/

var r4lemmaChart = dc.rowChart("#dc-r4lemma-chart"+lang);

//  r4lemmachart dimensions (with a fake group to keep just top and bottom 15
    var r4lemmaDimension = facts.dimension(function (d) { return d.r4lemma; });
    var r4lemmaGroup = r4lemmaDimension.group().reduceCount(function (d) { return d.r4lemma; });

var r4lemmaGroupTop = remove_empty_bins_key(r4lemmaGroup);
//var r4lemmaGroupLow = remove_empty_bins_low(r4lemmaGroup);

console.log("r4lemma groups :" + r4lemmaGroup.size());

// r4lemma setup rowschart (TOP)
    r4lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r4lemmaDimension)
            .group(r4lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r4lemmas chart built");
console.log(r4lemmaChart);



/***************************** RIGHT CONTEXT 5 ROW BAR CHART ***********************/

var r5lemmaChart = dc.rowChart("#dc-r5lemma-chart"+lang);

//  r5lemmachart dimensions (with a fake group to keep just top and bottom 15
    var r5lemmaDimension = facts.dimension(function (d) { return d.r5lemma; });
    var r5lemmaGroup = r5lemmaDimension.group().reduceCount(function (d) { return d.r5lemma; });

var r5lemmaGroupTop = remove_empty_bins_key(r5lemmaGroup);
//var r5lemmaGroupLow = remove_empty_bins_low(r5lemmaGroup);

console.log("r5lemma groups :" + r5lemmaGroup.size());

// r5lemma setup rowschart (TOP)
    r5lemmaChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r5lemmaDimension)
            .group(r5lemmaGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r5lemmas chart built");
console.log(r5lemmaChart);


/// forme
/***************************** LEFT CONTEXT 1 ROW BAR CHART ***********************/

var l1formeChart = dc.rowChart("#dc-l1forme-chart"+lang);

//  l1formechart dimensions (with a fake group to keep just top and bottom 15
    var l1formeDimension = facts.dimension(function (d) { return d.l1forme; });
    var l1formeGroup = l1formeDimension.group().reduceCount(function (d) { return d.l1forme; });



var l1formeGroupTop = remove_empty_bins_key(l1formeGroup);
//var l1formeGroupLow = remove_empty_bins_low(l1formeGroup);

console.log("l1forme groups :" + l1formeGroup.size());

// l1forme setup rowschart (TOP)
    l1formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l1formeDimension)
            .group(l1formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l1formes chart built");
//console.log(l1formeChartLow);
console.log(l1formeChart);



/***************************** LEFT CONTEXT 2 ROW BAR CHART ***********************/

var l2formeChart = dc.rowChart("#dc-l2forme-chart"+lang);

//  l2formechart dimensions (with a fake group to keep just top and bottom 15
    var l2formeDimension = facts.dimension(function (d) { return d.l2forme; });
    var l2formeGroup = l2formeDimension.group().reduceCount(function (d) { return d.l2forme; });

var l2formeGroupTop = remove_empty_bins_key(l2formeGroup);
//var l2formeGroupLow = remove_empty_bins_low(l2formeGroup);

console.log("l2forme groups :" + l2formeGroup.size());

// l2forme setup rowschart (TOP)
    l2formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l2formeDimension)
            .group(l2formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("l2formes chart built");
//console.log(l2formeChartLow);
console.log(l2formeChart);



/***************************** LEFT CONTEXT 3 ROW BAR CHART ***********************/

var l3formeChart = dc.rowChart("#dc-l3forme-chart"+lang);

//  l3formechart dimensions (with a fake group to keep just top and bottom 15
    var l3formeDimension = facts.dimension(function (d) { return d.l3forme; });
    var l3formeGroup = l3formeDimension.group().reduceCount(function (d) { return d.l3forme; });

var l3formeGroupTop = remove_empty_bins_key(l3formeGroup);
//var l3formeGroupLow = remove_empty_bins_low(l3formeGroup);

console.log("l3forme groups :" + l3formeGroup.size());

// l3forme setup rowschart (TOP)
    l3formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l3formeDimension)
            .group(l3formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);



console.log("l3formes chart built");
//console.log(l3formeChartLow);
console.log(l3formeChart);


/***************************** LEFT CONTEXT 4 ROW BAR CHART ***********************/

var l4formeChart = dc.rowChart("#dc-l4forme-chart"+lang);

//  l4formechart dimensions (with a fake group to keep just top and bottom 15
    var l4formeDimension = facts.dimension(function (d) { return d.l4forme; });
    var l4formeGroup = l4formeDimension.group().reduceCount(function (d) { return d.l4forme; });

var l4formeGroupTop = remove_empty_bins_key(l4formeGroup);
//var l4formeGroupLow = remove_empty_bins_low(l4formeGroup);

console.log("l4forme groups :" + l4formeGroup.size());

// l4forme setup rowschart (TOP)
    l4formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l4formeDimension)
            .group(l4formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l4formes chart built");
//console.log(l4formeChartLow);
console.log(l4formeChart);


/***************************** LEFT CONTEXT 5 ROW BAR CHART ***********************/

var l5formeChart = dc.rowChart("#dc-l5forme-chart"+lang);

//  l5formechart dimensions (with a fake group to keep just top and bottom 15
    var l5formeDimension = facts.dimension(function (d) { return d.l5forme; });
    var l5formeGroup = l5formeDimension.group().reduceCount(function (d) { return d.l5forme; });

var l5formeGroupTop = remove_empty_bins_key(l5formeGroup);
//var l5formeGroupLow = remove_empty_bins_low(l5formeGroup);

console.log("l5forme groups :" + l5formeGroup.size());

// l5forme setup rowschart (TOP)
    l5formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l5formeDimension)
            .group(l5formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l5formes chart built");
//console.log(l5formeChartLow);
console.log(l5formeChart);





/***************************** RIGHT CONTEXT 1 ROW BAR CHART ***********************/

var r1formeChart = dc.rowChart("#dc-r1forme-chart"+lang);

//  r1formechart dimensions (with a fake group to keep just top and bottom 15
    var r1formeDimension = facts.dimension(function (d) { return d.r1forme; });
    var r1formeGroup = r1formeDimension.group().reduceCount(function (d) { return d.r1forme; });

var r1formeGroupTop = remove_empty_bins_key(r1formeGroup);
//var r1formeGroupLow = remove_empty_bins_low(r1formeGroup);

console.log("r1forme groups :" + r1formeGroup.size());

// r1forme setup rowschart (TOP)
    r1formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r1formeDimension)
            .group(r1formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("r1formes chart built");
console.log(r1formeChart);



/***************************** RIGHT CONTEXT 2 ROW BAR CHART ***********************/

var r2formeChart = dc.rowChart("#dc-r2forme-chart"+lang);

//  r2formechart dimensions (with a fake group to keep just top and bottom 15
    var r2formeDimension = facts.dimension(function (d) { return d.r2forme; });
    var r2formeGroup = r2formeDimension.group().reduceCount(function (d) { return d.r2forme; });

var r2formeGroupTop = remove_empty_bins_key(r2formeGroup);
//var r2formeGroupLow = remove_empty_bins_low(r2formeGroup);

console.log("r2forme groups :" + r2formeGroup.size());

// r2forme setup rowschart (TOP)
    r2formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r2formeDimension)
            .group(r2formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r2formes chart built");
console.log(r2formeChart);



/***************************** RIGHT CONTEXT 3 ROW BAR CHART ***********************/

var r3formeChart = dc.rowChart("#dc-r3forme-chart"+lang);

//  r3formechart dimensions (with a fake group to keep just top and bottom 15
    var r3formeDimension = facts.dimension(function (d) { return d.r3forme; });
    var r3formeGroup = r3formeDimension.group().reduceCount(function (d) { return d.r3forme; });

var r3formeGroupTop = remove_empty_bins_key(r3formeGroup);
//var r3formeGroupLow = remove_empty_bins_low(r3formeGroup);

console.log("r3forme groups :" + r3formeGroup.size());

// r3forme setup rowschart (TOP)
    r3formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r3formeDimension)
            .group(r3formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r3formes chart built");
console.log(r3formeChart);



/***************************** RIGHT CONTEXT 4 ROW BAR CHART ***********************/

var r4formeChart = dc.rowChart("#dc-r4forme-chart"+lang);

//  r4formechart dimensions (with a fake group to keep just top and bottom 15
    var r4formeDimension = facts.dimension(function (d) { return d.r4forme; });
    var r4formeGroup = r4formeDimension.group().reduceCount(function (d) { return d.r4forme; });

var r4formeGroupTop = remove_empty_bins_key(r4formeGroup);
//var r4formeGroupLow = remove_empty_bins_low(r4formeGroup);

console.log("r4forme groups :" + r4formeGroup.size());

// r4forme setup rowschart (TOP)
    r4formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r4formeDimension)
            .group(r4formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r4formes chart built");
console.log(r4formeChart);



/***************************** RIGHT CONTEXT 5 ROW BAR CHART ***********************/

var r5formeChart = dc.rowChart("#dc-r5forme-chart"+lang);

//  r5formechart dimensions (with a fake group to keep just top and bottom 15
    var r5formeDimension = facts.dimension(function (d) { return d.r5forme; });
    var r5formeGroup = r5formeDimension.group().reduceCount(function (d) { return d.r5forme; });

var r5formeGroupTop = remove_empty_bins_key(r5formeGroup);
//var r5formeGroupLow = remove_empty_bins_low(r5formeGroup);

console.log("r5forme groups :" + r5formeGroup.size());

// r5forme setup rowschart (TOP)
    r5formeChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r5formeDimension)
            .group(r5formeGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r5formes chart built");
console.log(r5formeChart);





/// pos

/***************************** LEFT CONTEXT 1 ROW BAR CHART ***********************/

var l1posChart = dc.rowChart("#dc-l1pos-chart"+lang);

//  l1poschart dimensions (with a fake group to keep just top and bottom 15
    var l1posDimension = facts.dimension(function (d) { return d.l1pos; });
    var l1posGroup = l1posDimension.group().reduceCount(function (d) { return d.l1pos; });


var l1posGroupTop = remove_empty_bins_key(l1posGroup);
//var l1posGroupLow = remove_empty_bins_low(l1posGroup);

console.log("l1pos groups :" + l1posGroup.size());

// l1pos setup rowschart (TOP)
    l1posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l1posDimension)
            .group(l1posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l1poss chart built");
//console.log(l1posChartLow);
console.log(l1posChart);



/***************************** LEFT CONTEXT 2 ROW BAR CHART ***********************/

var l2posChart = dc.rowChart("#dc-l2pos-chart"+lang);

//  l2poschart dimensions (with a fake group to keep just top and bottom 15
    var l2posDimension = facts.dimension(function (d) { return d.l2pos; });
    var l2posGroup = l2posDimension.group().reduceCount(function (d) { return d.l2pos; });

var l2posGroupTop = remove_empty_bins_key(l2posGroup);
//var l2posGroupLow = remove_empty_bins_low(l2posGroup);

console.log("l2pos groups :" + l2posGroup.size());

// l2pos setup rowschart (TOP)
    l2posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l2posDimension)
            .group(l2posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("l2poss chart built");
//console.log(l2posChartLow);
console.log(l2posChart);



/***************************** LEFT CONTEXT 3 ROW BAR CHART ***********************/

var l3posChart = dc.rowChart("#dc-l3pos-chart"+lang);

//  l3poschart dimensions (with a fake group to keep just top and bottom 15
    var l3posDimension = facts.dimension(function (d) { return d.l3pos; });
    var l3posGroup = l3posDimension.group().reduceCount(function (d) { return d.l3pos; });

var l3posGroupTop = remove_empty_bins_key(l3posGroup);
//var l3posGroupLow = remove_empty_bins_low(l3posGroup);

console.log("l3pos groups :" + l3posGroup.size());

// l3pos setup rowschart (TOP)
    l3posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l3posDimension)
            .group(l3posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);



console.log("l3poss chart built");
//console.log(l3posChartLow);
console.log(l3posChart);


/***************************** LEFT CONTEXT 4 ROW BAR CHART ***********************/

var l4posChart = dc.rowChart("#dc-l4pos-chart"+lang);

//  l4poschart dimensions (with a fake group to keep just top and bottom 15
    var l4posDimension = facts.dimension(function (d) { return d.l4pos; });
    var l4posGroup = l4posDimension.group().reduceCount(function (d) { return d.l4pos; });

var l4posGroupTop = remove_empty_bins_key(l4posGroup);
//var l4posGroupLow = remove_empty_bins_low(l4posGroup);

console.log("l4pos groups :" + l4posGroup.size());

// l4pos setup rowschart (TOP)
    l4posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l4posDimension)
            .group(l4posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l4poss chart built");
//console.log(l4posChartLow);
console.log(l4posChart);


/***************************** LEFT CONTEXT 5 ROW BAR CHART ***********************/

var l5posChart = dc.rowChart("#dc-l5pos-chart"+lang);

//  l5poschart dimensions (with a fake group to keep just top and bottom 15
    var l5posDimension = facts.dimension(function (d) { return d.l5pos; });
    var l5posGroup = l5posDimension.group().reduceCount(function (d) { return d.l5pos; });

var l5posGroupTop = remove_empty_bins_key(l5posGroup);
//var l5posGroupLow = remove_empty_bins_low(l5posGroup);

console.log("l5pos groups :" + l5posGroup.size());

// l5pos setup rowschart (TOP)
    l5posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(l5posDimension)
            .group(l5posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("l5poss chart built");
//console.log(l5posChartLow);
console.log(l5posChart);





/***************************** RIGHT CONTEXT 1 ROW BAR CHART ***********************/

var r1posChart = dc.rowChart("#dc-r1pos-chart"+lang);

//  r1poschart dimensions (with a fake group to keep just top and bottom 15
    var r1posDimension = facts.dimension(function (d) { return d.r1pos; });
    var r1posGroup = r1posDimension.group().reduceCount(function (d) { return d.r1pos; });

var r1posGroupTop = remove_empty_bins_key(r1posGroup);
//var r1posGroupLow = remove_empty_bins_low(r1posGroup);

console.log("r1pos groups :" + r1posGroup.size());

// r1pos setup rowschart (TOP)
    r1posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r1posDimension)
            .group(r1posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);

console.log("r1poss chart built");
console.log(r1posChart);



/***************************** RIGHT CONTEXT 2 ROW BAR CHART ***********************/

var r2posChart = dc.rowChart("#dc-r2pos-chart"+lang);

//  r2poschart dimensions (with a fake group to keep just top and bottom 15
    var r2posDimension = facts.dimension(function (d) { return d.r2pos; });
    var r2posGroup = r2posDimension.group().reduceCount(function (d) { return d.r2pos; });

var r2posGroupTop = remove_empty_bins_key(r2posGroup);
//var r2posGroupLow = remove_empty_bins_low(r2posGroup);

console.log("r2pos groups :" + r2posGroup.size());

// r2pos setup rowschart (TOP)
    r2posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r2posDimension)
            .group(r2posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r2poss chart built");
console.log(r2posChart);



/***************************** RIGHT CONTEXT 3 ROW BAR CHART ***********************/

var r3posChart = dc.rowChart("#dc-r3pos-chart"+lang);

//  r3poschart dimensions (with a fake group to keep just top and bottom 15
    var r3posDimension = facts.dimension(function (d) { return d.r3pos; });
    var r3posGroup = r3posDimension.group().reduceCount(function (d) { return d.r3pos; });

var r3posGroupTop = remove_empty_bins_key(r3posGroup);
//var r3posGroupLow = remove_empty_bins_low(r3posGroup);

console.log("r3pos groups :" + r3posGroup.size());

// r3pos setup rowschart (TOP)
    r3posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r3posDimension)
            .group(r3posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r3poss chart built");
console.log(r3posChart);



/***************************** RIGHT CONTEXT 4 ROW BAR CHART ***********************/

var r4posChart = dc.rowChart("#dc-r4pos-chart"+lang);

//  r4poschart dimensions (with a fake group to keep just top and bottom 15
    var r4posDimension = facts.dimension(function (d) { return d.r4pos; });
    var r4posGroup = r4posDimension.group().reduceCount(function (d) { return d.r4pos; });

var r4posGroupTop = remove_empty_bins_key(r4posGroup);
//var r4posGroupLow = remove_empty_bins_low(r4posGroup);

console.log("r4pos groups :" + r4posGroup.size());

// r4pos setup rowschart (TOP)
    r4posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r4posDimension)
            .group(r4posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r4poss chart built");
console.log(r4posChart);



/***************************** RIGHT CONTEXT 5 ROW BAR CHART ***********************/

var r5posChart = dc.rowChart("#dc-r5pos-chart"+lang);

//  r5poschart dimensions (with a fake group to keep just top and bottom 15
    var r5posDimension = facts.dimension(function (d) { return d.r5pos; });
    var r5posGroup = r5posDimension.group().reduceCount(function (d) { return d.r5pos; });

var r5posGroupTop = remove_empty_bins_key(r5posGroup);
//var r5posGroupLow = remove_empty_bins_low(r5posGroup);

console.log("r5pos groups :" + r5posGroup.size());

// r5pos setup rowschart (TOP)
    r5posChart
    		.width(200)
          .height(300).margins({top: 0, right: 0, bottom: 0, left: 0})
            .label(function(d){return d.key + ' (' + d.value + ')';})
            .dimension(r5posDimension)
            .group(r5posGroupTop)
           .rowsCap(15)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);


console.log("r5poss chart built");
console.log(r5posChart);



/***************************** DATATABLES CHART ***********************/

// sauvegarde version limitée datatables
var dataTableDC = dc.dataTable("#dc-table-chart"+lang);
// Create dataTable dimension
var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });
console.log("Dimensions created");
/// render the datatable
dataTableDC
//    .width(960).height(800)
    .dimension(timeDimension)
	.group(function(d) { return ""})
	//.size(10)
	.turnOnControls(true)
    .controlsUseVisibility(true)
    .columns([
      function(d) { return d.date; },
      function(d) { return '<a href=\"' + d.url + "\" target=\"_blank\">" +d.journal+"</a>";},
      function(d) { return d.country; },
      function(d) { return d.sentence;},
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.descending);
    //console.log(dataTableDC);

console.log("Datatable chart built");
console.log(timeDimension);
/***************** datatables with pagination, sorting search ***********/

//table
//dimension for table search
/*var tDimension = facts.dimension(function (d) { return d;});
var tableDimension = tDimension.group().reduceCount();
var tableDimensionTop = remove_empty_bins(tableDimension);
console.log("table Dimensions created");
console.log(tDimension);
console.log(tableDimensionTop.all());
var dOptions = {
        "bSort": true,
		columnDefs: [
			{
				targets: 0,
				data: function (d) {
				return d.date; }
			}
			,
			{
				targets: 1,
				data: function (d) { 
//				 return get_text_from_neoveille(d);   } 
				return '<a href=\"' + d.link + "\" target=\"_blank\">" +d.newspaper+"</a>"; }
			}
			,
			{
				targets: 2,
				data: function (d) { 
				return d.subject;  }
			}
			,
			{
				targets: 3,
				data: function (d) { 
				 return get_text_from_neoveille(d);   } 
			}
		]
	};
var datatablesynth = $("#dc-table-chart"+lang);
datatablesynth.dataTable(dOptions);

function RefreshTable() {
            dc.events.trigger(function () {
               // alldata = tableDimensionTop.top(Infinity);
                alldata = tDimension.top(Infinity);
                
                datatablesynth.fnClearTable();
                datatablesynth.fnAddData(alldata);
                datatablesynth.fnDraw();
            });
        }
	
for (var i = 0; i < dc.chartRegistry.list().length; i++) {
		var chartI = dc.chartRegistry.list()[i];
		chartI.on("filtered", RefreshTable);
	}
	
$(":input").on('keyup',function(){
		text_filter(tDimension, this.value);//cities is the dimension for the data table

function text_filter(dim,q){
		 if (q!='') {
			dim.filter(function(d){
				return d.indexOf (q.toLowerCase()) !== -1;
			});
		} else {
			dim.filterAll();
			}
		RefreshTable();
		dc.redrawAll();}
});
	
RefreshTable();
console.log("Datatable chart built");
console.log(tableDimension);
*/

/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll(); 

}

// disactivated (called by previous function for datatable)
function get_text_from_neoveille(d){
	res='...';
	if (d.l10forme){res = res + d.l10forme +' ';}
	if (d.l9forme){res = res + d.l9forme +' '; }
	if (d.l8forme){res = res + d.l8forme +' '; }
	if (d.l7forme){res = res + d.l7forme +' '; }
	if (d.l6forme){res = res + d.l6forme +' '; }
	if (d.l5forme){res = res + d.l5forme +' '; }
	if (d.l4forme){res = res + d.l4forme +' '; }
	if (d.l3forme){res = res + d.l3forme +' '; }
	if (d.l2forme){res = res + d.l2forme +' '; }
	if (d.l1forme){res = res + d.l1forme +' '; }
	if (d.coreforme){res = res + "<span style='background-color: #ffa366'>" + d.coreforme +'</span> '; }
	if (d.r1forme){res = res + d.r1forme +' '; }
	if (d.r2forme){res = res + d.r2forme +' '; }
	if (d.r3forme){res = res + d.r3forme +' '; }
	if (d.r4forme){res = res + d.r4forme +' '; }
	if (d.r5forme){res = res + d.r5forme +' '; }
	if (d.r6forme){res = res + d.r6forme +' '; }
	if (d.r7forme){res = res + d.r7forme +' '; }
	if (d.r8forme){res = res + d.r8forme +' '; }
	if (d.r9forme){res = res + d.r9forme +' '; }
	if (d.r10forme){res = res + d.r10forme +' '; }
	res2 = res.replace("\\",'');
	return res2 + '...';

}


// ajax call to retrieve from apache solr the json data for the given language and given neologism 4/11/2016
function get_neologism_stat(lang,neo,callback) 
{
		//alert(d.lexie)
		if (editor.lang == undefined){editor.lang='fr';}
		var langues = {'it':"rss_italian",'fr':"rss_french", 'pl':"RSS_polish", 'br':'RSS_brasilian', 'ch':'RSS_chinese', 'ru':'RSS_russian', 'cz':'RSS_czech', 'gr':'RSS_greek'};
		console.log("get_neologism_stat : " + langues[editor.lang] + " : " + neo);
        var request= $.ajax({
//        url:'http://localhost:8983/solr/rss_french/select?q=neologismes%3A' + d.lexie + '&rows=5&df=contents&wt=json&indent=true&hl=true&hl.fl=contents&hl.simple.pre=%3Cem%3E&hl.simple.post=%3C%2Fem%3E',
        url:'http://tal.lipn.univ-paris13.fr/solr/' + langues[editor.lang] + '/select',
//        data:{  "q":'dateS:* AND neologismes:"' +neo.lexie+ '"',
//        data:{  "q":'"' +neo.lexie+ '"',
        data:{  q: '"' +neo.forme + '"',
        		rows:100,
        		debug:"true",
        		sort:"dateS asc",
        		//fl:"dateS,source,link,subject,subject2, neologismes, country, contents",
        		"wt":"json",
        		//"df":"contents",
        		"indent":"false",
        		//"hl":"true",
        		//"hl.fl":"*",
        		//"hl.simple.pre":'<span style="background-color: #FFFF00">',
        		//"hl.simple.post":"</span>"
        		},
        dataType: "jsonp",
        jsonp:'json.wrf',
        type:'GET',
     //   async:false,
        success: function( result) {
        	//alert(JSON.stringify(result));
            docsdata =result.response.docs;/// main results
           // highlight = result.highlighting;
            //alert(highlight)
//            alert(docsdata);
            num = result.response.numFound;
            rawquery = result.debug.parsedquery_toString;
            //alert(num)
            if (num == 0){
            	callback(["","Il n'y a pas de données disponibles pour ce néologisme pour cette langue actuellement."]);
            }
            else{
	            //callback(num);
	            // filter results to retain just good articles
	            res = filter_solr_res(docsdata,rawquery.substring(9).replace(/^.+\((.+?) .+$/,"$1"));
	            callback([res[1],res[1] + " occurrence(s) dans " + res[0] + " article(s)"]);
	            // build graph
	            build_corpus_info_lang(res[2],lang, neo.forme,rawquery);
	            
	        }
    	},
        error: function (request) {
            alert("Error : " + request.status + ". Response : " +  request.statusText);
            res= '<div>Problème :'+ request.status + ". Response : " +  request.statusText + '</div>';
            callback(res);
        }
    });
}



// call in case of ajax success : build the graphs
function build_corpus_info_lang(jsondata, lang, lexie,rawquery){

console.log(jsondata[0]);

/********************* GET THE JSON DATA AND TRANSFORM WHEN NECESSARY ***********/
  // format our data : dateS,source,link,subject,subject2, neologisms
  
  
  var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
  var dtgFormat2 = d3.time.format("%a %e %b %H:%M");
  
  jsondata.forEach(function(d) { 
    	d.dtg   = dtgFormat.parse(d.dateS.substr(0,19));
 		d.newspaper   = d.source;
 		d.subject2= d.subject2;
    	d.subject  = d.subject;
    	d.article= d.link;
    	d.country= d.country
    	d.contents = d.contents
    	//alert(d.country)
    	//d.country= [48.856614, 2.352222]
    	/*if (d.neologismes == null)
    	{
      		//d.neolist   = "";
      		d.neocount=0;
    	}
    	else
    	{
    		d.neolist   = d.neologismes[0];
//    		d.neolist   = d.neologismes.join(", ");
    		d.neocount= d.neologismes.length;
    	}*/
  }); 
 console.log("Data Loaded");

/*******************  GLOBAL DIMENSIONS ****************************/
  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(jsondata);
  var all = facts.groupAll();
  

/*************** TOTAL CHART *********************************/
  
totalCount = dc.dataCount('.dc-data-count'+lang);
totalCount 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> sélectionnés sur <strong>%total-count</strong> articles' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Réinitialiser</a>',
            all: 'Tous les articles sélectionnés. Cliquez sur les graphes pour effectuer des filtres.'
        });
  
totalCount2 = dc.dataCount('.dc-data-count2'+lang);
totalCount2 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> sélectionnés sur <strong>%total-count</strong> articles' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Réinitialiser</a>',
            all: 'Tous les articles sélectionnés. Cliquez sur les graphes pour effectuer des filtres.'
        });
  
  
console.log("Count chart built"); 		   
console.log(totalCount);
/***************************** COUNTRY ROW BAR CHART ***********************/

var neoChart = dc.rowChart("#dc-neo-chart"+lang);

// neologismes dimensions : attention buggy as field = array!!!
var neoDim = facts.dimension(function(d){ return d.country;});
var neoGroup = neoDim.group().reduceCount(function(d) { return d.country; });


/// for top	
function remove_empty_bins_top(source_group) {
    function non_zero_pred(d) {
        return d.value != 0;
    }
    return {
        all: function () {
            return source_group.all().filter(non_zero_pred);
        },
        top: function(n) {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(0, n);
        }
    };
}
var neoGroupTop = remove_empty_bins_top(neoGroup);

// neo chart
	neoChart
			.width(350)
            .height(300)
            .dimension(neoDim)
            .group(neoGroupTop)
            .rowsCap(10)
            .othersGrouper(false)
            .label(function(d){return d.key + ' (' + d.value + ')';})
            //.title(function(d){return d.key + ' (' + d.value + ')';})
            .renderLabel(true)
            .gap(0.1)
            //.renderTitleLabel(true)
            .ordering(function (d) {
    			return -d.value
			})
    		.elasticX(true)
		    .turnOnControls(true)
	        .controlsUseVisibility(true);		   


console.log("Neo chart built");
console.log(neoChart);


/***************************** TIMELINE ***********************/
// see http://dc-js.github.io/dc.js/docs/html/dc.lineChart.html
// Create the dc.js chart objects & link to div
var timeChart = dc.lineChart("#dc-time-chart"+lang);
var periodChart = dc.barChart("#range-chart"+lang);

// create timeline chart dimensions
	var volumeByDay = facts.dimension(function(d) {
    return d3.time.day(d.dtg);
  });
	var volumeByMonth = facts.dimension(function(d) {
    return d3.time.month(d.dtg);
  });

  var volumeByDayGroup = volumeByDay.group()
    .reduceCount(function(d) { return d.dtg; });
    console.log("Day groups :" + volumeByDayGroup.size());

  var volumeByMonthGroup = volumeByMonth.group()
    .reduceCount(function(d) { return d.dtg; });
	console.log("Month groups :" + volumeByMonthGroup.size());
    
    // min and max date
    var minDate = volumeByDay.bottom(1)[0].dtg;
 	var maxDate = volumeByDay.top(1)[0].dtg;
	console.log(String(minDate) + ":" + String(maxDate));

  // setup timeline graph
  timeChart
  	//.width(700)
    .height(300)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .dotRadius(5) //
    //.renderArea(true)
    .dimension(volumeByDay)
    .group(volumeByDayGroup)
    .transitionDuration(500)
    .mouseZoomable(true)
    .brushOn(false)
    .renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    .title(function(d){
      return dtgFormat2(d.key)
      + "\nTotal : " + d.value;
      })
    .elasticY(true)
    .rangeChart(periodChart)
    .xUnits(d3.time.day)
    .renderHorizontalGridLines(true)    
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxis();


  
  console.log("Time chart built");
  console.log(timeChart);
  
/******************  range chart **************/
periodChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(100)
        .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByDay)
    	.group(volumeByDayGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);

  
  /***************************** TIMELINE ***********************/

/***************************** SUBJECT PIE CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.pieChart("#dc-subject-chart"+lang);


//  subjectchart  dimensions
    var subjectDimension = facts.dimension(function (d) { return d.subject; });
    var subjectGroup = subjectDimension.group();
	console.log("Subject groups :" + subjectGroup.size());
  
// subject chart
 	subjectChart
 		.width(500)
        .height(250)
        .cx(300)
        .slicesCap(10)
        .ordering(function (d) {
    			return -d.value
			})
        .innerRadius(30)
        .externalLabels(30)
        .externalRadiusPadding(20)
        .minAngleForLabel(0.5)
        .drawPaths(true)
        .transitionDuration(500)
        .turnOnControls(true)
	    .controlsUseVisibility(true)
        .dimension(subjectDimension)
        .group(subjectGroup)
 	    .legend(dc.legend().x(0).y(20).itemHeight(10).gap(5));
        
console.log("Subject chart built");
console.log(subjectChart);

/***************************** NEWSPAPER ROW BAR CHART ***********************/

var newspaperChart = dc.rowChart("#dc-newspaper-chart"+lang);
//var newspaperChartLow = dc.rowChart("#dc-newspaper-chart-low");

//  newspaperchart dimensions (with a fake group to keep just top and bottom 15
    var newspaperDimension = facts.dimension(function (d) { return d.newspaper; });
    //var newspaperDimensionless100 = facts.dimension(function (d) { return d.newspaper; }).filterRange([0, 100]);
    var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.newspaper; });
//    var newspaperTopGroup = newspaperGroup.top(15);

/// for top	
function remove_empty_bins(source_group) {
    function non_zero_pred(d) {
        return d.value != 0;
    }
    return {
        all: function () {
            return source_group.all().filter(non_zero_pred);
        },
        top: function(n) {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(0, n);
        }
    };
}

var newspaperGroupTop = remove_empty_bins(newspaperGroup);
//var newspaperGroupLow = remove_empty_bins_low(newspaperGroup);

console.log("newspaper groups :" + newspaperGroup.size());

// newspaper setup rowschart (TOP)
    newspaperChart
    		.width(500)
            .height(250)
            .dimension(newspaperDimension)
            .group(newspaperGroupTop)
            .rowsCap(10)
            .othersGrouper(false)
            .renderLabel(true)
    		.elasticX(true)
    		.ordering(function (d) {
    			return -d.value
			})
		    .turnOnControls(true)
	        .controlsUseVisibility(true);



// x axis label rotation  	: does not work	
newspaperChart.on("renderlet",function (chart) {
   // rotate x-axis labels
   chart.selectAll('g.x text')
     .attr('transform', 'translate(-10,10) rotate(315)');
  });   



console.log("Newspapers chart built");
//console.log(newspaperChartLow);
console.log(newspaperChart);


/***************************** DATATABLES CHART ***********************/

// sauvegarde version limitée datatables
var dataTableDC = dc.dataTable("#dc-table-chart"+lang);

  // Create dataTable dimension
  var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });
  
  console.log("Dimensions created");
 neolo = lexie.toString()
 console.log(neolo)

  /// render the datatable
    dataTableDC
//    .width(960).height(800)
    .dimension(timeDimension)
	.group(function(d) { return ""})
	//.size(10)
	.turnOnControls(true)
    .controlsUseVisibility(true)
    .columns([
      function(d) { return d.country; },
      function(d) { return d.subject; },
      function(d) { return d.newspaper; },
      function(d) { return d.dtg; },
    //  function(d) { return '<a href=\"' + d.article + "\" target=\"_blank\">Article</a>";},
      function(d) {return highlight_neo_stat(d.contents.toString(),neolo,rawquery.substring(9).replace(/^.+\((.+?) .+$/,"$1")) + '&nbsp;<a title=\"Voir l\'article complet\" href=\"' + d.article + "\" target=\"_blank\"><span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></a>";},
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.descending);
    //console.log(dataTableDC);

console.log("Datatable chart built");
console.log(timeDimension);






/***************************** RENDER ALL THE CHARTS  ***********************/

    // make visible the zone : does not work
    
//    $("#corpusresults").show();
     //$("#corpusresults").css( "display", "visible !important");
	$("#corpusinfoBtn"+lang).replaceWith('<a href="#" class="btn btn-info" id="corpusinfoBtn2Done">Chargement effectué</a>');
    // Render the Charts
  	dc.renderAll(); 

}


// function to highligh neo specifi stat
function highlight_neo_stat(text, neo,rawquery){
	
	if (neo.indexOf('-')> -1){
	  neo = neo.replace(/-/g,'.?');
//	  rawquery = rawquery.replace(/^.+\((.+?) .+$/,"$1");
	  rawquery = rawquery.replace(/-/g,'.');
	}
	// with exact neo form
	regexpstr = '(.{0,70})\\b(' + neo.toString() + ")(.{0,70})";
	var regexp = new RegExp( regexpstr, 'gi');
	//console.log("Neologism regexp : " +regexpstr);
	match = text.match(regexp);
	var res = ''
	// with rawquery
	if (match == null){
		regexpstr = '(.{0,70})\\b(' + rawquery.toString() + ")(.{0,70})";
	//	console.log("Raw query regexp : "+regexpstr);
		var regexp = new RegExp( regexpstr, 'gi');
		while ((match = regexp.exec(text))!== null){
			res = res + "<br/>..." + match[1] + "<span style='background-color: #ffa366'>" + match[2] + "</span>" + match[3] + "...";
			//match = regexp.exec(text);
		}	

	}
	else {
		while ((match = regexp.exec(text))!= null){
			res = res + "<br/>..." + match[1] + "<span style='background-color: #FFFF00'>" + match[2] + "</span>" + match[3] + "...";
			//match = regexp.exec(text);
		}	
	}
	return res;
}    



// function to filter articles with adequate match (from raw query)
function filter_solr_res(jsondata, rawquery){
	  console.log("filter_solr_res");	
	//  rawquery = rawquery.replace(/^.*?\((.+?) .+$/,"$1");
	  rawquery = rawquery.replace(/-/g,'.?');
	  console.log(rawquery);
	  regexpstr = '\\b' + rawquery.toString();
	  console.log(regexpstr);
	  jsonres = []
	  matchnb = 0;
	  var regexp = new RegExp( regexpstr, 'gi');
	  for (var key in jsondata) 
      {
    		console.log(jsondata[key]);
    		if (jsondata[key].contents[0].match(regexp) !== null){
	  			reslen = jsondata[key].contents[0].match(regexp).length;
	  			matchnb = matchnb + reslen;
	  			console.log("Nb of occurrences : " + reslen.toString());
	  			jsonres.push(jsondata[key]);
	  		}
	  		//else{
	  		//	console.log("No match");
	  		//}
	  		//if (reslen > 0){jsonres.push(docs[key]);}
	  }
	  console.log(jsonres);
	  console.log(jsonres.length);
	  return [jsonres.length,matchnb,jsonres];
}    




/// details

/// details
function formatajax(d,callback) 
{
		console.log(d);
		if (editor.lang == undefined){editor.lang='fr';}
		var restable='';
		var langues = {'it':"rss_italian",'fr':"rss_french", 'pl':"RSS_polish", 'br':'RSS_brasilian', 'ch':'RSS_chinese', 'ru':'RSS_russian', 'cz':'RSS_czech', 'gr':'RSS_greek'};
        var request= $.ajax({
//        url:'http://localhost:8983/solr/rss_french/select?q=neologismes%3A' + d.lexie + '&rows=5&df=contents&wt=json&indent=true&hl=true&hl.fl=contents&hl.simple.pre=%3Cem%3E&hl.simple.post=%3C%2Fem%3E',
        url:'http://tal.lipn.univ-paris13.fr/solr/' + langues[editor.lang] + '/select',
        data:{  q: '"'+d.forme+'"',
        		rows:100,
        		df:"contents",
        		sort:"dateS asc",
        		debug:"true",
        		wt:"json",
        		indent:"false",
        		"hl":"true",
        		"hl.fl":"*",
        		"hl.simple.pre":'<span style="background-color: #FFFF00">',
        		"hl.simple.post":"</span>"
        		},
        dataType: "jsonp",
        jsonp:'json.wrf',
        type:'GET',
       // async:false,
        success: function( result) {
        	console.log(result);
            data = result.highlighting;
            meta = result.response;
            docs = result.response.docs;
            rawquery = result.debug.parsedquery_toString;
            num = meta.numFound;
            totalocc=0;
            totaldoc=0;
            var tbody = '';
            for (var key in docs) 
            {
             	console.log(key);
             	res = highlight_neo(docs[key].contents[0], d.forme,rawquery.substring(9).replace(/^.+\((.+?) .+$/,"$1"));
             	if (res[1] > 0){
             		totaldoc = totaldoc + 1;
             		totalocc = totalocc + res[1];
             		var link = docs[key].link.substring(0,30);
                	var dateL = docs[key].dateS.substring(0,10);
                	tbody += '<tr><td>' + dateL + '</td><td><a title="Voir la source" href="' + docs[key].link + '" target="source">' + link+ '...</a></td><td>';
             		tbody+=res[0];
             	    tbody += '</td></tr>';
             	}
//            tbody += '</td></tr>';
            }
            var thead = '<div>' + totalocc + ' occurrences(s) dans ' + totaldoc + ' article(s). Requête étendue : "' + rawquery.substring(9).replace(/^.+\((.+?) .+$/,"$1") + '"</div><th>Date</th><th>Source</th><th>Extrait</th>';
//            var thead = '<div>' + num + ' article(s) pour requête brute : '+ rawquery + '</div><th>Date</th><th>Source</th><th>Extrait</th>';
           // tbody += '</td></tr>';
            restable = '<table width="100%">' + thead + tbody + '</table>';
            callback(restable);
    	},
        error: function (request) {
            alert("Error : " + request.status + ". Response : " +  request.statusText);
            restable= '<div>Problème :'+ request.status + ". Response : " +  request.statusText + '</div>';
            callback(restable)
        }
    });
	//return restable;
}


// onglet statistiques (phc project)

$("a[id^='corpusinfoBtn']").on('click',function(){ // #corpusinfoBtn.."
	language = $(this).attr("language") ;
	thisId = $(this).id
	console.log("button corpusinfoBtn triggered");
	console.log($(this));
	$(this).hide();
    get_morphem_info(language, function(data)
    {
   		console.log(data);
    	table = "<div><table class='table table-bordered table-condensed'>"+
    		"<tr><td><b>French</b></td><td>" + data[0]['French'] + " lexemes</td></tr>" +
    		"<tr><td><b>Polish</b></td><td>" + data[0]['Polish'] + " lexemes</td></tr>" +
    		"<tr><td><b>Czech</b></td><td>" + data[0]['Czech'] + " lexemes</td></tr>" +
    		"<tr><td><b>English</b></td><td>" + data[0]['English'] + " lexemes</td></tr>" +
    		"</table></div>";
    	// commons and specifics
    	var dict = {}; 
    	for (var i = 0; i < data[1].length; i++) {
    		str_value = '';
    		nb = data[1][i].set;
    		for  (var j = 0; j < nb.length; j++) {
    			str_value = str_value + "[" +  data[2][nb[j]]+ "]";
    		}
    		dict[data[1][i].set] = str_value;
    	}	
    	table4 = "<div><table class='table table-bordered table-condensed'>";
    		datadiff = get_spec(data[1]);
    		console.log("datadiff");
    		console.log(datadiff);
    		for (var i = 0; i < data[1].length; i++) {
    			table4 = table4 + "<tr><td style='width:10%'><b>" + dict[data[1][i].set] ;
    			if (data[1][i].set.length == 1){
    				if (datadiff[i] === undefined){datadiff[i] = '';}
    				table4 = table4 +  "</b></td><td><table class='table table-bordered table-condensed'>" 
    				+ "<tr><td><b>Spec (" + datadiff[i].length + ")</b> <div onclick='$(this).closest(" +'"td"' + ").next().toggle();'>Show/Hide</div></td><td>" + datadiff[i] + "</td></tr>" 
    				+ "<tr><td><b>All (" + data[1][i].names.length + ")</b><div onclick='$(this).closest(" +'"td"' + ").next().toggle();'>Show/Hide</div></td><td>"+ data[1][i].names + "</td></tr></table></td></tr>"
    			}
    			else {
    				table4 = table4 + " (" + data[1][i].names.length + ")</b><div onclick='$(this).closest(" +'"td"' + ").next().toggle();'><button type='button' class='btn btn-link'>Show/Hide</button></td><td>" + data[1][i].names + "</td></tr>" ;   			
    			}
    		}
    	table4 = table4 + "</table></div>";
    		table3 = table + table4;
    	$("#table-" + language).append(table3);
    }
    );
 
});

function get_morphem_info(morphem, callback)
{
var jqxhr = $.ajax( "./php/db_access.php?action=phc_stats&id="+morphem )
  .done(function(data) {
    console.log(data);
    fr=[];
    cz=[];
    pl=[];
    en=[];
    // arrays of freq
    freq_fr=[];
    freq_cz=[];
    freq_pl=[];
    words=[]
    $.each(JSON.parse(data), function(i, obj) {
    	word = {'sets':[], 'size':0}; // 'word':obj.word,
    	if (obj.freq_en > 0){en.push(obj.word);word.sets.push('Anglais');word.size = word.size+1;}
    	if (obj.freq_pl > 0){pl.push(obj.word);word.sets.push('Polonais');word.size = word.size+1;freq_pl.push(obj.freq_pl);}
    	if (obj.freq_fr > 0){fr.push(obj.word);word.sets.push('Français');word.size = word.size+1;freq_fr.push(obj.freq_fr);}
    	if (obj.freq_cz > 0){cz.push(obj.word);word.sets.push('Tchèque');word.size = word.size+1;freq_cz.push(obj.freq_cz);}
    	words.push(word);   	
    	//console.log(obj)
	});
	var sets = ["Français", "Tchèque", "Polonais", "Anglais"];
	var setsDisplay = ["Français (" + fr.length +")", "Tchèque (" + cz.length +")", "Polonais (" + pl.length +")", "Anglais (" + en.length +")"]
	var items = [fr, cz,pl,en]
	data_synth = {'French': fr.length,'Polish': pl.length,'Czech': cz.length, 'English': en.length};
	//upset graph
	data_proc = makeUpset(sets,items,"Lexies communes et distinctes pour " + morphem, morphem);
	// histograms
	draw_histogram(freq_fr, 'fr', morphem);
	draw_histogram(freq_pl, 'pl', morphem);
	draw_histogram(freq_cz, 'cz', morphem);
	// data structure for Venn diagram
	VennSets = []
	for (i=0;i < data_proc.length; i++){
	  if (data_proc[i].names.length > 0){
		if (data_proc[i].set.length==1){
			vennSet = {'words':data_proc[i].names,'sets':data_proc[i].set.split(''),'label': setsDisplay[parseInt(data_proc[i].set)],'size':data_proc[i].names.length};
			VennSets.push(vennSet);
		}
		else{
			inters = data_proc[i].set.split('');
			displayLabel = []
			for (j=0; j < inters.length;j++){ displayLabel.push(sets[inters[j]]);}
			vennSet = {'dlabel':displayLabel.join('-'), 'words':data_proc[i].names,'label':data_proc[i].names.length.toString(),'sets':data_proc[i].set.split(''),'size':data_proc[i].names.length};		
			VennSets.push(vennSet);
		}
	  }
	}
	console.log("venn diagram building");
	console.log(VennSets);
	data_venn = drawVenn(VennSets, morphem);
	console.log("venn diagram building ended");
	data = [data_synth, data_proc, sets]
	callback(data);

   // d3 js bar chart
 })
  
  .fail(function(jqXHR, textStatus) {
    console.log( "error"  + textStatus);
  });

}

function get_spec(data){
	const setDifference = (a, b) => new Set([...a].filter(x => !b.has(x)));
	//const setIntersection = (a, b) => new Set([...a].filter(x => b.has(x)));
	//const setUnion = (a, b) => new Set([...a, ...b]);
	const a = new Set(data[0].names);
	const b = new Set(data[1].names);
	const c = new Set(data[2].names);
	const d = new Set(data[3].names);
	aspec = differenceSet(a, [...b,...c,...d]);
	bspec = differenceSet(b, [...a,...c,...d]);
	cspec = differenceSet(c, [...a,...b,...d]);
	dspec = differenceSet(d, [...a,...b,...c]);
	if (aspec.size ==0){aspec = ['']} else{aspec = Array.from(aspec)}
	if (bspec.size ==0){bspec = ['']} else{bspec = Array.from(bspec)}
	if (cspec.size ==0){cspec = ['']} else{cspec = Array.from(cspec)}
	if (dspec.size ==0){dspec = ['']} else{dspec = Array.from(dspec)}
	res = [aspec,bspec,cspec,dspec]
	return res
	//setIntersection(a, b); // Set { 2 }
	//setUnion(a, b); // Set { 1, 2, 3 }
}

function differenceSet(setA, setB) {
	var difference = new Set(setA);
	for (var elem of setB) {
		difference.delete(elem);
	}
 	return difference;
 }
 
 
// histogram plot for each language
function draw_histogram(data, lang, morphem){
	// 
	datalog =[]
	data.forEach(function (e) {
    	datalog.push(Math.log(e));
	});
	data = datalog;
	
	lang_corr={'pl':"Polonais",'cz':'Tchèque','fr':'Français'};

	//d3v5 = require("d3v5@5");
	min = d3v5.min(data);
	max = d3v5.max(data);
	domain = [min,max];
	//Graph data
	var margin = { top: 20, right: 20, bottom: 50, left: 70 },
  		width = 600,
  		height = 400;
 
	// The number of bins 
	Nbin = 20;
	//As the Histogram gets the bin threshold from the x ticks of the x axis, we built first the x axis with a scale
	var x = d3v5
  		.scaleLinear()
  		.domain(domain) 
  		.range([0, width]); 
	
	//Build the histogram function and gets the bins
	var histogram = d3v5
  		.histogram()
  		.domain(x.domain()) // then the domain of the graphic
  		.thresholds(x.ticks(Nbin)); // then the numbers of bins
 
	// And apply this function to data to get the bins
	var bins = histogram(data);
	//Build the top element of the graphic
	// Add the svg element to the body and set the dimensions and margins of the graph
	var svg = d3v5
  		.select("#histo_"+ lang + '_' + morphem)
  		.append("svg")
  		.attr("width", width + margin.left + margin.right)
  		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	//Add the x axis
	svg
  		.append("g")
  		.attr("transform", "translate(0," + height + ")")
  		.call(d3v5.axisBottom(x));
	//Add the y axis. The domain goes from 0 to the max of the element by bins (the length attributes of the bins arrays)
	var y = d3v5
  		.scaleLinear()
  		.range([height, 0])
  		.domain([
    		0,
    		d3v5.max(bins, function(d) {
      			return d.length;
    		})
  	]); 
 
	svg.append("g").call(d3v5.axisLeft(y));
	//Append the bar rectangles to the svg element
	svg
  		.selectAll("rect")
  		.data(bins)
  		.enter()
  		.append("rect")
  		.attr("x", 1)
  		.attr("transform", function(d) {
    		return "translate(" + x(d.x0) + "," + y(d.length) + ")";
  		})
  		.attr("width", function(d) {
    		return x(d.x1) - x(d.x0) - 1;
  		})
  		.attr("height", function(d) {
    		return height - y(d.length);
  		})
  		.style("fill", "#69b3a2");
  	

	//  titles to the axes

	svg.append("text")
    	.attr("text-anchor", "middle") 
    	.attr("transform", "translate(" + -40 + "," + (height / 2) + ")rotate(-90)") 
    	.text("Nombre de lexies");

	svg.append("text")
    	.attr("text-anchor", "middle") 
    	.attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")") 
    	.text("Fréquence (log 10)");
    	

  	// title
	svg.append("g")
  		.append("text")
  		.text("Distribution (Log. 10) : " + lang_corr[lang])
  		.attr("class", "title")
  		.attr("font-size", "18px")
  		.attr("x", width / 4)
  		.attr("y", 10);


}
// draw venn diagram for given morphem data
// from : http://benfred.github.io/venn.js/examples/intersection_tooltip.html
function drawVenn(data, morphem){

var chartvenn = venn.VennDiagram()
                 .width(500)
                 .height(500);

//console.log($("#Venn"+morphem));
var div = d3.select("#Venn"+morphem)
//console.log(chartvenn);
div.datum(data).call(chartvenn);


div.selectAll("path")
    .style("stroke-opacity", 0)
    .style("stroke", "#fff")
    .style("stroke-width", 3)

div.selectAll("g")
	.on("mouseover", function(d,i){
		venn.sortAreas(div, d);
        var selection = d3.select(this).transition("tooltip").duration(0);
        selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1)
            .style("stroke", "#000000");	
	})
	.on("mouseout", function(d,i){
		venn.sortAreas(div, d);
        var selection = d3.select(this).transition("tooltip").duration(0);
        selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 0)
            .style("stroke", "#fff");	
	})
    .on("click", function(d, i) {
        // modal window 
        //alert(d.words);
        table = "<div><table class='table table-bordered table-condensed'><tr><td>" + d.words.join(", ") + "</td></tr></table>";
        if (d.label.length > 4){title = d.label;}else{ title = d.dlabel + ' (' + d.label + ')';}
        //title = 
        $('#myModal .modal-title').html("Données spécifiques à : " + title);
        $('#myModal .modal-body').html(table);
        $('#myModal').modal('show');
    });
}
 
 /// save to borrowings_description
 function save_to_borrowings() {
		console.log("save_to_borrowings")
		var request = $.ajax({
			url: "php/db_access.php",
			type: "POST",
			data:{"action":"copy_lexemes"}
		});

		request.done(function(msg) {
			alert(msg)
		});

		request.fail(function(jqXHR, textStatus) {
			alert( "Echec de l'exécution de la requête : " + textStatus );
		});
	}