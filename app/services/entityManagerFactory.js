(function() {
    'use strict';
    
    var serviceId = 'entityManagerFactory';
    angular.module('app').factory(serviceId, ['config', 'model', emFactory]);

    function emFactory(config, model) {
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        breeze.NamingConvention.camelCase.setAsDefault();

        //--------------------------------------------------------------------------
        //JRB 12/1/2013 Breeze Antiforgery checking support
        //X-XSRF adding token to Breeze ajax request header
        //Configure Breeze ajax reuqest to add __RequestVerificationToken to the header
        //--------------------------------------------------------------------------
        var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
        ajaxAdapter.defaultSettings = {
            headers: {
                '__RequestVerificationToken': config.requestantiforgeryToken
            },
        };
        
        var serviceName = config.remoteServiceName;
        var metadataStore = createMetadataStore();

        var provider = {
            metadataStore: metadataStore,
            newManager: newManager
        };
        
        return provider;
        
        function createMetadataStore() {
            var store = new breeze.MetadataStore();
            model.configureMetadataStore(store);
            return store;
        }

        function newManager() {
            var mgr = new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });
            return mgr;
        }
    }
})();