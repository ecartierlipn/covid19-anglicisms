<?php

?>
<!doctype html>
<html>

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">	
    <!-- CSS Libs -->

    <link rel="stylesheet" type="text/css" href="../lib/css/font-awesome.min.css" media="all">
    <link rel="stylesheet" type="text/css" href="../lib/css/bootstrap.min.css" media="all">

	<link href='../css/dc.css' rel='stylesheet' type='text/css' media="all">

<style type="text/css" class="init" media="all">

[id*=range-] { width: 100%; }
[id*=dc-]{ width: 100%; }

[id^=dc-]g.row text {fill: black;}

 .axis {
   font: 10px sans-serif;
 }

 .axis path,
 .axis line {
   fill: none;
   stroke: #000;
   shape-rendering: crispEdges;
 }
.bar {
  fill: orange;
}

.bar:hover {
  fill: lightblue ;
}

[id*=dc-] g.axis g text {
    text-anchor: end !important;
    transform: rotate(-45deg);
}

[id*=dc-] g.row text {
      fill: black;
    }


[id*=dc-l] g.axis g text {
    text-anchor: end !important;
    transform: rotate(-45deg);
}

[id*=dc-r] g.axis g text {
    text-anchor: end !important;
    transform: rotate(-45deg);
}
[id*=dc-core] g.axis g text {
    text-anchor: end !important;
    transform: rotate(-45deg);
}


[id*=dc-l] g.row text {
      fill: black;
    }

[id*=dc-r] g.row text {
      fill: black;
    }

[id*=dc-core] g.row text {
      fill: red;
    }
.datatable{
table-layout: auto;
width:100%;
}
.datatable thead th input{width:100%;align:left;}



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

div.panel-heading a {
	color:white;
}

svg {
	max-width:100% !important;
}

.dataTables_filter,.dataTables__paginate {
	float: right;
}

.dataTables_scrollBody {
	max-height:600px !important;
	
}

.dc-table-header th:hover {
	cursor:pointer;
}
 </style>

</head>
<body>

<div class='container' style="width:95%">
					<h3>Recherche Néoveille</h3>
					<!-- search form -->
					<div class="row">
							<!-- input search -->
								<div class="col-sm-3">
    								<label for="req">Requête</label>
    								<input type="text" class="form-control" id="req" placeholder="Saisissez votre recherche" 
    								
<?php
   if (isset($_GET["word"])){echo " value='" . $_GET['word'] . "'";}
?>
    								
    								>
 								</div>
						    <!-- search type -->
				    		<!-- <div class="col-sm-2">
    								<label for="searchtype">Type rech.</label>
									<select name="searchtype" id="searchtype"  class="form-control">
      									<option value="1" selected>Exacte</option>
      									<option value="1" selected>Approximative</option>
    								</select>
  								</div>-->
						    <!-- langue -->
				    			<div class="col-sm-3">
    								<label for="langsearch">Langue</label>
									<select name="langsearch" id="langsearch"  class="form-control">
      									<option value="ch">Chinois</option>
      									<option value="fr" selected="selected">Français</option>
      									<option value="gr">Grec</option>
      									<option value="it">Italien</option>
     									<option value="pl">Polonais</option>
      									<option value="br">Portugais du Brésil</option>
      									<option value="ru">Russe</option>
      									<option value="cz">Tchèque</option>
    								</select>
  								</div>
  							<!-- result number -->
    							<div class="col-sm-3">
    								<label for="limitres">Résultats</label>
									<select name="limitres" id="limitres"  class="form-control">
      									<option value="10" selected="selected">10</option>
      									<option value="25">25</option>
      									<option value="50">50</option>
      									<option value="100">100</option>
     									<option value="all" selected="selected">Tous</option>
    								</select>
    							</div>
						    <!-- display type -->
<!--				    			<div class="col-sm-2">
    								<label for="displaytype">Affichage</label>
									<select name="displaytype" id="displaytype"  class="form-control">
      									<option value="1" selected>Sur cette page</option>
      									<option value="0">Dans une fenêtre modale</option>
    								</select>
  								</div>-->
  							<!-- button trigger -->
  								<div class="col-sm-2"><br/>
   									<button type="button" class="btn btn-info" id="searchbtn">Contextes</button>
  								</div>
					</div>
					<hr/>
            		<!-- statistics pane for neologism details : contexts (neoveille)-->
					<div class="alert alert-dismissible" id="neoResultsInfo" style="display:none;overflow:scroll;"></div>            		
           			<div class="row" id="neoResultsfr" style="display:none;overflow:scroll;">
						<!-- nav bar to choose graph display -->
						<nav class="navbar navbar-expand-lg navbar-light bg-light" id="neoresultspanel"  style="padding-left:10px;">
							<form class="form-inline">
		  						<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#timepanel" aria-expanded="false">
    								Evolution temporelle
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopospanel0" aria-expanded="false">
    								Forme / Partie du discours
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopostimepanel" aria-expanded="false">
    								Evolution Forme / Partie du discours
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#languagepanel" aria-expanded="false">
    								Domaine
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#languagetimepanel" aria-expanded="false">
    								Evolution domaine
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#countrypanel" aria-expanded="false">
    								Pays
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#countrytimepanel" aria-expanded="false">
    								Evolution Pays
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#journalpanel" aria-expanded="false">
    								Source
  								</button>
  								<button class="btn btn btn-info" type="button" data-toggle="collapse" data-target="#journaltimepanel" aria-expanded="false">
    								Evolution Source
  								</button>
  								<!--<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neoformpanel" aria-expanded="false">
    								Forme
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neolemmapanel" aria-expanded="false">
    								Lemme
  								</button>
  								<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopospanel" aria-expanded="false">
    								Partie du discours
  								</button>-->
							</form>
						</nav>
						<!-- graphs -->
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="timepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletime">
                                                	Evolution temporelle globale
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="toggletime">
                                                	<div class='dc-data-countfr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc-time-chartfr">
		                                            </div>
		                                            <div id="range-chartfr"></div>
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>

                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart lemme/pos-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="neopospanel0">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglepos">
                                                	Répartition forme/pos
                                                </a>
												</div>
                                                <div class="panel-body collapse in" id="togglepos">
		                                            <div id="dc-neo-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by lemme / pos -->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="neopostimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptime">
                                                	Evolution temporelle par forme/pos
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptime">
          											<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>   <br/>                                             
		                                            <div id="dc-comptime-chartfr"></div>
		                                            <div id="range-chart2fr"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart language-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="languagepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggledom">
                                                	Répartition par domaine
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="toggledom">
		                                            <div id="dc-subject-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by language-->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="languagetimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptimedomain">
                                                	Evolution temporelle par domaine
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptimedomain">
          											<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>   <br/>                                             
		                                            <div id="dc-comptimedomain-chartfr"></div>
		                                            <div id="range-chart3fr"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- country rowschart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="countrypanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecountry">
                                                	Répartition par pays
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecountry">
		                                            <div id="dc-country-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by country-->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="countrytimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecompcountry">
                                                	Evolution temporelle par pays
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecompcountry">
          											<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>   <br/>                                             
		                                            <div id="dc-comptimecountry-chartfr"></div>
		                                            <div id="range-chart7fr"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="journalpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglenewsp">
                                                	Répartition par journaux
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglenewsp">
		                                            <div id="dc-newspaper-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by newspaper-->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="journaltimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptimenews">
                                                	Evolution temporelle par journal
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptimenews">
          											<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>   <br/>                                             
		                                            <div id="dc-comptimenews-chartfr"></div>
		                                            <div id="range-chart4fr"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- forme context (3) rowschart-->
                                        <!--<div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="neoformpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleformeg3">
                                                	Contexte (forme)
                                                </a>	
                                                </div>
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleformeg3">
                                                <table>
                                                <tr>
	                                            
                                                	<td>
		                                            <div id="dc-l3forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l2forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-l1forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-coreforme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>              
		                                            <td>
		                                            <div id="dc-r1forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-r2forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-r3forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>

		                                        </tr>
		                                        </table>
                                                </div>
                                            </div>
                                        </div>-->
                                        <!-- lemma context (3) rowscharts-->
                                        <!--<div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="neolemmapanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleg2">
                                                	Contextes (lemmes)
                                                </a>
                                                </div>
                                                
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleg2">
                                                <table border="0">
                                                <tr>
                                                	<td>
		                                            <div id="dc-l3lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>                                                	
                                                	</td>
                                                	<td>
		                                            <div id="dc-l2lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l1lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
                                                	<td>
		                                            <div id="dc-corelemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
                                                	<td>
		                                            <div id="dc-r1lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-r2lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-r3lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                        </tr>
		                                        </table>
                                                </div>
                                            </div>
                                        </div>-->                             
                                        <!-- pos context (3) rowschart-->
                                        <!--<div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="neopospanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleposg3">
                                                	Contextes (POS)
                                                </a>	
                                                </div>
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleposg3">
                                                <table>
                                                <tr>
                                                	<td>
		                                            <div id="dc-l3pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l2pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-l1pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-corepos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            
		                                            <td>
		                                            <div id="dc-r1pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-r2pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-r3pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>

		                                            
		                                        </tr>
		                                        </table>
                                                </div>
                                            </div>
                                        </div>-->                                
                                      <!-- datatables -->
                                      <!--  <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-count2fr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> occurrences.
													</div>
                                                <table class='table table-hover' id='dc-table-chartfr'>
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Date</th>
                                                		<th>Journal</th>
                                                		<th>Domaine</th>
                                                		<th>Pays</th>
                                                		<th>Extrait</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>-->
                                        
                                    <!-- datatable-view -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body" style="width:100%;">
                                                	<div class='dc-data-count2fr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> occurrences.
													</div>
                                                <div id='dc-tableview-chartfr'></div>
                                            </div>
                                        </div>
		  			</div>
</div>
<!-- Modal for word  multidimensional exploration-->
<div class="modal fade" id="modal_view" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg"  style="width:99%;height:99%;">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel"></h4>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>		
</div>
<!-- waiting div -->
<div class="modal" id="wait"></div>


<!-- javascripts -->
	<script type="text/javascript" charset="utf-8" src="../js/d3.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="../lib/js/jquery.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="../lib/js/bootstrap.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="../lib/js/bootstrap-switch.min.js"></script>

	<!-- dev version with crossfilter and dc.js libraries to visualize data -->
	<script type="text/javascript" charset="utf-8" src="../js/crossfilter.min.js"></script>
	<script type="text/javascript" charset="utf-8" src="../js/dc.min.js"></script>
	<!-- see https://github.com/karenpommeroy/dc-tableview -->
	<script type="text/javascript" charset="utf-8" src="../js/dc-tableview-bs.js"></script>	
	<!-- where specific scripts reside -->	 
	<script type="text/javascript" charset="utf-8" src="js/table.search_demo.js"></script>


</body>
</html>