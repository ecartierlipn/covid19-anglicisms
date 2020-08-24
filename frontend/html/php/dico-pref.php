<?php
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
	"db"   => "datatables",
	"dsn"  => "charset=utf8"
);


// DataTables PHP library
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
Editor::inst( $db, 'dico_prefixes'  )
	->fields(
		Field::inst( 'dico_prefixes.lexie' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'dico_prefixes.langue' )
//			->options(Options:inst()
//				->table('langues')
//				->value('ID_LANGUE')
//				->label('NAME_LANGUE')
//			)
//			->validator(Validate:dbValues() ),
			->options( 'langues', 'ID_LANGUE', 'NAME_LANGUE' )
            ->validator( 'Validate::dbValues' ),
        Field::inst( 'langues.NAME_LANGUE' ),	
        Field::inst( 'dico_prefixes.sens' )	
	)
	->leftJoin( 'langues', 'langues.ID_LANGUE', '=', 'dico_prefixes.langue' )
	->process( $_POST )
	->json();

