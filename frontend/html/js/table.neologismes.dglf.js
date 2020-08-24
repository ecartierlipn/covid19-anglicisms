
console.log("Working Language : " + languageW);

jQuery.support.cors = true;
var editor; // use a global for the submit and return data rendering in the examples
$(document).ready(function() {
	editor = new $.fn.dataTable.Editor( {
//		ajax: "php/neologismes.dglf.php?lang="+languageW,
		ajax : {url:"php/neologismes.dglf.php?lang="+languageW,type:"POST",dataType:"json"},
		table: "#example",
		lang:languageW,
		display: "envelope",
		fields: [ {
				label: "Forme préconisée:",
				name: "forme"
			}, 
			{
				label: "Statut:",
				name: "statut"
//				type: "select",
//				placeholder:"Sélectionnez la source"
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

editor.lang=languageW;

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
 
        editor.remove( $(this).closest('tr'), {
            title: "Suppression d'une entrée",
            message: 'Etes-vous certain de vouloir supprimer cette entrée (êtes-vous sûr qu\'il ne s\'agit pas d\'une lexie à intégrer à l\'un des dictionnaires d\'exclusion)?',
            buttons: 'Supprimer'
        } );
    } );

// inline editor type field
$('#example').on( 'click', 'tbody td:nth-child(1)', function () {
    editor.inline( this , {
        submitOnBlur: true
    } );
} );



// filter for each column
$(document).ready( function () {
				$('#example').dataTable().columnFilter({
					aoColumns: [ 
						{ sSelector: "#example_neo",type: "text", bRegex: true, bSmart: true },
						{ sSelector: "#example_type",type: "text", bRegex: true, bSmart: true },
						{ sSelector: "#example_maj",type: "date"},
						{ sSelector: "#example_freq_neoveille",type: "number"},
						{ sSelector: "#example_freq_bnf",type: "number"},
					]
		});
} );



var table = $('#example').DataTable( {
		dom: '<B>lfrtip',
		fixedHeader: true,
		scrollY: '150vh',
        scrollCollapse: true,
		//serverSide:true,
		//processing:true,
		//"deferLoading": [ 57, 100 ],
//		deferRender: true,
		ajax: {url:"php/neologismes.dglf.php?lang="+languageW,type:"POST",dataType:"json"},
		lengthMenu: [[10, 25, 50, 100,  -1], [10, 25, 50, 100, "Tous"]],
		lengthChange: true,
		order: [[ 5, "desc" ]],
		select:true,
		columns: [
/*			{
                data: null,
                defaultContent: '',
                className: 'select-checkbox',
                orderable: false
            },*/
		
			{ data: "forme", className: 'editable' },
			{ data: "statut" },
			{ data: "last_update" },
			{ data: "freq_neoveille_group" },
			{ data: "freq_bnf_group" },
			// for child row
			{
                className:      'details-info',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
			// for child row 2
			{
                className:      'details-control2', // neoveille mysql data
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
            {
                className:      'details-control4', // bnf mysql data
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
			{
                className:      'details-control3', // google
                orderable:      false,
                data:           null,
                defaultContent: ''
            },
			{
                className:      'editor_edit', // edit
                orderable:      false,
                data:           null,
                defaultContent: ''
            }
			/*{
                className:      'editor_remove',
                orderable:      false,
                data:           null,
                defaultContent: ''
            },*/
/*			{
                data: null,
                className: "center",
                defaultContent: '<a href="" class="editor_edit"></a> / <a href="" class="editor_remove"></a>'
            }*/
		],
		select: {
            style:    'os',
            selector: 'td:first-child'
        },
		buttons: [
			{ extend: "create", editor: editor },
			{ extend: "edit",   editor: editor },
			{ extend: "remove", editor: editor }
			//{extend: "selectAll", editor: editor}
			//'colvis',
			/*{
                extend: 'collection',
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
            }*/
			
		],
		language:{url:"//cdn.datatables.net/plug-ins/1.10.13/i18n/French.json"}
		
	} );
	
// Add event listener for opening and closing details
// word infos variantes et concurrents
$('#example tbody').on('click', 'td.details-info', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            $.blockUI({ message: '<div class="card-body"><img src="../img/wait.gif" width="50" />Chargement en cours...</div>' }); 
            get_word_info_dglf(row.data(), function(data)
            {
	            //alert(data)
    	        row.child(  data ).show();
        	    tr.addClass('shown');
        	    $.unblockUI();
            }
            );
        }
    } );

// interactive visualization of retrieved contexts from neoveille for given word
$('#example tbody').on('click', 'td.details-control2', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 		if (editor.lang == undefined){editor.lang='fr';}
        if ( row.child.isShown() ) {
            // This row is already open - close it
             //$("#corpusResultsFr").hide();
            row.child.hide();
            details = row.child()
            details.removeClass('shown');
            //details.removeClass('stat_res');
        }
        else {
            // Open this row
            $.blockUI({ message: '<div class="card-body"><img src="../img/wait.gif" width="50" />Chargement en cours...</div>' }); 
            console.log(row.data())
// from csv:get_neo_info_csvdata(editor.lang, row.data(), function(data) // from csv
            get_neo_info_mysqldata(editor.lang, row.data(), function(data) // from mysql
            {
	            //alert(data)
    	        row.child(  data ).show();
	            details = row.child()
        	    details.addClass('shown');
        	    details.addClass('stat_res');
            	if (typeof data == 'number'){
				    $('#dglfResults'+ editor.lang).clone().appendTo('.stat_res td');
				    $("#dglfResults" + editor.lang).show();
				}
				$.unblockUI();
        	    
            }
            );
        }
    } );

// interactive visualization of retrieved contexts from bnf for given word
$('#example tbody').on('click', 'td.details-control4', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 		if (editor.lang == undefined){editor.lang='fr';}
        if ( row.child.isShown() ) {
            // This row is already open - close it
             //$("#corpusResultsFr").hide();
            row.child.hide();
            details = row.child()
            details.removeClass('shown');
            //details.removeClass('stat_res');
        }
        else {
            // Open this row
            $.blockUI({ message: '<div class="card-body"><img src="../img/wait.gif" width="50" />Chargement en cours...</div>' }); 
            console.log(row.data())
// from csv:get_neo_info_csvdata(editor.lang, row.data(), function(data) // from csv
            get_neo_info_mysqldata_bnf_dglf(editor.lang, row.data(), function(data) // from mysql
            {
	            //alert(data)
    	        row.child(  data ).show();
	            details = row.child()
        	    details.addClass('shown');
        	    details.addClass('stat_res');
            	if (typeof data == 'number'){
				    $('#dglfResultsBNF'+ editor.lang).clone().appendTo('.stat_res td');
				    $("#dglfResultsBNF" + editor.lang).show();
				}
				$.unblockUI();
        	    
            }
            );
        }
    } );


// google call
$('#example tbody').on('click', '.details-control3', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        d = row.data()
        console.log(d);
        codesG = {'it':'22','fr':'19','ru':'25','ch':'11'}
url = 'https://www.google.fr/search?hl=' + editor.lang + '&as_q="'  + d.forme +'"'
//        url = 'https://news.google.com/?output=rss&hl=fr&gl=fr&scoring=o&num=100&q=' + row.data().termes_copy.terme ;
url2 = 'https://books.google.com/ngrams/graph?case_insensitive=on&year_start=1800&year_end=2008&corpus=' + codesG[editor.lang] + '&smoothing=3&content=' + d.forme;
        //alert(row.data().termes_copy.terme);
        window.open(url2,"_details");
    } );

    
} );

//////////////   STATS FOR SPECIFIC NEOLOGISM 

//Neoveille
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
        		rows:1000,
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
            	callback("Il n'y a pas de données disponibles pour ce néologisme pour cette langue actuellement. Réessayer plus tard. Vous pouvez consulter le corpus complet dans l'onglet 'Toutes les langues'.");
            }
            else{
	            callback(num);
	            build_corpus_info_lang(docsdata,lang, neo.forme,rawquery);
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
            .rowsCap(15)
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
      function(d) {return highlight_neo(d.contents.toString(),neolo,rawquery.substring(9)) + '&nbsp;<a title=\"Voir l\'article complet\" href=\"' + d.article + "\" target=\"_blank\"><span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span></a>";},
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.descending);
    //console.log(dataTableDC);

/**function highlight(text, neo){
	
	var regexp = new RegExp( "(.{0,70})(" + neo.toString() + ")(.{0,70})", 'g');
	console.log(text);
	console.log(typeof text);
	console.log(regexp);
	console.log(typeof regexp)
	var res = text.match(regexp);
	match = regexp.exec(text);
	var res = ''
	while (match != null){
		res = res + "<br/>..." + match[1] + "<mark>" + match[2] + "</mark>" + match[3] + "...";
		match = regexp.exec(text);
	}
	console.log(res);
	return res;
}    **/
    
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


/// interactive visualization of data with contexts analyzed (in db)
// get info from mysql
function get_neo_info_mysqldata(lang,neo,callback) 
{
   
    	console.log(neo);
		d3.json("./php/db_access.php?action=neoveille_dglf&id="+neo.id, function(error, data) {
        	console.log(data);
        	console.log(error);
        	count = data.length;
        	console.log(count);
        	if (count == 0){
            	callback("Il n'y a pas de données disponibles pour ce néologisme.");
            }
            else{
	            callback(count); // .toString() + " articles pour cette lexie."
	            build_neo_contexts_viz2(data,lang);
	        }
        	
        });   
}

// main function to display interactive graphs - ok
function build_neo_contexts_viz2(jsondata, lang){

//console.log(jsondata[0]);

/********************* GET THE JSON DATA AND TRANSFORM WHEN NECESSARY ***********/
  // format our data : dateS,source,link,subject,subject2, neologisms
  
  
  var dtgFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
  
  jsondata.forEach(function(d) { 
  		//console.log(d);
    	d.dtg   = dtgFormat.parse(d.date);
 		d.newspaper   = d.journal;
    	d.subject  = d.subject;
    	d.article= d.link;
    	d.core = d.coreforme + "/" + d.corepos;
    	if (d.corelemma=='unknown'){d.corelemma=d.coreforme;}
    	if (d.l5lemma=='unknown'){d.l5lemma=d.l5forme;}
    	if (d.l4lemma=='unknown'){d.l4lemma=d.l4forme;}
    	if (d.l3lemma=='unknown'){d.l3lemma=d.l3forme;}
    	if (d.l2lemma=='unknown'){d.l2lemma=d.l2forme;}
    	if (d.l1lemma=='unknown'){d.l1lemma=d.l1forme;}
    	if (d.r5lemma=='unknown'){d.r5lemma=d.r5forme;}
    	if (d.r4lemma=='unknown'){d.r4lemma=d.r4forme;}
    	if (d.r3lemma=='unknown'){d.r3lemma=d.r3forme;}
    	if (d.r2lemma=='unknown'){d.r2lemma=d.r2forme;}
    	if (d.r1lemma=='unknown'){d.r1lemma=d.r1forme;}
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
           .margins({top: 0, right: 0, bottom: 0, left: 0})
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
		    .turnOnControls(true)
	        .controlsUseVisibility(true)
	        ;		   


console.log("Neo chart built");
console.log(neoChart);

/***************************** SUBJECT PIE CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.rowChart("#dc-subject-chart"+lang);
var subjectDimension = facts.dimension(function (d) { return d.subject; });
var subjectGroup = subjectDimension.group();
var subjectGroupTop = remove_empty_bins(subjectGroup);
console.log("Subject groups :" + subjectGroupTop.all());
  
// subject chart
 	subjectChart
 		//.width(300)
        .height(300)
        .margins({top: 0, right: 0, bottom: 0, left: 0})
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
 	    ;
        
console.log("Subject chart built");
//console.log(subjectChart);

/***************************** NEWSPAPER ROW BAR CHART ***********************/

var newspaperChart = dc.rowChart("#dc-newspaper-chart"+lang);
var newspaperDimension = facts.dimension(function (d) { return d.newspaper; });
var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.newspaper; });
var newspaperGroupTop = remove_empty_bins(newspaperGroup);
console.log("newspaper groups :" + newspaperGroupTop.all());

// newspaper setup rowschart (TOP)
    newspaperChart
    		//.width(300)
            .height(300)
            .margins({top: 0, right: 0, bottom: 0, left: 0})
            .dimension(newspaperDimension)
            .group(newspaperGroupTop)
        .rowsCap(10)
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
 	    ;



console.log("Newspapers chart built");
//console.log(newspaperChartLow);
//console.log(newspaperChart);


/***************************** domain series CHART dos not work***********************/
/*
var seriesdomainChart = dc.seriesChart("#dc-seriesdomain-chart"+lang);
var seriesdomainDimension = facts.dimension(function (d) { return [d.subject,d3.time.month(d.dtg)]; });
var seriesdomainGroup = seriesdomainDimension.group().reduceCount();
console.log("seriesdomain groups");
console.log(seriesdomainGroup.all());

    seriesdomainChart
    		//.width(300)
            .height(300)
            .chart(function(c) { 
                  return dc.lineChart(c).interpolate('cardinal').renderDataPoints({radius: 3} ) 
               })
            .dimension(seriesdomainDimension)
            .group(seriesdomainGroup)
               .x(d3.time.scale().domain([minDate, maxDate]))
               .elasticY(true)
               .brushOn(false)
               .seriesAccessor(function(d) { return d.key[0];})
               .keyAccessor(function(d) { return d.key[1]; })
               .valueAccessor(function(d) { return +d.value; })
               .legend(dc.legend().x(350).y(500).itemHeight(13).gap(5).horizontal(1)
                  .legendWidth(120).itemWidth(60));



console.log("seriesdomains chart built");

*/


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
    //.elasticX(true)
    .shareTitle(false) 
    
	.compose(rescharts)
    .rangeChart(periodChart2)
    .xUnits(d3.time.day)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
 periodChart2 
        .height(100)
       // .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByMonth)
    	.group(volumeByDayGroup)
        .centerBar(true)
        .elasticY(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);


/********************* composite chart by domain ***********/
// Composite chart
var compositeChart2 = dc.compositeChart("#dc-comptimedomain-chart"+lang);
var periodChart3 = dc.barChart("#range-chart3"+lang);

var volumeByDaycoreGroupTmp2 = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.subject] = (p[v.subject] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.subject] -= 1; // for sum v.value
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
       // .margins({top: 0, right: 0, bottom: 20, left: 40})
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
        p[v.newspaper] = (p[v.newspaper] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.newspaper] -= 1; // for sum v.value
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
//console.log("Word keys");
//console.log(wordkeys);

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
       // .margins({top: 0, right: 0, bottom: 20, left: 40})
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
    var coreformeDimension = facts.dimension(function (d) { return d.coreforme; });
    var coreformeGroup = coreformeDimension.group().reduceCount(function (d) { return d.coreforme; });


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
    var coreposDimension = facts.dimension(function (d) { return d.corepos; });
    var coreposGroup = coreposDimension.group().reduceCount(function (d) { return d.corepos; });

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
    var corelemmaDimension = facts.dimension(function (d) { return d.corelemma; });
    var corelemmaGroup = corelemmaDimension.group().reduceCount(function (d) { return d.corelemma; });



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
 //neolo = lexie.toString()
 //console.log(neolo)

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
      function(d) { return '<a href=\"' + d.link + "\" target=\"_blank\">" +d.newspaper+"</a>";},
      function(d) { return d.subject; },
      function(d) { return get_text_from_neoveille(d);},
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.descending);
    //console.log(dataTableDC);

console.log("Datatable chart built");
console.log(timeDimension);

/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll(); 

}


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
	res3 = res2.replace("[<>]",'');
	return res3 + '...';

}



// dglflf

// get info from mysql for bnf data
function get_neo_info_mysqldata_bnf_dglf(lang,neo,callback) 
{
   
    	console.log(neo);
		d3.json("./php/db_access.php?action=bnf_dglf&id="+neo.id, function(error, data) {
        	console.log(data);
        	console.log(error);
        	count = data.length;
        	console.log(count);
        	if (count == 0){
            	callback("Il n'y a pas de données disponibles pour ce néologisme.");
            }
            else{
	            callback(count); // .toString() + " articles pour cette lexie."
	            build_neo_contexts_viz2_dglf_bnf(data,lang);
	        }
        	
        });   
}

// main function to display interactive graphs - ok
function build_neo_contexts_viz2_dglf_bnf(jsondata, lang){

//console.log(jsondata[0]);

/********************* GET THE JSON DATA AND TRANSFORM WHEN NECESSARY ***********/
  // format our data : dateS,source,link,subject,subject2, neologisms
  
  
  var dtgFormat = d3.time.format("%Y-%m-%d %H:%M:%S"); 
  jsondata.forEach(function(d) { 
  		console.log(d);
    	d.dtg   = dtgFormat.parse(d.crawl_date);
//    	d.dtg   = d.crawl_date;
 		d.newspaper   = d.domain;
    	d.subject  = d.keywords; // be careful => array!
    	d.article= d.url;
    	d.link= d.url;
    	d.corepos = d.tag.substring(0,d.tag.indexOf("__"))
    	d.core = d.forme + "/" + d.corepos;
    	d.coreforme = d.forme;
    	d.corelemma = d.forme;
    	/*if (d.l5lemma=='unknown'){d.l5lemma=d.l5forme;}
    	if (d.l4lemma=='unknown'){d.l4lemma=d.l4forme;}
    	if (d.l3lemma=='unknown'){d.l3lemma=d.l3forme;}
    	if (d.l2lemma=='unknown'){d.l2lemma=d.l2forme;}
    	if (d.l1lemma=='unknown'){d.l1lemma=d.l1forme;}
    	if (d.r5lemma=='unknown'){d.r5lemma=d.r5forme;}
    	if (d.r4lemma=='unknown'){d.r4lemma=d.r4forme;}
    	if (d.r3lemma=='unknown'){d.r3lemma=d.r3forme;}
    	if (d.r2lemma=='unknown'){d.r2lemma=d.r2forme;}
    	if (d.r1lemma=='unknown'){d.r1lemma=d.r1forme;}*/
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
           .margins({top: 0, right: 0, bottom: 0, left: 0})
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
		    .turnOnControls(true)
	        .controlsUseVisibility(true)
	        ;		   


console.log("Neo chart built");
console.log(neoChart);

/***************************** SUBJECT PIE CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.rowChart("#dc-subject-chart"+lang);
var subjectDimension = facts.dimension(function (d) { return d.subject; });
var subjectGroup = subjectDimension.group();
var subjectGroupTop = remove_empty_bins(subjectGroup);
console.log("Subject groups :" + subjectGroupTop.all());
  
// subject chart
 	subjectChart
 		//.width(300)
        .height(300)
        .margins({top: 0, right: 0, bottom: 0, left: 0})
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
 	    ;
        
console.log("Subject chart built");
//console.log(subjectChart);

/***************************** NEWSPAPER ROW BAR CHART ***********************/

var newspaperChart = dc.rowChart("#dc-newspaper-chart"+lang);
var newspaperDimension = facts.dimension(function (d) { return d.newspaper; });
var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.newspaper; });
var newspaperGroupTop = remove_empty_bins(newspaperGroup);
console.log("newspaper groups :" + newspaperGroupTop.all());

// newspaper setup rowschart (TOP)
    newspaperChart
    		//.width(300)
            .height(300)
            .margins({top: 0, right: 0, bottom: 0, left: 0})
            .dimension(newspaperDimension)
            .group(newspaperGroupTop)
        .rowsCap(10)
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
 	    ;



console.log("Newspapers chart built");
//console.log(newspaperChartLow);
//console.log(newspaperChart);


/***************************** domain series CHART dos not work***********************/
/*
var seriesdomainChart = dc.seriesChart("#dc-seriesdomain-chart"+lang);
var seriesdomainDimension = facts.dimension(function (d) { return [d.subject,d3.time.month(d.dtg)]; });
var seriesdomainGroup = seriesdomainDimension.group().reduceCount();
console.log("seriesdomain groups");
console.log(seriesdomainGroup.all());

    seriesdomainChart
    		//.width(300)
            .height(300)
            .chart(function(c) { 
                  return dc.lineChart(c).interpolate('cardinal').renderDataPoints({radius: 3} ) 
               })
            .dimension(seriesdomainDimension)
            .group(seriesdomainGroup)
               .x(d3.time.scale().domain([minDate, maxDate]))
               .elasticY(true)
               .brushOn(false)
               .seriesAccessor(function(d) { return d.key[0];})
               .keyAccessor(function(d) { return d.key[1]; })
               .valueAccessor(function(d) { return +d.value; })
               .legend(dc.legend().x(350).y(500).itemHeight(13).gap(5).horizontal(1)
                  .legendWidth(120).itemWidth(60));



console.log("seriesdomains chart built");

*/


/***************************** TIMELINE ***********************/



// see http://dc-js.github.io/dc.js/docs/html/dc.lineChart.html
// Create the dc.js chart objects & link to div
var timeChart = dc.lineChart("#dc-time-chart"+lang);
var periodChart = dc.barChart("#range-chart"+lang);

// create timeline chart dimensions
	var volumeByDay = facts.dimension(function(d) {
    return d3.time.day(d.dtg);
  });
	var volumeByYear = facts.dimension(function(d) {
    return d3.time.year(d.dtg);
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

  var volumeByYearGroup = volumeByYear.group()
    .reduceCount(function(d) { return d.dtg; });
	console.log("year groups :" + volumeByYearGroup.size());

    
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
    .dimension(volumeByYear)
    .group(volumeByYearGroup)
    .transitionDuration(500)
    .mouseZoomable(true)    
    .brushOn(false)
    .renderDataPoints({radius: 5, fillOpacity: 0.8, strokeOpacity: 0.8})
    .title(function(d){
      return dtgFormat(d.key)
      + "\nTotal : " + d.value;
      })
    .elasticY(true)
    .rangeChart(periodChart)
    .xUnits(d3.time.year)
    //.curve(d3.curveBasisOpen) //d3 > 3
   // .interpolate('basis') // 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 
    //'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and 'monotone'.
    .renderHorizontalGridLines(true) 
    .defined(function(d) {
            		//console.log(d);
    				if(d.y !== null) {
       					 return d.y;
    				}
    				else{
    					return 0;
    				}
				})    
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxis();


  
  console.log("Time chart built");
  console.log(timeChart);
  
/******************  range chart **************/
periodChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(100)
        .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByYear)
    	.group(volumeByYearGroup)
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

var volumeByDaycoreGroupTmp = volumeByYear.group().reduce(
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
            	.dimension(volumeByYear)
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
    //.elasticX(true)
    .shareTitle(false) 
    
	.compose(rescharts)
    .rangeChart(periodChart2)
    .xUnits(d3.time.year)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
 periodChart2 
        .height(100)
       // .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByYear)
    	.group(volumeByYearGroup)
        .centerBar(true)
        .elasticY(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);


/********************* composite chart by domain ***********/
// Composite chart
var compositeChart2 = dc.compositeChart("#dc-comptimedomain-chart"+lang);
var periodChart3 = dc.barChart("#range-chart3"+lang);

var volumeByDaycoreGroupTmp2 = volumeByYear.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.subject] = (p[v.subject] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.subject] -= 1; // for sum v.value
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
            	.dimension(volumeByYear)
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
       // .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByYear)
    	.group(volumeByYearGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.year);


/********************* composite chart by newspaper ***********/
// Composite chart
var compositeChart3 = dc.compositeChart("#dc-comptimenews-chart"+lang);
var periodChart4 = dc.barChart("#range-chart4"+lang);

var volumeByDaycoreGroupTmp3 = volumeByYear.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.newspaper] = (p[v.newspaper] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.newspaper] -= 1; // for sum v.value
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
//console.log("Word keys");
//console.log(wordkeys);

console.log(volumeByDaycoreGroup3.all());
console.log(wordkeys3);
rescharts3 = wordkeys3.slice(0,10).map(function(name) { // .slice(0,5)
        	return dc.lineChart(compositeChart3)
            	.dimension(volumeByYear)
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
    .shareTitle(false) 
    
	.compose(rescharts3)
    .rangeChart(periodChart4)
    .xUnits(d3.time.year)
    .renderHorizontalGridLines(true)   
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(50).y(30).gap(5)) //
    .xAxis();
/******************  range chart **************/
periodChart4 
        .height(100)
       // .margins({top: 0, right: 0, bottom: 20, left: 40})
	    .dimension(volumeByYear)
    	.group(volumeByYearGroup)
        .centerBar(true)
        .elasticY(true)
        //.gap(1)
        .x(d3.time.scale().domain([minDate, maxDate]))
        //.round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.year);




/*****************************  CORE (lemma, forme, pos) ROW BAR CHART ***********************/
// **************************forme
var coreformeChart = dc.rowChart("#dc-coreforme-chart"+lang);

//  coreformechart dimensions (with a fake group to keep just top and bottom 15
    var coreformeDimension = facts.dimension(function (d) { return d.coreforme; });
    var coreformeGroup = coreformeDimension.group().reduceCount(function (d) { return d.coreforme; });


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
    var coreposDimension = facts.dimension(function (d) { return d.corepos; });
    var coreposGroup = coreposDimension.group().reduceCount(function (d) { return d.corepos; });

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
    var corelemmaDimension = facts.dimension(function (d) { return d.corelemma; });
    var corelemmaGroup = corelemmaDimension.group().reduceCount(function (d) { return d.corelemma; });



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
 //neolo = lexie.toString()
 //console.log(neolo)

  /// render the datatable
    dataTableDC
//    .width(960).height(800)
    .dimension(timeDimension)
	.group(function(d) { return ""})
	//.size(10)
	.turnOnControls(true)
    .controlsUseVisibility(true)
    .columns([
      function(d) { return d.dtg; },
      function(d) { return '<a href=\"' + d.link + "\" target=\"_blank\">" +d.newspaper+"</a>";},
      function(d) { return d.subject; },
      function(d) { return get_text_from_bnf(d);},
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.descending);
    //console.log(dataTableDC);

console.log("Datatable chart built");
console.log(timeDimension);

/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll(); 

}

function get_text_from_bnf(d){
	res='...';
	if (d.l1forme){res = res + d.l1forme +' '; }
	if (d.l2forme){res = res + d.l2forme +' '; }
	if (d.l3forme){res = res + d.l3forme +' '; }
	if (d.l4forme){res = res + d.l4forme +' '; }
	if (d.l5forme){res = res + d.l5forme +' '; }
	if (d.coreforme){console.log("coreforme : " + d.coreforme);res = res + "<span style='background-color: #ffa366'>" + d.coreforme +'</span> '; }
	if (d.r1forme){res = res + d.r1forme +' '; }
	if (d.r2forme){res = res + d.r2forme +' '; }
	if (d.r3forme){res = res + d.r3forme +' '; }
	if (d.r4forme){res = res + d.r4forme +' '; }
	if (d.r5forme){res = res + d.r5forme +' '; }
	res2 = res.replace("\\",'');
	res3 = res2.replace("[<>]",'');
	return res3 + '...';

}

/////////////////////// back
// temporal view of variantes and concurrents
function get_words_freq(neo,callback) 
{
   
    	console.log(neo);
		d3.json("./php/db_access2.php?action=words_freq&id="+neo.id, function(error, data) {
        	console.log(data);
        	console.log(error);
        	count = data.length;
        	console.log(count);
        	if (count == 0){
            	callback("Il n'y a pas de données disponibles pour ce terme.");
            }
            else{
	            callback(count);
	            build_neo_info_dglf(data);
	        }
        	
        });    
    
}
function get_word_info_dglf(neo,callback) 
{
    	console.log(neo);
		d3.json("./php/db_access2.php?action=words&id="+neo.id, function(error, data) {
        	console.log(data);
        	console.log(error);
        	count = data.length;
        	console.log(count);
        	if (count == 0){
            	callback("Il n'y a pas d'autres termes associés.");
            }
            else{
	            //callback(count);
	            //build_neo_info_bnf(data);
	            tbody='';
	            tbody2='';
	            termCBNF = 0;
	            termCNeo = 0;
	            concCBNF = 0;
	            concCNeo = 0;
	            div = '<div>' + count + ' termes associés</div>';
	        	var thead = '<thead><tr><th scope="col">Terme</th><th scope="col">Statut</th><th scope="col">Fréquence BNF</th><th scope="col">Fréquence Néoveille</th><th scope="col">Date dernière mise à jour</th></tr></thead>';
	        	for (var i = 0; i < data.length; i++) {
	        		if ($.inArray(data[i].statut, ['néologisme','variante-N'])>-1 ){//
	        		termCBNF += parseInt(data[i].freq_bnf);
	            	termCNeo +=parseInt(data[i].freq_neoveille);
	        		tbody += '<tr  class="bg-success"><td scope="row">' + data[i].forme + '</td><td>' + data[i].statut + '</td><td>' + data[i].freq_bnf+ '</td><td>' + data[i].freq_neoveille+ '</td><td>' + data[i].last_update+ '</td></tr>'
					}
					else{//
	        		concCBNF += parseInt(data[i].freq_bnf);
	            	concCNeo +=parseInt(data[i].freq_neoveille);
	        		tbody2 += '<tr class="bg-warning"><td scope="row">' + data[i].forme + '</td><td>' + data[i].statut + '</td><td>' + data[i].freq_bnf+ '</td><td>' + data[i].freq_neoveille+ '</td><td>' + data[i].last_update+ '</td></tr>'
					}
        		}
        		tbody += '<tr  class="bg-success"><td scope="row"><b>Total</b></td><td></td><td><b>' + termCBNF+ '</b></td><td><b>' + termCNeo+ '</b></td><td></td></tr>'
        		tbody2 += '<tr  class="bg-warning"><td scope="row"><b>Total</b></td><td></td><td><b>' + concCBNF+ '</b></td><td><b>' + concCNeo+ '</b></td><td></td></tr>'
        		//tbody = '<tr><td>' + varN.join('<br/>') + '</td><td>' + conc.join('<br/>') + '</td><td>' + varC.join('<br/>') + '</td></tr>';
            	restable = '<table><tr><td style="text-align:center"><b>Termes préconisés</b></td><td></td><td style="text-align:center"><b>Termes concurrents</b></td></tr><tr><td width="50%" style="vertical-align:top"><table class="table table-striped"  style="border-collapse:collapse;border:1px solid;background-color:#87CEEB">' + thead +'<tbody>' + tbody + '</tbody></table></td><td></td>'
            	+ '<td width="50%"  style="vertical-align:top"><table class="table table-striped" style="border-collapse:collapse;border:1px solid;">' + thead +'<tbody>'+ tbody2 + '</tbody></table></td></tr></table>';
            	callback(restable);
	        }
        });    
    
}

// call in case of ajax success : build the graphs for dglf
function build_neo_info_dglf(jsondata){
lang='fr';
console.log(jsondata[0]);

/********************* GET THE JSON DATA AND TRANSFORM WHEN NECESSARY ***********/
  // format our data : dateS,source,link,subject,subject2, neologisms
  
  
  var dtgFormat = d3.time.format("%Y-%m-%d");
  var dtgFormat2 = d3.time.format("%a %e %b %H:%M");
  
  jsondata.forEach(function(d) { 
    	d.dtg   = dtgFormat.parse(d.date);
    	d.term =  d.statut == 'néologisme' ? 1 : 0;
        d.varterm = d.statut == 'variante-N' ? 1 : 0;
        d.conc = d.statut == 'concurrent' ? 1 : 0;
        d.varconc = d.statut == 'variante-C' ? 1 : 0;
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



/***************************** FORM ROW BAR CHART ***********************/

var neoChart = dc.rowChart("#dc-neo-chart"+lang);

// neologismes dimensions : attention buggy as field = array!!!
var neoDim = facts.dimension(function(d){ return d.lexie;});
var neoGroup = neoDim.group().reduceCount(function(d) { return d.lexie; });


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
            .rowsCap(15)
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
/***************************** STATUT ROW BAR CHART ***********************/

var newspaperChart = dc.rowChart("#dc-newspaper-chart"+lang);
//var newspaperChartLow = dc.rowChart("#dc-newspaper-chart-low");

//  newspaperchart dimensions (with a fake group to keep just top and bottom 15
    var newspaperDimension = facts.dimension(function (d) { return d.statut; });
    var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.statut; });
    

	
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




/***************************** TIMELINE ***********************/
// see http://dc-js.github.io/dc.js/docs/html/dc.lineChart.html

// Create the dc.js chart objects & link to div
var timeChart = dc.lineChart("#dc-time-chart"+lang);
var periodChart = dc.barChart("#range-chart"+lang);
var periodChart2 = dc.barChart("#range2-chart"+lang);
var timecompchart = dc.compositeChart('#dc-timecomp-chart'+lang);


// create timeline chart dimensions
	var volumeByDay = facts.dimension(function(d) {
    return d3.time.day(d.dtg);
  });
	var volumeByMonth = facts.dimension(function(d) {
    return d3.time.month(d.dtg);
  });

var dim  = facts.dimension(dc.pluck('dtg')),

grp1 = volumeByMonth.group().reduceSum(dc.pluck('term')),
grp2 = volumeByMonth.group().reduceSum(dc.pluck('varterm'));
grp3 = volumeByMonth.group().reduceSum(dc.pluck('conc')),
grp4 = volumeByMonth.group().reduceSum(dc.pluck('varconc'));

  var volumeByDayGroup = volumeByDay.group()
    .reduceCount(function(d) { return d.dtg; });
    console.log("Day groups :" + volumeByDayGroup.size());

  var volumeByMonthGroup = volumeByMonth.group()
    .reduceCount(function(d) { return d.dtg; });
	console.log("Month groups :" + volumeByMonthGroup.size());



// build stacked groups for display by status
function reduceAdd(p, v) {
    //console.log(v);
    ++p.count;
    p.term += v.term ;
    p.varterm += v.varterm;
    p.conc += v.conc;
    p.varconc += v.varconc;
//    p.term += v.statut == "néologisme" ? 1 : 0;
//    p.varterm += v.statut == "variante-N" ? 1 : 0;
//    p.conc += v.statut == "concurrent" ? 1 : 0;
//    p.varconc += v.statut == "variante-C" ? 1 : 0;
    return p;
}
function reduceRemove(p, v) {
    --p.count;
    p.term -= v.term ;
    p.varterm -= v.varterm;
    p.conc -= v.conc;
    p.varconc -= v.varconc;
//    p.term -= v.statut == "néologisme" ? 1 : 0;
//    p.varterm -= v.statut == "variante-N" ? 1 : 0;
//    p.conc -= v.statut == "concurrent" ? 1 : 0;
//    p.varconc -= v.statut == "variante-C" ? 1 : 0;
    return p;
}

function reduceInitial() {
    return {count: 0, term: 0,varterm:0,conc:0,varconc:0};
}
var dateGroup = volumeByMonth.group().reduce(reduceAdd,reduceRemove,reduceInitial);

    
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
    .renderArea(true)
    .dimension(volumeByMonth)
    .group(dateGroup)
    .valueAccessor(function (p) { return p.value.term; })
    //.valueAccessor(function (p) { return p.value.varterm; })
    //.valueAccessor(function (p) { return p.value.conc; })
    //.valueAccessor(function (p) { return p.value.varconc; })
    //.stack(dateGroup, "terme", function(p){return p.value.term;})
    .stack(dateGroup, "variantes terme", function(p){return p.value.varterm;})
    .stack(dateGroup, "Concurrents", function(p){return p.value.conc;})
    .stack(dateGroup, "Variantes concurrent", function(p){return p.value.varconc;})
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
    //.turnOnControls(true)
    .renderHorizontalGridLines(true)    
    //.turnOnControls(true)
    //.controlsUseVisibility(true)
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(400).itemHeight(13).gap(1).horizontal(10).legendWidth(540).itemWidth(210))
    .legend(dc.legend().x(50).y(30))
    .xAxis();

  // setup timeline graph
  timecompchart
  	//.width(700)
    .height(300)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    //.dotRadius(5) 
    //.renderArea(true)
    //.dimension(volumeByMonth)
    //.group(dateGroup)
    .transitionDuration(500)
    .mouseZoomable(true)
    .brushOn(false)
    .compose ([
      dc.lineChart(timecompchart)
         .dimension(dim)
         .colors('black')
         .group(grp1, "Terme"),
         //.dashStyle([2,2]),
      dc.lineChart(timecompchart)
         .dimension(dim)
         .colors('blue')
         .group(grp2, "Variantes terme"),
      dc.lineChart(timecompchart)
         .dimension(dim)
         .colors('red')
         .group(grp3, "Concurrent"),
      dc.lineChart(timecompchart)
         .dimension(dim)
         .colors('orange')
         .group(grp4, "Variantes concurrent"),
   ])

    //.renderDataPoints({radius: 3, fillOpacity: 0.8, strokeOpacity: 0.8})
    //.title(function(d){
    //  return dtgFormat2(d.key)
    //  + "\nTotal : " + d.value;
    //  })
    .elasticY(true)
    .rangeChart(periodChart)
    .xUnits(d3.time.day)
    //.turnOnControls(true)
    .renderHorizontalGridLines(true)    
    //.turnOnControls(true)
    //.controlsUseVisibility(true)
    .x(d3.time.scale().domain([minDate, maxDate]))
    //.legend(dc.legend().x(400).itemHeight(13).gap(1).horizontal(10).legendWidth(540).itemWidth(210))
    .legend(dc.legend().x(50).y(30))
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

periodChart2 /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
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
      function(d) { return d.lexie; },
      function(d) { return d.statut; }
     // function(d) {
     //       var context = "... " + d.G5_forme + " " + d.G4_forme + " " +d.G3_forme + " " +d.G2_forme + " " +d.G1_forme + " " + " <span style='background-color: #ffa366'>" + d.lexie  + "</span>" + " " + d.D1_forme + " " +d.D2_forme + " " +d.D3_forme + " " +d.D4_forme + " " +d.D5_forme 
     //       + '...<a title=\"Voir l\'article complet\" href=\"' 
     // 	+ d.url + '" target="_blank"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></a>';
     // 	return context;
     // },
      
    ])
    .sortBy(function(d){ return d.date; })
    .order(d3.descending);
    //console.log(dataTableDC);


    
console.log("Datatable chart built");
console.log(timeDimension);






/***************************** RENDER ALL THE CHARTS  ***********************/

    // Render the Charts
  	dc.renderAll(); 

}





// BNF
function get_neologism_stat_bnf(neo,callback) 
{
   
    	console.log(neo);
		d3.json("./php/db_access.php?id="+neo.id, function(error, data) {
        	console.log(data);
        	console.log(error);
        	count = data.length;
        	console.log(count);
        	if (count == 0){
            	callback("Il n'y a pas de données disponibles pour ce néologisme.");
            }
            else{
	            callback(count);
	            build_neo_info_bnf(data);
	        }
        	
        });    
    
}


// call in case of ajax success : build the graphs for BNF
function build_neo_info_bnf(jsondata){
lang='fr';
console.log(jsondata[0]);

/********************* GET THE JSON DATA AND TRANSFORM WHEN NECESSARY ***********/
  // format our data : dateS,source,link,subject,subject2, neologisms
  
  
  var dtgFormat = d3.time.format("%Y-%m-%d");
  var dtgFormat2 = d3.time.format("%a %e %b %H:%M");
  
  jsondata.forEach(function(d) { 
    	d.dtg   = dtgFormat.parse(d.date);
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
    //.turnOnControls(true)
    .renderHorizontalGridLines(true)    
    //.turnOnControls(true)
    //.controlsUseVisibility(true)
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

/***************************** FORM (POS) ROW BAR CHART ***********************/

var neoChart = dc.rowChart("#dc-neo-chart"+lang);

// neologismes dimensions : attention buggy as field = array!!!
var neoDim = facts.dimension(function(d){ return d.pos;});
var neoGroup = neoDim.group().reduceCount(function(d) { return d.pos; });


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
            .rowsCap(15)
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
/***************************** NEWSPAPER ROW BAR CHART ***********************/

var newspaperChart = dc.rowChart("#dc-newspaper-chart"+lang);
//var newspaperChartLow = dc.rowChart("#dc-newspaper-chart-low");

//  newspaperchart dimensions (with a fake group to keep just top and bottom 15
    var newspaperDimension = facts.dimension(function (d) { return d.domain; });
    var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.domain; });
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

  /// render the datatable
    dataTableDC
//    .width(960).height(800)
    .dimension(timeDimension)
	.group(function(d) { return ""})
	//.size(10)
	.turnOnControls(true)
    .controlsUseVisibility(true)
    .columns([
      function(d) { return d.domain; },
      function(d) { return d.date; },
      function(d) { return d.title; },
      function(d) {
            var context = "... " + d.G5_forme + " " + d.G4_forme + " " +d.G3_forme + " " +d.G2_forme + " " +d.G1_forme + " " + " <span style='background-color: #ffa366'>" + d.lexie  + "</span>" + " " + d.D1_forme + " " +d.D2_forme + " " +d.D3_forme + " " +d.D4_forme + " " +d.D5_forme 
            + '...<a title=\"Voir l\'article complet\" href=\"' 
      	+ d.url + '" target="_blank"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></a>';
      	return context;
      },
      
    ])
    .sortBy(function(d){ return d.date; })
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
        url:'http://localhost:8983/solr/' + langues[editor.lang] + '/select',
//        url:'http://tal.lipn.univ-paris13.fr/solr/' + langues[editor.lang] + '/select',
        data:{  q: '"'+d.forme+'"',
        		rows:50,
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

function highlight_neo(text, neo,rawquery){
	
	if (neo.indexOf('-')> -1){
	  neo = neo.replace(/-/g,'.?');
//	  rawquery = rawquery.replace(/^.+\((.+?) .+$/,"$1");
	  rawquery = rawquery.replace(/-/g,'.');
	  console.log(neo);
	  console.log(rawquery);
	}
	var nbmatch = 0;
	// with exact neo form
	regexpstr = '(.{0,70})(\\b' + neo.toString() + ")(.{0,70})";
	console.log(regexpstr);
	var regexp = new RegExp( regexpstr, 'gi');
	//console.log(text);
	//console.log(typeof text);
	//console.log(regexp);
	//console.log(typeof regexp)
	match = text.match(regexp);
	var res = ''
	// with rawquery
	if (match == null){
		regexpstr = '(.{0,70})(\\b' + rawquery.toString() + ")(.{0,70})";
		console.log(regexpstr);
		var regexp = new RegExp( regexpstr, 'gi');
		//console.log(text);
		//console.log(typeof text);
		//console.log(regexp);
		//console.log(typeof regexp)
		while ((match = regexp.exec(text))!== null){
			nbmatch = nbmatch + 1;
			res = res + "<br/>..." + match[1] + "<span style='background-color: #ffa366'>" + match[2] + "</span>" + match[3] + "...";
			//match = regexp.exec(text);
		}	

	}
	else {
		while ((match = regexp.exec(text))!= null){
			nbmatch = nbmatch + 1;
			res = res + "<br/>..." + match[1] + "<span style='background-color: #FFFF00'>" + match[2] + "</span>" + match[3] + "...";
			//match = regexp.exec(text);
		}	
	}
	console.log(res);
	console.log(nbmatch);
//	return res + "<br/>" + text;
	return [res,nbmatch];
}    

//contexts from bnf (simple html table, not used anymore)
function formatajax2(d,callback) 
{
		console.log(d);
		var langues = {'it':"rss_italian",'fr':"rss_french", 'pl':"RSS_polish", 'br':'RSS_brasilian', 'ch':'RSS_chinese', 'ru':'RSS_russian', 'cz':'RSS_czech', 'gr':'RSS_greek'};
		d3.json("./php/db_access.php?id="+d.id, function(error, data) {
        	console.log(data);
        	var thead = '<div>' + data.length + ' résultat(s)</div><th>Date</th><th>Source</th><th>Extrait</th>',  tbody = '';
            for (var key in data) 
            {
             	console.log(key);
                var contexte_G5 = String(data[key].G5_forme);
                //contexte_G5 = contexte_G5.replace(/^(.+)__.*$/,"$1");
                var contexte_G4 = String(data[key].G4_forme);
                //contexte_G4 = contexte_G4.replace(/^(.+)__.*$/,"$1");
                var contexte_G3 = String(data[key].G3_forme);
                //contexte_G3 = contexte_G3.replace(/^(.+)__.*$/,"$1");
                var contexte_G2 = String(data[key].G2_forme);
                //contexte_G2 = contexte_G2.replace(/^(.+)__.*$/,"$1");
                var contexte_G1 = String(data[key].G1_forme);
                //contexte_G1 = contexte_G1.replace(/^(.+)__.*$/,"$1");

				var core = String(data[key].lexie) +"/" + String(data[key].pos) + " ";
                //core = core.replace(/^(.+)__.*$/,"$1");
                
                var contexte_D5 = String(data[key].D5_forme);
                //contexte_D5 = contexte_D5.replace(/^(.+)__.*$/,"$1");
                var contexte_D4 = String(data[key].D4_forme);
                //contexte_D4 = contexte_D4.replace(/^(.+)__.*$/,"$1");
                var contexte_D3 = String(data[key].D3_forme);
                //contexte_D3 = contexte_D3.replace(/^(.+)__.*$/,"$1");
                var contexte_D2 = String(data[key].D2_forme);
                //contexte_D2 = contexte_D2.replace(/^(.+)__.*$/,"$1");
                var contexte_D1 = String(data[key].D1_forme);
                //contexte_D1 = contexte_D1.replace(/^(.+)__.*$/,"$1");
                var dateC = String(data[key].date);


                var context = contexte_G5 + " " + contexte_G4 + " "+ contexte_G3 + " " +contexte_G2 + " "+ contexte_G1 + " <span style='background-color: #ffa366'>" + core + "</span>" + "" + contexte_D1 + " " + contexte_D2 + " "+ contexte_D3 + " " +contexte_D4 + " "+ contexte_D5; 
                tbody += '<tr><td>' + dateC + '</td><td><a title="Voir la source" href="' + data[key].url + '" target="source">' + "lien" + '...</a></td><td>';
                //var cts = key.contents;
                //tbody += docs[key].contents ;
                tbody +=context;
                tbody += '</td></tr>';

            tbody += '</td></tr>';


            }
            restable = '<table width="100%">' + thead + tbody + '</table>';
            callback(restable);
        });
}



