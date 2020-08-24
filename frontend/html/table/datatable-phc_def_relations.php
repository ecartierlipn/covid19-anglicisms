<?php
session_start();
?>

<script type="text/javascript" charset="utf-8" src="js/table.phc_def_relations.js"/>
	<div class="side-body">
    	<div class="page-title">
        	<span class="title">Paramètres : relations entre lexies (projet PHC)</span>
		</div>
		<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	<strong>Information  :</strong>cette page permet de paramétrer les relations entre lexies utilisés dans les projets PHC.
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
										<th>Identifiant</th>
										<th>Code relation</th>
										<th>Description</th>
										<th>Type relation</th>
										<th>Relation sémantique</th>
										<th>Relation inverse (id)</th>
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
        </div>

