	<!-- dev version with crossfilter and dc.js libraries to visualize data -->
	<script type="text/javascript" charset="utf-8" src="../js/crossfilter.min.js"></script>
	<script type="text/javascript" charset="utf-8" src="../js/dc.min.js"></script>
	<!-- incompatible with loading of Datatables defined for Editor -->
	<!--<script type="text/javascript" charset="utf-8" src="../js/dc-tableview-light-bs.js"></script>-->
	<!--<script type="text/javascript" charset="utf-8" src="../js/dc.datatables.js"></script>-->
	
		

		<script src="../js/upset.js"></script>
		 <link href='../css/dc.css' rel='stylesheet' type='text/css'>

		<!-- for Venn diagram -->
		<!--<script src="../js/d3.v4.min.js"></script>-->
		<script src="../js/venn.js"></script>
		
<script type="text/javascript" charset="utf-8" src="js/table.iate_concepts.js"/>

<style>


.collapsed {
    color: #696969 !important;
    background-color: #DCDCDC !important;
    border-color:  #DCDCDC !important;
}


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

[id$=_sort] {
	cursor: pointer;
}

 </style>




<div class="side-body">
    <div class="page-title">
        	<span class="title">IATE Concepts</span>
		</div>

    <div class="row">
    	<div class="col-xs-12">
        	<div class="card">
            	<div class="card-body no-padding">
					<div role="tabpanel">
    <!-- Nav tabs -->
    <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Database</a></li>
        <li role="presentation"><a href="#stats" aria-controls="stats" role="tab" data-toggle="tab">Statistics</a></li>
    </ul>
   <!-- Tab panes -->
   <div class="tab-content">
      	<!-- tab 1 : base de données -->
	  	<div role="tabpanel" class="tab-pane active" id="home">
		<div class="alert alert-info alert-dismissible" role="alert">
        	<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        	The table contains all covid-19 related concepts from the IATE database (snapshot July 2020). For each concept, you have the concept id, the English lexicalizations and the English Definition.<br/>
        	For every concept, you can browse and edit additional information (icons on the right of each row, from left to right): <br/>
- <i title="Concept Details" class="fa fa-info-circle fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i> : access all information for the given concept (domains, related concepts, lexicalizations); you can also access the same information (more complete) from the link on the concept id column on each row;<br/>
- <i title="Show / Edit Lexemes" class="fa fa-plus-circle fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i> : access and edit all lexemes linked to this concept for the following languages<br/>
- <i title="Show / Edit Concept Relations" class="fa fa-sitemap fa-lg green" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i> : access and edit all related concepts to the given concept;<br/>
- <i title="Search in JSI corpora and analyze" class="fa fa-bar-chart fa-lg" aria-hidden="true" style="color:#1525A8;cursor: pointer;"></i> : access to contexts retrieved from the JSI Timestamped corpora for the given concept (ie all linked lexicalizations) and explore the results; <br/>
You can also filter and sort on every column, add, edit and delete concepts (not recommended at the moment). 
        </div>
<!--        <button lang="all" type="button" onclick="save_to_borrowings();" id="validateb" class="btn btn-warning" title="En cliquant, les emprunts de cette base seront copiés dans la base des lexies, pour l'étape de description">Valider les emprunts</button>-->
        <div class="description">
            <!-- datatable -->             
            <div class="row">
            	<div class="col-xs-12">
                	<div class="card">
                    	<div class="card-body">
                            <table class="datatable table display" cellspacing="0" id="example">
								<thead>
									<tr>
										<th><b>Filters</b></th>
									</tr>
									<tr>
										<th>Concept id</th>
										<th>English lexicalizations</th>
										<th>English Definition</th>
										<th></th><!-- lexicalizations-->
										<th></th><!-- related concepts-->
										<th></th><!-- domains-->
										<th></th><!-- contexts visual-->
									</tr>

									<tr>
										<th>Concept id</th>
										<th>English lexicalizations</th>
										<th>English Definition</th>
										<th></th><!-- lexicalizations-->
										<th></th><!-- related concepts-->
										<th></th><!-- domains-->
										<th></th><!-- contexts visual-->
									</tr>
								</thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- statistics pane for neologism details : contexts (neoveille)-->
           <div class="row row-example" id="neoResultsfr" style="display:none;overflow:scroll;">



<nav class="navbar navbar-expand-lg navbar-light bg-light" id="neoresultspanel"  style="padding-left:10px;">
	<form class="form-inline">
		  		<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#timepanel" aria-expanded="false">
    				Temporal evolution
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopospanel0" aria-expanded="false">
    				Token / part of Speech
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopostimepanel" aria-expanded="false">
    				Token / part of Speech evolution
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#languagepanel" aria-expanded="false">
    				Language
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#languagetimepanel" aria-expanded="false">
    				Language Evolution
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#countrypanel" aria-expanded="false">
    				Country
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#countrytimepanel" aria-expanded="false">
    				Country Evolution
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#journalpanel" aria-expanded="false">
    				Source
  				</button>
  				<button class="btn btn btn-info" type="button" data-toggle="collapse" data-target="#journaltimepanel" aria-expanded="false">
    				Source Evolution
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neoformpanel" aria-expanded="false">
    				Token
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neolemmapanel" aria-expanded="false">
    				Lemma
  				</button>
  				<button class="btn btn-info" type="button" data-toggle="collapse" data-target="#neopospanel" aria-expanded="false">
    				Part of speech
  				</button>
</form>
</nav>

<!-- graphs -->
                                        <!-- timeline -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="timepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggletime">
                                                	Global temporal evolution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="toggletime">
                                                	<div class='dc-data-countfr'>
                                                		<span class='filter-count'></span>
 														 on <span class='total-count'></span> articles.
													</div>
		                                            <div id="dc-time-chartfr">
		                                            </div>
		                                            <div id="range-chartfr"></div>
          												<span class='reset' style='visibility: hidden;'>Filtre(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a>

                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart lemme/pos-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="neopospanel0">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglepos">
                                                	Token/pos distribution
                                                </a>
												</div>
                                                <div class="panel-body collapse in" id="togglepos">
		                                            <div id="dc-neo-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by lemme / pos -->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="neopostimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptime">
                                                	Token / Pos evolution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptime">
          											<span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a>   <br/>                                             
		                                            <div id="dc-comptime-chartfr"></div>
		                                            <!--<div id="range-chart2fr"></div>-->
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart language-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="languagepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggledom">
                                                	Language distribution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="toggledom">
		                                            <div id="dc-subject-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
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
                                                	Language evolution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptimedomain">
          											<span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a>   <br/>                                             
		                                            <div id="dc-comptimedomain-chartfr"></div>
		                                            <!--<div id="range-chart3fr"></div>-->
                                                </div>
                                            </div>
                                        </div>

                                        <!-- country rowschart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="countrypanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecountry">
                                                	Country distribution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecountry">
		                                            <div id="dc-country-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by country-->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="countrytimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecompcountry">
                                                	Country evolution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecompcountry">
          											<span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a>   <br/>                                             
		                                            <div id="dc-comptimecountry-chartfr"></div>
		                                            <!--<div id="range-chart7fr"></div>-->
                                                </div>
                                            </div>
                                        </div>
                                        <!-- journaux rowschart-->
                                        <div class="col-sm-2">
                                            <div class="panel panel-primary collapse in" id="journalpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglenewsp">
                                                	Source distribution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglenewsp">
		                                            <div id="dc-newspaper-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- composite timeline by newspaper-->
                                        <div class="col-sm-10">
                                            <div class="panel panel-primary collapse in" id="journaltimepanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglecomptimenews">
                                                	Source evolution
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglecomptimenews">
          											<span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               								<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a>   <br/>                                             
		                                            <div id="dc-comptimenews-chartfr"></div>
		                                            <!--<div id="range-chart4fr"></div>-->
                                                </div>
                                            </div>
                                        </div>
                                        <!-- forme context (3) rowschart-->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary collapse in" id="neoformpanel">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleformeg3">
                                                	Context (token)
                                                </a>	
                                                </div>
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleformeg3">
                                                <table>
                                                <tr>
                                                	<td>
		                                            <div id="dc-l3forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l2forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-l1forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-coreforme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>              
		                                            <td>
		                                            <div id="dc-r1forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-r2forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-r3forme-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
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
                                                	Contexts (lemmas)
                                                </a>
                                                </div>
                                                
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleg2">
                                                <table border="0">
                                                <tr>
                                                	<td>
		                                            <div id="dc-l3lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>                                                	
                                                	</td>
                                                	<td>
		                                            <div id="dc-l2lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l1lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
                                                	<td>
		                                            <div id="dc-corelemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
                                                	<td>
		                                            <div id="dc-r1lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-r2lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-r3lemma-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
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
                                                	Contexts (POS)
                                                </a>	
                                                </div>
                                                <div class="panel-body collapse in" style="margin: 0px;padding:0px" id="toggleposg3">
                                                <table>
                                                <tr>
                                                	<td>
		                                            <div id="dc-l3pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-l2pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-l1pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-corepos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            
		                                            <td>
		                                            <div id="dc-r1pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
		                                            </td>
		                                            <td>
		                                            <div id="dc-r2pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>		                                            
		                                            </td>
		                                            <td>
		                                            <div id="dc-r3pos-chartfr">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
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
                                                <div class="panel-heading">Data</div>
                                                <div class="panel-body">
												<!--<div="row">-->
													<div class="col-sm-4">
												    <div class='dc-data-count2fr'>
                                                		<span class='filter-count'></span>
 														 on <span class='total-count'></span> contexts.
													</div>
												</div>
													<div class="col-sm-4">
												<label>Show 
												<select id="table_length">
													<option value="10">10</option>
													<option value="25" selected>25</option>
													<option value="50">50</option>
													<option value="100">100</option>
												</select>
												entries </label>
												</div>
													<div class="col-sm-4">
        <label>Showing <span id="begin"></span>-<span id="end"></span> of <span id="size"></span> <span id="totalsize"></span></label>
        <input id="previous" class="btn" type="Button" value="Previous" />
        <input id="next" class="btn" type="button" value="Next"/>
        										</div>
												</div>
                                                <table class='table table-hover table-bordered' id='dc-table-chartfr'>

                                                	<thead>
                                                	<tr class='header'>
                                                		<th id="dtg_sort">Date</th>
                                                		<th id="lang_sort">Language</th>
                                                		<th id="country_sort">Country</th>
                                                		<th id="source_sort">Source</th>
                                                		<th>Context</th>
                                                	</tr></thead>
                                                </table>
                                                </div>
                                            </div>
                                        </div>

		</div>

        </div>

<!--</div>-->
	
		<!-- tab 2 - statistiques -->
		<div role="tabpanel" class="tab-pane" id="stats">
			<div class="row">				
<!-- accordion with morphemes-->				
<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="alert alert-info alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    Here you can obtain a synthesis on the conceptual network (relations between concepts) and lexemes (lexemes - languages - concepts) applied to IATE covid-19 terminology.   
  </div>
		  
<!-- repeat the panel for each morphem : dynamically generated from list of morphems in settings.php -->
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading0">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse0" aria-expanded="false" aria-controls="collapse0">
          Concepts - relations        </a>
      </h4>
    </div>
    <div id="collapse0" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading0">
      <div class="panel-body">
		<!-- heading -->
        <div class="row">
        					<!-- title -->
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="binge" id="concept_rels">Load data</a>
                               </div>
                			</div>
                			<!-- data graphs -->
                			<div class="col-sm-12">
           						<div class="row row-example" id="concepts_rel_stats" style="display:none;overflow:scroll;">
                                        <!-- rowchart concept source-->
                                        <div class="col-sm-4">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleconcept1">
                                                	Concept source
                                                </a>
												</div>
                                                <div class="panel-body collapse in" id="toggleconcept1">
		                                            <div id="dc-concept_source-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart concept target-->
                                        <div class="col-sm-4">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleconceptt">
                                                	Concept target
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="toggleconceptt">
		                                            <div id="dc-concept_target-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- relation type rowschart-->
                                        <div class="col-sm-4">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglerelation">
                                                	Relation type
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglerelation">
		                                            <div id="dc-relation-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Data</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-count2'>
                                                		<span class='filter-count'></span>
 														 on <span class='total-count'></span> entries.
													</div>
												<!--<table class="table table-hover dc-data-table" id='dc-table-chartfr'/>-->
                                                <table class='table table-hover table-bordered' id='dc-table-chart'>
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Concept source</th>
                                                		<th>Concept target</th>
                                                		<th>Relation type</th>
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
  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading1">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse1" aria-expanded="false" aria-controls="collapse1">
          Concepts - domains        </a>
      </h4>
    </div>
    <div id="collapse1" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading1">
      <div class="panel-body">
		<!-- heading -->
        <div class="row">
        					<!-- title -->
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="binge" id="concept_domains">Load data</a>
                               </div>
                			</div>
                			<!-- data graphs -->
                			<div class="col-sm-12">
           						<div class="row row-example" id="concepts_domains" style="display:none;overflow:scroll;">
                                        <!-- rowchart concept source-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleconcept2">
                                                	Concepts
                                                </a>
												</div>
                                                <div class="panel-body collapse in" id="toggleconcept2">
		                                            <div id="dc-concepts-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart domains target-->
                                        <div class="col-sm-6">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggledomains">
                                                	Domains
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="toggledomains">
		                                            <div id="dc-domains-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Data</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-count2'>
                                                		<span class='filter-count'></span>
 														 on <span class='total-count'></span> entries.
													</div>
												<!--<table class="table table-hover dc-data-table" id='dc-table-chartfr'/>-->
                                                <table class='table table-hover table-bordered' id='dc-tabledomain-chart'>
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Concept</th>
                                                		<th>Domain</th>
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

  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="heading2">
      <h4 class="panel-title">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse2" aria-expanded="false" aria-controls="collapse2">
          Concepts - Lexemes</a>
      </h4>
    </div>
    <div id="collapse2" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading2">
      <div class="panel-body">

				<!-- heading -->
                <div class="row">
                            <div class="col-sm-12">
                               <div class="title">
                                 <a class="btn btn-info" language="couch" id="concept_lexemes">Load data</a>
                               </div>
                			</div>
                <!-- data diagrams -->
                			<div class="col-sm-12">
           						<div class="row row-example" id="concepts_lexemes" style="display:none;overflow:scroll;">
                                        <!-- rowchart concept source-->
                                        <div class="col-sm-3">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#toggleconcept3">
                                                	Concepts
                                                </a>
												</div>
                                                <div class="panel-body collapse in" id="toggleconcept3">
		                                            <div id="dc-conceptsen-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart language target-->
                                        <div class="col-sm-3">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglelanguage">
                                                	Languages
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglelanguage">
		                                            <div id="dc-language-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart lexemes target-->
                                        <div class="col-sm-3">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglelexeme">
                                                	Lexemes
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglelexeme">
		                                            <div id="dc-lexeme-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- rowchart lexemes types target-->
                                        <div class="col-sm-3">
                                            <div class="panel panel-primary collapse in">
                                                <div class="panel-heading">
                                                <a data-toggle="collapse" data-target="#togglelexemetype">
                                                	Lexeme Types
                                                </a>
                                                </div>
                                                <div class="panel-body collapse in" id="togglelexemetype">
		                                            <div id="dc-lexeme_type-chart">
          												<b><span class='reset' style='visibility: hidden;'>Filter(s): <span class='filter'></span></span> 
		               									<a class='reset' href='javascript:dc.filterAll();dc.redrawAll();' style='visibility: hidden;'>Reset</a></b>		                                            
		                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- datatables -->
                                        <div class="col-sm-12">
                                            <div class="panel panel-primary">
                                                <div class="panel-heading">Data</div>
                                                <div class="panel-body">
                                                	<div class='dc-data-count2'>
                                                		<span class='filter-count'></span>
 														 on <span class='total-count'></span> entries.
													</div>
												<!--<table class="table table-hover dc-data-table" id='dc-table-chartfr'/>-->
                                                <table class='table table-hover table-bordered' id='dc-tablelexeme-chart'>
                                                	<thead>
                                                	<tr class='header'>
                                                		<th>Concept</th>
                                                		<th>Language</th>
                                                		<th>Lexeme</th>
                                                		<th>Type</th>
                                                		<th>Context</th>
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