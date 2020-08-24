<?php
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
	"db"   => $dbname
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
Editor::inst( $db, 'users','uid'  )
	->fields(
		Field::inst( 'users.username' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'users.password' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'users.email' )->validator( 'Validate::notEmpty' ),
//		Field::inst( 'joining_date' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'users.firstname' ),
		Field::inst( 'users.lastname' ),
		Field::inst( 'users.user_rights' )->validator( 'Validate::notEmpty' ),
		Field::inst( 'users.language' )
			->options( 'languages', 'id', 'label' )
            ->validator( 'Validate::dbValues' ),
        Field::inst( 'languages.label as def_language.name' )

	)
	->leftJoin( 'languages', 'languages.id', '=', 'users.language' )
/*	->on( 'preCreate', function ( $editor, $values ) {
		$editor
		->field( 'users.joining_date' )
		->setValue('NOW()');
	} )*/
	->process( $_POST )
	->json();
