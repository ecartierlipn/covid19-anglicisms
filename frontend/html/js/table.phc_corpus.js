
var editor; // use a global for the submit and return data rendering in the examples
$(document).ready(function() {

editor = new $.fn.dataTable.Editor( {
		ajax : {url:"php/phc_corpus.php",type:"POST",dataType:"json"},
		table: "#examplecontext",
		//lang:languageW,
		display: "envelope",		
		fields: [ 		
			{		
				label: "Nom du corpus",
				name: "name",
				type: "text",
			}, 
			{		
				label: "Description",
				name: "description",
				type: "text",
			}, 
			{		
				label: "Langue",
				name: "language",
				type: "text",
			}, 
			{		
				label: "Période temporelle",
				name: "temporal_period",
				type: "text",
			},
			{		
				label: "Types de documents",
				name: "documents_type",
				type: "text",
			},
			{		
				label: "Nombre de tokens",
				name: "total_tokens",
				type: "text",
			},
						{		
				label: "Nombre de formes uniques",
				name: "total_unique_words",
				type: "text",
			},
			{		
				label: "Nombre de documents",
				name: "total_docs",
				type: "text",
			},
			{		
				label: "Url d'information",
				name: "ref_url",
				type: "text",
			}
		],
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



var table = $('#examplecontext').DataTable( {
		dom: '<B><l><r>t<i><p>',
		fixedHeader: true,
		scrollY: '200vh',
        scrollCollapse: true,
		ajax: {url:"php/phc_corpus.php",type:"POST",dataType:"json"},
		lengthMenu: [[10, 25,  -1], [10, 25, "Tous"]],
		lengthChange: true,
		order: [[ 0, "asc" ]],
		select: true,
		responsive: true, 
		columns: [
				{data: "name"},
				{data: "language"},
				{data: "description"}, 
				{data: "temporal_period"},
				{data: "documents_type"},
				{data: "total_tokens"},
				{data: "total_unique_words"},
				{data: "total_docs"},
				{data: "ref_url", render: function( data, type, row, meta ){
					return '<a href="' + data + '" target=corpus_info>Plus d\'info</a>';
					}
				}
				],
		
		buttons: [
			{ extend: "create", editor: editor },
			{ extend: "edit",   editor: editor },
			{ extend: "remove",   editor: editor }
		],
		language:{url:"//cdn.datatables.net/plug-ins/1.10.13/i18n/French.json"}
	} );

} );