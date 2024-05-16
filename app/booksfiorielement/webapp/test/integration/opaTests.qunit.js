sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/booksfiorielement/test/integration/FirstJourney',
		'com/app/booksfiorielement/test/integration/pages/BooksList',
		'com/app/booksfiorielement/test/integration/pages/BooksObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/booksfiorielement') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage
                }
            },
            opaJourney.run
        );
    }
);