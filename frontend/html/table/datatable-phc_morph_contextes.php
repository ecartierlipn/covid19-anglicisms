<?php
session_start();
?>
<!-- dev version with crossfilter and dc.js libraries to visualize data -->
		<script type="text/javascript" charset="utf-8" src="../js/crossfilter.min.js"></script>
		<script type="text/javascript" charset="utf-8" src="../js/dc.min.js"></script>
		 <link href='../css/dc.css' rel='stylesheet' type='text/css'>

<script type="text/javascript" charset="utf-8" src="js/table.phc_morph_contextes.js"/>
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
        	<span class="title">Gestionnaire des contextes (projet PHC)</span>
		</div>
		<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	<strong>Information  :</strong> cette base contient les contextes issus du corpus TimeStamped JSI web corpus 2014-2019 à partir de SketchEngine, pour les lexies étudiées dans le projet PHC. Pour chaque lexie,
        	sont listés les contextes et les annotations automatiques peuvent ainsi être corrigées. Il est également possible d'ajouter le sens de la lexie pour chaque contexte, ainsi que d'ajouter un commentaire.
        	Il est enfin possible de copier d'autres contextes, notamment à partir des données Néoveille. Pour sélectionner les contextes d'une lexie, il est conseillé d'utiliser les filtres.
        </div>
            <div class="description">
          <!-- choix morphème -->
           <h5>Choisissez une série : 
			<select name="lang" id="lang" class="lang">
				<option value="binge" selected>binge</option>
				<option value="boost" >boost</option>
				<option value="class-action" >class-action</option>
				<option value="couch" >couch</option>
				<option value="crowd" >crowd</option>
				<option value="cyber" >cyber</option>
				<option value="e-" >e-</option>
				<option value="fake" >fake</option>
				<option value="i-" >i-</option>
				<option value="ing" >-ing</option>
				<option value="m-" >m-</option>
				<option value="street" >street</option>
				<option value="tourist_tourism" >tourism/tourist</option>
				<option value="troll" >troll</option>			
    		</select>
		  </h5>            
            <!-- datatable -->             
            <div class="row">
            	<div class="col-xs-12">
                	<div class="card">
                    	<div class="card-body">
                            <table class="datatable table display" cellspacing="0" id="examplecontext">
								<thead>
									<tr>
										<th><b>Filtres</b></th>
									</tr>
									<tr>
										<th>Langue</th>
										<th>Forme canonique</th>
										<th>Lexie</th>
										<th>Partie du discours</th>
										<th>Lemme</th>										
										<th>Date</th>
										<th>url</th>
										<th>Pays</th>
										<th>Journal</th>
										<th>Phrase</th>
										<th>Sens de la lexie</th>
										<th>Type Contexte</th>
										<th></th>
										<th></th>
									</tr>
									<tr>
										<th>Langue</th>
										<th>Forme canonique</th>
										<th>Lexie</th>
										<th>Partie du discours</th>
										<th>Lemme</th>										
										<th>Date</th>
										<th>url</th>
										<th>Pays</th>
										<th>Journal</th>
										<th>Phrase</th>
										<th>Sens de la lexie</th>
										<th>Type Contexte</th>
										<th></th>
										<th></th>
									</tr>
								</thead>
								<tbody>
								
								</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- statistics pane for neologism details : contexts (neoveille)-->
           <div class="row row-example" id="neoResultsfr" style="display:none;">
        	<!--<input type="button" value="Sauvegarder (pdf)" id="btnPrint"/>-->
        	<!--<button type="button" class="btn btn-primary" id="btnPrint">pdf print</button>-->
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletime">
                                                	Evolution temporelle globale
                                                </a>
                                               <!-- <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Hooray!"></span>-->
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
                                        <!-- timeline -->
                                        <!-- neopos rowchart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary" id="neopanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglepos">
                                                	Répartition par partie du discours
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
                                                	Evolution temporelle par lemme/pos
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

                                        <!-- Domaine rowchart -->
                                        <!--<div class="col-sm-2">
                                            <div class="panel panel-primary">
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
                                        </div>-->
                                        <!-- composite timeline by domain-->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptimedomain">
                                                	Evolution temporelle par domaine
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptimedomain">
                                                <table width="100%">
                                                <tr>
                                                <td  rowspan="2" style="width:5%;vertical-align:top">
                                                	<div id="dc-subject-chartfr">
          											<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>		                                            
													</div>
                                                </td>
                                                <td style="width:95%">
          											<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>   <br/>                                             
		                                            <div id="dc-comptimedomain-chartfr"  style="width:100%"></div>
		                                            
		                                        </td>
		                                        </tr>
		                                        <tr>
		                                        <td style="width:95%">
		                                        	<div id="range-chart3fr" width="100%"></div>
		                                        </td>
		                                        </tr>
		                                        </table>
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
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
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
                                        </div>                                  
                                        <!-- pos context (3) rowschart-->
                                        <div class="col-sm-12">
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
                                                <table class='table table-hover' id='dc-table-chartfr' style="width:95%;important!">
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
                                        <!-- datatable with search, paging and sorting -->
                                       <!-- <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Fr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> occurrences.
													</div>
                                                <table class='datatable table table-hover' id='dc-table-chartFr' style="width:95%;important!">
                                                	<thead>
                                                	<tr>
                                                		<th>Date</th>
                                                		<th>Journal</th>
                                                		<th>Domaine</th>
                                                		<th>Extraits</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div> -->
                                        

		  		</div>

		  		



            <!-- statistics pane for neologism details : metadata-->
            <div class="row row-example" id="corpusResultsfr" style="display:none;">
                                        <!-- neologismes rowschart-->
                                        <div class="col-sm-4">
                                            <div class="panel panel-primary" id="neopanel">
                                                <div class="panel-heading">
                                                	Répartition par pays
                        							<button type="button" class="close" data-target="#neopanel" data-dismiss="alert">
                        							<span aria-hidden="true">&times;</span>
                        							<span class="sr-only">Close</span>
                        							</button>
                                                	<div>														
                                                		<div id='moreitems' style="position:absolute !important;right:0;top:0;"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>
														<div id='lessitems' style="position:absolute !important;left:97%;"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span></div>
													</div>
												</div>
                                                <div class="panel-body">
		                                            <div id="dc-neo-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- timeline -->
                                        <div class="col-sm-8">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Evolution temporelle</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-countfr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc-time-chartfr">
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>
		                                            </div>
		                                            <div id="range-chartfr"></div>

                                                </div>
                                            </div>
                                        </div>
                                        <!-- Domaine pie chart -->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Répartition par domaine</div>
                                                <div class="panel-body">
		                                            <div id="dc-subject-chartfr">
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
		                                            <div id="dc-newspaper-chartfr">
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
                                                	<div class='dc-data-count2fr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> articles.
													</div>
                                                <table class='table table-hover' id='dc-table-chartfr'>
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Pays</th>
                                                		<th>Domaine</th>
                                                		<th>Journal</th>
                                                		<th>Date</th>
                                                		<th>Extraits</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		  		</div>

            <!-- statistics pane for neologism details : interactive graphs (bnf)-->
           <div class="row row-example" id="dglfResultsBNFfr" style="display:none;">
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletime">
                                                	Evolution temporelle globale
                                                </a>
                                               <!-- <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Hooray!"></span>-->
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
                                        <!-- timeline -->
                                        <!-- neopos rowchart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary" id="neopanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglepos">
                                                	Répartition par partie du discours
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
                                                	Evolution temporelle par lemme/pos
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
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
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
		                                            <div id="dc-l4forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
                                                	<td>
		                                            <div id="dc-l5forme-chartfr">
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
		                                            <div id="dc-l4lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l5lemma-chartfr">
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
		                                            <div id="dc-l4pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-l5pos-chartfr">
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
                                                <table class='table table-hover' id='dc-table-chartfr' style="width:95%;important!">
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
                                        <!-- datatable with search, paging and sorting -->
                                       <!-- <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Données</div>
                                                <div class="panel-body">
                                                	<div class='dc2-data-count2Fr'>
                                                		<span class='filter-count'></span>
 														 sur <span class='total-count'></span> occurrences.
													</div>
                                                <table class='datatable table table-hover' id='dc-table-chartFr' style="width:95%;important!">
                                                	<thead>
                                                	<tr>
                                                		<th>Date</th>
                                                		<th>Journal</th>
                                                		<th>Domaine</th>
                                                		<th>Extraits</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div> -->
                                        

		  		</div>


        </div>

