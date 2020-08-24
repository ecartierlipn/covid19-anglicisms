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
    Editor::inst( $db, 'concepts_relations',array('id_concept1','id_concept2','relation'))
        ->field(
        	Field::inst( 'concepts_relations.id_concept1' ),
          //  	->options( 'c1', 'id', 'en_lexemes' )
          //  	->validator( 'Validate::dbValues' ),
        //	Field::inst( 'c1.en_lexemes' ),
        	Field::inst( 'concepts_relations.id_concept2' ),
          //  	->options( 'c2', 'id', 'en_lexemes' )
          //  	->validator( 'Validate::dbValues' ),
        	Field::inst( 'c2.en_lexemes' ),
        	Field::inst( 'concepts_relations.relation' )
        )
      //  ->leftJoin( 'concepts as c1', 'concepts_relations.id_concept1', '=', 'c1.id' )
        ->leftJoin( 'concepts as c2', 'concepts_relations.id_concept2', '=', 'c2.id' )
        ->where( 'concepts_relations.id_concept1', $_POST['id_concept'] )
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