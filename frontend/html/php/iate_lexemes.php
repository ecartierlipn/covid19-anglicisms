<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', '1');

/*
 * Example PHP implementation used for the index.html example
 */
include '../credentials.php';
$sql_details = array(
	"type" => "Sqlite",
	"user" => '',
	"pass" => '',
	"host" => '',
	"port" => '',
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

// Build our Editor instance and process the data coming from _POST
// if lang and concept_id are set in POST, take them in where conditions
if (isset($_GET["id_concept"]) && isset($_GET["lexeme"])){ // isset($_GET["lang"]) && 

Editor::inst( $db, 'lexemes', 'id' ) 
	->fields(
		//Field::inst( 'lexemes.id' ),
		Field::inst( 'lexemes.value' ),
		Field::inst( 'lexemes.id_concept' ),
		Field::inst( 'lexemes.lang' ),
		Field::inst( 'lexemes.context'),
		Field::inst( 'lexemes.type')
			->options( 'lexemes_types', 'id', 'label' )
        	->validator( 'Validate::dbValues' ),
    	Field::inst( 'lexemes_types.label' )
	)
    ->leftJoin( 'lexemes_types', 'lexemes_types.id', '=', 'lexemes.type' )
// for sqlite3
    ->on( 'postGet', function ( $e, &$data, $id ){
       $data = array_values(array_unique($data, SORT_REGULAR));
    })
	/*->on( 'preCreate', function ( $editor, $values ) {
        $editor
            ->field( 'lexemes.id' )
            ->setValue( NULL );     
    } )*/
    //->where( 'lexemes.lang', $_GET['lang'] )
    ->where( 'lexemes.id_concept', $_GET['id_concept'] )
    ->where( 'lexemes.value', $_GET['lexeme'],'!=' )
	->process( $_POST )
	->json();
}

else{

Editor::inst( $db, 'lexemes', 'id' ) 
	->fields(
		//Field::inst( 'lexemes.id' ),
		Field::inst( 'lexemes.value' ),
		Field::inst( 'lexemes.id_concept' ),
		Field::inst( 'lexemes.lang' ),
		Field::inst( 'lexemes.context'),
		Field::inst( 'lexemes.type')
			->options( 'lexemes_types', 'id', 'label' )
        	->validator( 'Validate::dbValues' ),
    	Field::inst( 'lexemes_types.label' )
	)
    ->leftJoin( 'lexemes_types', 'lexemes_types.id', '=', 'lexemes.type' )
// for sqlite3
    ->on( 'postGet', function ( $e, &$data, $id ){
       $data = array_values(array_unique($data, SORT_REGULAR));
    })
	/*->on( 'preCreate', function ( $editor, $values ) {
        $editor
            ->field( 'lexemes.id' )
            ->setValue( NULL );     
    } )*/
	->process( $_POST )
	->json();
}