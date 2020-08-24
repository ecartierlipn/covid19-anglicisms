
jQuery.support.cors = true;
var editor; // use a global for the submit and return data rendering in the examples
$(document).ready(function() {
	editor = new $.fn.dataTable.Editor( {
		ajax: "php/dico-pref.php",
		table: "#example",
		display: "envelope",
		fields: [ {
				label: "Préfixe:",
				name: "dico_prefixes.lexie"
			}, {
				label: "Langue",
				name: "dico_prefixes.langue",
				type: "select",
				placeholder:"Sélectionnez une langue"
			}
			, {
				label: "Commentaire",
				name: "dico_prefixes.sens"
			}
		]
,
        i18n: {
            create: {
                button: "Nouveau",
                title:  "Créer nouveau préfixe",
                submit: "Créer"
            },
            edit: {
                button: "Modifier",
                title:  "Modifier préfixe",
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
            title: 'Ajouter un nouveau préfixe',
            buttons: 'Add'
        } );
    } );
    
// Edit record
    $('#example').on('click', 'td.editor_edit', function (e) {
        e.preventDefault();
 
        editor.edit( $(this).closest('tr'), {
            title: 'Editer un préfixe',
            buttons: 'Update'
        } );
    } );
 
// Delete a record
    $('#example').on('click', 'td.editor_remove', function (e) {
        e.preventDefault();
 
        editor.remove( $(this).closest('tr'), {
            title: 'Delete record',
            message: 'Êtes-vous sûr de vouloir supprimer ce/ces préfixe/s?',
            buttons: 'Delete'
        } );
    } );

// inline editor type field
$('#example').on( 'click', 'tbody td', function () {
    editor.inline( this , {
        submitOnBlur: true
    } );
} );


// filter for each column
$(document).ready( function () {
				$('#example').dataTable().columnFilter({
					aoColumns: [ 
						{ sSelector: "#example_lexie",type: "text", bRegex: true, bSmart: true },
						{ sSelector: "#example_morph",type: "text"},
            			{sSelector: "#example_date", type: "text" , bRegex: true, bSmart: true }
					]
		});
} );


var table = $('#example').DataTable( {
		dom: '<B>lfrtip',
		fixedHeader: true,
		scrollY: '150vh',
        scrollCollapse: true,
		ajax: "php/dico-pref.php",
		lengthMenu: [[10, 25, 50, 100,  -1], [10, 25, 50, 100, "Tous"]],
		lengthChange: true,
		order: [[ 1, "desc" ]],
		select:true,
		columns: [		
			{ data: "dico_prefixes.lexie", name:'lexie', className: 'editable' },
			{ data:'langues.NAME_LANGUE', editField: "dico_prefixes.langue",  className: 'editable' },
			{ data: "dico_prefixes.sens" , name:'sens', className: 'editable' }, 
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
            }
		],
		select: {
            style:    'os',
            selector: 'td:first-child'
        },
		buttons: [
			{ extend: "create", editor: editor },
			{ extend: "edit",   editor: editor },
			{ extend: "remove", editor: editor }
			
		],
		language: {
            processing:     "Traitement en cours...",
            search:         "Rechercher&nbsp;:",
            lengthMenu:     "Afficher _MENU_ &eacute;l&eacute;ments",
            info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
            infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
            infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
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
        }		
		
	} );    
} );
