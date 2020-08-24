//To select word
function selectword(val) {
	$("input#word").val(val);
	$("#suggestion-box").hide();
}


$(document).ready(function() {


// get info from borrowings_description on word on blur event (focus lose)
/*$("input#word").on('change', function(){
	 word = $(this).val(); 
	 console.log(word);
	 $.ajax({
		type: "POST",
		url : './php/db_access.php',
		data: { 'word': word, 'action':'get_word_info'},
		dataType:'json',
		success: function(result) {
			alert(result);
		},
		error: function(result){
			alert(result);
		}
	});
});*/

$("input#word").keyup(function(){
		//console.log($(this).val());
		$.ajax({
		type: "POST",
		url: './php/db_access.php',
		data: { 'word': $(this).val(), 'action':'get_word_info'},
		dataType: "json",
		beforeSend: function(){
			$("input#word").css("background","#FFF url('./images/ajax-loader.gif') no-repeat 165px");
		},
		success: function(data){
			//console.log(data);
			res = '<ul class="list-group" id="word-list">';
			for (var i = 0; i < data.length; i++ ){
				console.log(data[i]);
				res = res + '<li class="list-group-item" onClick=selectword("' + data[i].word_lemma + '[' + data[i].morphem  +']");>' + data[i].word_lemma + '[' + data[i].morphem + ' - '  + lang_iso[data[i].language] + ']</li>';
			}
			res = res+ '</ul>';

			$("#suggestion-box").show();
			$("#suggestion-box").html(res);
			$("input#word").css("background","#FFF");
		}
		});
	});



var lang_iso={"1":'fr','2':'pl','3':'cz'};
var wordprofileTable;
// tools events (phc project)

// Ajout de lexies en masse
$("#wordload").on('click', '#wordloadok', function(){
	
//	alert("clicked");
//	alert(form);
 	var file = $("#wordload input#fileupload").val();
 	var lang = $("#wordload select#lang").val();
 	var serie = $("#wordload select#serie").val();
 	var action = $("#wordload select#process").val();
 	console.log('<br/>Fichier texte : ' + file +
        '<br/>Langue : ' + lang + '<br/>Série : ' + serie + '<br/>Action : ' + action);

        alert('Cette fonction est en cours de développement. Revenez plus tard...');
});

// chercher les relations
$("#toolsBtn1").on('click',function(){
	wordmorph = $("input#word").val().match(/(.+)\[(.+)\]/);
	
	word = wordmorph[1]
	morph= wordmorph[2]
	console.log('['+word+']');
	wordlang = $("select#wordlang").val();
	$("#restools1").empty();
	console.log(word, wordlang);
	if (word && wordlang){get_word_relations_datatable(word,morph, wordlang);}
	else{
		alert("Vous devez saisir une lexie et une langue de recherche.");
	}
});

// sauvegarder les relations sélectionnées dans le datatable
$("#toolsBtn2").on('click',function(){
	var data = wordprofileTable.rows('.selected').data();
    console.log(data);
	if (data.length==0){alert("Vous devez préalablement sélectionner les lignes à sauvegarder!");}
	else{
	$.ajax({
          url: './php/db_access.php',
          type: "POST",
          data: {'action':'insert_word_relations', 'words': JSON.stringify(data) },
          dataType: "json",
/*          beforeSend: function(x) {
            if (x && x.overrideMimeType) {
              x.overrideMimeType("application/j-son;charset=UTF-8");
            }
          },*/
          success: function(result) {
 	     	alert(result + " relations ont été ajoutées et vont maintenant être retirées de la table.")
 	     	wordprofileTable.rows('.selected').remove().draw();
          }
	}); 
	} 
});


function get_word_relations_datatable(word,morph,wordlang){
		console.log("word info : ",word,wordlang);
		$.blockUI({ message: '<div class="card-body"><img src="./images/ajax-loader.gif" width="50" />Chargement en cours...</div>' }); 
		var request= $.ajax({
        url :'./php/db_access.php',
        data: {'action': 'word_relations','id': word, 'morph':morph, 'lang':wordlang},
        type:'POST',
        dataType: 'JSON',
        success: function( result) {
        	nb =  result.length;
        	console.log("Results : " +  result + ":" + nb);
        	if (nb == 0){
        		$("#restools1").html( '<div class="alert alert-danger" role="alert">' + "Aucune relation n'a pu être trouvée (sans doute la lexie n'est pas définie dans la base, ou la lexie n'a pas de relation).</div>" ).show();
        		$.unblockUI();
        	}
        	else {
    			var table = $('<table class="display table-bordered" width="100%" id="table_wordprofile"/>');
 				$("#restools1").html(table).show();
    			// DataTable
				wordprofileTable = table.DataTable( {
    				dom: 'frltip',
    				pageLength: 10,
    				order: [[ 0, "desc" ]],
    				fixedHeader:true,
    				scrollY: '100vh',
        			scrollCollapse: true,
    				data:result,
    				columns: [
    					{title: "Lexie1 - série1 - langue1",data: "word1", render: function ( data, type, row, meta ) {
                                					res = data.split(' - '); console.log(res); return res[0] + ' [' + res[1] + ' - ' + lang_iso[res[2]] + ']';
                                				}
                        },
						{title: "Lexie2",data: "word_lemma"}, 
						{title: "Série2", data: "morphem"}, 
        				{title:"Langue2", data: "language", render: function ( data, type, row, meta ) {
                                					return lang_iso[data];
                                				}
                        }
    				],
    				select: true,
					language: {
            processing:     "Traitement en cours...",
            search:         "Rechercher&nbsp;:",
            lengthMenu:     "Afficher _MENU_ &eacute;l&eacute;ment(s)",
            info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ment(s)",
            infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ment(s)",
            infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ment(s) au total)",
            infoPostFix:    "",
            loadingRecords: "Chargement en cours...",
            zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
            emptyTable:     "Aucune donnée disponible dans le tableau",
            paginate: {
                first:      "Premier",
                previous:   "Pr&eacute;c&eacute;dent",
                next:       "Suivant",
                last:       "Dernier"
            },
            aria: {
                sortAscending:  ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
            }
        },
				} );
				$.unblockUI();
        	}
    	},
        error: function (request) {
//            alert("Error : " + request.status + ". Response : " +  request.statusText);
     		$("#restools1").html( '<div class="alert alert-danger" role="alert">' + "Erreur : " + request.status + ':' +  request.statusText + ". Alertez l'administrateur de cette erreur.</div>" ).show();
     		$.unblockUI();            
        }
    });    	
}


} );
