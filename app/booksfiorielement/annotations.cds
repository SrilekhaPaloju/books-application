using CatalogService as service from '../../srv/cat-service';

annotate service.Books with @(UI: {
    SelectionFields  : [
        AuthorName,
        title
    ],
    LineItem         : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: AuthorName
        },
        {
            $Type: 'UI.DataField',
            Value: title
        },
        {
            $Type: 'UI.DataField',
            Value: Stock
        },
        {
            $Type: 'UI.DataField',
            Value: AuthorNumber
        }
    ],

    FieldGroup #Books: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'AuthorName',
                Value: AuthorName
            },
            {
                $Type: 'UI.DataField',
                Label: 'title',
                Value: title
            },
            {
                $Type: 'UI.DataField',
                Label: 'Stock',
                Value: Stock
            },
            {
                $Type: 'UI.DataField',
                Label: 'AuthorNumber',
                Value: AuthorNumber
            },

        ]

    },
});

annotate service.Address with @(UI.FieldGroup #address:{
    $Type: 'UI.FieldGroupType',
    Data : [
        {
            $Type: 'UI.DataField',
            Label: 'City',
            Value: city
        },
        {
            $Type: 'UI.DataField',
            Label: 'Address',
            Value: addresses
        },
        {
            $Type: 'UI.DataField',
            Label: 'Street',
            Value: street
        },
        {
            $Type: 'UI.DataField',
            Label: 'Landmark',
            Value: landmark
        },
        {
            $Type: 'UI.DataField',
            Label: 'Pincode',
            Value: pincode
        }
    ]
});

annotate service.Bookdetails with @(UI.FieldGroup #Bookdetails:{
    $Type: 'UI.FieldGroupType',
    Data : [
        {
            $Type: 'UI.DataField',
            Label: 'PageCount',
            Value: PageCount
        },
        {
            $Type: 'UI.DataField',
            Label: 'PublishedOn',
            Value: PublishedOn
        },
        {
            $Type: 'UI.DataField',
            Label: 'Genre',
            Value: genre
        },
        {
            $Type: 'UI.DataField',
            Label: 'Language',
            Value: language
        },
    ]
});

annotate service.Books with @(
    UI.Facets: [
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneralInformationFacet',
        Label : 'General Information',
        Target: '@UI.FieldGroup#Books'
    },
    {
        $Type : 'UI.ReferenceFacet',
        ID    : 'AddressInformationFacet',
        Label : 'Address Details',
        Target: 'address/@UI.FieldGroup#address'
    },
{
    $Type : 'UI.ReferenceFacet',
    ID    : 'BookdetailsInformationFacet',
    Label : 'Bookdetails',
    Target: 'bookdetails/@UI.FieldGroup#Bookdetails'
}
]);
