<?php

/**
 * Description of rex_api_sked_events
 *
 * @author javanita
 */
class rex_api_sked_events extends rex_api_function {
   protected $published = true;

    public function execute() {
        rex_response::cleanOutputBuffers();
        rex_response::sendContentType('application/json');

        $entries = Events::getEntries(
                rex_request('category', 'string', null)
                );
        print json_encode($entries);
        exit;
    }
}
