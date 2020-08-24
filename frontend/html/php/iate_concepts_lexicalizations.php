<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('memory_limit','264M');
/*
 * Example PHP implementation used for the index.html example
 */
include '../credentials.php';
$sql_details = array(
	"type" => "Sqlite",
	"user" => '',
	"pass" => '',
	"host" => '',
	"port" => "",
	"db"   => $dbname
);

include( "lib/DataTables.php" );
// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;


if ( ! isset($_POST['id_concept'])) {
    echo json_encode( [ "data" => [] ] );
}
//id INT PRIMARY KEY, value TEXT, id_concept INT, lang TEXT, type INT, context TEXT
else {
    Editor::inst( $db, 'lexemes','rowid')
        ->field(
        	Field::inst( 'lexemes.rowid' ),
        	Field::inst( 'lexemes.id_concept' ),
            Field::inst( 'lexemes.value' ),
            Field::inst( 'lexemes.lang' )
            	->options( 'languages', 'id', 'label' )
            	->validator( 'Validate::dbValues' ),
        	Field::inst( 'languages.label' ),
            Field::inst( 'lexemes.type' )
            	->options( 'lexemes_types', 'id', 'label' )
            	->validator( 'Validate::dbValues' ),
        	Field::inst( 'lexemes_types.label' ),
            Field::inst( 'lexemes.context' )
        )
        ->leftJoin( 'lexemes_types', 'lexemes_types.id', '=', 'lexemes.type' )
        ->leftJoin( 'languages', 'languages.id', '=', 'lexemes.lang' )
        ->where( 'lexemes.id_concept', $_POST['id_concept'] )
        ->where( 'lexemes.lang', 'en','!=' )
        // for sqlite3
   		->on( 'postGet', function ( $e, &$data, $id ){
       		$data = array_values(array_unique($data, SORT_REGULAR));
    	})
    	/*->on( 'preCreate', function ( $editor, $values ) {
        	$editor
          		->field( 'lexemes.id' )->setValue(NULL);
        } )*/
        ->process($_POST)
        ->json();
}