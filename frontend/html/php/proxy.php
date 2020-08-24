<?php

// Website url to open
$url = 'https://tal.lipn.univ-paris13.fr/solr8/covid19/select?' . http_build_query($_GET);

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => $url,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "GET",
));

$resp = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);
if ($resp){echo $resp;}
else {echo $err;}

?>