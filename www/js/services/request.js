// PRODUCTION CODE: ---------------------------------------------------- (use it to fetch JSON data from your server-side code, after you implement it)

   var constants = require('config/constants');
        

            function makeRequest(path, success, error) {
                
                    

                    $$.ajax({
                            url: path,
                            success : success,
                            error: function(xhr) {
                                error(xhr);
                            },
                            timeout: constants.server_api_request_timeout
                    });
                
            }

            function makePost(path, data, success, error) {

                $$.post(path, data, success, error);
              

            }

module.exports = {

    makeRequest : makeRequest,
    makePost : makePost
}