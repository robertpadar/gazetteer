<?php

    $executionStartTime = microtime(true) / 1000;
    
    $countryCode = $_REQUEST['temp2'];

    $result = file_get_contents('countryBorders.geo.json');

    $border = json_decode($result,true);
    
    foreach ($border['features'] as $feature) {
        if ($feature["properties"]["iso_a2"] ==  $countryCode) {
            $border = $feature;
            break;
        }
    };

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $border;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>