<?php
session_start();
error_reporting(E_ALL);
//ini_set('display_errors', '1');

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
Editor::inst( $db, 'borrowings_contextes', array('l1forme', 'l2forme','key_word', 'r1forme','r2forme','journal','date')  )
	->fields(
		Field::inst( 'borrowings_contextes.lang' )
			->options( 'def_language', 'id', 'name' )
            ->validator( 'Validate::dbValues' ),
        Field::inst( 'def_language.name' ),		

		Field::inst( 'borrowings_contextes.series' ),
		Field::inst( 'borrowings_contextes.canon_morph' ),
		Field::inst( 'borrowings_contextes.date' ),
		Field::inst( 'borrowings_contextes.url' ),
		Field::inst( 'borrowings_contextes.country' ),
		Field::inst( 'borrowings_contextes.journal' ),
		Field::inst( 'borrowings_contextes.sentence' ),
		Field::inst( 'borrowings_contextes.key_word' ),
		Field::inst( 'borrowings_contextes.key_pos' ),
		Field::inst( 'borrowings_contextes.key_lemma' ),
		Field::inst( 'borrowings_contextes.meaning' ),
		Field::inst( 'borrowings_contextes.comment' ),
		Field::inst( 'borrowings_contextes.type_context' ),
		Field::inst( 'borrowings_contextes.l5forme' ),
		Field::inst( 'borrowings_contextes.l5pos' ),
		Field::inst( 'borrowings_contextes.l5lemma' ),
		Field::inst( 'borrowings_contextes.l4forme' ),
		Field::inst( 'borrowings_contextes.l4pos' ),
		Field::inst( 'borrowings_contextes.l4lemma' ),
		Field::inst( 'borrowings_contextes.l3forme' ),
		Field::inst( 'borrowings_contextes.l3pos' ),
		Field::inst( 'borrowings_contextes.l3lemma' ),
		Field::inst( 'borrowings_contextes.l2forme' ),
		Field::inst( 'borrowings_contextes.l2pos' ),
		Field::inst( 'borrowings_contextes.l2lemma' ),
		Field::inst( 'borrowings_contextes.l1forme' ),
		Field::inst( 'borrowings_contextes.l1pos' ),
		Field::inst( 'borrowings_contextes.l1lemma' ),
		Field::inst( 'borrowings_contextes.r1forme' ),
		Field::inst( 'borrowings_contextes.r1pos' ),
		Field::inst( 'borrowings_contextes.r1lemma' ),
		Field::inst( 'borrowings_contextes.r2forme' ),
		Field::inst( 'borrowings_contextes.r2pos' ),
		Field::inst( 'borrowings_contextes.r2lemma' ),
		Field::inst( 'borrowings_contextes.r3forme' ),
		Field::inst( 'borrowings_contextes.r3pos' ),
		Field::inst( 'borrowings_contextes.r3lemma' ),
		Field::inst( 'borrowings_contextes.r4forme' ),
		Field::inst( 'borrowings_contextes.r4pos' ),
		Field::inst( 'borrowings_contextes.r4lemma' ),
		Field::inst( 'borrowings_contextes.r5forme' ),
		Field::inst( 'borrowings_contextes.r5pos' ),
		Field::inst( 'borrowings_contextes.r5lemma' )
		
	)
	->leftJoin( 'def_language', 'def_language.id', '=', 'borrowings_contextes.lang' )
	->where( 'borrowings_contextes.series', $_GET['morph'] ) 
	->process( $_GET )
	->json();
