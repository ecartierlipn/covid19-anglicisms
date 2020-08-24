<?php
//error_reporting(E_ALL);
session_start();
include('./credentials.php');
//debug_to_console($usermysql);
//debug_to_console($passmysl);

if(isSet($_POST['action']) && $_POST['action']=='login')
{
	//echo 'console.log("action=login");';
	login($_POST['username'],$_POST['password']);
}

//fake login
function login($user,$password){
		$_SESSION['login_user']='admin';
		$_SESSION['user']='admin';
		$_SESSION['user_rights']=2;
		$_SESSION['language']='fr';
		//echo $row['uid'];
		echo 'admin'; // "Connexion en cours pour l'utilisateur");
		return;


}

//
function login_bk($user,$password){

	$db = mysqli_connect('localhost',$GLOBALS['usermysql'],$GLOBALS['passmysl'],$GLOBALS['dbname']);
//	$db = mysqli_connect('localhost','root','root','rssdata');
	if (!$db) {
    	echo ("ERR1");//, "Erreur de connexion : " . mysqli_connect_error());
    	return;
    	
	}
	$q = "SELECT uid, username, user_rights, language FROM users WHERE username='$user' and password='$password'";
	$result=mysqli_query($db,$q);
	if ( false===$result ) {
  		echo ("ERR2"); //, "Problème d'accès à la table des utilisateurs. Contactez l'administrateur.");
  		return;
	}
    $count = mysqli_num_rows($result);
    $row=mysqli_fetch_array($result,MYSQLI_ASSOC);
    //echo($count);
	if($count==1)	
	{
		$_SESSION['login_user']=$row['uid'];
		$_SESSION['user']=$row['username'];
		$_SESSION['user_rights']=$row['user_rights'];
		//echo "<script>console.log( 'LANGUAGE  : " . $row['language'] . "' );</script>";
		$langcode = get_country_code($row['language']);
		$_SESSION['language']=$langcode;
		//echo $row['uid'];
		echo $_SESSION['login_user']; // "Connexion en cours pour l'utilisateur");
		return;
		//header('Location: index.php');
        //exit();
	}
	else
	{
		echo ("ERR3");// "Nom d'utilsateur ou mot de passe incorrect. Recommencez.");
		return;
		//return "Plusieurs utilisateurs correspondent à votre requête. Contactez l'administrateur.";
	}
}


function get_country_code($lang){

        $db = mysqli_connect('localhost',$GLOBALS['usermysql'],$GLOBALS['passmysl'],$GLOBALS['dbname']);
        if (!$db) {
        echo("Erreur de connexion : " . mysqli_connect_error());
        return false;
        }
        $q = "SELECT code FROM users_langue WHERE id='$lang'";
        //$q = "SELECT uid, username, user_rights, language FROM users WHERE username='$user' and password='$password'";
        $result=mysqli_query($db,$q);
        if ( false===$result ) {
                printf("error: %s\n", mysqli_error($db));
                return false;
        }
    $count = mysqli_num_rows($result);
    $row=mysqli_fetch_array($result,MYSQLI_ASSOC);
        if($count==1)   
        {
                return $row['code'];
        }
}

?>
