<?php
require '../credentials.php';
//error_reporting(E_ALL);

function console_log( $data ){
  echo '<script>';
  echo 'console.log('. json_encode( $data ) .')';
  echo '</script>';
}
//echo "<script>console.log( 'Debug Objects: " . $servername . ":".  $usermysql . ":".  $passmysl . ":".  $dbname . ":".  $processpath . "' );</script>";
// Create connection
$conn = new mysqli( $servername,  $usermysql,  $passmysl,  $dbname);
$conn->set_charset("utf8");


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ajax query
if (is_ajax()) {
  if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    switch($action) { //Switch case for value of action
      case "contextes": get_data_phc($conn, $processpath); break;      	
      case "phc_stats": get_lexemes_phc($conn,$_GET["id"]); break;
      case "copy_lexemes": copy_lexemes_phc($conn); break;
      case "contexte_lang": get_data_contextes_lang($conn, $_GET['id'],$_GET['lang']); break;    	
      case "word_relations": get_word_relations($conn, $_GET['id'], $_GET['lang']); break;    	
      case "insert_word_relations": insert_word_relations($conn, $_GET['id'], $_GET['morph'], $_GET['lang']); break;    	
      
          	
    }
  }
  // normally all actions are posted with ajax and arrive here
  elseif (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "contextes": get_data_phc($conn,$processpath); break;      	
      case "phc_stats": get_lexemes_phc($conn,$_POST["id"]); break;  
      case "copy_lexemes": copy_lexemes_phc($conn); break;      	
      case "contexte_lang": get_data_contextes_lang($conn, $_POST['id'],$_POST['lang']); break;   	
      case "word_relations": get_word_relations($conn, $_POST['id'],$_POST['morph'], $_POST['lang']); break;    	
      case "insertlexie2": insert_lexie2($conn, $_POST['word'], $_POST['lang'], $_POST['morph']); break;    	
      case "word_profile": get_word_profile($conn, $_POST['word'], $_POST['lang'], $_POST['pos']); break;    	
      case "insert_word_relations": insert_word_relations($conn, $_POST['id'], $_POST['morph'], $_POST['lang']); break;
      case "get_word_info": get_word_info($conn, $_POST['word']); break;
          	
    }
 } 
}
else{
  if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    switch($action) { //Switch case for value of action
      case "contextes": get_data_phc($conn,$processpath); break;      	
      case "phc_stats": get_lexemes_phc($conn,$_GET["id"]); break; 
      case "copy_lexemes": copy_lexemes_phc($conn); break;  
      case "contexte_lang": get_data_contextes_lang($conn, $_GET['id'],$_GET['lang']); break;    	
      case "word_relations": get_word_relations($conn, $_GET['id'], $_GET['lang']); break;    	
      case "insert_word_relations": insert_word_relations($conn, $_GET['id'], $_GET['morph'], $_GET['lang']); break;    	
    }
  }
  elseif (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "contextes": get_data_phc($conn,$processpath); break;      	
      case "phc_stats": get_lexemes_phc($conn,$_POST["id"]); break;  
      case "copy_lexemes": copy_lexemes_phc($conn); break; 
      case "contexte_lang": get_data_contextes_lang($conn, $_POST['id'],$_POST['lang']); break;   	
      case "word_relations": get_word_relations($conn, $_POST['id'], $_POST['lang']); break;    	
      case "word_profile": get_word_profile($conn, $_POST['word'], $_POST['lang'], $_POST['pos']); break;    	
      case "insert_word_relations": insert_word_relations($conn, $_POST['id'], $_POST['morph'], $_POST['lang']); break;    	
    }
 } 
}


//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
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
