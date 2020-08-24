<?php 
session_start();
?>

<!DOCTYPE html>
<html>

<head>
    <title>SELECT-ITN Covid-19 Project</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- CSS Libs -->
    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="../lib/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap-switch.min.css">

	<link rel="stylesheet" type="text/css" href="../DataTables/datatables.min.css"/>

    <!-- CSS App -->
    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <link rel="stylesheet" type="text/css" href="../css/themes/flat-blue.css">
    
<style type="text/css" class="init">
    
td.details-control {
    background: url('images/details_open.png') no-repeat center center;
    cursor: pointer;
}
tr.shown td.details-control {
    background: url('images/details_close.png') no-repeat center center;
}

td.details-control2 {
    background: url('images/statistiques-neo.png') no-repeat center center;
    width:20px;
    height:20px;
    cursor: pointer;
}
tr.shown td.details-control2 {
    #background: url('images/details_close.png') no-repeat center center;
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
                            <li>SELECT-ITN Covid-19 Project -  pilot study</li>
                        </ol>
                        <button type="button" class="navbar-right-expand-toggle pull-right visible-xs">
                            <i class="fa fa-th icon"></i>
                        </button>                        
                    </div>

                </div>
            </nav>
            <!-- side menu -->
            <div class="side-menu sidebar-inverse">
                <nav class="navbar navbar-default" role="navigation">
                    <div class="side-menu-container">
                    <!-- header -->
                        <div class="navbar-header">
                            <a class="navbar-brand" href="#">
                                <div class="icon fa fa-paper-plane"></div>
                                <div class="title">SELECT-ITN Covid-19 Project</div>
                            </a>
                        </div>
                        <ul class="nav navbar-nav">
<!-- accueil  -->
                            <li>
                                <a href="#" id="accueil" onclick="jQuery('div#neovalsynth').hide();jQuery('div#signupbox').hide(); jQuery('div#loginbox').hide();jQuery('div#neo-search2').hide();jQuery('div#neoval').hide();jQuery('div#presentation-gen').show();">
                                <span class="icon fa fa-home"></span><span class="title">Welcome</span>
                                </a>
                            </li>
<!-- Connexion-->
                            <li>
                            	<a href="#" id="login" onclick="jQuery('div#neovalsynth').hide();jQuery('div#signupbox').hide();jQuery('div#neoval').hide();jQuery('div#neo-search2').hide(); jQuery('div#loginbox').show();jQuery('div#presentation-gen').hide();">
                            	<span class="icon fa fa-user"></span><span class="title">Connexion</span></a>
                            </li>

                        </ul>
                    </div>
                    <!-- /.navbar-collapse -->
                </nav>
            </div>
            <!-- Main Content -->
            <div class="container-fluid">

            <!-- presentation generale -->
            	<div id="presentation-gen" class="side-body">
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
                                            <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">General presentation</a></li>
                                            <li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Publications</a></li>
                                            <li role="presentation"><a href="#messages" aria-controls="messages" role="tab" data-toggle="tab">Tutorials</a></li>
                                            <li role="presentation"><a href="#links" aria-controls="links" role="tab" data-toggle="tab">Links</a></li>
                                        </ul>
                                        <!-- Tab panes -->
                                        <div class="tab-content">
<!-- présentation -->
<div role="tabpanel" class="tab-pane active" id="home">

<div class="sub-title"><strong>Summary</strong></div>
<div class="sub-title"><strong>Main Goals</strong></div>

<div class="sub-title"><strong>Results</strong></div>
</div>
<!-- publications -->
<div role="tabpanel" class="tab-pane" id="profile">
<div class="row">
  <div class="col-sm-12">
    <div class="sub-title"><strong>General presentation</strong></div>
	<div>


	</div>
 </div>
 <div class="col-sm-12">
    <div class="sub-title"><strong>Focused studies</strong></div>
	<div> 
<p></p>
	</div>
</div>
</div> <!-- end row-->											

											
											
											</div>
<!-- tutoriels -->
<div role="tabpanel" class="tab-pane" id="messages">
<div class="row">
<div class="col-sm-12">
<div class="sub-title">Platform functionnalities</div>
	<div>

	</div>
</div>
</div> <!-- end row-->
                                    </div>                                        
<!-- fin tutoriels -->
<div role="tabpanel" class="tab-pane" id="links">
 <div class="row">
  <div class="col-sm-12">
    <div class="sub-title"><strong>external links</strong></div>
	<div>
	<!--<p><a href="http://logoscope.unistra.fr" target="new">Logoscope</a></p>
	<p><a href="http://neoveille.org" target="new">Néoveille</a></p>
	<p><a href="http://www.bnf.fr/fr/collections_et_services/livre_presse_medias/a.archives_internet.html" target="new">BNF - Archives du web</a></p>
	<p><a href="http://www.culture.fr/franceterme" target="new">DGLFLF - France Terme</a></p>-->
	</div>
 </div>
 <div class="col-sm-12">
    <div class="sub-title"><strong>Other links</strong></div>
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
			<!-- loginbox -->
		        <div id="loginbox" style="display:none;" class="side-body"> 
        		<!-- login box -->
        		<div id="loginbox" style="margin-top:50px;" class="mainbox col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">                    
            <div class="panel panel-info" >
                    <div class="panel-heading">
                        <div class="panel-title">Connexion</div>
                        <div style="float:right; font-size: 80%; position: relative; top:-10px"><a href="#">Mot de passe oublié?</a></div>
                    </div>     

                    <div style="padding-top:30px" class="panel-body" >

                        <div style="display:none" id="login-info" class="info col-sm-12"></div>
                        <div style="display:none" id="login-alert" class="alert alert-danger col-sm-12"></div>
                        <form id="loginform" class="form-horizontal" role="form">
                                    
                            <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                        <input id="username" type="text" class="form-control" name="username" value="" placeholder="nom d'utilisateur">                                        
                                    </div>
                                
                            <div style="margin-bottom: 25px" class="input-group">
                                        <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                                        <input id="password" type="password" class="form-control" name="password" placeholder="mot de passe">
                                    </div>
                                    
                                <div style="margin-top:10px" class="form-group">
                                    <!-- Button -->
                                    <div class="col-sm-12 controls">
                                      <!--<a id="btn-login" href="#" class="btn btn-success">Connexion  </a>-->
                                      <button id="btn-login" type="button" class="btn btn-info">Connexion</button>
                                    </div>
                                </div>


                                <div class="form-group">
                                    <div class="col-md-12 control">
                                        <div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
                                           Si vous souhaitez obtenir un compte, merci de nous contacter à admin@neoveille.org<!-- Pas encore de compte! 
                                        <a href="#" onClick="$('#loginbox').hide(); $('#signupbox').show()">
                                            Enregistrez-vous ici
                                        </a>-->
                                        </div>
                                    </div>
                                </div>    
                            </form>     
                        </div>                     
                    </div>  
        </div>
    			</div>
    		</div>
        </div>
        <!-- footer -->
        <footer class="app-footer">
            <div class="wrapper">
                <table border="0" width="100%">
                <!--	<tr>
                	<td>Partners : </td>
                		<td><a href="https://www.ff.cuni.cz/home/about/organisation/institute-of-romance-studies/" target="new"><img src="https://www.ff.cuni.cz/wp-content/themes/ffuk/img/logo-en.svg" width="130px"/></a></td>
                		<td><a href="http://romanistyka.uni.lodz.pl/" target="new"><img src="http://romanistyka.uni.lodz.pl/wp-content/uploads/cropped-instytut_romanistyki_ul.jpg" width="130px"/></a></td>
                		<td><a href="https://www.univ-paris13.fr/" target="new"><img src="https://www.univ-paris13.fr/wp-content/uploads/uspn.png" width="130px"/></a></td>
                		<td><a href="https://lipn.univ-paris13.fr/fr/rcln-3" target="new"><img src="https://lipn.univ-paris13.fr/wp-content/uploads/2017/07/cropped-Logo-LIPN-plein.svg-copie-e1499433990966.png" width="60px"/></a></td>
                		<td><a href="https://www.campusfrance.org/fr/phc" target="new"><img src="https://www.campusfrance.org/themes/custom/campus/logo.svg" width="130px"/></a></td>
                		
                	</tr>-->
                	<tr>
                		<td colspan="5">&copy; 2020-<?php echo date("Y"); ?> - Néoveille</td>
                		
                	</tr>

                </table>

            </div>
        </footer>
        <!-- scripts -->
        <div>
            <!-- Javascript Libs -->
            <script type="text/javascript" charset="utf-8" src="../lib/js/jquery.min.js"></script>
            <script type="text/javascript" charset="utf-8" src="../lib/js/bootstrap.min.js"></script>
            <script type="text/javascript" charset="utf-8" src="../lib/js/bootstrap-switch.min.js"></script>

			<script type="text/javascript" src="../DataTables/datatables.min.js"></script>


            <!-- Javascript -->
            	<script>
			$(document).ready(function() {
						
$('#btn-login').click(function()
			{
			var username=$("form#loginform #username").val();
			var password=$("form#loginform #password").val();
		    var dataString = 'username='+username+'&password='+password+'&action=login';
		    //console.log(username);
		    //console.log(password);
		    //console.log("Parameters : " + dataString);
			if($.trim(username).length>0 && $.trim(password).length>0)
			{
			var request = $.ajax({
            type: "POST",
            url: "ajaxLoginRegister.php",
            data: dataString,
            cache: false
            });
            
//            beforeSend: function(){$("#btn-login").val('Connecting...');},
            request.success(function(data){
            	console.log("ajax query result : " + data);
            	if (data == "ERR1" || data == "ERR2")
            	{
					$("#login-info").html('<div class="alert fresh-color alert-danger" role="alert">Problème système. Contactez l\'administrateur.</div>');
	            	$("#login-info").show();
				}
				else if (data == "ERR3")
				{
					$("#login-info").html('<div class="alert fresh-color alert-danger" role="alert">Nom \'utilisateur ou mot de passe erroné. Recommencez.</div>');
	            	$("#login-info").show();
            	}
            	else
            	{
            		console.log("going to index.php");
            	    window.location.href = "index.php";
            	}
            });
            request.error(function(jqXHR, textStatus,errorThrown){
            	console.log("Request failed:" + textStatus);
	            $("#login-info").show();
				$("#login-info").html('<div class="alert fresh-color alert-danger" role="alert">' + textStatus + ' (' + errorThrown + ')</div>');
            });		
			}
});			
			
			
$('#neoval').click(function()
			{
					//alert($("#container-fluid").html());
					jQuery('div#signupbox').hide(); 
					jQuery('div#loginbox').hide();
					jQuery('div#presentation-gen').hide();
					jQuery('div#neo-search2').hide();
					jQuery('div#neovalsynth').hide();
					jQuery('div#neoval').show();
        	    	$("div#neoval").load("table/datatable-neologismes-demo.php",function(responseTxt, statusTxt, xhr)
        	    	{
        			//if(statusTxt == "success")
            			//alert("External content loaded successfully!");
        			if(statusTxt == "error")
            			alert("Error: " + xhr.status + ": " + xhr.statusText);
    				});
});

$('#neo-search2').click(function()
                        {
                                        //alert($("#container-fluid").html());
                                        jQuery('div#signupbox').hide(); 
                                        jQuery('div#loginbox').hide();
                                        jQuery('div#presentation-gen').hide();
                                        jQuery('div#neoval').hide();
					jQuery('div#neovalsynth').hide();
					jQuery('div#neo-search2').show();
                        $("div#neo-search2").load("table/datatable-search-demo.php",function(responseTxt, statusTxt, xhr)
                        {
                                //if(statusTxt == "success")
                                //alert("External content loaded successfully!");
                                if(statusTxt == "error")
                                alert("Error: " + xhr.status + ": " + xhr.statusText);
                                });
});

$('#neovalsynth').click(function()
                        {
                                        //alert($("#container-fluid").html());
                                        jQuery('div#signupbox').hide(); 
                                        jQuery('div#loginbox').hide();
                                        jQuery('div#presentation-gen').hide();
                                        jQuery('div#neoval').hide();
                                        jQuery('div#neo-search2').hide();
					jQuery('div#neovalsynth').show();
                        $("div#neovalsynth").load("table/datatable-neo-db-dev-demo.php",function(responseTxt, statusTxt, xhr)
                        {
                                //if(statusTxt == "success")
                                //alert("External content loaded successfully!");
                                if(statusTxt == "error")
                                alert("Error: " + xhr.status + ": " + xhr.statusText);
                                });
});


					
			});
			
		</script>
		</div>
</body>

</html>
