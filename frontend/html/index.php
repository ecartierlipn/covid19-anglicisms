<?php
header("Access-Control-Allow-Origin: *");
session_start();



if (!(empty($_GET['logout'])) and $_GET['logout']==1){session_unset();}
if(empty($_SESSION['login_user']))
{
	header('Location: login.php?action=login');
}




echo "<script>console.log( 'SESSION VARIABLES - LANGUAGE : " . $_SESSION['language'] . ':' . $_SERVER["DOCUMENT_ROOT"] . "' );</script>";


if (!($_SESSION['language']))
{
  $_SESSION['language']='fr';
}

//$_SESSION['locale'] =  Locale::getDefault();

echo ($_SESSION['language'] . ":" . $_SESSION['login_user'] . ":" . $_SESSION['user'] );
?>
<!DOCTYPE html>
<html>

<head>
    <title>SELECT-ITN Covid-19 Project</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">


    <!-- CSS Libs -->

    <link rel="stylesheet" type="text/css" href="../lib/css/font-awesome.min.css" media="all">
    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap.min.css" media="all">

    
    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap-switch.min.css" media="all"> 
	<link rel="stylesheet" type="text/css" href="../DataTables/datatables.min.css" media="all"/>



    <!-- CSS App -->
    <link rel="stylesheet" type="text/css" href="../css/style.css" media="all">
    <link rel="stylesheet" type="text/css" href="../css/themes/flat-blue.css" media="all">


    

<style type="text/css" class="init" media="all">

div.DTE_Field.DTE_Field_Type_title label {
  width: 100% !important;
  font-size: 1.2em;
  font-weight: bold;
  border-bottom: 1px solid #aaa; }
div.DTE_Field.DTE_Field_Type_title div {
  display: none; }
div.DTE_Field.DTE_Field_Type_title:hover {
  background-color: white;
  border: 1px solid transparent; }


td.editorNeoTools_edit {
    background: url('images/pencil_small.png') no-repeat center center;
    cursor: pointer;
}

td.editorNeo_edit {
    background: url('images/pencil_small.png') no-repeat center center;
    cursor: pointer;
}

td.editorNeo_remove {
    background: url('images/drop.png') no-repeat center center;
    cursor: pointer;}

td.editorCorpus_edit {
    background: url('images/pencil_small.png') no-repeat center center;
    cursor: pointer;
}
td.editorCorpus_remove {
    background: url('images/drop.png') no-repeat center center;
    cursor: pointer;}
    
td.details-control {
    background: url('images/details_open.png') no-repeat center center;
    cursor: pointer;
}
td.corpus-details {
    background: url('images/details_open.png') no-repeat center center;
    cursor: pointer;
}
td.corpus-details.shown {
    background: url('images/details_close.png') no-repeat center center;
}

// néoveille contexts
td.details-control {
    background: url('images/details_open.png') no-repeat center center;
    cursor: pointer;
}
tr.shown td.details-control {
    background: url('images/details_close.png') no-repeat center center;
}


// JSI timestamped web corpus search
tr td.details_jsi {
    background: url('images/SE_logo20.png') no-repeat center center;
    cursor: pointer;
    alt:"Contextes dans SketchEngine Timestamped web corpus";
    
}
tr td.details_jsi.shown {
    background: url('images/SE_logo20_close.png') no-repeat center center;
    cursor: pointer;
}


td.details-control3 {
    background: url('images/google2.png') no-repeat center center;
    cursor: pointer;
}
/*
td.details-control2 {
    background: url('images/statistiques-neo.png') no-repeat center center;
    width:20px;
    height:20px;
    cursor: pointer;
    alt:"Visualisation interactive des contextes";
}

tr td.details-control2.shown {
    #background: url('images/statistiques-neo-close.png') no-repeat center center;
}*/



td.editor_edit {
    background: url('images/pencil_small.png') no-repeat center center;
    cursor: pointer;
    alt:"Édition de l'entrée";
}
td.editor_remove {
    background: url('images/drop.png') no-repeat center center;
    cursor: pointer;
    alt:"Suppression de l'entrée";
}
td.editorU_edit {
    background: url('images/pencil_small.png') no-repeat center center;
    cursor: pointer;
}
td.editorU_remove {
    background: url('images/drop.png') no-repeat center center;
    cursor: pointer;
    
}
// tooltip
/* Tooltip container */
.tooltip2 {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip2 .tooltiptext {
  visibility: hidden;
  width: 300px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip2:hover .tooltiptext {
  visibility: visible;
}

	</style>

</head>

<body class="flat-blue">
    <div class="app-container">
        <div class="row content-container">
        	<!-- top menu -->
            <nav class="navbar navbar-default navbar-fixed-top navbar-top">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button type="button" class="navbar-expand-toggle">
                            <i class="fa fa-bars icon"></i>
                        </button>
                        <ol class="breadcrumb navbar-breadcrumb">
                            <li class="active">SELECT-ITN Covid-19 Project</li>
                            <img src=""/>
                        </ol>
                        <button type="button" class="navbar-right-expand-toggle pull-right visible-xs">
                            <i class="fa fa-th icon"></i>
                        </button>
                    </div>
                    <ul class="nav navbar-nav navbar-right navbar navbar-expand-lg navbar-light bg-light navbar-right">
<!--                        <li class="dropdown data">
        					<a class="nav-link dropdown-toggle" href="#" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          						Données
       						 </a>

       						 <ul class="dropdown-menu animated fadeInDown" aria-labelledby="navbarDropdownMenuLink">
          							<li><a class="dropdown-item" href="#" id="phc_morph">Formants</a></li>
          							<li><a class="dropdown-item" href="#" id="phc_morph_descr">Lexies</a></li>
          							<li><a class="dropdown-item" href="#" id="phc_morph_contextes">Contextes</a></li>
       						 </ul>
      					</li>
                        <li class="dropdown data">
        					<a class="nav-link dropdown-toggle" href="#" role="button" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          						Paramètres
       						 </a>

       						 <ul class="dropdown-menu animated fadeInDown" aria-labelledby="navbarDropdownMenuLink">
          							<li><a class="dropdown-item" href="#" id="phc_">Parties du discours</a></li>
          							<li><a class="dropdown-item" href="#" id="phc_">Classes sémantiques</a></li>
          							<li><a class="dropdown-item" href="#" id="phc_">Procédés néologiques</a></li>
       						 </ul>
      					</li>
-->                         <li class="dropdown profile">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><?php echo $_SESSION['user']; ?>-<?php echo $_SESSION['language']; ?><span class="caret"></span></a>
                            <ul class="dropdown-menu animated fadeInDown">
                                <li>
                                    <div class="profile-info">
                                        <h4 class="username"><?php echo $_SESSION['user']; ?></h4>
                                        <div class="btn-group margin-bottom-2x" role="group">
                                            <button type="button" class="btn btn-default"><i class="fa fa-user"></i> Profil</button>
                                            <a href="index.php?logout=1"><button type="button" class="btn btn-default"><i class="fa fa-sign-out"></i> Déconnexion</button></a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                   
                </div>
            </nav>
            <!-- left hand toggle menu-->
            <div class="side-menu sidebar-inverse">
                <nav class="navbar navbar-default" role="navigation">
                    <div class="side-menu-container">
                    <!-- header -->
                        <div class="navbar-header">
                            <a class="navbar-brand" href="#">
                                <div class="icon fa fa-paper-plane"></div>
                                <div class="title">Covid-19 Project</div>
                            </a>
                        </div>
                        <ul class="nav navbar-nav">
<!--  accueil -->
                            <li>
                                <a href="index.php">
                                    <span class="icon fa fa-home"></span><span class="title">Home</span>
                                </a>
                            </li>
                
<!-- listes -->
                            <li class="panel panel-default dropdown">
                                <a data-toggle="collapse" href="#neo-table">
                                    <span class="icon fa fa-magic"></span><span class="title">IATE db</span>
                                </a>
                                <!-- Dropdown level 1 -->
                                <div id="neo-table" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li><a href="#" id="iate_concepts">Concepts</a>
                                            </li>
                                            <li><a href="#" id="phc_morph">Domains</a>
                                            </li>
                                            <li><a href="#" id="iate_lexemes">Lexemes</a>
                                            </li>
                                           <!-- <li><a href="#" id="phc_morph_contextes">Corpora</a>
                                            </li>-->
                                        </ul>
                                    </div>
                                </div>
                            </li>

<!-- listes -->
                            <li class="panel panel-default dropdown">
                                <a data-toggle="collapse" href="#neo-dom">
                                    <span class="icon fa fa-diamond"></span><span class="title">IATE db : parameters</span>
                                </a>
                                <!-- Dropdown level 1 -->
                                <div id="neo-dom" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li><a href="#" id="phc_pos">Parts of Speech</a>
                                            </li>
                                            <li><a href="#" id="phc_semclass">Lexeme Status</a>
                                            </li>
                                            <li><a href="#" id="phc_semclass">Concept/Lexeme Relations</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>

<!-- search 2-->
                            <li class="panel panel-default dropdown">
                                <a data-toggle="collapse" href="#neo-search">
                                    <span  class="icon fa fa-search"></span><span class="title">Search</span>
                                </a>
                                <!-- Dropdown level 1 -->
                                <div id="neo-search" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
<?php if ($_SESSION["user_rights"]==2){
?>
                                            <li><a href="https://tal.lipn.univ-paris13.fr/solr8/#/covid19/query" target="search">Solr Interface</a>
                                            </li>
<?php
}
?> 
                                          <li><a href="#" id="neo-search2">Internal Interface</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>

<!--  outils -->
                            <li>
                            <a href="#" id="phc_tools">
                                <span class="icon fa fa-cogs"></span><span class="title">Tools</span>
                            </a>
                            </li>

<!-- profils-->
                            <li class="panel panel-default dropdown">
                                <a data-toggle="collapse" href="#user-params">
                                    <span class="icon fa fa-user"></span><span class="title">User</span>
                                </a>
                                <!-- Dropdown level 1 -->
                                <div id="user-params" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li><a href="#" id="user-profile">Profil</a>
                                            </li>
                                            <li><a href="#" id="user-preferences">Preferences</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
<?php if ($_SESSION["user_rights"]==2){
?>
<!-- gestion des utilisateurs pour admin -->
                            <li class="panel panel-default dropdown">
                                <a data-toggle="collapse" href="#users-mngt">
                                    <span class="icon fa fa-users"></span><span class="title">Users</span>
                                </a>
                                <!-- Dropdown level 1 -->
                                <div id="users-mngt" class="panel-collapse collapse">
                                    <div class="panel-body">
                                        <ul class="nav navbar-nav">
                                            <li><a href="#" id="users-list">Users</a>
                                            </li>
                                            <li><a href="#" id="users-preferences">Permissions</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
<?php 
}
?>

<!-- crédits -->
                            <!--<li>
                                <a href="license.php">
                                    <span class="icon fa fa-thumbs-o-up"></span><span class="title">Crédits</span>
                                </a>
                            </li>
                            -->
                        </ul>
                    </div>
                    <!-- /.navbar-collapse -->
                </nav>
            </div>
            <!-- Main Content -->
            <div class="container-fluid" id="container-fluid">
                <div class="side-body">
                    <div class="page-title">
                        <span class="title">Presentation</span>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="card">
                                <div class="card-body no-padding">
                                    <div role="tabpanel">
                                        <!-- Nav tabs -->
                                        <ul class="nav nav-tabs" role="tablist">
                                            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">General Presentation</a></li>
                                            <li role="presentation"><a href="#tuto" aria-controls="tuto" role="tab" data-toggle="tab">Tutorials</a></li>
                                            <li role="presentation"><a href="#publi" aria-controls="publi" role="tab" data-toggle="tab">‹Publications</a></li>
                                            <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Links</a></li>
                                        </ul>
                        			<!-- Tab panes -->
                                    	<div class="tab-content">
                        				<!-- tab 1 : présentation -->
											<div role="tabpanel" class="tab-pane active" id="home">
												<h4>Summary</h4>
												<h4>Main Goals and Outputs</h4>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="recipient-name" class="control-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name">
          </div>
          <div class="form-group">
            <label for="message-text" class="control-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>


											</div>
										<!-- tab 2 - tutoriels -->
											<div role="tabpanel" class="tab-pane" id="tuto">
										<div class="row">
<div class="col-sm-12">
<div class="sub-title">Features</div>
</div>
</div>
									</div>
									 
										<!-- tab 3 : publi -->
											<div role="tabpanel" class="tab-pane" id="publi">
									<div class="row">
  <div class="col-sm-12">
    <div class="sub-title"><strong>Présentation générale des projets</strong></div>
	<div>

	</div>
 </div>
 <div class="col-sm-12">
    <div class="sub-title"><strong>Etudes spécifiques</strong></div>
	<div> 
<p></p>
	</div>
</div>
</div> 										
										</div>
										<!-- tab 4 : liens -->
                                     		<div role="tabpanel" class="tab-pane" id="messages">
                                        <div class="row">
  <div class="col-sm-12">
    <div class="sub-title"><strong>Liens vers outils fournis par les partenaires du projet</strong></div>
	<div>

	</div>
 </div>
 <div class="col-sm-12">
    <div class="sub-title"><strong>Autres liens</strong></div>
	<div> 
	</div>
</div>
</div> 	
                                        
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="app-footer">
            <div class="wrapper">
                <table border="0" width="100%">
                <!--	<tr>
                	<td>Partners: </td>
                		<td><a href="https://www.ff.cuni.cz/home/about/organisation/institute-of-romance-studies/" target="new"><img src="https://www.ff.cuni.cz/wp-content/themes/ffuk/img/logo-en.svg" width="130px"/></a></td>
                		<td><a href="http://romanistyka.uni.lodz.pl/" target="new"><img src="http://romanistyka.uni.lodz.pl/wp-content/uploads/cropped-instytut_romanistyki_ul.jpg" width="130px"/></a></td>
                		<td><a href="https://www.univ-paris13.fr/" target="new"><img src="https://www.univ-paris13.fr/wp-content/uploads/uspn.png" width="130px"/></a></td>
                		<td><a href="https://lipn.univ-paris13.fr/fr/rcln-3" target="new"><img src="https://lipn.univ-paris13.fr/wp-content/uploads/2017/07/cropped-Logo-LIPN-plein.svg-copie-e1499433990966.png" width="60px"/></a></td>
                		<td><a href="https://www.campusfrance.org/fr/phc" target="new"><img src="https://www.campusfrance.org/themes/custom/campus/logo.svg" width="130px"/></a></td>
                		
                	</tr>-->
                	<tr>
                		<td colspan="5">&copy; 2020-<?php echo date("Y"); ?> - To be done</td>
                		
                	</tr>

                </table>

            </div>
        </footer>

        <!-- scripts -->
        <div id='mainscripts'>
            <!-- Javascript Libs -->
<script src="https://d3js.org/d3.v5.js"></script>
<script>
	d3v5 = window.d3;
    window.d3 = null
    console.log(d3v5.version);
</script>
		<script type="text/javascript" charset="utf-8" src="../js/d3.min.js"></script>
            
            <script type="text/javascript" charset="utf-8" src="../lib/js/jquery.min.js"></script>
            <script type="text/javascript" charset="utf-8" src="../lib/js/bootstrap.min.js"></script>
            <script type="text/javascript" charset="utf-8" src="../lib/js/bootstrap-switch.min.js"></script>
			<script type="text/javascript" src="../DataTables/datatables.min.js"></script>

	   <script src='../lib/js/jquery.blockUI.js'></script>
<!-- to get screenshots of visualizations : to be done-->
	   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
        <!-- menu actions -->
        <script type="text/javascript" charset="utf-8" src="js/menus.js"></script>
        <script type="text/javascript" charset="utf-8">
        	var user = '<?php echo $_SESSION["user"]; ?>';
            var user_rights = '<?php echo $_SESSION["user_rights"]; ?>';
           	var languageW = '<?php echo $_SESSION["language"]; ?>';

			function togglevisible(id, currentvalue) {
        		if (currentvalue=="none"){
            			document.getElementById(id).style.display = "block";
        		}
       	 		else{
            			document.getElementById(id).style.display = "none"; 
        		}
		}
			// to toggle menu
			$(function() {
  $(".navbar-expand-toggle").click(function() {
    $(".app-container").toggleClass("expanded");
    return $(".navbar-expand-toggle").toggleClass("fa-rotate-90");
  });
  return $(".navbar-right-expand-toggle").click(function() {
    $(".navbar-right").toggleClass("expanded");
    return $(".navbar-right-expand-toggle").toggleClass("fa-rotate-90");
  });
});

			//html2canvas
			$( "#btnPrint" ).click(function(){
				console.log("ok for capturing");
        		html2canvas(document.querySelector("#neoResultsfr"), {
					onrendered: function(canvas)
					{
						var img = canvas.toDataURL();
						$("#result-image").attr('src', img).show();
						window.open("data:text/html;charset=utf-8,"+img, "", "_blank")
					}
				});
    } ); 

			// disable console log in production
			const env = 'dvlpt';//'<?php echo getenv("APP_ENV"); ?>';
			if (env === 'production') {
    			console.log = function () {};
			}
$.blockUI.defaults.message = '<div class="card-body"><img src="./images/ajax-loader.gif" width="50" />Please wait while loading data...</div>'
$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI); 
			
        </script>
		</div>
	</div>
</body>

</html>
