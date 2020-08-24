<style>
//.frmSearch {border: 1px solid #a8d4b1;background-color: #c6f7d0;margin: 2px 0px;padding:40px;border-radius:4px;}
//#word-list{float:left;list-style:none;max-width:100%;margin-top:-3px;padding:0;position: absolute;} // 
//#word-list li{padding: 10px; background: #f0f0f0; border-bottom: #bbb9b9 1px solid;}
#word-list li:hover{cursor: pointer;}
//input#word{padding: 10px;border: #a8d4b1 1px solid;border-radius:4px;}
</style>
<script type="text/javascript" charset="utf-8" src="js/table.phc_tools.js"></script>

<div class="side-body">
    	<div class="page-title">
        	<span class="title">Outils pour le projet PHC</span>
		</div>
        <div class="description">
			<div class="row">	
  				<div class="alert alert-info alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    Cette page comprend différents outils pour travailler et traiter les données du projet PHC et <u>qui prennent un certain temps</u>. 
    <br/>Cliquez sur un en-tête pour le détail des fonctionnalités.   
  </div>
						
				<!-- accordion with tools-->				
				<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
		  
				<!-- repeat the panel for each morphem : dynamically generated from list of morphems in settings.php -->
  				<div class="panel panel-default">
    		<div class="panel-heading" role="tab" id="heading0">
      			<h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse0" aria-expanded="false" aria-controls="collapse0">
          Ajout de lexies en masse</a>
      </h4>
    		</div>
    		<div id="collapse0" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading0">
     			 <div class="panel-body">
     			 	<div class="row">
     			 		<div class="col-sm-12">
     			 		
     			 		Cette fonctionnalité vous permet de charger une liste de mots (un par ligne dans un fichier texte) pour récupérer leur fréquence dans le ou les corpus Timestamped JSI web corpus 2014-2019, ainsi que les contextes. Vous pouvez fournir des formes lexicales 
     			 		spécifiques (exemple : <i>arriverait</i>, <i>arriva</i>) ou bien, si vous souhaitez obtenir l'ensemble des réalisations flexionnelles et/ou casuelles, le radical mininmal (exemple : <i>arriv</i>). Ce dernier choix pourra vous obliger à faire un tri ensuite dans les 
     			 		résultats (par exemple, avec <i>arriv</i>, vous obtiendrez également les formes nominales (<i>arrivée</i>, <i>arrivage</i>). Vous devez également choisir la série de formes à laquelle sera rattachée la liste des mots. 
     			 		Vous pouvez choisir différents traitements : récupération des formes lexicales attestées (sans stockage), récupération des formes lexicales et stockage, récupération des formes lexicales et des contextes (avec stockage).
     			 		 Le temps de traitement peut être long, selon le nombre de mots chargés.
     			 		
     			 		</div>
     			 	</div>
     			 	<div class="row">
						<form class="form-inline" id="wordload">						
  							<div class="form-group">
								<div class="col-sm-3">
    								<input type="file" id="fileupload" hidden  class="form-control" required="required">
 								</div>
  							</div>
  							<div class="form-group">
    							<div class="col-sm-3">
									<select name="lang" id="lang"  class="form-control" required="required">
										<option value="" disabled selected hidden>Choisissez une langue</option>									
      									<option value="all">Toutes les langues</option>
      									<option value="fr">Français</option>
     									<option value="pl">Polonais</option>
      									<option value="cz">Tchèque</option>
    								</select>
  								</div>
  							</div>
  							<div class="form-group">
    							<div class="col-sm-3">
									<select name="serie" id="serie"  class="form-control" required="required">
										<option value="" disabled selected hidden>Choisissez une série</option>									
										<option value="binge">binge</option>
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
    							</div>
  							</div>
  							<div class="form-group">
    							<div class="col-sm-3">
									<select name="process" id="process"  class="form-control" required="required">
										<option value="" disabled selected hidden>Choisissez un traitement</option>									
										<option value="view">Récupérer les formes lexicales</option>
										<option value="viewstore" >Récupérer et stocker les formes lexicales</option>
										<option value="viewstorecontext" >Récupérer et stocker les formes lexicales et les contextes</option>
    								</select>
    							</div>
  							</div>

  							<div class="form-group">
  								<button class="btn btn-info" id="wordloadok">Lancez l'opération</button>
  							</div>
						</form>
					</div>
                		<!-- tools results -->
                		<div class="col-sm-12">
                			<div id="restools0"></div>
                		</div>                			
                	<div>
                </div>
		</div>
    </div>
 		 </div>
  				<div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading1">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse1" aria-expanded="false" aria-controls="collapse1">
          Relations potentielles entre lexies (visualisation et sauvegarde)</a>
      </h4>
    </div>
    <div id="collapse1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading1">
      <div class="panel-body">

				
                <div class="row">
		                <!-- heading -->
                            <div class="col-sm-12">
                               <div class="title">
                               <div class="row">
                               <div class="col-span-12">
                               Cette fonctionnalité vous permet de détecter automatiquement des relations formelles entre les lexies de la base. Par exemple, pour <i>watching</i>, des relations potentielles seront trouvées
                               avec <i>binge-watching</i>, <i>street-watching</i>, etc. avec une relation de type <i>TBD (to be determined)</i>, la relation exacte pouvant être explicitée dans la zone prévue à cet effet dans le gestionnaire
                               des lexies. Il est ensuite possible d'ajouter les relations dans la base de données en sélectionnant la ou les lignes et en cliquant sur le bouton "sauvegarder".
                               </div>
                               	</div>
                               	<div class="form-inline">
                               	<form autocomplete="off">
    							<div class="col-sm-3">	
                                 <input class="form-control" style="width:100%;" type="text" id="word" placeholder="Saisissez un mot ou une base lexicale" autocomplete="off"/>
                                 <div id="suggestion-box"></div>
                                 </div>
                               	
                               	<div class="col-sm-3">
                               	<select name="wordlang" id="wordlang"  class="form-control" required="required"  style="width:100%;">
										<option value="" disabled selected hidden>Choisissez une langue</option>									
      									<option value="0">Toutes les langues</option>
      									<option value="1">Français</option>
     									<option value="2">Polonais</option>
      									<option value="3">Tchèque</option>
    								</select>
    							</div>
    							<div class="col-sm-3">	
                                 <a class="btn btn-info" id="toolsBtn1">Chercher les lexies en relation (de forme)</a>
                                 <a class="btn btn-info" id="toolsBtn2">Sauvegarder les lexies en relation (de forme)</a>
                                 </div>
                                 </form>
                                 </div>
                               </div>
                			</div>
                <!-- tools results -->
                			<div class="col-sm-12">
                			<div id="restools1">
                			
                			</div>
                			</div>
                </div>
		</div>
      </div>
  </div>
 				<!-- end of foreach morphem -->


				</div>
			</div> 	
        </div>
</div>