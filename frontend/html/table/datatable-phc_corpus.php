<?php
session_start();
?>

<script type="text/javascript" charset="utf-8" src="js/table.phc_corpus.js"/>
	<div class="side-body">
    	<div class="page-title">
        	<span class="title">Gestionnaire des corpus (projet PHC)</span>
		</div>
		<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	<strong>Information  :</strong>cette page permet de visualiser les corpus utilisés dans les projets PHC. L'ajout doit être demandé aux administrateurs du site.
        </div>
            <div class="description">
            <!-- datatable -->             
            <div class="row">
            	<div class="col-xs-12">
                	<div class="card">
                    	<div class="card-body">
                            <table class="datatable table" cellspacing="0" id="examplecontext">
								<thead>
									<tr>
										<th>Nom</th>
										<th>Description</th>
										<th>Langue</th>
										<th>Période temporelle</th>
										<th>Types de documents</th>
										<th>Nombre de tokens</th>
										<th>Nombre de formes uniques</th>
										<th>Nombre de documents</th>
										<th>Url d'information</th>
									</tr>
								</thead>
								<tbody>
								
								</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

