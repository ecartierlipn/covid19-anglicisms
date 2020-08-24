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
	"type" => "Mysql",
	"user" => $usermysql,
	"pass" => $passmysl,
	"host" => $servername,
	"port" => "3306",
	"db"   => $dbname,
	"dsn"  => "charset=utf8"
);


//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

$lang = 'fr';

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
Editor::inst( $db, 'borrowings_description', array('borrowings_description.word_lemma','borrowings_description.morphem','borrowings_description.language')  ) // as of Editor 1.6 array('word_lemma','morphem','language') 
	->fields(

	Field::inst( 'borrowings_description.word_lemma' )->validator( 'Validate::notEmpty' ),
	Field::inst( 'borrowings_description.morphem' )->validator( 'Validate::notEmpty' ),
	Field::inst( 'borrowings_description.word_lemma_regexp' ),
	Field::inst( 'borrowings_description.main_morph' ),


	
	Field::inst( 'borrowings_description.part_of_speech' )
		->options( 'def_part_of_speech', 'id', 'name' )
            	->validator( 'Validate::dbValues' ),
        		Field::inst( 'def_part_of_speech.name' ),
        		
	Field::inst( 'borrowings_description.semantic_class' )
		->options( 'def_semantic_class', 'id', 'name' )
            	->validator( 'Validate::dbValues' ),
        Field::inst( 'def_semantic_class.name' ),

	Field::inst( 'borrowings_description.language' )
			->options( 'def_language', 'id', 'name' )
            ->validator( 'Validate::dbValues' ),
        Field::inst( 'def_language.name' ),		

        
	Field::inst( 'borrowings_description.definition' ),
	Field::inst( 'borrowings_description.comment' ),


	Field::inst( 'borrowings_description.matrice_neo1' )
		->options( 'def_matrice_neo', 'name', 'description' )
	        ->validator( 'Validate::dbValues' ),
        Field::inst( 'def_matrice_neo.description' ),

	Field::inst( 'borrowings_description.matrice_neo2' )
		->options( 'def_matrice_neo2', 'name', 'description' )
	        ->validator( 'Validate::dbValues' ),
        Field::inst( 'def_matrice_neo2.description' )
	)
    ->leftJoin( 'def_language', 'def_language.id', '=', 'borrowings_description.language' )
    ->leftJoin( 'def_matrice_neo', 'def_matrice_neo.name', '=', 'borrowings_description.matrice_neo1' )
    ->leftJoin( 'def_matrice_neo2', 'def_matrice_neo2.name', '=', 'borrowings_description.matrice_neo2' )
    ->leftJoin( 'def_part_of_speech', 'def_part_of_speech.id', '=', 'borrowings_description.part_of_speech' )
    ->leftJoin( 'def_semantic_class', 'def_semantic_class.id', '=', 'borrowings_description.semantic_class' )
    ->where('lower(borrowings_description.language)',$_GET['lang'],'=')
	->process( $_POST )
	->json();

