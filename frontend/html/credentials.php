<?php
//$usermysql='root';
//$passmysl='neoveille';
//$solrBaseUrl='http://tal.lipn.univ-paris13.fr/solr/';
$solrBaseUrl='http://localhost:8983/solr/';
//$servername = "localhost";
$dbname = "../../mysql/iate-covid19.db";
// where contexts json file by concept reside
$processpath = "../data/id_concept/";



function debug_to_console( $data ) {
    $output = $data;
    if ( is_array( $output ) )
        $output = implode( ',', $output);

    echo "<script>console.log( 'Debug Objects: " . $output . "' );</script>";
}
?>
