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


// DataTables PHP library and database connection
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
Editor::inst( $db, 'def_relations', 'id' )
	->fields(
		Field::inst( 'id' )->set(false),
		Field::inst( 'abrev' ),
		Field::inst( 'name' ),
		Field::inst( 'relation_type' ),
		Field::inst( 'semantic_rel' ),
		Field::inst( 'id_reverse_rel' )
	)
	->process( $_POST )
	->json();
