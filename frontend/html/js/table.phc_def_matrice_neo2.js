
var editor; // use a global for the submit and return data rendering in the examples
$(document).ready(function() {

editor = new $.fn.dataTable.Editor( {
		ajax : {url:"php/phc_def_matrice_neo2.php",type:"POST",dataType:"json"},
		table: "#examplecontext",
		//lang:languageW,
		display: "envelope",		
		fields: [ 
			{		
				label: "Code procédé néologique sémantique",
				name: "name",
				type: "text",
			}, 
			{		
				label: "Description",
				name: "description",
				type: "text",
			},
			{		
				label: "Catégorie de procédé",
				name: "cat_matrice",
				type: "text",
			},
			{		
				label: "Sous-catégorie de procédé",
				name: "sous_cat_matrice",
				type: "text",
			},
			{		
				label: "Informations additionnelles",
				name: "commentaire",
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

// New record
$('a.editor_create').on('click', function (e) {
        e.preventDefault();
 
        editor.create( {
            title: 'Créer une nouvelle entrée',
            buttons: 'Ajouter'
        } );
    } );
    
// Edit record
$('#examplecontext').on('click', 'td.editor_edit', function (e) {
        e.preventDefault();
 
        editor.edit( $(this).closest('tr'), {
            title: "Edition d'une entrée",
            buttons: 'Actualiser'
        } );
    } );
 
// Delete a record
$('#examplecontext').on('click', 'td.editor_remove', function (e) {
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


// Activate an inline edit on click of a table cell
$('#examplecontext').on( 'click', 'tbody td', function (e) {
        editor.inline( this, {submitOnBlur: true});
} );


var table = $('#examplecontext').DataTable( {
		dom: '<B><l><r>t<i><p>',
		fixedHeader: true,
		scrollY: '200vh',
        scrollCollapse: true,
		ajax: {url:"php/phc_def_matrice_neo2.php",type:"POST",dataType:"json"},
		lengthMenu: [[10, 25,  -1], [10, 25, "Tous"]],
		lengthChange: true,
		order: [[ 0, "asc" ]],
		select: true,
		responsive: true, 
		columns: [
				{data: "name"},
				{data: "description"},
				{data: "cat_matrice"},
				{data: "sous_cat_matrice"},
				{data: "commentaire"},
			// events buttons
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
			{ extend: "edit",   editor: editor },
			{ extend: "remove",   editor: editor },
			{ extend: "colvis", editor: editor, text:"Visibilité", columns: ':lt(13)' },
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

} );