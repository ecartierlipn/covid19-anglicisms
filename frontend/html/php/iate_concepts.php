<?php
session_start();
error_reporting(E_ALL);
//ini_set('display_errors', '1');

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
	"db"   => $dbname,
	//"dsn"  => "charset=utf8"
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
Editor::inst( $db, 'concepts', 'id'  )
	->fields(
		Field::inst( 'id' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'en_lexemes' ),
		Field::inst( 'en_def' )
	)
	// sqlite3
	->on( 'preCreate', function ( $editor, $values ) {
        $editor
            ->field( 'concepts.id' )
            ->setValue( NULL );     
    } )
	//->where( 'morphem', $_GET['lang'] ) 
	->process( $_POST )
	->json();
