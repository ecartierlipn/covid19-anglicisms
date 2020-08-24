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
	"host" => "localhost",
	"port" => "3306",
	"db"   => "neonaute",
	"dsn"  => "charset=utf8"
);




// DataTables PHP library
include( "lib/DataTables.php" );
if (is_ajax()) {
  if (isset($_GET["lang"]) && !empty($_GET["lang"])) { //Checks if lang value exists
    $lang = $_GET["lang"];
    if ($lang == 'fr'){
    	$tableNeo = 'termes_feminises';
    }
    else{
    	$tableNeo = 'termes_feminises' . $lang;
    }
  }
  else // no get lang info
  {
    $lang = 'fr';
    $tableNeo = 'termes_feminises';
  }
}
else // no ajax
{
  $lang = 'fr';
  $tableNeo = 'termes_feminises';
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
		Field::inst( 'statut' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'commentaire' ),
		Field::inst( 'last_update' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'freq_neoveille_group' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'freq_bnf_group' )->validator( 'Validate::notEmpty' )
		)
	->where('statut','forme masculine','=')
        ->where('prioritaire',1,'=')
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

