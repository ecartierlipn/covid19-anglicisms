<?php
session_start();
include '../settings.php';
?>
<!-- dev version with crossfilter and dc.js libraries to visualize data -->
		<script type="text/javascript" charset="utf-8" src="../js/crossfilter.min.js"></script>
		<script type="text/javascript" charset="utf-8" src="../js/dc.min.js"></script>
		 <link href='../css/dc.css' rel='stylesheet' type='text/css' media="all">
		 
<script type="text/javascript" charset="utf-8" src="js/table.phc_morph_descr_srv.js"></script>

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
 </style>

<div class="side-body">
		<!-- Nav tabs -->
		<ul class="nav nav-tabs" role="tablist">
    		<li role="gestionnaire" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Gestionnaire</a></li>
    		<li role="presentation"><a href="#stats" aria-controls="stats" role="tab" data-toggle="tab">Statistiques (à faire)</a></li>
  		</ul>
		<!-- tab panes -->
		<div class="tab-content">
			<!-- main pane for gestionnaire -->
			<div role="tabpanel" class="tab-pane fade in active" id="home">	
    			<div class="page-title">
        			<span class="title">Gestionnaire des lexies : description et suivi</span>
				</div>

				<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	Cette interface vous permet de consulter et d'éditer les lexies individuelles validées dans le sous-menu séries. Vous pouvez effectuer les actions suivantes :<br/>
        	<ul>
<li><i title="Voir et éditer les lexies associées" class="fa fa-plus-circle fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>&nbsp;:&nbsp;<u>Voir et éditer les lexies associées</u> : par défaut, les lexies comprenant la séquence de lettres de la lexie ont été automatiquement ajoutées mais non typées. Il est également possible d'ajouter de nouvelles relations. La typologie des relations est accessible dans le menu paramètres / relations entre lexies;</li>
<li><i title="Voir le profil combinatoire de la lexie sur le corpus JSI" class="fa fa fa-book fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>&nbsp;:&nbsp;<u>Voir le profil combinatoire de la lexie sur le corpus JSI</u> : ce profil combinatoire est calculé automatiquement sur le corpus JSI, à partir de patrons propres à chaque partie du discours. Ces patrons sont éditables dans le menu paramètres / types de patrons combinatoires;</li>
<li><i title="Rechercher des occurrences dans Néoveille" class="fa fa-search-plus fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i></i>&nbsp;:&nbsp;<u>Rechercher des occurrences dans Néoveille (2016-2200)</u>;</li>
<li><i title="Rechercher et analyse des contextes du JSI" class="fa fa-bar-chart fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i></i>&nbsp;:&nbsp;<u>Rechercher et analyser les contextes du JSI</u>, toutes langues confondues;</li>
<li><image title="Rechercher et analyse dans Google" src="images/google2.png" style="cursor:pointer;"/></i>&nbsp;:&nbsp;<u>Rechercher et analyser la lexie dans Google</u>;</li>
<li><image title="Rechercher et analyse dans BabelNet" src="images/babelnet.png" style="cursor:pointer;width:16px;"/></i>&nbsp;:&nbsp;<u>Rechercher la lexie dans BabelNet</u>, qui permet d'obtenir une synthèse sur la lexie dans différentes bases de données.</li>
        	</ul>
        	Vous pouvez également expliciter quelques propriétés des lexies (en cliquant sur les cellules concernées, ou en sélectionnant la ligne et en cliquant sur modifier). Le champ <i>Base</i> permet de lier la forme lexicale rencontrée à une base (radical) commune (par exemple, les formes verbales de <i>binge-watcher</i> doivent avoir la même base <i>binge-watch</i>, ou encore les variantes orthographiques regroupées (<i>binge-watch</i> et <i>bingewtach</i> avec pour base <i>binge-watch</i>) . Dans le menu paramètres, il est possible de modifier les valeurs disponibles pour les champs Partie du discours, classe sémantique, matrice néologique principale et procédé néologique sémantique. Les opérations de base (filtrage, tri) sont également disponibles. <br/>
        	L'onglet statistiques permettra d'obtenir une synthèse pour chaque série.
        </div>

        		<div class="description">
          <!-- choix langue -->
           <h5>Choisissez une langue : 
			<select name="langA" id="langA" class="langA"  style="width:150px;">
			<?php 
			// echo language select box from $GLOBALS['language']
			//$lang = array('fr'=>'1', 'pl'=>'2', 'cz'=>'3');
			ksort($GLOBALS['language']);
			foreach ($GLOBALS['language'] as $lang => $lang_iso) {
				
				echo '<option value="' . $lang_iso . '" ';
				if ($_SESSION['language']== $lang_iso){echo 'selected';}
				echo '>' . $lang . '</option>';
			}
			?>			
    		</select>
		  </h5>



		  </h5>
		  <!-- datatable -->
            <div class="row" style="width:95vw">
                	<div class="card"  style="width:95vw">
                    	<div class="card-body">
                            <table class="datatable table display" cellspacing="0" id="exampleNeo"  style="width:95vw;">
								<thead>
									<tr><td colspan="15"><b>Filtres</b></td></tr>
									<tr>
										<th>Lexie</th>
										<th>Série</th>
										<th>Base</th>
										<th>Cat. synt.</th>
										<th>Cat. sem.</th>
										<th>Définition</th>
										<th>Procédé néo.<br/>principal</th>
										<th>Opération<br/>sémantique</th>
										<th>Commentaire</th>
										<th></th>
										<th></th>
										<th></th>
										<th></th>
										<th></th>
										<th></th>
									</tr>
									<tr>
										<th>Lexie</th>
										<th>Série</th>
										<th>Base</th>
										<th>Cat. synt.</th>
										<th>Cat. sem.</th>
										<th>Définition</th>
										<th>Matrice néo.<br/>principale</th>
										<th>Opération<br/>sémantique</th>
										<th>Commentaire</th>
										<th></th>
										<th></th>
										<th></th>
										<th></th>
										<th></th>
										<th></th>
									</tr>
								</thead>
                            </table>
                        </div>
                    </div>
            </div>

            <!-- statistics pane for neologism details : contexts (neoveille)-->
           <div class="row row-example" id="neoResultsfr" style="display:none;overflow:scroll;">
<!--<button type="button"  class="btn btn-light activated" id="fullscreen" onclick="activateFullscreen(document.getElementById('neoResultsfr'));dc.renderAll();" title="Full screen mode"><img src='./images/fullscreen.png' width='30px;float:right;'/></button>  -->
<!-- main panel to toggle graphs display -->
<!--  				<button id="res_newwindow" id_panel="neoResultsfr" style="align:right;">
    				<i class="fa fa-external-link" aria-hidden="true"></i>
  				</button>
-->
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
    				Langue
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#languagetimepanel" aria-expanded="false">
    				Evolution Langue
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
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neoformpanel" aria-expanded="false">
    				Forme
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neolemmapanel" aria-expanded="false">
    				Lemme
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopospanel" aria-expanded="false">
    				Partie du discours
  				</button>
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
                                                	Répartition par langue
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
                                                	Evolution temporelle par langue
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
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="neoformpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleformeg3">
                                                	Contexte (forme)
                                                </a>	
                                                </div>
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleformeg3">
                                                <table>
                                                <tr>
<!--                                                	<td>
		                                            <div id="dc-l4forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
-->		                                            
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
<!--		                                            <td>
		                                            <div id="dc-r4forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
-->
		                                        </tr>
		                                        </table>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- lemma context (3) rowscharts-->
                                        <div class="col-sm-12">
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
                                        </div>                                  
                                        <!-- pos context (3) rowschart-->
                                        <div class="col-sm-12">
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
                                        </div>

                                        
                                        <!-- datatables -->
                                        <div class="col-sm-12">
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
                                                		<th>Extrait</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>


        </div>
   			</div>    
            <!-- statistics pane  for every language-->
            <div role="tabpanel" class="tab-pane fade" id="stats">		  		
				<!-- accordion to access statistics by language -->
				<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <!-- Brésil -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
          Brésilien
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les corpus, pour le brésilien. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnBr">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsBr" style="display:none;">

                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Evolution temporelle</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-countBr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc-time-chartBr">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par domaine</div>
                                                <div class="panel-body">
		                                            <div id="dc-subject-chartBr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par journaux (10 plus importants)</div>
                                                <div class="panel-body">
		                                            <div id="dc-newspaper-chartBr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-count2Br'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
                                                <table class='table table-hover' id='dc-table-chartBr'>
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Domaine</th>
                                                		<th>Journal</th>
                                                		<th>Date</th>
                                                		<th>Article</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
    </div>
  </div>
	<!-- Chinois -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingThree">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          Chinois
        </a>
      </h4>
    </div>
    <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les néologismes, pour le français. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnCh">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsCh" style="display:none;">
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletimech">
                                                Evolution temporelle
                                                </a>
                                                </div>
                                                	<div id="toggletimech" class="panel-body collapse in">
                                                	<div class='dc2-data-countCh'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartCh">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
				
                                        <!-- neologismes types rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary" id="neopanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleneotypech">
                                                	Répartition par types de néologismes
                                                </a>
                        						<!--	<button type="button" class="close" data-target="#neopanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>-->


                                                	<div>														
                                                		<div id='moreitems' style="position:absolute !important;right:0;top:0;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>
														<div id='lessitems' style="position:absolute !important;left:97%;"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span></div>
													</div>
												</div>
                                                <div  id="toggleneotypech" class="panel-body collapse in">
		                                            <div id="dc2-neo-chartCh">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- neologismes rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleneoch">
                                                Répartition par néologismes (15 plus importants)
                                                </a>
                                                </div>
                                                <div id="toggleneoch" class="panel-body collapse in">
		                                            <div id="dc2-neoocc-chartCh">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggledomch">
                                                Répartition par catégorie (Néoveille)
                                                </a>
                                                </div>
                                                <div id="toggledomch" class="panel-body collapse in">
		                                            <div id="dc2-subject-chartCh">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- country rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary" id="cntpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecntch">
                                                	Répartition par pays
                                                </a>
                        						<!--	<button type="button" class="close" data-target="#cntpanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>-->
												</div>
                                                <div id="togglecntch" class="panel-body collapse in">
		                                            <div id="dc2-country-chartCh">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglenewsch">
                                                Répartition par journaux (15 plus importants)
                                                </a>
                                                </div>
                                                <div id="togglenewsch" class="panel-body collapse in">
		                                            <div id="dc2-newspaper-chartCh">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Ch'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> néologismes.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartCh' style="width:95%;important!">
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Néologismes</th>
                                                		<th>Total</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
 
    </div>
  </div>
  <!-- Français -->  
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingFour">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
          Français
        </a>
      </h4>
    </div>
    <div id="collapseFour" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingFour">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les néologismes, pour le français. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnFr">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsFr" style="display:none;">
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletimefr">
                                                Evolution temporelle
                                                </a>
                                                </div>
                                                	<div id="toggletimefr" class="panel-body collapse in">
                                                	<div class='dc2-data-countFr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartFr">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
				
                                        <!-- neologismes types rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary" id="neopanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleneotypefr">
                                                	Répartition par types de néologismes
                                                </a>
                        						<!--	<button type="button" class="close" data-target="#neopanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>-->


                                                	<div>														
                                                		<div id='moreitems' style="position:absolute !important;right:0;top:0;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>
														<div id='lessitems' style="position:absolute !important;left:97%;"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span></div>
													</div>
												</div>
                                                <div  id="toggleneotypefr" class="panel-body collapse in">
		                                            <div id="dc2-neo-chartFr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- neologismes rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleneofr">
                                                Répartition par néologismes (15 plus importants)
                                                </a>
                                                </div>
                                                <div id="toggleneofr" class="panel-body collapse in">
		                                            <div id="dc2-neoocc-chartFr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggledomfr">
                                                Répartition par catégorie (Néoveille)
                                                </a>
                                                </div>
                                                <div id="toggledomfr" class="panel-body collapse in">
		                                            <div id="dc2-subject-chartFr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        

                                        <!-- country rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary" id="cntpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecntfr">
                                                	Répartition par pays
                                                </a>
                        						<!--	<button type="button" class="close" data-target="#cntpanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>-->
												</div>
                                                <div id="togglecntfr" class="panel-body collapse in">
		                                            <div id="dc2-country-chartFr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglenewsfr">
                                                Répartition par journaux (15 plus importants)
                                                </a>
                                                </div>
                                                <div id="togglenewsfr" class="panel-body collapse in">
		                                            <div id="dc2-newspaper-chartFr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Fr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> néologismes.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartFr' style="width:95%;important!">
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Néologismes</th>
                                                		<th>Total</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
    </div>
  </div> 
  <!-- Grec -->   
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="HeadingFive">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
          Grec
        </a>
      </h4>
    </div>
    <div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="HeadingFive">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les corpus, pour le brésilien. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnGr">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsGr" style="display:none;">
                                        <!-- neologismes rowschart-->
                                  <!--      <div class="col-sm-4">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Néologismes</div>
                                                <div class="panel-body">
		                                            <div id="dc2-neo-chartGr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>-->

                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Evolution temporelle</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-countGr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartGr">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par domaine</div>
                                                <div class="panel-body">
		                                            <div id="dc2-subject-chartGr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par journaux (10 plus importants)</div>
                                                <div class="panel-body">
		                                            <div id="dc2-newspaper-chartGr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Gr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartGr'>
                                                	<thead>
                                                	<tr class='header'>
                                                                <th>Néologismes</th>
                                                                <th>Total</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
    </div>
  </div>  
  <!-- Italien -->   
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="HeadingTen">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
          Italien
        </a>
      </h4>
    </div>
    <div id="collapseTen" class="panel-collapse collapse" role="tabpanel" aria-labelledby="HeadingFive">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les corpus, pour le brésilien. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
				<a href="#" class="btn btn-info" id="neoinfoBtnIt">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsIt" style="display:none;">
                                        <!-- neologismes rowschart-->
                                  <!--      <div class="col-sm-4">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Néologismes</div>
                                                <div class="panel-body">
		                                            <div id="dc2-neo-chartIt">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>-->

                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Evolution temporelle</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-countIt'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartIt">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par domaine</div>
                                                <div class="panel-body">
		                                            <div id="dc2-subject-chartIt">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par journaux (10 plus importants)</div>
                                                <div class="panel-body">
		                                            <div id="dc2-newspaper-chartIt">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2It'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartIt'>
                                                	<thead>
                                                	<tr class='header'>
                                                                <th>Néologismes</th>
                                                                <th>Total</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
    </div>
  </div>  
  <!-- Polonais -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="<HeadingSix">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
          Polonais
        </a>
      </h4>
    </div>
    <div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="<HeadingSix">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les corpus, pour le brésilien. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnPl">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsPl" style="display:none;">
                                        <!-- neologismes rowschart-->
                               <!--         <div class="col-sm-4">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Néologismes</div>
                                                <div class="panel-body">
		                                            <div id="dc2-neo-chartPl">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>-->

                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Evolution temporelle</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-countPl'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartPl">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par domaine</div>
                                                <div class="panel-body">
		                                            <div id="dc2-subject-chartPl">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par journaux (10 plus importants)</div>
                                                <div class="panel-body">
		                                            <div id="dc2-newspaper-chartPl">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Pl'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartPl'>
                                                	<thead>
                                                	<tr class='header'>
                                                                <th>Néologismes</th>
                                                                <th>Total</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
    </div>
  </div>  
  <!-- Russe -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="<HeadingEight">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
          Russe
        </a>
      </h4>
    </div>
    <div id="collapseEight" class="panel-collapse collapse" role="tabpanel" aria-labelledby="<HeadingEight">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les néologismes, pour le français. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnRu">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsRu" style="display:none;">
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletimeru">
                                                Evolution temporelle
                                                </a>
                                                </div>
                                                	<div id="toggletimeru" class="panel-body collapse in">
                                                	<div class='dc2-data-countRu'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartRu">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
				
                                        <!-- neologismes types rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary" id="neopanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleneotyperu">
                                                	Répartition par types de néologismes
                                                </a>
                        						<!--	<button type="button" class="close" data-target="#neopanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>-->


                                                	<div>														
                                                		<div id='moreitems' style="position:absolute !important;right:0;top:0;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>
														<div id='lessitems' style="position:absolute !important;left:97%;"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span></div>
													</div>
												</div>
                                                <div  id="toggleneotyperu" class="panel-body collapse in">
		                                            <div id="dc2-neo-chartRu">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- neologismes rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleneoru">
                                                Répartition par néologismes (15 plus importants)
                                                </a>
                                                </div>
                                                <div id="toggleneoru" class="panel-body collapse in">
		                                            <div id="dc2-neoocc-chartRu">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggledomru">
                                                Répartition par catégorie (Néoveille)
                                                </a>
                                                </div>
                                                <div id="toggledomru" class="panel-body collapse in">
		                                            <div id="dc2-subject-chartRu">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- country rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary" id="cntpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecntru">
                                                	Répartition par pays
                                                </a>
                        						<!--	<button type="button" class="close" data-target="#cntpanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>-->
												</div>
                                                <div id="togglecntru" class="panel-body collapse in">
		                                            <div id="dc2-country-chartRu">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglenewsru">
                                                Répartition par journaux (15 plus importants)
                                                </a>
                                                </div>
                                                <div id="togglenewsru" class="panel-body collapse in">
		                                            <div id="dc2-newspaper-chartRu">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Ru'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> néologismes.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartRu' style="width:95%;important!">
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Néologismes</th>
                                                		<th>Total</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>
      </div>
    </div>
  </div>  
  <!-- Tchèque -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="<HeadingNine">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
          Tchèque
        </a>
      </h4>
    </div>
    <div id="collapseNine" class="panel-collapse collapse" role="tabpanel" aria-labelledby="<HeadingNine">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="alert alert-info alert-dismissible" role="alert" id="corpusinfo-2">
                               <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                               		Ce panneau vous permet d'accéder aux statistiques sur les corpus, pour le brésilien. Cliquez sur le bouton "Charger les données" (, patientez un peu...) puis naviguez dans les différents graphes. Pour tout signalement de bug ou demande de fonctionnalité additionnelle, allez dans l'onglet "Aide" qui vous permettra de décrire la demande ou le bug. Pour une présentation plus complète, allez également dans l'onglet "Aide".
                               </div>
                               <div class="title">
                                 <a href="#" class="btn btn-info" id="neoinfoBtnCz">Charger les données</a>
                               </div>
                			</div>
                </div>
                <!-- results -->
				<div class="row row-example" id="neoResultsCz" style="display:none;">
                                        <!-- neologismes rowschart-->
                               <!--         <div class="col-sm-4">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Néologismes</div>
                                                <div class="panel-body">
		                                            <div id="dc2-neo-chartCz">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>-->

                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Evolution temporelle</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-countCz'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc2-time-chartCz">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par domaine</div>
                                                <div class="panel-body">
		                                            <div id="dc2-subject-chartCz">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par journaux (10 plus importants)</div>
                                                <div class="panel-body">
		                                            <div id="dc2-newspaper-chartCz">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Cz'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
                                                <table class='table table-hover' id='dc2-table-chartCz'>
                                                	<thead>
                                                	<tr class='header'>
                                                                <th>Néologismes</th>
                                                                <th>Total</th>
                                                	</tr></thead>
                                                </table>
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
<!--      	<button type="button" class="btn btn-default" onclick="print_to_pdf('modal_view');">Sauver en pdf</button>-->
        <button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>		
</div>