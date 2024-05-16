sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'com.app.booksfiorielement',
            componentId: 'BooksObjectPage',
            contextPath: '/Books'
        },
        CustomPageDefinitions
    );
});