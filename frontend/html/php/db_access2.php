<?php
//$servername = "localhost";
//$dbname = "neonaute";


include '../credentials.php';

if (is_ajax()) {
  if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    switch($action) { //Switch case for value of action
      case "words": get_words($_GET["id"]); break;
      case "wordsfem": get_words_termfem($_GET["id"]); break;
      case "words_freq": get_words_freq($_GET["id"]); break;      	
    }
  }
  elseif (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "words": get_words($_POST["id"]); break;
      case "wordsfem": get_words_termfem($_POST["id"]); break;
      case "words_freq": get_words_freq($_POST["id"]); break;      	
    }
 } 
}
else{
  if (isset($_GET["action"]) && !empty($_GET["action"])) { //Checks if action value exists
    $action = $_GET["action"];
    switch($action) { //Switch case for value of action
      case "words": get_words($_GET["id"]); break;
      case "wordsfem": get_words_termfem($_GET["id"]); break;
      case "words_freq": get_words_freq($_GET["id"]); break;      	
    }
  }
  elseif (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "words": get_words($_POST["id"]); break;
      case "wordsfem": get_words_termfem($_POST["id"]); break;
      case "words_freq": get_words_freq($_POST["id"]); break;      	
    }
 } 
}


//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function get_words_termfem($id){
// Create connection
$conn = new mysqli($GLOBALS['servername'], $GLOBALS['usermysql'], $GLOBALS['passmysl'], $GLOBALS['dbname']);
//print_r($conn);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//else{
//	print("Connection OK");
//} 

$conn->set_charset("utf8");
//$sql = 'SELECT * FROM neonaute.neologismes_fragments where id_token =' . $_GET["id"] . ';';

$sql = 'SELECT id,forme,id_base,statut,freq_bnf,freq_neoveille,last_update FROM neonaute.termes_feminises where id_base="' . $id . '" order by field(statut,"forme masculine","forme féminine"),forme;';


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


function get_words($id){
// Create connection
$conn = new mysqli($GLOBALS['servername'], $GLOBALS['usermysql'], $GLOBALS['passmysl'], $GLOBALS['dbname']);
//print_r($conn);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//else{
//	print("Connection OK");
//} 

$conn->set_charset("utf8");
//$sql = 'SELECT * FROM neonaute.neologismes_fragments where id_token =' . $_GET["id"] . ';';

$sql = 'SELECT id,forme,id_preconise,statut,freq_bnf,freq_neoveille,last_update FROM neonaute.dglf_lexies where id_preconise="' . $id . '" order by field(statut,"néologisme","variante-N","concurrent","variante-C"),forme;';


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


function get_words_freq($id){
// Create connection
$conn = new mysqli($GLOBALS['servername'], $GLOBALS['usermysql'], $GLOBALS['passmysl'], $GLOBALS['dbname']);
//print_r($conn);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//else{
//	print("Connection OK");
//} 

$conn->set_charset("utf8");

$sql = 'SELECT t1.forme as lexie, t1.statut as statut, DATE(t2.date) as date'
.	' from neonaute.dglf_lexies as t1'
.	' inner join neonaute.dglf_freq as t2 on t1.id = t2.lexie_id'
.   ' where t1.id_preconise=' . $id . ' ORDER BY date;';


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
?>