
<script type="text/javascript" charset="utf-8" src="js/table.dico-pref.js"></script>

	<div class="side-body">
    	<div class="page-title">
        	<span class="title">Gestionnaire du dictionnaire des préfixes</span>
		</div>
		<div class="alert alert-warning alert-dismissible" role="alert">
           <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
           <strong> Attention! </strong>Cette interface permet de visualiser le dictionnaire des préfixes. Les mots contenant les préfixes explicités ici seront automatiquement reconnus par le système (dans la forme avec tiret, la forme sans tiret pouvant être ambigüe). Vous pouvez éditer ces données si vous considérez intéressant d'ajouter de nouveaux préfixes, d'en supprimer ou d'en éditer certaines.            
        </div>

        <div class="description">
		  <!-- filtres colonnes -->
			<div id="info">
				<table width="99%"><tr><td colspan="3"><h5>Filtres</h5></td></tr>
					<tr><td id="example_lexie"></td><td id="example_morph"></td><td id="example_date"></td></tr>
					<tr><td colspan="3"></td></tr>
				</table>  
            </div>
            <div class="row">
            	<div class="col-xs-12">
                	<div class="card">
                    	<div class="card-body">
                            <table class="datatable table" cellspacing="0" id="example">
								<thead>
									<tr>
										<th>Préfixe</th>
										<th>Langue</th>
										<th>Sens et autres informations</th>
										<th></th>
										<th></th>
									</tr>
								</thead>
								<tfoot>
									<tr>
										<th>Préfixe</th>
										<th>Langue</th>
										<th>Sens et autres informations</th>
										<th></th>
										<th></th>
									</tr>
								</tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>