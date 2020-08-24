// données corpus
$('#phc_corpus').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_corpus.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});// IATE concepts
$('#iate_concepts').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-iate_concepts.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});
// données lexies 
$('#iate_lexemes').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-iate_lexemes.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});
// données contextes
$('#phc_morph_contextes').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_morph_contextes.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

// paramètres
$('#phc_pos').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_def_part_of_speech.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

$('#phc_semclass').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_def_semantic_class.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

$('#phc_formalneo').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_def_matrice_neo.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});
$('#phc_semneo').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_def_matrice_neo2.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});
$('#phc_rels').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_def_relations.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

$('#neo-db-param').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-neo-db-params.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

$('#neo-db-dev2').click(function()
{
                                        //alert($("#container-fluid").html());
                                        $( "li.active" ).attr( "class", "inactive" );
                                        $( this ).closest( "li" ).attr( "class", "active" );
                        $("#container-fluid").load("table/datatable-neo-db-synth.php",function(responseTxt, statusTxt, xhr)
                        {
                                //if(statusTxt == "success")
                                //alert("External content loaded successfully!");
                                if(statusTxt == "error")
                                alert("Error: " + xhr.status + ": " + xhr.statusText);
                                });
});


// search
$('#neo-search2').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-search2.php",function(responseTxt, statusTxt, xhr)
// backup simple search
//        	    	$("#container-fluid").load("table/datatable-search.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});


    
// outils
$('#phc_tools').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-phc_tools.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});


// user management
// user profile
$('#user-profile').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-user-profile.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});
// user preferences
$('#user-preferences').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-user-profile.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

// users management
$('#users-list').click(function()
{
					//alert($("#container-fluid").html());
					$( "li.active" ).attr( "class", "inactive" );
					$( this ).closest( "li" ).attr( "class", "active" );
        	    	$("#container-fluid").load("table/datatable-users-management.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});
