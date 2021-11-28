<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    ini_set('memory_limit', '1024M');

    $executionStartTime = microtime(true);

    $country = $_REQUEST['country'];

    $ch2 = curl_init('http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $country . '&username=pdraco&style=full;');
    curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);

    $geoData = curl_exec($ch2);

    curl_close($ch2);

    $geonames = json_decode($geoData, true);
    ///////////////////////////////////////////////////////////////////

    $ch5 = curl_init('http://api.geonames.org/earthquakesJSON?north=' . $geonames['geonames'][0]['north'] . '&south=' . $geonames['geonames'][0]['south'] . '&east=' . $geonames['geonames'][0]['east'] . '&west=' . $geonames['geonames'][0]['west'] . '&lang=en&username=pdraco&style=full;');
    curl_setopt($ch5, CURLOPT_RETURNTRANSFER, true);

    $localQuakeData = curl_exec($ch5);

    curl_close($ch5);

    $localQuake = json_decode($localQuakeData, true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $localQuake;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>