<?php
session_start();
include '../settings.php';
?>
<!-- dev version with crossfilter and dc.js libraries to visualize data -->
		<script type="text/javascript" charset="utf-8" src="../js/d3.min.js"></script>
		<script type="text/javascript" charset="utf-8" src="../js/crossfilter.min.js"></script>
		<script type="text/javascript" charset="utf-8" src="../js/dc.min.js"></script>
		 <link href='../css/dc.css' rel='stylesheet' type='text/css'>

<script type="text/javascript" charset="utf-8" src="js/table.search2.js"></script>
<style>
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
    	<div class="page-title">
        	<span class="title">Moteur de recherche</span>
		</div>
		<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	<b>Contextes</b> : permet d'effectuer une recherche dans le corpus d'une forme  (*trimp*, trump?, trump*, etc.). Pour effectuer une recherche, choisissez d'abord une langue, puis saisissez une requête dans la zone prévue à cet effet. Pour une aide sur les fonctionnalités de la requête, cliquez <a href="">ici</a>
		<br/><b>Termes</b> : Pour trouver les formes linguistiques d'une séquence de lettres (par exemple radical). Saississez la séquence de lettres recherchées.
        </div>
        <div class="description">
		  	<!-- recherche -->
			<div class="row">
				<form class="form-inline">
  <div class="form-group">
	<div class="col-sm-4">
    <label for="req">Requête</label>
    	<input type="text" class="form-control" id="req" placeholder="Saisissez votre recherche">
 	</div>
  </div>
  <div class="form-group">
    <div class="col-sm-4">
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
  </div>
  <div class="form-group">
    <div class="col-sm-2">
    <label for="limitres">Résultats</label>
	<select name="limitres" id="limitres"  class="form-control">
      			<option value="10" selected="selected">10</option>
      			<option value="25">25</option>
      			<option value="50">50</option>
      			<option value="100">100</option>
     			<option value="all">Tous</option>
    		</select>
    </div>
  </div>
  <div class="form-group">
  <div class="col-sm-4">
   <button type="button" class="btn btn-info" id="searchbtn">Contextes</button>
  </div>
</div>
 <div class="form-group">
  <div class="col-sm-4">
   <button type="button" class="btn btn-info" id="termbtn">Termes</button>
  </div>
  </div>  
<!--  <button class="btn btn-default" id="searchbtn">Chercher</button>-->
</form>
			</div>
			<!-- progress -->
			<!--<div class="row">
<div class="col-sm-2">
<button class="btn btn-info" id="progress" style="display:none;"><i class="fa fa-circle-o-notch fa-spin"></i> Recherche en cours...</button>
<button class="btn btn-info" id="resneg" style="display:none;"></i>Aucun résultat pour cette requête</button>
<hr/>
</div>
</div>-->
            <!-- resultats-->
           <div class="alert alert-dismissible" id="neoResultsInfo" style="display:none;overflow:scroll;"></div>
            <!-- statistics pane for neologism details : contexts (neoveille)-->
           <div class="row row-example" id="neoResultsfr" style="display:none;overflow:scroll;">
				<button type="button"  class="btn btn-light activated" id="fullscreen" onclick="activateFullscreen(document.getElementById('neoResultsfr'));dc.renderAll();" title="Full screen mode"><img src='./images/fullscreen.png' width='30px;float:right;'/></button> <!-- $('button#fullscreen').remove(); -->
        
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
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
                                        <!-- neopos rowchart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary" id="neopanel">
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
                                            <div class="panel panel-primary">
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

                                        <!-- country rowschart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary" id="countrypanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecountry">
                                                	Répartition par pays
                                                </a>
                                               <button type="button" class="close" data-target="#countrypanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="countrytimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecompcountry">
                                                	Evolution temporelle par pays
                                                </a>
                                               <button type="button" class="close" data-target="#countrytimepanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary">
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
                                            <div class="panel panel-primary">
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
                                    <!-- <div class="col-sm-12">
                                            <div class="panel panel-primary">
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
                                        </div> -->
                                        <!-- lemma context (3) rowscharts-->
                                    <!--     <div class="col-sm-12">
                                            <div class="panel panel-primary">
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
                                        </div>   -->                               
                                        <!-- pos context (3) rowschart-->
                                    <!--     <div class="col-sm-12">
                                            <div class="panel panel-primary">
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
                                        </div> -->

                                        
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
			<div class="row row-example" id="termResults" style="display:none;">
		</div>		  			  		
    </div>
