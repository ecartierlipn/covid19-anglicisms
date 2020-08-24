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




// DataTables PHP library
include( "lib/DataTables.php" );
if (is_ajax()) {
  if (isset($_GET["lang"]) && !empty($_GET["lang"])) { //Checks if lang value exists
    $lang = $_GET["lang"];
    if ($lang == 'fr'){
    	$tableNeo = 'neologismes';
    }
    else{
    	$tableNeo = 'neologismes_' . $lang;
    }
  }
  else // no get lang info
  {
    $lang = 'fr';
    $tableNeo = 'neologismes';
  }
}
else // no ajax
{
  $lang = 'fr';
  $tableNeo = 'neologismes';
}

//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}


// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Mjoin,
	DataTables\Editor\Upload,
	DataTables\Editor\Validate;


// Build our Editor instance and process the data coming from _POST
Editor::inst( $db, $tableNeo  )
	->fields(
		Field::inst( 'id' ),
		Field::inst( 'forme' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'origine' ),
		//->validator( Validate::values( array('Néoveille', 'Logoscope', 'Néoveille & Logoscope') ) ),
		Field::inst( 'commentaire' ),
		Field::inst( 'freq_neoveille' ),
		Field::inst( 'last_update' ),
		Field::inst( 'freq_BNF' )
		//Field::inst( 'part_of_speech' )
	)
	->process( $_POST )
	->json();


// update freq_BNF from time to time

/**UPDATE neonaute.neologismes as a
INNER JOIN
(
   SELECT id_token, COUNT(*) AS freq_BNF 
   FROM neonaute.neologismes_fragments 
   GROUP BY id_token
) as p ON a.id = p.id_token
SET a.freq_BNF = p.freq_BNF; **/

