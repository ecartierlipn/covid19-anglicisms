<!-- dev version with crossfilter and dc.js libraries to visualize data -->
		
		<script type="text/javascript" charset="utf-8" src="../js/crossfilter.min.js"></script>
		<script type="text/javascript" charset="utf-8" src="../js/dc.min.js"></script>
		<script src="../js/upset.js"></script>
		 <link href='../css/dc.css' rel='stylesheet' type='text/css'>

		<!-- for Venn diagram -->
		<!--<script src="../js/d3.v4.min.js"></script>-->
		<script src="../js/venn.js"></script>
		
<script type="text/javascript" charset="utf-8" src="js/table.phc_morph.js"/>
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

[id^=Venn] g {
	cursor: pointer;
}

 </style>




<div class="side-body">
    <div class="page-title">
        	<span class="title">Gestionnaire des séries (projet PHC)</span>
		</div>

    <div class="row">
    	<div class="col-xs-12">
        	<div class="card">
            	<div class="card-body no-padding">
					<div role="tabpanel">
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Base de données</a></li>
        <li role="presentation"><a href="#stats" aria-controls="stats" role="tab" data-toggle="tab">Statistiques</a></li>
    </ul>
   <!-- Tab panes -->
   <div class="tab-content">
      	<!-- tab 1 : base de données -->
	  	<div role="tabpanel" class="tab-pane active" id="home">
		<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	Cette base contient les formes récupérées dans les corpus TimeStamped JSI web corpus 2014-2019 à partir de SketchEngine (outil Liste de mots) à partit des formants/morphèmes étudiés dans le projet PHC. Pour chaque formant,
        	sont listés les formes lexicales attestées dans le JSI, et les fréquences absolues et relatives dans les trois langues étudiées : Français, Polonais et Tchèque. Nous donnons également les fréquences absolues et relatives
        	dans le corpus correspondant en anglais.<br/>
        	Dans cette table, vous pouvez, pour chaque série de morphèmes :<br/>
        	- pour chaque lexie, <u>obtenir les contextes dans le JSI</u> (ou déclencher une demande de récupération des contextes), par l'outil <i class="fa fa-bar-chart fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i>);<br/>
        	- <u>éditer et supprimer les lexies fautives</u>;<br/>
        	- <u>ajouter une lexie</u> (dans ce cas pour obtenir les informations de fréquence, il faut ensuite faire une demande de récupération de contextes et de calcul des statistiques). <br/>
        	Pour obtenir une synthèse, sélectionnez l'onglet statistiques.<br/>
        	Le bouton "valider" permet de copier les lexies restantes dans la base de description (base lexies dans le menu à gauche).
        </div>
        <button lang="all" type="button" onclick="save_to_borrowings();" id="validateb" class="btn btn-warning" title="En cliquant, les emprunts de cette base seront copiés dans la base des lexies, pour l'étape de description">Valider les emprunts</button>
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
                            <table class="datatable table display" cellspacing="0" id="example">
								<thead>
									<tr>
										<th><b>Filtres</b></th>
									</tr>
									<tr>
										<th>Lexie</th>
										<th>Fréquence <br/>abs. (CZ)</th>
										<th>Fréquence <br/>rel. (CZ)</th>
										<th>Fréquence <br/>abs. (FR)</th>
										<th>Fréquence <br/>rel. (FR)</th>
										<th>Fréquence <br/>abs. (PL)</th>
										<th>Fréquence <br/>rel. (PL)</th>
										<th>Fréquence <br/>abs. (EN)</th>
										<th>Fréquence <br/>rel. (EN)</th>
										<th></th>
										<th></th>
										<th></th>
									</tr>

									<tr>
										<th>Lexie</th>
										<th>Fréquence <br/>abs. (CZ)</th>
										<th>Fréquence <br/>rel. (CZ)</th>
										<th>Fréquence <br/>abs. (FR)</th>
										<th>Fréquence <br/>rel. (FR)</th>
										<th>Fréquence <br/>abs. (PL)</th>
										<th>Fréquence <br/>rel. (PL)</th>
										<th>Fréquence <br/>abs. (EN)</th>
										<th>Fréquence <br/>rel. (EN)</th>
										<th></th>
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
           <div class="row row-example" id="neoResultsfr" style="display:none;overflow:scroll;">
<button type="button"  class="btn btn-light activated" id="fullscreen" onclick="activateFullscreen(document.getElementById('neoResultsfr'));dc.renderAll();" title="Full screen mode"><img src='./images/fullscreen.png' width='30px;float:right;'/></button> <!-- $('button#fullscreen').remove(); -->
<!--<button type="button" id="modalvisu" class="btn btn-info activated"><img src='./images/fullscreen.png' width='30px;float:right;'/><i class="fa fa-window-maximize" aria-hidden="true"/></button>-->

<!--<div type="button"  class="btn btn-light activate" id="fullscreen" title="Full screen mode"><img src='./images/fullscreen.png' style='width:30px;'/></div>-->

                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary" id="timeline">
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
                                        <!-- timeline -->
                                        <!-- neopos rowchart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary"  id="neopanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglepos">
                                                	Répartition par partie du discours / variante
                                                </a>
                                               <button type="button" class="close" data-target="#neopanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="neotimeline">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptime">
                                                	Evolution temporelle par partie du discours / variante
                                                </a>
                                               <button type="button" class="close" data-target="#neotimeline" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptime">
          											<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Réinitialiser</a>   <br/>                                             
		                                            <div id="dc-comptime-chartfr"></div>
		                                            <div id="range-chart2fr"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- composite timeline by language-->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary" id="langpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptimedomain">
                                                	Evolution temporelle par langue
                                                </a>
                                               <button type="button" class="close" data-target="#langpanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="newspanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglenewsp">
                                                	Répartition par journaux
                                                </a>
                                               <button type="button" class="close" data-target="#newspanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="newstimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptimenews">
                                                	Evolution temporelle par journal
                                                </a>
                                               <button type="button" class="close" data-target="#newstimepanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="formespanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleformeg3">
                                                	Contexte (forme)
                                                </a>	
                                               <button type="button" class="close" data-target="#formespanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="lemmespanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleg2">
                                                	Contextes (lemmes)
                                                </a>
                                               <button type="button" class="close" data-target="#lemmespanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                            <div class="panel panel-primary" id="pospanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleposg3">
                                                	Contextes (POS)
                                                </a>	
                                               <button type="button" class="close" data-target="#pospanel" data-dismiss="alert"> <span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
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
                                                <div class="panel-body"  style="height:800px;overflow:scroll;">
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

</div>
	
		<!-- tab 2 - statistiques -->
		<div role="tabpanel" class="tab-pane" id="stats">
			<div class="row">				
<!-- accordion with morphemes-->				
<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="alert alert-info alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    Dans cet onglet, vous pouvez obtenir une synthèse statistique sur la distribution des lexies par morphème et par langue, à partir des données extraites des corpus Timestamped JSI web corpus 2014-2019, corrigées sur le site Néoveille par les linguistes du projet.
    Sélectionnez un onglet, puis cliquez sur "chargez les données".   
  </div>
		  
<!-- repeat the panel for each morphem : dynamically generated from list of morphems in settings.php -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading0">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse0" aria-expanded="false" aria-controls="collapse0">
          binge        </a>
      </h4>
    </div>
    <div id="collapse0" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading0">
      <div class="panel-body">
		<!-- heading -->
        <div class="row">
        					<!-- title -->
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="binge" id="corpusinfoBtn0">Charger les données</a>
                               </div>
                			</div>
                			<!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Vennbinge"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="binge"></div>
                			</div>
                			<div id='table-binge' class="col-sm-12">
                			</div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading1">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse1" aria-expanded="false" aria-controls="collapse1">
          boost        </a>
      </h4>
    </div>
    <div id="collapse1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading1">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="boost" id="corpusinfoBtn1">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Vennboost"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="boost"></div>
                			</div>
                			<div id='table-boost' class="col-sm-12"></div>
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading2">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
          couch        </a>
      </h4>
    </div>
    <div id="collapse2" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading2">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="couch" id="corpusinfoBtn2">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venncouch"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="couch"></div>
                			</div>
                			<div id='table-couch' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading3">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse3" aria-expanded="false" aria-controls="collapse3">
          crowd        </a>
      </h4>
    </div>
    <div id="collapse3" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading3">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="crowd" id="corpusinfoBtn3">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venncrowd"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="crowd"></div>
                			</div>
                			<div id='table-crowd' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading4">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse4" aria-expanded="false" aria-controls="collapse4">
          cyber        </a>
      </h4>
    </div>
    <div id="collapse4" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading4">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="cyber" id="corpusinfoBtn4">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venncyber"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="cyber"></div>
                			</div>
                			<div id='table-cyber' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading5">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse5" aria-expanded="false" aria-controls="collapse5">
          e-        </a>
      </h4>
    </div>
    <div id="collapse5" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading5">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="e-" id="corpusinfoBtn5">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venne-"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="e-"></div>
                			</div>
                			<div id='table-e-' class="col-sm-12"></div>
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading6">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse6" aria-expanded="false" aria-controls="collapse6">
          fake        </a>
      </h4>
    </div>
    <div id="collapse6" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading6">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="fake" id="corpusinfoBtn6">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Vennfake"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="fake"></div>
                			</div>
                			<div id='table-fake' class="col-sm-12"></div>
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading7">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse7" aria-expanded="false" aria-controls="collapse7">
          i-        </a>
      </h4>
    </div>
    <div id="collapse7" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading7">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="i-" id="corpusinfoBtn7">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venni-"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="i-"></div>
                			</div>
                			<div id='table-i-' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading8">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse8" aria-expanded="false" aria-controls="collapse8">
          ing        </a>
      </h4>
    </div>
    <div id="collapse8" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading8">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="ing" id="corpusinfoBtn8">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venning-"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="ing-"></div>
                			</div>
                			<div id='table-ing-' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading9">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse9" aria-expanded="false" aria-controls="collapse9">
          m-        </a>
      </h4>
    </div>
    <div id="collapse9" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading9">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="m-" id="corpusinfoBtn9">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Vennm-"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="m-"></div>
                			</div>
                			<div id='table-m-' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading10">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse10" aria-expanded="false" aria-controls="collapse10">
          street        </a>
      </h4>
    </div>
    <div id="collapse10" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading10">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="street" id="corpusinfoBtn10">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Vennstreet"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="street"></div>
                			</div>
                			<div id='table-street' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading11">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse11" aria-expanded="false" aria-controls="collapse11">
          tourism/tourist        </a>
      </h4>
    </div>
    <div id="collapse11" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading11">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="tourist_tourism" id="corpusinfoBtn11">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venntourist_tourism"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="tourist_tourism"></div>
                			</div>
                			<div class="col-sm-4"><div id="histo_fr_tourist_tourism"></div></div>
                			<div class="col-sm-4"><div id="histo_cz_tourist_tourism"></div></div>
                			<div class="col-sm-4"><div id="histo_pl_tourist_tourism"></div></div>
                			<div id='table-tourist_tourism' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading12">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse12" aria-expanded="false" aria-controls="collapse12">
          troll        </a>
      </h4>
    </div>
    <div id="collapse12" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading12">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="troll" id="corpusinfoBtn12">Charger les données</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-6">
                			<div id="Venntroll"></div>
                			</div>
                			<div class="col-sm-6">
                			<div id="troll"></div>
                			</div>
                			<div id='table-troll' class="col-sm-12"></div>
                			
                </div>
		</div>
      </div>
  </div>
 <!-- end of foreach morphem -->


</div>
				
				
				
			</div> 		
		</div>
   </div>
</div>
				</div>
			</div>
		</div>
	</div>
	
<!-- Modal for Venn diagram-->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
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