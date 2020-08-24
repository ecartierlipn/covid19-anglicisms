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

include( "lib/DataTables.php" );
// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;


if ( ! isset($_POST['word_lexie1']) || ! isset($_POST['morph_lexie1']) || ! isset($_POST['lang_lexie1'])) {
    echo json_encode( [ "data" => [] ] );
}
else {
    Editor::inst( $db, 'borrowings_relations', array('word_lexie1','morph_lexie1','lang_lexie1','word_lexie2','morph_lexie2','lang_lexie2') )
        ->field(
            Field::inst( 'borrowings_relations.word_lexie1' ),
            Field::inst( 'borrowings_relations.morph_lexie1' ),
            Field::inst( 'borrowings_relations.lang_lexie1' ),
            Field::inst( 'borrowings_relations.word_lexie2' ),
            Field::inst( 'borrowings_relations.morph_lexie2' ),
            Field::inst( 'borrowings_relations.lang_lexie2' )
            	->options( 'def_language', 'id', 'name' )
            	->validator( 'Validate::dbValues' ),
        	Field::inst( 'def_language.name' ),		
            Field::inst( 'borrowings_relations.comment' ),
            Field::inst( 'borrowings_relations.relation' )
           //     ->options( 'def_relations', 'id', 'abrev' )
                ->options( 'def_relations', 'id', 'name' )
                ->validator( 'Validate::dbValues' ),
        //    Field::inst( 'def_relations.abrev' ),
            Field::inst( 'def_relations.name' )
  //          Field::inst( 'concat_ws(" - ", def_relations.abrev, def_relations.name)', 'rel_fullname')->set(False)
        )
        ->leftJoin( 'def_relations', 'def_relations.id', '=', 'borrowings_relations.relation' )
        ->leftJoin( 'def_language', 'def_language.id', '=', 'borrowings_relations.lang_lexie2' )
        ->where( 'word_lexie1', $_POST['word_lexie1'] )
        ->where( 'morph_lexie1', $_POST['morph_lexie1'] )
        ->where( 'lang_lexie1', $_POST['lang_lexie1'] )
        ->process($_POST)
        ->json();
}