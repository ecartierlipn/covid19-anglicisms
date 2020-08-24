jQuery.support.cors = true;

 
// fullscreen mode
/* 
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
*/

//var editor; // use a global for the submit and return data rendering in the examples
$(document).ready(function() {

//  enable scrolling in fullscreen mode
/*
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
*/

var editor = new $.fn.dataTable.Editor( {
		ajax : {url:"php/iate_concepts.php",type:"POST",dataType:"json"},
		table: "#example",
		lang:languageW,
		display: "envelope",
		fields: [ 
			{		
				label: "Concept Id",
				name: "id",
				type: "text",
			}, 
			{		
				label: "English Lexicalizations",
				name: "en_lexemes",
				type: "text",
			}, 
			{
				label: "English Definition",
				name: "en_def",
				type: "text"
			}
		]
	} );



// filtering input fields
    $('#example thead tr:eq(1) th').each( function (i) {
    	if ([0,1,2].includes(i))
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
		ajax: {url:"php/iate_concepts.php",type:"GET",dataType:"json"},
		lengthMenu: [[10, 25, 50, 100,  -1], [10, 25, 50, 100, "Tous"]],
		lengthChange: true,
		order: [[ 0, "asc" ]],
		select: {
            style:    'os',
            selector: 'td:first-child'
        },
		//responsive: true,
		"columnDefs": [
    		{ "width": "10%", "targets": 0 },
    		{ "width": "25%", "targets": 1 },
    		{ "width": "60%", "targets": 2 }
  		],   
		columns: [
			{
				data: "id",
				render: function (d) {
				//console.log(d);
				return '<u><a title="Go to IATE webpage for this entry" href="https://iate.europa.eu/entry/result/' + d + '" target=new">' + d + '</a></u>'; }

			}, // , className: 'editable' 
			{data: "en_lexemes"},
			{data: "en_def"},
			// events buttons : (all) details, concept_domains, concept_relations, concept_lexemes

			{
					// details of info
        	        className:      'concept_details',
            	    orderable:      false,
                	data:           null,
                	defaultContent: '',
                	render: function(){return '<i title="Concept Details" class="fa fa-info-circle fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';}

            },
			{
                className:      'concept_lexemes',
                orderable:      false,
                data:           null,
                defaultContent: '',
                render: function(){return '<i title="Show / Edit Lexemes" class="fa fa-plus-circle fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';}
				
            },
			{
                className:      'concept_relations',
                orderable:      false,
                data:           null,
                defaultContent: '',
                render: function(){
                	return '<i title="Show / Edit Concept Relations" class="fa fa-sitemap fa-lg green" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';
                }
				
            },
			{
					// neoveille search visual
        	        className:      'details-corpus',
            	    orderable:      false,
                	data:           null,
                	defaultContent: '',
                	render: function(){return '<i title="Search in JSI corpora and analyze" class="fa fa-bar-chart fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';}

            }
		],
		buttons: [
			{ extend: "create", editor: editor },
			{ extend: "edit", editor: editor },
			{ extend: "remove",   editor: editor },
			{ extend: "colvis", editor: editor, text:"Show/Hide Columns" , columns: ':lt(9)'},
			{	extend: 'collection',
                text: 'Export',
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
			
		]
		
	} );
	

//concepts lexicalizations

$('#example tbody').on('click', 'td.concept_lexemes', function () {
	var td = $(this)
	console.log(td);
    var tr = $(this).closest('tr');
    var row = table.row( tr );
 
//    if ( row.child.isShown() ) {
    if ( td.children('i').hasClass('fa-minus-circle') ) {
        // This row is already open - close it
        //destroyChild(row);
        row.child.remove();
        td.empty().append('<i  title="Show / Edit Lexicalizations" class="fa fa-plus-circle fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>')
    }
    else {
        // Open this row
        createChild(row); // class is for background colour , 'child-table'
        //tr.addClass('shown');
        td.empty().append('<i  title="Show / Edit Lexicalizations" class="fa fa-minus-circle fa-lg" aria-hidden="true" style="color:red;cursor: pointer;"></i>')
        
    }
} );


function createChild ( row ) {
    // This is the table we'll convert into a DataTable
    var childtable = $('<table class="display table-bordered" width="100%" id="table_rels"/>');
 
    // Display it in the child row
    row.child( childtable ).show();
 
	// editor
	var rowData = row.data();
	console.log('Row data : ', rowData);
	var usersEditor = new $.fn.dataTable.Editor( {
    ajax: {
        url: 'php/iate_concepts_lexicalizations.php',
        data: function ( d ) {
            d.id_concept = rowData.id;
            console.log("parameter : ", d);          
        }
    },
    table: childtable,
    fields: [ 
    	{
            label: "Concept Id",
            name: "lexemes.id_concept",
            def:rowData.id
        }, 
    	{
            label: "Lexeme",
            name: "lexemes.value"
        }, 
    	{
            label: "Language",
            name: "lexemes.lang",
            type:"select"          
        }, 
    	{
            label: "Status",
            name: "lexemes.type",
            type:"select"
        }, 
    	{
            label: "IATE Context",
            name: "lexemes.context"            
        }
    ]
} ); 

 	usersEditor.field( 'lexemes.id_concept' ).disable().val(rowData.id);

    // DataTable
	var usersTable = childtable.DataTable( {
    dom: 'Bfrltip',
    pageLength: 10,
	//fixedHeader: true,
	//scrollY: '200vh',
    //scrollCollapse: true,
	"columnDefs": [
    		{ "width": "10%", "targets": 0 },
    		{ "width": "10%", "targets": 1 },
    		{ "width": "10%", "targets": 2 },
    		{ "width": "68%", "targets": 3 },
    		{ "width": "2%", "targets": 4 }
  	],   
    ajax: {
        url: 'php/iate_concepts_lexicalizations.php',
        type: 'post',
        data: function ( d ) {
            d.id_concept = rowData.id;
        }
    },
    columns: [
		{title: "Lexeme",data: "lexemes.value"}, 
		{title: "Language", data: "languages.label", editField: "lexemes.lang", 
          	name: "lexemes.lang", 
          	render: function ( data, type, row, meta) {return data + ' (' + row.lexemes.lang + ')';}
          }, 
        {title:"Status", data: "lexemes_types.label", editField: "lexemes.type", 
          name: "lexemes.type", 
          render: function ( data, type, row, meta) {return data;}
		},
		{title: "IATE Context",data: "lexemes.context"},
        {
		// JSI search
          	className:      'jsi-search',
        	orderable:      false,
            data:           null,
            defaultContent: '',
            render: function(){return '<i title="Search in JSI corpora" class="fa fa-search-plus fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';}
        }		
    ],
    select: true,
    buttons: [
        { extend: 'create', editor: usersEditor },
        { extend: 'edit',   editor: usersEditor },
        { extend: 'remove', editor: usersEditor }
    ]
    
} );

 /*	$('#table_rels').on( 'click', 'tbody td', function (e) {
        usersEditor.inline(this, {submitOnBlur: 'true'} );
    } );*/

	// insert lexie2 info into borrowings_description (if not already there)
	usersEditor.on( 'submitSuccess', function (e, json, data, action) {
    	console.log(json); 
    	console.log(data);
    	console.log(action);
    	// get json.borrowings_relations.word_lexie2,lang_lexie2,morph_lexie2 and insert ignore into borrowings_description
    /*	if (action == 'create'){
    		var request= $.ajax({
        		url :'php/db_access.php',
        		data:{	action:'insertlexeme',
        			word: data.lexemes.value,
        			concept: data.lexemes.id_concept,
        			lang:data.lexemes.lang,
        			type:data.lexemes.type,
        			context:data.lexemes.context
        		},
       	 		type:'POST',
        		success: function( result) {
        			console.log(result);
    			},
        		error: function (request) {
            		console.log("Error : " + request.status + ". Response : " +  request.statusText);
        		}
    		});
    	} */
    	$("table", row.child()).DataTable().ajax.reload();
	} );
	
	//console.log("childtable", childtable);
}

/// END OF Lexical relations


//concepts relations

$('#example tbody').on('click', 'td.concept_relations', function () {
	var td = $(this)
	console.log(td);
    var tr = $(this).closest('tr');
    var row = table.row( tr );
 
//    if ( row.child.isShown() ) {
    if ( td.children('i').hasClass('red') ) {
        // This row is already open - close it
        //destroyChild(row);
        row.child.remove();
        td.empty().append('<i title="Show / Edit Concept Relations" class="fa fa-sitemap fa-lg green" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>')
    }
    else {
        // Open this row
        createChild2(row); // class is for background colour , 'child-table'
        //tr.addClass('shown');
        td.empty().append('<i title="Show / Edit Concept Relations" class="fa fa-sitemap fa-lg red" aria-hidden="true" style="color:red;cursor: pointer;"></i>')
        
    }
} );

function createChild2 ( row ) {

// should be stored in iate.db
relations = {12:'is part of',6:'has as part',13:'is predecessor of',0:'is antonym of',1:'is narrower than',15:'is successor of',11:'is broader than',14:'is related to',16:'is not to be confused with'};

relations_select = [	{label:'is part of', value:12},
				{value:6,label:'has as part'},
				{value:13,label:'is predecessor of'},
				{value:0,label:'is antonym of'},
				{value:1,label:'is narrower than'},
				{value:15,label:'is successor of'},
				{value:11,label:'is broader than'},
				{value:14,label:'is related to'},
				{value:16,label:'is not to be confused with'}
			]

    // This is the table we'll convert into a DataTable
    var childtable2 = $('<table class="display table-bordered" width="100%" id="table_rels"/>');
 
    // Display it in the child row
    row.child( childtable2 ).show();
 
	// editor
	var rowData = row.data();
	console.log('Row data : ', rowData);
	var usersEditor2 = new $.fn.dataTable.Editor( {
    ajax: {
        url: 'php/iate_concepts_relations.php',
        data: function ( d ) {
            d.id_concept = rowData.id;
            console.log("parameter : ", d);          
        }
    },
    table: childtable2,
    fields: [ 
    	{
            label: "Source Concept",
            name: "concepts_relations.id_concept1",
            def:rowData.id
        }, 
    	{
            label: "Relation",
            name: "concepts_relations.relation" ,
            type: 'select',
            options : relations_select          
        }, 
    	{
            label: "Target Concept",
            name: "concepts_relations.id_concept2"
        }, 
    	{
            label: "English Lexicalizations",
            name: "c2.en_lexemes"
        }

    ]
} ); 

 	usersEditor2.field( 'concepts_relations.id_concept1' ).disable().val(rowData.id);

    // DataTable
	var usersTable2 = childtable2.DataTable( {
    dom: 'Bfrltip',
    pageLength: 10,
	//fixedHeader: true,
	//scrollY: '200vh',
    //scrollCollapse: true,
	"columnDefs": [
    		{ "width": "10%", "targets": 0 },
    		{ "width": "15%", "targets": 1 },
    		{ "width": "10%", "targets": 2 },
    		{ "width": "50%", "targets": 3 },
    		{ "width": "5%", "targets": 4 }
  	],   
    ajax: {
        url: 'php/iate_concepts_relations.php',
        type: 'post',
        data: function ( d ) {
            d.id_concept = rowData.id;
            
        }
    },
    columns: [
    	{
            title: "Source Concept",
            data: "concepts_relations.id_concept1"

        }, 
    	{
            title: "Relation",
            data: "concepts_relations.relation",            
            render : function(d) { return relations[d]; }
        }, 
    	{
            title: "Target Concept",
            data: "concepts_relations.id_concept2",
            render : function(d) { return '<u><a title="Go to IATE webpage for this entry" href="https://iate.europa.eu/entry/result/' + d + '" target=new">' + d + '</a></u>'; }
        }, 
    	{
            title: "English Lexicalizations",
            data: "c2.en_lexemes"
        },
        {
		// JSI search
          	className:      'jsi-search',
        	orderable:      false,
            data:           null,
            defaultContent: '',
            render: function(){return '<i title="Search in JSI corpora" class="fa fa-search-plus fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>';}
        }		
    ],
    select: true,
    buttons: [
        { extend: 'create', editor: usersEditor2 },
        { extend: 'edit',   editor: usersEditor2 },
        { extend: 'remove', editor: usersEditor2 }
    ]
    
} );

 /*	$('#table_rels').on( 'click', 'tbody td', function (e) {
        usersEditor.inline(this, {submitOnBlur: 'true'} );
    } );*/

	// insert lexie2 info into borrowings_description (if not already there)
	usersEditor2.on( 'submitSuccess', function (e, json, data, action) {
    	console.log(json); 
    	console.log(data);
    	console.log(action);
    	// get json.borrowings_relations.word_lexie2,lang_lexie2,morph_lexie2 and insert ignore into borrowings_description
    /*	if (action == 'create'){
    		var request= $.ajax({
        		url :'php/db_access.php',
        		data:{	action:'insertlexeme',
        			word: data.lexemes.value,
        			concept: data.lexemes.id_concept,
        			lang:data.lexemes.lang,
        			type:data.lexemes.type,
        			context:data.lexemes.context
        		},
       	 		type:'POST',
        		success: function( result) {
        			console.log(result);
    			},
        		error: function (request) {
            		console.log("Error : " + request.status + ". Response : " +  request.statusText);
        		}
    		});
    	} */
    	$("table", row.child()).DataTable().ajax.reload();
	} );
	
	//console.log("childtable", childtable);
}

/// END OF concept relations



// interactive visualization of retrieved contexts from jsi contexts (in json file) for concept id (generated from apache solr every day)
// with fullscreen mode)
// JSI
// interactive visualization of retrieved contexts from JSI for given word
$('#example tbody').on('click', 'td.details-corpus', function () {
		var td = $(this);
        var tr = $(this).closest('tr');
        var row = table.row( tr );

       if ( td.children('i').hasClass('close') ) {
            // This row is already open - close it
            row.child.hide();
            td.empty().append('<i title="Search in JSI corpora and analyze" class="fa fa-bar-chart fa-lg open" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>')

        }
        else {
            // Open this row
            console.log(row.data())
            $.blockUI(); 
            get_neo_info_jsondata(row.data(), function(data) // from mysql
            {
	            //alert(data)
    	        data2 = '<div class="alert alert-info" id="jsi-word-info">' + data + '</div>'
    	        row.child(  data2 ).show();
            	if (data.startsWith('R')){
        			$('#modal_view .modal-title').html("<b>Data exploration for concept id</b> : " + row.data().id + '<br/><b>English Lexemes</b> : ' + row.data().en_lexemes + '<br/><b>English definition</b> : ' + row.data().en_def + ')');
		        	$('#neoResultsfr #jsi-word-info').remove();
		        	$('#neoResultsfr').prepend(data2);
		        	$('#neoResultsfr').appendTo($('#modal_view .modal-body')); 
	      			$('#modal_view').modal('show');
		        	$("#neoResultsfr").show();
				}
				else{
					row.child(  data2 ).show();
				}


        		td.empty().append('<i title="Search in JSI corpora and analyze" class="fa fa-bar-chart fa-lg close" aria-hidden="true" style="color:red;cursor: pointer;"></i>')
        		$.unblockUI();
            }
            );
        }
    } );

/// interactive visualization of data with contexts analyzed (in db)
// get info from mysql
function get_neo_info_jsondata(neo,callback) 
{
    	//console.log(data);
    	id_concept = neo.id
    	console.log(id_concept);
		var url ="php/db_access_sqlite.php?action=concept_contexts&concept=" + id_concept;
        var request= $.ajax({
        	url :url,
        	type: 'get',
        	dataType: 'JSON',
        	//async:false,
        	success: function( data) {
        		console.log("data : ")
        		//console.log(data)
        		console.log(data[0]);
        		if ($.type(data) === "string"){
            		callback(data);
            		return;
        		}
        		else {
        			count = data.length;
        			console.log(count);
            		message = "Result : " + count.toString() + " contexts for this concept in the Timestamped JSI web corpus 2014-2019. You can download the json raw data here : <a href='./data/id_concept/" + id_concept + ".json' download target='_new'><i class='fa fa-download' aria-hidden='true'></i></a>";				
					callback(message);
	            	build_neo_contexts_viz2(data,'fr');
				}
    		},
        	error: function (request) {
            	alert("Error : " + request.status + ". Response : " +  request.statusText);
            	restable= '<div>Problem :'+ request.status + ". Response : " +  request.statusText + '</div>';
            	callback(restable)
        	}
    });

}

function build_neo_contexts_viz2(jsondata,lang){

console.log("result example");
//console.log(get_contexts(jsondata[0]["pos-text"][0], query));
console.log(jsondata[0]);
//console.log(docshl);

 var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%SZ");
 
jsondata.forEach(function(d) { 
  		//console.log(typeof d.oov);
    	d.dtg   = dtgFormat.parse(d.date);    	
    	d.oov = d.oov[0].replace(/_/g, ' ').toLowerCase(); 
    	if (d.country=='United States'){d.country='USA';} 
    	d.l1forme='';  	
    	d.l2forme='';  	
    	d.l3forme='';  	
    	d.l4forme='';  	
    	d.l5forme='';  	
    	d.r1forme='';  	
    	d.r2forme='';  	
    	d.r3forme='';  	
    	d.r4forme='';  	
    	d.r5forme='';  	
    	d.l1pos='';  	
    	d.l2pos='';  	
    	d.l3pos='';  	
    	d.l4pos='';  	
    	d.l5pos='';  	
    	d.r1pos='';  	
    	d.r2pos='';  	
    	d.r3pos='';  	
    	d.r4pos='';  	
    	d.r5pos=''; 
    	d.l1lemma='';  	
    	d.l2lemma='';  	
    	d.l3lemma='';  	
    	d.l4lemma='';  	
    	d.l5lemma='';  	
    	d.r1lemma='';  	
    	d.r2lemma='';  	
    	d.r3lemma='';  	
    	d.r4lemma='';  	
    	d.r5lemma='';  	
 	
  });


  
console.log(jsondata[1]);
console.log("Data Loaded");

/*console.log(countries);
console.log(subjects);
console.log(sources);*/

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
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> contexts' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All contexts selected. Please click on graphs to filter and interact.'
        });
  
totalCount2 = dc.dataCount('.dc-data-count2'+lang);
totalCount2 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> contexts' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All contexts selected. Please click on graphs to filter and interact.'
        });
  

  
console.log("Count chart built"); 		   
console.log(totalCount);
/***************************** NEOPOS ROW BAR CHART ***********************/
var neoChart = dc.rowChart("#dc-neo-chartfr");
var neoDim = facts.dimension(function(d){ return d.oov;});
var neoGroup = neoDim.group().reduceCount(function(d) { return d.oov; });
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
var subjectChart = dc.rowChart("#dc-subject-chartfr");
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
        
console.log("lang bar chart built");
//console.log(subjectChart);


/***************************** COUNTRY ROW BAR CHART ***********************/

var countryChart = dc.rowChart("#dc-country-chartfr");
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

var newspaperChart = dc.rowChart("#dc-newspaper-chartfr");
var newspaperDimension = facts.dimension(function (d) { return d.source; });
var newspaperGroup = newspaperDimension.group().reduceCount(function (d) { return d.source; });
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
var timeChart = dc.lineChart("#dc-time-chartfr");
var periodChart = dc.barChart("#range-chartfr");

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

	//width = $("#dc-time-chartfr").width()
	//alert(width);
  // setup timeline graph
  timeChart
  	//.width('100%')
   .height(250)
   .width($(window).width()-100)
   //.useViewBoxResizing(true)
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .dotRadius(5) //
    //.renderArea(true)
    .dimension(volumeByDay)
    .group(volumeByDayGroup)
    .transitionDuration(500)
    .mouseZoomable(false)    
    .brushOn(false)
    .renderDataPoints({radius: 2, fillOpacity: 0.8, strokeOpacity: 0.8})
    .title(function(d){
      return dtgFormat(d.key)
      + "\nTotal : " + d.value;
      })
    .elasticY(true)
    //.elasticX(true)
    .rangeChart(periodChart)
    .xUnits(d3.time.day)
    //.curve(d3.curveBasisOpen) //d3 > 3
    .interpolate('linear') // 'linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 
    //'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', and 'monotone'.
    .renderHorizontalGridLines(true)    
    .x(d3.time.scale().domain([minDate, maxDate]))
    .xAxis();


  
  console.log("Time chart built");
  console.log(timeChart);
  
/******************  range chart **************/
periodChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        //.width('100%')
        .height(100)
        .width($(window).width()-100)
        //.useViewBoxResizing(true)
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
var compositeChart = dc.compositeChart("#dc-comptime-chartfr");
var periodChart2 = dc.barChart("#range-chart2fr");

var volumeByDaycoreGroupTmp = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
    	//console.log("reduceAdd : p : ");
    	//console.log(p);
    	//console.log("reduceAdd : v : ");
    	//console.log(v);
        p[v.oov] = (p[v.oov] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.oov] -= 1; // for sum v.value
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
            	.elasticY(true)
            	.elasticX(true)
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
    .width($(window).width()*0.75)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
    .mouseZoomable(false)
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
        .elasticY(true)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .alwaysUseRounding(true)
        .xUnits(d3.time.month);


/********************* composite chart by domain ***********/
// Composite chart
var compositeChart2 = dc.compositeChart("#dc-comptimedomain-chartfr");
var periodChart3 = dc.barChart("#range-chart3fr");

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
    .width($(window).width()*0.75)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
    .mouseZoomable(false)
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
var compositeChart7 = dc.compositeChart("#dc-comptimecountry-chartfr");
var periodChart7 = dc.barChart("#range-chart7fr");

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
    .width($(window).width()*0.75)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
    .mouseZoomable(false)
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
var compositeChart3 = dc.compositeChart("#dc-comptimenews-chartfr");
var periodChart4 = dc.barChart("#range-chart4fr");

var volumeByDaycoreGroupTmp3 = volumeByMonth.group().reduce(
    function reduceAdd(p, v) { // add
        p[v.source] = (p[v.source] || 0) + 1; //for sum : v.value
        return p;
    },
    function reduceRemove(p, v) { // remove
        p[v.source] -= 1; // for sum v.value
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
    .width($(window).width()*0.75)
    //.shareTitle(false)
    
    .margins({top: 10, right: 10, bottom: 30, left: 40})
    .transitionDuration(500)
    .mouseZoomable(false)
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
var coreformeChart = dc.rowChart("#dc-coreforme-chartfr");

//  coreformechart dimensions (with a fake group to keep just top and bottom 15
    var coreformeDimension = facts.dimension(function (d) { return d.oov; });
    var coreformeGroup = coreformeDimension.group().reduceCount(function (d) { return d.oov; });


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
var coreposChart = dc.rowChart("#dc-corepos-chartfr");

//  coreposchart dimensions (with a fake group to keep just top and bottom 15
    var coreposDimension = facts.dimension(function (d) { return d.oov; });
    var coreposGroup = coreposDimension.group().reduceCount(function (d) { return d.oov; });

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
var corelemmaChart = dc.rowChart("#dc-corelemma-chartfr");

//  corelemmachart dimensions (with a fake group to keep just top and bottom 15
    var corelemmaDimension = facts.dimension(function (d) { return d.oov; });
    var corelemmaGroup = corelemmaDimension.group().reduceCount(function (d) { return d.oov; });



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

var l1lemmaChart = dc.rowChart("#dc-l1lemma-chartfr");

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

var l2lemmaChart = dc.rowChart("#dc-l2lemma-chartfr");

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

var l3lemmaChart = dc.rowChart("#dc-l3lemma-chartfr");

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

var l4lemmaChart = dc.rowChart("#dc-l4lemma-chartfr");

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

var l5lemmaChart = dc.rowChart("#dc-l5lemma-chartfr");

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

var r1lemmaChart = dc.rowChart("#dc-r1lemma-chartfr");

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

var r2lemmaChart = dc.rowChart("#dc-r2lemma-chartfr");

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

var r3lemmaChart = dc.rowChart("#dc-r3lemma-chartfr");

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

var r4lemmaChart = dc.rowChart("#dc-r4lemma-chartfr");

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

var r5lemmaChart = dc.rowChart("#dc-r5lemma-chartfr");

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

var l1formeChart = dc.rowChart("#dc-l1forme-chartfr");

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

var l2formeChart = dc.rowChart("#dc-l2forme-chartfr");

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

var l3formeChart = dc.rowChart("#dc-l3forme-chartfr");

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

var l4formeChart = dc.rowChart("#dc-l4forme-chartfr");

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

var l5formeChart = dc.rowChart("#dc-l5forme-chartfr");

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

var r1formeChart = dc.rowChart("#dc-r1forme-chartfr");

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

var r2formeChart = dc.rowChart("#dc-r2forme-chartfr");

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

var r3formeChart = dc.rowChart("#dc-r3forme-chartfr");

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

var r4formeChart = dc.rowChart("#dc-r4forme-chartfr");

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

var r5formeChart = dc.rowChart("#dc-r5forme-chartfr");

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

var l1posChart = dc.rowChart("#dc-l1pos-chartfr");

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

var l2posChart = dc.rowChart("#dc-l2pos-chartfr");

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

var l3posChart = dc.rowChart("#dc-l3pos-chartfr");

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

var l4posChart = dc.rowChart("#dc-l4pos-chartfr");

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

var l5posChart = dc.rowChart("#dc-l5pos-chartfr");

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

var r1posChart = dc.rowChart("#dc-r1pos-chartfr");

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

var r2posChart = dc.rowChart("#dc-r2pos-chartfr");

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

var r3posChart = dc.rowChart("#dc-r3pos-chartfr");

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

var r4posChart = dc.rowChart("#dc-r4pos-chartfr");

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

var r5posChart = dc.rowChart("#dc-r5pos-chartfr");

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


/***************************** DATATABLE VIEW (tableview) ******************/
/*var tableview = dc.tableview("#dc-table-chart"+lang);
var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });
var timedimensiongrp = timeDimension.group();
console.log("Dimensions created");

    tableview
        .dimension(timeDimension)
        .group(timedimensiongrp)
        .size(10)
        .columns([
            { title: "Date", data:  function(d) { return d.date; }},
            { title: "Language", data: function(d) { return d.lang; } },
            { title: "Country", data: function(d) { return d.country;}},
            { title: "Source", data: function(d) { return '<a href=\"' + d.url + "\" target=\"_blank\">" +d.source+"</a>";} },
            { title: "Contextes", data: function(d) { return d.contents[0];}} 
        ])
        .enableColumnReordering(true)
        .enablePaging(true)
        .enablePagingSizeChange(true)
        .enableSearch(true)
        .enableScrolling(false)
        .rowId("Date")
        .responsive(true)
        .select(false)
        .fixedHeader(true)
        .buttons(["pdf", "csv", "excel", "print"])
        .pagingInfoText("_START_ - _END_ on _TOTAL_ articles")
        .listeners({
            rowDblClicked: function (row, data, index) {
            	alert("Sauvegarde de cet exemple dans la base de données (fonctionnalité à venir)" + JSON.stringify(data));
            }
        })
        ;*/
/********* DATATABLE from https://github.com/dc-js/dc.datatables.js/ ******************************/
/*
var nasdaqTable = dc_datatables.datatable("#dc-table-chart"+lang);
var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });
console.log("Dimensions created");


    nasdaqTable 
        .dimension(timeDimension)
        .group(function(d) { return ""})
        .columns([
            { label: "Date", type:'date', format:  function(d) { return d.date.substring(0,10); }},
            { label: "Language", type:'string', format: function(d) { return d.lang; } },
            { label: "Country", type:'string', format: function(d) { return d.country;}},
            { label: "Source", type:'string', format: function(d) { return '<u><a href=\"' + d.url + "\" target=\"_blank\">" +d.source+"</a></u>";} },
            { label: "Contextes", type:'string', format: function(d) { return d.contents[0];}} 
        ]);
*/
/***************************** DATATABLES CHART ***********************/

// sauvegarde version limitée datatables
var timeDimension = facts.dimension(function (d) {
    return d.dtg;
  });
var dataTableDC = dc.dataTable("#dc-table-chartfr");
dataTableDC
    .dimension(timeDimension)
	.group(function(d) { return ""})
	.turnOnControls(true)
	.size(Infinity)
    .controlsUseVisibility(true)
    .columns([
      function(d) { return d.date; },
      function(d) { return d.lang; },
      function(d) { return d.country; },
      function(d) { return '<a href=\"' + d.url + "\" target=\"_blank\">" +d.source+"</a>";},
      function(d) { return d.contents[0];},
    ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.descending)
    .on('preRender', update_offset)
    .on('preRedraw', update_offset)
    .on('pretransition', display);
    
console.log("Datatable chart built");
console.log(timeDimension);

// datatable paging
// use odd page size to show the effect better
var ofs = 0;
var pag = 25;
var defaultorder = 'descending';
var defaultsortfield = 'dtg';

function update_offset() {
          var totFilteredRecs = facts.groupAll().value();
          var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
          ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
          ofs = ofs < 0 ? 0 : ofs;

          dataTableDC.beginSlice(ofs);
          dataTableDC.endSlice(ofs+pag);
      }
function display() {
          var totFilteredRecs = facts.groupAll().value();
          var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
          d3.select('#begin')
              .text(end === 0? ofs : ofs + 1);
          d3.select('#end')
              .text(end);
          d3.select('#previous')
              .attr('disabled', ofs-pag<0 ? 'true' : null);
          d3.select('#next')
              .attr('disabled', ofs+pag>=totFilteredRecs ? 'true' : null);
          d3.select('#size').text(totFilteredRecs);
          if(totFilteredRecs != facts.size()){
            d3.select('#totalsize').text("(filtered Total: " + facts.size() + " )");
          }else{
            d3.select('#totalsize').text('');
          }
      }
function next() {
          ofs += pag;
          update_offset();
          dataTableDC.redraw();
      }
function previous() {
          ofs -= pag;
          update_offset();
          dataTableDC.redraw();
      }
$('#next').on('click', function () {next();});
$('#previous').on('click', function () {previous();});

// sorting
$("th[id$='_sort']").on('click', function () {
	//console.log(this);
	//console.log(this.value);
	 current_field = this.id.split('_')[0];
	 console.log(current_field);
	 if (defaultsortfield == current_field && defaultorder=='descending'){
	 	dataTableDC.order(d3.ascending);
	 	dataTableDC.redraw();
	 	defaultorder = 'ascending';
	 }
	 else if (defaultsortfield ==current_field && defaultorder=='ascending') {
	 	dataTableDC.order(d3.descending);
	 	dataTableDC.redraw();
	 	defaultorder = 'descending';
	 }
	 else{
	 	dataTableDC.sortBy(function(d){ return d[current_field]; })
	 	dataTableDC.order(d3.descending);
	 	dataTableDC.redraw();
	 	defaultorder = 'descending';
	 	defaultsortfield = current_field;
	 
	 }
	 //dataTableDC.sortBy(function(d) {return d.date;});
	 dataTableDC.redraw();
});
$('#langsort').on('click', function () {dataTableDC.sortBy(function(d) {return d.lang;});dataTableDC.redraw();});
$('#countrysort').on('click', function () {dataTableDC.sortBy(function(d) {return d.country;});dataTableDC.redraw();});
$('#sourcesort').on('click', function () {dataTableDC.sortBy(function(d) {return d.source;});dataTableDC.redraw();});
//$('#contextsort').on('click', function () {previous();});

// length of page data : to be done
$('#table_length').on('change',function(){
                pag = parseInt(this.value, 10);
                console.log(pag);
				//update_offset();
          		dataTableDC.redraw();            
          		});

// initialize table_length
//var table_length = $("#table_length").children("option:selected").val();
//console.log(table_length);


/***************** datatables with pagination, sorting search ***********/

//table
//dimension for table search
/*
var tDimension = facts.dimension(function (d) { return d.dtg;});
var tableDimension = tDimension.group().reduceCount();
var tableDimensionTop = remove_empty_bins(tableDimension);
console.log("table Dimensions created");
console.log(tDimension);
console.log(tableDimensionTop.all());
var dOptions = {
		retrieve: true,
        "bSort": true,
		columnDefs: [
			{
				targets: 0,
				data: function (d) {
				return d.date.substring(0,10); }
			}
			,
			{
				targets: 1,
				data: function (d) { 
				return d.lang;  }
			}
			,
			{
				targets: 2,
				data: function (d) { 
				return d.country;  }
			}
			,			
			{
				targets: 3,
				data: function (d) { 
				return '<a href=\"' + d.url + "\" target=\"_blank\">" +d.source+"</a>"; }
			}

			,
			{
				targets: 4,
				data: function (d) { 
				 return d.contents[0];   } 
			}
		]
	};
var datatablesynth = $("#dc-table-chart"+lang);
datatablesynth.dataTable(dOptions);

function RefreshTable() {
            dc.events.trigger(function () {
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
		text_filter(tDimension, this.value);

function text_filter(dim,q){
		 if (q!='') {
			dim.filter(function(d){
				console.log(d, q);
				//return 0 == d.search(re);
				return d.search(q.toLowerCase()) !== -1;
			});
		} else {
			dim.filterAll();
			}
		RefreshTable();
		dc.redrawAll();}
});
	
//RefreshTable();
console.log("Datatable chart built");
console.log(tableDimension);
*/




/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll();

 

}

// END OF JSI timestamped web corpus (in json file) search


///// concept details
$('#example tbody').on('click', 'td.concept_details', function () {
		var td = $(this);
        var tr = $(this).closest('tr');
        var row = table.row( tr );
       // console.log(row.data())
 
 //       if ( row.child.isShown() ) {
        if ( td.children('i').hasClass('close-details') ) {
            // This row is already open - close it
           row.child.hide();
            //tr.removeClass('shown');
            td.empty().append('<i title="Concept details" class="fa fa-info-circle fa-lg open-details" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>')

        }
        else {
            concept_details(row.data(), function(data)
            {
	            //alert(data)
    	        row.child(  data ).show();
        	   // tr.addClass('shown');
        	    td.empty().append('<i title="Concept details" class="fa fa-info-circle fa-lg close-details" aria-hidden="red" style="color:red;cursor: pointer;"></i>')
            }
            );
        }
    } );

// get all available data for concept id
function concept_details(d,callback) 
{
		console.log(d);
		var restable='';
		id_concept =d.id
		console.log(id_concept);
		var url ='./php/db_access_sqlite.php?action=conceptinfo&id='+id_concept;
        var request= $.ajax({
        	url :url,
        	success: function( res) {
        		console.log(res);
        		var result = JSON.parse(res)
            	if (result.length == 0){callback('<div class="alert alert-danger" role="alert">No result for this concept : ' + id_concept + '</div>' );return;}
            	var tbody = '';
            	// domains
            	domains = result['domains'];
             	console.log(domains);
             	table1 = '<table class="table table-bordered">';
            	table1 = table1 + '<thead class="thead-light"><tr class="alert alert-info"><th scope="col">Domains</th><tr></thead><tbody>'
             	for (i=0; i < domains.length;i++)
             	{
                		table1 += '<tr><td>' + domains[i]['label'] + '</td></tr>';
            	}
            	table1 += '</tbody></table>';

            	// relations
            	relations = result.relations;
             	console.log(relations);
             	table2 = '<table class="table table-bordered">';
            	table2 += '<thead class="thead-light"><tr class="alert alert-info"><th scope="col" colspan="3">Concept Relations</th></tr><tr><th scope="col">Relation Type</th><th scope="col">Id concept</th><th scope="col">English lexicalizations</th></tr></thead><tbody>'
             	for (i=0; i < relations.length;i++)
             	{
                		table2 += '<tr><td>' + relations[i]['rel'] + '</td><td>' + relations[i]['c2id'] + '</td><td>'+ relations[i]['en_lex']+ '</td></tr>';
            	}
            	table2 += '</tbody></table>';


            	// lexemes
            	lexemes = result.lexemes;
             	console.log(lexemes);
             	table3 = '<table class="table table-bordered">';
            	table3 += '<thead class="thead-light"><tr  class="alert alert-info"><th scope="col" colspan="4"><h4>Lexemes</h4></th></tr><tr><th scope="col">Language</th><th scope="col">Lexeme</th><th scope="col">Status</th><th scope="col">IATE Context</th></tr></thead><tbody>'
             	for (i=0; i < lexemes.length;i++)
             	{
                		table3 += '<tr><td>' + lexemes[i]['lang'] + '</td><td>' +  lexemes[i]['value'] + '</td><td>'+  lexemes[i]['label'] + '</td><td>'+  lexemes[i]['context'] + '</td></tr>';
            	}
            	table3 += '</tbody></table>';

            	var thead = '';
            	restable = table1 + table2 + table3;
            	callback(restable);
    		},
        	error: function (request) {
            	alert("Error : " + request.status + ". Response : " +  request.statusText);
            	restable= '<div>Problem :'+ request.status + ". Response : " +  request.statusText + '</div>';
            	callback(restable)
        	}
    });
}


} );

//////////////   STATS 

// statistics tab

// concept relations
$("a[id^='concept_rels']").on('click',function(){ // #corpusinfoBtn.."
	thisId = $(this).id
	console.log("button corpusinfoBtn triggered");
	console.log($(this));
	$(this).hide();

    $.ajax({
       		url :'php/db_access_sqlite.php?action=concept_relations',
	        dataType: "json",
        	type:'GET',
        	async:true,
        	success: function( data) {
        		console.log(data);
        		build_concept_rels_graphs(data);
        		$('#concepts_rel_stats').show();
        		
    		},
        	error: function (request, textStatus, errorThrown) {
            	alert("Error : " + request.status + ". Response text status : " +  textStatus+ ". Error Thrown : " +  errorThrown+ ". Response : " +  request.statusText);
            	console.log( '<div>Problem :'+ request.status + ". Response text status : " +  textStatus+ ". Error Thrown : " +  errorThrown+ '</div>');

        }
    });

 
});

// main function to display interactive graphs
function build_concept_rels_graphs(jsondata){

console.log(jsondata[0]);

relations = {12:'is part of',6:'has as part',13:'is predecessor of',0:'is antonym of',1:'is narrower than',15:'is successor of',11:'is broader than',14:'is related to',16:'is not to be confused with'};


  jsondata.forEach(function(d) { 
  		//console.log(typeof d.oov);
  		if (d.source_lex != null){d.source_lex1   = d.source_lex.split(',')[0];}else{d.source_lex1=d.source;d.source_lex=d.source;}
    	if (d.target_lex != null){d.target_lex1   = d.target_lex.split(',')[0];}else{d.target_lex1=d.target;d.target_lex=d.target;}
    	if (d.relation in relations){d.relationname = relations[d.relation];} else{d.relationname=d.relation;}
  });
console.log(jsondata[0]);
/*******************  GLOBAL DIMENSIONS ****************************/
  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(jsondata);
  var all = facts.groupAll();
  

/*************** TOTAL CHART *********************************/
  
totalCount = dc.dataCount('.dc-data-count');
totalCount 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> entries' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All entries selected. Please click on graphs to filter and interact.'
        });
  
totalCount2 = dc.dataCount('.dc-data-count2');
totalCount2 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> entries' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All articles selected. Please click on graphs to filter and interact.'
        });
  
  
console.log("Count chart built"); 		   
console.log(totalCount);
/***************************** CONCEPT SOURCE ROW BAR CHART ***********************/
var neoChart = dc.rowChart("#dc-concept_source-chart");
var neoDim = facts.dimension(function(d){ return d.source_lex1;});
var neoGroup = neoDim.group();
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
console.log("Concept source groups");
console.log(neoGroupTop.all());
// neo chart
neoChart
			//.width($(this).parent().innerWidth())
           .height(500)
           .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(neoDim)
            .group(neoGroupTop)
            .rowsCap(20)
            .othersGrouper(false)
            .label(function(d){return d.key + ' (' + d.value + ')';})
            //.title(function(d){return d.key + ' (' + d.value + ')';})
            .renderLabel(true)
            //.colors(d3.scale.category20())
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

//console.log(d3.scale.log)
console.log("Concept source chart built");
//console.log(neoChart);

/***************************** concept target bar CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.rowChart("#dc-concept_target-chart");
var subjectDimension = facts.dimension(function (d) { return d.target_lex1; });
var subjectGroup = subjectDimension.group();
var subjectGroupTop = remove_empty_bins(subjectGroup);
console.log("Concept target groups :")
console.log(subjectGroupTop.all());
  
// subject chart
 	subjectChart
 		//.width(300)
        .height(500)
        .margins({top: 0, right: 0, bottom: 30, left: 0})
        .dimension(subjectDimension)
        .group(subjectGroupTop)
        
        .rowsCap(20)
        //.colors(d3.scale.category10())
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
        
console.log("Concept target chart built");
//console.log(subjectChart);


/***************************** relation ROW BAR CHART ***********************/

var countryChart = dc.rowChart("#dc-relation-chart");
var countryDimension = facts.dimension(function (d) { return d.relationname; });
var countryGroup = countryDimension.group();
var countryGroupTop = remove_empty_bins(countryGroup);
console.log("relation groups :")
console.log(countryGroupTop.all());

// newspaper setup rowschart (TOP)
    countryChart
    		//.width(300)
            .height(500)
            .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(countryDimension)
            .group(countryGroupTop)
        .rowsCap(15)
        .othersGrouper(false)
        //.colors(d3.scale.category10())
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



console.log("relation chart built");


/***************** datatables with pagination, sorting search ***********/

//table
//dimension for table search

var tDimension = facts.dimension(function (d) { return d.source;});
var tableDimension = tDimension.group();
var tableDimensionTop = remove_empty_bins(tableDimension);
console.log("table Dimensions created");
console.log(tDimension);
//console.log(tableDimensionTop.all());
var dOptions = {
        "bSort": true,
		columnDefs: [
			{
				targets: 0,
				data: function (d) {
				return '<a href="https://iate.europa.eu/entry/result/' + d.source + '" target=new">' + d.source_lex + '</a>'; }
			}
			,
			{
				targets: 1,
				data: function (d) { 
				return '<a href="https://iate.europa.eu/entry/result/' + d.target + '" target=new">' + d.target_lex + '</a>';  }
			}
			,
			{
				targets: 2,
				data: function (d) { 
				return d.relationname;  }
			}
		]
	};
var datatablesynth = $("#dc-table-chart");
datatablesynth.dataTable(dOptions);

function RefreshTable() {
            dc.events.trigger(function () {
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
		text_filter(tDimension, this.value);

function text_filter(dim,q){
		 if (q!='') {
			dim.filter(function(d){
				console.log(d, q);
				//return 0 == d.search(re);
				return d.search(q.toLowerCase()) !== -1;
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


/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll();

}


// concept_domain
$("a[id^='concept_domain']").on('click',function(){ // #corpusinfoBtn.."
	thisId = $(this).id
	console.log("button corpusinfoBtn triggered");
	console.log($(this));
	$(this).hide();

    $.ajax({
       		url :'php/db_access_sqlite.php?action=concept_domains',
	        dataType: "json",
        	type:'GET',
        	async:true,
        	success: function( data) {
        		console.log(data);
        		build_concept_domains_graphs(data);
        		$('#concepts_domains').show();
        		
    		},
        	error: function (request, textStatus, errorThrown) {
            	alert("Error : " + request.status + ". Response text status : " +  textStatus+ ". Error Thrown : " +  errorThrown+ ". Response : " +  request.statusText);
            	console.log( '<div>Problem :'+ request.status + ". Response text status : " +  textStatus+ ". Error Thrown : " +  errorThrown+ '</div>');

        }
    });

 
});

// main function to display interactive graphs
function build_concept_domains_graphs(jsondata){

console.log(jsondata[0]);

  jsondata.forEach(function(d) { 
  		if (d.en_lexemes != null){d.concept_en   = d.en_lexemes.split(',')[0];}else{d.concept_en=d.id_concept;d.en_lexemes=d.id_concept;}
    	//if (d.target_lex != null){d.target_lex1   = d.target_lex.split(',')[0];}else{d.target_lex1=d.target;d.target_lex=d.target;}
    	//if (d.relation in relations){d.relationname = relations[d.relation];} else{d.relationname=d.relation;}
  });

/*******************  GLOBAL DIMENSIONS ****************************/
  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(jsondata);
  var all = facts.groupAll();
  

/*************** TOTAL CHART *********************************/
  
totalCount = dc.dataCount('.dc-data-count');
totalCount 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> entries' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All entries selected. Please click on graphs to filter and interact.'
        });
  
totalCount2 = dc.dataCount('.dc-data-count2');
totalCount2 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> entries' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All articles selected. Please click on graphs to filter and interact.'
        });
  
  
console.log("Count chart built"); 		   
console.log(totalCount);
/***************************** CONCEPT SOURCE ROW BAR CHART ***********************/
var neoChart = dc.rowChart("#dc-concepts-chart");
var neoDim = facts.dimension(function(d){ return d.concept_en;});
var neoGroup = neoDim.group().reduceCount(function(d) { return d.concept_en; });
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
console.log("Concept source groups");
console.log(neoGroupTop.all());
// neo chart
neoChart
			.width(600)
           .height(500)
           .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(neoDim)
            .group(neoGroupTop)
            .rowsCap(20)
            .othersGrouper(false)
            .label(function(d){return d.key + ' (' + d.value + ')';})
            //.title(function(d){return d.key + ' (' + d.value + ')';})
            .renderLabel(true)
            //.colors(d3.scale.category20())
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
console.log("Concept source chart built");
console.log(neoChart);

/***************************** concept target bar CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.rowChart("#dc-domains-chart");
var subjectDimension = facts.dimension(function (d) { return d.domain; });
var subjectGroup = subjectDimension.group();
var subjectGroupTop = remove_empty_bins(subjectGroup);
console.log("Concept target groups :" + subjectGroupTop.all());
  
// subject chart
 	subjectChart
 		.width(600)
        .height(500)
        .margins({top: 0, right: 0, bottom: 30, left: 0})
        .dimension(subjectDimension)
        .group(subjectGroupTop)
        
        .rowsCap(20)
        //.colors(d3.scale.category10())
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
        
console.log("Concept target chart built");
//console.log(subjectChart);


/***************** datatables with pagination, sorting search ***********/

//table
//dimension for table search

var tDimension = facts.dimension(function (d) { return d.concept_en;});
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
				return '<a href="https://iate.europa.eu/entry/result/' + d.id_concept + '" target=new">' + d.concept_en + '</a>'; }
			}
			,
			{
				targets: 1,
				data: function (d) { 
				return d.domain;  }
			}
			
		]
	};
var datatablesynth = $("#dc-tabledomain-chart");
datatablesynth.dataTable(dOptions);

function RefreshTable() {
            dc.events.trigger(function () {
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
		text_filter(tDimension, this.value);

function text_filter(dim,q){
		 if (q!='') {
			dim.filter(function(d){
				console.log(d, q);
				//return 0 == d.search(re);
				return d.search(q.toLowerCase()) !== -1;
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


/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll();

}


// concept lexemes
$("a[id^='concept_lexeme']").on('click',function(){ // #corpusinfoBtn.."
	thisId = $(this).id
	console.log($(this));
	$(this).hide();

    $.ajax({
       		url :'php/db_access_sqlite.php?action=concept_lexemes',
	        dataType: "json",
        	type:'GET',
        	async:true,
        	success: function( data) {
        		console.log(data);
        		build_concept_lexemes_graphs(data);
        		$('#concepts_lexemes').show();
        		
    		},
        	error: function (request, textStatus, errorThrown) {
            	alert("Error : " + request.status + ". Response text status : " +  textStatus+ ". Error Thrown : " +  errorThrown+ ". Response : " +  request.statusText);
            	console.log( '<div>Problem :'+ request.status + ". Response text status : " +  textStatus+ ". Error Thrown : " +  errorThrown+ '</div>');

        }
    });

 
});

// main function to display interactive graphs
function build_concept_lexemes_graphs(jsondata){

  console.log(jsondata[0]);

  jsondata.forEach(function(d) { 
  		//console.log(typeof d.oov);
  		if (d.concept_en != null){d.concept_en1=d.concept_en.split(',')[0];}else{d.concept_en1=d.id_concept;d.concept_en=d.id_concept;}
  });
console.log(jsondata[0]);
/*******************  GLOBAL DIMENSIONS ****************************/
  // Run the data through crossfilter and load our 'facts'
  var facts = crossfilter(jsondata);
  var all = facts.groupAll();
  

/*************** TOTAL CHART *********************************/
  
totalCount = dc.dataCount('.dc-data-count');
totalCount 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> entries' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All entries selected. Please click on graphs to filter and interact.'
        });
  
totalCount2 = dc.dataCount('.dc-data-count2');
totalCount2 
        .dimension(facts)
        .group(all)  
        .html({
            some: '<strong>%filter-count</strong> selected on <strong>%total-count</strong> entries' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'>Reset</a>',
            all: 'All articles selected. Please click on graphs to filter and interact.'
        });
  
  
console.log("Count chart built"); 		   
console.log(totalCount);
/***************************** CONCEPT ROW BAR CHART ***********************/
var neoChart = dc.rowChart("#dc-conceptsen-chart");
var neoDim = facts.dimension(function(d){ return d.concept_en1;});
var neoGroup = neoDim.group();
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
console.log("Concept source groups");
console.log(neoGroupTop.all());
// neo chart
neoChart
			//.width($(this).parent().innerWidth())
           .height(500)
           .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(neoDim)
            .group(neoGroupTop)
            .rowsCap(20)
            .othersGrouper(false)
            .label(function(d){return d.key + ' (' + d.value + ')';})
            //.title(function(d){return d.key + ' (' + d.value + ')';})
            .renderLabel(true)
            //.colors(d3.scale.category20())
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

//console.log(d3.scale.log)
console.log("Concept source chart built");
//console.log(neoChart);

/***************************** language bar CHART ***********************/

// Create the dc.js chart objects & link to div
var subjectChart = dc.rowChart("#dc-language-chart");
var subjectDimension = facts.dimension(function (d) { return d.lang; });
var subjectGroup = subjectDimension.group();
var subjectGroupTop = remove_empty_bins(subjectGroup);
console.log("Concept target groups :")
console.log(subjectGroupTop.all());
  
// subject chart
 	subjectChart
 		//.width(300)
        .height(500)
        .margins({top: 0, right: 0, bottom: 30, left: 0})
        .dimension(subjectDimension)
        .group(subjectGroupTop)
        
        .rowsCap(20)
        //.colors(d3.scale.category10())
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
        
console.log("Language chart built");
//console.log(subjectChart);


/***************************** lexeme ROW BAR CHART ***********************/

var countryChart = dc.rowChart("#dc-lexeme-chart");
var countryDimension = facts.dimension(function (d) { return d.value; });
var countryGroup = countryDimension.group();
var countryGroupTop = remove_empty_bins(countryGroup);
console.log("relation groups :")
console.log(countryGroupTop.all());

// newspaper setup rowschart (TOP)
    countryChart
    		//.width(300)
            .height(500)
            .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(countryDimension)
            .group(countryGroupTop)
        .rowsCap(20)
        .othersGrouper(false)
        //.colors(d3.scale.category10())
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



console.log("lexeme chart built");

/***************************** lexeme type ROW BAR CHART ***********************/

var countryChart = dc.rowChart("#dc-lexeme_type-chart");
var countryDimension = facts.dimension(function (d) { return d.typelabel; });
var countryGroup = countryDimension.group();
var countryGroupTop = remove_empty_bins(countryGroup);
console.log("relation groups :")
console.log(countryGroupTop.all());

// newspaper setup rowschart (TOP)
    countryChart
    		//.width(300)
            .height(500)
            .margins({top: 0, right: 0, bottom: 30, left: 0})
            .dimension(countryDimension)
            .group(countryGroupTop)
        .rowsCap(15)
        .othersGrouper(false)
        //.colors(d3.scale.category10())
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



console.log("lexeme chart built");



/***************** datatables with pagination, sorting search ***********/

//table
//dimension for table search

var tDimension = facts.dimension(function (d) { return d.lang;});
//var tableDimension = tDimension.group();
//var tableDimensionTop = remove_empty_bins(tableDimension);
console.log("table Dimensions created");
console.log(tDimension);
//console.log(tableDimensionTop.all());
var dOptions = {
        "bSort": true,
		columnDefs: [
			{
				targets: 0,
				data: function (d) {
				return '<a href="https://iate.europa.eu/entry/result/' + d.id_concept + '" target=new">' + d.concept_en1 + '[' + d.id_concept + ']</a>'; }
			}
			,
			{
				targets: 1,
				data: function (d) { 
				return d.lang;  }
			}
			,
			{
				targets: 2,
				data: function (d) { 
				return d.value;  }
			}
			,
			{
				targets: 3,
				data: function (d) { 
				return d.typelabel;  }
			}
			,
			{
				targets: 4,
				data: function (d) { 
				return d.context;  }
			}
		]
	};
var datatablesynth = $("#dc-tablelexeme-chart");
datatablesynth.dataTable(dOptions);

function RefreshTable() {
            dc.events.trigger(function () {
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
		text_filter(tDimension, this.value);

function text_filter(dim,q){
		 if (q!='') {
			dim.filter(function(d){
				console.log(d, q);
				//return 0 == d.search(re);
				return d.search(q.toLowerCase()) !== -1;
			});
		} else {
			dim.filterAll();
			}
		RefreshTable();
		dc.redrawAll();}
});
	
RefreshTable();
console.log("Datatable chart built");
console.log(tDimension);


/***************************** RENDER ALL THE CHARTS  ***********************/
// Render the Charts
dc.renderAll();

}

