<?php
require '../credentials.php';
ini_set('memory_limit', '2048M');
error_reporting(E_ALL);
//echo getcwd() . $processpath .  "\n" ;
//echo $_GET['concept'];

function console_log( $data ){
  echo '<script>';
  echo 'console.log('. json_encode( $data ) .')';
  echo '</script>';
}
//echo "<script>console.log( 'Debug Objects: " . $servername . ":".  $usermysql . ":".  $passmysl . ":".  $dbname . ":".  $processpath . "' );</script>";
// Create connection
$conn = new SQLite3($dbname);

// Check connection
/*if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}*/

// ajax query
if (is_ajax()) {
  if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    switch($action) { //Switch case for value of action
      case "conceptinfo":get_concept_info($_GET['id'],$conn);break;
      case "concept_relations":get_concept_relations($conn);break;
      case "concept_domains":get_concept_domains($conn);break;
      case "concept_lexemes":get_concept_lexemes($conn);break;
      case "concept_contexts":get_concept_contexts($_GET['concept'], $processpath); break;
          	
    }
  }
  // normally all actions are posted with ajax and arrive here
  elseif (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "conceptinfo":get_concept_info($_POST['id'],$conn);break;
      case "concept_domains":get_concept_domains($conn);break;
      case "concept_relations":get_concept_relations($conn);break;
      case "concept_lexemes":get_concept_lexemes($conn);break;
      case "concept_contexts":get_concept_contexts($_POST['concept'], $processpath);break;
          	
    }
 } 
}
else{
  if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    switch($action) { //Switch case for value of action
      case "conceptinfo":get_concept_info($_GET['id'],$conn);break;
      case "concept_relations":get_concept_relations($conn);break;
      case "concept_domains":get_concept_domains($conn);break;
      case "concept_lexemes":get_concept_lexemes($conn);break;
      case "concept_contexts":get_concept_contexts($_GET['concept'], $processpath);break;
    }
  }
  elseif (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "conceptinfo":get_concept_info($_POST['id'],$conn);break;
      case "concept_relations":get_concept_relations($conn);break;
      case "concept_domains":get_concept_domains($conn);break;
      case "concept_lexemes":get_concept_lexemes($conn);break;
      case "concept_contexts":get_concept_contexts($_POST['concept'], $processpath);break;
    }
 } 
}



//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

// retrieve concept json file with contexts otherwise put concept in list of concept contexts to retrieve
function get_concept_contexts($concept, $processpath){

	$path = $processpath . $concept . '.json';
	//console_log($path);
	if (file_exists($path)) {
    	$data = file_get_contents($path);
    	$res = json_decode($data);
    	//$jsonError = json_last_error();
    	//if(is_null($res) && $res == JSON_ERROR_NONE){
        //	throw new Exception('Could not decode JSON!');
    	//}
    	//else{
    		echo json_encode($res);
    	//}

	} else {
		
		$path = $processpath . 'concepts_contextes_list.txt';
		//echo $path;
    	if (!file_exists($path)){
    			file_put_contents( $path, $concept . "\n");
    			echo  json_encode('Contexts for this concept will be downloaded within tomorrow. Please come back.');
    	}
    	else{ 
			$cts = file_get_contents($path);
			$cpts = explode("\n", $cts);
			//echo json_encode($cpts);
			if (in_array($concept,$cpts)){
    			echo  json_encode('Concept id already stored for context retrieval. Come back soon!');			
			}
			else{
    			file_put_contents( $path, $concept . "\n", FILE_APPEND );
    			echo  json_encode('Contexts for this concept will be downloaded within tomorrow. Please come back.');
    		}
    	}		
	}

	
}
// get info from id_concept
function get_concept_info($id, $conn){
	$results = $conn->query('SELECT distinct concepts_relations.id_concept1 as c1id, concepts_relations.id_concept2 as c2id, concepts_relations.relation as rel, concepts.en_lexemes as en_lex from concepts_relations LEFT JOIN concepts ON concepts.id=concepts_relations.id_concept2 where concepts_relations.id_concept1=' . $id);
	if (!$results) {
    	die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
	}	
	else {
		$data = array();
		$data['relations'] = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		//var_dump($row);
    		$data['relations'][] = $row;
    		
		}
		$results = $conn->query('SELECT distinct lexemes.value,lexemes.lang,lexemes.type,lexemes.context,lexemes_types.label from lexemes LEFT JOIN lexemes_types ON lexemes_types.id=lexemes.type where lexemes.id_concept=' . $id);
		if (!$results) {
    		die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
		}	

		$data['lexemes'] = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		//var_dump($row);
    		$data['lexemes'][] = $row;    		
		}
		$results = $conn->query('SELECT distinct concepts_domains.id_concept, concepts_domains.id_domain, domains.label from concepts_domains LEFT JOIN domains ON domains.id=concepts_domains.id_domain where concepts_domains.id_concept=' . $id);
		if (!$results) {
    		die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
		}	

		$data['domains'] = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		//var_dump($row);
    		$data['domains'][] = $row;
    		
		}
		
    	$res = json_encode($data);
		//Get the last JSON error.
    	$jsonError = json_last_error();
    
    	//In some cases, this will happen.
    	if(is_null($res) && $res == JSON_ERROR_NONE){
        	throw new Exception('Could not decode JSON!');
    	}
    	else
    	{
      	echo $res;
    	}
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
	}

	$conn->close();		
}

// get concept relations
function get_concept_relations($conn){
//	$q = 'SELECT concepts_relations.id_concept1 as source, count(*) as cnt, concepts.en_lexemes as source_lex FROM concepts_relations left join concepts on source=concepts.id group by concepts_relations.id_concept1 order by cnt desc';
	$q = 'SELECT cr.relation as relation, cr.id_concept1 as source, cr.id_concept2 as target, c1.en_lexemes as source_lex, c2.en_lexemes as target_lex FROM concepts_relations as cr left join concepts as c1 on source=c1.id  left join concepts as c2 on target=c2.id';

	$results = $conn->query($q);
	if (!$results) {
    	die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
	}	
	else {
		$data = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		$data[] = $row;
		}
    	$res = json_encode($data);
		//Get the last JSON error.
    	$jsonError = json_last_error();
    
    	//In some cases, this will happen.
    	if(is_null($res) && $res == JSON_ERROR_NONE){
        	throw new Exception('Could not decode JSON!');
    	}
    	else
    	{
      		echo $res;
    	}
		
	}

}

// get concept relations
function get_concept_lexemes($conn){
	$q = 'SELECT l.context as context, l.value as value, l.lang as lang, l.type as type, l.id_concept as id_concept, lt.label as typelabel, c.en_lexemes as concept_en  from lexemes as l left join concepts as c on id_concept=c.id left join lexemes_types as lt on type=lt.id';

	$results = $conn->query($q);
	if (!$results) {
    	die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
	}	
	else {
		$data = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		$data[] = $row;
		}
    	$res = json_encode($data);
		//Get the last JSON error.
    	$jsonError = json_last_error();
    
    	//In some cases, this will happen.
    	if(is_null($res) && $res == JSON_ERROR_NONE){
        	throw new Exception('Could not decode JSON!');
    	}
    	else
    	{
      		echo $res;
    	}
		
	}

}


// get concept relations
function get_concept_domains($conn){
//	$q = 'SELECT concepts_relations.id_concept1 as source, count(*) as cnt, concepts.en_lexemes as source_lex FROM concepts_relations left join concepts on source=concepts.id group by concepts_relations.id_concept1 order by cnt desc';
	$q = 'SELECT cd.id_concept as id_concept, cd.id_domain as id_domain, d.label as domain, c.en_lexemes as en_lexemes  from concepts_domains as cd left join domains as d on id_domain=d.id left join concepts as c on id_concept=c.id';

	$results = $conn->query($q);
	if (!$results) {
    	die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
	}	
	else {
		$data = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		$data[] = $row;
		}
    	$res = json_encode($data);
		//Get the last JSON error.
    	$jsonError = json_last_error();
    
    	//In some cases, this will happen.
    	if(is_null($res) && $res == JSON_ERROR_NONE){
        	throw new Exception('Could not decode JSON!');
    	}
    	else
    	{
      		echo $res;
    	}
		
	}

}

// get info from id_concept
function get_concept_network($conn){
	// get nodes
	$results = $conn->query('SELECT id,en_lexemes as label FROM concepts');
	if (!$results) {
    	die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
	}	
	else {
		$data = array();
		//$data2 = array();
		$data['nodes'] = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		//var_dump($row);
    		$data['nodes'][]['data'] = $row;
    		//$data2[]['data'] = $row;
    		
		}
		$results = $conn->query('SELECT (id_concept1 || id_concept2 || relation) as id, id_concept1 as source,id_concept2 as target,relation as label FROM concepts_relations where source in (select distinct id from concepts) and target in (select distinct id from concepts)');
		if (!$results) {
    		die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
		}	

		$data['edges'] = array();
		while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    		//var_dump($row);
    		$data['edges'][]['data'] = $row; 
    		//$data2[]['data'] = $row;   		
		}
		unset($data['data']);
    	$res = json_encode($data);
		//Get the last JSON error.
    	$jsonError = json_last_error();
    
    	//In some cases, this will happen.
    	if(is_null($res) && $res == JSON_ERROR_NONE){
        	throw new Exception('Could not decode JSON!');
    	}
    	else
    	{
      	echo $res;
    	}
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
	}

	$conn->close();		
}


// get word info in borrowings_description (suggest tool in search)
function get_word_info($conn,$word){

$sql = 'select word_lemma, morphem, language from phc.borrowings_description where word_lemma like "%' . $word . '%" order by word_lemma limit 0,20;';

//$sql = 'select word_lemma, morphem, language from phc.borrowings_description where word_lemma="' . $word . '";'; //  and id_base <> id
$result = $conn->query($sql);
if (!$result) {
    die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	//print_r($result);
	$data = array();
    while($row = $result->fetch_assoc()) {
    	//print_r($row);
        $data[] = $row;
    }
    //print_r($data);
    $res = json_encode($data);
	//Get the last JSON error.
    $jsonError = json_last_error();
    
    //In some cases, this will happen.
    if(is_null($res) && $res == JSON_ERROR_NONE){
        throw new Exception('Could not decode JSON!');
    }
    else
    {
      echo $res;
    }
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
}

$conn->close();

}



// insert lexie2 from borrowings_relations adding with insert ignore (if already exists)
function insert_lexie2($conn, $word, $lang, $morph){

$sql = 'INSERT IGNORE INTO phc.borrowings_description (word_lemma, morphem, language) VALUES ("' . $word . '","' . $morph . '","' . $lang . '");';

$result = $conn->query($sql);
if (!$result) {
    echo ("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	echo("insert action of lexie2 done : " . $result);
}
}

// get phc morphemes / lexemes statistics
function get_lexemes_phc($conn,$id){

$sql = 'select word, freq_fr, freq_pl, freq_cz, freq_en from phc.borrowings_freq where morphem="' . $id . '";'; //  and id_base <> id
$result = $conn->query($sql);
if (!$result) {
    die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	//print_r($result);
	$data = array();
    while($row = $result->fetch_assoc()) {
    	//print_r($row);
        $data[] = $row;
    }
    //print_r($data);
    $res = json_encode($data);
	//Get the last JSON error.
    $jsonError = json_last_error();
    
    //In some cases, this will happen.
    if(is_null($res) && $res == JSON_ERROR_NONE){
        throw new Exception('Could not decode JSON!');
    }
    else
    {
      echo $res;
    }
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
}

$conn->close();

}


function copy_lexemes_phc($conn){
	if (!($conn->multi_query("CALL phc.copy_validated_entries()"))){
		echo "Problème à l'exécution de la procédure 'copy_validated_entries()': (" . mysqli_error($conn) . "). Contactez l'administrateur.";
	}
	else{
		echo("Les données validées ont été copiées dans la base des lexies. Vous pouvez y accéder par le menu de gauche (Projets PHC : données / lexies)");
		
	}
}


// get contexts for a given word (all languages covered)
function get_data_phc($conn, $processpath){

$sql = 'SELECT * FROM phc.borrowings_contextes where canon_morph REGEXP ".*' . $_GET["word"] . '.*";';

$result = $conn->query($sql);
if (!$result) {
    die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	//print_r($result);
	$data = array();
    while($row = $result->fetch_assoc()) {
    	//print_r($row);
        $data[] = $row;
    }
    
    //print_r($data);
    $res = json_encode($data);
	//Get the last JSON error.
    $jsonError = json_last_error();
    
    //In some cases, this will happen.
    if(is_null($res) && $res == JSON_ERROR_NONE){
        throw new Exception('Could not decode JSON!');
    }
    else
    {
   		if (count($data)==0){
    		file_put_contents( $processpath . 'retrieve_contexts_wordlist.txt', "all," . $_GET['morphem'] . "," .$_GET["word2"] ."\n", FILE_APPEND );
    		echo $res;
    	}
    	else{
      		echo $res;
      	}
    }
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
}

$conn->close();
}



// get contexts for a given word (all languages covered)
function get_data_contextes_lang($conn, $id, $lang){

$sql = 'SELECT * FROM phc.borrowings_contextes where canon_morph LIKE"%' . $id . '%" and lang="' . $lang . '";';

$result = $conn->query($sql);
if (!$result) {
    die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	//print_r($result);
	$data = array();
    while($row = $result->fetch_assoc()) {
    	//print_r($row);
        $data[] = $row;
    }
    //print_r($data);
    $res = json_encode($data);
	//Get the last JSON error.
    $jsonError = json_last_error();
    
    //In some cases, this will happen.
    if(is_null($res) && $res == JSON_ERROR_NONE){
        throw new Exception('Could not decode JSON!');
    }
    else
    {
      echo $res;
    }
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
}

$conn->close();
}


// find phc lexeme relations with other lexemes
function get_word_relations($conn,$id, $morph, $lang){

$word1 = $id . ' - ' . $morph . ' - ' . $lang;
//echo($lang);
if ($lang =='0'){
$sql = 'SELECT word_lemma, morphem, language, "' . $word1 . '" as word1 
FROM phc.borrowings_description 
where word_lemma REGEXP  concat(".*", replace("'. $id .'","-",".?"),".*") 
and word_lemma != "' . $id . '";';
}
else{
$sql = 'SELECT word_lemma, morphem, language, "' . $word1 . '" as word1  
FROM phc.borrowings_description 
where word_lemma REGEXP  concat(".*", replace("'. $id .'","-",".?"),".*") 
and language ="' . $lang . '" 
and word_lemma != "' . $id . '";';
}



//echo($sql . "\n");
$result = $conn->query($sql);
if (!$result) {
    die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	//print_r($result);
	$data = array();
    while($row = $result->fetch_assoc()) {
    	//print_r($row);
        $data[] = $row;
    }
    //print_r($data);
    $res = json_encode($data);
    //echo($res);
	//Get the last JSON error.
    $jsonError = json_last_error();
    
    //In some cases, this will happen.
    if(is_null($res) && $res == JSON_ERROR_NONE){
        throw new Exception('Could not decode JSON!');
    }
    else
    {
      echo $res;
    }
    
    //If an error exists.
    if($jsonError != JSON_ERROR_NONE){
        $error = 'Could not decode JSON! ';
        
        //Use a switch statement to figure out the exact error.
        switch($jsonError){
            case JSON_ERROR_DEPTH:
                $error .= 'Maximum depth exceeded!';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                $error .= 'Underflow or the modes mismatch!';
            break;
            case JSON_ERROR_CTRL_CHAR:
                $error .= 'Unexpected control character found';
            break;
            case JSON_ERROR_SYNTAX:
                $error .= 'Malformed JSON';
            break;
            case JSON_ERROR_UTF8:
                 $error .= 'Malformed UTF-8 characters found!';
            break;
            default:
                $error .= 'Unknown error!';
            break;
        }
        throw new Exception($error);
    }
}

$conn->close();

}


// insert phc lexeme relations with other lexemes in db
function insert_word_relations($conn,$id, $morph, $lang){

//echo($lang);
if ($lang =='0'){
$sql = 'INSERT IGNORE INTO phc.borrowings_relations (word_lexie1, morph_lexie1, lang_lexie1, word_lexie2, morph_lexie2, lang_lexie2, relation) 
SELECT ' . $id . ' as word_lexie1,' . $morph . ' as morph_lexie1,' . $lang . 'as lang_lexie1, word_lemma as word_lexie2, morphem as morph_lexie2, language as lang_lexie2, "22" as relation
FROM phc.borrowings_description
where word_lemma REGEXP  concat(".*", replace(word_lexie1,"-",".?"),".*") 
	and morphem = morph_lexie1
	and word_lemma != word_lexie1;';
}
else{
$sql = 'INSERT IGNORE INTO phc.borrowings_relations (word_lexie1, morph_lexie1, lang_lexie1, word_lexie2, morph_lexie2, lang_lexie2, relation) 
SELECT ' . $id . ' as word_lexie1,' . $morph . ' as morph_lexie1,' . $lang . 'as lang_lexie1, word_lemma as word_lexie2, morphem as morph_lexie2, language as lang_lexie2, "22" as relation
FROM phc.borrowings_description
where word_lemma REGEXP  concat(".*", replace(word_lexie1,"-",".?"),".*") 
	and language = lang_lexie1
	and morphem = morph_lexie1
	and word_lemma != word_lexie1;';
}
//echo($sql . "\n");
$result = $conn->query($sql);
if (!$result) {
    die("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
}
else{
	echo($conn->affected_rows);	
}

$conn->close();

}


// get phc  word profile depending on pos (call predefined procedures)
function get_word_profile($conn,$word, $lang, $pos){

// Noun patterns (value = mysql routine name)
$patterns = array(
	'Sujet : NOM_verbe'=>'phc.word_profile_SUBJ_NOUN_verb2',
	'COD : verbe_NOM'=>'phc.word_profile_verb_OBJ_NOUN2',
	'COI : verbe_prep_NOM'=>'phc.word_profile_verb_PREP_OBJ_NOUN2',
	'Modifieur : adj_NOM'=>'phc.word_profile_adj_xx_NOM',
	'Modifieur : NOM_adj'=>'phc.word_profile_NOM_xx_adj',
	'Complément de nom : NOM_prep_nom'=>'phc.word_profile_NOM_prep_nom',
	'Complément de nom : nom-adj_prep_NOM'=>'phc.word_profile_nomadj_prep_NOM',
	'Patron général : x_x_NOM_x_x'=>'phc.word_profile_x_x_NOM_x_x',
	'Patron général : x_NOM_x'=>'phc.word_profile_x_NOM_x',
	'Patron général : pos_NOM_pos'=>'phc.word_profile_pos_NOM_pos',
	'Patron général : pos_pos_NOM_pos_pos'=>'phc.word_profile_pos_pos_NOM_pos_pos'
	);
$global_res = array();
foreach ($patterns as $key => $value) {
	$sql = "CALL " . $value . "('" . $word . "');";
	//echo($sql);
	$result = $conn->multi_query($sql);
	if (!$result) {
    	echo("Echec lors de l'exécution de la requête(" . $conn->errno . ") " . $conn->error);
	}
	else{
  		$local_res = array();
  		do {
    		if ($res = $conn->store_result()) {
         		while($row = $res->fetch_assoc()) {
        			array_push($local_res,$row);
    			}
        		$res->free();
    		} else {
        		if ($conn->errno) {
            		echo "Store failed: (" . $conn->errno . ") " . $conn->error;
        		}
    		}
  		} while ($conn->more_results() && $conn->next_result());
  		if (count($local_res) > 0){
  			$global_res[$key] = $local_res;
  		}
	}
}
echo(json_encode($global_res));
$conn->close();
}




?>
