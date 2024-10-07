<?php
$languages = array();
if (_POST["english"] == "True") {
    array_push($languages, "english");
}
php>

So you speak <?php 
foreach ($languages as $lang)
{
    echo $lang . " and ";
}
?>
