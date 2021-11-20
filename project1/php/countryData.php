<?php 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $url = json_decode(file_get_contents('countryBorders.geo.json'), true);	

    $country = [];

    foreach ($url['features'] as $feature) {

        // Create a temporary variable to store data
        $temp = null;
        $temp['code'] = $feature["properties"]['iso_a2'];
        $temp['name'] = $feature["properties"]['name'];
         array_push($country, $temp); 
    };

    // Sort in alphabetic order
    usort($country, function ($item1, $item2) {

        // Compare each name against one another and order alphabetically
         return $item1['name'] <=> $item2['name'];
    });

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);


?>