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
Editor::inst( $db, 'borrowings_freq', 'word'  )
	->fields(
		Field::inst( 'word' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'freq_cz' ),
		Field::inst( 'relfreq_cz' ),
		Field::inst( 'freq_fr' ),
		Field::inst( 'relfreq_fr' ),
		Field::inst( 'freq_pl' ),
		Field::inst( 'relfreq_pl' ),
		Field::inst( 'freq_en' ),
		Field::inst( 'relfreq_en' ),
		Field::inst( 'morphem' )
	)
	->where( 'morphem', $_GET['lang'] ) 
	->process( $_POST )
	->json();
